const crisisHotlines = [
  { 
    name: "988 Suicide & Crisis Lifeline", 
    number: "988", 
    available24_7: true,
    description: "Free, confidential support for people in distress",
    sms: false,
    website: "https://988lifeline.org"
  },
  { 
    name: "Crisis Text Line", 
    number: "741741", 
    available24_7: true,
    description: "Text with a trained crisis counselor",
    sms: true,
    website: "https://www.crisistextline.org"
  },
  { 
    name: "SAMHSA Helpline", 
    number: "1-800-662-4357", 
    available24_7: true,
    description: "Substance abuse and mental health support",
    sms: false,
    website: "https://www.samhsa.gov/find-help/national-helpline"
  },
  { 
    name: "National Domestic Violence Hotline", 
    number: "1-800-799-7233", 
    available24_7: true,
    description: "Support for domestic violence situations",
    sms: false,
    website: "https://www.thehotline.org"
  }
];

exports.getCrisisHotlines = async (req, res, next) => {
  try {
    res.json({
      success: true,
      count: crisisHotlines.length,
      data: crisisHotlines
    });
  } catch (error) {
    next(error);
  }
};

exports.getCrisisResources = async (req, res, next) => {
  try {
    const resources = [
      { title: "Safety Plan Template", type: "pdf", link: "#" },
      { title: "Grounding Techniques", type: "video", link: "#" },
      { title: "Emergency Contacts Worksheet", type: "pdf", link: "#" }
    ];
    
    res.json({ success: true, data: resources });
  } catch (error) {
    next(error);
  }
};