#!/usr/local/bin/node
'use strict';
import Captweet from '../lib/index.js';
import args from 'args';

args
  .option('ini-file', 'The path of your ini file')
  .example('twitter limits', 'Print the whole Rate limit status')
  .example('twitter limits --ini-file ~/ini.yaml', 'Print the whole Rate limit status, using a specific ini file');
const flags = args.parse(process.argv);

const captweet = new Captweet(flags.iniFile);
captweet.auto_refresh_rate_limit_status()
  .then(function() {
    captweet.stop_refreshing();
    const rates = captweet.rate_limit_status;
    console.log(JSON.stringify(rates, null, 2)); 
  });
