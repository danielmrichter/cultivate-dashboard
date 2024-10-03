import * as React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItemButton, ListItemText, Collapse, Box, Button, Link } from '@mui/material';
import ListSubheader from '@mui/material/ListSubheader';
import { useState } from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
import { useHistory, useEffect } from 'react-router-dom/cjs/react-router-dom.min';
import LogOutButton from '../AccountComponents/LogOutButton/LogOutButton';



export default function SiteManagerNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [nestedOpen, setNestedOpen] = useState(true);
  const user = useSelector((store) => store.user);
  const siteData = useSelector((store) => store.siteData)
  const history = useHistory();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch({type: 'GET_SITE_DATA', payload: user.site_id})
  },[]);
  
  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNestedClick = () => {
    setNestedOpen(!nestedOpen);
  };

  const handleNavigation = (path) => {
    history.push(path);
  };

  const drawerList = (
    <Box
      sx={{ width: 160 }}
      role="presentation"
    //   onClick={toggleDrawer(false)}
    //   onKeyDown={toggleDrawer(false)}
    >
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        // subheader={
        //   <ListSubheader component="div" id="nested-list-subheader">
        //     could put some instructions here if we think users need help
        //   </ListSubheader>
        // }
      >
        <ListItemButton key="dashboard" >
          <ListItemText primary="SITE DASHBOARD"
            onClick={() =>  { handleNavigation(`/site/${user.site_id}`);setDrawerOpen(false);}}
            onKeyDown={toggleDrawer(false)}/>
        </ListItemButton>

        <ListItemButton key="pilers"
            onClick={handleNestedClick} sx={{backgroundColor:'#F1F1F1'}}>
          <ListItemText primary="PILERS" />
          {nestedOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={nestedOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>

          {siteData[0] && siteData.map((site) => {
            return(
            <ListItemButton sx={{ pl: 4, backgroundColor:'#F1F1F1'}} 
                key={site.piler_id} >
                <ListItemText primary={site.name}  
                
                    onClick={() => {setDrawerOpen(false);handleNavigation(`/pilers/${site.piler_id}`)}}
                     />
            </ListItemButton>
        )})}
          </List>
        </Collapse>

        <ListItemButton key="alerts">
          <ListItemText primary="ALERT HISTORY"
            onClick={() => {setDrawerOpen(false);handleNavigation(`/alert-history/${user.site_id}`)}}
            onKeyDown={toggleDrawer(false)}/>
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <div>
      {/* AppBar and Toolbar for the Header */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Cultivate Site Manager
          </Typography>
                {/* Empty space to balance the title in the center */}
      <div style={{ width: 48 }} /> {/* Adjust width to match icon's space */}
      <LogOutButton />
        </Toolbar>
      </AppBar>

      {/* Drawer that opens below the AppBar */}
      <Drawer
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        variant="persistent"
        sx={{
          '& .MuiDrawer-paper': {
            marginTop: '64px', // AppBar height
            width: 160,
          },
        }}
      >
        {drawerList}
      </Drawer>
    </div>
  );
}
