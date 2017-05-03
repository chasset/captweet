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

  constructor(iniFile) {
    if (!iniFile) { iniFile = path.join(os.homedir(), 'ini.yaml'); }
    const ini = yaml.safeLoad(fs.readFileSync(iniFile, 'utf8'));
    const tokens = {
      consumer_key: ini.twitter.account.key,
      consumer_secret: ini.twitter.account.secret,
      app_only_auth: true,
      timeout_ms: 60000,
    };
    this.twitter = new Twit(tokens);
  }

  get_whole_timeline(user, since_id) {
    const captweet = this;
    return co(function*() {
      let max_id, count = 200, nbr = count, total, timeline = [];
      let query = {
        user_id: captweet.get_user_id_from_screen_name(user),
        count: count, // Maximum 200
        trim_user: true,
        exclude_replies: false,
        contributor_details: true,
        include_rts: true,
      };
      if (since_id) { query.since_id = since_id; }
      console.info('Beginning downloading of the whole timeline');
      while (nbr >= count) {
        const {tweets, min, max} = yield captweet.get_first_tweets_of_timeline(query);
        timeline.push(tweets);
        max_id = min.add(-1);
        query.max_id = max_id;
        console.log('Max_id:', max_id);
        if (!since_id || max.greater(since_id) ) { since_id = max; }
        nbr = tweets.length;
        total += nbr;
      }
      console.warn('Enregistrer quelque part since_id pour éviter de réitérer sur toute la timeline:', since_id);
      console.info('Nombre de tweets:', total);
      return timeline;
    });
  }

  get_first_tweets_of_timeline(query) {
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
    return setInterval(function() { captweet.refresh_rate_limit_status(); }, delay);
  }

  refresh_rate_limit_status() {
    const captweet = this;
    return co(function*() {
      const resource = 'application/rate_limit_status';
      const query = {};
      const result = yield captweet.twitter.get(resource, query);
      captweet.rate_limit_status = result.data;
    });
  }

  query(resource, query) {
    const captweet = this;
    return co(function*() {
      if (captweet.is_allowed(resource)) {
        const result = yield captweet.twitter.get(resource, query);
        return result.data;
      } else { throw new Error('No more resource. Wait a bit.'); }
    });
  }

  is_allowed(resource) { return this[RATE_LIMIT_STATUS][resource].remaining-- > 0; }

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
