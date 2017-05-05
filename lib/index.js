'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _twit = require('twit');

var _twit2 = _interopRequireDefault(_twit);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _bigInteger = require('big-integer');

var _bigInteger2 = _interopRequireDefault(_bigInteger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RATE_LIMIT_STATUS = Symbol();

var Captweet = function () {
  function Captweet(iniFile, verbose) {
    _classCallCheck(this, Captweet);

    if (!iniFile) {
      iniFile = _path2.default.join(_os2.default.homedir(), 'ini.yaml');
    }
    var ini = _jsYaml2.default.safeLoad(_fs2.default.readFileSync(iniFile, 'utf8'));
    var tokens = {
      consumer_key: ini.twitter.account.key,
      consumer_secret: ini.twitter.account.secret,
      app_only_auth: true,
      timeout_ms: 60000
    };
    this.twitter = new _twit2.default(tokens);
    this.verbose = verbose;
  }

  _createClass(Captweet, [{
    key: 'get_tweet',
    value: function get_tweet(tweet_id) {
      var captweet = this;
      return (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
        var data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return captweet.query('statuses/show', { id: tweet_id, trim_user: false, include_entities: true });

              case 2:
                data = _context.sent;
                return _context.abrupt('return', data);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
    }
  }, {
    key: 'get_tweets_from_ids',
    value: function get_tweets_from_ids(ids) {
      var captweet = this;
      return (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
        var tweets, i, p, data;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                tweets = [];
                i = 0;

              case 2:
                if (!(i < ids.length)) {
                  _context2.next = 12;
                  break;
                }

                p = ids.slice(i, i + 100).join(',');
                _context2.next = 6;
                return captweet.query('statuses/lookup', { id: p });

              case 6:
                data = _context2.sent;

                tweets = tweets.concat(data);
                if (captweet.verbose) {
                  console.log('Tweets metadata retrieved for ids between index %s and %s (%s tweets), which is since the beginning %s tweets (%s\%)', i, i + 100, data.length, tweets.length, Math.round(tweets.length / (i + 100) * 100));
                }

              case 9:
                i += 100;
                _context2.next = 2;
                break;

              case 12:
                return _context2.abrupt('return', tweets);

              case 13:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));
    }
  }, {
    key: 'get_whole_timeline',
    value: function get_whole_timeline(user_id, since_id) {
      var captweet = this;
      return (0, _co2.default)(regeneratorRuntime.mark(function _callee3() {
        var count, nbr, timeline, go, query, _ref, tweets, min, max;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                count = 200; // Maximum 200

                nbr = count;
                timeline = [];
                go = true;
                query = {
                  user_id: user_id,
                  count: count,
                  trim_user: true,
                  exclude_replies: false,
                  contributor_details: true,
                  include_rts: true
                };

                if (since_id) {
                  query.since_id = since_id.toString();
                }
                if (captweet.verbose) {
                  console.warn('Beginning to download the whole timeline of user', user_id);
                }

              case 7:
                if (!go) {
                  _context3.next = 18;
                  break;
                }

                _context3.next = 10;
                return captweet.get_last_tweets_of_timeline(query);

              case 10:
                _ref = _context3.sent;
                tweets = _ref.tweets;
                min = _ref.min;
                max = _ref.max;

                nbr = tweets.length;
                if (nbr > 0) {
                  timeline = timeline.concat(tweets);
                  query.max_id = min.add(-1).toString();
                  if (!since_id || max.greater(since_id)) {
                    since_id = max;
                  }
                  if (captweet.verbose) {
                    console.warn('Tweets ID between', max.toString(), 'and', min.toString(), 'retrieved.');
                  }
                } else {
                  go = false;
                }
                _context3.next = 7;
                break;

              case 18:
                return _context3.abrupt('return', { user_id: user_id, timeline: timeline, since_id: since_id });

              case 19:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));
    }
  }, {
    key: 'get_last_tweets_of_timeline',
    value: function get_last_tweets_of_timeline(query) {
      var captweet = this;
      return (0, _co2.default)(regeneratorRuntime.mark(function _callee4() {
        var raw_tweets, _captweet$find_min_an, tweets, min, max;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return captweet.query('statuses/user_timeline', query);

              case 2:
                raw_tweets = _context4.sent;
                _captweet$find_min_an = captweet.find_min_and_max_from_array_of_tweets(raw_tweets), tweets = _captweet$find_min_an.tweets, min = _captweet$find_min_an.min, max = _captweet$find_min_an.max;
                return _context4.abrupt('return', { tweets: tweets, min: min, max: max });

              case 5:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));
    }
  }, {
    key: 'find_min_and_max_from_array_of_tweets',
    value: function find_min_and_max_from_array_of_tweets(tweets) {
      var min = void 0,
          max = void 0;
      tweets.map(function (tweet) {
        tweet._id = tweet.id_str;
        var id = (0, _bigInteger2.default)(tweet.id_str);
        if (!min && !max) {
          min = max = id;
        }
        if (min.greater(id)) {
          min = id;
        }
        if (id.greater(max)) {
          max = id;
        }
      });
      return { tweets: tweets, min: min, max: max };
    }
  }, {
    key: 'get_user_id_from_screen_name',
    value: function get_user_id_from_screen_name(user) {
      var captweet = this;
      return (0, _co2.default)(regeneratorRuntime.mark(function _callee5() {
        var data;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return captweet.query('users/show', { screen_name: user });

              case 2:
                data = _context5.sent;
                return _context5.abrupt('return', data.id_str);

              case 4:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));
    }
  }, {
    key: 'auto_refresh_rate_limit_status',
    value: function auto_refresh_rate_limit_status(interval) {
      var delay = interval ? interval : 15 * 60 * 1000;
      var captweet = this;
      this.setInterval = setInterval(function () {
        captweet.refresh_rate_limit_status();
      }, delay);
      if (this.verbose) {
        console.warn('Start refreshing automatically Rate limit status.');
      }
      return this.refresh_rate_limit_status();
    }
  }, {
    key: 'stop_refreshing',
    value: function stop_refreshing() {
      clearInterval(this.setInterval);
      if (this.verbose) {
        console.warn('Stop refreshing automatically Rate limit status.');
      }
    }
  }, {
    key: 'refresh_rate_limit_status',
    value: function refresh_rate_limit_status() {
      var captweet = this;
      return (0, _co2.default)(regeneratorRuntime.mark(function _callee6() {
        var resource, query, result;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                resource = 'application/rate_limit_status';
                query = {};
                _context6.next = 4;
                return captweet.twitter.get(resource, query);

              case 4:
                result = _context6.sent;

                captweet.rate_limit_status = result.data;
                if (captweet.verbose) {
                  console.warn('Rate limit status refreshed.');
                }

              case 7:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));
    }
  }, {
    key: 'query',
    value: function query(resource, _query) {
      var captweet = this;
      return new Promise(function (resolve) {
        if (captweet.is_allowed(resource)) {
          captweet.twitter.get(resource, _query).then(function (result) {
            resolve(result.data);
          });
        }
      });
    }
  }, {
    key: 'is_allowed',
    value: function is_allowed(resource) {
      var rate = this[RATE_LIMIT_STATUS][resource].remaining--;
      if (this.verbose && rate === 0) {
        console.warn('Resource', resource, 'reached its rate limit.');
        console.warn('Wait', Math.round(this[RATE_LIMIT_STATUS][resource].reset - Date.now() / 1000), 'seconds to get more resources.');
      }
      return rate > 0;
    }
  }, {
    key: 'rate_limit_status',
    set: function set(data) {
      this[RATE_LIMIT_STATUS] = {};
      for (var type in data.resources) {
        for (var resource_long in data.resources[type]) {
          var resource = resource_long.match(/^\/?([^:]+[^/:])/)[1];
          this[RATE_LIMIT_STATUS][resource] = data.resources[type][resource_long];
        }
      }
    },
    get: function get() {
      return this[RATE_LIMIT_STATUS];
    }
  }]);

  return Captweet;
}();

exports.default = Captweet;