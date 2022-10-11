const mongoose = require("mongoose");
const albumSchema = new mongoose.Schema({
  c_json: {
    type: String,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  }
});

module.exports = albumSchema;