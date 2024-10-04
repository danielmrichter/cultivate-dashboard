import { combineReducers } from "redux";

const miniAlerts = (state = {}, action) => {
  switch (action.type) {
    case "SET_MINI_ALERTS":
      return action.payload;
    case "UNSET_MINI_ALERTS":
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
