const express = require("express");
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");
const router = express.Router();

router.get("/admin/articles", adminAuth, (req, res) => {
  Article.findAll({
    order: [["id", "DESC"]], //ASC=decrescente
    include: [{ model: Category }],
  }).then((articles) => {
    res.render("admin/articles/index", { articles });
  });
});

router.get("/admin/articles/new", adminAuth, (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/articles/new", { categories });
  });
});

router.post("/articles/save", adminAuth, (req, res) => {
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
router.post("/articles/delete", adminAuth, (req, res) => {
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

router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.redirect("/admin/articles");
  } else {
    Article.findByPk(id).then((article) => {
      if (article) {
        Category.findAll({
          raw: true,
          order: [["id", "DESC"]], //ASC=decrescente
        }).then((categories) => {
          res.render("admin/articles/edit", { article, categories });
        });
      } else {
        res.redirect("/admin/articles");
      }
    });
  }
});

router.get("/articles/page/:num", (req, res) => {
  const { num: page } = req.params;
  let offset = 0;

  if (isNaN(page) || page == 1) {
    offset = 0;
  } else {
    offset = (parseInt(page) - 1) * 4;
  }

  Article.findAndCountAll({ limit: 4, offset, order: [["id", "DESC"]] }).then(
    (articles) => {
      let next = false;
      if (offset + 4 >= articles.count) {
        next = false;
      } else {
        next = true;
      }

      Category.findAll({
        raw: true,
        order: [["id", "DESC"]], //ASC=decrescente
      }).then((categories) => {
        res.render("admin/articles/page", {
          result: { articles, next, page: parseInt(page) },
          categories,
        });
      });
    }
  );
});

router.post("/articles/update", adminAuth, (req, res) => {
  const { title, id, body, categoryId } = req.body;
  if (title) {
    Article.update(
      { title, slug: slugify(title), body, categoryId },
      { where: { id } }
    ).then(() => {
      res.redirect("/admin/articles");
    });
  } else {
    res.redirect("/admin/articles/new");
  }
});

module.exports = router;
