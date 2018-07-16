var express = require("express");
var router  = express.Router();
var request = require("request");
var Book = require("../models/book");

var colors = ["#ff5226", "#67e399", "#000000", "#00b3e3", "#00311a", "#FFAD9C", "#ED1941", "#301bcb", "#1a1c66", "#005d63", "#9e005d", "#610b39", "#1850c0", "#a40000", "#1c41a0", "#30a13c", "#040040"];

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