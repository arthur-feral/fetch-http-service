/* eslint-disable */
import babel_polyfill from 'babel-polyfill';
import jsdom from 'jsdom';
import sinon from 'sinon';

const { JSDOM } = jsdom;

// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
const propagateToGlobal = (win) => {
  for (let key in win) {
    if (!win.hasOwnProperty(key)) continue;
    if (key in global) continue;

    global[key] = win[key];
  }
};

// setup the simplest document possible
// get the window object out of the document
// set globals for mocha that make access to document and window feel
// natural in the test environment
const doc = new JSDOM(`
<!doctype html>
<html>
    <body></body>
</html>
`);
global.window = doc.window;
// take all properties of the window object and also attach it to the
// mocha global object
propagateToGlobal(window);

// headless browsers produce errors "Error: matchMedia not present"
// https://github.com/WickyNilliams/enquire.js/issues/82
window.matchMedia = function () {
  return {
    matches: false,
    addListener: function () {
    },
    removeListener: function () {
    },
  };
};

/**
 * setup here all stuff about virtual dom
 */

global.FormData = function () {

};

global.FormData.prototype.append = sinon.stub();

/**
 * Mock de l'object File
 * @constructor
 */
global.File = function () {

};

global.Blob = global.window.Blob;
