const HOSTS = [
  'https://family-plan.herokuapp.com',
  'http://192.168.2.102:3000',
  'http://10.251.1.204:3000',
  'http://192.168.1.37:3000',
  'http://172.20.10.12:3000',
  'http://192.168.1.34:3000',
];

const HOST = HOSTS[0];
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
    if (response) {
      return response;
    }
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
    if (response) {
      return response;
    }
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
    if (response) {
      return response;
    }
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

    let response = await resp.json();
    if (response) {
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

    let response = await resp.json();
    if (response) {
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

    let response = await resp.json();
    if (response) {
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

    let response = await resp.json();
    if (response) {
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

    let response = await resp.json();
    if (response) {
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

    let response = await resp.json();
    if (response) {
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

    let response = await resp.json();
    if (response) {
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

    let response = await resp.json();
    if (response) {
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

    let response = await resp.json();
    if (response) {
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

    let response = await resp.json();
    if (response) {
      return response;
    }
  } catch (e) {
    console.warn(e);
  }
}
