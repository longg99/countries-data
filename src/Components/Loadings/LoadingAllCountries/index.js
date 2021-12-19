import { Typography, Stack, LinearProgress } from "@mui/material";

export default function LoadingCountries({ loadingCountry, error }) {
  if (!loadingCountry || error !== "") return null;
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
}
