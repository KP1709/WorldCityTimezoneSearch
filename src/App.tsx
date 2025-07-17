import { useState } from 'react'
import SearchBar from './components/searchBar'
import type { CitiesType } from './types'
import Map from './components/map'
import Card from './components/card'

function App() {
  const [selectedCity, setSelectedCity] = useState<CitiesType>()

  const handleCitySelect = (cities: CitiesType) => {
    setSelectedCity(cities)
  }

  return (
    <main id='main_grid'>
      <SearchBar onSelect={handleCitySelect} />
      <Map chosenCity={selectedCity} />
      {selectedCity && <Card chosenCity={selectedCity} />}
    </main>
  )
}

export default App
