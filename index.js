const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./database/database");
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const session = require("express-session");

const app = express();

app.use(session({ secret: "sddffggtrrswdsds", cookie: { maxAge: 30000000 } }));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

connection
  .authenticate()
  .then(() => console.log("A conexão foi feita com sucesso!"))
  .catch((error) => console.log(error));

app.get("/", (req, res) => {
  Article.findAll({
    order: [["id", "DESC"]], //ASC=decrescente
    limit: 4,
    // include: [{ model: Category }],
  }).then((articles) => {
    Category.findAll({
      raw: true,
      order: [["id", "DESC"]], //ASC=decrescente
    }).then((categories) => {
      res.render("index", { articles, categories });
    });
  });
});
app.get("/articles/:slug", (req, res) => {
  const { slug } = req.params;
  Article.findOne({
    where: { slug },
  })
    .then((article) => {
      if (article) {
        Category.findAll({
          raw: true,
          order: [["id", "DESC"]], //ASC=decrescente
        }).then((categories) => {
          res.render("article", { article, categories });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch(() => res.redirect("/"));
});
app.get("/category/:slug", (req, res) => {
  const { slug } = req.params;
  Category.findOne({
    where: { slug },
    include: [{ model: Article }],
  })
    .then((category) => {
      if (category) {
        Category.findAll({
          raw: true,
          order: [["id", "DESC"]], //ASC=decrescente
        }).then((categories) => {
          res.render("index", { articles: category.articles, categories });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch(() => res.redirect("/"));
});

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.listen(7777, () => {
  console.log("O servidor foi iniciado");
});
