import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch } from "../../../hooks/reduxHooks";

const handleDeleteTicket = (beet_data_id) => {
  const dispatch = useAppDispatch();
  if (!beet_data_id) {
    console.error("Missing ticketId for delete operation.");
    return;
  }
  else{
    const userConfirm = window.confirm("Are you sure you want to delete this ticket?")
    if(userConfirm){
      dispatch({ type: "DELETE_PILER_TICKET", payload: { beet_data_id } });
    }
  }
};

// This columnsDef is used in a MUIX DataGrid component.
// It's a headache to look at, but defines what will be contained
// in each column.
export const columnsDef = [
    {
      field: "ticket_number",
      headerName: "Ticket #",
      editable: true,
      flex: 0.5,
    },
    { field: "temperature", headerName: "Temp", editable: true, flex: 0.5 },
    {
      field: "temperature_time",
      headerName: "Temperature Time",
      editable: true,
      flex: 1,
    },
    { field: "truck", headerName: "Truck", editable: true, flex: 0.5 },
    { field: "field", headerName: "Grower", editable: false, flex: 1 },
    {
      field: 'coordinates',
      headerName: 'Coordinates',
      flex: 1,
      renderCell: (params) => {
          const { coordinates } = params.row;
          if (coordinates && coordinates.x !== undefined && coordinates.y !== undefined) {
              return (
                  <Box
                  sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      height: '100%',
                  }}
              >
                  <Typography fontSize={12}>
                      {Number.parseFloat(coordinates.x).toFixed(3)}, {Number.parseFloat(coordinates.y).toFixed(3)}
                  </Typography>
              </Box>);
          }
          return 'N/A';
      },
  },
    { field: "updated_at", headerName: "Last Updated", flex: 1 },
    {
      field: "markResolved",
      headerName: "",
      flex: 0.5,
      renderCell: (params) => (
        <Button
          sx={{
            backgroundColor: "error.main",
            color: "white",
            "&:hover": { backgroundColor: "primary.main" },
          }}
          onClick={() => {
            handleDeleteTicket(params.row.beet_data_id);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];