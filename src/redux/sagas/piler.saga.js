import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

function* pilerData(action) {
  const pilerDataResponse = yield axios.get(`/api/piler/${action.payload}`);
  yield put({ type: "SET_PILER_DATA", payload: pilerDataResponse.data });
}

function* updatePilerTicket(action) {
  try {
    console.log(action.payload.beet_data_id)
    const response = yield axios.put(`/api/piler/update/${action.payload.beet_data_id}`, action.payload);
    console.log(response.data)
    yield put({ type: 'FETCH_PILER_DATA', payload: response.data.pilerId });   
  } catch (error) {
    console.error('Error updating piler ticket:', error);
  }
}

function* deletePilerTicket(action) {
  try {
    const { beet_data_id } = action.payload;
    const response = yield axios.delete(`/api/piler/ticket/${beet_data_id}`);
    console.log('response.data is:' , response.data)
    yield put({ type: 'FETCH_PILER_DATA', payload: response.data.piler_id });
  } catch (error) {
    console.error('Error deleting piler ticket:', error);
    yield put({ type: 'DELETE_TICKET_FAILURE', error });
  }
}

function* pilerSaga() {
  yield takeLatest("FETCH_PILER_DATA", pilerData);
  yield takeLatest("UPDATE_PILER_TICKET", updatePilerTicket);
  yield takeLatest('DELETE_PILER_TICKET', deletePilerTicket);
}

export default pilerSaga;
