#!/usr/local/bin/node
'use strict';
import Captweet from '../lib/index.js';
import args from 'args';
import co from 'co';
import fs from 'fs';
import yaml from 'js-yaml';
import { sprintf } from 'sprintf-js';

args
  .option('ini-file', 'The path of your ini file')
  .option('count', 'Number of tweets to download')
  .option('last', 'Get only last tweets')
  .option('all', 'Get the whole timeline')
  .option('verbose', 'Verbosity of the program')
  .option('screen-name', 'The screen name of a twitter account')
  .option('user-id', 'The ID of a twitter account')
  .example('twitter timeline --screen-name=@jack', 'Retrieve the id of the @jack account')
  .example('twitter timeline --all --verbose --user-id=12', 'Retrieve the last 3200 tweets of @jack, showing the download progression')
  .example('twitter timeline --last --count=10 --user-id=12', 'Retrieve the last 10 tweets of @jack');

const flags = args.parse(process.argv);

const captweet = new Captweet(flags.iniFile, flags.verbose);

if (flags.last) {
  const count = flags.count ? flags.count : 200;
  let query = {
    user_id: flags.userId,
    count: count,
    trim_user: false,
    exclude_replies: false,
    contributor_details: true,
    include_rts: true,
  };
  co(function* () {
    yield captweet.auto_refresh_rate_limit_status();
    const { tweets, min, max } = yield captweet.get_last_tweets_of_timeline(query);
    captweet.stop_refreshing();
    const date = new Date();
    const data = {
      meta: {
        date: date.toISOString(),
        length: tweets.length,
        since_id: max.toString(),
        max_id: min.add(-1).toString(),
        user_id: flags.userId,
      },
      tweets: tweets,
    };
    const filename = sprintf("user-%s-%s.yaml", flags.userId, date.toISOString());
    saveToFile(filename, data);
  }).catch(function (error) {
    console.log(error);
  });
} else if (flags.all) {
  co(function* () {
    yield captweet.auto_refresh_rate_limit_status();
    const { user_id, timeline, since_id } = yield captweet.get_whole_timeline(flags.userId);
    captweet.stop_refreshing();
    const date = new Date();
    const data = {
      meta: {
        date: date.toISOString(),
        length: timeline.length,
        since_id: since_id.toString(),
        user_id: user_id,
      },
      tweets: timeline,
    };
    const filename = sprintf("user-%s-%s.yaml", user_id, date.toISOString());
    saveToFile(filename, data);
  }).catch(function (error) {
    console.log(error);
  });
} else if (flags.screenName) {
  co(function* () {
    yield captweet.auto_refresh_rate_limit_status();
    const id = yield captweet.get_user_id_from_screen_name(flags.screenName);
    captweet.stop_refreshing();
    console.log("User %s has id '%s'.", flags.screenName, id);
  }).catch(function (error) {
    console.log(error);
  });
}

function saveToFile(filename, data) {
  const dump = yaml.safeDump(data, { indent: 2, flowLevel: -1, sortKeys: true, lineWidth: 80, noRefs: false, noCompatMode: true });
  fs.writeFileSync(filename, dump);
} 