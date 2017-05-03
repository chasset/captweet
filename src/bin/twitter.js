#!/usr/local/bin/node

'use strict';

import args from 'args';

args
  .option('ini-file', 'The path of your ini file')
  .option('user-id', 'The ID of a twitter account')
  .option('screen_name', 'The name of a twitter account')
  .option('verbose', 'Verbosity of the program')
  .command('timeline', 'Download the whole timeline of the specified account')
  .command('limits', 'Download the rate limit status of all resources')
  .parse(process.argv);
