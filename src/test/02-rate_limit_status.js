'use strict';
import test from 'unit.js';
import { describe, it } from 'mocha';
import Captweet from '../lib/index.js';

describe('set/get rate_limit_status', function() {

  it('transform correctly the data returned by Twitter', function() {
    const captweet = new Captweet();
    captweet.rate_limit_status = {
      resources: {
        application: {
          '/application/rate_limit_status/:id/test/': {
            remaining: 100,
          },
        },
      },
    };
    test.object(captweet.rate_limit_status)
      .hasProperty('application/rate_limit_status');
  });

});

