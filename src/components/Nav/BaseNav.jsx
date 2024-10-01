import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';



function BaseNav() {


  return (
    <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
        Cultivate
      </Typography>
    </Toolbar>
  </AppBar>
  );
}

export default BaseNav