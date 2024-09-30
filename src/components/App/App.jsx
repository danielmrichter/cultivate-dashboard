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

const data = [
  {
    id: 9,
    ticket_number: 632635,
    longitude: -118.002111,
    latitude: 44.2505,
    temperature: 53.22,
    date: "2020-11-13",
  },
  {
    id: 12,
    ticket_number: 632641,
    longitude: -118.011,
    latitude: 44.2605,
    temperature: 43.2,
    date: "2020-11-12",
  },
  {
    id: 10,
    ticket_number: 632644,
    longitude: -118.003111,
    latitude: 44.251,
    temperature: 54.07,
    date: "2020-11-11",
  },
  {
    id: 14,
    ticket_number: 632645,
    longitude: -118.013,
    latitude: 44.262,
    temperature: 59.97,
    date: "2020-11-10",
  },
  {
    id: 13,
    ticket_number: 632647,
    longitude: -118.012,
    latitude: 44.261,
    temperature: 40.87,
    date: "2020-11-9",
  },
  {
    id: 14,
    ticket_number: 632647,
    longitude: -118.012,
    latitude: 44.264,
    temperature: 33.87,
    date: "2020-11-8",
  },
];

function App() {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
  }, [dispatch]);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user.id ? <Redirect to="/user" /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/login">
          {user.id ? <Redirect to="/user" /> : <LoginPage />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
