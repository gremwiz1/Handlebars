const mongoose = require("mongoose");

const todolistSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    required: true,
  },
  flag: {
    type: String,
    required: true,
    default: "Не выполнено",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("todolist", todolistSchema);
