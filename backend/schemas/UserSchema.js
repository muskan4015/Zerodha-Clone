const { Schema } = require("mongoose");

const UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "order",
    },
  ],
  holdings: [
    {
      type: Schema.Types.ObjectId,
      ref: "holding",
    },
  ],
});

module.exports = { UserSchema };
