const jwt = require("jsonwebtoken");
const redis = require("redis");

const redisClient = redis.createClient(process.env.REDIS_URL);

const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return Promise.reject("incorrect form submission");
  }
  const hash = bcrypt.hashSync(password);

  return db
    .transaction(trx => {
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
            .then(user => user[0]);
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch(err => Promise.reject("unable to register"));
};

const signInToken = email => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, "shhhhh");
};

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
};

const createSessions = user => {
  const { id, email } = user;
  const token = signInToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: "true", userID: id, token };
    })
    .catch(console.log);
};

const handleRegisterAuth = (req, res, db, bcrypt) => {
  return handleRegister(req, res, db, bcrypt)
    .then(data => {
      return data.id && data.email
        ? createSessions(data)
        : Promise.reject(data);
    })
    .then(session => res.json(session))
    .catch(err => res.json(err));
};

module.exports = {
  handleRegisterAuth,
  redisClient
};
