import { useState, useEffect } from "react";
import "./index.css";
import {
  getAllStates,
  getAllCountries,
  getCountryInfo,
} from "./Components/apis";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Container, Typography } from "@mui/material";
// import Accordion from "@mui/material/Accordion";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

  // render the search box
  const renderSearchCountry = () => {
    if (!loadingCountry) {
      return (
        <div>
          <Typography variant="h5" marginBottom="1vh" textAlign="center">
            Hi there! Please enter or choose a country to begin.
          </Typography>
          <Autocomplete
            id="country-select-demo"
            onChange={(event, newCountry) => {
              if (newCountry != null) {
                // set the new country's data
                setSelectedCountry(newCountry.name);
                setSelectedCountryISO2(newCountry.iso2);
                // show loading text
                setLoadingState(true);
              }
            }}
            options={countries}
            autoHighlight
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option.name}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose a country"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "off", // disable autocomplete and autofill
                }}
              />
            )}
          />
        </div>
      );
    }
  };

  // render the info for a given country
  const renderCountryInfo = () => {
    if (!loadingState && selectedCountry !== "") {
      return (
        <Box>
          <Typography
            variant="h5"
            marginTop="1vh"
            marginBottom="1vh"
            textAlign="center"
          >
            {selectedCountry}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10vw",
            }}
          >
            <Box>
              <Box sx={{ fontWeight: "medium" }}>Country Information:</Box>
              <p>
                <span className="flag">{countryInfo.emoji}</span> Name:{" "}
                {countryInfo.name}{" "}
              </p>
              <p>
                <span className="flag">{countryInfo.emoji}</span> Native name:{" "}
                {countryInfo.native}
              </p>
              <p>☎️ Phone code: {"+" + countryInfo.phonecode}</p>
              <p>🌎 Region: {countryInfo.subregion}</p>
              <p>🏙️ Capital: {countryInfo.capital}</p>
              <p>💳 Currency: {countryInfo.currency}</p>
            </Box>

            <Box>
              <Box sx={{ fontWeight: "medium" }}>
                List of states/major cities:
                <Box sx={{ typography: "subtitle2" }}>
                  Click on a state to see its cities.
                </Box>
              </Box>
              <Box sx={{ maxHeight: "60vh", overflowY: "scroll" }}>
                {states.map((state) => {
                  return (
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>{state["name"]}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography key={state["id"]}></Typography>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>
      );
    }
  };

  return (
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
        {renderLoadingCountry()}
        {renderSearchCountry()}

        {renderLoadingStates()}
        {renderCountryInfo()}
      </Box>
    </Container>
  );
}

export default App;
