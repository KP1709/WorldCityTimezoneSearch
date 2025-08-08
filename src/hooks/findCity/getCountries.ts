import { useState, useEffect } from "react";
import { supabase } from "../getCityListData";

export const getCountries = () => {
    const [countries, setCountries] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        const fetchResults = async () => {
            setError(null);
            setLoading(true);

            // Supabase SDK doesn't support .group() so RPCs (Remote Procedure Call) are used
            const { data, error } = await supabase.rpc('get_countries_ordered')

            if (error) {
                setError(error.message)
                setCountries([]);
            }
            else {
                data.map((item: any) => {
                    setCountries(prev => [...prev, item.countries])
                })
            }
            setLoading(false);
        };

        fetchResults()
    }, [])

    return { countries, countriesError: error, countriesLoading: loading }

}