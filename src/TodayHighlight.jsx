function TodayHighlight({ highlights }) {
  return (
    <div className="today-highlight card">
      <div className="card-title">Today's Highlight</div>
      <div className="highlights">
        <div className="highlight-box box">
          <div className="highlight-title">
            <span>
              <img
                className="small-icon"
                src={require("./icons/wind.png")}
                alt="wind"
              />
            </span>
            Wind Status
          </div>
          <div className="highlight-value">
            {highlights?.wind_speed} <small>km/h</small>
          </div>
          <div className="highlight-note">9:00 AM</div>
        </div>
        <div className="highlight-box box">
          <div className="highlight-title">
            <img
              className="small-icon"
              src={require("./icons/humidity.png")}
              alt="humidity"
            />
            Humidity
          </div>
          <div className="highlight-value">
            {highlights?.humidity} <small>%</small>
          </div>
          <div className="highlight-note">{highlights?.humidity_status}</div>
        </div>
        <div className="highlight-box double box">
          <div className="sun-icon">
            <span>
              <img
                className="mid-icon"
                src={require("./icons/sunrise.png")}
                alt="wind"
              />
            </span>
          </div>
          <div className="sun-title">
            <div className="sun-status">Sunrise</div>
            <div className="title">{highlights?.sunrise}</div>
          </div>
        </div>
        <div className="highlight-box box">
          <div className="highlight-title">
            <span>
              <img
                className="small-icon"
                src={require("./icons/visibility.png")}
                alt="wind"
              />
            </span>{" "}
            Visibility
          </div>
          <div className="highlight-value">
            {highlights?.visibility / 1000} <small>km</small>
          </div>
          <div className="highlight-note">9:00 AM</div>
        </div>
        <div className="highlight-box box">
          <div className="highlight-title">
            <span>
              <img
                className="small-icon"
                src={require("./icons/UVIndex.png")}
                alt="wind"
              />
            </span>{" "}
            Pressure
          </div>
          <div className="highlight-value">
            {highlights?.pressure / 1000} <small>bar</small>
          </div>
          <div className="highlight-note">{highlights?.pressure_status}</div>
        </div>

        <div className="highlight-box double box">
          <div className="sun-icon">
            <span>
              <img
                className="mid-icon"
                src={require("./icons/sunset.png")}
                alt="wind"
              />
            </span>
          </div>
          <div className="sun-title">
            <div className="sun-status">Sunset</div>
            <div className="title">{highlights?.sunset}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodayHighlight;
