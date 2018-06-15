export const NOT_FOUND_ERROR = 'Resource not found';
export const ABORT_ERROR = 'Request has been aborted';
export const SERVER_ERROR = 'The server responded with an error';
export const BAD_PARAMS_ERROR = 'Please check query or body parameters';
export const AUTH_ERROR = 'You don\'t have the permission to access the resource';
export const PARSING_ERROR = 'Error while parsing response';
export const CORS_ERROR = 'Error with CORS configuration';
export const NETWORK_ERROR = 'Network seems unreachable';
export const LOG_INFO_PREFIX = '[fetch-http-service][Info]';
export const LOG_ERROR_PREFIX = '[fetch-http-service][Error]';
export const CONTENT_JSON = 'application/json';

const noopRef = function noopRef() {
};

export const noop = noopRef;
