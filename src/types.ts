export type latLngType = [number, number];

export type TimeZoneType = {
    abbreviation: string //'BST'
    cityName: string
    countryCode: string
    countryName: string
    dst: string
    formatted: string
    gmtOffset: number
    message: string
    nextAbbreviation: string
    regionName: string
    status: string
    timestamp: number
    zoneEnd: number
    zoneName: string
    zoneStart: number
}

export type CityMarkerInfo = {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
};

export type CitiesType = {
    id: number,
    population: number,
    capital: string,
    iso2: string,
    iso3: string,
    country: string,
    lat: number,
    lng: number,
    city_ascii: string,
    city: string,
    admin_name: string,
    [key: string]: any
}