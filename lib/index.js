'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _twit = require('twit');

var _twit2 = _interopRequireDefault(_twit);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RATE_LIMIT_STATUS = Symbol();

var Captweet = function () {
  function Captweet(iniFile) {
    _classCallCheck(this, Captweet);

    if (!iniFile) {
      iniFile = _path2.default.join(_os2.default.homedir(), 'ini.yaml');
    }
    var ini = _jsYaml2.default.safeLoad(_fs2.default.readFileSync(iniFile, 'utf8'));
    var tokens = {
      consumer_key: ini.twitter.account.key,
      consumer_secret: ini.twitter.account.secret,
      app_only_auth: true,
      timeout_ms: 60000
    };
    this.twitter = new _twit2.default(tokens);
  }

  _createClass(Captweet, [{
    key: 'get_user_id_from_screen_name',
    value: function get_user_id_from_screen_name(user) {
      var captweet = this;
      return (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
        var data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return captweet.query('users/show', { screen_name: user });

              case 2:
                data = _context.sent;
                return _context.abrupt('return', data.id_str);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
    }
  }, {
    key: 'auto_refresh_rate_limit_status',
    value: function auto_refresh_rate_limit_status(interval) {
      var delay = interval ? interval : 15 * 60 * 1000;
      var captweet = this;
      return setInterval(function () {
        captweet.refresh_rate_limit_status();
      }, delay);
    }
  }, {
    key: 'refresh_rate_limit_status',
    value: function refresh_rate_limit_status() {
      var captweet = this;
      return (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
        var resource, query, result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                resource = 'application/rate_limit_status';
                query = {};
                _context2.next = 4;
                return captweet.twitter.get(resource, query);

              case 4:
                result = _context2.sent;

                captweet.rate_limit_status = result.data;

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));
    }
  }, {
    key: 'query',
    value: function query(resource, _query) {
      var captweet = this;
      return (0, _co2.default)(regeneratorRuntime.mark(function _callee3() {
        var result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!captweet.is_allowed(resource)) {
                  _context3.next = 7;
                  break;
                }

                _context3.next = 3;
                return captweet.twitter.get(resource, _query);

              case 3:
                result = _context3.sent;
                return _context3.abrupt('return', result.data);

              case 7:
                throw new Error('No more resource. Wait a bit.');

              case 8:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));
    }
  }, {
    key: 'is_allowed',
    value: function is_allowed(resource) {
      return this[RATE_LIMIT_STATUS][resource].remaining-- > 0;
    }
  }, {
    key: 'rate_limit_status',
    set: function set(data) {
      this[RATE_LIMIT_STATUS] = {};
      for (var type in data.resources) {
        for (var resource_long in data.resources[type]) {
          var resource = resource_long.match(/^\/?([^:]+[^/:])/)[1];
          this[RATE_LIMIT_STATUS][resource] = data.resources[type][resource_long];
        }
      }
    },
    get: function get() {
      return this[RATE_LIMIT_STATUS];
    }
  }]);

  return Captweet;
}();

exports.default = Captweet;