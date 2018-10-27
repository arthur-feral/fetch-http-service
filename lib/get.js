import request from './request';

/**
 * Send a GET request
 * @param {string} url
 * @param {object} queryParams
 * @param {object} requestOptions
 * @param {boolean} useCredentials
 * @param {boolean} isCrossDomain
 * @return {Promise<any>}
 */
export default (url, queryParams = {}, requestOptions = {}, useCredentials = true, isCrossDomain) =>
  request('get', url, queryParams, {}, requestOptions, useCredentials, isCrossDomain);
