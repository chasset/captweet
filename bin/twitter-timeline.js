#!/usr/local/bin/node

'use strict';

var _index = require('../lib/index.js');

var _index2 = _interopRequireDefault(_index);

var _args2 = require('args');

var _args3 = _interopRequireDefault(_args2);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_args3.default.option('ini-file', 'The path of your ini file').option('user-id', 'The ID of a twitter account');
var flags = _args3.default.parse(process.argv);

var captweet = new _index2.default();
var query = {
  user_id: flags.userId,
  count: 200,
  trim_user: false,
  exclude_replies: false,
  contributor_details: true,
  include_rts: true
};
(0, _co2.default)(regeneratorRuntime.mark(function _callee() {
  var _ref, tweets, min, max;

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
          min = _ref.min;
          max = _ref.max;

          tweets.map(function (tweet) {
            console.log('Tweet:', tweet.id_str);
          });
          console.log('Min:', min.toString());
          console.log('Max:', max.toString());

        case 11:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
})).catch(function (error) {
  console.log(error);
});