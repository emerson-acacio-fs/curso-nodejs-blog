const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./database/database");

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

app.listen(8080, () => {
  console.log("O servidor foi iniciado");
});
