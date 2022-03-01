const express = require("express");
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const router = express.Router();

router.get("/admin/articles", (req, res) => {
  Article.findAll({
    order: [["id", "DESC"]], //ASC=decrescente
    include: [{ model: Category }],
  }).then((articles) => {
    res.render("admin/articles/index", { articles });
  });
});

router.get("/admin/articles/new", (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/articles/new", { categories });
  });
});

router.post("/articles/save", (req, res) => {
  const { title, body, categoryId } = req.body;
  if (title) {
    Article.create({ title, slug: slugify(title), body, categoryId }).then(
      () => {
        res.redirect("/admin/articles");
      }
    );
  } else {
    res.redirect("/admin/articles/new");
  }
});
router.post("/articles/delete", (req, res) => {
  const { id } = req.body;
  if (id) {
    if (!isNaN(id)) {
      Article.destroy({ where: { id } }).then((articles) => {
        res.redirect("/admin/articles");
      });
    } else {
      res.redirect("/admin/articles");
    }
  } else {
    res.redirect("/admin/articles");
  }
});

module.exports = router;
