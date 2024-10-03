
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';

import { useSelector } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu'
import BaseNav from '../Nav/BaseNav';
import SiteManagerNav from '../Nav/SiteManagerNav';
import GenManagerNav from '../Nav/GenManagerNav';
import LogOutButton from '../AccountComponents/LogOutButton/LogOutButton';

function Header() {
  const user = useSelector((store) => store.user);

  return (
    <div>
        {/* If no user is logged in, only show title */}
        {!user.id && (
        <BaseNav />
        )}

        {/* If Site Manger is logged in */}
        {(user.id && user.access_level==1) && (
       <SiteManagerNav />
        
        )}

        {/* If General Manger is logged in */}
        {(user.id && user.access_level==2) && (
        <div><GenManagerNav />
        </div>
        )}
      
    </div>
    
  );
}

export default Header;


        // {/* If no user is logged in, only show title */}
        // {user.id && (
        //     <Box  sx={{display: 'flex', justifyContent: 'center'}}>
        //       <h2>Cultivate</h2>
        //     </Box>
        //   )}
  
        //   {/* If a user is logged in, show these links */}
        //   {!user.id && (
        //     <>
        //     <Box  sx={{display: 'flex', flexDirection: 'row', }}>
        //       <MenuIcon />
        //       <h2 sx={{flexGrow: 1, gap:12}}>Cultivate</h2>
        //     </Box>
  
  
        //     </>
        //   )}
  
  