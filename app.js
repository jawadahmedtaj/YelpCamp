const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const seedDB = require("./seeds");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

seedDB();

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
//PASSPORT CONFIG
app.use(require('express-session')({
  secret: "Oreo was a cool cat",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) console.log(err);
    else {
      res.render("campgrounds/campgrounds", {
        camps: allCampgrounds
      });
    }
  });
});

app.post("/campgrounds", (req, res) => {
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let newCampground = {
    name: name,
    image: image,
    description: desc
  };
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) console.log(err);
    else res.redirect("/campgrounds");
  });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCamp) => {
      if (err) console.log(err);
      else {
        res.render("campgrounds/show", {
          camps: foundCamp
        });
      }
    });
});

app.get("/campgrounds/:id/comments/new", (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) console.log(err);
    else
      res.render("comments/new", {
        campground: campground
      });
  });
});

app.post("/campgrounds/:id/comments", (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) console.log(err);
        else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// ====================
//AUTH ROUTES
app.get("/register", (req, res) => {
  res.render("register");
})

app.post("/register", (req, res) => {
  let newUser = new User({
    username: req.body.username
  });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err)
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/campgrounds");
    })
  })
});


//LOGIN
app.get("/login", (req, res) => {
  res.render("login");
})

app.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), (req, res) => {})

app.listen(3000, () => {
  console.log("Yelp camp server has started");
});