import 'whatwg-fetch';
import {
  formatUrlWithQueryParameters,
  getErrorWithStatus,
} from './tools';

import {
  LOG_ERROR_PREFIX,
  CONTENT_JSON,
  CONTENT_JSONAPI,
  noop,
} from './constants';

const ALLOWED_VERBS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * Proceed to request the server with given parameters
 * @param {string} httpMethod
 * @param {string} url
 * @param {object} queryParams
 * @param {object} payload
 * @param {object} fetchOptions
 * @param {boolean} useCredentials
 * @param {boolean} isCrossDomain
 * @return {Promise<any>}
 */
export default (
  httpMethod,
  url,
  queryParams = {},
  payload = {},
  fetchOptions = {},
  useCredentials = true,
  isCrossDomain = false,
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

  const abortAvailable = window.AbortController !== undefined;
  let abortController;
  let signal;

  if (abortAvailable) {
    abortController = new window.AbortController();
    signal = abortController.signal;
  }

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

  if (signal) {
    options.signal = signal;
  }

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

  const requestPromise = window.fetch(
    requestUrl,
    options,
  ).then((response) => {
    const buildResult = body => [body, response.ok, response.status, response.type];

    if ([CONTENT_JSON, CONTENT_JSONAPI].includes(response.headers.get('Content-Type'))) {
      return response.json().then(buildResult);
    }
    if (response.headers.get('Content-Type').indexOf('text') !== -1) {
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

  requestPromise.abort = abortAvailable ? abortController.abort : noop;

  return requestPromise;
};
