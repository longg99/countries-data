import axios from "axios";

// get all countries using RestCountries API
// use v2 for sorted results
export const getAllCountries = async () =>
  await axios.get("https://restcountries.com/v2/all");

// get all states, given a country using our backend
export const getAllStates = async (country) =>
  // pass the option param
  await axios.get(`http://localhost:8000/states/${country}`);

// get the information of a given country
export const getCountryInfo = async (country) =>
  await axios.get(`https://restcountries.com/v3.1/alpha/${country}`);

// get all cities from our backend
export const getAllCities = async (country) =>
  // pass the option param
  await axios.get(`http://localhost:8000/cities/${country}`);
