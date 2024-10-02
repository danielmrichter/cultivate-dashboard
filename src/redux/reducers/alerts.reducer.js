const alertsReducer = (state = {}, action) => {
    switch (action.type) {
      case 'SET_ALERTS':
        console.log(action.payload)
        return action.payload;
      case 'UNSET_ALERTS':
        return {};
      default:
        return state;
    }
  };
  
  // user will be on the redux state at:
  // state.user
  export default alertsReducer;