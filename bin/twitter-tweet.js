#!/usr/local/bin/node

'use strict';

var _index = require('../lib/index.js');

var _index2 = _interopRequireDefault(_index);

var _args3 = require('args');

var _args4 = _interopRequireDefault(_args3);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _sprintfJs = require('sprintf-js');

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_args4.default.option('id', "The ID of a tweet to download (append a 'T' before the 64bits integer ID)").option('ids-file', "The file containing the IDs of tweet to retrieve").option('verbose', 'Verbosity of the program').example('twitter get --verbose --ids-file ~/ids.txt', 'Retrieve the metadata of the tweet IDs included in the file').example('twitter get --id T20', 'Retrieve the metadata of the tweet 20');

var flags = _args4.default.parse(process.argv);

var captweet = new _index2.default(flags.iniFile, flags.verbose);

if (flags.id) {
  (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
    var tweet;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            flags.id = flags.id.replace(/[a-zA-Z]/g, '');
            _context.next = 3;
            return captweet.auto_refresh_rate_limit_status();

          case 3:
            _context.next = 5;
            return captweet.get_tweet(flags.id);

          case 5:
            tweet = _context.sent;

            captweet.stop_refreshing();
            console.log(JSON.stringify(tweet, null, 2));

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  })).catch(function (error) {
    console.log(error);
  });
}

if (flags.idsFile) {
  (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
    var ids, tweets, date, json, filename;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            ids = _jsYaml2.default.safeLoad(_fs2.default.readFileSync(flags.idsFile, 'utf8'));
            _context2.next = 3;
            return captweet.auto_refresh_rate_limit_status();

          case 3:
            _context2.next = 5;
            return captweet.get_tweets_from_ids(ids);

          case 5:
            tweets = _context2.sent;

            captweet.stop_refreshing();
            date = new Date().toISOString();
            json = {
              meta: {
                date: date,
                length: {
                  requested: ids.length,
                  retrieved: tweets.length
                },
                type: 'tweet',
                ids: ids
              },
              data: tweets
            };

            date = date.replace(/:/g, '-');
            filename = (0, _sprintfJs.sprintf)("tweets-%s.json", date);

            _fs2.default.writeFileSync(filename, JSON.stringify(json, null, 2));

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