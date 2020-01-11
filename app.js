const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology: true});

const articleSchema = new mongoose.Schema({
    title: String,
    content:String
});

const Article = mongoose.model("article",articleSchema);

const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.set(express.static("public"));

////////////////////////////////////Requests Targeting All Articles////////////////////////////

app.route("/articles")
.get((req,res)=>{
    Article.find({},(err,foundArticles)=>{
        if(!err){
            res.send(foundArticles);
        } else{
            res.send(err);
        }
    });
})
.post((req,res)=>{
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save((err)=>{
        if(!err){
            console.log("Successfully added a new article");
        } else{
            res.send(err);
        }
    });
})
.delete((req,res)=>{
    Article.deleteMany({},(err)=>{
        if(!err){
            res.send("Successfully deleted all the articles");
        } else{
            res.send("Error in deleteing");
        }
    });
});

////////////////////////////////////Requests Targeting Specific Articles////////////////////////////


app.route("/articles/:articleTitle")

.get((req,res)=>{
    Article.findOne({title: req.params.articleTitle},(err,foundArticle)=>{
        if(!err){
            res.send(foundArticle);
        } else{
            res.send("No matching articles");
        }
    });
})



.put((req,res)=>{
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title,content: req.body.content},
        {overwrite: true},(err)=>{ //in order to supress the property of wiping out a attribute of mongoose we give overwrite: true
            if(!err){
                res.send("Successfully updated");
            } else{
                res.send(err);
            }
        }
    );
})
// if you want to update only a part of the data then use patch
.patch((req,res)=>{
    Article.update(
        {title: req.params.articleTitle},
        {$set :req.body},
        (err)=>{
            if(!err){
                res.send("Updated successfully");
            } else{
                res.send(err);
            }
        }
    );
})

.delete((req,res)=>{
    Article.deleteOne({title: req.params.articleTitle},(err)=>{
        if(!err){
            res.send("Deleted Successfully");
        } else{
            res.send(err);
        }
    });
});


app.listen(3000,()=>{
    console.log("Server started on port 3000");
});