import request from './request';

/**
 * Send a DELETE request
 * @param {string} url
 * @param {object} queryParams
 * @param {boolean} useCredentials
 * @param {boolean} isCrossDomain
 * @param {object} requestOptions
 * @return {Promise}
 */
export default (url, queryParams = {}, useCredentials = true, isCrossDomain, requestOptions = {}) =>
  request('delete', url, queryParams, {}, useCredentials, isCrossDomain, requestOptions);
