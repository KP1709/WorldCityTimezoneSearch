import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import { useEffect } from 'react';
import type { CitiesType, latLngType } from '../types';
import '../components/styles/mapContainerStyles.css'
import useBreakpoint from '../hooks/useBreakpoint';
import L from 'leaflet';
import customMarker from '../assets/map-pin-fill.svg'

const FollowMarker = ({ markerPosition }: { markerPosition: latLngType }) => {
    const map = useMap();
    const currentBreakpoint = useBreakpoint()

    const customIcon = new L.Icon({
        iconUrl: customMarker,
        iconSize: [40, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40]
    });

    useEffect(() => {
        if (markerPosition) {
            if (currentBreakpoint <= 700) {
                map.setView([markerPosition[0] - 40, markerPosition[1]], map.getZoom(), {
                    animate: true,
                });
            }
            else if (currentBreakpoint > 700) {
                map.setView([markerPosition[0], markerPosition[1] - 40], map.getZoom(), {
                    animate: true,
                });
            }
            else {
                map.setView([markerPosition[0], markerPosition[1]], map.getZoom(), {
                    animate: true,
                });
            }
        }
    }, [markerPosition, map]);

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