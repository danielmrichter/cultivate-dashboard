const growersList = (state = {}, action) => {
    switch (action.type) {
      case "SET_GROWERS":
        return action.payload;
      default:
        return state;
    }
  };

  export default growersList;