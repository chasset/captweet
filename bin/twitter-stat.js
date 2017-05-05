#!/usr/local/bin/node

'use strict';

var _args = require('args');

var _args2 = _interopRequireDefault(_args);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_args2.default.option('fields', "The fields included in tweet metadata to extract").option('result-files', "The file containing previous results built by this program").option('verbose', 'Verbosity of the program').example('twitter get --verbose --fields "id_str,text,user.screen_name" --result-files ~/*.json', 'Extract the tweet id, its text and the screen_name of its author in all files ending with json');

var flags = _args2.default.parse(process.argv);

var result = flags.resultFiles.map(function (file) {
  return _fs2.default.readFileSync(file, 'utf8');
}).map(function (json) {
  return json.data;
}).map(function (tweet) {
  return flags.fields.split(',').map(function (field) {
    return tweet[field];
  }).join(';');
});

result = flags.fields.replace(/,/g, ';').concat('\n', result);

console.log(result);