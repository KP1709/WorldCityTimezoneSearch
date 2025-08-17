import { useState, useEffect } from 'react'
import type { CitiesType } from '../types'

export const getFlagImage = ({ chosenCity }: { chosenCity: CitiesType }) => {
    const [flags, setFlags] = useState({ mainFlag: '', secondaryFlag: '' })
    const { country_code, admin1_code } = chosenCity

    const FLAGSIZE = 'h40'
    const mainFlagCode = country_code.toLowerCase()

    // API only supports UK and US having two flags
    const secondaryFlagCode = `${country_code.toLowerCase()}-${admin1_code.toLowerCase()}`

    useEffect(() => {
        const fetchCodesList = async () => {
            try {
                const response = await fetch('https://flagcdn.com/en/codes.json')
                const flagCodes = await response.json();

                if (flagCodes[mainFlagCode]) {
                    setFlags(flags => ({ ...flags, mainFlag: `https://flagcdn.com/${FLAGSIZE}/${mainFlagCode}.png` }))
                }

                if (flagCodes[secondaryFlagCode]) {
                    setFlags(flags => ({ ...flags, secondaryFlag: `https://flagcdn.com/${FLAGSIZE}/${secondaryFlagCode}.png` }))
                }

            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchCodesList()

    }, [chosenCity])


    return { flags }
};

