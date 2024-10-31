import { useState, useEffect } from "react"; // Import necessary hooks from React
import WeatherCard from "./WeatherCard"; // Import WeatherCard component
import OtherCountries from "./OtherCountries"; // Import OtherCountries component
import TodayHighlight from "./TodayHighlight"; // Import TodayHighlight component
import DaysForecast from "./DaysForecast"; // Import DaysForecast component
import SearchIcon from "./icons/SearchIcon"; // Import SearchIcon component
import {
  getGeolocation, // Function to get geolocation data
  storeNameCoords, // Function to store name and coordinates
  getWeather, // Function to fetch weather data
  storeWeather, // Function to store weather data
  getForecast, // Function to fetch forecast data
  storeForecast, // Function to store forecast data
} from "./Utils/UtilFunc"; // Import utility functions

// Initial result for default weather location
const initialResult = {
  name: "Makka, Saudi Arabia", // Default city name
  coords: [21.42664, 39.82563], // Default coordinates
};

function App() {
  // State variables
  const [isDarkMode, setISDarkmode] = useState(false); // Dark mode toggle
  const [inputSearch, setInputSearch] = useState(""); // Input for searching locations
  const [searchResults, setSearchResults] = useState(""); // Results for searched locations
  const [isFocused, setIsFocused] = useState(false); // State to track focus on search input
  const [WeatherData, setWeatherData] = useState({}); // State for storing weather data
  const [forecastData, setForecastData] = useState(); // State for storing forecast data
  const [savedCities, setSavedCities] = useState(() => {
    // Initialize saved cities from local storage
    const storedCities = localStorage.getItem("savedCities"); // Get stored cities from localStorage
    return storedCities ? JSON.parse(storedCities) : []; // Parse and return stored cities or empty array
  });

  // Opacity setting for conditional rendering
  const opacity = searchResults && isFocused ? 0.4 : 1;

  // Focus handler to set isFocused state
  const handleFocus = () => {
    setIsFocused(true); // Set focus state to true
  };

  // Handler for blur event to set isFocused state after timeout
  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false); // Set focus state to false after 300ms
    }, 300);
  };

  // Function to switch dark mode
  function switchMode() {
    setISDarkmode(!isDarkMode); // Toggle dark mode state
  }

  // Function to handle selection of a location
  async function handleSelection(location) {
    const data = await getWeather(location.coords); // Fetch weather data for the selected location
    const objx = storeWeather(data); // Store the fetched weather data

    // Update weather data state
    setWeatherData(() => {
      return {
        city_name: location.name || location.city_name, // Set city name
        coords: location.coords, // Set coordinates
        ...objx, // Spread the weather data
      };
    });

    // Fetch and store forecast data
    const datax = await getForecast(location.coords); // Get forecast data
    const objz = storeForecast(datax); // Store the fetched forecast data
    setForecastData(objz); // Update forecast data state
  }

  // Function to handle changes in the search input
  async function handleChange(event) {
    setInputSearch(event.target.value); // Update search input state
    const data = await getGeolocation(event.target.value); // Get geolocation data based on input
    const filteredData = storeNameCoords(data); // Store name and coordinates
    setSearchResults(filteredData); // Update search results state
  }

  // Function to handle weather information of selected city
  function handleCityWeather(city) {
    handleSelection(city); // Call handleSelection with the selected city
  }

  // Function to save a city to the saved cities list
  function handleSaveCity() {
    handleSelection(WeatherData); // Get weather data for the current city
    setSavedCities((stored) => {
      // Update saved cities state
      if (stored.some((city) => city.coords === WeatherData.coords))
        // Check if city already exists
        return stored; // Return existing state if city is already saved
      else {
        return [...stored, WeatherData]; // Otherwise, add the new city to the list
      }
    });
  }

  // Effect to handle initial city selection
  useEffect(() => {
    handleSelection(initialResult); // Select the initial result on mount
  }, []);

  // Effect to switch dark mode on body class change
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode"); // Add dark mode class to body
    } else {
      document.body.classList.remove("dark-mode"); // Remove dark mode class from body
    }
  }, [isDarkMode]);

  // Effect to save cities to local storage when savedCities state changes
  useEffect(() => {
    console.log("Newly saved cities :", savedCities); // Log newly saved cities to console
    localStorage.setItem("savedCities", JSON.stringify(savedCities)); // Save cities to local storage
  }, [savedCities]);

  // Effect to log WeatherData changes
  useEffect(() => {
    console.log("WeatherData object is ", WeatherData); // Log WeatherData when it changes
  }, [WeatherData]); // This effect will run whenever WeatherData changes

  return (
    <div className="App">
      {" "}
      {/* Main application container */}
      <header className="weather-app-header container">
        {" "}
        {/* Header for the weather app */}
        <div className="search-city box">
          {" "}
          {/* Search input box */}
          <SearchIcon /> {/* Search icon component */}
          <input
            type="text" // Input field for location search
            placeholder="Search your location" // Placeholder text
            value={inputSearch} // Controlled input
            onChange={handleChange} // Update state on change
            onFocus={handleFocus} // Trigger handleFocus on focus
            onBlur={handleBlur} // Trigger handleBlur on blur
          />
        </div>
        <button className="box" onClick={() => switchMode()}>
          {" "}
          {/* Dark mode switch button */}
          <img
            className="small-icon"
            src={require("./icons/darkmode.png")} // Source for dark mode icon
            alt="darkmode" // Alt text for accessibility
          />
        </button>
        {searchResults &&
          isFocused && ( // Render search results if there are any and the input is focused
            <div className="search-results">
              {" "}
              {/* Container for search results */}
              {searchResults.map(
                (
                  location,
                  index // Map over search results to display them
                ) => (
                  <div
                    key={index} // Unique key for each result
                    className="location-name" // Class for location name
                    onClick={() => handleSelection(location)} // Call handleSelection on click
                  >
                    {location.name}{" "}
                    {/* Use location.name to display the name */}
                  </div>
                )
              )}
            </div>
          )}
      </header>
      <div className="container" style={{ opacity }}>
        {" "}
        {/* Main content container with dynamic opacity */}
        <WeatherCard
          weather={WeatherData.weather} // Pass weather data to WeatherCard
          city={WeatherData.city_name} // Pass city name to WeatherCard
          handleSaveCity={handleSaveCity} // Pass save city function
        />
        <TodayHighlight highlights={WeatherData.highlights} />{" "}
        {/* Display today's highlights */}
        <OtherCountries
          cities={savedCities} // Pass saved cities to OtherCountries
          handleCityWeather={handleCityWeather} // Pass city weather handler
        />
        <DaysForecast forecast={forecastData} />{" "}
        {/* Pass forecast data to DaysForecast */}
      </div>
    </div>
  );
}

export default App; // Export App component as default
