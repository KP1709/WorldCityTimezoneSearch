import { useState, useEffect } from "react";
import { supabase } from "../getCityListData";

export const getCountryRegionCities = (selectedCountry: string, selectedRegion: string) => {
    const [cities, setCities] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchResults = async () => {
            setError(null);
            setLoading(true);

            if (selectedRegion) {
                const { data, error } = await supabase.rpc('get_country_region_cities', { country_selected: selectedCountry, region_selected: selectedRegion })

                if (error) {
                    setError(error.message)
                    setCities([]);
                }
                else {
                    data.map((item: any) => {
                        setCities(prev => [...prev, item.countrycities])
                    })
                }
                setLoading(false);
            }
            else if (!selectedRegion) {
                const { data, error } = await supabase.rpc('get_country_cities', { country_selected: selectedCountry })

                if (error) {
                    setError(error.message)
                    setCities([]);
                }
                else {
                    data.map((item: any) => {
                        setCities(prev => [...prev, item.countrycities])
                    })
                }
                setLoading(false);
            }
        };

        fetchResults()
    }, [selectedCountry, selectedRegion])

    return { cities, countryRegionCitiesError: error, countryRegionCitiesLoading: loading }
}