const express = require("express");
const format = require("date-fns/format");
const addYears = require("date-fns/addYears");
const getCourseInfo = require("./getCourseInfo");

const app = express();
const currYear = format(new Date(), "yy");
const nextYear = format(addYears(new Date(), 1), "yy");
const year = currYear + nextYear;
const port = 5000;

// Body parser
app.use(express.urlencoded({ extended: false }));

// Home route
app.get("/", (req, res) => {
  res.send("API for getting course data from any Waterloo program");
});

// Get all courses from a program
app.get("/courses", (req, res) => {
  const { code } = req.query;
  const url = `http://www.ucalendar.uwaterloo.ca/${year}/COURSE/course-${code}.html`;
  getCourseInfo(url, code).then(response => res.send(response));
});

// Listen on port 5000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
