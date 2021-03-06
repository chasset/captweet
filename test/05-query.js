'use strict';

var _unit = require('unit.js');

var _unit2 = _interopRequireDefault(_unit);

var _mocha = require('mocha');

var _index = require('../lib/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)('query()', function () {

  (0, _mocha.it)('queries the Twitter server', function (done) {
    var captweet = new _index2.default();
    captweet.auto_refresh_rate_limit_status().then(function () {
      return captweet.query('users/show', { screen_name: '@mobitweet_' });
    }).then(function (data) {
      _unit2.default.object(data).hasProperty('id_str', '801470286579335169');
      captweet.stop_refreshing();
      done();
    }).catch(function (error) {
      _unit2.default.fail(error.message);
      done(error);
    });
  });
});