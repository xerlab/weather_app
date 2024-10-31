const WEATHER_APIKEY = "5f4d375dcbd7603916a6d680092878c0";
const GEOLOCATION_APIKEY =
  "pk.eyJ1IjoieGVybGFicyIsImEiOiJjbTJ1cmwydWMwNDl4MmpzOHI1MWtiemFwIn0.AO51vmHbJiyN92wBZPRl9g";

export const debounce = (func, delay) => {
  let timeoutID;
  return function (...args) {
    return new Promise((resolve) => {
      if (timeoutID) clearTimeout(timeoutID);
      timeoutID = setTimeout(async () => {
        const data = await func(...args); // Get the result from the passed function
        resolve(data); // Return the result by resolving the Promise
      }, delay);
    });
  };
};

export const fetchWeatherData = async (lat, lon, apiKey) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const fetchForecastData = async (lat, lon, apiKey) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&cnt=12&units=metric`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const fetchGeoData = async (cityName, apiKey) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/search/geocode/v6/forward?q=${cityName}&limit=5&access_token=${apiKey}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const getGeolocation = debounce(async (city) => {
  try {
    const data = await fetchGeoData(city, GEOLOCATION_APIKEY);
    return data;
  } catch (error) {
    console.error("Error fetching geolocation data:", error);
  }
}, 1000);

export const getWeather = async (coords) => {
  try {
    const data = await fetchWeatherData(...coords, WEATHER_APIKEY);
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

export const getForecast = async (coords) => {
  try {
    const data = await fetchForecastData(...coords, WEATHER_APIKEY);
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

export function storeNameCoords(data) {
  let filteredData = data?.features?.map((location) => {
    return {
      name: location.properties.full_address,
      coords: location.geometry.coordinates,
    };
  });
  return filteredData;
}

export function storeWeather(weatherObj) {
  return {
    weather: {
      temp_max: weatherObj.main.temp_max,
      temp_min: weatherObj.main.temp_min,
      weather_desc: weatherObj.weather[0].description,
      feels_like: weatherObj.main.feels_like,
      date_time: convertDate(weatherObj.dt),
      today: getTodayName(),
    },
    highlights: {
      humidity: weatherObj.main.humidity,
      humidity_status: humidityStatus(weatherObj.main.humidity),
      pressure: weatherObj.main.pressure,
      pressure_status: pressureStatus(weatherObj.main.pressure / 1000),
      sunrise: convertTo12HourFormat(weatherObj.sys.sunrise),
      sunset: convertTo12HourFormat(weatherObj.sys.sunset),
      visibility: weatherObj.visibility,
      wind_speed: weatherObj.wind.speed,
      wind_deg: weatherObj.wind.deg,
    },
  };
}

export function storeForecast(forecastObj) {
  const filteredObj = forecastObj.list.map((item) => {
    return {
      time: convertTo12HourFormat(item.dt), // Convert UNIX timestamp to 12-hour format
      temp: item.main.temp_max, // Access temp_max from the main object
    };
  });

  return filteredObj; // Return the filtered object
}

function convertDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const formattedDate = date.toLocaleDateString("en-UK", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  return formattedDate;
}

function convertTo12HourFormat(timestamp) {
  const date = new Date(timestamp * 1000);
  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return date.toLocaleTimeString("en-US", options);
}

function getTodayName() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  return days[today.getDay()]; // getDay() returns an integer from 0 (Sunday) to 6 (Saturday)
}

function pressureStatus(pressure) {
  if (pressure > 1.03) {
    return "expect sunny weather";
  } else if (pressure > 1.012 && pressure <= 1.03) {
    return "stable weather";
  } else if (pressure > 1 && pressure <= 1.012) {
    return "may have clouds";
  } else if (pressure <= 1) {
    return "expect rain, wind";
  }
}

function humidityStatus(humidity) {
  if (humidity < 30) {
    return "Dry";
  } else if (humidity >= 30 && humidity <= 50) {
    return "Comfortable";
  } else if (humidity > 50 && humidity <= 70) {
    return "Humid";
  } else if (humidity > 70 && humidity <= 85) {
    return "Very Humid";
  } else if (humidity > 85) {
    return "Rain Likely";
  }
}

export function isWithinOneHour(targetTime) {
  // Split the target time (e.g., "5:00 PM") into parts
  const [time, modifier] = targetTime.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  // Adjust hours for 12-hour format
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  // Create a Date object for today with the target time
  const targetDate = new Date();
  targetDate.setHours(hours, minutes, 0, 0);

  // Get the current time
  const now = new Date();

  // Calculate one hour before and one hour after the target time
  const oneHourBefore = new Date(targetDate);
  oneHourBefore.setHours(targetDate.getHours() - 1);

  const oneHourAfter = new Date(targetDate);
  oneHourAfter.setHours(targetDate.getHours() + 1);

  // Check if the current time is within the one-hour range
  return now >= oneHourBefore && now <= oneHourAfter;
}
