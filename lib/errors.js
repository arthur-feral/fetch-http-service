import {
  NOT_FOUND_ERROR,
  SERVER_ERROR,
  BAD_PARAMS_ERROR,
  AUTH_ERROR,
  PARSING_ERROR,
  NETWORK_ERROR,
  CORS_ERROR,
} from './constants';

export class NotFoundError extends Error {
  constructor() {
    super(NOT_FOUND_ERROR);

    this.name = 'NotFoundError';
  }
}

export class AbortError extends Error {
  constructor() {
    super(ABORT_ERROR);

    this.name = 'AbortError';
  }
}

export class ServerError extends Error {
  constructor() {
    super(SERVER_ERROR);

    this.name = 'ServerError';
  }
}

export class BadParamsError extends Error {
  constructor() {
    super(BAD_PARAMS_ERROR);

    this.name = 'BadParamsError';
  }
}

export class AuthError extends Error {
  constructor() {
    super(AUTH_ERROR);

    this.name = 'AuthError';
  }
}

export class ParsingError extends Error {
  constructor() {
    super(PARSING_ERROR);

    this.name = 'ParsingError';
  }
}

export class CorsError extends Error {
  constructor() {
    super(CORS_ERROR);

    this.name = 'CorsError';
  }
}

export class NetworkError extends Error {
  constructor() {
    super(NETWORK_ERROR);

    this.name = 'NetworkError';
  }
}
