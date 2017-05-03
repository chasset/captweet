'use strict';
import test from 'unit.js';
import { describe, it } from 'mocha';
import Captweet from '../lib/index.js';

describe('query()', function() {

  it('queries the Twitter server', function(done) {
    const captweet = new Captweet();
    captweet.refresh_rate_limit_status()
      .then(function() {
        return captweet.query('users/show', { screen_name: '@mobitweet_' });
      })
      .then(function(data) {
        test
          .object(data)
          .hasProperty('id_str', '801470286579335169');
        done();
      })
      .catch(function(error) {
        test.fail(error.message);
        done(error);
      });
  });

  it('returns an error when not enough resource', function(done) {
    const captweet = new Captweet();
    captweet.rate_limit_status = {
      resources: {
        application: {
          '/users/show/:id/test/': {
            remaining: 0,
          },
        },
      },
    };
    captweet.query('users/show', { screen_name: '@mobitweet_' })
      .then(function() {
        test.fail('No check of resource!');
        done();
      })
      .catch(function(error) {
        test.error(error)
          .string(error.message).is('No more resource. Wait a bit.');
        done();
      });
  });

});
