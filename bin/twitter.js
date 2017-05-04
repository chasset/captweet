#!/usr/local/bin/node


'use strict';

var _args = require('args');

var _args2 = _interopRequireDefault(_args);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_args2.default.command('timeline', 'Download the whole timeline of the specified account').option('ini-file', 'The path of your ini file').option('count', 'Number of tweets to download').option('last', 'Get only last tweets').option('all', 'Get the whole timeline').option('verbose', 'Verbosity of the program').option('screen-name', 'The screen name of a twitter account').option('user-id', 'The ID of a twitter account').example('twitter timeline --screen-name=@jack', 'Retrieve the id of the @jack account').example('twitter timeline --all --verbose --user-id=12', 'Retrieve the last 3200 tweets of @jack, showing the download progression').example('twitter timeline --last --count=10 --user-id=12', 'Retrieve the last 10 tweets of @jack').command('tweet', 'Download tweets').option('id', "The ID of a tweet to download (append a 'T' before the 64bits integer ID)").option('ids-file', "The file containing the IDs of tweet to retrieve").example('twitter get --ids-file ~/ids.txt', 'Retrieve the metadata of the tweet IDs included in the file').example('twitter get --id T20', 'Retrieve the metadata of the tweet 20').command('limits', 'Download the rate limit status of all resources').option('ini-file', 'The path of your ini file').example('twitter limits', 'Print the whole Rate limit status').example('twitter limits --ini-file ~/ini.yaml', 'Print the whole Rate limit status, using a specific ini file').parse(process.argv);