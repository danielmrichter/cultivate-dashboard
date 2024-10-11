import { useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import LoginPage from "../AccountComponents/LoginPage/LoginPage.js";
import RegisterPage from "../AccountComponents/RegisterPage/RegisterPage.jsx";
import SiteManagerView from "../SiteManagerView/SiteManagerView.jsx";
import Header from "../Header/Header.jsx";
import RedirectComponent from "../RedirectComponent/RedirectComponent.jsx";
import AlertHistory from "../AlertHistory/AlertHistory.jsx";
import PilerView from "../PilerView/PilerView.jsx";
import AlertCaller from "../AlertComponents/AlertCaller.jsx";
import UserList from "../UserList/UserList.jsx";
import AddTicket from "../AddTicket/AddTicket.jsx";
import AdminView from "../AdminView/AdminView.jsx";
import AuthenticateUser from "../AuthenticateUser/AuthenticateUser.jsx";
import LoginChecker from "../LoginChecker/LoginChecker.jsx";
import IsUserAdmin from "../IsUserAdmin/IsUserAdmin.jsx";

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(store => store.user)

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
  }, [dispatch]);

  return (
    <Router>
      <Box sx={{ backgroundColor: "#E5E5E5", minHeight: "100vh", pb: 10 }}>
        <Header />
        {user.id && <AlertCaller />}
        <Routes>
          {/* Home - if a user is logged in, send them to their dashboard, or send them to login. */}
          <Route path="/" index element={<RedirectComponent />} />
          {/* This is for the login page. */}
          <Route path="/login" element={<LoginChecker><LoginPage /></LoginChecker>} />

          {/* Registration */}
          <Route path="/registration" element={<LoginChecker><RegisterPage /></LoginChecker>} />

          {/* This is where we do some bouncing depending on the user's account settings */}
          <Route path="/user" element={<RedirectComponent />} />

          {/* Site Manager View. */}
          <Route
            path="/site/:id"
            element={<AuthenticateUser component={SiteManagerView} />}
          />

          {/* A site's alert history: */}
          <Route
            path="/alert-history/:id"
            element={<AuthenticateUser component={AlertHistory} />}
          />

          {/* PilerView */}
          <Route
            path="/piler-details/:pilerId"
            element={<AuthenticateUser component={PilerView} />}
          />

          {/* Manually Add A Ticket */}
          <Route
            path="/add-ticket/:siteId/:pilerId"
            element={<AuthenticateUser component={AddTicket} />}
          />

          {/* The User List */}
          <Route
            path="/user-list"
            element={<IsUserAdmin component={UserList} />}
          />

          {/* Admin View for General Managers */}
          <Route
            path="/admin"
            element={<IsUserAdmin component={AdminView} />}
          />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
