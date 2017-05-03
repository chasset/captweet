#!/usr/local/bin/node

'use strict';

import Captweet from '../lib/index.js';
import args from 'args';

args
  .option('ini-file', 'The path of your ini file');

const flags = args.parse(process.argv);
const captweet = new Captweet(flags.iniFile);
captweet.refresh_rate_limit_status();
setTimeout(function() {
  const rates = captweet.rate_limit_status;
  console.log(JSON.stringify(rates, null, 2)); 
}, 1000);
