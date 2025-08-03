import { createContext } from "react";

export type RecentreContextType = {
    recentre: boolean;
    setRecentre: (value: boolean) => void;
}

export const RecentreContext = createContext<RecentreContextType | null>(null)