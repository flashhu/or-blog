import request, { urlSafeBase64Encode } from '@util/request';
import { formateJSDate } from '@util/date';
import { QINIU_SERVER, FILE_SERVER } from '@constant/urls';

/**
 * 如 id 为 'new' 则新建文章
 */
export function save(id, data) {
  return request('/article/save', 'POST', id === 'new' ? data : { id, ...data });
}

export function getDraftList() {
  return request('/article/draft/list', 'GET');
}

export function getArticleDetail(id) {
  return request(`/article/detail/${id}`, 'GET');
}

export function deleteArticle(id) {
  return request(`/article/delete/${id}`, 'DELETE');
}

/**
 * 用于获取上传七牛云时要携带的 token
 */
export function getQiniuToken() {
  return request('/token/qiniu', 'GET');
}

export function uploadPicToQiniu(data, token) {
  return new Promise((resolve, reject) => {
    const base64 = data.target.result.slice(data.target.result.indexOf(',') + 1);
    const fileName = `image/${formateJSDate(new Date())}`;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${QINIU_SERVER}/key/${urlSafeBase64Encode(fileName)}`, true);
    xhr.onload = () => {
      const res = JSON.parse(xhr.responseText);
      resolve(`${FILE_SERVER}${res.key}`);
    };
    xhr.onerror = () => {
      reject(new Error('上传图片失败'));
    };
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.setRequestHeader('Authorization', `UpToken ${token}`);
    xhr.send(base64);
  });
}
