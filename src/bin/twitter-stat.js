#!/usr/local/bin/node
'use strict';
import args from 'args';
import fs from 'fs';

args
  .option('fields', "The fields included in tweet metadata to extract")
  .option('result-files', "The file containing previous results built by this program")
  .option('verbose', 'Verbosity of the program')
  .example('twitter get --verbose --fields "id_str,text,user.screen_name" --result-files ~/*.json', 'Extract the tweet id, its text and the screen_name of its author in all files ending with json');

const flags = args.parse(process.argv);

let result = flags.resultFiles
  .map(function(file) { return fs.readFileSync(file, 'utf8'); })
  .map(function(json) { return json.data; })
  .map(function(tweet) {
    return flags.fields
      .split(',')
      .map(function(field) { return tweet[field]; })
      .join(';');
  });

result = flags.fields.replace(/,/g, ';').concat('\n', result);

console.log(result);
