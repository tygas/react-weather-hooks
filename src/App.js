import React, { useState, useEffect } from "react";
import countryCodes from "./data/countries";
import axios from "axios";

const App = () => {
  const [weather, setWeather] = useState(null);
  const [countryCode, setCountryCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [cityIds, setCityIds] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [message, setMessage] = useState(null);
  const [fetchingCities, setFetchingCities] = useState(true);

  const fetchSavedCities = async () => {
    const cityStorage = localStorage.getItem("cityStorage");
    const queryArr = cityStorage ? JSON.parse(cityStorage) : [];
    if (queryArr.length) {
      const { data } = await axios.get(
        `http://api.openweathermap.org/data/2.5/group?id=${queryArr.join(
          ","
        )}&units=metric&appid=${process.env.REACT_APP_OWM_KEY}`
      );
      console.log(data);
      setCityIds([...queryArr]);
      setCitiesData([...data.list]);
      setFetchingCities(false);
    } else {
      setFetchingCities(false);
    }
  };

  const fetchWeather = async city => {
    try {
      if (searchQuery) {
        if (countryCode) city += `,${countryCode}`;
        const { data } = await axios.get(
          `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${
            process.env.REACT_APP_OWM_KEY
          }&units=metric`
        );
        console.log(data);
        setWeather(data);
      }
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
      console.log("ERROR HERE", citiesData);
      setCitiesData([...citiesData, weather]);
      setWeather(null);
      setSearchQuery("");
      setMessage({ type: "success", message: "City added successfully." });
      return setInterval(() => setMessage(null), 5000);
    }
  };

  const onChangeCountry = e => {
    setCountryCode(e.target.value);
  };

  const removeCity = id => {
    console.log(id);
    const filteredStorage = JSON.parse(
      localStorage.getItem("cityStorage")
    ).filter(cityId => cityId !== id);
    console.log(filteredStorage);
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
      <br />
      <label htmlFor="city">City:</label>
      <input
        name="city"
        onChange={e => {
          setSearchQuery(e.target.value);
        }}
        value={searchQuery}
      />
      <label htmlFor="countries_select">Country (Optional):</label>
      <select onChange={e => onChangeCountry(e)} id="countries_select">
        <option value="" />
        {countryCodes.map(country => (
          <option key={country.Code} value={country.Code}>
            {country.Name}
          </option>
        ))}
      </select>
      <button
        variant="contained"
        onClick={() => fetchWeather(searchQuery)}
        disabled={searchQuery.length < 1}
      >
        Search
      </button>
      {weather && (
        <div>
          <h3>
            {weather.name}, {weather.sys.country}
          </h3>
          <p>{weather.main.temp}</p>
          <p>{weather.weather[0].description}</p>
          {!cityIds.includes(weather.id) && (
            <button onClick={() => onSaveCity(weather.id)}>Save</button>
          )}
        </div>
      )}
      {message && (
        <div>
          <p>{message.message}</p>
        </div>
      )}
      {fetchingCities && <div>Fetching your cities...</div>}
      {citiesData &&
        citiesData.map(weather => (
          <div key={weather.id}>
            <h3>
              {weather.name}, {weather.sys.country}
            </h3>
            <p>{weather.main.temp}</p>
            <p>{weather.weather[0].description}</p>
            <button onClick={() => removeCity(weather.id)}>Remove</button>
          </div>
        ))}
    </div>
  );
};

export default App;
