const pilerReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_PILER_DATA":
      return action.payload;
    default:
      return state;
  }
};



export default pilerReducer;
