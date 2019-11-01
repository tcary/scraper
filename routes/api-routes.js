// import { request } from "https";
// import Axios from "axios";

// app.get("/", function (req, res) {
//     db.Article.find({
//         saved: false
//     })
//         .then(function (dbArticle) {
//             res.render("index", {
//                 articles: dbArticle
//             });
//         })
//         .catch(function (err) {
//             res.json(err);
//         })
// })

// app.get("/saved", function (req, res) {
//     db.Article.find({
//         saved: true
//     })
//         .populate({
//             path: "comment"
//         })
//         .then(function (dbArticle) {
//             res.render("saved", {
//                 articles: dbArticle
//             })
//         })
//         .catch(function (err) {
//             res.json(err);
//         })
// })

// // When user visits, it automatically scrapes articles
// app.get("/scrape", function (req, res) {
//     axios.get("http://wwww.foxnews.com", function (response) {
//         // load it into cheerio and save for a shorthand property
//         var $ = cheerio.load(response.data);
//         $("article").each(function (i, element) {
//             var result = {};

//             // add the text & href of every link and save them as properties of the result object
//             result.title = $(this)
//                 .children("a")
//                 .text();
//             result.link = $(this)
//                 .children("a")
//                 .attr("href");

//             // creating a new article using the `result` object built from scraping

//         })


//     })
// })