import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import React from 'react';

function* fetchSiteData(action) {  //list of pilers for a site
    try {
        const siteData = yield axios.get(`/api/siteData/${action.payload}`);
        yield put({type: 'SET_SITE_DATA', payload: siteData.data});
    } catch (error) {
        console.log('Get site data request failed', error)
    }
}

function* fetchSiteList(action) {  //list of all sites
    try {
        const siteList = yield axios.get(`/api/siteList`);
        yield put({type: 'SET_SITE_LIST', payload: siteList.data});

    } catch (error) {
        console.log('Get site list request failed', error)
    }
}

function * siteDataSaga() {
    yield takeLatest('GET_SITE_DATA', fetchSiteData);  //gets pilers for each site
    yield takeLatest('GET_SITE_LIST', fetchSiteList);  //gets list of sites
}  

export default siteDataSaga;