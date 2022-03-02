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
