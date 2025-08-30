import { useContext, useState } from "react";
import { DateTime } from "luxon";
import { TimeDate } from "./currentTimeDate";
import type { CitiesType, TimeZoneType } from "../types";
import { useTimeZone } from "../hooks/getTimeZone";
import '../components/styles/cardStyles.css'
import useBreakpoint from "../hooks/useBreakpoint";
import FlagImage from "./flagImage";
import { getFlagImage } from "../hooks/getFlagImage";
import { useFlagCodes } from "../hooks/useFlagCodes";
import { CardExpandedContext, type CardExpandedContextType } from "../context/CardExpandedContext";

function ToggleCardButton({ isExpanded, setIsExpanded }: { isExpanded: boolean, setIsExpanded: (value: boolean) => void }) {
    return (
        <button id='card-toggle' onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
                <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
            </svg>
                : <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
                    <path d="M213.66,165.66a8,8,0,0,1-11.32,0L128,91.31,53.66,165.66a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,213.66,165.66Z"></path>
                </svg>}
        </button>
    )
}

function TimeCardInfo({ chosenCity, markerTimeData }: { chosenCity: CitiesType, markerTimeData: TimeZoneType | undefined }) {
    const flagCodesList = useFlagCodes();
    if (!markerTimeData) return null;
    const { abbreviation, regionName, countryName } = markerTimeData;
    const { ascii_name, coordinates, timezone, country_name_en } = chosenCity;
    const { flags } = getFlagImage(chosenCity, flagCodesList);
    const { mainFlag, secondaryFlag } = flags;
    const currentBreakpoint = useBreakpoint();
    const { isCardExpanded, setIsCardExpanded } = useContext(CardExpandedContext) as CardExpandedContextType;

    const latLng = coordinates.split(',');

    const [isSmallScreen] = useState(() => {
        if (currentBreakpoint < 500) return true;
        else return false;
    });

    if (currentBreakpoint < 500 && !isCardExpanded) {
        return (
            <div id='main-card' className='small' style={{ height: '100px' }}>
                {isSmallScreen && <ToggleCardButton isExpanded={isCardExpanded} setIsExpanded={setIsCardExpanded} />}
                <span id="clock"><TimeDate timezone={timezone} /> {abbreviation}
                    <svg id='live-indicator' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true">
                        <path d="M232,128A104,104,0,1,1,128,24,104.13,104.13,0,0,1,232,128Z"></path>
                    </svg>
                </span>
                <span id='date-small'><TimeDate timezone={timezone} time={false} /> </span>
                <span id='location-small'><p>{ascii_name}, {regionName && `${regionName},`} {countryName}</p></span>
            </div>
        );
    }

    return (
        <div id='main-card' className='large' style={{ height: '275px' }}>
            {isCardExpanded && <ToggleCardButton isExpanded={isCardExpanded} setIsExpanded={setIsCardExpanded} />}

            <span id="clock"><TimeDate timezone={timezone} /> {abbreviation}
                <svg id='live-indicator' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true">
                    <path d="M232,128A104,104,0,1,1,128,24,104.13,104.13,0,0,1,232,128Z"></path>
                </svg>
            </span>
            <span id='date'><TimeDate timezone={timezone} time={false} /> </span>
            <span id='timezone-id'><p>{DateTime.now().setZone(timezone).toFormat('ZZZZZ') ?? null}</p></span>
            <span id='timezone-name'><p>{timezone}</p></span>
            <span id='longitude'>
                <div><p>Lng: {Number(latLng[1]).toFixed(3)}</p></div>
            </span>

            <span id='latitude'><div><p>Lat: {Number(latLng[0]).toFixed(3)}</p></div></span>
            <span id='location'><p>{ascii_name}, {regionName && `${regionName},`} {country_name_en || countryName}</p></span>
            <span id='flags'>
                <div className='flex-row'>
                    {mainFlag && <FlagImage image={mainFlag} />}
                    {secondaryFlag && <FlagImage image={secondaryFlag} />}
                </div>
            </span>
        </div>
    );
}

export default function Card({ chosenCity }: { chosenCity: CitiesType }) {
    const { coordinates } = chosenCity;
    const latLng = coordinates.split(',')

    const { markerTimeData, isLoading, isError, } = useTimeZone([Number(latLng[0]), Number(latLng[1])], 2000);
    const currentBreakpoint = useBreakpoint()

    if (isLoading) {
        return (
            <div className='timecard' style={{
                width: currentBreakpoint >= 500 ? '300px' : '100%'
            }}>
                <>Fetching time data...</>
            </div>
        )
    }

    if (isError) {
        return (
            <div className='timecard' style={{
                width: currentBreakpoint >= 500 ? '300px' : '100%'
            }}>
                <>Error in displaying time data</>
            </div>

        )
    }

    return (
        <div className='timecard'
            style={{
                width: currentBreakpoint >= 500 ? '300px' : '100%'
            }}>
            <TimeCardInfo chosenCity={chosenCity} markerTimeData={markerTimeData} />
        </div>
    )

}


