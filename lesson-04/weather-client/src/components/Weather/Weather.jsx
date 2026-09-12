import { useState } from 'react'
import { gql } from '@apollo/client'
import { client } from '../../apolloClient'
import WeatherData from '../WeatherData/WeatherData'
import './Weather.css'

function Weather() {
    const [ zip, setZip ] = useState('')
    const [ weather, setWeather ] = useState(null)
    const [ unit, setUnit ] = useState("imperial")
    async function getWeather() {
        try {
            const json = await client.query({
                query: gql`
                    query GetWeather($zip: Int!, $units: Units) {
                        getWeather(zip: $zip, units: $units) {
                            temperature
                            name
                            feels_like
                            temp_min
                            temp_max
                            pressure
                            humidity
                            description
                            message
                            cod
                        }
                    }
                `,
                variables: { zip: parseInt(zip, 10), units: unit }
            })
            setWeather(json.data.getWeather)
        } catch(err) {
            console.log(err.message)
        }
    }

    async function getWeatherByGeolocation() {
        async function success(pos) {
            const {latitude, longitude} = pos.coords;

            try {
            const json = await client.query({
                query: gql`
                    query GetWeatherByLocation($lat: Float!, $lon: Float!, $units: Units) {
                        getWeatherByLocation(lat: $lat, lon: $lon, units: $units) {
                            temperature
                            description
                            name
                            feels_like
                            temp_min
                            temp_max
                            pressure
                            humidity
                            message
                            cod
                        }
                    }
                `,
                variables: { lat: latitude, lon: longitude, units: unit }
            })
            setWeather(json.data.getWeatherByLocation)
        } catch(err) {
            console.log(err.message)
        }
        }

        function error(err) {
            console.log(err.message)
        }

        navigator.geolocation.getCurrentPosition(success, error);
    }

    return (
        <div className="weather">
            <div className="weather__header">
                <span className="weather__emoji">🌤️</span>
                <h2 className="weather__heading">What's the weather like?</h2>
            </div>

            <form className="weather__form" onSubmit={(e) => {
                e.preventDefault()
                getWeather()
            }}>
                <input
                    className="weather__input"
                    placeholder="Enter zip code"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                />
                <div className="weather__units" role="radiogroup" aria-label="Temperature units">
                    <label className={`weather__unit-option ${unit === "imperial" ? "weather__unit-option--active" : ""}`}>
                        <input
                            className="weather__unit-input"
                            type="radio"
                            name="unit"
                            value="imperial"
                            checked={unit === "imperial"}
                            onChange={() => setUnit("imperial")}
                        />
                        °F
                    </label>
                    <label className={`weather__unit-option ${unit === "metric" ? "weather__unit-option--active" : ""}`}>
                        <input
                            className="weather__unit-input"
                            type="radio"
                            name="unit"
                            value="metric"
                            checked={unit === "metric"}
                            onChange={() => setUnit("metric")}
                        />
                        °C
                    </label>
                </div>
                <button className="weather__button" type="submit">
                    Check
                </button>
                <button className="weather__button weather__button--secondary" type="button" onClick={getWeatherByGeolocation}>
                    Use Current Location
                </button>
            </form>

            {weather ? <WeatherData data={weather} /> : null}
        </div>
    )
}

export default Weather