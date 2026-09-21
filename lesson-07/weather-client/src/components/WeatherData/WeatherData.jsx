import './WeatherData.css'

export default function WeatherData(props) {
    const {
        temperature,
        feels_like,
        temp_min,
        temp_max,
        pressure,
        humidity,
        description,
        name,
        cod,
        message
    } = props.data

    return cod === 200 ? (
        <div className="weather-card weather-card--sunny">
            <div className="weather-card__sun">☀️</div>
            <h1 className="weather-card__title">Weather in {name}</h1>
            <p className="weather-card__description">{description}</p>

            <div className="weather-card__temp-main">
                {Math.round(temperature)}°
            </div>
            <p className="weather-card__feels-like">
                Feels like {Math.round(feels_like)}°
            </p>

            <div className="weather-card__grid">
                <div className="weather-card__stat">
                    <span className="weather-card__stat-label">Low</span>
                    <span className="weather-card__stat-value">{Math.round(temp_min)}°</span>
                </div>
                <div className="weather-card__stat">
                    <span className="weather-card__stat-label">High</span>
                    <span className="weather-card__stat-value">{Math.round(temp_max)}°</span>
                </div>
                <div className="weather-card__stat">
                    <span className="weather-card__stat-label">Humidity</span>
                    <span className="weather-card__stat-value">{humidity}%</span>
                </div>
                <div className="weather-card__stat">
                    <span className="weather-card__stat-label">Pressure</span>
                    <span className="weather-card__stat-value">{pressure} hPa</span>
                </div>
            </div>
        </div>
    ) : (
        <div className="weather-card weather-card--error">
            <div className="weather-card__cloud">🌧️</div>
            <h1 className="weather-card__title">Oops!</h1>
            <p className="weather-card__error-message">{message}</p>
        </div>
    )
}