import { createContext } from "react";

export type DarkModeContextType = {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
}

export const DarkModeContext = createContext<DarkModeContextType | null>(null)