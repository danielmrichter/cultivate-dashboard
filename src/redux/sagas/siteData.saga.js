import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import React from 'react';

function* fetchSiteData(action) {
    try {
        const siteData = yield axios.get(`/api/siteData/${action.payload}`);
        yield put({type: 'SET_SITE_DATA', payload: siteData.data});
    } catch (error) {
        console.log('Get site data request failed', error)
    }
}

function* fetchSiteList(action) {
    try {
        const siteList = yield axios.get(`/api/siteList`);
        console.log('site list is', siteList)
        yield put({type: 'SET_SITE_LIST', payload: siteList.data});

    } catch (error) {
        console.log('Get site list request failed', error)
    }
}

function * siteDataSaga() {
    yield takeLatest('GET_SITE_DATA', fetchSiteData);
    yield takeLatest('GET_SITE_LIST', fetchSiteList);
}

export default siteDataSaga;