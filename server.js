// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");

// require models
var db = require("./models");
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// using morgan logger for logging requests
app.use(logger("dev"));
// using body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// using express.statis to serve public folder as a static directory
app.use(express.static("public"));

// If deployed use the deployed database. Otherwise use the local mongoHeadlines db
var MONGODB_URI = processs.env.MONGODB_URI || "mongodb://localhost/myscraperdb"
require("./routes/api-routes");

// Database configuration with mongoose
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// errors if any
// db.on("error", function (error) {
//     console.log("Mongoose error: ", error);
// });
// db.once("open", function () {
//     console.log("Mongoose connection successful");
// });

require('./routes/api-routes')(app);

// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});