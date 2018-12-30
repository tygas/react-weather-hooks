import React, { useState, useEffect } from "react";
import countryCodes from "./data/countries";
import axios from "axios";

const App = () => {
  const [weather, setWeather] = useState(null);
  const [countryCode, setCountryCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [citiesData, setCitiesData] = useState(null);

  const fetchSavedCities = async () => {
    const cityStorage = localStorage.getItem("cityStorage");
    if (cityStorage) {
      const queryString = JSON.parse(cityStorage).join(",");
      const { data } = await axios.get(
        `http://api.openweathermap.org/data/2.5/group?id=${queryString}&units=metric&appid=${
          process.env.REACT_APP_OWM_KEY
        }`
      );
      console.log(data);
      setCitiesData([...data.list]);
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
      console.log(e);
    }
  };

  const onSaveCity = id => {
    const cityStorage = localStorage.getItem("cityStorage");
    let cityArr;
    if (!cityStorage) {
      cityArr = [id];
      return localStorage.setItem("cityStorage", JSON.stringify(cityArr));
    }
    const parsedCityStorage = JSON.parse(cityStorage);
    if (!parsedCityStorage.includes(id)) {
      cityArr = parsedCityStorage.push(id);
      localStorage.setItem("cityStorage", JSON.stringify(parsedCityStorage));
      setCitiesData([...citiesData, weather]);
      setWeather(null);
      setSearchQuery("");
    }
  };

  const onChangeCountry = e => {
    setCountryCode(e.target.value);
  };

  useEffect(() => {
    fetchSavedCities();
  }, []);

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
      <button variant="contained" onClick={() => fetchWeather(searchQuery)}>
        Search
      </button>
      {weather ? (
        <div>
          <h3>
            {weather.name}, {weather.sys.country}
          </h3>
          <p>{weather.main.temp}</p>
          <p>{weather.weather[0].description}</p>
          <button onClick={() => onSaveCity(weather.id)}>Save</button>
        </div>
      ) : null}

      {citiesData &&
        citiesData.map(weather => (
          <div key={weather.id}>
            <h3>
              {weather.name}, {weather.sys.country}
            </h3>
            <p>{weather.main.temp}</p>
            <p>{weather.weather[0].description}</p>
          </div>
        ))}
    </div>
  );
};

export default App;
