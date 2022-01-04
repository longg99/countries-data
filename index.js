// backend to call the API safely
// use express (nodejs web framework), cors (allows making request from one website to another)
// dotenv (loads var from .env) and axios

// listen on port 8000
const PORT = process.env.PORT || 8000;
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

// read from .env file
require("dotenv").config({ path: "./.env" });

const app = express();
// use cors
app.use(cors());

app.use(express.static(path.join(__dirname, "./build")));

app.get("/", (request, response, next) => {
  response.json("Hello world!");
});

app.get("/states/:country", (request, response, next) => {
  const country = request.params.country;
  // custom options for CountryStateCity API
  const options = {
    headers: {
      // the API key
      "X-CSCAPI-KEY": process.env.REACT_APP_COUNTRY_API_KEY,
    },
    redirect: "follow",
  };
  // pass the option param
  axios
    .get(
      `https://api.countrystatecity.in/v1/countries/${country}/states`,
      options
    )
    .then((res) => {
      // to json
      response.json(res.data);
    })
    .catch((err) => {
      next(err);
    });
});

app.get("/cities/:country", (request, response, next) => {
  const country = request.params.country;
  // custom options for CountryStateCity API
  const options = {
    headers: {
      // the API key
      "X-CSCAPI-KEY": process.env.REACT_APP_COUNTRY_API_KEY,
    },
    redirect: "follow",
  };
  // pass the option param
  axios
    .get(
      `https://api.countrystatecity.in/v1/countries/${country}/cities`,
      options
    )
    .then((res) => {
      // to json
      response.json(res.data);
    })
    .catch((err) => {
      next(err);
    });
});

app.get("*", (request, response) => {
  response.sendFile(path.join(__dirname, "./build/index.html"));
});

// listen to the changes
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
