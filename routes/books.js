var express = require("express");
var router  = express.Router();
var request = require("request");
var Book = require("../models/book");
var Comment = require("../models/comment");
var middleware = require("../middleware");

var colors = ["#1abc9c",
"#2ecc71",
"#3498db",
"#9b59b6",
"#34495e",
"#16a085",
"#27ae60",
"#2980b9",
"#8e44ad",
"#2c3e50",
"#f1c40f",
"#e67e22",
"#e74c3c",
"#95a5a6",
"#f39c12",
"#d35400",
"#c0392b",
"#7f8c8d",
"#67e399",
"#FFAD9C"];

//INDEX ROUTE
router.get("/", function(req, res){
   Book.find({}, function(err, allBooks){
       if(err){
           console.log(err);
       } else {
            res.render("index", {books: allBooks, colors: colors});
       }
   });
});


//NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
    var query = req.query.search;
    var url = "https://www.googleapis.com/books/v1/volumes?q=" + query;
    request(url, function (error, response, body) {
        if(!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("books/new", {data: data});
        }
    });
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res) {
    var item = req.body.item;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newBook = {item: item, author: author};
    console.log(newBook);
    console.log(" end ");
    Book.create(newBook, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           console.log(newlyCreated);
           res.redirect("/books");
       }
    });
});

//SHOW ROUTE
router.get("/:id", function(req, res){
    Book.find({"item.id": req.params.id}).populate("comments").exec(function(err, book) {
        if(err) {
            console.log(err);
        } else {
            res.render("books/show", {book: book});
        }
    });
});

//EDIT ROUTE
router.get("/:id/edit", function(req, res){
    Book.find({"item.id": req.params.id}, function(err, book) {
        if(err) {
            console.log(err);
        } else {
            res.render("books/edit", {book: book});
        }
    });
});

//UPDATE ROUTE
router.put("/:id", function(req, res){
  Book.findOneAndUpdate({"item.id": req.params.id}, {item: req.body.book}, function(err, book) {
      console.log(req.body.book);
      if(err) {
          console.log(err);
      } else {
          res.redirect("/books/" + req.params.id);
      }
  }) ;
});

//DELETE ROUTE
router.delete("/:id", function(req,res){
    Book.findOneAndRemove({"item.id": req.params.id}, function(err, book){
        if(err){
            console.log(err);
        } else{
            res.redirect("/books");
        }
    });
});

module.exports = router;