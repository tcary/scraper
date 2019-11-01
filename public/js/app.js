// Grab the articles as a json
$.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $(".articles-displayed").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].type + "<br />" + data[i].link + "<br />" + data[i].summary + "</p>");
    }
});
// scrape button on click
$(document).on("click", "#scrape", function (event) {
    event.preventDefault();
    $.ajax("/scrape", {
        type: "GET"
    }).then(
        function () {
            console.log("Scraping website");
            window.location.href = "/";
        }
    );
})

// delete articles on click
$(document).on("click", "#deleteAll", function (event) {
    event.preventDefault();
    $.ajax("/delete", {
        type: "GET"
    }).then(
        function () {
            console.log("Deleting all articles");
            window.location.href = "/"
        }
    );
})

// save article on click
$(document).on("click", "#saveArticle", function (event) {
    event.preventDefault();
    var id = $(this).attr("objectID");
    $.ajax("/save/" + id, {
        tupe: "PUT"
    }).then(
        function () {
            console.log("saving article");
            window.location.href = "/";
        }
    );
})

// save comment
$(document).on("click", ".commentArticle", function (event) {
    event.preventDefault();
    var id = $(this).attr("objectID");
    var name = $("#" + id + "Message").val();

    var newComment = {
        name: name,
        message: message
    }
    console.log(newComment);
    // send post request
    $.ajax("/comments/" + id, {
        type: "POST",
        data: newComment
    }).then(
        function () {
            console.log("posting new comment");
            window.location.href = "/saved";
        }
    );
})

// delete comment on click
$(document).on("click", ".deleteComment", function (event) {
    event.preventDefault();
    var id = $(this).attr("objectID");
    $.ajax("/deletecomment/" + id, {
        type: "GET"
    }).then(
        function () {
            console.log("deleting comment");
            window.location.href = "/saved";
        }
    )
})