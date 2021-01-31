import request from '@util/request';

export function getTagList() {
  return request('/tag/list', 'GET');
}
