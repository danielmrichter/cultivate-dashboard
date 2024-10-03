import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchSiteMiniAlerts(action) {
try {
    const response = yield axios.get(`/api/alerts/mini`)
    yield put({type: 'SET_MINI_ALERTS', payload: response.data})
} catch (error) {
    console.log('Fetch Mini Alerts failed:', error)
}
}

function* fetchAllSiteAlerts(action) {
  try {
      const response = yield axios.get(`/api/alerts/site`)
      yield put({type: 'SET_ALL_ALERTS', payload: response.data})
  } catch (error) {
      console.log('Fetch All Alerts failed:', error)
  }
  }

  function* markAlertResolved(action) {
    try {
        yield axios.put(`/api/alerts/${action.payload}`);
        yield put({type: 'FETCH_MINI_ALERTS' });
        yield put({type: 'FETCH_ALL_ALERTS' });
    } catch (error) {
      console.log('Mark Resolved/Unresolved action failed:', error)
    }
}

function* alertsSaga() {
  yield takeLatest('FETCH_MINI_ALERTS', fetchSiteMiniAlerts);
  yield takeLatest('FETCH_ALL_ALERTS', fetchAllSiteAlerts);
  yield takeLatest('MARK_RESOLVED', markAlertResolved);
}

export default alertsSaga;