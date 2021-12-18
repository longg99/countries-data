import axios from "axios";

// custom options for CountryStateCity API
const options = {
  headers: {
    // the API key
    "X-CSCAPI-KEY": "ZkpHNldxY29GOTVucTNmQTFrVVFuSDU4cE9qenRwOVpRRThYTDMwQw==",
  },
  redirect: "follow",
};

// get all countries using RestCountries API
// use v2 for sorted results
export const getAllCountries = async () =>
  await axios.get("https://restcountries.com/v2/all");

// get all states, given a country using CountryStateCity API
export const getAllStates = async (country) =>
  // pass the option param
  await axios.get(
    `https://api.countrystatecity.in/v1/countries/${country}/states`,
    options
  );

// get the information of a given country
export const getCountryInfo = async (country) =>
  await axios.get(`https://restcountries.com/v3.1/alpha/${country}`);

// get all cities
export const getAllCities = async (country) =>
  // pass the option param
  await axios.get(
    `https://api.countrystatecity.in/v1/countries/${country}/cities`,
    options
  );
