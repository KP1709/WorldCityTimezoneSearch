import { useState, useEffect } from "react";
import { supabase } from "../getCityListData";

export const getCountryCities = (selectedCountry: string) => {
    const [cities, setCities] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchResults = async () => {
            setError(null);
            setLoading(true);

            // Supabase SDK doesn't support .group() so RPCs (Remote Procedure Call) are used
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
        };

        fetchResults()
    }, [selectedCountry])

    return { cities, countryCitiesError: error, countryCitiesLoading: loading }

}