var mongoose = require("mongoose");

// ref to schema
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    type: {
        type: String
    },
    date: {
        type: String
    },
    summary: {
        type: String
    },
    image: {
        type: String
    },

    // comment is an object that stores comment id
    // the ref property links the objectId to the comment model
    // this allows us to populate the Article with an associated Comment
    comment: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article