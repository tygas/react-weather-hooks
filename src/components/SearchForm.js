import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
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
  }
});

export default withStyles(styles)(SearchForm);
