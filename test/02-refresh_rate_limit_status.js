'use strict';

var _unit = require('unit.js');

var _unit2 = _interopRequireDefault(_unit);

var _mocha = require('mocha');

var _index = require('../lib/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)('refresh_rate_limit_status', function () {

  (0, _mocha.it)('download asynchronously the new rates', function (done) {
    var captweet = new _index2.default();
    captweet.refresh_rate_limit_status().then(function () {
      var rates = captweet.rate_limit_status;
      _unit2.default.object(rates).hasProperty('application/rate_limit_status').object(rates['application/rate_limit_status']).hasProperty('limit', 180);
      done();
    }).catch(function (error) {
      _unit2.default.fail(error.message);
      done(error);
    });
  });
});

(0, _mocha.describe)('auto_refresh_rate_limit_status', function () {

  (0, _mocha.it)('download at successive times the new rates', function (done) {
    var captweet = new _index2.default();
    captweet.auto_refresh_rate_limit_status(500);
    setTimeout(function () {
      var rates = captweet.rate_limit_status;
      _unit2.default.object(rates).hasProperty('application/rate_limit_status').object(rates['application/rate_limit_status']).hasProperty('limit', 180);
      done();
    }, 1100);
  });
});