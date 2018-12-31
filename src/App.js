import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";

import axios from "axios";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardHeader,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import countryCodes from "./data/countries";

const SearchForm = ({ classes, fetchWeather }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [countryCode, setCountryCode] = useState("");

  const onSearch = e => {
    fetchWeather(e, searchQuery, countryCode);
    setSearchQuery("");
    setCountryCode("");
  };

  return (
    <form className={classes.form} onSubmit={e => onSearch(e)}>
      <FormControl>
        <TextField
          label="City"
          name="city"
          onChange={e => {
            setSearchQuery(e.target.value);
          }}
          value={searchQuery}
        />
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="countries_select">Country (optional):</InputLabel>
        <Select
          native
          value={countryCode}
          inputProps={{
            name: "countries_select",
            id: "countries_select"
          }}
          onChange={e => setCountryCode(e.target.value)}
        >
          <option value="" />
          {countryCodes.map(country => (
            <option key={country.Code} value={country.Code}>
              {country.Name}
            </option>
          ))}
        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={searchQuery.length < 1}
      >
        Search
      </Button>
    </form>
  );
};

const formStyles = theme => ({
  form: {
    width: "50%",
    display: "flex",
    alignItems: "center",
    marginBottom: `${theme.spacing.unit * 2}px`
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  searchCard: {
    width: "250px"
  }
});

const StyleWrappedSearchForm = withStyles(formStyles)(SearchForm);

const App = ({ classes }) => {
  const [weather, setWeather] = useState(null);
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

  const fetchWeather = async (e, city, countryCode) => {
    try {
      e.preventDefault();
      if (countryCode) city += `,${countryCode}`;
      const { data } = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${
          process.env.REACT_APP_OWM_KEY
        }&units=metric`
      );
      console.log(data);
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
      console.log("ERROR HERE", citiesData);
      setCitiesData([...citiesData, weather]);
      setWeather(null);
      setMessage({ type: "success", message: "City added successfully." });
      return setInterval(() => setMessage(null), 5000);
    }
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

      <StyleWrappedSearchForm fetchWeather={fetchWeather} />

      {weather && (
        <Card className={classes.searchCard}>
          <CardContent>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {weather.name}, {weather.sys.country}
              </Typography>
              <i
                className={`wi wi-owm-${weather.weather[0].id} w-icon ${
                  classes.w_icon
                }`}
              />
              <Typography component="p">
                {weather.weather[0].description}
              </Typography>
              <Typography variant="h5" component="h2">
                {Math.round(weather.main.temp)} &#8451;
              </Typography>
            </CardContent>
          </CardContent>
          <CardActions>
            {!cityIds.includes(weather.id) && (
              <Button
                size="small"
                color="primary"
                onClick={() => onSaveCity(weather.id)}
              >
                Save
              </Button>
            )}
          </CardActions>
        </Card>
      )}
      {message && (
        <div>
          <p>{message.message}</p>
        </div>
      )}
      {fetchingCities && <div>Fetching your cities...</div>}
      <Grid container spacing={16}>
        {citiesData &&
          citiesData.map(weather => (
            <Grid item>
              <Card className={classes.searchCard}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {weather.name}, {weather.sys.country}
                  </Typography>
                  <i
                    className={`wi wi-owm-${weather.weather[0].id} w-icon ${
                      classes.w_icon
                    }`}
                  />
                  <Typography component="p">
                    {weather.weather[0].description}
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {Math.round(weather.main.temp)} &#8451;
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => removeCity(weather.id)}>
                    Remove
                  </Button>
                  size="small"
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

const styles = theme => ({
  form: {
    width: "50%",
    display: "flex",
    alignItems: "center",
    marginBottom: `${theme.spacing.unit * 2}px`
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  searchCard: {
    width: "250px"
  },
  w_icon: {
    fontSize: "72px",
    marginBottom: `${theme.spacing.unit * 2}px`
  }
});

export default withStyles(styles)(App);
