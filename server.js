const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");

const register = require("./controllers/register");
const signIn = require("./controllers/signIn");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

//  Database url like:
//  postgres://user:password@postgres:5432/mydatabase
const dbConnectionURL = process.env.DATABASE_URL;

const db = knex({
  client: "pg",
  connection: dbConnectionURL
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
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

const port = process.env.PORT || 3000;
app.listen(port || 3000, () => {
  console.log(`app is running on port ${port}`);
});
