import 'whatwg-fetch';
import sinon from 'sinon';
import {
  expect,
  assert,
} from 'chai';
import request from './request';
import {
  LOG_ERROR_PREFIX,
  // noop,
} from './constants';

const domainUrl = 'https://www.domain.ext/';
const errorsPayload = {
  errors: [
    {
      code: 31,
      title: 'error title',
      detail: 'error details',
    },
  ],
};

const jsonOk = (body, contentType) =>
  Promise.resolve(
    new window.Response(
      JSON.stringify(body),
      {
        status: 200,
        headers: {
          'Content-type': contentType || 'application/json',
        },
      },
    ),
  );

const jsonError = (status, body) =>
  Promise.resolve(
    new window.Response(
      JSON.stringify(body),
      {
        ok: false,
        status,
        statusText: 'Internal server error',
        headers: {
          'Content-type': 'application/json',
        },
      },
    ),
  );

describe('request', () => {
  beforeEach(() => {
    sinon.stub(window, 'fetch');
  });

  afterEach(() => {
    window.fetch.restore();
  });

  describe('request arguments', () => {
    describe('HTTP Method argument', () => {
      it('should throw if no HTTP method', () => {
        expect(() => {
          request();
        }).to.throw(`${LOG_ERROR_PREFIX} HTTP method is incorrect, got undefined`);

        expect(() => {
          request(1);
        }).to.throw(`${LOG_ERROR_PREFIX} HTTP method is incorrect, got number`);
      });

      it('should throw if wrong HTTP method', () => {
        expect(() => {
          request('unknown');
        }).to.throw(`${LOG_ERROR_PREFIX} HTTP method is incorrect, must be one of GET,POST,PUT,PATCH,DELETE`);
      });
    });

    describe('URL argument', () => {
      it('should throw if no url', () => {
        expect(() => {
          request('get');
        }).to.throw(`${LOG_ERROR_PREFIX} Missing parameter url`);

        expect(() => {
          request('get', 1);
        }).to.throw(`${LOG_ERROR_PREFIX} Missing parameter url`);
      });
    });
  });

  // describe('Abort system', () => {
  //   beforeEach(() => {
  //     window.fetch.returns(jsonOk({ hello: 'world' }));
  //   });
  //
  //   it('should expose abort method if available', () => {
  //     const req = request('get', domainUrl);
  //     expect(typeof req.abort).to.equal('function');
  //     assert.isFalse(req === noop);
  //   });
  //
  //   it('should expose abort as noop if unavailable', () => {
  //     const AbortControllerRef = window.AbortController;
  //     delete window.AbortController;
  //     assert.isTrue(window.AbortController === undefined);
  //     const req = request('get', domainUrl);
  //     expect(typeof req.abort).to.equal('function');
  //     assert.isTrue(req.abort === noop);
  //     assert.isTrue(window.fetch.args[0][1].signal === undefined);
  //     window.AbortController = AbortControllerRef;
  //     assert.isTrue(window.AbortController !== undefined);
  //   });
  //
  //   it('should abort the request', (done) => {
  //     const req = request('get', domainUrl);
  //     req.catch((error) => {
  //       expect(error.name).to.equal('AbortError');
  //       done();
  //     }).catch(done);
  //     req.abort();
  //   });
  // });

  describe('queryParams', () => {
    beforeEach(() => {
      window.fetch.returns(jsonOk({ hello: 'world' }));
    });

    it('should use query params', (done) => {
      request('get', domainUrl, {
        key: 'value',
      }).then(() => {
        expect(window.fetch.args[0][0]).to.equal(`${domainUrl}?key=value`);
        done();
      }).catch(done);
    });
  });

  describe('should use the correct request options', () => {
    beforeEach(() => {
      window.fetch.returns(jsonOk({ hello: 'world' }));
    });

    describe('Content Type', () => {
      it('should use default contentType', (done) => {
        request('get', domainUrl).then(() => {
          expect(window.fetch.args[0][1].headers['Content-Type']).to.equal('application/json');
          done();
        }).catch(done);
      });

      it('should use custom contentType', (done) => {
        request('get', domainUrl, {}, {}, false, false, {
          contentType: 'text/html',
        }).then(() => {
          expect(window.fetch.args[0][1].headers['Content-Type']).to.equal('text/html');
          done();
        }).catch(done);
      });
    });

    describe('should use proper http method', () => {
      it('GET', (done) => {
        request('get', domainUrl).then(() => {
          expect(window.fetch.args[0][1].method).to.equal('GET');
          done();
        }).catch(done);
      });

      it('POST', (done) => {
        request('post', domainUrl).then(() => {
          expect(window.fetch.args[0][1].method).to.equal('POST');
          done();
        }).catch(done);
      });

      it('PATCH', (done) => {
        request('patch', domainUrl).then(() => {
          expect(window.fetch.args[0][1].method).to.equal('PATCH');
          done();
        }).catch(done);
      });

      it('PUT', (done) => {
        request('put', domainUrl).then(() => {
          expect(window.fetch.args[0][1].method).to.equal('PUT');
          done();
        }).catch(done);
      });

      it('DELETE', (done) => {
        request('delete', domainUrl).then(() => {
          expect(window.fetch.args[0][1].method).to.equal('DELETE');
          done();
        }).catch(done);
      });
    });

    describe('body', () => {
      it('should not be sent with get', (done) => {
        request('get', domainUrl).then(() => {
          assert.isTrue(window.fetch.args[0][1].body === undefined);
          done();
        }).catch(done);
      });

      it('should be sent with post', (done) => {
        request('post', domainUrl, {}, {
          a: 'a',
        }).then(() => {
          expect(window.fetch.args[0][1].body).to.equal('{"a":"a"}');
          done();
        }).catch(done);
      });

      it('should be sent with patch', (done) => {
        request('patch', domainUrl, {}, {
          b: 'b',
        }).then(() => {
          expect(window.fetch.args[0][1].body).to.equal('{"b":"b"}');
          done();
        }).catch(done);
      });

      it('should be sent with put', (done) => {
        request('put', domainUrl, {}, {
          c: 'c',
        }).then(() => {
          expect(window.fetch.args[0][1].body).to.equal('{"c":"c"}');
          done();
        }).catch(done);
      });

      it('should not be sent with delete', (done) => {
        request('delete', domainUrl).then(() => {
          assert.isTrue(window.fetch.args[0][1].body === undefined);
          done();
        }).catch(done);
      });
    });

    describe('CORS', () => {
      it('should use mode no-cors if not cross domain', (done) => {
        request('get', domainUrl, {}, {}, false, false).then(() => {
          expect(window.fetch.args[0][1].mode).to.equal('no-cors');
          done();
        }).catch(done);
      });

      it('should use mode cors if cross domain', (done) => {
        request('get', domainUrl, {}, {}, false, true).then(() => {
          expect(window.fetch.args[0][1].mode).to.equal('cors');
          done();
        }).catch(done);
      });
    });

    describe('credentials', () => {
      context('cross domain = false', () => {
        it('should use same-origin if useCredentials = false', (done) => {
          request('get', domainUrl, {}, {}, false, false).then(() => {
            expect(window.fetch.args[0][1].credentials).to.equal('omit');
            done();
          }).catch(done);
        });

        it('should use same-origin if useCredentials = true', (done) => {
          request('get', domainUrl, {}, {}, true, false).then(() => {
            expect(window.fetch.args[0][1].credentials).to.equal('same-origin');
            done();
          }).catch(done);
        });
      });

      context('cross domain = true', () => {
        it('should use same-origin if useCredentials = false', (done) => {
          request('get', domainUrl, {}, {}, false, true).then(() => {
            expect(window.fetch.args[0][1].credentials).to.equal('omit');
            done();
          }).catch(done);
        });

        it('should use same-origin if useCredentials = true', (done) => {
          request('get', domainUrl, {}, {}, true, true).then(() => {
            expect(window.fetch.args[0][1].credentials).to.equal('include');
            done();
          }).catch(done);
        });
      });
    });
  });

  describe('Errors', () => {
    it('reject with response body', (done) => {
      window.fetch.returns(jsonError(400, errorsPayload));
      request('get', domainUrl)
        .catch((error) => {
          expect(error.body).to.deep.equal(errorsPayload);
          done();
        }).catch(done);
    });

    it('reject with BadParamsError', (done) => {
      window.fetch.returns(jsonError(400, errorsPayload));
      request('get', domainUrl)
        .catch((error) => {
          expect(error.name).to.equal('BadParamsError');
          done();
        }).catch(done);
    });

    it('reject with AuthError', (done) => {
      window.fetch.returns(jsonError(401, errorsPayload));
      request('get', domainUrl)
        .catch((error) => {
          expect(error.name).to.equal('AuthError');
          done();
        }).catch(done);
    });

    it('reject with AuthError', (done) => {
      window.fetch.returns(jsonError(403, errorsPayload));
      request('get', domainUrl)
        .catch((error) => {
          expect(error.name).to.equal('AuthError');
          done();
        }).catch(done);
    });

    it('reject with NotFoundError', (done) => {
      window.fetch.returns(jsonError(404, errorsPayload));
      request('get', domainUrl)
        .catch((error) => {
          expect(error.name).to.equal('NotFoundError');
          done();
        }).catch(done);
    });

    it('reject with ServerError', (done) => {
      window.fetch.returns(jsonError(500, errorsPayload));
      request('get', domainUrl)
        .catch((error) => {
          expect(error.name).to.equal('ServerError');
          done();
        }).catch(done);
    });
  });
});
