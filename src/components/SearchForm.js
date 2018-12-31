import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";

import countryCodes from "../data/countries";

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
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <i className={`wi wi-sunrise ${classes.w_icon}`} />
        </Avatar>
        <FormControl className={classes.formControl}>
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
          <InputLabel htmlFor="countries_select">
            Country (optional):
          </InputLabel>
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
          className={classes.button}
          disabled={searchQuery.length < 1}
        >
          Search
        </Button>
      </Paper>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center"
  },
  paper: {
    width: "80%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit}px`,
    marginBottom: `${theme.spacing.unit * 2}px`,
    [theme.breakpoints.up("sm")]: {
      width: "50%"
    },
    [theme.breakpoints.up("md")]: {
      width: "30%"
    },
    [theme.breakpoints.up("lg")]: {
      width: "25%"
    },
    [theme.breakpoints.up("xl")]: {
      width: "20%"
    }
  },
  avatar: {
    backgroundColor: theme.palette.secondary.light,
    width: "56px",
    height: "56px"
  },
  w_icon: {
    fontSize: "40px"
  },
  formControl: {
    margin: theme.spacing.unit,
    width: 180
  },
  button: {
    marginTop: `${theme.spacing.unit}px`
  }
});

export default withStyles(styles)(SearchForm);
