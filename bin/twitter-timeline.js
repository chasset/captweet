#!/usr/local/bin/node

'use strict';

var _index = require('../lib/index.js');

var _index2 = _interopRequireDefault(_index);

var _args3 = require('args');

var _args4 = _interopRequireDefault(_args3);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_args4.default.option('ini-file', 'The path of your ini file').option('count', 'Number of tweets to download').option('last', 'Get only last tweets').option('verbose', 'Verbosity of the program').option('user-id', 'The ID of a twitter account');
var flags = _args4.default.parse(process.argv);

var captweet = new _index2.default(flags.iniFile, flags.verbose);

if (flags.last) {
  var count = flags.count ? flags.count : 200;
  var query = {
    user_id: flags.userId,
    count: count,
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
            return captweet.auto_refresh_rate_limit_status();

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
            captweet.stop_refreshing();
            console.log('Length:', tweets.length);
            console.log('Min:', min.toString());
            console.log('Max:', max.toString());

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  })).catch(function (error) {
    console.log(error);
  });
} else {
  (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
    var _ref2, user_id, timeline, since_id;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return captweet.auto_refresh_rate_limit_status();

          case 2:
            _context2.next = 4;
            return captweet.get_whole_timeline(flags.userId);

          case 4:
            _ref2 = _context2.sent;
            user_id = _ref2.user_id;
            timeline = _ref2.timeline;
            since_id = _ref2.since_id;

            captweet.stop_refreshing();
            console.log('Length:', timeline.length);
            console.log('since_id:', since_id.toString());
            console.log('user_id:', user_id);

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  })).catch(function (error) {
    console.log(error);
  });
}