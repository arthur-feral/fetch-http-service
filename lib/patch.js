import request from './request';

/**
 * Send a PATCH request
 * @param {string} url
 * @param {object} queryParams
 * @param {object} body
 * @param {object} requestOptions
 * @param {boolean} useCredentials
 * @param {boolean} isCrossDomain
 * @return {Promise<any>}
 */
export default (url, queryParams = {}, body = {}, requestOptions = {}, useCredentials = true, isCrossDomain = false) =>
  request('patch', url, queryParams, body, requestOptions, useCredentials, isCrossDomain);
