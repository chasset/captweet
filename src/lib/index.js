'use strict';

import 'babel-polyfill';
import fs from 'fs';
import os from 'os';
import path from 'path';
import yaml from 'js-yaml';
import Twit from 'twit';
import co from 'co';
import bigInt from 'big-integer';

const RATE_LIMIT_STATUS = Symbol();

export default class Captweet {

  constructor(iniFile, verbose) {
    if (!iniFile) { iniFile = path.join(os.homedir(), 'ini.yaml'); }
    const ini = yaml.safeLoad(fs.readFileSync(iniFile, 'utf8'));
    const tokens = {
      consumer_key: ini.twitter.account.key,
      consumer_secret: ini.twitter.account.secret,
      app_only_auth: true,
      timeout_ms: 60000,
    };
    this.twitter = new Twit(tokens);
    this.verbose = verbose;
  }

  get_tweet(tweet_id) {
    const captweet = this;
    return co(function*() {
      const data = yield captweet.query('statuses/show', { id: tweet_id, trim_user: false, include_entities: true });
      return data;
    });
  }

  get_whole_timeline(user_id, since_id) {
    const captweet = this;
    return co(function*() {
      const count = 200; // Maximum 200
      let nbr = count;
      let timeline = [];
      let go = true;
      let query = {
        user_id: user_id,
        count: count, 
        trim_user: true,
        exclude_replies: false,
        contributor_details: true,
        include_rts: true,
      };
      if (since_id) { query.since_id = since_id.toString(); }
      if (captweet.verbose) { console.warn('Beginning to download the whole timeline of user', user_id); }
      while (go) {
        const { tweets, min, max } = yield captweet.get_last_tweets_of_timeline(query);
        nbr = tweets.length;
        if (nbr > 0) {
          timeline = timeline.concat(tweets);
          query.max_id = min.add(-1).toString();
          if (!since_id || max.greater(since_id) ) { since_id = max; }
          if (captweet.verbose) { console.warn('Tweets ID between', max.toString(), 'and', min.toString(), 'retrieved.'); }
        } else { go = false; }
      }
      return { user_id, timeline, since_id };
    });
  }

  get_last_tweets_of_timeline(query) {
    const captweet = this;
    return co(function*() {
      const raw_tweets = yield captweet.query('statuses/user_timeline', query);
      const { tweets, min, max } = captweet.find_min_and_max_from_array_of_tweets(raw_tweets);
      return { tweets, min, max };
    });
  }

  find_min_and_max_from_array_of_tweets(tweets) {
    let min, max;
    tweets.map(function(tweet) {
      tweet._id = tweet.id_str;
      const id = bigInt(tweet.id_str);
      if (!min && !max) { min = max = id; }
      if (min.greater(id)) { min = id; }
      if (id.greater(max)) { max = id; }
    });
    return {tweets, min, max};
  }

  get_user_id_from_screen_name(user) {
    const captweet = this;
    return co(function*() {
      const data = yield captweet.query('users/show', { screen_name: user });
      return data.id_str;
    });
  }

  auto_refresh_rate_limit_status(interval) {
    const delay = interval ? interval : 15*60*1000;
    const captweet = this;
    this.setInterval = setInterval(function() { captweet.refresh_rate_limit_status(); }, delay);
    if (this.verbose) { console.warn('Start refreshing automatically Rate limit status.'); }
    return this.refresh_rate_limit_status();
  }

  stop_refreshing() {
    clearInterval(this.setInterval); 
    if (this.verbose) { console.warn('Stop refreshing automatically Rate limit status.'); }
  }

  refresh_rate_limit_status() {
    const captweet = this;
    return co(function*() {
      const resource = 'application/rate_limit_status';
      const query = {};
      const result = yield captweet.twitter.get(resource, query);
      captweet.rate_limit_status = result.data;
      if (captweet.verbose) { console.warn('Rate limit status refreshed.'); }
    });
  }

  query(resource, query) {
    const captweet = this;
    return new Promise(function(resolve) {
      if (captweet.is_allowed(resource)) {
        captweet.twitter.get(resource, query)
          .then(function(result) { resolve(result.data); });
      }
    });
  }

  is_allowed(resource) {
    const rate = this[RATE_LIMIT_STATUS][resource].remaining--;
    if (this.verbose && rate === 0) { 
      console.warn('Resource', resource, 'reached its rate limit.');
      console.warn('Wait', Math.round(this[RATE_LIMIT_STATUS][resource].reset - Date.now()/1000), 'seconds to get more resources.');
    }
    return rate > 0; 
  }

  set rate_limit_status(data) {
    this[RATE_LIMIT_STATUS] = {};
    for (const type in data.resources) {
      for (const resource_long in data.resources[type]) {
        const resource = resource_long.match(/^\/?([^:]+[^/:])/)[1];
        this[RATE_LIMIT_STATUS][resource] = data.resources[type][resource_long];
      }
    }
  }

  get rate_limit_status() { return this[RATE_LIMIT_STATUS]; }

}
