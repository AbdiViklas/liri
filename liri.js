var keys = require("keys.js");
var request = require("request");
var fs = require("fs");
var twitterKeys = keys.twitterKeys;

var command = process.argv[2];
var input = process.argv[3];

switch (command) {
  case "my-tweets":
    twitter();
    break;
  case "spotify-this-song":
    spotify(input);
    break;
  case "movie-this":
    omdb(input);
    break;
  case "do-what-it-says":
    doWhat();
    break;
  default:
    console.log("I'm sorry, I don't recognize that command. Possible commands are:\n  'my-tweets'\n  'spotify-this-song'\n  'movie-this' \n  'do-what-it-says'");
    break;
}

function twitter() {
  
}

function spotify(searchTerm) {
  
}

function omdb(searchTerm) {
  
}

function doWhat() {
  
}