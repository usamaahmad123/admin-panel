import decode from 'jwt-decode';

export function loggedIn() {
  const token = getToken();
  return !!token && !isTokenExpired(token);
}

export function isTokenExpired(token) {
  try {
    const decoded = decode(token);
    if (typeof decoded.exp !== 'undefined' && decoded.exp < Date.now() / 1000) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}

export function setToken(idToken) {
  localStorage.setItem('jwtToken', idToken);
}

export function getToken() {
  if (localStorage.getItem('jwtToken')) {
    return true;
  }
  return false;
}

export function removeToken() {
  return localStorage.removeItem('hiredroid_key_49');
}
