#!/usr/local/bin/node

'use strict';

var _index = require('../lib/index.js');

var _index2 = _interopRequireDefault(_index);

var _args4 = require('args');

var _args5 = _interopRequireDefault(_args4);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _sprintfJs = require('sprintf-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_args5.default.option('ini-file', 'The path of your ini file').option('count', 'Number of tweets to download').option('last', 'Get only last tweets').option('all', 'Get the whole timeline').option('verbose', 'Verbosity of the program').option('screen-name', 'The screen name of a twitter account').option('user-id', 'The ID of a twitter account').example('twitter timeline --screen-name=@jack', 'Retrieve the id of the @jack account').example('twitter timeline --all --verbose --user-id=12', 'Retrieve the last 3200 tweets of @jack, showing the download progression').example('twitter timeline --last --count=10 --user-id=12', 'Retrieve the last 10 tweets of @jack');

var flags = _args5.default.parse(process.argv);

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
    var _ref, tweets, min, max, date, data, filename;

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

            captweet.stop_refreshing();
            date = new Date();
            data = {
              meta: {
                date: date.toISOString(),
                length: tweets.length,
                since_id: max.toString(),
                max_id: min.add(-1).toString(),
                user_id: flags.userId,
                type: 'timeline'
              },
              data: tweets
            };
            filename = (0, _sprintfJs.sprintf)("user-%s-%s.json", flags.userId, date.toISOString());

            _fs2.default.writeFileSync(filename, JSON.stringify(data, null, 2));

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  })).catch(function (error) {
    console.log(error);
  });
} else if (flags.all) {
  (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
    var _ref2, user_id, timeline, since_id, date, data, filename;

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
            date = new Date();
            data = {
              meta: {
                date: date.toISOString(),
                length: timeline.length,
                since_id: since_id.toString(),
                user_id: user_id,
                type: 'timeline'
              },
              data: timeline
            };
            filename = (0, _sprintfJs.sprintf)("user-%s-%s.json", user_id, date.toISOString());

            _fs2.default.writeFileSync(filename, JSON.stringify(data, null, 2));

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  })).catch(function (error) {
    console.log(error);
  });
} else if (flags.screenName) {
  (0, _co2.default)(regeneratorRuntime.mark(function _callee3() {
    var id;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return captweet.auto_refresh_rate_limit_status();

          case 2:
            _context3.next = 4;
            return captweet.get_user_id_from_screen_name(flags.screenName);

          case 4:
            id = _context3.sent;

            captweet.stop_refreshing();
            console.log("User %s has id '%s'.", flags.screenName, id);

          case 7:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  })).catch(function (error) {
    console.log(error);
  });
}