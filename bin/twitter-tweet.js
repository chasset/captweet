#!/usr/local/bin/node

'use strict';

var _index = require('../lib/index.js');

var _index2 = _interopRequireDefault(_index);

var _args2 = require('args');

var _args3 = _interopRequireDefault(_args2);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _sprintfJs = require('sprintf-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_args3.default.option('id', "The ID of a tweet to download (append a 'T' before the 64bits integer ID)").example('twitter get --id T20', 'Retrieve the metadata of the tweet 20');

var flags = _args3.default.parse(process.argv);
flags.id = flags.id.replace(/[a-zA-Z]/g, '');
console.log('Fetch metadata of tweet id %s', flags.id);

var captweet = new _index2.default(flags.iniFile, flags.verbose);

(0, _co2.default)(regeneratorRuntime.mark(function _callee() {
  var tweet, date, json, filename;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return captweet.auto_refresh_rate_limit_status();

        case 2:
          _context.next = 4;
          return captweet.get_tweet(flags.id);

        case 4:
          tweet = _context.sent;

          captweet.stop_refreshing();
          date = new Date().toISOString();
          json = {
            meta: {
              date: date,
              length: 1,
              type: 'tweet'
            },
            data: [tweet]
          };

          date = date.replace(/:/g, '-');
          filename = (0, _sprintfJs.sprintf)("tweet-%s-%s.json", flags.id, date);

          _fs2.default.writeFileSync(filename, JSON.stringify(json, null, 2));

        case 11:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
})).catch(function (error) {
  console.log(error);
});