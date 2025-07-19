import { createContext, useMemo, useState } from 'react'
import SearchBar from './components/searchBar'
import type { CitiesType } from './types'
import Map, { RecentreButton } from './components/map'
import Card from './components/card'

export type RecentreContextType = {
  recentre: boolean;
  setRecentre: (value: boolean) => void;
}

export const RecentreContext = createContext<RecentreContextType | null>(null)

function App() {
  const [selectedCity, setSelectedCity] = useState<CitiesType>()
  const [recentre, setRecentre] = useState(false)

  const handleCitySelect = (cities: CitiesType) => {
    setSelectedCity(cities)
  }

  const recentreProvider = useMemo(() => ({ recentre, setRecentre }), [recentre])

  return (
    <main>
      <SearchBar onSelect={handleCitySelect} />
      {selectedCity && <Card chosenCity={selectedCity} />}

      <RecentreContext.Provider value={recentreProvider}>
        <Map chosenCity={selectedCity} />
        {selectedCity && <RecentreButton />}
      </RecentreContext.Provider>
    </main>
  )
}

export default App
