import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

function* pilerData(action) {
  const pilerDataResponse = yield axios.get(`/api/piler/${action.payload}`);
  console.log('pilerDataResponse is:', pilerDataResponse)
  yield put({ type: "SET_PILER_DATA", payload: pilerDataResponse.data });
}

function* updatePilerTicket(action) {
  try {
    console.log(action.payload.beet_data_id)
    const response = yield axios.put(`/api/piler/update/${action.payload.beet_data_id}`, action.payload);
    console.log('piler Data Id is:', response.data)
    yield put({ type: 'FETCH_PILER_DATA', payload: response.data.pilerId });   
  } catch (error) {
    console.error('Error updating piler ticket:', error);
  }
}

function* pilerSaga() {
  yield takeLatest("FETCH_PILER_DATA", pilerData);
  yield takeLatest("UPDATE_PILER_TICKET", updatePilerTicket)
}

export default pilerSaga;
