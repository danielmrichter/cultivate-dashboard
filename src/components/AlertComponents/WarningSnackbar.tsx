import { useState, useEffect } from "react";
import { Snackbar, Button, Box, Typography } from "@mui/material";
import { useDispatch } from "react-redux";

function WarningSnackbar({ alert }) {
  const [open, setOpen] = useState(true); // Snackbar state
  const dispatch = useDispatch();
  const alertData = alert;

  // posts to alerts_users table that the alert has been seen
  useEffect(() => {
    dispatch({ type: "HAS_SEEN_ALERT", payload: alertData.alert_id });
  }, []);

  //marks an alert as resolved - that it's no longer active
  const handleMarkResolved = () => {
    dispatch({ type: "MARK_RESOLVED", payload: alertData.alert_id });
    setOpen(false);
  };

  const handleOnClose = (event, reason) => {
    if (reason !== "clickaway") {
      setOpen(false);
    }
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        key={alertData.alert_id}
        onClose={handleOnClose}
      >
        <Box sx={{ backgroundColor: "warning.main", p: 2, borderRadius: 3 }}>
          <strong>Warning</strong>
          <p>{alertData.pilerName} has a higher temp reading:</p>
          <Typography
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <p>Temp: {alertData.temperature}&deg;F</p>{" "}
            <p>Time: {alertData.temperature_time}</p>
          </Typography>
          <Button
            onClick={() => {
              handleMarkResolved();
            }}
          >
            Mark Resolved
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Dismiss
          </Button>
        </Box>
      </Snackbar>
    </div>
  );
}

export default WarningSnackbar;
