#!/usr/local/bin/node

'use strict';

import args from 'args';

args
  .option('ini-file', 'The path of your ini file')
  .option('account', 'A twitter account')
  .command('timeline', 'Download the whole timeline of the specified account')
  .command('limits', 'Download the rate limit status of all resources')
  .parse(process.argv);
