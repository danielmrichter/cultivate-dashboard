import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

function* fetchSiteMiniAlerts(action) {
  try {
    const response = yield axios.get(`/api/alerts/mini/${action.payload}`);
    yield put({ type: "SET_MINI_ALERTS", payload: response.data });
  } catch (error) {
    console.log("Fetch Mini Alerts failed:", error);
  }
}

function* fetchAllSiteAlerts(action) {
  try {
    const response = yield axios.get(`/api/alerts/site/${action.payload}`);
    yield put({ type: "SET_ALL_ALERTS", payload: response.data });
  } catch (error) {
    console.log("Fetch All Alerts failed:", error);
  }
}

function* markAlertResolved(action) {
  try {
    const alertId = action.payload.alertId;
    const siteId = action.payload.siteId;
    yield axios.put(`/api/alerts/${alertId}`);
    yield put({ type: "FETCH_MINI_ALERTS", payload: siteId });
    yield put({ type: "FETCH_ALL_ALERTS", payload: siteId });
  } catch (error) {
    console.log("Mark Resolved/Unresolved action failed:", error);
  }
}

function* markAlertSeen(action) {
  try {
    yield axios.post(`/api/alerts`, { id: action.payload.alertId });
    yield put({ type: "FETCH_MINI_ALERTS", payload: action.payload.siteId });
  } catch (error) {
    console.log("error marking alert as having been seen", error);
  }
}

function* fetchUnseenAlerts(action) {
  try {
    const response = yield axios.get("/api/alerts");
    yield put({ type: "SET_UNSEEN_ALERTS", payload: response.data });
  } catch (error) {
    console.log("error getting list of unseen alerts", error);
  }
}

function* alertsSaga() {
  yield takeLatest("FETCH_MINI_ALERTS", fetchSiteMiniAlerts);
  yield takeLatest("FETCH_ALL_ALERTS", fetchAllSiteAlerts);
  yield takeLatest("MARK_RESOLVED", markAlertResolved);
  yield takeLatest("HAS_SEEN_ALERT", markAlertSeen);
  yield takeLatest("GET_UNSEEN_ALERTS", fetchUnseenAlerts);
}

export default alertsSaga;
