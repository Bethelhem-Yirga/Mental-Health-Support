/**
 * Authentic Professional Therapist Photos
 * All therapists now have unique, professional images
 */

const THERAPIST_UNIQUE_IMAGES = {
  // Dr. Sarah Chen - Asian female psychologist in office
  'Dr. Sarah Chen': 'https://media.gettyimages.com/id/1395128697/photo/psychologist-session.jpg?s=612x612&w=gi&k=20&c=KUDx1tU6Z38Abm0uko4MZjTBx6ZzrYiyanMcr1N7TJE=',
  
  // Michael Okonkwo - Black male therapist in professional setting
  'Michael Okonkwo': 'https://media.gettyimages.com/id/1371356393/photo/serious-male-counselor-listens-to-unrecognizable-woman.jpg?s=612x612&w=gi&k=20&c=-mvjjFEXKQTL79o7lhVmp7RhyAQfZlK1tYDOCwaDVwU=',
  
  // Dr. Emily Rodriguez - Latina therapist with glasses
  'Dr. Emily Rodriguez': 'https://media.gettyimages.com/id/1351358579/photo/happy-psychologist-and-little-boy-smiling-at-each-other.jpg?s=612x612&w=gi&k=20&c=Fy0VqMcYb6qW9cIr6yyTQjbjpQqeg4VQlnVPCu9_gso=',
  
  // Dr. James Wilson - Experienced male therapist (FIXED - added proper photo)
  'Dr. James Wilson': 'https://media.gettyimages.com/id/1399285445/photo/therapist-and-male-patient-smile-at-each-other.jpg?s=612x612&w=gi&k=20&c=WYwB_k8DQtJSSa3jGJV4ChUBXwmfc1Bf2V3rKbvZic0=',
  
  // Lisa Thompson, LCSW - Female therapist warm expression
  'Lisa Thompson, LCSW': 'https://media.gettyimages.com/id/1034426836/photo/encouraging-therapist-talks-with-young-woman.jpg?s=612x612&w=gi&k=20&c=-cparcglwCAY-ODLTZek8jZ0EkfgIjdRCYnwGTeVnXI=',
  
  // Dr. Marcus Lee - Asian American male therapist
  'Dr. Marcus Lee': 'https://media.gettyimages.com/id/1572298169/photo/unrecognizable-male-patient-waits-as-male-therapist-reviews-record.jpg?s=612x612&w=gi&k=20&c=PACCFYmDNTiKrI14eh_2EYW3EuJJXETH4g12cMwvhjo='
};

const getImageForTherapist = (name) => {
  return THERAPIST_UNIQUE_IMAGES[name] || 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop';
};

module.exports = {
  getImageForTherapist
};
