'use strict';

var _unit = require('unit.js');

var _unit2 = _interopRequireDefault(_unit);

var _mocha = require('mocha');

var _index = require('../lib/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)('get_user_id_from_screen_name()', function () {

  (0, _mocha.it)('download and transform correctly the data returned by Twitter', function (done) {
    var captweet = new _index2.default();
    captweet.refresh_rate_limit_status().then(function () {
      return captweet.get_user_id_from_screen_name('@mobitweet_');
    }).then(function (data) {
      _unit2.default.string(data).is('801470286579335169');
      done();
    }).catch(function (error) {
      _unit2.default.fail(error.message);
      done(error);
    });
  });
});