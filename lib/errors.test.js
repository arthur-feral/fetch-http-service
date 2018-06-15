import {
  expect,
} from 'chai';
import {
  NotFoundError,
  ServerError,
  BadParamsError,
  AuthError,
  ParsingError,
  CorsError,
  NetworkError,
} from './errors';

describe('Errors', () => {
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
    });
  });

  describe('BadParamsError', () => {
    it('should own error properties', () => {
      const error = new BadParamsError();
      expect(error.message).to.equal('You should verify the given parameters');
      expect(error.name).to.equal('BadParamsError');
    });
  });

  describe('AuthError', () => {
    it('should own error properties', () => {
      const error = new AuthError();
      expect(error.message).to.equal('You don\'t have the permission to access the resource');
      expect(error.name).to.equal('AuthError');
    });
  });

  describe('ParsingError', () => {
    it('should own error properties', () => {
      const error = new ParsingError();
      expect(error.message).to.equal('Error while parsing response');
      expect(error.name).to.equal('ParsingError');
    });
  });

  describe('CorsError', () => {
    it('should own error properties', () => {
      const error = new CorsError();
      expect(error.message).to.equal('Error with CORS configuration');
      expect(error.name).to.equal('CorsError');
    });
  });

  describe('NetworkError', () => {
    it('should own error properties', () => {
      const error = new NetworkError();
      expect(error.message).to.equal('Network seems unreachable');
      expect(error.name).to.equal('NetworkError');
    });
  });
});
