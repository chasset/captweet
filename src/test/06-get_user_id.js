'use strict';
import test from 'unit.js';
import { describe, it } from 'mocha';
import Captweet from '../lib/index.js';

describe('get_user_id_from_screen_name()', function() {

  it('fetch the id of a user', function(done) {
    const captweet = new Captweet();
    captweet.refresh_rate_limit_status()
      .then(function() {
        return captweet.get_user_id_from_screen_name('@mobitweet_');
      })
      .then(function(data) {
        test.string(data).is('801470286579335169');
        done();
      })
      .catch(function(error) {
        test.fail(error.message);
        done(error);
      });
  });

});
