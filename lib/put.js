import request from './request';

/**
 * Send a PUT request
 * @param {string} url
 * @param {object} queryParams
 * @param {object} body
 * @param {boolean} useCredentials
 * @param {boolean} isCrossDomain
 * @param {object} requestOptions
 * @return {Promise}
 */
export default (url, queryParams = {}, body = {}, useCredentials = false, isCrossDomain = false, requestOptions = {}) =>
  request('put', url, queryParams, body, useCredentials, isCrossDomain, requestOptions);
