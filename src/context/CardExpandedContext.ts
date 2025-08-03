import { createContext } from "react";

export type CardExpandedContextType = {
    isCardExpanded: boolean;
    setIsCardExpanded: (value: boolean) => void;
}

export const CardExpandedContext = createContext<CardExpandedContextType | null>(null)