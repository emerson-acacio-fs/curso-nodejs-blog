const express = require("express");
const User = require("./User");
const bcrypt = require("bcryptjs");
const router = express.Router();

router.get("/admin/users", (req, res) => {
  User.findAll().then((users) => {
    res.render("admin/users/index", { users });
  });
});

router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create");
});

router.get("/login", (req, res) => {
  res.render("admin/users/login");
});

router.get("/logout", (req, res) => {
  req.session.user = null;
  res.redirect("/login");
});

router.post("/authenticate", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ where: { email } }).then((user) => {
    if (user) {
      const correct = bcrypt.compareSync(password, user.password);
      if (correct) {
        req.session.user = { id: user.id, email: user.email };
        res.redirect("/admin/articles");
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  });
});

router.post("/users/create", (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    User.create({ email, password: hash })
      .then(() => {
        res.redirect("/admin/users");
      })
      .catch((err) => {
        res.redirect("/admin/users");
      });
  } else {
    res.redirect("/admin/users");
  }
});

module.exports = router;
