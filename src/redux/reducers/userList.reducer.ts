const userListReducer = (state = [], action) => {
    switch (action.type) {
      case 'SET_ALL_USERS':
        return action.payload;
      case 'UNSET_ALL_USERS':
        return {};
      default:
        return state;
    }
  };
  
  // user will be on the redux state at:
  // state.userList
  export default userListReducer;
  