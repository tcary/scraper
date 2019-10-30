app.get("/", function (req, res) {
    db.Article.find({
        saved: false
    })
        .then(function (dbmyscraperdb) {
            res.render("index", {
                articles: dbmyscraperdb
            });
        })
        .catch(function (err) {
            res.json(err);
        })
})