const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "localhost",
    user: "gil",
    password: "clave",
    database: "smartbrain"
  }
});

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(cors());

app.get("/", (req, res) => {
  console.log("connected to /");

  db.select("*")
    .from("users")
    .then(data => res.json(data));
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  //TODO: Loop th database
  /*if (
    email === database.users[0].email &&
    password === database.users[0].password
  ) {
    */
  res.json(email);
  console.log("connected to /signin");
  /*} else {
    res.status(400).json("sign in error");
  }
  */
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;

  console.log("connected to /register");
  db("users")
    .returning("*")
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => res.status(400).json("unable to register"));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  console.log("connected to /profile");
  db.select("*")
    .from("users")
    .where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch(err => res.status(400).json("error getting user"));
});

app.put("/image", (req, res) => {
  console.log("connected to /image");

  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      if (entries.length) {
        res.json(entries[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch(err => res.status(400).json("unable to get entries"));
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
