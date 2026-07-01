const mongoose = require('mongoose');
require('dotenv').config();
const Therapist = require('../models/Therapist');
const { getImageForTherapist } = require('../services/imageService');

const therapists = [
  {
    name: "Dr. Sarah Chen",
    specialty: "Anxiety & Depression",
    subSpecialties: ["Social Anxiety", "Panic Disorders", "Major Depression"],
    rating: 4.9,
    reviewCount: 128,
    available: true,
    experience: "12 years",
    location: "Online",
    onlineOnly: true,
    price: 120,
    languages: ["English", "Mandarin"],
    education: ["PhD in Clinical Psychology - Stanford University", "BA in Psychology - UC Berkeley"],
    about: "Dr. Chen specializes in helping adults overcome anxiety and depression using evidence-based approaches like CBT and mindfulness. She believes in creating a warm, non-judgmental space where clients feel safe to explore their thoughts and feelings.",
    email: "sarah.chen@mindspace.com"
  },
  {
    name: "Michael Okonkwo",
    specialty: "Trauma & PTSD",
    subSpecialties: ["Childhood Trauma", "Complex PTSD", "EMDR Therapy"],
    rating: 4.8,
    reviewCount: 94,
    available: true,
    experience: "8 years",
    location: "New York",
    onlineOnly: false,
    price: 150,
    languages: ["English"],
    education: ["MSW - Columbia University", "EMDR Certified"],
    about: "Michael is a trauma-informed therapist with specialized training in EMDR. He works with individuals who have experienced various forms of trauma and helps them build resilience and find healing.",
    email: "michael.okonkwo@mindspace.com"
  },
  {
    name: "Dr. Emily Rodriguez",
    specialty: "Teen Counseling",
    subSpecialties: ["Adolescent Anxiety", "School Stress", "Identity Issues"],
    rating: 4.9,
    reviewCount: 156,
    available: true,
    experience: "10 years",
    location: "California",
    onlineOnly: false,
    price: 130,
    languages: ["English", "Spanish"],
    education: ["PsyD in Child Psychology - UCLA", "MA in Counseling - USC"],
    about: "Dr. Rodriguez has dedicated her career to supporting teenagers through the challenges of adolescence. She uses a combination of talk therapy, art therapy, and family systems approaches to help young people thrive.",
    email: "emily.rodriguez@mindspace.com"
  },
  {
    name: "Dr. James Wilson",
    specialty: "Addiction & Recovery",
    subSpecialties: ["Substance Abuse", "Behavioral Addictions", "Relapse Prevention"],
    rating: 4.7,
    reviewCount: 203,
    available: true,
    experience: "15 years",
    location: "Online",
    onlineOnly: true,
    price: 140,
    languages: ["English"],
    education: ["MD - Johns Hopkins", "Addiction Medicine Fellowship - Yale"],
    about: "Dr. Wilson is a board-certified addiction specialist who takes a compassionate, non-judgmental approach to recovery. He believes in treating the whole person, not just the addiction.",
    email: "james.wilson@mindspace.com"
  },
  {
    name: "Lisa Thompson, LCSW",
    specialty: "Relationship Counseling",
    subSpecialties: ["Couples Therapy", "Family Conflict", "Communication Skills"],
    rating: 4.9,
    reviewCount: 187,
    available: true,
    experience: "11 years",
    location: "Chicago",
    onlineOnly: false,
    price: 125,
    languages: ["English"],
    education: ["MSW - University of Chicago", "Gottman Method Level 3"],
    about: "Lisa helps couples and families improve communication, resolve conflicts, and build stronger relationships. She's trained in the Gottman Method and Emotionally Focused Therapy.",
    email: "lisa.thompson@mindspace.com"
  },
  {
    name: "Dr. Marcus Lee",
    specialty: "BIPOC Mental Health",
    subSpecialties: ["Cultural Identity", "Racial Trauma", "Immigration Stress"],
    rating: 5.0,
    reviewCount: 89,
    available: true,
    experience: "7 years",
    location: "Online",
    onlineOnly: true,
    price: 135,
    languages: ["English", "Korean"],
    education: ["PhD in Counseling Psychology - University of Texas", "MA in Ethnic Studies"],
    about: "Dr. Lee specializes in supporting BIPOC individuals navigating cultural identity, racial trauma, and systemic stressors. He offers a culturally-affirming space for healing and growth.",
    email: "marcus.lee@mindspace.com"
  }
];

async function seedTherapists() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing therapists
    const deleted = await Therapist.deleteMany({});
    console.log(`🗑️ Cleared ${deleted.deletedCount} existing therapists`);
    
    // Add real professional images to each therapist
    const therapistsWithImages = therapists.map(therapist => ({
      ...therapist,
      imageUrl: getImageForTherapist(therapist.name)
    }));
    
    // Insert new therapists
    const inserted = await Therapist.insertMany(therapistsWithImages);
    console.log(`✅ Added ${inserted.length} therapists to database`);
    
    // Display images added
    console.log('\n📸 Professional Therapist Photos Added:');
    inserted.forEach(t => {
      console.log(`   👤 ${t.name}`);
      console.log(`      📷 ${t.imageUrl}`);
    });
    
    await mongoose.disconnect();
    console.log('\n✅ Seeding complete! Real professional photos added!');
  } catch (error) {
    console.error('❌ Error seeding therapists:', error);
    process.exit(1);
  }
}

seedTherapists();
