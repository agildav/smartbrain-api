const Clarifai = require("clarifai");

//  Clarifai
const clarifai_model = "a403429f2ddf4b49b307e318f00e528b";
//  TODO: Remove key and replace with process.env.api_key
const clarifai_key = process.env.api_key || "50150ec8c47f49738a12d6cc945fdff2";

const app = new Clarifai.App({
  apiKey: clarifai_key
});

const handleApiCall = (req, res) => {
  app.models
    .predict(clarifai_model, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json("unable to get info from API"));
};

const handleImage = (req, res, db) => {
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
};

module.exports = {
  handleImage,
  handleApiCall
};
