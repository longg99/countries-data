import { useState, useEffect, useMemo } from "react";
import "./index.css";
import {
  getAllStates,
  getAllCountries,
  getCountryInfo,
  getAllCities,
} from "./Components/apis";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import LoadingCountries from "./Components/Loadings/LoadingAllCountries";
import LoadingCountryInfo from "./Components/Loadings/LoadingCountryInfo";
import CountryInfo from "./Components/CountryInfo";
import CountrySearch from "./Components/CountrySearch";
import ThemeSwitch from "./Components/ThemeSwitch";

function App() {
  // the list of countries
  const [countries, setCountries] = useState([]);
  const [loadingCountry, setLoadingCountry] = useState(true);
  // const [loadingCity, setLoadingCity] = useState(true);
  const [loadingState, setLoadingState] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("");
  // the list of cities
  const [cities, setCities] = useState([]);
  // the list of states
  const [states, setStates] = useState([]);
  // the information of a given country
  const [countryInfo, setCountryInfo] = useState({});
  // user's selected ISO2
  const [selectedCountryISO2, setSelectedCountryISO2] = useState("");
  // for dark/light mode, light by default
  const [mode, setMode] = useState("light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

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

      // get all cities
      getAllCities(selectedCountryISO2).then(
        (response) => {
          console.log("cities response: ", response);
          setCities(response.data);
        },
        (error) => {
          console.log(error);
        }
      );

      // get request for country's data
      getCountryInfo(selectedCountryISO2).then(
        (response) => {
          console.log("country info: ", response);
          // the data is returned as an array with 1 elem, assign the first elem as
          // the obj to the countryInfo
          setCountryInfo(response.data[0]);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, [selectedCountryISO2]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          overflow: "hidden",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <ThemeSwitch theme={theme} setMode={setMode} />
        <Container>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontWeight: "light",
              fontSize: 18,
            }}
          >
            <LoadingCountries loadingCountry={loadingCountry} />
            <CountrySearch
              loadingCountry={loadingCountry}
              countries={countries}
              setSelectedCountry={setSelectedCountry}
              setSelectedCountryISO2={setSelectedCountryISO2}
              setLoadingState={setLoadingState}
            />
            <LoadingCountryInfo
              loadingState={loadingState}
              selectedCountry={selectedCountry}
            />
            <CountryInfo
              loadingState={loadingState}
              selectedCountry={selectedCountry}
              countryInfo={countryInfo}
              states={states}
              cities={cities}
            />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
