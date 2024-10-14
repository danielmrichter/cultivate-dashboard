const siteManagerReducer = (state = [], action) => {
    switch (action.type) {
      case 'SET_SITE_MANAGER':
        return action.payload;
      case "UNSET_USER":
        return [];
      default:
        return state;
    }
  };
  
  // user will be on the redux state at:
  // state.siteManager
  export default siteManagerReducer;
  