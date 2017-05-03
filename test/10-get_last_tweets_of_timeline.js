'use strict';

var _unit = require('unit.js');

var _unit2 = _interopRequireDefault(_unit);

var _mocha = require('mocha');

var _index = require('../lib/index.js');

var _index2 = _interopRequireDefault(_index);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)('get_first_tweets_of_timeline()', function () {

  (0, _mocha.it)('downloads 200 tweets of a user', function (done) {
    var captweet = new _index2.default();
    var query = {
      user_id: 12,
      count: 200,
      trim_user: false,
      exclude_replies: false,
      contributor_details: true,
      include_rts: true
    };
    (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
      var _ref, tweets;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return captweet.refresh_rate_limit_status();

            case 2:
              _context.next = 4;
              return captweet.get_last_tweets_of_timeline(query);

            case 4:
              _ref = _context.sent;
              tweets = _ref.tweets;

              _unit2.default.array(tweets).hasLength(200);
              done();

            case 8:
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