import { Box } from "@mui/material";

export default function MiniAlert({ alert }) {
  return (
    <Box
      key={alert.id}
      sx={{
        backgroundColor:
          alert.temperature >= 43 ? "error.light" : "warning.light",
        px: 2,
        py: 1,
        my: 1,
        borderRadius: 5,
        width: "250px",
      }}
    >
      <div>
        <b>{alert.temperature}&deg;F</b> {alert.piler_name}
      </div>
      <div>{alert.temperature_time}</div>
    </Box>
  );
}
