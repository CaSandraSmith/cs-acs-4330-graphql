import { useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import WeatherData from '../WeatherData/WeatherData'
import './Weather.css'

const GET_WEATHER = gql`
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
`

function Weather() {
    const [ zip, setZip ] = useState('')
    const [ unit, setUnit ] = useState("imperial")
    const [getWeather, { loading, error, data }] = useLazyQuery(GET_WEATHER)

    const handleFetch = () => {
        const zipCode = parseInt(zip, 10)
        if (isNaN(zipCode)) return
        getWeather({ variables: { zip: zipCode, units: unit } })
    }

    return (
        <div className="weather">
            <div className="weather__header">
                <span className="weather__emoji">🌤️</span>
                <h2 className="weather__heading">What's the weather like?</h2>
            </div>

            <form className="weather__form" onSubmit={(e) => {
                e.preventDefault()
                handleFetch()
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
            </form>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && <WeatherData data={data.getWeather} />}
        </div>
    )
}

export default Weather