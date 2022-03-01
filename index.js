const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./database/database");
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const Article = require("./articles/Article");
const Category = require("./categories/Category");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

connection
  .authenticate()
  .then(() => console.log("A conexão foi feita com sucesso!"))
  .catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/", categoriesController);
app.use("/", articlesController);

app.listen(8080, () => {
  console.log("O servidor foi iniciado");
});
