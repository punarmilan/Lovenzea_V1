export const religionOptions = [
  "Hindu",
  "Muslim",
  "Christian",
  "Sikh",
  "Buddhist",
  "Jain",
  "Parsi",
  "Jewish",
  "Spiritual",
  "Other"
];

export const manglikOptions = [
  { label: "Yes", value: "YES" },
  { label: "No", value: "NO" },
  { label: "Don't Know", value: "DONT_KNOW" }
];

export const astroVisibilityOptions = [
   {
    label: "All Members",
    value: "ALL_MEMBERS"
  },
  {
    label: "Premium Members",
    value: "PREMIUM_MEMBERS"
  },
  {
    label: "Only Me",
    value: "ONLY_ME"
  }     
  ];

export const motherTongueOptions = [
  "Marathi",
  "Hindi",
  "English",
  "Gujarati",
  "Punjabi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Bengali",
  "Urdu",
  "Odia",
  "Assamese",
  "Konkani",
  "Sindhi",
  "Other"
];

export const communityOptions = [
  "Brahmin",
  "Maratha",
  "Kunbi",
  "Rajput",
  "Jain",
  "Agarwal",
  "Yadav",
  "Lingayat",
  "Kshatriya",
  "Scheduled Caste",
  "Scheduled Tribe",
  "OBC",
  "Other"
];

export const subCommunityOptions = [
    "Jat Sikh", 
    "Arora Sikh", 
    "Khatri Sikh", 
    "Ramgarhia Sikh", 
    "Majabi Sikh",
    "Ravidasia Sikh", 
    "Maratha-Patil", 
    "96 Kuli Maratha", 
    "96 Kuli Maratha (Deshmukh)", 
    "Other"
];

export const gotraOptions = ["Bhardwaj", "Kashyap", "Vasishta", "Vishvamitra", "Gautam", "Jamadagni", "Atri", "Agastya", "Not Specified", "Other"];

export const timeOfBirthOptions = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const minute = (i % 2) * 30;
  const period = h < 12 ? 'AM' : 'PM';
  return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
});

export const rashiOptions = [
  "Mesh",
  "Vrushabh",
  "Mithun",
  "Kark",
  "Sinh",
  "Kanya",
  "Tula",
  "Vrushchik",
  "Dhanu",
  "Makar",
  "Kumbh",
  "Meen"
];

export const nakshatraOptions = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati"
];

//FamilyDetailsForm Options
export const fatherStatusOptions = [
  "Employed",
  "Business",
  "Retired",
  "Not Employed",
  "Passed Away"
];

export const motherStatusOptions = [
  "Homemaker",
  "Employed",
  "Business",
  "Retired",
  "Passed Away"
];

export const familyFinancialStatusOptions = [
  "Lower Middle Class",
  "Middle Class",
  "Upper Middle Class",
  "Affluent",
  "Rich"
];

export const familyAnnualIncome = [
  "Don't want to specify", "1L - 2L", "2L - 5L", "5L - 10L", "10L - 15L",
   "15L - 20L", "20L - 30L", "30L - 50L", "50L - 1Cr", "1Cr+"
]

//EducationCareerForm Options

export const educationOptions = [
  "10th",
  "12th",
  "Diploma",
  "ITI",
  "B.A",
  "B.Com",
  "B.Sc",
  "BCA",
  "B.Tech",
  "BE",
  "LLB",
  "MBBS",
  "MBA",
  "MCA",
  "M.Tech",
  "M.Com",
  "PhD",
  "Other"
];
    
export const educationFieldOptions = [
  "Computer Science",
  "Information Technology",
  "Mechanical",
  "Civil",
  "Electronics",
  "Commerce",
  "Arts",
  "Management",
  "Medical",
  "Law",
  "Education",
  "Other"
];

export const workingWithOptions = [
  "Private Company",
  "Government",
  "Public Sector",
  "Defense",
  "Civil Services",
  "Business",
  "Self Employed",
  "Not Working"
];

export const professionOptions = [
  "Software Engineer",
  "Doctor",
  "Teacher",
  "Professor",
  "Lawyer",
  "Chartered Accountant",
  "Business Owner",
  "Government Employee",
  "Banking Professional",
  "Marketing Professional",
  "Designer",
  "Other"
];

export const incomeOptions = [
  "Don't want to specify",
  "1-2 LPA",
  "2-5 LPA",
  "5-10 LPA",
  "10-15 LPA",
  "15-20 LPA",
  "20-30 LPA",
  "30-50 LPA",
  "50L-1Cr",
  "1Cr+"
];

//LocationForm Options

export const countryOptions = [
  "India",
  "USA",
  "Canada",
  "UK",
  "Australia",
  "New Zealand",
  "Germany",
  "Singapore",
  "UAE"
];

export const residencyStatusOptions = [
  "Citizen",
  "Permanent Resident",
  "Work Permit",
  "Student Visa",
  "Temporary Visa"
];

//LifestyleForm Options

export const maritalStatusOptions = [
  "Never Married",
  "Divorced",
  "Widowed",
  "Awaiting Divorce",
  "Annulled"
];

export const dietOptions = [
  "Veg",
  "Non-Veg",
  "Occasionally Non-Veg",
  "Eggetarian",
  "Jain",
  "Vegan"
];

export const drinkingOptions = [
  "Non-Drinker",
  "Occasionally",
  "Social Drinker",
  "Regular Drinker"
];
export const smokingOptions = [
  "Non-Smoker",
  "Occasionally",
  "Social Smoker",
  "Regular Smoker"
];

export const bloodGroupOptions = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-"
];

export const healthOptions = [
  "No Health Problems",
  "Minor Health Issues",
  "Major Health Issues"
];

export const disabilityOptions = [
  "None",
  "Physical Disability",
  "Visual Disability",
  "Hearing Disability",
  "Other"
];

export const hobbyOptions = [
  "Reading",
  "Writing",
  "Music",
  "Travel",
  "Cooking",
  "Dancing",
  "Photography",
  "Fitness",
  "Yoga",
  "Movies",
  "Cricket",
  "Football",
  "Gardening",
  "Art",
  "Painting"
];





