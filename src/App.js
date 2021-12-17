import { useState, useEffect } from "react";
import "./index.css";
import {
  getAllStates,
  getAllCountries,
  getCountryInfo,
} from "./Components/apis";
import _ from "lodash";

function App() {
  // the list of countries
  const [countries, setCountries] = useState([]);
  const [loadingCountry, setLoadingCountry] = useState(true);
  // const [loadingCity, setLoadingCity] = useState(true);
  const [loadingState, setLoadingState] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("");
  // the list of cities
  // const [cities, setCities] = useState([]);
  // the list of states
  const [states, setStates] = useState([]);
  // the information of a given country
  const [countryInfo, setCountryInfo] = useState({});
  // user's selected ISO2
  const [selectedCountryISO2, setSelectedCountryISO2] = useState("");

  // call API upon load
  useEffect(() => {
    // get request
    getAllCountries().then(
      (response) => {
        console.log("response: ", response);
        setCountries(response.data);
        setLoadingCountry(false);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  // call API upon receiving a country
  useEffect(() => {
    // only if we have a country call this API
    if (selectedCountryISO2 !== "") {
      // get request for all states
      getAllStates(selectedCountryISO2).then(
        (response) => {
          console.log("states response: ", response);
          setStates(response.data);
          setLoadingState(false);
        },
        (error) => {
          console.log(error);
        }
      );

      // get request for country's data
      getCountryInfo(selectedCountryISO2).then(
        (response) => {
          console.log("country info: ", response);
          setCountryInfo(response.data);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, [selectedCountryISO2]);

  // render the loading text
  const renderLoadingCountry = () => {
    if (loadingCountry) return <div>Data is loading...</div>;
  };

  const changeCountry = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedCountryISO2(
      e.target[e.target.selectedIndex].getAttribute("data-iso2")
    );
    setLoadingState(true);
  };

  const renderSelected = () => {
    if (selectedCountry !== "")
      return <div>User has selected {selectedCountry}</div>;
  };

  const renderLoadingStates = () => {
    // if loading and user has selected a country
    if (loadingState && selectedCountry !== "") {
      return (
        <div>
          Loading the list of states/major cities for {selectedCountry}...
        </div>
      );
    }
  };

  const renderStates = () => {
    if (!loadingState) {
      return (
        <div className="states">
          List of states/major cities:
          <ul>
            {states.map((state) => {
              return <li key={state["id"]}>{state["name"]}</li>;
            })}
          </ul>
        </div>
      );
    }
  };

  const renderSelectCountry = () => {
    if (!loadingCountry) {
      return (
        <div>
          <label htmlFor="countries"> Select a country: </label>
          <select
            name="countries"
            id="countries"
            onChange={(e) => changeCountry(e)}
            defaultValue=""
          >
            <option value="" disabled hidden></option>
            {countries.map((country) => {
              return (
                <option
                  key={country["id"]}
                  value={country["name"]}
                  data-iso2={country["iso2"]}
                >
                  {country["name"]}
                </option>
              );
            })}
          </select>
        </div>
      );
    }
  };

  // render the info for a given country
  const renderCountryInfo = () => {
    if (!loadingState) {
      return (
        <div className="countryInfo">
          <p>Name: {countryInfo.name}</p>
          <p>Native name: {countryInfo.native}</p>
          <p>Phone code: {"+" + countryInfo.phonecode}</p>
          <p>Region: {countryInfo.subregion}</p>
          <p>Capital: {countryInfo.capital}</p>
          <p>Currency: {countryInfo.currency}</p>
        </div>
      );
    }
  };

  return (
    <div className="App">
      {renderLoadingCountry()}
      {renderSelectCountry()}
      <div className="data">
        {renderSelected()}
        {renderLoadingStates()}
        {renderStates()}
        {renderCountryInfo()}
      </div>
    </div>
  );
}

export default App;
