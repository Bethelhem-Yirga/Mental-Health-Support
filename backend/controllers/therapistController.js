// Mock data - replace with database
const therapists = [
  { id: 1, name: "Dr. Sarah Chen", specialty: "Anxiety & Depression", rating: 4.9, available: true, experience: "12 years", location: "Online" },
  { id: 2, name: "Michael Okonkwo", specialty: "Trauma & PTSD", rating: 4.8, available: false, experience: "8 years", location: "New York" },
  { id: 3, name: "Dr. Emily Rodriguez", specialty: "Teen Counseling", rating: 4.9, available: true, experience: "10 years", location: "California" },
  { id: 4, name: "Dr. James Wilson", specialty: "Addiction & Recovery", rating: 4.7, available: true, experience: "15 years", location: "Online" }
];

exports.getAllTherapists = (req, res, next) => {
  try {
    let result = [...therapists];
    if (req.query.available === 'true') {
      result = result.filter(t => t.available);
    }
    
    res.json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.getTherapistById = (req, res, next) => {
  try {
    const therapist = therapists.find(t => t.id === parseInt(req.params.id));
    if (!therapist) {
      return res.status(404).json({ error: 'Therapist not found' });
    }
    res.json({ success: true, data: therapist });
  } catch (error) {
    next(error);
  }
};