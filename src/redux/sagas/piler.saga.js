import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

function* pilerData(action) {
  const pilerDataResponse = yield axios.get(`/api/piler/${action.payload}`);
  yield put({ type: "SET_PILER_DATA", payload: pilerDataResponse.data });
}

function* pilerSaga() {
  yield takeLatest("FETCH_PILER_DATA", pilerData);
}

export default pilerSaga;
