import { extend } from 'umi-request';
import { message } from 'antd';
import { API_SERVER } from '@constant/urls';
import { encode } from '@util/token';

const errorHandler = (error) => {
  const { data = {} } = error;
  let msg = '网络错误';
  if (data.msg instanceof Array && data.msg.length > 0) {
    msg = data.msg.join(',');
  }
  if (typeof (data.msg) === 'string') {
    msg = data.msg;
  }
  if (data.error_code !== 1001 && data.error_code !== 1002) {
    // 非Token相关问题
    message.error(msg);
  }
  console.log(data);
};

const request = extend({
  prefix: API_SERVER,
  timeout: 15000, // 如超时，则请求中断，抛出异常
  headers: {
    Authorization: encode(window.localStorage.getItem('token')),
  },
  errorHandler, // 错误处理
});

/**
 * 检查响应结果
 */
export const checkResponse = (res) => {
  return res && !res.error_code;
};

/**
 * 七牛云所需格式化
 */
export const urlSafeBase64Encode = (str) => {
  // https://developer.qiniu.com/kodo/1276/data-format
  return btoa(encodeURI(str)).replace(/\//g, '_').replace(/\+/g, '-');
};

export default (url, method, params = null) => {
  // 'data' 作为请求主体被发送的数据
  // 适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
  const dataEnable = ['PUT', 'POST', 'PATCH'];
  const requestProps = dataEnable.indexOf(method) !== -1 ? { data: params } : { params };
  return request(url, {
    method,
    ...requestProps,
  }).then((response) => {
    return response;
  }).catch((error) => {
    errorHandler(error);
  });
};

