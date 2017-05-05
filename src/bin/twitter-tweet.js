#!/usr/local/bin/node
'use strict';
import Captweet from '../lib/index.js';
import args from 'args';
import co from 'co';
import fs from 'fs';
import { sprintf } from 'sprintf-js';
import yaml from 'js-yaml';

args
  .option('id', "The ID of a tweet to download (append a 'T' before the 64bits integer ID)")
  .option('ids-file', "The file containing the IDs of tweet to retrieve")
  .option('verbose', 'Verbosity of the program')
  .example('twitter get --verbose --ids-file ~/ids.txt', 'Retrieve the metadata of the tweet IDs included in the file')
  .example('twitter get --id T20', 'Retrieve the metadata of the tweet 20');

const flags = args.parse(process.argv);

const captweet = new Captweet(flags.iniFile, flags.verbose);

if (flags.id) {
  co(function* () {
    flags.id = flags.id.replace(/[a-zA-Z]/g, '');
    yield captweet.auto_refresh_rate_limit_status();
    const tweet = yield captweet.get_tweet(flags.id);
    captweet.stop_refreshing();
    console.log(JSON.stringify(tweet, null, 2));
  }).catch(function (error) {
    console.log(error);
  });
}

if (flags.idsFile) {
  co(function* () {
    const ids = yaml.safeLoad(fs.readFileSync(flags.idsFile, 'utf8'));
    yield captweet.auto_refresh_rate_limit_status();
    const tweets = yield captweet.get_tweets_from_ids(ids);
    captweet.stop_refreshing();
    let date = new Date().toISOString();
    const json = {
      meta: {
        date: date,
        length: {
          requested: ids.length,
          retrieved: tweets.length,
        },
        type: 'tweet',
        ids: ids,
      },
      data: tweets,
    };
    date = date.replace(/:/g, '-');
    const filename = sprintf("tweets-%s.json", date);
    fs.writeFileSync(filename, JSON.stringify(json, null, 2));
  }).catch(function (error) {
    console.log(error);
  });
}
