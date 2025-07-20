import { DateTime } from "luxon";
import { TimeDate } from "./currentTimeDate";
import type { CitiesType, TimeZoneType } from "../types";
import { useTimeZone } from "../hooks/getTimeZone";
import '../components/styles/cardStyles.css'
import useBreakpoint from "../hooks/useBreakpoint";
import FlagImage from "./flagImage";
import { getFlagImage } from "../hooks/getFlagImage";

function TimeCardInfo({ chosenCity, markerTimeData }: { chosenCity: CitiesType, markerTimeData: TimeZoneType | undefined }) {
    if (!markerTimeData) return null
    const { flags } = getFlagImage({ markerTimeData });
    const { mainFlag, secondaryFlag } = flags

    return (
        <div id='main-card'>
            <span id="clock"><TimeDate timezone={markerTimeData?.zoneName} /> {markerTimeData?.abbreviation}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true">
                    <path d="M232,128A104,104,0,1,1,128,24,104.13,104.13,0,0,1,232,128Z"></path>
                </svg>
            </span>
            {/* <span id='date'> {DateTime.now().setZone(markerTimeData?.zoneName).toFormat('DDD') ?? null}</span> */}
            <span id='date'><TimeDate timezone={markerTimeData?.zoneName} time={false} /> </span>
            <span id='timezone-id'>{DateTime.now().setZone(markerTimeData?.zoneName).toFormat('ZZZZZ') ?? null}</span>
            <span id='timezone-name'>{markerTimeData?.zoneName}</span>
            <span id='longitude'>
                <div>Long: {chosenCity.lat}</div>
            </span>

            <span id='latitude'><div>Lat: {chosenCity.lng}</div></span>
            <span id='location'>{chosenCity?.city_ascii}, {markerTimeData?.regionName}, {markerTimeData?.countryName}</span>
            <span id='flags'>
                <div className='flex-row'>
                    {mainFlag && <FlagImage image={mainFlag} />}
                    {secondaryFlag && <FlagImage image={secondaryFlag} />}
                </div>
            </span>
        </div>
    )
}

export default function Card({ chosenCity }: { chosenCity: CitiesType }) {
    const { markerTimeData, isLoading, isError } = useTimeZone([chosenCity.lat, chosenCity.lng], 2000);
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


