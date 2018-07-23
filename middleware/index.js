var Book = require("../models/book");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
};

middlewareObj.checkBookOwnership = function(req, res, next) {
        if(req.isAuthenticated()){
        Book.find({"item.id": req.params.id}, function(err, book) {
        if(err) {
            req.flash("error", "Book not found");
            res.redirect("back");
        } else {
            if(book[0].author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "You don't have permission to do that.");
                res.redirect("back");
            }
        }
        });
    } else {
       req.flash("error", "You need to be logged in to do that.");
       res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
        if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            if(foundComment.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "You don't have permission to do that.");
                res.redirect("back");
            }
        }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
       res.redirect("back");
    }
};

module.exports = middlewareObj;