var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
   id: String,
   title: String,
   subtitle: String,
   authors: String,
   publisher: String,
   publishedDate: String,
   description: String,
   pageCount: String,
   categories: String,
   thumbnail: String,
   highlight: Boolean,
   review: String,
   dateAdded: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Book", bookSchema);