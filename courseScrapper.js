const rp = require("request-promise");
const $ = require("cheerio");
const url = "http://www.ucalendar.uwaterloo.ca/2021/COURSE/course-ME.html";

rp(url)
  .then(function(html) {
    console.log($("table > tbody > tr > td > b", html));
  })
  .catch(function(err) {
    console.log(err);
  });
