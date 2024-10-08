import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

function* fetchAllUsers() {
    try {
    const response = yield axios.get(`/api/userList`);
    yield put({ type: "SET_ALL_USERS", payload: response.data });
  } catch (error) {
    console.log("Fetch all users failed:", error);
  }
}

function* newSiteAssignment(action) {
    try {
        yield axios.put(`/api/userList/`,action.payload)
        yield put({ type: 'FETCH_ALL_USERS'});
    } catch(error) {
        console.log('updating new site assignment error:', error)
    }
}

function* userListSaga() {
  yield takeLatest('FETCH_ALL_USERS', fetchAllUsers);
  yield takeLatest('NEW_SITE_ASSIGNMENT', newSiteAssignment);
}

export default userListSaga;
