import {
  expect,
} from 'chai';
import {
  prepareQueryParameters,
  formatUrlWithQueryParameters,
  getErrorWithStatus,
} from './tools';

describe('tools', () => {
  describe('prepareQueryParameters', () => {
    it('should return an empty string', () => {
      expect(prepareQueryParameters({})).to.equal('');
    });

    it('should return an empty string', () => {
      expect(prepareQueryParameters(null)).to.equal('');
    });

    it('should return an empty string', () => {
      expect(prepareQueryParameters()).to.equal('');
    });

    it('should format query params properly from an object', () => {
      expect(prepareQueryParameters({
        key: 'value',
        ids: [1, 2, 3],
        redirect: 'https://www.iadvize.com/endpoint/1?lol=tulip#/anhash',
      })).to.equal(
        'ids=1%2C2%2C3&key=value&redirect=https%3A%2F%2Fwww.iadvize.com%2Fendpoint%2F1%3Flol%3Dtulip%23%2Fanhash',
      );
    });
  });

  describe('formatUrlWithQueryParameters', () => {
    it('should add ? if no query params', () => {
      expect(
        formatUrlWithQueryParameters(
          'http://www.howtank.com/concurrence/',
          {
            key: 'value',
          },
        ),
      ).to.equal(
        'http://www.howtank.com/concurrence/?key=value',
      );
    });

    it('should not add an extra & ? present with no query params', () => {
      expect(
        formatUrlWithQueryParameters(
          'http://www.howtank.com/concurrence/?',
          {
            key: 'value',
          },
        ),
      ).to.equal(
        'http://www.howtank.com/concurrence/?key=value',
      );
    });

    it('should not add an extra ?', () => {
      expect(
        formatUrlWithQueryParameters(
          'http://www.howtank.com/concurrence/?cogip=1',
          {
            key: 'value',
          },
        ),
      ).to.equal(
        'http://www.howtank.com/concurrence/?cogip=1&key=value',
      );
    });

    it('should format an url with query params properly from an object', () => {
      expect(
        formatUrlWithQueryParameters(
          'http://www.howtank.com/concurrence/?cogip=1',
          {
            key: 'value',
            ids: [1, 2, 3],
            redirect: 'https://www.iadvize.com/endpoint/1?lol=tulip#/anhash',
          },
        ),
      ).to.equal(
        'http://www.howtank.com/concurrence/?cogip=1&ids=1%2C2%2C3&key=value&redirect=https%3A%2F%2Fwww.iadvize.com%2Fendpoint%2F1%3Flol%3Dtulip%23%2Fanhash', // eslint-disable-line
      );
    });
  });

  describe('getErrorWithStatus', () => {
    it('should return an instance of the corresponding Error for a status', () => {
      expect(getErrorWithStatus({}, 400).name).to.equal('BadParamsError');
      expect(getErrorWithStatus({}, 401).name).to.equal('AuthError');
      expect(getErrorWithStatus({}, 403).name).to.equal('AuthError');
      expect(getErrorWithStatus({}, 404).name).to.equal('NotFoundError');
      expect(getErrorWithStatus({}, 418).name).to.equal('ServerError');
      expect(getErrorWithStatus({}, 500).name).to.equal('ServerError');
    });

    it('should return an error concerning cors', () => {
      expect(getErrorWithStatus({}, 0, 'opaque').name).to.equal('CorsError');
    });

    it('should return an error concerning network', () => {
      expect(getErrorWithStatus({}, 0, 'error').name).to.equal('NetworkError');
    });

    it('should return an error concerning network', () => {
      expect(getErrorWithStatus({}, 0).name).to.equal('ServerError');
    });
  });
});
