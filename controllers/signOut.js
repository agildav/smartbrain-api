const redis = require("redis");
const redisClient = redis.createClient(process.env.REDIS_URL);

const removeToken = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.del(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json("Error removing token");
    }
    return res.status(200).json("Session cleared");
  });
};

const handleSignOut = (req, res) => {
  const { authorization } = req.headers;

  return authorization
    ? removeToken(req, res)
    : res.status(400).json("Error removing session");
};

module.exports = {
  handleSignOut,
  redisClient
};
