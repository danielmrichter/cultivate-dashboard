import React, { useState } from "react";
import { Snackbar, Button, Box } from "@mui/material";



  function TemperatureWarning() {
  const [temperature, setTemperature] = useState(30); // Default low temperature
  const [open, setOpen] = useState(false); // Snackbar state


  const handleMarkResolved = (warningId) => {
        console.log('handled')
  }
  const beetData = {
    temp:42,
    name:'Piler 5',
    warning_id:4,
    time: '8:23'
}
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={true}
          key={beetData.warning_id}>
          <Box  sx={{ backgroundColor:'yellow', p:2, borderRadius:1}}>
            <strong>Warning</strong>
            <p>Piler {beetData.name} has a higher temp reading:</p>
            <p>{beetData.temp} {beetData.time}</p>
            <Button onClick={()=>{handleMarkResolved(beetData.warning_id)}} >Mark Resolved</Button>
            <Button onClick={setOpen(false)}>Dismiss</Button>


        </Box>
      </Snackbar>
      </div>
    );
  }

  export default TemperatureWarning;

