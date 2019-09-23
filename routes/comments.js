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
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) console.log(err);
                else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //save comment
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", middleWare.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) res.redirect("back");
        else {
            res.render("comments/edit", {
                campground_id: req.params.id,
                comment: foundComment
            });
        }
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
        if (err) res.redirect("back");
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})


module.exports = router;