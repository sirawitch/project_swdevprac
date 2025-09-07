const ArtToy = require('../models/ArtToy');
const dayjs = require('dayjs');

// @desc    Get all art toys
// @route   GET /api/v1/arttoys
// @access  Public
exports.getArtToys = async (req, res) => {
  const artToys = await ArtToy.find();
  res.json({
    success: true,
    count: artToys.length,
    data: artToys
  });
};

// @desc    Get single art toy
// @route   GET /api/v1/arttoys/:id
// @access  Public
exports.getArtToy = async (req, res) => {
  try {
    const artToy = await ArtToy.findById(req.params.id);
    if (!artToy) {
      return res.status(404).json({
        success: false,
        message: 'Art Toy not found'
      });
    }
    res.json({
      success: true,
      data: artToy
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Art Toy not found - Invalid ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create art toy
// @route   POST /api/v1/arttoys
// @access  Admin
exports.createArtToy = async (req, res) => {
  const { sku, name, description, arrivalDate, availableQuota, posterPicture } = req.body;
  
  // Check if arrival date is not earlier than current date
  if (dayjs(arrivalDate).isBefore(dayjs(), 'day')) {
    return res.status(400).json({
      success: false,
      message: 'Arrival date cannot be earlier than current date'
    });
  }
  const artToy = await ArtToy.create({ 
    sku,
    name, 
    description, 
    arrivalDate, 
    availableQuota, 
    posterPicture 
  });
  
  res.status(201).json({
    success: true,
    data: artToy
  });
};

// @desc    Update art toy
// @route   PUT /api/v1/arttoys/:id
// @access  Admin
exports.updateArtToy = async (req, res) => {
  const { arrivalDate } = req.body;
  
  // Check if arrival date is not earlier than current date if it's being updated
  if (arrivalDate && dayjs(arrivalDate).isBefore(dayjs(), 'day')) {
    return res.status(400).json({
      success: false,
      message: 'Arrival date cannot be earlier than current date'
    });
  }

  const artToy = await ArtToy.findByIdAndUpdate(
    req.params.id, 
    req.body, 
    { 
      new: true, 
      runValidators: true 
    }
  );

  if (!artToy) {
    return res.status(404).json({
      success: false,
      message: 'Art Toy not found'
    });
  }

  res.json({
    success: true,
    data: artToy
  });
};

// @desc    Delete art toy
// @route   DELETE /api/v1/arttoys/:id
// @access  Admin
exports.deleteArtToy = async (req, res) => {
  const artToy = await ArtToy.findByIdAndDelete(req.params.id);
  
  if (!artToy) {
    return res.status(404).json({
      success: false,
      message: 'Art Toy not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Art Toy deleted'
  });
};
