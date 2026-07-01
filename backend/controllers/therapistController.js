const Therapist = require('../models/Therapist');

// Get all therapists with filters
exports.getAllTherapists = async (req, res) => {
  try {
    const { 
      specialty, 
      onlineOnly, 
      minPrice, 
      maxPrice, 
      minRating,
      search,
      available,
      limit = 20,
      page = 1
    } = req.query;

    let query = { isActive: true };

    // Filter by specialty
    if (specialty && specialty !== 'All Specialties') {
      query.specialty = specialty;
    }

    // Filter by online only
    if (onlineOnly === 'true') {
      query.onlineOnly = true;
    }

    // Filter by availability
    if (available === 'true') {
      query.available = true;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Search by text
    if (search) {
      query.$text = { $search: search };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const therapists = await Therapist.find(query)
      .sort({ rating: -1, reviewCount: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Therapist.countDocuments(query);

    res.json({
      success: true,
      data: therapists,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching therapists:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get single therapist by ID
exports.getTherapistById = async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id);
    
    if (!therapist) {
      return res.status(404).json({ 
        success: false, 
        error: 'Therapist not found' 
      });
    }
    
    res.json({
      success: true,
      data: therapist
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Create new therapist (admin only)
exports.createTherapist = async (req, res) => {
  try {
    const therapist = new Therapist(req.body);
    await therapist.save();
    
    res.status(201).json({
      success: true,
      data: therapist
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Update therapist (admin only)
exports.updateTherapist = async (req, res) => {
  try {
    const therapist = await Therapist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!therapist) {
      return res.status(404).json({ 
        success: false, 
        error: 'Therapist not found' 
      });
    }
    
    res.json({
      success: true,
      data: therapist
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Delete therapist (admin only)
exports.deleteTherapist = async (req, res) => {
  try {
    const therapist = await Therapist.findByIdAndDelete(req.params.id);
    
    if (!therapist) {
      return res.status(404).json({ 
        success: false, 
        error: 'Therapist not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Therapist deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get specialties list
exports.getSpecialties = async (req, res) => {
  try {
    const specialties = await Therapist.distinct('specialty');
    res.json({
      success: true,
      data: ['All Specialties', ...specialties]
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
