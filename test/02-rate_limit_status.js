'use strict';

var _unit = require('unit.js');

var _unit2 = _interopRequireDefault(_unit);

var _mocha = require('mocha');

var _index = require('../lib/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)('set/get rate_limit_status', function () {

  (0, _mocha.it)('transform correctly the data returned by Twitter', function () {
    var captweet = new _index2.default();
    captweet.rate_limit_status = {
      resources: {
        application: {
          '/application/rate_limit_status/:id/test/': {
            remaining: 100
          }
        }
      }
    };
    _unit2.default.object(captweet.rate_limit_status).hasProperty('application/rate_limit_status');
  });
});