
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

function SiteManagerNav() {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((store) => store.user);
  const siteData = useSelector((store) => store.siteData);
  const [anchorEl, setAnchorEl] = useState(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false)
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)


  useEffect(() => {
    dispatch({type: 'GET_SITE_DATA', payload: user.site_id})
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
      <MenuItem onClick={() => handleNavigation('/user')}>Site Dashboard</MenuItem>
      <MenuItem
        onMouseEnter={handleSubmenuOpen}
        onMouseLeave={handleSubmenuClose}
        onClick={handleSubmenuOpen}
        >
        Pilers  <ArrowRight sx={{ml:6}} />
      </MenuItem>
      <MenuItem onClick={() => handleNavigation('/alert-history')}>Alert History</MenuItem>
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
        {siteData[0] && siteData.map((site) => {
            return(
            <MenuItem 
                key={site.piler_id} 
                // value={site.piler_id}  
                onClick={() => handleNavigation(`/pilers/${site.piler_id}`)}>
                {site.name}
            </MenuItem>)
        })}
        
    </Menu>






      {/* Rest of the Header */}
      {/* Spacer div to center the title */}
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
        Cultivate Site Manager
      </Typography>
      {/* Empty space to balance the title in the center */}
      <div style={{ width: 48 }} /> {/* Adjust width to match icon's space */}
    </Toolbar>
  </AppBar>
  );
}

export default SiteManagerNav;