'use strict';
import test from 'unit.js';
import { describe, it } from 'mocha';
import Captweet from '../lib/index.js';
import co from 'co';
import bigInt from 'big-integer';

describe('get_whole_timeline()', function() {

  it('downloads 3200 tweets of a user', function(done) {
    const captweet = new Captweet();
    const user = 12;
    co(function*() {
      yield captweet.auto_refresh_rate_limit_status();
      const { user_id, timeline, since_id } = yield captweet.get_whole_timeline(user);
      captweet.stop_refreshing();
      test
        .array(timeline)
        .number(timeline.length).isBetween(3200, 3300)
        .number(user_id).is(user)
        .object(since_id).isInstanceOf(bigInt);
      done();
    }).catch(function(error) {
      test.fail(error.message);
      done(error);
    });
    
  });

});
