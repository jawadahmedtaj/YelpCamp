const express = require('express');
const router = express.Router()

router.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) console.log(err);
        else {
            res.render("campgrounds/campgrounds", {
                camps: allCampgrounds,
                currentUser: req.user
            });
        }
    });
});

router.post("/campgrounds", (req, res) => {
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

router.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

router.get("/campgrounds/:id", (req, res) => {
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

module.exports = router;