'use strict';
import test from 'unit.js';
import { describe, it } from 'mocha';
import Captweet from '../lib/index.js';

describe('refresh_rate_limit_status', function() {

  it('download asynchronously the new rates', function(done) {
    const captweet = new Captweet();
    captweet.refresh_rate_limit_status()
      .then(function() {
        const rates = captweet.rate_limit_status;
        test
          .object(rates)
          .hasProperty('application/rate_limit_status')
          .object(rates['application/rate_limit_status'])
          .hasProperty('limit', 180);
        done();
      })
      .catch(function(error) {
        test.fail(error.message);
        done(error);
      });
  });

});

describe('auto_refresh_rate_limit_status', function() {

  it('download at successive times the new rates', function(done) {
    const captweet = new Captweet();
    captweet.auto_refresh_rate_limit_status(500);
    setTimeout(function() {
      const rates = captweet.rate_limit_status;
      test
        .object(rates)
        .hasProperty('application/rate_limit_status')
        .object(rates['application/rate_limit_status'])
        .hasProperty('limit', 180);
      done();
    }, 1100);

  });

});

