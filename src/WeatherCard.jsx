function WeatherCard({ city, weather, handleSaveCity }) {
  return (
    <div className="weather card">
      <header className="weather-header">
        <div className="weather-location">
          <div className="logo">
            <img
              className="small-icon"
              src={require("./icons/location.png")}
              alt="wind"
            />
          </div>
          <span>{city}</span>
          <span className="add-city" onClick={() => handleSaveCity()}>
            Save
          </span>
        </div>
        <div className="weather-temp-scale">
          <select className="temp-scale">
            <option value="C">°C </option>
            <option value="F">°F </option>
          </select>
        </div>
      </header>
      <div className="weather-insights">
        <header className="weather-today">
          <div className="day-name">{weather?.today}</div>
          <div className="date">{weather?.date_time}</div>
        </header>
        <div className="weather-today-icon">🌧️</div>
        <section className="insights">
          <div className="temperature ">
            <div className="temperature-great-value">
              {weather?.temp_max} <span>°C</span>
            </div>
            <div className="temperature-lowest-value">
              /{weather?.temp_min} <span>°C</span>
            </div>
          </div>
          <div className="information">
            <div className="expectations">{weather?.weather_desc}</div>
            <div className="feels-like">
              Feels like <span>{weather?.feels_like}°C</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default WeatherCard;
