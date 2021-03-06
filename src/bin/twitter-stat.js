#!/usr/local/bin/node
'use strict';
import args from 'args';
import fs from 'fs';

args
  .option('fields', "The fields included in tweet metadata to extract")
  .option('sort', 'Ascending (1) or decreasing (-1) order', 1)
  .option('files', "An array of files containing previous results built by this program", [])
  .example('twitter stat --fields "id_str,text,user.screen_name" --files ~/tweets0.json  --files ~/tweets1.json', 'Extract the tweet id, its text and the screen_name of its author from tweets.json');

const flags = args.parse(process.argv);

let result = flags.files
  .map(function(file) { return fs.readFileSync(file, 'utf8'); })
  .map(function(content) { return JSON.parse(content); })
  .map(function(json) { return json.data; })
  .reduce(function(a, b) { return a.concat(b); })
  .sort(function(a, b) {
    if (a.id_str === b.id_str) { return 0; }
    return a.id_str > b.id_str ? 1*flags.sort : -1*flags.sort; })
  .map(function(tweet) {
    return flags.fields
      .split(',')
      .map(function(field) {
        try {
          switch(field) {
            case 'created_at':
              return new Date(tweet.retweeted_status ? tweet.retweeted_status.created_at : tweet.created_at).toISOString();
            case 'user.screen_name':
              return tweet.retweeted_status ? tweet.retweeted_status.user.screen_name : tweet.user.screen_name;
            case 'user.id':
            case 'user.id_str': 
              return tweet.retweeted_status ? tweet.retweeted_status.user.id_str : tweet.user.id_str;
            case 'text':
              return (tweet.retweeted_status ? tweet.retweeted_status.text : tweet.text).replace(/\n/g, ' ').replace(/;/g, ',');
            default: 
              return tweet[field] ? tweet[field] : undefined;
          }
        } catch(error) {
          return undefined;
        }
      })
      .map(function(value) { return '"' + value + '"'; })
      .join(';');
  })
  .join('\n');

result = flags.fields.replace(/,/g, ';').concat('\n', result);

console.log(result);
