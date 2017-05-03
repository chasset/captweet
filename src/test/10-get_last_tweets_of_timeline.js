'use strict';
import test from 'unit.js';
import { describe, it } from 'mocha';
import Captweet from '../lib/index.js';
import co from 'co';

describe('get_first_tweets_of_timeline()', function() {

  it('downloads 200 tweets of a user', function(done) {
    const captweet = new Captweet();
    let query = {
      user_id: 12,
      count: 200,
      trim_user: false,
      exclude_replies: false,
      contributor_details: true,
      include_rts: true,
    };
    co(function*() {
      yield captweet.refresh_rate_limit_status();
      const {tweets} = yield captweet.get_last_tweets_of_timeline(query);
      test.array(tweets).hasLength(200);
      done();
    }).catch(function(error) {
      test.fail(error.message);
      done(error);
    });
    
  });

});
