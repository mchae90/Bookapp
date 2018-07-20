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
                    res.redirect('/books/' + req.params.id);
                }
            })
        }
    });     
});

module.exports = router;