import { useEffect } from "react";
import { supabase } from "../getCityListData";
import type { CitiesType } from "../../types";

export const useSelectedCity = ({ selectedRegion, selectedCountry, selectedCityName, setSelectedCity }: { selectedRegion: string, selectedCountry: string, selectedCityName: string, setSelectedCity: (value: CitiesType | null) => void }) => {
    useEffect(() => {
        const fetchResults = async () => {
            if (selectedRegion) {
                const { data, error } = await supabase
                    .from('WorldCities')
                    .select('*')
                    .match({
                        country_name_en: selectedCountry,
                        admin1_code: selectedRegion,
                        ascii_name: selectedCityName
                    })

                if (error) {
                    setSelectedCity(null);
                }

                else {
                    setSelectedCity(data[0])
                }
            }

            else if (!selectedRegion) {

                const { data, error } = await supabase
                    .from('WorldCities')
                    .select('*')
                    .match({
                        country_name_en: selectedCountry,
                        ascii_name: selectedCityName
                    })

                if (error) {
                    setSelectedCity(null);
                }

                else {
                    setSelectedCity(data[0])
                }
            }
        };

        fetchResults()

    }, [selectedCityName])
}