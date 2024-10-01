import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchSite(action) {
try {
    const response = yield axios.get(`/api/beet_data/${action.payload}`)
    yield put({type: 'SET_SITE', payload: response.data})
} catch (error) {
    console.log('Fetch Site failed:', error)
}
}

function* siteSaga() {
  yield takeLatest('FETCH_SITE', fetchSite);
}

export default siteSaga;