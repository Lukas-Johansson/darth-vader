import { useEffect, useState } from 'react'
import './App.css'
import Spinner from './components/Spinner'

function App() {
  const [lat, setLat] = useState(0)
  const [long, setLong] = useState(0)
  const [weatherData, setWeatherData] = useState([])

  useEffect(() => {
    async function fetchWeather() {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude)
        setLong(position.coords.longitude)
      })

      if (lat === 0 || long === 0) return

      const usersLocation = { lat: lat, long: long }
      const storedLocation = JSON.parse(localStorage.getItem('userslocation'));
      const storedWeatherData = JSON.parse(localStorage.getItem('weatherdata'));
      const storedTimestamp = localStorage.getItem('timestamp');
      const now = new Date().getTime();
      const tenMinutes = 10 * 60 * 1000;

      if (storedLocation && JSON.stringify(usersLocation) === JSON.stringify(storedLocation)) {
        console.log('Location is the same as last time')
        if (storedWeatherData && now - storedTimestamp < tenMinutes) {
          console.log('Data is less than 10 minutes old, using stored data')
          setWeatherData(storedWeatherData);
          return;
        }
      }

      console.log('Fetching new data')
      const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'
      await fetch(`${baseUrl}lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_API_KEY}`)
        .then(res => res.json())
        .then(result => {
          setWeatherData(result)
          localStorage.setItem('weatherdata', JSON.stringify(result));
          localStorage.setItem('userslocation', JSON.stringify(usersLocation));
          localStorage.setItem('timestamp', now);
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
        <h2>Väder: {weatherData.weather[0].description}</h2>
        <h2>Vindhastighet: {weatherData.wind.speed} m/s</h2>
        <h2>Luftfuktighet: {weatherData.main.humidity}%</h2>
        <h2>Lufttryck: {weatherData.main.pressure} hPa</h2>

        </>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default App