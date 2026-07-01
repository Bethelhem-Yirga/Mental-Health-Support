const resources = [
  { id: 1, title: "Understanding Anxiety", type: "article", category: "anxiety", duration: "10 min read", link: "#" },
  { id: 2, title: "5-Minute Grounding Exercise", type: "video", category: "coping", duration: "5 min", link: "#" },
  { id: 3, title: "Sleep Hygiene Guide", type: "pdf", category: "sleep", duration: "15 min read", link: "#" },
  { id: 4, title: "Meditation for Beginners", type: "audio", category: "meditation", duration: "10 min", link: "#" },
  { id: 5, title: "Cognitive Behavioral Therapy Basics", type: "article", category: "therapy", duration: "20 min read", link: "#" }
];

exports.getAllResources = (req, res, next) => {
  try {
    let result = [...resources];
    
    if (req.query.category) {
      result = result.filter(r => r.category === req.query.category);
    }
    
    if (req.query.type) {
      result = result.filter(r => r.type === req.query.type);
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

exports.getResourceById = (req, res, next) => {
  try {
    const resource = resources.find(r => r.id === parseInt(req.params.id));
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};