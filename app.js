const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const Campground = require("./models/campground");

mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

// Campground.create({
//     name: "Granite HIll",
//     image: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
//     description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!"
// }, (err, campground) => {
//     if (err) console.log(err);
//     else console.log(campground);
// })

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
    Campground.findById(req.params.id, (err, foundCamp) => {
        if (err) console.log(err)
        else res.render("show", {
            campground: foundCamp
        })
    })
})

app.listen(3000, () => {
    console.log("Yelp camp server has started")
})