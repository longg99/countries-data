import {
  Grid,
  Typography,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FixedSizeList } from "react-window";
import _ from "lodash";

// helper to get the row in the fixed size list
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
export default function CountryInfo({
  loadingState,
  selectedCountry,
  countryInfo,
  states,
  cities,
  error,
}) {
  if (loadingState || selectedCountry === "" || error !== "") return null;
  const commonName =
    countryInfo.name.nativeName !== undefined
      ? countryInfo.name.nativeName[Object.keys(countryInfo.name.nativeName)[0]]
          .common
      : countryInfo.name.common;
  const commonOfficial =
    countryInfo.name.nativeName !== undefined
      ? countryInfo.name.nativeName[Object.keys(countryInfo.name.nativeName)[0]]
          .official
      : countryInfo.name.official;
  const flagImg = countryInfo.flags.svg;
  // all languages of that country
  let languages = [];
  for (const language in countryInfo.languages) {
    languages.push(countryInfo.languages[language]);
  }
  // first check the phone code is empty or not
  // if suffixes are too long, only need root
  const phoneCode = _.isEmpty(countryInfo["idd"])
    ? "N/A"
    : countryInfo.idd.suffixes.length < 3
    ? countryInfo.idd.root + countryInfo.idd.suffixes.join("")
    : countryInfo.idd.root;

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
            {countryInfo.capital !== undefined ? countryInfo.capital[0] : "N/A"}
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
                countryInfo.currencies[Object.keys(countryInfo.currencies)[0]]
                  .name +
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
        <Grid item md={12} sm={12} xs={12}>
          <Box sx={{ minHeight: "10vh" }}></Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
