const mongoose = require('mongoose');

const ArtToySchema = new mongoose.Schema({
  sku: {
    type: String,
    required: [true, "Please add a SKU"],
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  arrivalDate: {
    type: Date,
    required: [true, "Please add an arrival date"],
  },
  availableQuota: {
    type: Number,
    required: [true, "Please add available quota"],
    min: [0, "Available quota cannot be negative"],
  },
  posterPicture: {
    type: String,
    required: [true, "Please add a poster picture URL"],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("ArtToy", ArtToySchema);
