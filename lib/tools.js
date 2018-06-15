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
 *
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
 *
 * @param status
 * @param type
 * @return {*}
 */
export const getErrorWithStatus = (status, type = '') => {
  switch (status) {
    case 400:
      return new BadParamsError();
    case 401:
    case 403:
      return new AuthError();

    case 404:
      return new NotFoundError();

    case 0: {
      if (type === 'opaque') {
        return new CorsError();
      }

      if (type === 'error') {
        return new NetworkError();
      }

      return new ServerError();
    }

    default:
      return new ServerError();
  }
};
