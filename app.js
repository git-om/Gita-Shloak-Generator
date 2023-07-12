const express = require("express");
const http = require("https");
const chapter = require(__dirname+"/chapter.js")

require('dotenv').config();

const app = express();

app.use(express.static('public'))

app.set('view engine', 'ejs');

app.get("/", function (request, response) {

  var randomChapterNumber = Math.floor((Math.random() * 18));
  const currentChapterData = chapterList[randomChapterNumber]
  randomChapterNumber++;
  const verseInChapter = currentChapterData.verses_count;
  const randomVerseNUmber = Math.floor((Math.random()*verseInChapter)+1);

  const options = {
    method: "GET",
    hostname: "bhagavad-gita3.p.rapidapi.com",
    port: null,
    path: "/v2/chapters/"+randomChapterNumber+"/verses/"+randomVerseNUmber+"/",
    headers: {
      "X-RapidAPI-Key": process.env.GITA_API,
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

      verseData = {
        verse: data.text,
        verseNumber: data.slug,
        translation: data.translations[3].description,
        commentaries: data.commentaries[13].description
      }
      // response.send(data)
      response.render('index', verseData);
    });
  });

  req.end();
});

app.listen(3000, function () {
  console.log("app running on port 3000.");
});
