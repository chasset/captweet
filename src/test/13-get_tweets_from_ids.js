'use strict';
import test from 'unit.js';
import { describe, it } from 'mocha';
import Captweet from '../lib/index.js';
import co from 'co';

describe('get_tweets_from_ids()', function() {

  it('downloads the metadata of that tweet', function(done) {
    const captweet = new Captweet();
    co(function*() {
      const ids = ['20', '859843952442306561'];
      yield captweet.auto_refresh_rate_limit_status();
      const tweets = yield captweet.get_tweets_from_ids(ids);
      captweet.stop_refreshing();
      test
        .array(tweets)
        .hasLength(2);
      const tweet0 = tweets[0];
      test
        .object(tweet0)
        .hasProperty('id')
        .hasProperty('id_str', '20')
        .hasProperty('text')
        .hasProperty('user');
      const tweet1 = tweets[1];
      test
        .object(tweet1)
        .hasProperty('id')
        .hasProperty('id_str', '859843952442306561')
        .hasProperty('text')
        .hasProperty('user');
      done();
    }).catch(function(error) {
      test.fail(error.message);
      done(error);
    });
    
  });

});
