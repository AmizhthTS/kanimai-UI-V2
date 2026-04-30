import { MenuItem, TextField, Box } from "@mui/material";

const CountryCodeSelect = ({ countryCode, onChange, countryList }) => {
  return (
    <TextField
      select
      value={countryCode}
      onChange={onChange}
      variant="standard"
      sx={{
        minWidth: "80px",
        "& fieldset": { border: "none" },
        "& .MuiInput-underline:before": { borderBottom: "none" },
        "& .MuiInput-underline:after": { borderBottom: "none" },
        "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
          borderBottom: "none",
        },
      }}
    >
      {countryList.map((country) => (
        <MenuItem key={country.code} value={country.code}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <img src={country.flag} width="20" height="14" />
            {country.code}
          </Box>
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CountryCodeSelect;
