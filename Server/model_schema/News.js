const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    article_id: {
      type: String,
      unique: true,
    },
    title: String,
    description: String,
    content: String,
    link: String,
    image_url: String,
    creator: [String],
    language: String,
    country: [String],
    category: [String],
    pubDate: Date,
    source_id: String,
    source_name: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model('News', newsSchema);
