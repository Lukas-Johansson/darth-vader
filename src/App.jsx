import { useEffect, useState } from 'react'
import './App.css'
import Spinner from './components/Spinner'

function App() {
  const [lat, setLat] = useState(0)
  const [long, setLong] = useState(0)
  const [weatherData, setWeatherData] = useState([])

  useEffect(() => {
    console.log(`before call: ${typeof (weatherData)}`)
    async function fetchWeather() {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude)
        setLong(position.coords.longitude)
      })
      console.log(lat, long)
      if (lat === 0 || long === 0) return
    
      const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'
      await fetch(`${baseUrl}lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_API_KEY}`)
        .then(res => res.json())
        .then(result => {
          console.log(result)
          setWeatherData(result)
        }).catch(err => {
          console.log(err)
        })
    }
    fetchWeather()
  }, [lat, long])

  return (
    <>
      <h1>Darth Väder</h1>
      {weatherData.main ? (
        <>
        <h2>City: {weatherData.name}</h2>
        <h2>Temperaturer: {(weatherData.main.temp -273.15).toFixed(0)}°C</h2>
        </>
      ) : (
        <Spinner />
      )}
      
    </>
  )
}

export default App