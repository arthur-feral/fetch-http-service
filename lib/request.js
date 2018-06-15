import 'whatwg-fetch';
import wrap from 'lodash.wrap';
import {
  formatUrlWithQueryParameters,
  getErrorWithStatus,
} from './tools';

import {
  LOG_ERROR_PREFIX,
  CONTENT_JSON,
  noop,
} from './constants';
import { AbortError, ParsingError } from './errors';

const ALLOWED_VERBS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const PromiseWithAbort = function PromiseWithAbort() {
  this.abort = noop;

  return this;
};
Object.setPrototypeOf()

PromiseWithAbort.prototype = {
  ...Promise.prototype,
  abort: noop,
  setAbort: function (abortRef) {
    this.abort = abortRef.bind(this);

    return this;
  },
};

const test = new PromiseWithAbort((resolve, reject) => {
  resolve();
});

const extendPromise = (promise, abort) => {
  promise.abort = abort; // eslint-disable-line no-param-reassign

  promise.then = wrap(promise.then.bind(promise), (then, fa, fb) => { // eslint-disable-line no-param-reassign
    const promise = then(fa, fb);
    return extendPromise(promise, abort);
  });

  return promise;
};

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

  const abortMethodRef = abortAvailable ? abortController.abort : noop;

  const requestPromise = new PromiseWithAbort((resolve, reject) => {
    window.fetch(
      formatUrlWithQueryParameters(url, queryParams),
      options,
    ).then((response) => {
      if (!response.ok) {
        reject(getErrorWithStatus(response.status, response.type));
      } else {
        resolve(response);
      }
    }).catch(reject);
  }).then((response) => {
    if (response.headers.get('Content-Type') === CONTENT_JSON) {
      try {
        return response.json();
      } catch (parseError) {
        throw new ParsingError();
      }
    }

    if (response.headers.get('Content-Type').indexOf('text')) {
      try {
        return response.text();
      } catch (parseError) {
        throw new ParsingError();
      }
    }

    // return the raw response so you can run blob() on it if you need
    return response;
  }).catch((error) => {
    if (error) {
      throw new AbortError();
    }

    throw error;
  });

  requestPromise.setAbort(abortMethodRef);

  return requestPromise;
};
