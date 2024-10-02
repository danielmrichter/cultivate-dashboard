import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import LoginPage from "../AccountComponents/LoginPage/LoginPage.jsx";
import RegisterPage from "../AccountComponents/RegisterPage/RegisterPage.jsx";
import SiteManagerView from "../SiteManagerView/SiteManagerView.jsx";
import Header from "../Header/Header.jsx";
import RedirectComponent from "../RedirectComponent/RedirectComponent.jsx";
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute.jsx'

function App() {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/">
          {user.id ? <Redirect to="/user" /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/login">
          {user.id ? <Redirect to="/user" /> : <LoginPage />}
        </Route>
        <Route exact path="/registration">
          {user.id ? <Redirect to="/user" /> : <RegisterPage />}
        </Route>
        <RedirectComponent exact path="/user" />
        <ProtectedRoute exact path="/site/:id">
          <SiteManagerView />
        </ProtectedRoute>
      </Switch>
    </Router>
  );
}

export default App;
