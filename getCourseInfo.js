const rp = require("request-promise");
const $ = require("cheerio");

const processList = list => {
  let key = "";
  let reqs = list;
  if (list[0] === undefined) {
    return;
  } else {
    key = reqs
      .shift()
      .replace(/[ ]/, "")
      .toLowerCase();
  }
  const value =
    reqs === undefined
      ? ""
      : reqs
          .join()
          .split(/[,|;]/)
          .map(value => value.replace(" ", ""));
  return [key, value];
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

      const req = $("tr > td > i", courses[i])
        .text()
        .split(/[.|\]]/)
        .map(val => val.replace("[", "").split(":"))
        .map(processList);

      if (course[0] !== undefined) {
        const name = course[0].next.data
          .slice(0, type.length + 5)
          .replace(/ /g, "");
        const credit = course[0].next.data.slice(
          course[0].next.data.length - 4
        );

        courseInfo[name] = {
          name: name,
          credit: credit,
          id: id.children[0].data.replace(/[^0-9]+/g, "")
        };

        for (let i = 0; i < req.length; i++) {
          if (req[i][0]) {
            courseInfo[name][req[i][0]] = req[i][1];
          }
        }
      }
    }
    return courseInfo;
  });
};

module.exports = getCourseInfo;
