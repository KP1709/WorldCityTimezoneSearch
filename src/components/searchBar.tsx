import { useState, useEffect, useRef, useContext } from "react";
import type { CitiesType } from "../types";
import useDebounce from "../hooks/useDebounce";
import "../components/styles/searchBarStyles.css"
import { supabase } from "../hooks/getCityListData";
import useBreakpoint from "../hooks/useBreakpoint";
import { DarkModeContext, type DarkModeContextType } from "../context/DarkModeContext";


interface SearchBarProps {
    onSelect: (cities: CitiesType) => void
}

const SearchBar = ({ onSelect }: SearchBarProps) => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<CitiesType[]>([])
    const [selected, setSelected] = useState<CitiesType | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
    const { darkMode } = useContext(DarkModeContext) as DarkModeContextType;

    const inputRef = useRef<HTMLInputElement>(null);
    const resultRefs = useRef<(HTMLLIElement | null)[]>([]);

    const debouncedQuery = useDebounce(query, 200)
    const currentBreakpoint = useBreakpoint()

    useEffect(() => {
        if (query.length === 0) {
            setResults([]);
            setSelected(null);
            return;
        }

        const fetchResults = async () => {
            setError(null);

            const { data, error } = await supabase
                .from('WorldCities')
                .select('*')
                .ilike('ascii_name', `${query}%`)
                .limit(5);

            if (error) {
                setError(error.message)
                setResults([]);
            }
            else {
                setResults(data || [])
            }
        };

        fetchResults()
    }, [debouncedQuery]);

    const handleSelect = (item: CitiesType) => {
        setSelected(item)
        onSelect(item)
        setQuery(item.ascii_name)
        setHighlightedIndex(null)
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (results.length === 0) return

        if (e.key === 'ArrowDown') {
            setHighlightedIndex((prevIndex) => (prevIndex === null ? 0 : Math.min(prevIndex + 1, results.length - 1)))
        }
        else if (e.key === 'ArrowUp') {
            setHighlightedIndex((prevIndex) => (prevIndex === null ? results.length - 1 : Math.max(prevIndex - 1, 0)))
        }
        else if (e.key === 'Enter' && highlightedIndex !== null) {
            handleSelect(results[highlightedIndex])
        }
        else if (e.key === 'Escape') {
            setQuery('')
            setResults([])
            setSelected(null)
        }
    };

    return (
        <div id='search-bar' className='search-container' style={{ width: currentBreakpoint <= 500 ? '75%' : '300px' }}>

            <label htmlFor="worldCitySearch" className={darkMode ? 'search-label-dark' : ''}>
                World City Search
                <input
                    id="worldCitySearch"
                    type="search"
                    placeholder="Search Places"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
                    onKeyDown={handleKeyDown}
                    ref={inputRef}
                    className='search-input'
                />
            </label>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {(!selected || (!selected && !query)) &&
                <ul className="search-results" style={{ border: results.length !== 0 ? '2px solid #ccc' : '' }}>
                    {results.map((item, index) => (
                        <li
                            key={item.geoname_id}
                            onClick={() => handleSelect(item)}
                            className={`result-item ${highlightedIndex === index ? 'highlighted' : ''}`}
                            //@ts-ignore
                            ref={(el) => (resultRefs.current[index] = el)}
                        >
                            {item.country_name_en === 'United States' && <>{item.ascii_name} - {item.admin1_code} - {item.country_name_en}</>}
                            {item.country_name_en !== 'United States' && <>{item.ascii_name} - {item.country_name_en}</>}
                        </li>
                    ))}
                    {results.length > 0 && (
                        <li className="attribution">
                            <span>City data provided by <a href="https://simplemaps.com/data/world-cities">SimpleMaps.com</a>,</span>
                            <span>licensed under CC BY 4.0.</span>
                            <span>&#9888; Not all cities will be searchable</span>
                        </li>
                    )}
                </ul>}
        </div>
    );
};

export default SearchBar;