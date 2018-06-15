import request from './request';

/**
 * Send a GET request
 * @param {string} url
 * @param {object} queryParams
 * @param {boolean} useCredentials
 * @param {boolean} isCrossDomain
 * @param {object} requestOptions
 * @return {Promise}
 */
export default (url, queryParams = {}, useCredentials = false, isCrossDomain = false, requestOptions = {}) =>
  request('get', url, queryParams, {}, useCredentials, isCrossDomain, requestOptions);
