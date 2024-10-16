import {
  Button,
  Paper,
  Box,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { useTheme } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    dispatch({ type: "GET_SITE_LIST" });
    dispatch({ type: "FETCH_ALL_USERS" });
  }, [dispatch]);

  const userList = useAppSelector((store) => store.userList);
  const siteList = useAppSelector((store) => store.siteList);
  const [rows, setRows] = useState();

  interface user {
    isClicked: any;
    id: number,
    fullName: string
    username: string
    email: string
    phone: number
    sitename: string
  }
  interface rowOfUsers extends Array<user>{}

  // this will initially setRows as well as anytime a users site is updated
  // for some reason the userlist wasn't always populating correctly and
  // the table would show up empty
  useEffect(() => {
    userList &&
      userList.length > 0 &&
      setRows(userList.map((row:user) => ({ ...row, isClicked: false })));
  }, [userList]);

  // Handle the site selection from the dropdown
  // Also inputs site.id into the object so that it can
  //    be used in the handleSiteChange function
  const handleSiteSelect = (id:number, siteId:number, newSite) => {
    setRows((prevRows: any) =>
      prevRows &&
      prevRows.map((row) =>
        row.id === id
          ? { ...row, sitename: newSite, selectedSiteId: siteId }
          : row
      )
    );
  };

  // toggle betwen 'ReAssign Site' and 'Confirm' which also
  // instantiates the pulldown menu
  const toggleButton = (id) => {
    setRows((prevRows: any) =>
      prevRows && 
      prevRows.map((row) =>
        row.id === id ? { ...row, isClicked: !row.isClicked } : row
      )
    );
  };

  const handleSiteChange = (userId, newSiteId) => {
    dispatch({ type: "NEW_SITE_ASSIGNMENT", payload: { userId, newSiteId } });
  };

  const handleRemoveUser = (userId) => {
    dispatch({ type: "UNASSIGN_USER", payload: { userId } });
    dispatch({ type: "FETCH_ALL_USERS" });
  };

  // Creating the columns  --------------------------------
  const columns = [
    { field: "fullname", headerName: "Name", flex: 1 },
    { field: "username", headerName: "Username", flex: 1 },
    {
      field: "phone",
      headerName: "Phone",
      flex: 0.75,
      renderCell: (params) => {
        const phoneFormat = params.row.phone.replace(
          /(\d{3})(\d{3})(\d{4})/,
          "($1)-$2-$3"
        );
        return phoneFormat;
      },
    },
    { field: "email", headerName: "Email", flex: 1 },

    // SITE column displays either site name or dropdown to choose site
    {
      field: "sitename",
      headerName: "Site",
      flex: 0.8,
      renderCell: (params) => {
        const isClicked = params.row.isClicked;

        return isClicked ? (
          // Render the dropdown when ReAssign clicked
          <Select
            value={params.row.sitename}
            onChange={(event) => {
              //gets object that matches selected site
              const selectedSite = siteList.find(
                (site: { site: any; }) => site.site === event.target.value
              );
              handleSiteSelect(
                params.row.id,
                selectedSite.id,
                selectedSite.site
              );
            }}
          >
            {siteList.map((site) => (
              <MenuItem key={site.id} value={site.site}>
                {site.site}
              </MenuItem>
            ))}
          </Select>
        ) : (
          // Render the default button initially
          params.row.sitename
        );
      },
    },
    //  ASSIGN NEW SITE column, toggles to CONFIRM button
    {
      field: "action",
      headerName: "",
      flex: 0.75,
      renderCell: (params) => {
        const isClicked = params.row.isClicked;

        return isClicked ? (
          // Render the Confirm button if the first button was clicked
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleSiteChange(params.row.id, params.row.selectedSiteId);
              toggleButton(params.row.id);
            }}
          >
            Confirm
          </Button>
        ) : (
          // Render Assign New Site button initially
          <Button
            variant="contained"
            color="secondary"
            onClick={() => toggleButton(params.row.id)}
          >
            Assign New Site
          </Button>
        );
      },
    },
    // UNASSIGN USER column
    {
      field: "delete",
      headerName: "",
      flex: 0.75,
      renderCell: (params) => {
        if (!params.row.sitename) {
          return null;
        }
        return (
          <Button
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              "&:hover": {
                backgroundColor: theme.palette.primary.main, // No hover change
              },
              "&:active": {
                backgroundColor: theme.palette.primary.main, // No active change
              },
            }}
            onClick={() => handleRemoveUser(params.row.id)}
          >
            Unassign User
          </Button>
        );
      },
    },
  ];
  const handleBackClick = () => {
    navigate(`/admin`);
  };

  return (
    <Box sx={{ padding: "24px" }}>
      <Typography variant="h3">
        <b>User List:</b>
      </Typography>
      <Button sx={{ mb: 4 }} onClick={handleBackClick}>
        <ArrowBack />
        Return to Dashboard
      </Button>
      <Paper sx={{ padding: "24px" }}>
        <div style={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection={false}
            disableRowSelectionOnClick
            autoHeight
            initialState={{
              sorting: {
                sortModel: [{ field: "fullname", sort: "asc" }],
              },
            }}
            sx={{
              width: "100%",
              "& .red-alert-row": {
                backgroundColor: theme.palette.error.light,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.error.light, // Retain color, no hover effect
              },
            }}
          />
        </div>
      </Paper>
    </Box>
  );
}
