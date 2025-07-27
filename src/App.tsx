import { createContext, useMemo, useState } from 'react'
import SearchBar from './components/searchBar'
import type { CitiesType } from './types'
import Map, { RecentreButton, ThemeToggleButton } from './components/map'
import Card from './components/card'

export type RecentreContextType = {
  recentre: boolean;
  setRecentre: (value: boolean) => void;
}

export const RecentreContext = createContext<RecentreContextType | null>(null)

export type DarkModeContextType = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const DarkModeContext = createContext<DarkModeContextType | null>(null)

function App() {
  const [selectedCity, setSelectedCity] = useState<CitiesType>()
  const [recentre, setRecentre] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const mode = sessionStorage.getItem('WorldMapDarkMode');
    return mode ? JSON.parse(mode) : false;
  });

  const handleCitySelect = (cities: CitiesType) => {
    setSelectedCity(cities)
  }

  const recentreProvider = useMemo(() => ({ recentre, setRecentre }), [recentre])
  const darkModeProvider = useMemo(() => ({ darkMode, setDarkMode }), [darkMode])


  return (
    <main>
      <DarkModeContext.Provider value={darkModeProvider}>
        <SearchBar onSelect={handleCitySelect} />
        <ThemeToggleButton />
        {selectedCity && <Card chosenCity={selectedCity} />}

        <RecentreContext.Provider value={recentreProvider}>
          <Map chosenCity={selectedCity} />
          {selectedCity && <RecentreButton />}
        </RecentreContext.Provider>
      </DarkModeContext.Provider>
    </main>
  )
}

export default App
