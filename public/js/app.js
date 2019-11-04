
// scrape button on click
$(document).on("click", "#scrape", function (event) {
    event.preventDefault();
    $.ajax("/scrape", {
        type: "GET"
    }).then(
        function () {
            // console.log("Scraping website");
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
            // console.log("Deleting all articles");
            window.location.href = "/"
        }
    );
})

// save article on click
$(document).on("click", "#saveArticle", function (event) {
    event.preventDefault();
    var id = $(this).attr("objectID");
    $.ajax("/save/" + id, {
        type: "PUT"
    }).then(
        function () {
            // console.log("saving article");
            window.location.href = "/";
        }
    );
})



// save comment

$(document).on("click", ".commentArticle", function (event) {
    event.preventDefault();
    var id = $(this).attr("objectID");
    var name = $("#" + id + "Name").val();
    var message = $("#" + id + "Message").val();

    var newComment = {
        name: name,
        message: message
    }
    console.log(newComment);
    //Send the POST request.
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

// $(document).on("click", ".commentArticle", function (event) {
//     event.preventDefault();
//     var id = $(this).attr("objectID");
//     // var name = $("#" + id + "Message").val();

//     // var newComment = {
//     //     name: name,
//     //     message: message
//     // }
//     // console.log(newComment);
//     // send post request

//     console.log($("#" + id + "Name").val())
//     var commentName = $("#" + id + "Name").val()
//     $.ajax({

//         url: "/comments/" + id,
//         type: "POST",
//         data: {
//             name: commentName,
//             comment: $(".commentMessage").val()
//         }
//     }).then(function (data) {
//         console.log(" THIS IS IT");
//         console.log(data);
//         // console.log("posting new comment" + data);
//         // $("#form").empty();
//         window.location.href = "/saved";
//     });
//     $(".commentName").val("");
//     $(".commentMessage").val("");
// })

// delete comment on click
$(document).on("click", ".deleteComment", function (event) {
    event.preventDefault();
    var id = $(this).attr("objectID");
    $.ajax("/deletecomment/" + id, {
        type: "GET"
    }).then(
        function () {
            // console.log("deleting comment");
            window.location.href = "/saved";
        }
    )
})