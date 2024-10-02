import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchSite(action) {
try {
    const response = yield axios.get(`/api/alerts`)
    console.log('response is:', response.data)
    yield put({type: 'SET_ALERTS', payload: response.data})
} catch (error) {
    console.log('Fetch Site failed:', error)
}
}

function* alertsSaga() {
  yield takeLatest('FETCH_ALERTS', fetchSite);
}

export default alertsSaga;