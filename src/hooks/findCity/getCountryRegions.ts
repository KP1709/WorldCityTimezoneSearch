import { useState, useEffect } from "react";
import { supabase } from "../getCityListData";

export const getCountryRegions = (selectedCountry: string) => {
    const [regions, setRegions] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchResults = async () => {
            setError(null);
            setLoading(true);

            // Supabase SDK doesn't support .group() so RPCs (Remote Procedure Call) are used
            const { data, error } = await supabase.rpc('get_country_regions', { country_selected: selectedCountry })

            if (error) {
                setError(error.message)
                setRegions([]);
            }
            else {
                data.map((item: any) => {
                    setRegions(prev => [...prev, item.countrycities])
                })
            }
            setLoading(false);
        };

        fetchResults()
    }, [selectedCountry])

    return { regions, countryRegionsError: error, countryRegionsLoading: loading }

}