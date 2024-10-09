const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/Schema");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const tokenVerification = await jwt.verify(token, "JagdishTinder#12");
    if (!tokenVerification) {
      throw new Error();
    }
    const { id } = tokenVerification;
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};
module.exports = userAuth;
