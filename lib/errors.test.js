import {
  expect,
} from 'chai';
import {
  FetchError,
  NotFoundError,
  ServerError,
  BadParamsError,
  AuthError,
  ParsingError,
  CorsError,
  NetworkError,
} from './errors';

describe('Errors', () => {
  it('should support the body response', () => {
    const error = new FetchError({}, 'An error has occured');
    expect(error.message).to.equal('An error has occured');
    expect(error.name).to.equal('FetchError');
    expect(error.body).to.deep.equal({});
  });

  it('should support the body response', () => {
    const error = new FetchError({
      errors: [
        {
          code: 42,
          message: 'Error details',
        },
      ],
    }, 'An error has occured');
    expect(error.message).to.equal('An error has occured');
    expect(error.name).to.equal('FetchError');
    expect(error.body).to.deep.equal({
      errors: [
        {
          code: 42,
          message: 'Error details',
        },
      ],
    });
  });

  describe('NotFoundError', () => {
    it('should own error properties', () => {
      const error = new NotFoundError();
      expect(error.message).to.equal('Resource not found');
      expect(error.name).to.equal('NotFoundError');
    });
  });

  describe('ServerError', () => {
    it('should own error properties', () => {
      const error = new ServerError();
      expect(error.message).to.equal('The server responded with an error');
      expect(error.name).to.equal('ServerError');
      expect(error.body).to.deep.equal({});
    });
  });

  describe('BadParamsError', () => {
    it('should own error properties', () => {
      const error = new BadParamsError();
      expect(error.message).to.equal('Please check query or body parameters');
      expect(error.name).to.equal('BadParamsError');
      expect(error.body).to.deep.equal({});
    });
  });

  describe('AuthError', () => {
    it('should own error properties', () => {
      const error = new AuthError();
      expect(error.message).to.equal('You don\'t have the permission to access the resource');
      expect(error.name).to.equal('AuthError');
      expect(error.body).to.deep.equal({});
    });
  });

  describe('ParsingError', () => {
    it('should own error properties', () => {
      const error = new ParsingError();
      expect(error.message).to.equal('Error while parsing response');
      expect(error.name).to.equal('ParsingError');
      expect(error.body).to.deep.equal({});
    });
  });

  describe('CorsError', () => {
    it('should own error properties', () => {
      const error = new CorsError();
      expect(error.message).to.equal('Error with CORS configuration');
      expect(error.name).to.equal('CorsError');
      expect(error.body).to.deep.equal({});
    });
  });

  describe('NetworkError', () => {
    it('should own error properties', () => {
      const error = new NetworkError();
      expect(error.message).to.equal('Network seems unreachable');
      expect(error.name).to.equal('NetworkError');
      expect(error.body).to.deep.equal({});
    });
  });
});
