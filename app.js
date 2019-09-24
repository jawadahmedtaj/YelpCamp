const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const seedDB = require("./seeds");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require('./routes/campgrounds');
const authRoutes = require('./routes/index');
const methodOverride = require('method-override');
const flash = require('connect-flash');

mongoose.connect("mongodb+srv://JawadAhmed:A3Z2EcSAG7LXrKSl@cluster0-bfwth.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

// seedDB();

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(methodOverride("_method"));

app.use(flash());
//PASSPORT CONFIG
app.use(
  require("express-session")({
    secret: "Oreo was a cool cat",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.static(__dirname + "/public"));
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, () => {
  console.log("Yelp camp server has started");
});