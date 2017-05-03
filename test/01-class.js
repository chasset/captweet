'use strict';

var _unit = require('unit.js');

var _unit2 = _interopRequireDefault(_unit);

var _mocha = require('mocha');

var _index = require('../lib/index.js');

var _index2 = _interopRequireDefault(_index);

var _twit = require('twit');

var _twit2 = _interopRequireDefault(_twit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)('class Captweet', function () {

  (0, _mocha.it)('returns an object on creation', function () {
    var captweet = new _index2.default();
    _unit2.default.object(captweet);
  });

  (0, _mocha.it)('returns an instance of Captweet', function () {
    var captweet = new _index2.default();
    _unit2.default.object(captweet).isInstanceOf(_index2.default);
  });

  (0, _mocha.it)('returns a property which is an instance of Twit', function () {
    var captweet = new _index2.default();
    _unit2.default.object(captweet.twitter).isInstanceOf(_twit2.default);
  });
});