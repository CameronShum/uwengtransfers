const express = require("express");
const cors = require("cors");
const getCourseInfo = require("./getCourseInfo");
const app = express();

const port = 5000;

// Body parser
app.use(express.urlencoded({ extended: false }));

// Home route
app.get("/", (req, res) => {
  res.send("Basic Endpoint");
});

app.get("/courses/:type/:year", cors(), (req, res, next) => {
  const { year, type } = req.params;

  const url = `http://www.ucalendar.uwaterloo.ca/${year}/COURSE/course-${type}.html`;
  getCourseInfo(url, type).then(response => res.send(response));
});

// Listen on port 5000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
