'use strict';

var _unit = require('unit.js');

var _unit2 = _interopRequireDefault(_unit);

var _mocha = require('mocha');

var _index = require('../lib/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)('is_allowed()', function () {

  (0, _mocha.it)('gives a go when it has enough rights to do it', function () {
    var captweet = new _index2.default();
    captweet.rate_limit_status = {
      resources: {
        application: {
          '/application/rate_limit_status/': {
            remaining: 100,
            reset: 9493747934
          }
        }
      }
    };
    var go = captweet.is_allowed('application/rate_limit_status');
    _unit2.default.bool(go).isTrue();
    var rates = captweet.rate_limit_status;
    _unit2.default.object(rates['application/rate_limit_status']).hasProperty('remaining', 99);
  });

  (0, _mocha.it)("gives NOT a go when it hasn't enough rights to do it", function () {
    var captweet = new _index2.default();
    captweet.rate_limit_status = {
      resources: {
        application: {
          '/application/rate_limit_status/': {
            remaining: -1,
            reset: 9493747934
          }
        }
      }
    };
    var go = captweet.is_allowed('application/rate_limit_status');
    _unit2.default.bool(go).isFalse();
    var rates = captweet.rate_limit_status;
    _unit2.default.object(rates['application/rate_limit_status']).hasProperty('remaining', -2);
  });

  (0, _mocha.it)("gives NOT a go when rights is 0", function () {
    var captweet = new _index2.default();
    captweet.rate_limit_status = {
      resources: {
        application: {
          '/application/rate_limit_status/': {
            remaining: 0,
            reset: 9493747934
          }
        }
      }
    };
    var go = captweet.is_allowed('application/rate_limit_status');
    _unit2.default.bool(go).isFalse();
    var rates = captweet.rate_limit_status;
    _unit2.default.object(rates['application/rate_limit_status']).hasProperty('remaining', -1);
  });

  (0, _mocha.it)("gives a go when rights is 1", function () {
    var captweet = new _index2.default();
    captweet.rate_limit_status = {
      resources: {
        application: {
          '/application/rate_limit_status/': {
            remaining: 1,
            reset: 9493747934
          }
        }
      }
    };
    var go = captweet.is_allowed('application/rate_limit_status');
    _unit2.default.bool(go).isTrue();
    var rates = captweet.rate_limit_status;
    _unit2.default.object(rates['application/rate_limit_status']).hasProperty('remaining', 0);
  });
});