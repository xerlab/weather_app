import { isWithinOneHour } from "./Utils/UtilFunc";

function DaysForecast({ forecast }) {
  return (
    <div className="forecast card">
      <div className="card-title">Days Forecast</div>
      <div className="forecast-list">
        {forecast?.map((el, index) => (
          <div
            key={index}
            className="day-forecast box"
            style={{
              opacity: isWithinOneHour(el.time) ? "1" : "60%",
              border: isWithinOneHour(el.time)
                ? "1px solid var(--accent-color)"
                : "",
            }}
          >
            <div className="forecast-weather-temp">
              {el.temp.toFixed(0)} <small>°C</small>
            </div>
            <div className="forecast-weather-time">{el.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DaysForecast;
