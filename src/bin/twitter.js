#!/usr/local/bin/node

'use strict';

import args from 'args';

args
  .command('timeline', 'Download the whole timeline of the specified account')
    .example('twitter timeline --help', 'Print the options of the command timeline')
  .command('tweet', 'Download tweets')
    .example('twitter tweet --help', 'Print the options of the command tweet')
  .command('limits', 'Download the rate limit status of all resources')
    .example('twitter limits --help', 'Print the options of the command timeline')
  .parse(process.argv);
