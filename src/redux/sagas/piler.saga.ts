import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

function* pilerData(action) {
  try {
    const pilerDataResponse = yield axios.get(`/api/piler/${action.payload}`);
    yield put({ type: "SET_PILER_DATA", payload: pilerDataResponse.data });
  } catch (error) {
    console.log("error getting piler data: ", error);
  }
}

function* updatePilerTicket(action) {
  try {
    const response = yield axios.put(
      `/api/piler/update/${action.payload.beet_data_id}`,
      action.payload
    );
    yield put({ type: "FETCH_PILER_DATA", payload: response.data.pilerId });
  } catch (error) {
    console.error("Error updating piler ticket:", error);
  }
}

function* deletePilerTicket(action) {
  try {
    const { beet_data_id } = action.payload;
    const response = yield axios.delete(`/api/piler/ticket/${beet_data_id}`);
    yield put({ type: "FETCH_PILER_DATA", payload: response.data.piler_id });
  } catch (error) {
    console.error("Error deleting piler ticket:", error);
    yield put({ type: "DELETE_TICKET_FAILURE", error });
  }
}
function* fetchGrowers() {
  try {
    const responseData = yield axios.get("/api/growers");
    yield put({ type: "SET_GROWERS", payload: responseData.data });
  } catch (error) {
    console.log("Error fetching growers:", error);
  }
}

function* addTicket(action) {
  try {
    const response = yield axios.post("/api/add_ticket", action.payload);
    yield put({ type: "FETCH_PILER_DATA", payload: response.data.piler_id });
  } catch (error) {
    console.log("Error Adding Ticket", error);
  }
}

function* pilerSaga() {
  yield takeLatest("FETCH_PILER_DATA", pilerData);
  yield takeLatest("UPDATE_PILER_TICKET", updatePilerTicket);
  yield takeLatest("DELETE_PILER_TICKET", deletePilerTicket);
  yield takeLatest("FETCH_GROWERS", fetchGrowers);
  yield takeLatest("ADD_TICKET", addTicket);
}

export default pilerSaga;
