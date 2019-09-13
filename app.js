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

// Campground.create({
//     name: "Granite Hill",
//     image: "https://pixabay.com/get/55e8dc404f5aab14f6da8c7dda793f7f1636dfe2564c704c732779d6924bcc50_340.jpg"
// }, (err, campground) => {
//     if (err) console.log(err);
//     else console.log(campground);
// })

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));


app.get("/", (req, res) => {
    res.render("landing");
})

// let campgrounds = [{
//         name: "Salmon Creek",
//         image: "https://pixabay.com/get/57e8d1454b56ae14f6da8c7dda793f7f1636dfe2564c704c732779d6924bcc50_340.jpg"
//     },
//     {
//         name: "Granite Hill",
//         image: "https://pixabay.com/get/55e8dc404f5aab14f6da8c7dda793f7f1636dfe2564c704c732779d6924bcc50_340.jpg"
//     },
//     {
//         name: "Mountain Goat's Rest",
//         image: "https://pixabay.com/get/57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c732779d6924bcc50_340.jpg"
//     }
// ];

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