var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
   item: {
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
   review: String},
   author: {
     id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
     } ,
     username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
      ],
   dateAdded: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Book", bookSchema);