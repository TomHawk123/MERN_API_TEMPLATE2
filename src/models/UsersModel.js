const mongoose = require("mongoose");
const { Schema } = mongoose;

const UsersSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
});

const UsersModel = mongoose.model("User", UsersSchema);

module.exports = UsersModel;
