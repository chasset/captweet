'use strict';
import test from 'unit.js';
import { describe, it } from 'mocha';
import Captweet from '../lib/index.js';
import co from 'co';

describe('get_tweet()', function() {

  it('downloads the metadata of that tweet', function(done) {
    const captweet = new Captweet();
    co(function*() {
      const id = '20';
      yield captweet.auto_refresh_rate_limit_status();
      const tweet = yield captweet.get_tweet(id);
      captweet.stop_refreshing();
      test
        .object(tweet)
        .hasProperty('id')
        .hasProperty('id_str', id)
        .hasProperty('text')
        .hasProperty('user');
      done();
    }).catch(function(error) {
      test.fail(error.message);
      done(error);
    });
    
  });

});
