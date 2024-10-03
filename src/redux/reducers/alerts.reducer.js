import { combineReducers } from "redux";

const miniAlerts = (state = {}, action) => {
    switch (action.type) {
      case 'SET_MINI_ALERTS':
        console.log(action.payload)
        return action.payload;
      case 'UNSET_MINI_ALERTS':
        return {};
      default:
        return state;
    }
  };

  const allSiteAlerts = (state = {}, action) => {
    switch (action.type) {
      case 'SET_ALL_ALERTS':
        console.log(action.payload)
        return action.payload;
      case 'UNSET_ALERTS':
        return {};
      default:
        return state;
    }
  };
  
  export default combineReducers({
    miniAlerts,
    allSiteAlerts
  });