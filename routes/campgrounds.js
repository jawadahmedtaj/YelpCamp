const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require('../models/comment');
const middleWare = require('../middleware');

router.get("/", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) console.log(err);
        else {
            res.render("campgrounds/campgrounds", {
                camps: allCampgrounds
            });
        }
    });
});

router.post("/", middleWare.isLoggedIn, (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newCampground = {
        name: name,
        image: image,
        description: desc,
        author: author
    };
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) console.log(err);
        else res.redirect("/campgrounds");
    });
});

router.get("/new", middleWare.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.get("/:id", (req, res) => {
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

//Edit Campground Route
router.get("/:id/edit", middleWare.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {
                campground: foundCampground
            });
        }
    });
});
//Update Campground Route
router.put("/:id", middleWare.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(
        req.params.id,
        req.body.campground,
        (err, updatedCampground) => {
            if (err) {
                req.flash("error", "Couldn't update the campground, please try later!");
                res.redirect("/campgrounds");
            } else {
                req.flash("success", "Campground edited successfully!");
                res.redirect("/campgrounds/" + req.params.id);
            }
        }
    );
});

// delete/destroy route
router.delete("/:id", middleWare.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            Comment.deleteMany({
                _id: {
                    $in: campgroundRemoved.comments
                }
            }, (err) => {
                if (err) {
                    console.log(err);
                }
                res.redirect("/campgrounds");
            });
        }
    });
});


module.exports = router;