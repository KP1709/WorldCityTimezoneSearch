import { DateTime } from "luxon";
import Clock from "./currentTime";
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
            <span id="clock"><Clock timezone={markerTimeData?.zoneName} /> {markerTimeData?.abbreviation}</span>
            <span id='date'> {DateTime.now().setZone(markerTimeData?.zoneName).toFormat('DDD') ?? null}</span>
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


