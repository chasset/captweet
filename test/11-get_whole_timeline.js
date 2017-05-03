'use strict';

var _unit = require('unit.js');

var _unit2 = _interopRequireDefault(_unit);

var _mocha = require('mocha');

var _index = require('../lib/index.js');

var _index2 = _interopRequireDefault(_index);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _bigInteger = require('big-integer');

var _bigInteger2 = _interopRequireDefault(_bigInteger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)('get_whole_timeline()', function () {

  (0, _mocha.it)('downloads 3200 tweets of a user', function (done) {
    var captweet = new _index2.default();
    var user = 12;
    (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
      var _ref, user_id, timeline, since_id;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return captweet.auto_refresh_rate_limit_status();

            case 2:
              _context.next = 4;
              return captweet.get_whole_timeline(user);

            case 4:
              _ref = _context.sent;
              user_id = _ref.user_id;
              timeline = _ref.timeline;
              since_id = _ref.since_id;

              captweet.stop_refreshing();
              _unit2.default.array(timeline).number(timeline.length).isBetween(3200, 3300).number(user_id).is(user).object(since_id).isInstanceOf(_bigInteger2.default);
              done();

            case 11:
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