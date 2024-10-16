import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

export default function UpdateTicket({open, cancelFn, confirmFn}) {
  return (
    <Dialog open={open}>
      <DialogTitle>{"Update Ticket?"}</DialogTitle>
      <DialogContent>
        <DialogContentText>Do you want to update the ticket?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelFn} color="primary">
          Cancel
        </Button>
        <Button onClick={confirmFn} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
