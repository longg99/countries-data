import { useState, useEffect, useMemo } from "react";
import "./index.css";
import {
  getAllStates,
  getAllCountries,
  getCountryInfo,
  getAllCities,
} from "./Components/apis";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Container, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import isEmpty from "lodash";
import { FixedSizeList } from "react-window";

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
  // for dark/light mode
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

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

  // render the loading text
  const renderLoadingCountry = () => {
    if (loadingCountry)
      return (
        <Stack
          sx={{ color: "grey.500" }}
          spacing={2}
          direction="row"
          marginTop="3vh"
        >
          <LinearProgress />
          <Typography>Please wait, country data is loading...</Typography>
        </Stack>
      );
  };

  const renderLoadingStates = () => {
    // if loading and user has selected a country
    if (loadingState && selectedCountry !== "") {
      return (
        <Stack
          sx={{ color: "grey.500" }}
          spacing={2}
          direction="column"
          marginTop="3vh"
        >
          <LinearProgress />
          <Typography>
            Please wait, loading the information for {selectedCountry}...
          </Typography>
        </Stack>
      );
    }
  };

  // render the search box
  const renderSearchCountry = () => {
    if (!loadingCountry) {
      return (
        <Box>
          <Typography variant="h5" marginBottom="3vh" textAlign="center">
            Hi there! Please enter or choose a country to begin.
          </Typography>

          <Autocomplete
            id="country-select-demo"
            onChange={(event, newCountry) => {
              if (newCountry != null) {
                // set the new country's data
                setSelectedCountry(newCountry.name);
                setSelectedCountryISO2(newCountry.alpha2Code);
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
        </Box>
      );
    }
  };

  const Row = (props) => {
    const item = props.data[props.index];
    return (
      <ListItem
        key={props.index}
        style={props.style}
        component="div"
        disablePadding
      >
        <ListItemButton>
          <ListItemText primary={item.name} />
        </ListItemButton>
      </ListItem>
    );
  };

  // render the info for a given country
  const renderCountryInfo = () => {
    if (!loadingState && selectedCountry !== "") {
      const commonName =
        countryInfo.name.nativeName !== undefined
          ? countryInfo.name.nativeName[
              Object.keys(countryInfo.name.nativeName)[0]
            ].common
          : countryInfo.name.common;
      const commonOfficial =
        countryInfo.name.nativeName !== undefined
          ? countryInfo.name.nativeName[
              Object.keys(countryInfo.name.nativeName)[0]
            ].official
          : countryInfo.name.official;
      const flagImg = countryInfo.flags.svg;
      // all languages of that country
      let languages = [];
      for (const language in countryInfo.languages) {
        languages.push(countryInfo.languages[language]);
      }
      // first check the phone code is empty or not
      // if suffixes are too long, only need root
      const phoneCode = !isEmpty(countryInfo.idd)
        ? countryInfo.idd.suffixes.length < 3
          ? countryInfo.idd.root + countryInfo.idd.suffixes.join("")
          : countryInfo.idd.root
        : "N/A";

      return (
        <Grid container spacing={0} alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography
              variant="h4"
              marginTop="3vh"
              marginBottom="3vh"
              textAlign="center"
            >
              {countryInfo.name.official}{" "}
              <span className="flag">{countryInfo.flag}</span>
            </Typography>
          </Grid>
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item md={3} sm={6} xs={12} marginBottom="2vh">
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={flagImg}
                  alt={countryInfo.name.official + " flag"}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {countryInfo.name.official}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    href={countryInfo.maps.googleMaps}
                    target="_blank"
                  >
                    See on Google Maps
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Box sx={{ fontWeight: "medium" }}>Country Information:</Box>
              <p>
                <span className="flag">{countryInfo.flag}</span> Official Name:{" "}
                {countryInfo.name.official}{" "}
              </p>
              <p>
                <span className="flag">{countryInfo.flag}</span> Native name:{" "}
                {commonName}
              </p>
              <p>
                <span className="flag">{countryInfo.flag}</span> Native official
                name: {commonOfficial}
              </p>

              <p>🌎 Region: {countryInfo.region}</p>
              <p>🌎 Sub Region: {countryInfo.subregion}</p>
              <p>
                🏙️ Capital:{" "}
                {countryInfo.capital !== undefined
                  ? countryInfo.capital[0]
                  : "N/A"}
              </p>
              <p>
                🧑🏼‍🤝‍🧑🏾 Population:{" "}
                {countryInfo.population
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </p>
              <p>
                🌐 Languages(s):{" "}
                {!(languages.length === 0) ? languages.join(", ") : "N/A"}
              </p>
              <p>
                💳 Currency:{" "}
                {countryInfo.currencies !== undefined
                  ? Object.keys(countryInfo.currencies)[0] +
                    " (" +
                    countryInfo.currencies[
                      Object.keys(countryInfo.currencies)[0]
                    ].name +
                    ")"
                  : "N/A"}
              </p>
              <p>☎️ Phone code: {phoneCode}</p>
              <p>🕰️ Timezone(s): {countryInfo.timezones.join(", ")}</p>
              <p>🚗 Driving side: {countryInfo.car.side}</p>
              <p>📅 First day of week: {countryInfo.startOfWeek}</p>
            </Grid>

            <Grid item md={3} sm={6} xs={12}>
              <Box sx={{ fontWeight: "medium" }} marginBottom="1vh">
                States/Major Cities:
              </Box>
              <Accordion sx={{ marginBottom: "3vh" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>List of states</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FixedSizeList
                    height={400}
                    width="100%"
                    itemCount={states.length}
                    itemSize={40}
                    itemData={states}
                    overscanCount={5}
                  >
                    {Row}
                  </FixedSizeList>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Box>
                <Box sx={{ fontWeight: "medium" }} marginBottom="1vh">
                  All Cities:
                </Box>
              </Box>{" "}
              <Accordion sx={{ marginBottom: "4vh" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>List of cities</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FixedSizeList
                    height={400}
                    width="100%"
                    itemCount={cities.length}
                    itemSize={40}
                    itemData={cities}
                    overscanCount={5}
                  >
                    {Row}
                  </FixedSizeList>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Grid>
      );
    }
  };

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
        <IconButton
          sx={{ ml: 2 }}
          onClick={colorMode.toggleColorMode}
          color="inherit"
        >
          {theme.palette.mode === "dark" ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )}
        </IconButton>

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
      </Box>
    </ThemeProvider>
  );
}

export default App;
