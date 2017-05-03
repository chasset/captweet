#!/usr/local/bin/node


'use strict';

var _index = require('../lib/index.js');

var _index2 = _interopRequireDefault(_index);

var _args = require('args');

var _args2 = _interopRequireDefault(_args);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_args2.default.option('ini-file', 'The path of your ini file');

var flags = _args2.default.parse(process.argv);
var captweet = new _index2.default(flags.iniFile);
captweet.refresh_rate_limit_status();
setTimeout(function () {
  var rates = captweet.rate_limit_status;
  console.log(JSON.stringify(rates, null, 2));
}, 1000);