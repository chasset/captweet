#!/usr/local/bin/node


'use strict';

var _args = require('args');

var _args2 = _interopRequireDefault(_args);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_args2.default.option('ini-file', 'The path of your ini file').option('user-id', 'The ID of a twitter account').option('screen_name', 'The name of a twitter account').command('timeline', 'Download the whole timeline of the specified account').command('limits', 'Download the rate limit status of all resources').parse(process.argv);