var keys = require("./keys.js");
var twitterKeys = keys.twitterKeys;
var request = require("request");
var fs = require("fs");
var twitter = require("twitter");

console.log("process.argv:", process.argv);

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
}

function twitterFunc() {
  
}

function spotify(searchTerm) {
  
}

function omdb(searchTerm) {
  if (!searchTerm) {
    searchTerm = "mr. nobody";
  }
  searchTerm = searchTerm.replace(/ /g, "%20");
  console.log("http://www.omdbapi.com/?apikey=40e9cece&t=" + searchTerm);
  // n.b. the response body will probably be a string and need JSON.parse to be acessable as an object
  request("http://www.omdbapi.com/?apikey=40e9cece&t=" + searchTerm, function(err, response, body){
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
  fs.readFile("random.txt", "utf8", function(err, data){
    if (err) {
      console.log("Error:", err);
    }
    var dataArr = data.split(",");
    assignAction(dataArr[0], dataArr[1]);
  })
}