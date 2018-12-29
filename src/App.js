import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [weather, setWeather] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchWeather = async city => {
    if (searchQuery) {
      const { data } = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${
          process.env.REACT_APP_OW_KEY
        }&units=metric`
      );
      console.log(data);
      setWeather(data);
    }
  };

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
          <p>Rendered</p>
          <h3>
            {weather.name}, {weather.sys.country}
          </h3>
          <p>{weather.main.temp}</p>
        </div>
      ) : null}
    </div>
  );
};

export default App;
