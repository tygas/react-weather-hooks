import React from "react";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";

import WeatherCard from "./WeatherCard";

const WeatherGrid = ({ citiesData, removeCity }) => {
  return (
    <Grid container spacing={16}>
      {citiesData &&
        citiesData.map(weather => (
          <Grid key={weather.id} item>
            <WeatherCard weather={weather}>
              <CardActions>
                <Button size="small" onClick={() => removeCity(weather.id)}>
                  Remove
                </Button>
                size="small"
              </CardActions>
            </WeatherCard>
          </Grid>
        ))}
    </Grid>
  );
};

export default WeatherGrid;
