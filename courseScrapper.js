const rp = require("request-promise");
const $ = require("cheerio");

const type = "BME";
const year = "2021";

const url = (type, year) =>
  `http://www.ucalendar.uwaterloo.ca/${year}/COURSE/course-${type}.html`;

const validreq = (req, name) => {
  if (req === undefined) {
    return "";
  } else if (
    req.children[0].data.replace(/ /, "").slice(0, name.length) !== name
  ) {
    return "";
  } else {
    return req.children[0].data.slice(name.length + 2);
  }
};

rp(url(type, year))
  .then(function(html) {
    let courseInfo = {};
    const courseLength = $("table > tbody", html).length;
    const courses = $("table > tbody", html);

    for (let i = 0; i < courseLength; i++) {
      const course = $("tr > td > b > a", courses[i]);
      const id = $("tr > td", courses[i])[1];
      let antireq = "";
      let coreq = "";

      const prereq = validreq($("tr > td > i", courses[i])[1], "Prereq");

      if (
        $("tr > td > i", courses[i])[2] !== undefined &&
        $("tr > td > i", courses[i])[2]
          .children[0].data.replace(/ /, "")
          .slice(0, 5) === "Coreq"
      ) {
        coreq = validreq($("tr > td > i", courses[i])[2], "Coreq");
        antireq = validreq($("tr > td > i", courses[i])[3], "Antireq");
      } else {
        antireq = validreq($("tr > td > i", courses[i])[2], "Antireq");
      }

      if (course[0] !== undefined) {
        const name = course[0].next.data
          .slice(0, type.length + 5)
          .replace(/ /g, "");
        courseInfo[name] = {
          name: name,
          id: id.children[0].data.replace(/[^0-9]+/g, ""),
          prereq: prereq.split(/, |; /),
          coreq: coreq.replace(" ", "").split(/, |; /),
          antireq: antireq.replace(" ", "").split(/, |; /)
        };
      }
    }
    return courseInfo;
  })
  .catch(function(err) {
    console.log(err);
  });
