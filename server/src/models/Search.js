const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    keyword: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    resultCount: { type: Number, default: 0 },
    provider: { type: String, enum: ['google', 'google_scrape', 'mock', 'osm'], default: 'google' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Search', searchSchema);
