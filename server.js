const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const path = require("path");
const moment = require("moment");

const app = express();

const Student = require("./models/student");
const Report = require("./models/report");

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/parinnage");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.set("view options", { layout: "layout" });

app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.static(path.join(__dirname, "./node_modules/materialize-css/dist"))
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

hbs.registerHelper("formatTime", function(date, format) {
  var mmnt = moment(date);
  return mmnt.format(format);
});

hbs.registerHelper("left", function(options) {
  if (options == "YES")
    return new Handlebars.SafeString(`<i class="material-icons">check</i>`);
});

app.get("/", (req, res) => {
  res.redirect("/1");
});

app.get("/students", (req, res) => {
  Student.find({}, (err, data) => {
    console.log(data);
    res.send(data);
  });
});

app.get("/:page", (req, res) => {
  const perPage = 20;
  let page = req.params.page - 1;
  Student.find({})
    .sort("name")
    .limit(perPage)
    .skip(perPage * page)
    .exec(function(err, students) {
      Student.count().exec(function(err, count) {
        let pages = [];
        for (let i = 1; i <= parseInt(count / perPage) + 1; i++) {
          pages.push({
            page: i.toString(),
            active: i == page + 1 ? true : false
          });
        }
        let prePage = page == 0 ? false : page;
        let postPage = page == parseInt(count / perPage) ? false : page + 2;
        res.render("home", {
          students: students,
          prePage: prePage,
          pages: pages,
          postPage: postPage,
          title: "Students"
        });
      });
    });
});

app.post("/register", (req, res) => {
  const data = req.body;
  let student = new Student({
    name: data.name.trim(),
    dob: data.dob ? data.dob.trim() : null,
    hostel: data.hostel ? data.hostel.trim() : null,
    address: data.address ? data.address.trim() : null,
    father: data.father ? data.father.trim() : null,
    mother: data.mother ? data.mother.trim() : null,
    institution: data.institution ? data.institution.trim() : null,
    ins_address: data.ins_address ? data.ins_address.trim() : null,
    qualification: data.qualification ? data.qualification.trim() : null,
    sponsor: data.sponsor ? data.sponsor.trim() : null,
    image: data.image ? data.image.trim() : null,
    orphan: data.orphan ? data.orphan.trim() : null,
    gender: data.gender ? data.gender.trim() : null,
    occupation: data.occupation ? data.occupation.trim() : null,
    left: data.left ? data.left.trim() : null
  });
  student.save((err, result) => {
    if (err) res.send(err);
    if (result) res.send(result);
  });
});

app.get("/left/:page", (req, res) => {
  const perPage = 20;
  let page = req.params.page - 1;
  Student.find({})
    .where(left == true)
    .sort("name")
    .limit(perPage)
    .skip(perPage * page)
    .exec(function(err, students) {
      Student.count().exec(function(err, count) {
        let pages = [];
        for (let i = 1; i <= parseInt(count / perPage) + 1; i++) {
          pages.push({
            page: i.toString(),
            active: i == page + 1 ? true : false
          });
        }
        let prePage = page == 0 ? false : page;
        let postPage = page == parseInt(count / perPage) ? false : page + 2;
        res.render("home", {
          students: students,
          prePage: prePage,
          pages: pages,
          postPage: postPage,
          title: "Leftout Students"
        });
      });
    });
});

app.get("/remove/:id", (req, res) => {
  Student.findByIdAndRemove(req.params.id, (err, result) => {
    res.send(result);
  });
});

app.get("/search/:query", (req, res) => {
  const query = req.params.query;
  Student.find(
    {
      $or: [
        { name: new RegExp(query, "i") },
        { sponsor: new RegExp(query, "i") }
      ]
    },
    (err, students) => {
      res.send(students);
    }
  );
});

app.get("/student/:id", (req, res) => {
  Student.findById(req.params.id, (err, result) => {
    res.render("student", { profile: result });
  });
});

app.listen(80, () => {
  console.log("The server is up");
});
