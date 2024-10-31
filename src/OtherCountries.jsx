function OtherCountries({ cities, handleCityWeather }) {
  return (
    <div className="other-countries card">
      <header className="card-title">Other countries</header>
      <div className="countries-list">
        {cities.map((city, index) => (
          <div
            key={index}
            className="country box"
            onClick={() => handleCityWeather(city)}
          >
            <div className="country-info">
              <div className="country-name">
                Feels like {city.weather.feels_like}
              </div>
              <div className="country-capital">{city.city_name}</div>
              <div className="day-expectations">
                {city.weather.weather_desc}
              </div>
            </div>
            <div className="weather-data">
              <div className="country-temperature-great-value">
                {city.weather.temp_max.toFixed(0)} °C
              </div>
              <div className="country-temperature-lowest-value">
                /{city.weather.temp_min.toFixed(0)} °C
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OtherCountries;
