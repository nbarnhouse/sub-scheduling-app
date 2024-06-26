const requestReducer = (state = [], action) => {
  switch (action.type) {
    case 'ACCEPT_REQUEST_SUCCESS':
      // Update the state to reflect the accepted request
      return state.filter((request) => request.id !== action.payload);
    case 'ACCEPT_REQUEST_FAILURE':
      // Handle failure cases if needed
      return state;
    default:
      return state;
  }
};

export default requestReducer;
