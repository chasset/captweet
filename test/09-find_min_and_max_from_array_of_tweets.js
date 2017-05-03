'use strict';

var _unit = require('unit.js');

var _unit2 = _interopRequireDefault(_unit);

var _mocha = require('mocha');

var _index = require('../lib/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)('find_min_and_max_from_array_of_tweets()', function () {

  (0, _mocha.it)('finds min and max of 64 bits integer', function () {
    var captweet = new _index2.default();
    var raw_tweets = [{ id_str: '859476287068319744' }, { id_str: '859444604697026560' }, { id_str: '859381836115570688' }, { id_str: '859195489027280896' }, { id_str: '859171507091714049' }, { id_str: '859159779033456644' }];

    var _captweet$find_min_an = captweet.find_min_and_max_from_array_of_tweets(raw_tweets),
        tweets = _captweet$find_min_an.tweets,
        min = _captweet$find_min_an.min,
        max = _captweet$find_min_an.max;

    _unit2.default.array(tweets).hasLength(6).string(min.toString()).is('859159779033456644').string(max.toString()).is('859476287068319744');
  });
});