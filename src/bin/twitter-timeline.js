#!/usr/local/bin/node
'use strict';
import Captweet from '../lib/index.js';
import args from 'args';
import co from 'co';

args
  .option('ini-file', 'The path of your ini file')
  .option('count', 'Number of tweets to download')
  .option('last', 'Get only last tweets')
  .option('verbose', 'Verbosity of the program')
  .option('user-id', 'The ID of a twitter account');
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
  co(function*() {
    yield captweet.auto_refresh_rate_limit_status();
    const {tweets, min, max} = yield captweet.get_last_tweets_of_timeline(query);
    tweets.map(function(tweet) { console.log('Tweet:', tweet.id_str); });
    captweet.stop_refreshing();
    console.log('Length:', tweets.length);
    console.log('Min:', min.toString());
    console.log('Max:', max.toString());
  }).catch(function(error) {
    console.log(error);
  });
} else {
  co(function*() {
    yield captweet.auto_refresh_rate_limit_status();
    const { user_id, timeline, since_id } = yield captweet.get_whole_timeline(flags.userId);
    captweet.stop_refreshing();
    console.log('Length:', timeline.length);
    console.log('since_id:', since_id.toString());
    console.log('user_id:', user_id);
  }).catch(function(error) {
    console.log(error);
  });
}