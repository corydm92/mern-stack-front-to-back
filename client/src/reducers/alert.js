const initState = [];

const alert = (state = initState, action) => {
  switch (action.type) {
    case 'test':
      return;
    default:
      return state;
  }
};

export default alert;
