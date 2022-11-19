const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const articleSchema = new mongoose.Schema({
  name: String,
  content: String,
});

const Article = mongoose.model("article", articleSchema);

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//---------------------------------------------------------

app
  .route("/articles")
  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticles);
      }
    });
  })

  .post((req, res) => {
    const newArticle = new Article({
      name: req.body.name,
      content: req.body.content,
    });

    newArticle.save((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("saved");
      }
    });
  })

  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (err) {
        console.log(err);
      } else {
        res.send("deleted");
      }
    });
  });

app
  .route("/articles/:articleName")
  .get((req, res) => {
    let articleName = req.params.articleName;
    Article.findOne({ name: articleName }, (err, foundArticle) => {
      console.log(foundArticle);
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No article matching that name");
      }
    });
  })

  .put((req, res) => {
    let articleName = req.params.articleName;
    Article.updateOne(
      { name: articleName },
      {
        name: req.body.name,
        content: req.body.content,
      },
      (err) => {
        if (!err) {
          res.send("Updated");
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch((req, res) => {
    let articleName = req.params.articleName;

    Article.updateOne({ name: articleName }, { $set: req.body }, (err) => {
      if (!err) {
        res.send("Updated");
      } else {
        res.send(err);
      }
    });
  })

  .delete((req, res) => {
    let articleName = req.params.articleName;

    Article.deleteOne({ name: articleName }, (err) => {
      if (!err) {
        res.send("Deleted");
      } else {
        res.send(err);
      }
    });
  });

//---------------------------------------------------------
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
