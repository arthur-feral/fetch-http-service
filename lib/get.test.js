import 'whatwg-fetch';
import sinon from 'sinon';
import {
  expect,
} from 'chai';
import get from './get';

const jsonOk = body =>
  Promise.resolve(
    new window.Response(
      JSON.stringify(body),
      {
        status: 200,
        headers: {
          'Content-type': 'application/json',
        },
      },
    ),
  );

describe('get', () => {
  beforeEach(() => {
    sinon.stub(window, 'fetch');
    window.fetch.returns(jsonOk({ hello: 'world' }));
  });

  afterEach(() => {
    window.fetch.restore();
  });

  it('should call request with correct params', (done) => {
    get('//www.domain.ext/endpoint?access_token=abc', {
      key: 'value',
    }).then(() => {
      expect(window.fetch.args[0][0]).to.equal('//www.domain.ext/endpoint?access_token=abc&key=value');
      expect(window.fetch.args[0][1].method).to.equal('GET');
      expect(window.fetch.args[0][1].credentials).to.equal('same-origin');
      done();
    }).catch(done);
  });

  it('should call request without credentials', (done) => {
    get(
      '//www.domain.ext/endpoint?access_token=abc',
      {
        key: 'value',
      },
      {},
      false,
    ).then(() => {
      expect(window.fetch.args[0][0]).to.equal('//www.domain.ext/endpoint?access_token=abc&key=value');
      expect(window.fetch.args[0][1].method).to.equal('GET');
      expect(window.fetch.args[0][1].credentials).to.equal('omit');
      done();
    }).catch(done);
  });
});
