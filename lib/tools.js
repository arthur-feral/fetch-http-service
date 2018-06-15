import urlParse from 'url-parse';
import queryString from 'query-string';
import reduce from 'lodash.reduce';
import {
  BadParamsError,
  AuthError,
  NotFoundError,
  ServerError,
  NetworkError,
  CorsError,
} from './errors';

/**
 * prepare query params
 * @param queryParameters
 * @return {*}
 */
export const prepareQueryParameters = (queryParameters = {}) =>
  queryString.stringify(
    reduce(
      queryParameters,
      (result, value, param) => ({
        ...result,
        [param]: Array.isArray(value) ? value.join(',') : value,
      }),
      {},
    ),
  );

/**
 * Add query parameters to an url
 * @param url
 * @param queryParameters
 * @return {*}
 */
export const formatUrlWithQueryParameters = (url, queryParameters = {}) => {
  const parsedUrl = urlParse(url);

  if (Object.keys(queryParameters).length === 0) {
    return url;
  }

  let result = url;

  const urlQueryParameters = queryString.parse(parsedUrl.query);
  if (Object.keys(urlQueryParameters).length === 0) {
    if (url.indexOf('?') === -1) {
      result = `${result}?`;
    }
  }

  if (Object.keys(urlQueryParameters).length !== 0) {
    result = `${result}&`;
  }

  result += prepareQueryParameters(queryParameters);

  return result;
};

/**
 * return the correct error type depending on the error code
 * @param {*} body
 * @param {number} status
 * @param {string} type
 * @return {*}
 */
export const getErrorWithStatus = (body, status, type = '') => {
  switch (status) {
    case 400:
      return new BadParamsError(body);
    case 401:
    case 403:
      return new AuthError(body);

    case 404:
      return new NotFoundError(body);

    case 0: {
      if (type === 'opaque') {
        return new CorsError(body);
      }

      if (type === 'error') {
        return new NetworkError(body);
      }

      return new ServerError(body);
    }

    default:
      return new ServerError(body);
  }
};
