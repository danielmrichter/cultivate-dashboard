
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, 
         Toolbar, 
         Typography, 
         IconButton, 
         Menu, MenuItem, 
         Button, 
        } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu'  
import ArrowRight from '@mui/icons-material/ArrowRight'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function GenManagerNav() {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((store) => store.user);
  const siteList = useSelector((store) => store.siteList);
  const [anchorEl, setAnchorEl] = useState(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false)
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)


  useEffect(() => {
    dispatch({type: 'GET_SITE_LIST'})
  },[]);

  // Main Menu handlers
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMainMenuOpen(true)
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSubmenuAnchorEl(null);
    setIsMainMenuOpen(false)
  };

  // Submenu handlers
  const handleSubmenuOpen = (event) => {
    setSubmenuAnchorEl(event.currentTarget);
    setIsSubmenuOpen(true)
  };  
  const handleSubmenuClose = () => {
    setSubmenuAnchorEl(null);
    setIsSubmenuOpen(false)
    setIsMainMenuOpen(false)
  }; 
  
  // handle navigation based on which menu item is clicked
  const handleNavigation = (path) => {
    history.push(path);
    handleMenuClose();
  };

  return (

    <AppBar position="static">
    <Toolbar>
      {/* Icon on the left */}
      <IconButton  sx={{ mr: 2 }}
        edge="start" 
        color="inherit" 
        aria-label="menu"
        onClick={handleMenuClick}
      >
        <MenuIcon />
      </IconButton>

    {/* Main Menu */}
    <Menu
      anchorEl={anchorEl}
      open={isMainMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => handleNavigation('/user')}>Admin Dashboard</MenuItem>
      <MenuItem
        onMouseEnter={handleSubmenuOpen}
        onMouseLeave={handleSubmenuClose}
        onClick={handleSubmenuOpen}
        >
        Sites  <ArrowRight sx={{ml:6}} />
      </MenuItem>
      <MenuItem onClick={() => handleNavigation('/managers')}>Site Managers</MenuItem>
      {siteList[0] && siteList.map((site) => {
            <MenuItem 
                key={site.id} 
                onClick={() => handleNavigation(`/sites/${site.id}`)}>
                {site.site} 
            </MenuItem>})}
    </Menu>
    {/* Submenu  */}
    <Menu
        anchorEl={submenuAnchorEl}
        open={isSubmenuOpen}
        onClose={handleSubmenuClose}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        MenuListProps={{ onMouseLeave: handleSubmenuClose }}
        >
        {/* Submenu items */}
        {siteList[0] && siteList.map((site) => {
            return(
                <MenuItem 
                key={site.id} 
                onClick={() => handleNavigation(`/sites/${site.id}`)}>
                {site.site} 
            </MenuItem>)})}
    </Menu>

      {/* Rest of the Header */}
      {/* Spacer div to center the title */}
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
        Cultivate General Manager
      </Typography>
      {/* Empty space to balance the title in the center */}
      <div style={{ width: 48 }} /> {/* Adjust width to match icon's space */}
    </Toolbar>
  </AppBar>
  );
}
export default GenManagerNav;