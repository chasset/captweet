'use strict';
import test from 'unit.js';
import { describe, it } from 'mocha';
import Captweet from '../lib/index.js';

describe('is_allowed()', function() {

  it('gives a go when it has enough rights to do it', function() {
    const captweet = new Captweet();
    captweet.rate_limit_status = {
      resources: {
        application: {
          '/application/rate_limit_status/': {
            remaining: 100,
            reset: 1493747934,
          },
        },
      },
    };
    const go = captweet.is_allowed('application/rate_limit_status'); 
    test.bool(go).isTrue();
    const rates = captweet.rate_limit_status;
    test.object(rates['application/rate_limit_status']).hasProperty('remaining', 99);
  });

  it("gives NOT a go when it hasn't enough rights to do it", function() {
    const captweet = new Captweet();
    captweet.rate_limit_status = {
      resources: {
        application: {
          '/application/rate_limit_status/': {
            remaining: -1,
            reset: 1493747934,
          },
        },
      },
    };
    const go = captweet.is_allowed('application/rate_limit_status'); 
    test.bool(go).isFalse();
    const rates = captweet.rate_limit_status;
    test.object(rates['application/rate_limit_status']).hasProperty('remaining', -2);
  });

  it("gives NOT a go when rights is 0", function() {
    const captweet = new Captweet();
    captweet.rate_limit_status = {
      resources: {
        application: {
          '/application/rate_limit_status/': {
            remaining: 0,
            reset: 1493747934,
          },
        },
      },
    };
    const go = captweet.is_allowed('application/rate_limit_status'); 
    test.bool(go).isFalse();
    const rates = captweet.rate_limit_status;
    test.object(rates['application/rate_limit_status']).hasProperty('remaining', -1);
  });

  it("gives a go when rights is 1", function() {
    const captweet = new Captweet();
    captweet.rate_limit_status = {
      resources: {
        application: {
          '/application/rate_limit_status/': {
            remaining: 1,
            reset: 1493747934,
          },
        },
      },
    };
    const go = captweet.is_allowed('application/rate_limit_status'); 
    test.bool(go).isTrue();
    const rates = captweet.rate_limit_status;
    test.object(rates['application/rate_limit_status']).hasProperty('remaining', 0);
  });

});

