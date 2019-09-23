const express = require('express');
const router = express.Router({
    mergeParams: true
});
const Campground = require('../models/campground.js');
const Comment = require('../models/comment.js');
const middleWare = require('../middleware');

router.get("/new", middleWare.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) console.log(err);
        else
            res.render("comments/new", {
                campground: campground
            });
    });
});

router.post("/", middleWare.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            req.flash("error", "Something went wrong, please try later!");
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash("error", "Something went wrong, please try again later!");
                    res.redirect("/campgrounds/" + campground._id);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //save comment
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment added successfully!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", middleWare.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash("error", "Cannot find comment on that campground");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err || !foundComment) {
                req.flash("error", "Something seems amiss")
                res.redirect("back");
            } else {
                res.render("comments/edit", {
                    campground_id: req.params.id,
                    comment: foundComment
                });
            }
        })
    })
})

router.put("/:comment_id", middleWare.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) res.redirect("back");
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// Comments destroy route

router.delete("/:comment_id", middleWare.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            req.flash("error", "Something seems wrong, please try again later!");
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})


module.exports = router;