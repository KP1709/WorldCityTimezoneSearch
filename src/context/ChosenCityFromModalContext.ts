import { createContext } from "react";

export type ChosenCityFromModalContextType = {
    isChosenCityFromModal: boolean;
    setIsChosenCityFromModal: (value: boolean) => void;
}

export const ChosenCityFromModalContext = createContext<ChosenCityFromModalContextType | null>(null)