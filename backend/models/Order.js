const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  artToy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ArtToy', 
    required: true 
  },
  orderAmount: { 
    type: Number, 
    required: true, 
    min: [1, "Order amount must be at least 1"],
    max: [5, "Order amount cannot exceed 5"]
  },
}, { 
  timestamps: true 
});

// Prevent user from submitting more than 1 order for the same art toy
OrderSchema.index({ user: 1, artToy: 1 }, { unique: true });

module.exports = mongoose.model('Order', OrderSchema);
