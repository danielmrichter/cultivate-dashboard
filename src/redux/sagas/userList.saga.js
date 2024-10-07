import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

function* fetchAllUsers() {
    console.log('in fetchallusers saga')
    try {
    const response = yield axios.get(`/api/userList`);
    yield put({ type: "SET_ALL_USERS", payload: response.data });
  } catch (error) {
    console.log("Fetch all users failed:", error);
  }
}

function* userListSaga() {
  yield takeLatest('FETCH_ALL_USERS', fetchAllUsers);
}

export default userListSaga;
