import { useMemo, useState } from 'react'
import SearchBar from './components/searchBar'
import type { CitiesType } from './types'
import Map, { RecentreButton, ThemeToggleButton } from './components/map'
import Card from './components/card'
import ReloadModal from './components/reloadModal'
import { RecentreContext } from './context/RecentreContext'
import { DarkModeContext } from './context/DarkModeContext'
import { CardExpandedContext } from './context/CardExpandedContext'




function App() {
  const [selectedCity, setSelectedCity] = useState<CitiesType>(() => {
    const savedCity = sessionStorage.getItem('WorldMapSelectedCity');
    return savedCity ? JSON.parse(savedCity) : null;
  })

  const [recentre, setRecentre] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const mode = sessionStorage.getItem('WorldMapDarkMode');
    return mode ? JSON.parse(mode) : false;
  });
  const [reloadRequired, setReloadRequired] = useState(false)
  const [isCardExpanded, setIsCardExpanded] = useState(false)

  const handleCitySelect = (cities: CitiesType) => {
    setSelectedCity(cities)
  }

  const recentreProvider = useMemo(() => ({ recentre, setRecentre }), [recentre])
  const darkModeProvider = useMemo(() => ({ darkMode, setDarkMode }), [darkMode])
  const cardExpandedProvider = useMemo(() => ({ isCardExpanded, setIsCardExpanded }), [isCardExpanded])


  return (
    <main>
      <DarkModeContext.Provider value={darkModeProvider}>
        {reloadRequired && <ReloadModal setReloadRequired={setReloadRequired} />}
        <SearchBar onSelect={handleCitySelect} />
        <ThemeToggleButton setReloadRequired={setReloadRequired} />

        <CardExpandedContext.Provider value={cardExpandedProvider}>
          {selectedCity && <Card chosenCity={selectedCity} />}

          <RecentreContext.Provider value={recentreProvider}>
            <Map chosenCity={selectedCity} />
            {selectedCity && <RecentreButton />}
          </RecentreContext.Provider>
        </CardExpandedContext.Provider >

      </DarkModeContext.Provider>
    </main>
  )
}

export default App
