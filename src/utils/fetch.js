import theRealFetch from 'isomorphic-fetch';
import cloneDeep from 'lodash/cloneDeep';
import { message } from 'antd';
import qs from 'qs';

/** Utils
 -------------------------------------------------- */
const deleteDeep = (obj) =>
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      deleteDeep(obj[key]);
    } else if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
      delete obj[key];
    }
  });

const parseParams = (params) => {
  const paramsCopy = cloneDeep(params);
  deleteDeep(paramsCopy);
  return paramsCopy;
};

/** Request
 -------------------------------------------------- */
const defaultOptions = {
  credentials: 'include',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  },
};

/** Response
 -------------------------------------------------- */
const redirect = () => {
  const { href, origin } = window.location;
  const redirectUrl = encodeURIComponent(href.replace(new RegExp(`${origin}/manage`), ''));
  window.location.replace(`/manage/login?url=${redirectUrl}`);
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url            接口 url
 * @param  {string} [type]         HTTP 请求类型，默认为 `GET`
 * @param  {object} [params]       请求参数（需为对象，e.g params: { param1, param2, ... } ）
 * @param  {string} [msg]          请求信息（e.g 传入 msg: `获取列表`，则请求失败时会提示 `获取列表失败`）
 * @param  {object} [otherOptions] 其它配置项
 */
const fetch = (url, { type = 'GET', params, msg, ...otherOptions } = {}) => {
  let newUrl = url;
  let newOptions = { ...defaultOptions, ...otherOptions, method: type };
  if (params) {
    if (type === 'GET') {
      newUrl = `${url}?${qs.stringify(parseParams(params))}`;
    } else if (type === 'POST') {
      newOptions = { ...newOptions, body: qs.stringify(parseParams(params)) };
    }
  }
  const errMsg = msg ? `${msg}失败 | ` : '';

  return theRealFetch(newUrl, newOptions)
    .then((res) => {
      const { status, statusText } = res;
      if ((status >= 200 && status < 300) || status === 304) {
        return res.json();
      }
      // ① 接口 500 等，返回错误
      return Promise.reject(new Error(`${errMsg}${status}: ${statusText}`));
    })
    .then((resData) => {
      const { errno, errmsg, data } = resData;
      // 1. 请求成功，errno 为 0，直接返回 data
      if (errno === 0) return data;

      // if (errno === 110003) return redirect(); // 账号未登录
      if (errno === 110006)
        return message.warn('您的账号被禁用，请使用其它账号登录', () => redirect());
      if (errno === 110011)
        return message.warn('您的账号未注册本系统，请使用其它账号登录', () => redirect());

      // ② 请求接口成功，errno 不为 0，返回错误
      return Promise.reject(new Error(`${errMsg}${errmsg}`));
    })
    .catch((err) => {
      // 2. 请求失败，① 接口 500 等，② 请求接口成功，errno 不为 0
      message.warn(err.message);
    });
};

export default fetch;
