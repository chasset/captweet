'use strict';
import test from 'unit.js';
import { describe, it } from 'mocha';
import Captweet from '../lib/index.js';

describe('find_min_and_max_from_array_of_tweets()', function() {

  it('finds min and max of 64 bits integer', function() {
    const captweet = new Captweet();
    const raw_tweets = [
      { id_str: '859476287068319744' },
      { id_str: '859444604697026560' },
      { id_str: '859381836115570688' },
      { id_str: '859195489027280896' },
      { id_str: '859171507091714049' },
      { id_str: '859159779033456644' },
    ];
    const {tweets, min, max} = captweet.find_min_and_max_from_array_of_tweets(raw_tweets);
    test
      .array(tweets).hasLength(6)
      .string(min.toString()).is('859159779033456644')
      .string(max.toString()).is('859476287068319744');
  });

});
