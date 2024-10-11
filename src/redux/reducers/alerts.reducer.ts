import { combineReducers } from "redux";

// these are the Active Alerts displayed on site page
const miniAlerts = (state = {}, action) => {
  switch (action.type) {
    case "SET_MINI_ALERTS":
      return action.payload;
    case "UNSET_MINI_ALERTS":
      return {};
    case "UNSET_USER":
      return {};
    case "UNSET_GM_SITE_VIEW":
      return {};
    default:
      return state;
  }
};

const allSiteAlerts = (state = {}, action) => {
  switch (action.type) {
    case "SET_ALL_ALERTS":
      return action.payload;
    case "UNSET_ALERTS":
      return {};
    default:
      return state;
  }
};

// calls the alerts that haven't been seen by a specific user
const unseenAlerts = (state = [], action) => {
  switch (action.type) {
    case "SET_UNSEEN_ALERTS":
      return action.payload;
    default:
      return state;
  }
};
export default combineReducers({
  miniAlerts,
  allSiteAlerts,
  unseenAlerts,
});
