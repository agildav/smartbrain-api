const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");

const register = require("./controllers/register");
const signIn = require("./controllers/signIn");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

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
  db.select("*")
    .from("users")
    .then(data => res.json(data));
});

app.post("/signin", signIn.handleSignIn(db, bcrypt));

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);

  db.transaction(trx => {
    trx
      .insert({
        hash,
        email
      })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json("unable to register"));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

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
