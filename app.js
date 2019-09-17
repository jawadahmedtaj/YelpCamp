const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const seedDB = require("./seeds");

seedDB();

mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    res.render("landing");
})

app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) console.log(err)
        else {
            res.render("campgrounds", {
                camps: allCampgrounds
            })
        }
    })
})

app.post("/campgrounds", (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let newCampground = {
        name: name,
        image: image,
        description: desc
    }
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) console.log(err);
        else res.redirect("/campgrounds")
    })
})

app.get("/campgrounds/new", (req, res) => {
    res.render("new")
})

app.get("/campgrounds/:id", (req, res) => {

    Campground.findById(req.params.id).populate("comments").exec((err, foundCamp) => {
        if (err) console.log(err)
        else {
            res.render("show", {
                camps: foundCamp
            })
        }
    })
})

app.listen(3000, () => {
    console.log("Yelp camp server has started")
})