const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    searchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Search',
      required: true,
      index: true,
    },
    placeId: {
      type: String, // Google Place ID, used to de-dupe across searches
      index: true,
    },
    businessName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, default: '' },
    whatsappNumber: { type: String, trim: true, default: '' },
    website: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    mapsLink: { type: String, trim: true, default: '' },
    rating: { type: Number, default: null },
    category: { type: String, trim: true, default: '' },
    coordinates: {
      lat: { type: Number, default: null },
      lon: { type: Number, default: null }
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'ignored'],
      default: 'new',
      index: true,
    },
    contactedAt: { type: Date, default: null },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

leadSchema.index({ user: 1, placeId: 1 }, { unique: false });

module.exports = mongoose.model('Lead', leadSchema);
