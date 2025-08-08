import { useState, useEffect, useRef, useContext } from "react";
import type { CitiesType } from "../types";
import useDebounce from "../hooks/useDebounce";
import "../components/styles/searchBarStyles.css"
import { supabase } from "../hooks/getCityListData";
import useBreakpoint from "../hooks/useBreakpoint";
import { DarkModeContext, type DarkModeContextType } from "../context/DarkModeContext";
import { SearchQueryContext, type SearchQueryContextType } from "../context/SearchQueryContext";
import { useFlagCodes } from "../hooks/useFlagCodes";
import { getRegionFullName } from "../hooks/getFullRegionName";

interface SearchBarProps {
    onSelect: (cities: CitiesType) => void
}

const SearchBar = ({ onSelect }: SearchBarProps) => {
    const { searchQuery, setSearchQuery } = useContext(SearchQueryContext) as SearchQueryContextType
    const { darkMode } = useContext(DarkModeContext) as DarkModeContextType;
    const codesList = useFlagCodes()

    const [results, setResults] = useState<CitiesType[]>([])
    const [error, setError] = useState<string | null>(null)
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
    const [selectedCity, setSelectedCity] = useState<CitiesType | null>(null)

    const inputRef = useRef<HTMLInputElement>(null);
    const resultRefs = useRef<(HTMLLIElement | null)[]>([]);

    const debouncedQuery = useDebounce(searchQuery, 200)
    const currentBreakpoint = useBreakpoint()

    useEffect(() => {
        if (searchQuery.length === 0) {
            setResults([]);
            setSelectedCity(null);
            return;
        }

        const fetchResults = async () => {
            setError(null);

            const { data, error } = await supabase
                .from('WorldCities')
                .select('*')
                .ilike('ascii_name', `${searchQuery}%`)
                .limit(5)
                .order('ascii_name', { ascending: true });

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
        setSelectedCity(item)
        onSelect(item)
        setSearchQuery(item.ascii_name)
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
            setSearchQuery('')
            setResults([])
            setSelectedCity(null)
        }
    };

    const handleFocus = () => {
        if (inputRef.current) {
            inputRef.current.select()
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
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setSelectedCity(null); }}
                    onKeyDown={handleKeyDown}
                    ref={inputRef}
                    onFocus={handleFocus}
                    className='search-input'
                />
            </label>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {(!selectedCity || (!selectedCity && !searchQuery)) &&
                <ul className="search-results" style={{ border: results.length !== 0 ? '2px solid #ccc' : '' }}>
                    {results.map((item, index) => (
                        item && <li
                            key={item.geoname_id}
                            onClick={() => handleSelect(item)}
                            className={`result-item ${highlightedIndex === index ? 'highlighted' : ''}`}
                            //@ts-ignore
                            ref={(el) => (resultRefs.current[index] = el)}
                        >
                            {item.country_name_en === 'United States' && <>{item.ascii_name} - {getRegionFullName(codesList, item.admin1_code, item.country_name_en)} - {item.country_name_en}</>}
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