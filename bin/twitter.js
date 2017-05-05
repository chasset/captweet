#!/usr/local/bin/node


'use strict';

var _args = require('args');

var _args2 = _interopRequireDefault(_args);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_args2.default.command('timeline', 'Download the whole timeline of the specified account').example('twitter timeline --help', 'Print the options of the command timeline').command('tweet', 'Download tweets').example('twitter tweet --help', 'Print the options of the command tweet').command('limits', 'Download the rate limit status of all resources').example('twitter limits --help', 'Print the options of the command timeline').parse(process.argv);