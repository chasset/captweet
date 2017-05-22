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
  .command('stat', 'Extract metadata fields from a serie of results')
    .example('twitter get --verbose --fields "id_str,text,user.screen_name" --result-files ~/*.json', 'Extract the tweet id, its text and the screen_name of its author in all files ending with json')
  .parse(process.argv);
