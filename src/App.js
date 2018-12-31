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

  const fetchSavedCities = async () => {
    const cityStorage = localStorage.getItem("cityStorage");
    const queryArr = cityStorage ? JSON.parse(cityStorage) : [];
    if (queryArr.length) {
      const { data } = await axios.get(
        `/api/forward/list?list=${queryArr.join(",")}`
      );
      setSavedCityIds([...queryArr]);
      setCitiesData([...data.list]);
      setFetchingCities(false);
    } else {
      setFetchingCities(false);
    }
  };

  const fetchWeather = async (e, city, countryCode) => {
    try {
      e.preventDefault();
      if (countryCode) city += `,${countryCode}`;
      const { data } = await axios.get(`/api/forward/location?q=${city}`);
      setWeather(data);
    } catch (e) {
      setMessage({ type: "error", message: "City not found." });
      return setInterval(() => setMessage(null), 5000);
    }
  };

  const onSaveCity = id => {
    const cityStorage = localStorage.getItem("cityStorage");
    let cityArr;
    if (!cityStorage) {
      cityArr = [id];
      return localStorage.setItem("cityStorage", JSON.stringify(cityArr));
    }
    const cityStorageArr = JSON.parse(cityStorage);
    if (cityStorageArr.length >= 20) {
      setMessage({
        type: "error",
        message:
          "Can only save a maximum of 20 cities. Please remove from your currently saved cities to add new ones."
      });
      return setInterval(() => setMessage(null), 5000);
    }
    if (!cityStorageArr.includes(id)) {
      cityArr = cityStorageArr.push(id);
      localStorage.setItem("cityStorage", JSON.stringify(cityStorageArr));
      setCitiesData([...citiesData, weather]);
      setWeather(null);
      setMessage({ type: "success", message: "City added successfully." });
      return setInterval(() => setMessage(null), 5000);
    }
  };

  const removeCity = id => {
    const filteredStorage = JSON.parse(
      localStorage.getItem("cityStorage")
    ).filter(cityId => cityId !== id);

    localStorage.setItem("cityStorage", JSON.stringify(filteredStorage));
    const updatedCities = citiesData.filter(city => city.id !== id);

    setCitiesData(updatedCities);
    setMessage({ type: "success", message: "Successfully removed city." });
    return setInterval(() => setMessage(null), 5000);
  };

  useEffect(
    () => {
      fetchSavedCities();
      return () => clearInterval();
    },
    [fetchingCities]
  );

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
