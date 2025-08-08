import { useContext, useEffect, useState } from 'react';
import './styles/globalModalStyles.css'
import './styles/findCityModalStyles.css'
import { DarkModeContext, type DarkModeContextType } from '../context/DarkModeContext';
import type { CitiesType } from '../types';
import { SearchQueryContext, type SearchQueryContextType } from '../context/SearchQueryContext';
import { getCountries } from '../hooks/findCity/getCountries';
import { getCountryRegions } from '../hooks/findCity/getCountryRegions';
import { getCountryRegionCities } from '../hooks/findCity/getCountryRegionsCities';
import { getCountryCities } from '../hooks/findCity/getCountryCities';
import { useSelectedCity } from '../hooks/findCity/useSelectedCity';
import { useFlagCodes } from '../hooks/useFlagCodes';
import { getRegionFullName } from '../hooks/getFullRegionName';

const CountryPane = ({ setSelectedCountry }: { setSelectedCountry: (value: string) => void }) => {
    const { countries, countriesError, countriesLoading } = getCountries()

    if (countriesError) {
        return (
            <p>Error in fetching countries</p>
        )
    }

    if (countriesLoading) {
        return (
            <p>Loading countries...</p>
        )
    }

    return (
        <>
            <p>Countries</p>
            <ul className='modal-content'>
                {countries?.map((countries: string, index: number) =>
                    <li key={index} onClick={() => { setSelectedCountry(countries) }}>{countries}</li>
                )}
            </ul>
        </>
    )
}

const CountryRegionsPane = ({ selectedCountry, setSelectedRegion }: { selectedCountry: string, setSelectedRegion: (value: string) => void }) => {
    const { regions, countryRegionsError, countryRegionsLoading } = getCountryRegions(selectedCountry)
    const codesList = useFlagCodes()

    if (countryRegionsError) {
        return (
            <p>Error in fetching country regions or states</p>
        )
    }

    if (countryRegionsLoading) {
        return (
            <p>Loading regions...</p>
        )
    }

    return (
        <>
            <p>Regions</p>
            <ul className='modal-content'>
                {regions?.map((region: string, index: number) =>
                    <li key={index} onClick={() => { setSelectedRegion(region) }}>{
                        getRegionFullName(codesList, region, selectedCountry, true)
                    }</li>
                )}
            </ul>
        </>
    )
}

const CountryRegionCitiesPane = ({ selectedCountry, selectedRegion, setSelectedCityName }: { selectedCountry: string, selectedRegion: string, setSelectedCityName: (value: string) => void, selectedCityName: string | null }) => {
    const { cities: countryCities, countryCitiesError, countryCitiesLoading } = getCountryCities(selectedCountry)
    const { cities: countryRegionCities, countryRegionCitiesError, countryRegionCitiesLoading } = getCountryRegionCities(selectedCountry, selectedRegion)

    if (countryRegionCitiesError || countryCitiesError) {
        return (
            <p>Error in fetching cities for the country's region</p>
        )
    }

    if (countryRegionCitiesLoading || countryCitiesLoading) {
        return (
            <p>Loading cities...</p>
        )
    }

    if (!selectedRegion) {
        <>
            <p>Cities (Temporary limit of 3000 results)</p>
            <ul className='modal-content'>
                {countryCities?.map((city: string, index: number) =>
                    <li key={index} onClick={() => { setSelectedCityName(city) }}>{city}</li>
                )}
            </ul>
        </>
    }

    return (
        <>
            <p>Cities (Temporary limit of 3000 results)</p>
            <ul className='modal-content'>
                {countryRegionCities?.map((city: string, index: number) =>
                    <li key={index} onClick={() => { setSelectedCityName(city) }}>{city}</li>
                )}
            </ul>
        </>
    )
}

const FindCityModal = ({ setToggle, setSelectedCity }: { setToggle: (value: boolean) => void, setSelectedCity: (value: CitiesType | null) => void }) => {
    const { setSearchQuery } = useContext(SearchQueryContext) as SearchQueryContextType
    const { darkMode } = useContext(DarkModeContext) as DarkModeContextType;

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

    return (
        <dialog id='search-modal' className={darkMode ? 'modal-overlay light-modal' : 'modal-overlay dark-modal'}>
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
        </dialog>
    )
}

export default FindCityModal