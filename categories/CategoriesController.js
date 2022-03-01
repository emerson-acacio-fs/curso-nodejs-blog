const express = require("express");
const Category = require("../categories/Category");
const slugify = require("slugify");
const router = express.Router();

router.get("/categories", (req, res) => {
  res.send("ROTA DE CATEGORIAS");
});

router.post("/categories/save", (req, res) => {
  const { title } = req.body;
  if (title) {
    Category.create({ title, slug: slugify(title) }).then((category) => {
      res.redirect("/");
    });
  } else {
    res.redirect("/admin/categories/new");
  }
});

router.get("/admin/categories/new", (req, res) => {
  res.render("admin/categories/new");
});

module.exports = router;
