import axios from "axios";

const options = {
  headers: {
    // the API key
    "X-CSCAPI-KEY": "ZkpHNldxY29GOTVucTNmQTFrVVFuSDU4cE9qenRwOVpRRThYTDMwQw==",
  },
  redirect: "follow",
};

// get all countries
export const getAllCountries = async () =>
  // pass the option param
  await axios.get("https://api.countrystatecity.in/v1/countries", options);

// get all states, given a country
export const getAllStates = async (country) =>
  // pass the option param
  await axios.get(
    `https://api.countrystatecity.in/v1/countries/${country}/states`,
    options
  );

// get the information of a given country
export const getCountryInfo = async (country) =>
  // pass the option param
  await axios.get(
    `https://api.countrystatecity.in/v1/countries/${country}`,
    options
  );
