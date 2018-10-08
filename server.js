const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");

const register = require("./controllers/register");
const signIn = require("./controllers/signIn");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const auth = require("./controllers/auth");
const signOut = require("./controllers/signOut");

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
  res.json("Welcome, please use client side");
});

app.post("/signin", signIn.handleSignInAuth(db, bcrypt));

app.post("/register", (req, res) => {
  register.handleRegisterAuth(req, res, db, bcrypt);
});

app.get("/profile/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.post("/profile/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});

app.put("/image", auth.requireAuth, (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageurl", auth.requireAuth, (req, res) => {
  image.handleApiCall(req, res);
});

app.get("/signout", auth.requireAuth, (req, res) => {
  signOut.handleSignOut(req, res);
});

const port = process.env.PORT || 3000;
app.listen(port || 3000, () => {
  console.log(`app is running on port ${port}`);
});
