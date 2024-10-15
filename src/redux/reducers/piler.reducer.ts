const pilerReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_PILER_DATA":
      return action.payload;
    case "UNSET_USER":
      return {};
    default:
      return state;
  }
};



export default pilerReducer;
