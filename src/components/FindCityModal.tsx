import { useContext, useEffect, useState } from 'react';
import './styles/globalModalStyles.css'
import './styles/findCityModalStyles.css'
import type { CitiesType } from '../types';
import { SearchQueryContext, type SearchQueryContextType } from '../context/SearchQueryContext';
import { getCountries } from '../hooks/findCity/getCountries';
import { getCountryRegions } from '../hooks/findCity/getCountryRegions';
import { getCountryRegionCities } from '../hooks/findCity/getCountryRegionsCities';
import { useSelectedCity } from '../hooks/findCity/useSelectedCity';
import { useFlagCodes } from '../hooks/useFlagCodes';
import { getRegionFullName } from '../hooks/getFullRegionName';

type CountryPaneType = {
    setSelectedCountry: (value: string) => void
}

type CountryRegionsPaneType = {
    selectedCountry: string,
    setSelectedRegion: (value: string) => void
}

type CountryRegionCitiesPaneType = {
    selectedCountry: string
    selectedRegion: string
    setSelectedCityName: (value: string) => void
    selectedCityName: string | null
}

const CountryPane = ({ setSelectedCountry }: CountryPaneType) => {
    const { countries, countriesError, countriesLoading } = getCountries()

    if (countriesError) {
        return (
            <p className='search-modal modal-message'>Error in fetching countries</p>
        )
    }

    if (countriesLoading) {
        return (
            <p className='search-modal modal-message'>Loading countries...</p>
        )
    }

    return (
        <div className='search-modal'>
            <h2>Countries</h2>
            <ul className='modal-list'>
                {countries?.map((countries: string, index: number) =>
                    <li key={index} onClick={() => { setSelectedCountry(countries) }}>{countries}</li>
                )}
            </ul>
        </div>
    )
}

const CountryRegionsPane = ({ selectedCountry, setSelectedRegion }: CountryRegionsPaneType) => {
    const { regions, countryRegionsError, countryRegionsLoading } = getCountryRegions(selectedCountry)
    const codesList = useFlagCodes()

    if (countryRegionsError) {
        return (
            <p className='search-modal modal-message'>Error in fetching country regions or states</p>
        )
    }

    if (countryRegionsLoading) {
        return (
            <p className='search-modal modal-message'>Loading regions...</p>
        )
    }

    return (
        <div className='search-modal'>
            <h2>Regions</h2>
            <ul className='modal-list'>
                {regions?.map((region: string, index: number) =>
                    <li key={index} onClick={() => { setSelectedRegion(region) }}>{
                        getRegionFullName(codesList, region, selectedCountry, true)
                    }</li>
                )}
            </ul>
        </div>
    )
}

const CountryRegionCitiesPane = ({ selectedCountry, selectedRegion, setSelectedCityName }: CountryRegionCitiesPaneType) => {
    const { cities: countryRegionCities, countryRegionCitiesError, countryRegionCitiesLoading } = getCountryRegionCities(selectedCountry, selectedRegion)

    if (countryRegionCitiesError) {
        return (
            <p className='search-modal modal-message'>Error in fetching cities for the country's region</p>
        )
    }

    if (countryRegionCitiesLoading) {
        return (
            <p className='search-modal modal-message'>Loading cities...</p>
        )
    }

    return (
        <div className='search-modal'>
            <h2>Cities (3000 result limit)</h2>
            <ul className='modal-list'>
                {countryRegionCities?.map((city: string, index: number) =>
                    <li key={index} onClick={() => { setSelectedCityName(city) }}>{city}</li>
                )}
            </ul>
        </div>
    )
}

const FindCityModal = ({ setToggle, setSelectedCity }: { setToggle: (value: boolean) => void, setSelectedCity: (value: CitiesType | null) => void }) => {
    const { setSearchQuery } = useContext(SearchQueryContext) as SearchQueryContextType

    const [selectedCountry, setSelectedCountry] = useState('')
    const [selectedRegion, setSelectedRegion] = useState('')
    const [selectedCityName, setSelectedCityName] = useState('')

    useEffect(() => {
        if (selectedCityName) {
            setToggle(false)
            setSearchQuery(selectedCityName)
        }
    }, [selectedCityName])

    // Setting the selected city from the modal
    useSelectedCity({ selectedRegion, selectedCountry, selectedCityName, setSelectedCity });

    const countriesWithLetterRegions = ['United States', 'United Kingdom']

    const showCountryPane = !selectedCountry && !selectedRegion && !selectedCityName
    const showRegionPane = countriesWithLetterRegions.includes(selectedCountry) && !selectedRegion
    const showCityPaneNoRegion = selectedCountry && !countriesWithLetterRegions.includes(selectedCountry) && !selectedRegion
    const showCityPaneWithRegion = countriesWithLetterRegions.includes(selectedCountry) && selectedRegion && !selectedCityName

    const handleBackButton = () => {
        if (showRegionPane) {
            setSelectedRegion('')
            setSelectedCountry('')
        }
        else if (showCityPaneNoRegion) {
            setSelectedCityName('')
            setSelectedCountry('')
        }
        else {
            setSelectedCityName('')
            setSelectedRegion('')
        }
    }

    const handleCloseModal = () => {
        setToggle(false)
        setSelectedCityName('')
        setSelectedCountry('')
        setSelectedRegion('')
    }

    return (
        <div className='modal-overlay'>
            <div className='modal-main'>
                <div className="modal-controls">
                    <button onClick={() => {
                        handleCloseModal()
                    }}>&#10005;</button>
                    {(showRegionPane || showCityPaneNoRegion || showCityPaneWithRegion) &&
                        <button onClick={() => { handleBackButton() }}>&#8592;</button>}
                </div>
                {showCountryPane &&
                    <CountryPane setSelectedCountry={setSelectedCountry} />}
                {showRegionPane &&
                    <CountryRegionsPane selectedCountry={selectedCountry} setSelectedRegion={setSelectedRegion} />}
                {(showCityPaneWithRegion || showCityPaneNoRegion) &&
                    <CountryRegionCitiesPane
                        selectedCountry={selectedCountry}
                        selectedRegion={selectedRegion}
                        setSelectedCityName={setSelectedCityName}
                        selectedCityName={selectedCityName} />}
            </div>
        </div>
    )
}

export default FindCityModal