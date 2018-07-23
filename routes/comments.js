var express = require("express");
var router  = express.Router({mergeParams: true});
var Book = require("../models/book");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
    Book.find({"item.id": req.params.id}, function(err, book) {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {book: book}); 
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Book.find({"item.id": req.params.id}, function(err, book){
        if(err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong.");
                    console.log(err);
                } else {
                    console.log("hi");
                    console.log(book);
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    console.log(comment);
                    book[0].comments.push(comment);
                    book[0].save();
                    req.flash("success", "Sucessfully added comment.");
                    res.redirect('/books/' + req.params.id);
                }
            });
        }
    });     
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    console.log(req.params.id);
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            console.log(foundComment);
            res.render("comments/edit", {book_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/books/" + req.params.id);
       }
   }) 
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/books/" + req.params.id);
        }
    });
});

module.exports = router;