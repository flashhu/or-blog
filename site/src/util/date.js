import dayjs from 'dayjs';

/**
 * UTC格式时间格式化为 YYYY-MM-DD HH:mm:ss
 * @param {*} date 形如 2021-01-08T08:35:52.000Z
 */
export const formatUTCDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

export const formateJSDate = (date) => {
  return dayjs(date).format('YYYYMMDDHHmmss');
};
