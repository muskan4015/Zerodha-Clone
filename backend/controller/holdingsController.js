const { UserModel } = require("../model/UserModel");

module.exports.index = async (req, res) => {
  let user = await UserModel.findOne({ email: req.user.email }).populate("holdings");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user.holdings);
};
