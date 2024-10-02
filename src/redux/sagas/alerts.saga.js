import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchSite(action) {
try {
    const response = yield axios.get(`/api/alerts`)
    yield put({type: 'SET_ALERTS', payload: response.data})
} catch (error) {
    console.log('Fetch Site failed:', error)
}
}

function* alertsSaga() {
  yield takeLatest('FETCH_ALERTS', fetchSite);
}

export default alertsSaga;