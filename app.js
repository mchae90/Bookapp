var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    methodOverride = require('method-override'),
    bodyParser = require("body-parser"),
    Book = require("./models/book");
    
var bookRoutes = require("./routes/books"),
    indexRoutes = require("./routes/index");
    
var url = process.env.DATABASEURL || "mongodb://localhost/bookapp"
    
//mongoose.connect("mongodb://localhost/bookapp");
//mongoose.connect(process.env.DATABASEURL);
mongoose.connect(url);


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));

app.use("/", indexRoutes);
app.use("/books", bookRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Server Has Started!");
});

