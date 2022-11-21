const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    userId: String,
    author: String,
    title: String,
    description: String,
    tags: String,
    main: String,
    imageFile: [String],
    createdBy: String,
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);
