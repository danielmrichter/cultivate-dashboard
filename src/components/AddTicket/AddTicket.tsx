import {
    Paper,
    Box,
    Button,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
  } from "@mui/material";
  import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
  import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
  import {
    useNavigate,
    useParams,
  } from "react-router-dom";
  import { ArrowBack } from "@mui/icons-material";
  import { useEffect, useState } from "react";
  import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
  import dayjs from 'dayjs';
  
  export default function AddTicket() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const growers = useAppSelector((store) => store.growers);
    const { pilerId } = useParams();
  
    // form field values
    const [ticketNum, setTicketNum] = useState(null);
    const [grower, setGrower] = useState('');
    const [temperature, setTemperature] = useState(null);
    const [tempTime, setTempTime] = useState(null);
    const [truckNum, setTruckNum] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [piler_id, setPilerId] = useState(pilerId);
    const [beetbox_id, setBeetboxId] = useState(null);
  
    useEffect(() => {
      dispatch({ type: "FETCH_GROWERS" });
    }, [dispatch]);
  
    const handleChange = (event) => {
      setGrower(event.target.value);
    };
  
    const handleBackClick = () => {
      navigate(`/piler-details/${pilerId}`);
    };
  
    const submitTicket = () => {
      let ticketToSubmit = {
        ticket_number: Number(ticketNum),
        grower_id: grower,
        truck: truckNum,
        temperature: Number(temperature),
        temperature_time: tempTime,
        latitude: Number(latitude),
        longitude: Number(longitude),
        piler_id: piler_id,
        beetbox_id: beetbox_id,
      };
  
      dispatch({ type: "ADD_TICKET", payload: ticketToSubmit });
      handleBackClick();
    };
  
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          width: "100%",
          height: "100vh",
          padding: 4,
        }}
      >
        <Box>
          <Typography variant="h4">
            <b>Add Ticket:</b>
          </Typography>
          <Button sx={{ mb: 4 }} onClick={handleBackClick}>
            <ArrowBack />
            Return to Piler
          </Button>
        </Box>
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            padding: 4,
            width: "80%",
            alignSelf: "center",
          }}
        >
          <TextField
            fullWidth
            required
            type="number"
            label="Ticket Number"
            value={ticketNum}
            onChange={(event) => {
              setTicketNum(event.target.value);
            }}
          />
          <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel id="grower-select-label">Grower:</InputLabel>
              <Select
                required
                labelId="grower-select-label"
                value={grower}
                label="Grower:"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Select Grower:</em>
                </MenuItem>
                {growers.length > 0 ? (
                  growers.map((grower) => (
                    <MenuItem key={grower.id} value={grower.id}>
                      {grower.field}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No growers available</MenuItem>
                )}
              </Select>
            </FormControl>
            <TextField
              sx={{ flex: 1 }}
              required
              label="Truck #"
              value={truckNum}
              onChange={(event) => {
                setTruckNum(event.target.value);
              }}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <TextField
              required
              sx={{ flex: 1 }}
              label="Temperature"
              value={temperature}
              type="number"
              onChange={(event) => {
                setTemperature(event.target.value);
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Temperature Time"
                sx={{ flex: 1 }}
                value={tempTime}
                onChange={(newValue) => setTempTime(dayjs(newValue))}
              />
            </LocalizationProvider>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <TextField
              label="Piler"
              disabled
              sx={{ flexGrow: 1 }}
              value={piler_id}
              onChange={(event) => setPilerId(event.target.value)}
            />
            <TextField
              label="BeetBox Id"
              sx={{ flexGrow: 1 }}
              value={beetbox_id}
              onChange={(event) => setBeetboxId(event.target.value)}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <TextField
              sx={{ flex: 1 }}
              label="Longitude:"
              value={longitude}
              onChange={(event) => setLongitude(event.target.value)}
            />
            <TextField
              sx={{ flex: 1 }}
              label="Latitude:"
              value={latitude}
              onChange={(event) => setLatitude(event.target.value)}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              width: "100%",
              gap: 4,
            }}
          >
            <Button
              variant="outlined"
              sx={{ borderRadius: 15 }}
              onClick={handleBackClick}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ borderRadius: 15 }}
              onClick={submitTicket}
            >
              Add Ticket
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }  