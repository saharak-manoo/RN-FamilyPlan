import AsyncStorage from '@react-native-community/async-storage';
import * as GFun from './GlobalFunction';

const HOSTS = [
  'https://family-plan.herokuapp.com',
  'http://172.20.10.12:3000',
  'http://10.251.1.204:3000',
  'http://192.168.1.37:3000',
  'http://172.20.10.12:3000',
  'http://192.168.2.105:3000',
];

const HOST = HOSTS[1];
const SIGN_UP_PATH = '/api/v1/users';
const SIGN_IN_PATH = '/api/v1/sessions/sign_in';
const SIGN_OUT_PATH = '/api/v1/sessions/sign_out';
const FORGOT_PASSWORD_PATH = '/api/v1/sessions/forgot_password';
const PROFILE_PATH = '/api/v1/users/:user_id/profile';
const GROUP = '/api/v1/groups';
const NEW_GROUP = '/api/v1/groups/new';
const UPDATE_GROUP = '/api/v1/groups/:id';
const INVITE_GROUP = '/api/v1/groups/:id/invite';
const JOIN_GROUP = '/api/v1/groups/:id/join';
const LEAVE_GROUP = '/api/v1/groups/:id/leave';
const SEARCH_USER = '/api/v1/users/search';
const CHAT_ROOM = '/api/v1/chat_rooms';
const CHAT = '/api/v1/chat_rooms/:id';
const CREATE_CHAT_ROOM = '/api/v1/chat_rooms';
const CREATE_MESSAGE = '/api/v1/chat_rooms/:id/message';
const REFRESH_TOKEN = '/api/v1/sessions/refresh_token';
const SIGN_IN_WITH_PATH = '/api/v1/sessions/sign_in_with';
const FCM_TOKEN_PATH = '/api/v1/users/:user_id/fcm_token';
const NOTIFICATION = '/api/v1/notifications';
const SHOW_NOTIFICATION = '/api/v1/notifications/:id';

function joinUrl(host, path) {
  if (host.endsWith('/')) {
    if (path.startsWith('/')) {
      path = path.slice(1);
    }
  } else {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
  }
  return host + path;
}

export async function refreshToken() {
  try {
    let user = await GFun.user();
    const resp = await fetch(joinUrl(HOST, REFRESH_TOKEN), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({refresh_token: user.refresh_token}),
    });

    let response = await resp.json();
    await AsyncStorage.setItem('user', JSON.stringify(response.user));

    return response.user.authentication_jwt;
  } catch (e) {
    console.warn(e);
  }
}

export async function checkTokenExpire(resp) {
  let data = {};
  if (resp.status === 401) {
    data = {
      newTokenJwt: await this.refreshToken(),
      status: 'reload',
    };

    return data;
  } else {
    data = {
      newTokenJwt: null,
      status: 'ok',
    };

    return data;
  }
}

export async function signIn(params) {
  try {
    const resp = await fetch(joinUrl(HOST, SIGN_IN_PATH), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({user: params}),
    });

    let response = await resp.json();
    return response;
  } catch (e) {
    console.warn(e);
  }
}

export async function signUp(params) {
  try {
    const resp = await fetch(joinUrl(HOST, SIGN_UP_PATH), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({user: params}),
    });

    let response = await resp.json();
    return response;
  } catch (e) {
    console.warn(e);
  }
}

export async function forgotPassword(params) {
  try {
    const resp = await fetch(joinUrl(HOST, FORGOT_PASSWORD_PATH), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({user: params}),
    });

    let response = await resp.json();
    return response;
  } catch (e) {
    console.warn(e);
  }
}

export async function signOut(token) {
  try {
    const resp = await fetch(joinUrl(HOST, SIGN_OUT_PATH), {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    let {status, newTokenJwt} = await this.checkTokenExpire(resp);
    if (status === 'reload') {
      return await this.signOut(newTokenJwt);
    } else if (status === 'ok') {
      let response = await resp.json();
      return response;
    }
  } catch (e) {
    console.warn(e);
  }
}

export async function getProfile(token, user_id) {
  try {
    const resp = await fetch(
      joinUrl(HOST, PROFILE_PATH.replace(':user_id', user_id)),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    let {status, newTokenJwt} = await this.checkTokenExpire(resp, token);
    if (status === 'reload') {
      return await this.getProfile(newTokenJwt, user_id);
    } else if (status === 'ok') {
      let response = await resp.json();
      return response;
    }
  } catch (e) {
    console.warn(e);
  }
}

export async function getGroup(token) {
  try {
    const resp = await fetch(joinUrl(HOST, GROUP), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    let {status, newTokenJwt} = await this.checkTokenExpire(resp);
    if (status === 'reload') {
      return await this.getGroup(newTokenJwt);
    } else if (status === 'ok') {
      let response = await resp.json();
      return response;
    }
  } catch (e) {
    console.warn(e);
  }
}

export async function newGroup(token) {
  try {
    const resp = await fetch(joinUrl(HOST, NEW_GROUP), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    let {status, newTokenJwt} = await this.checkTokenExpire(resp);
    if (status === 'reload') {
      return await this.newGroup(newTokenJwt);
    } else if (status === 'ok') {
      let response = await resp.json();
      return response;
    }
  } catch (e) {
    console.warn(e);
  }
}

export async function createGroup(token, params) {
  try {
    const resp = await fetch(joinUrl(HOST, GROUP), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({group: params}),
    });

    let {status, newTokenJwt} = await this.checkTokenExpire(resp);
    if (status === 'reload') {
      return await this.createGroup(newTokenJwt, params);
    } else if (status === 'ok') {
      let response = await resp.json();
      return response;
    }
  } catch (e) {
    console.warn(e);
  }
}

export async function updateGroup(token, id, params) {
  try {
    const resp = await fetch(joinUrl(HOST, UPDATE_GROUP.replace(':id', id)), {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({group: params}),
    });

    let {status, newTokenJwt} = await this.checkTokenExpire(resp);
    if (status === 'reload') {
      return await this.updateGroup(newTokenJwt, id, params);
    } else if (status === 'ok') {
      let response = await resp.json();
      return response;
    }
  } catch (e) {
    console.warn(e);
  }
}

export async function inviteGroup(token, id, email) {
  try {
    const resp = await fetch(joinUrl(HOST, INVITE_GROUP.replace(':id', id)), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({email: email}),
    });

    let {status, newTokenJwt} = await this.checkTokenExpire(resp);
    if (status === 'reload') {
      return await this.inviteGroup(newTokenJwt, id, email);
    } else if (status === 'ok') {
      let response = await resp.json();
      return response;
    }
  } catch (e) {
    console.warn(e);
  }
}

export async function joinGroup(token, id, user_id) {
  try {
    const resp = await fetch(joinUrl(HOST, JOIN_GROUP.replace(':id', id)), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({user_id: user_id}),
    });

    let {status, newTokenJwt} = await this.checkTokenExpire(resp);
    if (status === 'reload') {
      return await this.joinGroup(newTokenJwt, id, user_id);
    } else if (status === 'ok') {
      let response = await resp.json();
      console.log(response);
      return response;
    }
  } catch (e) {
    console.warn(e);
  }
}

export async function leaveGroup(token, id, user_id) {
  try {
    const resp = await fetch(joinUrl(HOST, LEAVE_GROUP.replace(':id', id)), {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({user_id: user_id}),
    });

    let {status, newTokenJwt} = await this.checkTokenExpire(resp);
    if (status === 'reload') {
      return await this.leaveGroup(newTokenJwt, id, user_id);
    } else if (status === 'ok') {
      let response = await resp.json();
      return response;
    }
  } catch (e) {
    console.warn(e);
  }
}

export async function searchGroup(token, email) {
  try {
    const resp = await fetch(joinUrl(HOST, SEARCH_USER + '?email=' + email), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    let {status, newTokenJwt} = await this.checkTokenExpire(resp);
    if (status === 'reload') {
      return await this.searchGroup(newTokenJwt, email);
    } else if (status === 'ok') {
      let response = await resp.json();
      return response;
    }
  } catch (e) {
    console.warn(e);
  }
}

export async function getChatRoom(token, params) {
  try {
    const resp = await fetch(
      joinUrl(HOST, `${CHAT_ROOM}?${new URLSearchParams(params).toString()}`),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    let {status, newTokenJwt} = await this.checkTokenExpire(resp);
    if (status === 'reload') {
      return await this.getChatRoom(newTokenJwt);
    } else if (status === 'ok') {
      let response = await resp.json();
      return response;
    }
  } catch (e) {
    console.warn(e);
  }
}

export async function getChatMessage(token, id, params) {
  try {
    const resp = await fetch(
      joinUrl(
        HOST,
        `${CHAT.replace(':id', id)}?${new URLSearchParams(params).toString()}`,
      ),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    let {status, newTokenJwt} = await this.checkTokenExpire(resp);
    if (status === 'reload') {
      return await this.getChatMessage(newTokenJwt, id);
    } else if (status === 'ok') {
      let response = await resp.json();
      return response;
    }
  } catch (e) {
    console.warn(e);
  }
}

export async function createChatRoom(token, groupId) {
  try {
    const resp = await fetch(joinUrl(HOST, CREATE_CHAT_ROOM), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({chat_room: {group_id: groupId}}),
    });

    let {status, newTokenJwt} = await this.checkTokenExpire(resp);
    if (status === 'reload') {
      return await this.createChatRoom(newTokenJwt, groupId);
    } else if (status === 'ok') {
      let response = await resp.json();
      return response;
    }
  } catch (e) {
    console.warn(e);
  }
}

export async function createChat(token, id, params) {
  try {
    const resp = await fetch(joinUrl(HOST, CREATE_MESSAGE.replace(':id', id)), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({messages: params}),
    });

    let {status, newTokenJwt} = await this.checkTokenExpire(resp);
    if (status === 'reload') {
      return await this.createChat(newTokenJwt, id, params);
    } else if (status === 'ok') {
      let response = await resp.json();
      return response;
    }
  } catch (e) {
    console.warn(e);
  }
}

export async function signInWith(user) {
  try {
    const resp = await fetch(joinUrl(HOST, SIGN_IN_WITH_PATH), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({user}),
    });

    let response = await resp.json();
    return response;
  } catch (e) {
    console.warn(e);
  }
}

export async function createFcmToken(token, user_id, fcmToken) {
  try {
    const resp = await fetch(
      joinUrl(HOST, FCM_TOKEN_PATH.replace(':user_id', user_id)),
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({fcm_token: fcmToken}),
      },
    );

    let {status, newTokenJwt} = await this.checkTokenExpire(resp, token);
    if (status === 'reload') {
      return await this.getProfile(newTokenJwt, user_id);
    } else if (status === 'ok') {
      let response = await resp.json();
      return response;
    }
  } catch (e) {
    console.warn(e);
  }
}

export async function getNotification(token, params) {
  try {
    const resp = await fetch(
      joinUrl(
        HOST,
        `${NOTIFICATION}?${new URLSearchParams(params).toString()}`,
      ),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    let {status, newTokenJwt} = await this.checkTokenExpire(resp);
    if (status === 'reload') {
      return await this.getChatRoom(newTokenJwt);
    } else if (status === 'ok') {
      let response = await resp.json();
      return response;
    }
  } catch (e) {
    console.warn(e);
  }
}

export async function getNotificationById(token, notification_id) {
  try {
    const resp = await fetch(
      joinUrl(HOST, SHOW_NOTIFICATION.replace(':id', notification_id)),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    let {status, newTokenJwt} = await this.checkTokenExpire(resp);
    if (status === 'reload') {
      return await this.getChatRoom(newTokenJwt);
    } else if (status === 'ok') {
      let response = await resp.json();
      return response;
    }
  } catch (e) {
    console.warn(e);
  }
}
