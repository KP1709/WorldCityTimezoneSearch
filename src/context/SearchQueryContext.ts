import { createContext } from "react";

export type SearchQueryContextType = {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
}

export const SearchQueryContext = createContext<SearchQueryContextType | string>('')