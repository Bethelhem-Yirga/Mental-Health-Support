const express = require('express');
const router = express.Router();
const {
  getAllTherapists,
  getTherapistById,
  createTherapist,
  updateTherapist,
  deleteTherapist,
  getSpecialties
} = require('../controllers/therapistController');

// Public routes
router.get('/', getAllTherapists);
router.get('/specialties', getSpecialties);
router.get('/:id', getTherapistById);

// Admin routes (add auth middleware in production)
router.post('/', createTherapist);
router.put('/:id', updateTherapist);
router.delete('/:id', deleteTherapist);

module.exports = router;
