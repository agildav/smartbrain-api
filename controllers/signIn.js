const handleSignIn = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject("incorrect form submission");
  }
  return db
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then(user => user[0])
          .catch(err => Promise.reject("unable to get user"));
      } else {
        return Promise.reject("wrong combination");
      }
    })
    .catch(err => Promise.reject("wrong combination"));
};

const getAuth = () => console.log("Auth");

const handleSignInAuth = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;

  return authorization
    ? getAuth()
    : handleSignIn(db, bcrypt, req, res)
        .then(data => res.json(data))
        .catch(err => res.json(err));
};

module.exports = {
  handleSignInAuth
};
