#!/usr/local/bin/node
'use strict';
import Captweet from '../lib/index.js';
import args from 'args';
import co from 'co';

args
  .option('ini-file', 'The path of your ini file')
  .option('user-id', 'The ID of a twitter account');
const flags = args.parse(process.argv);

const captweet = new Captweet();
let query = {
  user_id: flags.userId,
  count: 200,
  trim_user: false,
  exclude_replies: false,
  contributor_details: true,
  include_rts: true,
};
co(function*() {
  yield captweet.refresh_rate_limit_status();
  const {tweets, min, max} = yield captweet.get_last_tweets_of_timeline(query);
  tweets.map(function(tweet) { console.log('Tweet:', tweet.id_str); });
  console.log('Min:', min.toString());
  console.log('Max:', max.toString());
}).catch(function(error) {
  console.log(error);
});
