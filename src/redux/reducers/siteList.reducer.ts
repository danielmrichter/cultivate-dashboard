const siteListReducer = (state = [], action) => {
    switch (action.type) {
      case 'SET_SITE_LIST':
        return action.payload;
      case 'UNSET_SITE_DATA':
        return {};
      case "UNSET_USER":
        return [];
      default:
        return state;
    }
  };
  
  // user will be on the redux state at:
  // state.siteList
  export default siteListReducer;
  