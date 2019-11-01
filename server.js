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
mongoose.connect("mongodb://localhost/myscraper", { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.set('useCreateIndex', true);


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
        .populate({
            path: "comment"
        })
        .then(function (dbArticle) {
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
        console.log("W T F");
        var result = {};

        // grabbing divs with class of card-content
        $("article").each(function (i, element) {
            // add the text & href of every link and save them as properties of the result object
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
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });

        })
        res.send("Scrape Complete");
    })
})

// getting all articles from db
app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        })
});

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
        res.send(db.Article);
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
            res.send(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        })
})

// deleting comment
app.get("/deletecomment/:id", function (req, res) {
    var objectID = req.params.id;
    db.Comment.remove({ _id: objectID })
        .then(function (dbComment) {
            res.send(db.Comment)
        })
        .catch(function (err) {
            res.json(err);
        })
})
// Listen on port 3000
app.listen(PORT, function () {
    console.log("App running on port 3000!");
});