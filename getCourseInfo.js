const rp = require("request-promise");
const $ = require("cheerio");

// Checkes a given html tag for valid request.
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

// Parses url body for course info.
const getCourseInfo = function(url, type) {
  return rp(url).then(function(html) {
    let courseInfo = {};
    const courseLength = $("table > tbody", html).length;
    const courses = $("table > tbody", html);

    for (let i = 0; i < courseLength; i++) {
      const course = $("tr > td > b > a", courses[i]);
      const id = $("tr > td", courses[i])[1];
      let antireq = "";
      let coreq = "";

      const req = $("tr > td > i", courses[i])
        .text()
        .split(".")
        .map(val => val.split(":"));

      console.log(req);

      if (course[0] !== undefined) {
        const name = course[0].next.data
          .slice(0, type.length + 5)
          .replace(/ /g, "");
        courseInfo[name] = {
          name: name,
          id: id.children[0].data.replace(/[^0-9]+/g, "")
        };
      }
    }
    return courseInfo;
  });
};

getCourseInfo(
  `http://www.ucalendar.uwaterloo.ca/2021/COURSE/course-ME.html`,
  "ME"
);

module.exports = getCourseInfo;
