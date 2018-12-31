const path = require("path");
const express = require("express");
const app = express();
const axios = require("axios");
const publicPath = path.join(__dirname, "..", "/build");
const port = process.env.PORT || 3030;
const keys = require("../config/keys");

app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.get("/api/forward/location", async (req, res) => {
  try {
    const location = req.query.q;
    const { data } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${
        keys.OWM_KEY
      }&units=metric`
    );
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "Could not process request." });
  }
});

app.get("/api/forward/list", async (req, res) => {
  try {
    const list = req.query.list;
    const { data } = await axios.get(
      `http://api.openweathermap.org/data/2.5/group?id=${list}&units=metric&appid=${
        keys.OWM_KEY
      }&units=metric`
    );
    res.status(200).send(data);
  } catch (e) {
    res.status(400).send({ error: "Could not process request." });
  }
});

app.listen(port, () => {
  console.log("Server is up!");
  console.log("Running in: ", process.env.NODE_ENV);
});
