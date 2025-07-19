import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import { useContext, useEffect } from 'react';
import type { CitiesType, latLngType } from '../types';
import '../components/styles/mapContainerStyles.css'
import useBreakpoint from '../hooks/useBreakpoint';
import L from 'leaflet';
import customMarker from '../assets/map-pin-fill.svg'
import gpsFix from '../assets/gps-fix.png'
import { RecentreContext, type RecentreContextType } from '../App';

export const RecentreButton = () => {
    const currentBreakpoint = useBreakpoint();
    const { recentre, setRecentre } = useContext(RecentreContext) as RecentreContextType;

    return (
        <button id={currentBreakpoint <= 500 ? 'recentre-btn-sm' : 'recentre-btn-lg'} className='recentre-btn' onClick={() => setRecentre(!recentre)}>
            <img src={gpsFix} alt='Recentre Map' />
        </button>
    )
}

const FollowMarker = ({ markerPosition }: { markerPosition: latLngType }) => {
    const map = useMap();
    const currentBreakpoint = useBreakpoint()
    const { recentre } = useContext(RecentreContext) as RecentreContextType

    const customIcon = new L.Icon({
        iconUrl: customMarker,
        iconSize: [40, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40]
    });

    const calculateNewLatLng = (offsetX: number, offsetY: number, markerPosition: latLngType) => {
        const point = map.project([markerPosition[0], markerPosition[1]]).subtract([offsetX, offsetY])
        const newLatLng = map.unproject(point)
        return newLatLng
    }

    useEffect(() => {
        if (markerPosition) {
            if (currentBreakpoint <= 700) {
                const newLatLng = calculateNewLatLng(0, -120, markerPosition)
                map.setView(newLatLng, map.getZoom(), {
                    animate: true,
                });
            }
            else if (currentBreakpoint > 700) {
                const newLatLng = calculateNewLatLng(100, 0, markerPosition)
                map.setView(newLatLng, map.getZoom(), {
                    animate: true,
                });
            }
        }
    }, [markerPosition, map, recentre]);

    return <>
        <Marker position={markerPosition} icon={customIcon}></Marker>
    </>
};

export default function Map({ chosenCity }: { chosenCity?: CitiesType | undefined }) {
    const currentBreakpoint = useBreakpoint();

    return (
        <span >
            <MapContainer id='map-container'
                center={[40, -0.09]}
                zoom={2}
                minZoom={2}
                scrollWheelZoom={true}
                zoomControl={false}

            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {currentBreakpoint >= 500 && <ZoomControl position={'topright'} />}
                {chosenCity && <FollowMarker markerPosition={[chosenCity?.lat!, chosenCity?.lng!]} />}
            </MapContainer>
        </span>
    );
}