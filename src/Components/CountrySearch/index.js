import { Typography, TextField, Box, Autocomplete } from "@mui/material";

// render the search box
export default function CountrySearch({
  loadingCountry,
  countries,
  setSelectedCountry,
  setSelectedCountryISO2,
  setLoadingState,
  error,
}) {
  // return null if list of country is loading or an error occurred
  if (loadingCountry || error !== "") return null;
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
