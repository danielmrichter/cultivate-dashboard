import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function AlertModal({ alert }) {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "HAS_SEEN_ALERT", payload: alert.alert_id });
  }, []);

  const handleClose = (event, reason) => {
    if (reason !== "clickaway") {
      setOpen(false);
    }
  };

  const handleMarkResolved = () => {
    dispatch({ type: "MARK_RESOLVED", payload: alert.alert_id });
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperComponent="Paper"
      PaperProps={{ sx: { backgroundColor: "error.light" } }}
    >
      <DialogTitle fontSize="2rem" id="alert-dialog-title">
        {"Alert: High Temperature Detected"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography fontSize="2rem" sx={{ fontWeight: "bold" }}>
            {alert.pilerName} has a high reading
          </Typography>
          <Typography fontSize="2rem" sx={{ fontWeight: "bold" }}>
            Temp: {alert.temperature}&deg;F
          </Typography>
          <Typography fontSize="2rem" sx={{ fontWeight: "bold" }}>
            Time: {alert.temperature_time}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleMarkResolved}>
          Mark As Resolved
        </Button>
        <Button variant="contained" onClick={handleClose} autoFocus>
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  );
}
