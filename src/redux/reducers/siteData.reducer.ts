const siteDataReducer = (state = [], action) => {
    switch (action.type) {
      case 'SET_SITE_DATA':
        return action.payload;
      case 'UNSET_SITE_DATA':
        return {};
      default:
        return state;
    }
  };
  
  // user will be on the redux state at:
  // state.user
  export default siteDataReducer;
  