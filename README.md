# World City Timezone Explorer
[![Netlify Status](https://api.netlify.com/api/v1/badges/e4773565-55c5-4bbb-b02a-beadf6be9d63/deploy-status)](https://app.netlify.com/projects/kareenapatel-worldcitytimezonesearch/deploys)

## ⌨️ Tech stack
React / Typescript / CSS / pnpm / Luxon / React Leaflet / Supabase

## 🍼 Introduction
After completing a technical debt story where there were inconsistencies with time formats in the company's web application, I was interested in looking further into basic handling of date and times. This tool enables users to search for a city in the world and see the date and time information for it. This includes where it is located and places a marker on the map as well. It was also a great opportunity to explore using React Leaflet, Luxon and Supabase. Supabase was able to do the heavy-lifting when completing search queries.

## 🛠️ Features
- Search for world cities through querying the Supabase database
- Displays city location on map
    - Map is interactive with zoom control for phone and desktop
    - Marker is placed where city is
- Responsive design - for both phone and desktop
- Display current time (which updates every minute)
    - Shows date, timezone, timezone id and location
- Displays main flag for the country the city is in
    - Shows second flag if a region or state does have one

## 📚 Resources
- How to find a key from a value (Peter Morgan) - https://petermorgan.dev/blog/find-a-values-key-in-a-javascript-object/
- React Leaflet - https://react-leaflet.js.org/
- Luxon - https://moment.github.io/luxon/#/

## 🪣 APIs / Data
- Country flags - https://flagpedia.net/download/api
- Timezone information - https://timezonedb.com/
- World city data - https://simplemaps.com/data/world-cities

## ➕ Additional features to add
- Light mode / dark mode overlay on map
- Think of better way to present the time data
- Add ability to tap map to add marker and display time date information
- Filter search by country 
    - Would be better to show all cities to search by initially before reducing list

