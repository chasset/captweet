#!/usr/local/bin/node
'use strict';
import Captweet from '../lib/index.js';
import args from 'args';
import co from 'co';
import fs from 'fs';
import { sprintf } from 'sprintf-js';

args
  .option('id', "The ID of a tweet to download (append a 'T' before the 64bits integer ID)")
  .example('twitter get --id T20', 'Retrieve the metadata of the tweet 20');

const flags = args.parse(process.argv);
flags.id = flags.id.replace(/[a-zA-Z]/g, '');
console.log('Fetch metadata of tweet id %s', flags.id);

const captweet = new Captweet(flags.iniFile, flags.verbose);

co(function* () {
  yield captweet.auto_refresh_rate_limit_status();
  const tweet = yield captweet.get_tweet(flags.id);
  captweet.stop_refreshing();
  let date = new Date().toISOString();
  const json = {
    meta: {
      date: date,
      length: 1,
      type: 'tweet',
    },
    data: [ tweet ],
  };
  date = date.replace(/:/g, '-');
  const filename = sprintf("tweet-%s-%s.json", flags.id, date);
  fs.writeFileSync(filename, JSON.stringify(json, null, 2));
}).catch(function (error) {
  console.log(error);
});
