import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const WeatherCard = ({ weather, classes, children }) => {
  return (
    <Card className={classes.weatherCard}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {weather.name}, {weather.sys.country}
        </Typography>
        <i
          className={`wi wi-owm-${weather.weather[0].id} w-icon ${
            classes.w_icon
          }`}
        />
        <Typography component="p">{weather.weather[0].description}</Typography>
        <Typography variant="h5" component="h2">
          {Math.round(weather.main.temp)} &#8451;
        </Typography>
      </CardContent>
      {children}
    </Card>
  );
};

const styles = theme => ({
  w_icon: {
    display: "flex",
    justifyContent: "center",
    color: theme.palette.primary.light,
    fontSize: "72px",
    margin: `${theme.spacing.unit * 4}px`
  }
});

export default withStyles(styles)(WeatherCard);
