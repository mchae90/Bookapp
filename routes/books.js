var express = require("express");
var router  = express.Router();
var request = require("request");
var Book = require("../models/book");

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
"#FFAD9C"]

//INDEX ROUTE
router.get("/", function(req, res){
   Book.find({}, function(err, allBooks){
       if(err){
           console.log(err);
       } else {
            res.render("index", {books: allBooks, colors: colors});
       }
   })
});


//NEW ROUTE
router.get("/new", function(req, res){
    var query = req.query.search;
    var url = "https://www.googleapis.com/books/v1/volumes?q=" + query
    request(url, function (error, response, body) {
        if(!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("books/new", {data: data});
        }
    })
});

//CREATE ROUTE
router.post("/", function(req, res) {
    Book.create(req.body.item, function(err, newBook){
       if(err){
           console.log(err);
       } else {
           res.redirect("/books");
       }
    });
});

//SHOW ROUTE
router.get("/:id", function(req, res){
    Book.find({id: req.params.id}, function(err, book) {
        if(err) {
            console.log(err);
        } else {
            res.render("books/show", {book: book})
        }
    });
});

//EDIT ROUTE
router.get("/:id/edit", function(req, res){
    Book.find({id: req.params.id}, function(err, book) {
        if(err) {
            console.log(err);
        } else {
            res.render("books/edit", {book: book})
        }
    });
});

//UPDATE ROUTE
router.put("/:id", function(req, res){
  Book.findOneAndUpdate({id: req.params.id}, req.body.book, function(err, book) {
      if(err) {
          console.log(err);
      } else {
          res.redirect("/books/" + req.params.id);
      }
  }) ;
});

//DELETE ROUTE
router.delete("/:id", function(req,res){
    Book.findOneAndRemove({id: req.params.id}, function(err, book){
        if(err){
            console.log(err);
        } else{
            res.redirect("/books");
        }
    });
});

module.exports = router;