import request from './request';

/**
 * Send a DELETE request
 * @param {string} url
 * @param {object} queryParams
 * @param {object} requestOptions
 * @param {boolean} useCredentials
 * @param {boolean} isCrossDomain
 * @return {Promise<any>}
 */
export default (url, queryParams = {}, requestOptions = {}, useCredentials = true, isCrossDomain) =>
  request('delete', url, queryParams, {}, requestOptions, useCredentials, isCrossDomain);
