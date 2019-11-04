// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");

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

// Database configuration with mongoose
// mongoose.connect("mongodb://localhost/myscraper", { useUnifiedTopology: true, useNewUrlParser: true });
// mongoose.set('useCreateIndex', true);

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


app.get("/", function (req, res) {
    db.Article.find({
        saved: false
    })
        .then(function (dbArticle) {
            res.render("index", {
                articles: dbArticle
            });
        })
        .catch(function (err) {
            res.json(err);
        })

})

app.get("/saved", function (req, res) {
    db.Article.find({
        saved: true
    })
        .populate("comment")
        .then(function (dbArticle) {
            // console.log("LOGGING DBARTICLE");
            console.log(dbArticle[0].comment);
            // res.json(dbArticle)
            res.render("saved", {
                articles: dbArticle
            })
        })
        .catch(function (err) {
            res.json(err);
        })

})

// When user visits, it automatically scrapes articles
app.get("/scrape", function (req, res) {
    return axios.get("https://www.foxnews.com").then(function (response) {
        // load it into cheerio and save for a shorthand property
        var $ = cheerio.load(response.data);
        // add the text & href of every link and save them as properties of the result object
        var result = {};

        // grabbing divs with class of card-content
        $("article").each(function (i, element) {
            result.title = $(this)
                .children(".info")
                .children(".info-header")
                .children(".title")
                .children("a")
                .text();
            result.link = $(this)
                .children(".info")
                .children(".info-header")
                .children(".title")
                .children("a")
                .attr("href");
            result.type = $(this)
                .children(".item-info")
                .children(".content")
                .children(".dek")
                .children("a")
                .text();
            result.image = $(this)
                .children(".m")
                .children("a")
                .children("img")
                .attr("src");
            // creating a new article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // console.log(dbArticle);
                })
                .catch(function (err) {
                    // console.log(err);
                });

        })
        res.send("Scrape Complete");
    })
})

// deleting articles on click
app.get("/delete", function (req, res) {
    db.Article.deleteMany({})
        .then(function (dbArticle) {
            res.render("index", {
                articles: dbArticle
            });
        })
        .catch(function (err) {
            res.json(err);
        })
})

// saving articles on click

app.put("/save/:id", function (req, res) {
    var objectID = req.params.id;
    db.Article.findByIdAndUpdate(objectID, {
        $set: {
            saved: true
        }
    }, {
        new: true
    }, function (err, dbArticle) {
        if (err) return handleError(err);
        res.send(dbArticle);
    });
})

// pulling up comments for the specific article
app.post("/comments/:id", function (req, res) {
    var objectID = req.params.id;

    db.Comment.create(req.body)
        .then(function (dbComment) {
            return db.Article.findOneAndUpdate({
                _id: objectID
            }, {
                $push: {
                    comment: dbComment._id
                }
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
            // console.log("THIS IS IT");
            // console.log(dbArticle.comment);
            for (var i = 0; i < dbArticle.comment.length; i++) {
                console.log("IS a COMMENT")

                console.log(dbArticle.comment[i]);

                db.Article.findOne({ _id: dbArticle.comment[i] })
                    .populate("comment")
                    .then(function (comment) {
                        console.log(comment)
                        console.log("IS THE CMMENT")

                        res.json(comment)
                    })
                    .catch(function (err) {
                        res.json(err);
                    })
            }

        })
        // .then(() => res.redirect('/articles'))
        .catch(function (err) {
            res.json(err);
        })
})

app.get("/comments/:id", function (req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
    db.Article.findOne({ _id: req.params.id })
        .populate("comment")
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            res.json(err);
        })
});

// deleting comment
app.get("/deletecomment/:id", function (req, res) {
    var objectID = req.params.id;
    db.Comment.remove({ _id: objectID })
        .then(function (dbComment) {
            res.send(dbComment)
        })
        .catch(function (err) {
            res.json(err);
        })
})
// Listen on port 3000
app.listen(PORT, function () {
    console.log("App running on port 3000!");
});