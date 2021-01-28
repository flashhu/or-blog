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
  if (!data.error_code || (data.error_code !== 1001 && data.error_code !== 1002)) {
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

export const get = (url = '', params = {}) => {
  return request(url, {
    method: 'get',
    params,
  }).then((response) => {
    return response;
  }).catch((error) => {
    errorHandler(error);
  });
};

export const post = (url = '', params = {}) => {
  return request(url, {
    method: 'post',
    data: params,
  }).then((response) => {
    return response;
  }).catch((error) => {
    errorHandler(error);
  });
};
