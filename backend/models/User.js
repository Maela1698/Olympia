const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  fname: {
    type: String,
    required: true
  },

  mail: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  contact: {
    type: String
  },

  id_role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true
  }

});

module.exports = mongoose.model("User", UserSchema);
