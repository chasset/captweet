'use strict';
import test from 'unit.js';
import { describe, it } from 'mocha';
import Captweet from '../lib/index.js';
import Twit from 'twit';

describe('class Captweet', function() {

  it('returns an object on creation', function() {
    const captweet = new Captweet();
    test.object(captweet);
  });

  it('returns an instance of Captweet', function() {
    const captweet = new Captweet();
    test.object(captweet).isInstanceOf(Captweet);
  });

  it('returns a property which is an instance of Twit', function() {
    const captweet = new Captweet();
    test.object(captweet.twitter).isInstanceOf(Twit);
  });

});
