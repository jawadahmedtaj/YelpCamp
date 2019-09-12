const express = require('express');
const app = express();
app.set("view engine", "ejs");



app.get("/", (req, res) => {
    res.render("landing");
})

app.get("/campgrounds", (req, res) => {
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

    res.render("campgrounds", {
        camps: campgrounds
    })
})

app.listen(3000, () => {
    console.log("Yelp camp server has started")
})