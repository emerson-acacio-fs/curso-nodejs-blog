const express = require("express");
const Category = require("../categories/Category");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

const router = express.Router();

router.post("/categories/save", adminAuth, (req, res) => {
  const { title } = req.body;
  if (title) {
    Category.create({ title, slug: slugify(title) }).then((category) => {
      res.redirect("/admin/categories");
    });
  } else {
    res.redirect("/admin/categories/new");
  }
});

router.get("/admin/categories/new", adminAuth, (req, res) => {
  res.render("admin/categories/new");
});

router.get("/admin/categories", adminAuth, (req, res) => {
  Category.findAll({
    raw: true,
    order: [["id", "DESC"]], //ASC=decrescente
  }).then((categories) => {
    res.render("admin/categories/index", { categories });
  });
});

router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.redirect("/admin/categories");
  } else {
    Category.findByPk(id).then((category) => {
      if (category) {
        res.render("admin/categories/edit", { category });
      } else {
        res.redirect("/admin/categories");
      }
    });
  }
});

router.post("/categories/delete", adminAuth, (req, res) => {
  const { id } = req.body;
  if (id) {
    if (!isNaN(id)) {
      Category.destroy({ where: { id } }).then((categories) => {
        res.redirect("/admin/categories");
      });
    } else {
      res.redirect("/admin/categories");
    }
  } else {
    res.redirect("/admin/categories");
  }
});

router.post("/categories/update", adminAuth, (req, res) => {
  const { title, id } = req.body;
  if (title) {
    Category.update({ title, slug: slugify(title) }, { where: { id } }).then(
      (category) => {
        res.redirect("/admin/categories");
      }
    );
  } else {
    res.redirect("/admin/categories/new");
  }
});

module.exports = router;
