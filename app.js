// Import required modules
const express = require("express"); // Import the Express module
const http = require("https"); // Import the HTTP module
const chapter = require(__dirname + "/chapter.js"); // Import the chapter module

require('dotenv').config(); // Load environment variables from .env file

const app = express(); // Create an Express application

app.use(express.static('public')); // Serve static files from the 'public' directory

app.set('view engine', 'ejs'); // Set the view engine to EJS

app.get("/", function (request, response) { // Define a route handler for the root URL ("/")

  // Generate a random chapter number
  var randomChapterNumber = Math.floor((Math.random() * 18)); 

  // Get the data of the current chapter
  const currentChapterData = chapterList[randomChapterNumber];

  // Increment the chapter number
  randomChapterNumber++;

  // Get the number of verses in the current chapter
  const verseInChapter = currentChapterData.verses_count;

  // Generate a random verse number within the chapter
  const randomVerseNUmber = Math.floor((Math.random() * verseInChapter) + 1);

  const options = {
    method: "GET",
    hostname: "bhagavad-gita3.p.rapidapi.com",
    port: null,
    path: "/v2/chapters/" + randomChapterNumber + "/verses/" + randomVerseNUmber + "/",
    headers: {
      "X-RapidAPI-Key": process.env.GITA_API, // Set the RapidAPI Key from environment variables
      "X-RapidAPI-Host": "bhagavad-gita3.p.rapidapi.com",
    },
  };

  const req = http.request(options, function (res) {
    const chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);
      body = body.toString();
      data = JSON.parse(body);

      // Extract the relevant data from the response
      verseData = {
        verse: data.text,
        verseNumber: data.slug,
        translation: data.translations[3].description,
        commentaries: data.commentaries[13].description
      }

      // Render the 'index' view with the verse data
      response.render('index', verseData);
    });
  });

  req.end();
});

app.listen(3000, function () { // Start the server and listen on port 3000
  console.log("app running on port 3000.");
});
