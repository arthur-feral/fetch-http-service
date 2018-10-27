import 'whatwg-fetch';
import {
  formatUrlWithQueryParameters,
  getErrorWithStatus,
} from './tools';

import {
  LOG_ERROR_PREFIX,
  CONTENT_JSON,
  // noop,
} from './constants';
// import {
//   AbortError,
// } from './errors';

const ALLOWED_VERBS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * This method wrap fetch to send request
 * it handles error cases
 * it configures cors and stuff depending on the given args
 * @param {string} httpMethod
 * @param {string} url
 * @param {object} queryParams
 * @param {object} payload
 * @param {boolean} useCredentials
 * @param {boolean} isCrossDomain
 * @param {object} fetchOptions
 * @return {Promise}
 */
export default (
  httpMethod,
  url,
  queryParams = {},
  payload = {},
  useCredentials = false,
  isCrossDomain = false,
  fetchOptions = {},
) => {
  if (!httpMethod || typeof httpMethod !== 'string') {
    throw new Error(`${LOG_ERROR_PREFIX} HTTP method is incorrect, got ${typeof httpMethod}`);
  }
  const method = httpMethod.toUpperCase();

  if (ALLOWED_VERBS.indexOf(method) === -1) {
    throw new Error(`${LOG_ERROR_PREFIX} HTTP method is incorrect, must be one of ${ALLOWED_VERBS.join(',')}`);
  }

  if (!url || typeof url !== 'string') {
    throw new Error(`${LOG_ERROR_PREFIX} Missing parameter url`);
  }

  // const abortAvailable = AbortController in this;
  // let abortController;
  // let signal;
  //
  // if (abortAvailable) {
  //   abortController = new this.AbortController();
  //   signal = abortController.signal;
  // }

  const customHeaders = fetchOptions.headers || {};
  const headers = {
    ...customHeaders,
    'Content-Type': fetchOptions.contentType || CONTENT_JSON,
  };

  let options = {
    method,
    headers,
    mode: 'no-cors',
    credentials: 'omit',
  };

  // if (signal) {
  //   options.signal = signal;
  // }

  if (isCrossDomain) {
    options.mode = 'cors';
  }

  if (useCredentials) {
    if (isCrossDomain) {
      options.credentials = 'include';
    } else {
      options.credentials = 'same-origin';
    }
  }

  if (['GET', 'DELETE'].indexOf(method) === -1) {
    options.body = JSON.stringify(payload);
  }

  options = Object.assign(
    options,
    fetchOptions,
  );

  const requestUrl = formatUrlWithQueryParameters(url, queryParams);
  // const abortMethodRef = abortAvailable ? abortController.abort : noop;

  return fetch(
    requestUrl,
    options,
  ).then((response) => {
    const buildResult = body => [body, response.ok, response.status, response.type];

    if (response.headers.get('Content-Type') === CONTENT_JSON) {
      return response.json().then(buildResult);
    }
    if (response.headers.get('Content-Type').indexOf('text')) {
      return response.text().then(buildResult);
    }

    return response.blob().then(buildResult);
  }).then(([body, isSuccess, status, type]) => {
    if (isSuccess) {
      return body;
    }

    throw getErrorWithStatus(
      body,
      status,
      type,
    );
  }).catch((error) => {
    throw error;
  });
};
