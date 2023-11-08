//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",{useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article",articleSchema);

//////////////////////Requests targeting all Articles////////////////////

app.route("/articles")

.get(function(req,res){
    Article.find({}).then(function(foundArticles){
        res.send(foundArticles);
    });
})

.post(function(req,res){

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save().then(function(err){
        if(!err){
            res.send("Successfully added a new article");
        }
        else{
            res.send(err);
        }
    });
})

.delete(function(req,res){
    Article.deleteMany().then(function(err){
        if(!err){
            res.send("Successfully deleted all the items");
        }
        else{
            res.send(err);
        }
    });
});

//////////////////////Requests targeting single Articles////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.findOne({title: req.params.articleTitle}).then(function(foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }
        else{
            res.send("No articles matching that title was found")
        }
    });
})

.put(function(req, res) {
    Article.updateOne(
        { title: req.params.articleTitle },
        { title: req.body.title, content: req.body.content }
    )
    .then(() => {
        res.send("Successfully updated the article.");
    });
})

.patch(function(req, res) {
    Article.updateOne(
        { title: req.params.articleTitle },
        { $set: req.body}
    )
    .then(() => {
        res.send("Successfully updated the article.");
    });
})

.delete(function(req, res) {
    Article.deleteOne(
        { title: req.params.articleTitle }
    )
    .then(() => {
        res.send("Successfully deleted the article.");
    });
});




//TODO

app.listen(3000, function() {
  console.log("Server started on port 3000");
});