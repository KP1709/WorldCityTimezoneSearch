import { useMemo, useState } from 'react'
import SearchBar from './components/searchBar'
import type { CitiesType } from './types'
import Map, { RecentreButton, SearchListButton, ThemeToggleButton } from './components/map'
import Card from './components/card'
import ReloadModal from './components/reloadModal'
import { RecentreContext } from './context/RecentreContext'
import { DarkModeContext } from './context/DarkModeContext'
import { CardExpandedContext } from './context/CardExpandedContext'
import FindCityModal from './components/FindCityModal'
import { SearchQueryContext } from './context/SearchQueryContext'

function App() {
  const [chosenCity, setChosenCity] = useState<CitiesType | null>(null)

  const [recentre, setRecentre] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const mode = sessionStorage.getItem('WorldMapDarkMode');
    return mode ? JSON.parse(mode) : false;
  });
  const [reloadRequired, setReloadRequired] = useState(false)
  const [isCardExpanded, setIsCardExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleCitySelect = (cities: CitiesType) => {
    setChosenCity(cities)
  }

  const recentreProvider = useMemo(() => ({ recentre, setRecentre }), [recentre])
  const darkModeProvider = useMemo(() => ({ darkMode, setDarkMode }), [darkMode])
  const cardExpandedProvider = useMemo(() => ({ isCardExpanded, setIsCardExpanded }), [isCardExpanded])
  const searchQueryProvider = useMemo(() => ({ searchQuery, setSearchQuery }), [searchQuery])

  const [toggleCityModal, setToggleCityModal] = useState(false)

  return (
    <main>
      <DarkModeContext.Provider value={darkModeProvider}>
        {reloadRequired && <ReloadModal setReloadRequired={setReloadRequired} />}
        <SearchListButton setToggle={setToggleCityModal} toggle={toggleCityModal} />

        <SearchQueryContext.Provider value={searchQueryProvider}>
          {toggleCityModal && <FindCityModal setToggle={setToggleCityModal} setSelectedCity={setChosenCity} />}
          <SearchBar onSelect={handleCitySelect} />
        </SearchQueryContext.Provider>
        <ThemeToggleButton setReloadRequired={setReloadRequired} />

        <CardExpandedContext.Provider value={cardExpandedProvider}>
          {chosenCity && <Card chosenCity={chosenCity} />}

          <RecentreContext.Provider value={recentreProvider}>
            <Map chosenCity={chosenCity} />
            {chosenCity && <RecentreButton />}
          </RecentreContext.Provider>
        </CardExpandedContext.Provider >
      </DarkModeContext.Provider>
    </main>
  )
}

export default App
