import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [weather, setWeather] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityIds, setCityIds] = useState([]);
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
    if (searchQuery) {
      const { data } = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${
          process.env.REACT_APP_OWM_KEY
        }&units=metric`
      );
      console.log(data);
      setWeather(data);
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
    }
  };

  useEffect(() => fetchSavedCities(), []);

  return (
    <div>
      <br />
      <input
        onChange={e => {
          setSearchQuery(e.target.value);
        }}
        value={searchQuery}
      />
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
          <div>
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
