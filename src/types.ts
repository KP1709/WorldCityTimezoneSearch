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
    geoname_id: number,
    name: string,
    ascii_name: string,
    feature_class: string,
    feature_code: string,
    country_code: string,
    country_code2: string
    country_name_en: string,
    admin1_code: string,
    admin2_code: string,
    population: number,
    coordinates: string,
    timezone: string,
}