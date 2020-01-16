import {
  UNREAD_MESSAGES_COUNT,
  UNREAD_NOTIFICATIONS_COUNT,
} from '../actions/constants';

export const setUnreadMsgCount = payload => ({
  type: UNREAD_MESSAGES_COUNT,
  payload,
});

export const setUnreadNotiCount = payload => ({
  type: UNREAD_NOTIFICATIONS_COUNT,
  payload,
});

export const setScreenBadge = (msgCount, notiCount) => {
  return dispatch => {
    dispatch(setUnreadMsgCount(msgCount));
    dispatch(setUnreadNotiCount(notiCount));
  };
};
