'use strict';

import 'babel-polyfill';
import fs from 'fs';
import os from 'os';
import path from 'path';
import yaml from 'js-yaml';
import Twit from 'twit';
import co from 'co';

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
