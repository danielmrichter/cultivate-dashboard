const siteReducer = (state = {}, action) => {
    switch (action.type) {
      case 'SET_SITE':
        return action.payload;
      case 'UNSET_SITE':
        return {};
      case "UNSET_USER":
        return {};
      default:
        return state;
    }
  };
  
  // user will be on the redux state at:
  // state.user
  export default siteReducer;