const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

let Campground = mongoose.model("campground", campgroundSchema);


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
    // res.render("campgrounds", {
    //     camps: campgrounds
    // })
})

app.post("/campgrounds", (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = {
        name: name,
        image: image
    }
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) console.log(err);
        else res.redirect("/campgrounds")
    })
})

app.get("/campgrounds/new", (req, res) => {
    res.render("new")
})

app.listen(3000, () => {
    console.log("Yelp camp server has started")
})