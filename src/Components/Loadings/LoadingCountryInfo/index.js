import { Typography, Stack, LinearProgress } from "@mui/material";

export default function LoadingCountryInfo({ loadingState, selectedCountry }) {
  // if loading and user has selected a country
  if (!loadingState || selectedCountry === "") return null;
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
