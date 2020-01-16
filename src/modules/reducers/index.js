const initialState = {
  unreadMessagesCount: 0,
  unreadNotificationsCount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case typeName:
      return {...state};

    default:
      return state;
  }
};
