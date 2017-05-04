'use strict';

var _unit = require('unit.js');

var _unit2 = _interopRequireDefault(_unit);

var _mocha = require('mocha');

var _index = require('../lib/index.js');

var _index2 = _interopRequireDefault(_index);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)('get_tweet()', function () {

  (0, _mocha.it)('downloads the metadata of that tweet', function (done) {
    var captweet = new _index2.default();
    (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
      var id, tweet;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              id = '20';
              _context.next = 3;
              return captweet.auto_refresh_rate_limit_status();

            case 3:
              _context.next = 5;
              return captweet.get_tweet(id);

            case 5:
              tweet = _context.sent;

              captweet.stop_refreshing();
              _unit2.default.object(tweet).hasProperty('id').hasProperty('id_str', id).hasProperty('text').hasProperty('user');
              done();

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })).catch(function (error) {
      _unit2.default.fail(error.message);
      done(error);
    });
  });
});