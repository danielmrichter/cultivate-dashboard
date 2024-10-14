import { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Collapse,
  Box,
} from "@mui/material";
import { useState } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useNavigate } from "react-router-dom";
import LogOutButton from "../AccountComponents/LogOutButton/LogOutButton";

export default function GenManagerNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [nestedOpen, setNestedOpen] = useState(false);
  const siteList = useAppSelector((store) => store.siteList);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeSite, setActiveSite] = useState(null); // Track the active site button

  useEffect(() => {
    dispatch({ type: "GET_SITE_LIST" });
  }, []);

  // open or close the Drawer
  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  // expand or condense the collapsible list
  const handleNestedClick = () => {
    setNestedOpen(!nestedOpen);
  };

  const handleSiteExpand = (choice, site) => {
    setAnchorEl(choice.currentTarget);
    setActiveSite(site);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActiveSite(null);
    setDrawerOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path, { replace: true });
  };

  const [activeSiteId, setActiveSiteId] = useState(null);

  const handleSiteNavigation = (path, siteId) => {
    if (activeSiteId !== siteId) {
      setActiveSiteId(siteId); // Set the active site ID to trigger the re-fetch
      dispatch({ type: "FETCH_SITE", payload: siteId });
      dispatch({ type: "FETCH_MINI_ALERTS", payload: siteId });
      navigate(path);
    } else {
      // If navigating to the same site, re-dispatch to refresh data
      dispatch({ type: "FETCH_SITE", payload: siteId });
      dispatch({ type: "FETCH_MINI_ALERTS", payload: siteId });
      navigate(path);
    }
  };

  // Contents of the Drawer
  const drawerList = (
    <Box
      sx={{ width: 160 }}
      role="presentation"
      //   onClick={toggleDrawer(false)}
      //   onKeyDown={toggleDrawer(false)}
      //   having them here closes the Drawer on any subsequent click
    >
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        // subheader={
        //   <ListSubheader component="div" id="nested-list-subheader">
        //     could put some instructions here if we think users need help
        //   </ListSubheader>
        // }
      >
        {/* Dashboard list item */}
        <ListItemButton key="dashboard">
          <ListItemText
            primary="ADMIN DASHBOARD"
            onClick={() => {
              handleNavigation(`/admin`);
              setDrawerOpen(false);
            }}
            onKeyDown={toggleDrawer(false)}
          />
        </ListItemButton>

        {/* Site list item */}
        <ListItemButton
          key="sites"
          onClick={handleNestedClick}
          sx={{ backgroundColor: "#F1F1F1" }}
        >
          <ListItemText primary="SITES" />
          {nestedOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        {/* sites mapped into the collapsible list */}
        <Collapse in={nestedOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding key="sublist">
            {siteList[0] &&
              siteList.map((site) => {
                return (
                  <>
                    <ListItemButton
                      sx={{ pl: 4, backgroundColor: "#F1F1F1" }}
                      key={site.id}
                      onClick={(e) => handleSiteExpand(e, site.id)}
                    >
                      <ListItemText primary={site.site} />
                      <IconButton edge="end" aria-label="expand">
                        <ArrowRightIcon />
                      </IconButton>
                    </ListItemButton>

                    {/* Pop-out menu for each site */}
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && activeSite === site.id}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleSiteNavigation(`/site/${site.id}`, site.id);
                          handleClose();
                        }}
                      >
                        Site Dashboard
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleSiteNavigation(
                            `/alert-history/${site.id}`,
                            site.id
                          );
                          handleClose();
                        }}
                      >
                        Alert History
                      </MenuItem>
                    </Menu>
                  </>
                );
              })}
          </List>
        </Collapse>
        {/* User list item */}
        <ListItemButton key="users">
          <ListItemText
            primary="USER LIST"
            onClick={() => {
              setDrawerOpen(false);
              handleNavigation(`/user-list`);
            }}
            onKeyDown={toggleDrawer(false)}
          />
        </ListItemButton>

        {/* /Trends list item */}
        {/* <ListItemButton key="users">
          <ListItemText primary="TRENDS"
            onClick={() => {setDrawerOpen(false);handleNavigation(`/trends`)}}
            onKeyDown={toggleDrawer(false)}/>
        </ListItemButton> */}
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
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            Cultivate General Manager
          </Typography>
          <LogOutButton />
        </Toolbar>
      </AppBar>

      {/* Drawer that opens below the AppBar */}
      <Drawer
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        variant="temporary"
        sx={{
          "& .MuiDrawer-paper": {
            marginTop: "64px", // keeps the Drawer below the AppBar
            width: 160,
          },
        }}
        ModalProps={{
          keepMounted: true, // Improves performance when Drawer is hidden
        }}
      >
        {drawerList}
      </Drawer>
    </div>
  );
}
