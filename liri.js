var keys = require("./keys.js");
var twitterKeys = keys.twitterKeys;
var spotifyKeys = keys.spotifyKeys;
var request = require("request");
var fs = require("fs");
var twitter = require("twitter");
var spotify = require("node-spotify-api");

var command = process.argv[2];
var input = "";
for (var i = 3; i < process.argv.length; i++) {
  input += process.argv[i] + " ";
}
input.trim();

assignAction(command, input);

function assignAction(command, input) {
  switch (command) {
    case "my-tweets":
      twitterFunc();
      break;
    case "spotify-this-song":
      spotifyFunc(input);
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
}

function twitterFunc() {
  var client = new twitter(twitterKeys);
  client.get("statuses/user_timeline", function (err, tweets) {
    if (err) {
      console.log("Twitter error:", err);
    }
    for (var i = 0; i < tweets.length; i++) {
      var tweet = tweets[i];
      console.log(tweet.text);
    }
  });
}

function spotifyFunc(searchTerm) {
  if (!searchTerm) {
    console.log("You didn't give me a song to search for, so I'll search for 'The Sign.' You know, by Ace of Base.");
    searchTerm = "the sign";
  }
  var spotifySearch = new spotify(spotifyKeys);
  spotifySearch.search({
    type: "track",
    query: searchTerm
  }, function (err, data) {
    if (err) {
      return console.log('Spotify error: ' + err);
    }
    var element = data.tracks.items[0];
    console.log(`
      Artist(s): ${element.artists[0].name}
      Title: ${element.name}
      Preview URL: ${element.preview_url}
      Album: ${element.album.name}
    `);
  });
}

function omdb(searchTerm) {
  if (!searchTerm) {
    console.log("You didn't give me a movie to search for, so I'll search for 'Mr. Nobody.'");
    searchTerm = "mr. nobody";
  }
  searchTerm = searchTerm.replace(/ /g, "%20");
  request("http://www.omdbapi.com/?apikey=40e9cece&t=" + searchTerm, function (err, response, body) {
    var bodyObj = JSON.parse(body);
    var imdbRating, rtRating;
    for (var i = 0; i < bodyObj.Ratings.length; i++) {
      var element = bodyObj.Ratings[i];
      if (element.Source === "Internet Movie Database") {
        imdbRating = element.Value;
      } else if (element.Source === "Rotten Tomatoes") {
        rtRating = element.Value;
      }
    }
    console.log(`
      Title: ${bodyObj.Title}
      Year: ${bodyObj.Year}
      IMDB rating: ${imdbRating}
      Rotten Tomatoes rating: ${rtRating}
      Produced in: ${bodyObj.Country}
      Language: ${bodyObj.Language}
      Plot: ${bodyObj.Plot}
      Actors: ${bodyObj.Actors}
    `);
  });
}

function doWhat() {
  fs.readFile("random.txt", "utf8", function (err, data) {
    if (err) {
      console.log("Error:", err);
    }
    var dataArr = data.split(",");
    assignAction(dataArr[0], dataArr[1]);
  })
}