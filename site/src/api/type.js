import request from '@util/request';

export async function getTypeList() {
  const list = await request('/type/list', 'GET');
  return list;
}

export async function deleteType(list) {
  return await request(`/type/delete/${list}`, 'DELETE');
}

export function getTypeListByPid(pid) {
  return request(`/type/list/${pid}`, 'GET');
}
