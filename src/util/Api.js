const HOSTS = [
  'http://192.168.2.102:3000'
]

const HOST = HOSTS[0];
const CRESTE_USER_PATH = '/api/v1/users';
const SIGN_IN_PATH = '/api/v1/sessions/sign_in';
const FORGOT_PASSWORD_PATH = '/api/v1/sessions/forgot_password';

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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user: params })
    });

    let response = await resp.json();
    if (response) {
      return response;
    }
  } catch (e) {
    console.warn(e);
  }
}


export async function createUser(params) {
  console.log(params)
  try {
    if (typeof password == 'undefined') {
      password = '';
    }
    if (typeof password_confirmation == 'undefined') {
      password_confirmation = '';
    }
    const resp = await fetch(joinUrl(HOST, CRESTE_USER_PATH), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user: params })
    });

    let response = await resp.json();
    if (response) {
      return response;
    }
  } catch (e) {
    console.warn(e);
  }
}
