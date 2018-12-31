# React Weather App

### [Link To Live Deployment on Heroku](https://react-weather-hooks.herokuapp.com/)

A simple react weather app that saves up to 20 locations.

Uses the Open Weather Map API. Locations are saved in local storage.

The requests to Open Weather Map's API is done through the server (for good practice to avoid exposing the API key).

### Getting started

- Needs an OWM API key (free from [OWM](https://openweathermap.org/api))

- git clone `git@github.com:samokasha/react-weather-hooks.git`

- Export OWM_KEY="YOUR_API_KEY" in `config/dev.js`.

- `npm run dev to run` in development.

- Configured to deploy on Heroku.

### License

The MIT License

Copyright (c) 2019 Sam Okasha

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
