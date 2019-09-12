const express = require('express');
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));


app.get("/", (req, res) => {
    res.render("landing");
})

let campgrounds = [{
        name: "Salmon Creek",
        image: "https://pixabay.com/get/57e8d1454b56ae14f6da8c7dda793f7f1636dfe2564c704c732779d6924bcc50_340.jpg"
    },
    {
        name: "Granite Hill",
        image: "https://pixabay.com/get/55e8dc404f5aab14f6da8c7dda793f7f1636dfe2564c704c732779d6924bcc50_340.jpg"
    },
    {
        name: "Mountain Goat's Rest",
        image: "https://pixabay.com/get/57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c732779d6924bcc50_340.jpg"
    },
];

app.get("/campgrounds", (req, res) => {
    res.render("campgrounds", {
        camps: campgrounds
    })
})

app.post("/campgrounds", (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = {
        name: name,
        image: image
    }
    campgrounds.push(newCampground)
    res.redirect("/campgrounds")
})

app.get("/campgrounds/new", (req, res) => {
    res.render("new")
})

app.listen(3000, () => {
    console.log("Yelp camp server has started")
})