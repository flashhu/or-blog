import request from '@util/request';

export function login(data) {
  return request('/token', 'POST', data);
}

export function loginWithToken() {
  return request('/user/info', 'GET');
}
