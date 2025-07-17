import { useState, useEffect } from 'react'
import type { TimeZoneType } from '../types'

export const getFlagImage = ({ markerTimeData }: { markerTimeData: TimeZoneType }) => {
    const [flags, setFlags] = useState({ mainFlag: '', secondaryFlag: '' })

    const FLAGSIZE = 'h40'

    // Supported on API - some countries not included in API do have multiple flags
    const countryCodeDuelFlag = ['gb', 'us']

    useEffect(() => {
        const fetchCodesList = async () => {
            try {
                const response = await fetch('https://flagcdn.com/en/codes.json')
                const flagCodes = await response.json();

                if (flagCodes[markerTimeData?.countryCode.toLowerCase()]) {
                    setFlags(flags => ({ ...flags, mainFlag: `https://flagcdn.com/${FLAGSIZE}/${markerTimeData?.countryCode.toLowerCase()}.png` }))
                }

                // For countries with two flags, there is no ISO 3 code returned 
                // from the Timezone API response. So we need to search for the ISO 
                // code by searching the region name to find the code (used as the key) in the Flags API.
                if (countryCodeDuelFlag.includes(markerTimeData?.countryCode.toLowerCase())) {
                    const flagCode = Object.keys(flagCodes).find((key) => flagCodes[key] === markerTimeData.regionName)
                    setFlags(flags => ({ ...flags, secondaryFlag: `https://flagcdn.com/${FLAGSIZE}/${flagCode}.png` }))
                }

            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchCodesList()

    }, [markerTimeData])


    return { flags }
};

