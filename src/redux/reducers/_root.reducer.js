import { combineReducers } from 'redux';
import errors from './errors.reducer';
import user from './user.reducer';
import siteData from './siteData.reducer';
import siteList from './siteList.reducer';
import site from './beet.reducer';
import alerts from './alerts.reducer';
import piler from './piler.reducer'
import userList from './userList.reducer';
import growers from './growers.reducer';

// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  user, // will have an id and username if someone is logged in
  siteData, // gets list of pilers at a site
  siteList,
  site,
  alerts,
  piler,
  userList,
  growers
});

export default rootReducer;
