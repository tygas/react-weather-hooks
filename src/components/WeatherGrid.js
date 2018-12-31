import React from "react";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

import WeatherCard from "./WeatherCard";

const WeatherGrid = ({ citiesData, removeCity, classes }) => {
  return (
    <Grid
      container
      justify="space-evenly"
      spacing={16}
      className={classes.grid}
    >
      {citiesData &&
        citiesData.map(weather => (
          <Grid xs={12} sm={6} md={4} lg={3} xl={2} key={weather.id} item>
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

const styles = theme => ({
  grid: {
    padding: `${theme.spacing.unit}px`
  }
});

export default withStyles(styles)(WeatherGrid);
