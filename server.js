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

db.select("*")
  .from("users")
  .then(data => console.log(data));

const database = {
  users: [
    {
      id: 000,
      name: "Alberto",
      email: "agildav@gmail.com",
      password: "2356",
      entries: 0,
      join: new Date()
    },
    {
      id: 001,
      name: "Alexandra",
      email: "vaneferrerp@gmail.com",
      password: "1234",
      entries: 0,
      join: new Date()
    }
  ]
};

app.get("/", (req, res) => {
  console.log("connected to /");
  res.json(database.users);
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  //TODO: Loop th database
  if (
    email === database.users[0].email &&
    password === database.users[0].password
  ) {
    res.json("success");
    console.log("connected to /signin");
  } else {
    res.status(400).json("sign in error");
  }
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
