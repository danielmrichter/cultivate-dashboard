import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import ScatterPlot from "../Graph Components/ScatterPlot";
import LineGraph from "../Graph Components/LineGraph";
import BarGraph from "../Graph Components/BarGraph";
import LoginPage from "../Account Components/LoginPage/LoginPage.jsx";
import RegisterPage from "../Account Components/RegisterPage/RegisterPage.jsx";
import Header from "../Header/Header.jsx";




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
      </Switch>
    </Router>
  );
}

export default App;
