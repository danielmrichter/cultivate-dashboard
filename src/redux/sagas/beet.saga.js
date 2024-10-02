import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchSite(action) {
try {
  const siteId = action.payload
  console.log("site id is:", siteId)
    const response = yield axios.get(`/api/beet_data/${siteId}`)
    yield put({type: 'SET_SITE', payload: response.data})
} catch (error) {
    console.log('Fetch Site failed:', error)
}
}

function* siteSaga() {
  yield takeLatest('FETCH_SITE', fetchSite);
}

export default siteSaga;