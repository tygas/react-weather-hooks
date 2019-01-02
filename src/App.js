import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import axios from "axios";

import SearchForm from "./components/SearchForm";
import WeatherCard from "./components/WeatherCard";
import WeatherGrid from "./components/WeatherGrid";

const App = () => {
  const [weather, setWeather] = useState(null);
  const [savedCityIds, setSavedCityIds] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [message, setMessage] = useState(null);
  const [fetchingCities, setFetchingCities] = useState(true);

  // Fetches cities that were saved to local storage previously
  const fetchSavedCities = async () => {
    const cityStorage = localStorage.getItem("cityStorage"); // Get saved city ids from local storage
    const queryArr = cityStorage ? JSON.parse(cityStorage) : []; // Parse string to get array
    if (queryArr.length) {
      const { data } = await axios.get(
        `/api/forward/list?list=${queryArr.join(",")}`
      );
      setSavedCityIds([...queryArr]); // Set state to track city ids
      setCitiesData([...data.list]); // Set all cities for WeatherGrid
      setFetchingCities(false);
    } else {
      setFetchingCities(false);
    }
  };

  // Fetches weather from a search
  const fetchWeather = async (e, city, countryCode) => {
    try {
      e.preventDefault();
      if (countryCode) city += `,${countryCode}`; // Add country to query if selected
      const { data } = await axios.get(`/api/forward/location?q=${city}`); // Server forwards get request to OWM API
      setWeather(data); //
    } catch (e) {
      setMessage({ type: "error", message: "City not found." });
      return setInterval(() => setMessage(null), 5000);
    }
  };

  // Save city to local storage, updates displayed weather locations
  const onSaveCity = id => {
    let cityArr;
    const cityStorage = localStorage.getItem("cityStorage");
    // If no saved cities, save new city and return
    if (!cityStorage) {
      cityArr = [id];
      return localStorage.setItem("cityStorage", JSON.stringify(cityArr));
    }
    const cityStorageArr = JSON.parse(cityStorage); // Parse string containing city ids to array
    // OWM limit of 20 locations in a request
    if (cityStorageArr.length >= 20) {
      setMessage({
        type: "error",
        message:
          "Can only save a maximum of 20 cities. Please remove from your currently saved cities to add new ones."
      });
      return setInterval(() => setMessage(null), 5000);
    }
    // If city not already stored, adds it
    if (!cityStorageArr.includes(id)) {
      cityArr = cityStorageArr.push(id); // Add to array
      localStorage.setItem("cityStorage", JSON.stringify(cityStorageArr)); // Stringify and save to local storage
      // State updates
      setCitiesData([...citiesData, weather]);
      setWeather(null);
      setMessage({ type: "success", message: "City added successfully." });
      return setInterval(() => setMessage(null), 5000);
    }
  };

  // Removes city from local storage and from currently displayed cities
  const removeCity = id => {
    const filteredStorage = JSON.parse(
      localStorage.getItem("cityStorage")
    ).filter(cityId => cityId !== id); // Parsed saved cities string to array and filter out removed city

    localStorage.setItem("cityStorage", JSON.stringify(filteredStorage)); // Stringify filtered array and save

    const updatedCities = citiesData.filter(city => city.id !== id); // Filter from state
    setCitiesData(updatedCities); // Update state

    setMessage({ type: "success", message: "Successfully removed city." });
    return setInterval(() => setMessage(null), 5000);
  };

  useEffect(() => {
    fetchSavedCities();
    return () => clearInterval();
  }, []);

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            React Weather
          </Typography>
        </Toolbar>
      </AppBar>

      <br />

      <SearchForm fetchWeather={fetchWeather} />

      {weather && (
        <div style={{ width: "300px", margin: "0 auto" }}>
          <WeatherCard weather={weather}>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => onSaveCity(weather.id)}
                disabled={savedCityIds.includes(weather.id)}
              >
                Save
              </Button>
            </CardActions>
          </WeatherCard>
        </div>
      )}
      {message && (
        <div>
          <p>{message.message}</p>
        </div>
      )}
      {fetchingCities && <div>Fetching your cities...</div>}
      <WeatherGrid citiesData={citiesData} removeCity={removeCity} />
    </div>
  );
};

export default App;
