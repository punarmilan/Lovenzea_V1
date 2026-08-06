const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'pages', 'myshadi', 'myProfile', 'MyProfile.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace Personal Details
content = content.replace(
  /\{\s*label:\s*'Date of Birth',\s*value:\s*profileData\.religiousBackground\?\.dob \|\| '15 Mar 1997'\s*\}/,
  "{ label: 'Date of Birth', value: profileData.religiousBackground?.dob || 'N/A' }"
);
content = content.replace(
  /\{\s*label:\s*'Time of Birth',\s*value:\s*profileData\.timeOfBirth \|\| '10:45 AM'\s*\}/,
  "{ label: 'Time of Birth', value: profileData.timeOfBirth || 'N/A' }"
);
content = content.replace(
  /\{\s*label:\s*'Height',\s*value:\s*profileData\.height \|\| "5'4\\""\s*\}/,
  "{ label: 'Height', value: profileData.height || 'N/A' }"
);
content = content.replace(
  /\{\s*label:\s*'Complexion',\s*value:\s*'Fair'\s*\}/,
  "{ label: 'Complexion', value: profileData.complexion || 'N/A' }"
);
content = content.replace(
  /\{\s*label:\s*'Body Type',\s*value:\s*'Slim'\s*\}/,
  "{ label: 'Body Type', value: profileData.bodyType || 'N/A' }"
);
// Manglik remains logic-based but we should handle empty case
content = content.replace(
  /\{\s*label:\s*'Manglik',\s*value:\s*profileData\.manglikStatus === 'YES' \? 'Yes' : 'No'\s*\}/,
  "{ label: 'Manglik', value: profileData.manglikStatus ? (profileData.manglikStatus === 'YES' ? 'Yes' : 'No') : 'N/A' }"
);

// Education & Career
content = content.replace(
  /\{\s*label:\s*'Education',\s*value:\s*profileData\.education \|\| 'MBA'\s*\}/,
  "{ label: 'Education', value: profileData.education || 'N/A' }"
);
content = content.replace(
  /\{\s*label:\s*'Profession',\s*value:\s*profileData\.profession \|\| 'Marketing Manager'\s*\}/,
  "{ label: 'Profession', value: profileData.profession || 'N/A' }"
);
content = content.replace(
  /\{\s*label:\s*'Company',\s*value:\s*profileData\.company \|\| 'Infosys'\s*\}/,
  "{ label: 'Company', value: profileData.company || 'N/A' }"
);
content = content.replace(
  /\{\s*label:\s*'Annual Income',\s*value:\s*profileData\.income \|\| '₹ 12 - 15 Lacs'\s*\}/,
  "{ label: 'Annual Income', value: profileData.income || 'N/A' }"
);
content = content.replace(
  /\{\s*label:\s*'Working With',\s*value:\s*profileData\.workingWith \|\| 'Private Company'\s*\}/,
  "{ label: 'Working With', value: profileData.workingWith || 'N/A' }"
);
content = content.replace(
  /\{\s*label:\s*'Employment Type',\s*value:\s*'Full Time'\s*\}/,
  "{ label: 'Employment Type', value: profileData.employmentType || 'N/A' }"
);

// Lifestyle
content = content.replace(
  /\{\s*label:\s*'Diet',\s*value:\s*profileData\.diet \|\| 'Vegetarian'\s*\}/,
  "{ label: 'Diet', value: profileData.diet || 'N/A' }"
);
content = content.replace(
  /\{\s*label:\s*'Smoking',\s*value:\s*profileData\.smokingHabit \|\| 'No'\s*\}/,
  "{ label: 'Smoking', value: profileData.smokingHabit || 'N/A' }"
);
content = content.replace(
  /\{\s*label:\s*'Drinking',\s*value:\s*profileData\.drinkingHabit \|\| 'No'\s*\}/,
  "{ label: 'Drinking', value: profileData.drinkingHabit || 'N/A' }"
);
content = content.replace(
  /\{\s*label:\s*'Physical Status',\s*value:\s*profileData\.disability === 'None' \? 'Normal' : 'Normal'\s*\}/,
  "{ label: 'Physical Status', value: profileData.disability || 'N/A' }"
);
content = content.replace(
  /\{\s*label:\s*'Blood Group',\s*value:\s*profileData\.bloodGroup \|\| 'B\+'\s*\}/,
  "{ label: 'Blood Group', value: profileData.bloodGroup || 'N/A' }"
);

// Partner Preference
content = content.replace(
  /\{\s*label:\s*'Age',\s*value:\s*profileData\.partnerPreferences\?\.ageRange \|\| '26 - 32 Years'\s*\}/,
  "{ label: 'Age', value: profileData.partnerPreferences?.ageRange || 'N/A' }"
);
content = content.replace(
  /\{\s*label:\s*'Height',\s*value:\s*profileData\.partnerPreferences\?\.heightRange \|\| "5'6\\" - 6'0\\""\s*\}/,
  "{ label: 'Height', value: profileData.partnerPreferences?.heightRange || 'N/A' }"
);
content = content.replace(
  /\{\s*label:\s*'Education',\s*value:\s*profileData\.partnerPreferences\?\.education \|\| 'Graduate & Above'\s*\}/,
  "{ label: 'Education', value: profileData.partnerPreferences?.education || 'N/A' }"
);
content = content.replace(
  /\{\s*label:\s*'Profession',\s*value:\s*profileData\.partnerPreferences\?\.profession \|\| 'Any'\s*\}/,
  "{ label: 'Profession', value: profileData.partnerPreferences?.profession || 'N/A' }"
);
content = content.replace(
  /\{\s*label:\s*'Location',\s*value:\s*profileData\.partnerPreferences\?\.country \|\| 'India'\s*\}/,
  "{ label: 'Location', value: profileData.partnerPreferences?.country || 'N/A' }"
);
content = content.replace(
  /\{\s*label:\s*'Manglik',\s*value:\s*'No Preference'\s*\}/,
  "{ label: 'Manglik', value: profileData.partnerPreferences?.manglikStatus || 'N/A' }"
);

// Contact Information
content = content.replace(
  /\{\s*label:\s*'Mobile Number',\s*value:\s*profileData\.mobileNumber \|\| '98XXXXXX23',\s*verified:\s*true\s*\}/,
  "{ label: 'Mobile Number', value: profileData.mobileNumber || 'N/A', verified: !!profileData.mobileNumber }"
);
content = content.replace(
  /\{\s*label:\s*'Email ID',\s*value:\s*profileData\.email \|\| 'priya\.sharma@example\.com',\s*verified:\s*true\s*\}/,
  "{ label: 'Email ID', value: profileData.email || 'N/A', verified: !!profileData.email }"
);
content = content.replace(
  /\{\s*label:\s*'Address',\s*value:\s*`\$\{profileData\.city \|\| 'Pune'\},\s*\$\{profileData\.state \|\| 'Maharashtra'\},\s*\$\{profileData\.country \|\| 'India'\}`,\s*verified:\s*false\s*\}/,
  "{ label: 'Address', value: [profileData.city, profileData.state, profileData.country].filter(Boolean).join(', ') || 'N/A', verified: false }"
);

// Interests
const interestsRegex = /\{\['🎵 Music', '✈️ Traveling', '📚 Reading', '🍳 Cooking', '📸 Photography', '🧘‍♀️ Yoga'\]\.map\(\(tag, i\) => \([\s\S]*?\)\)\}/;
const dynamicInterests = `{(profileData.hobbies && profileData.hobbies.length > 0 ? profileData.hobbies : []).length > 0 
                    ? profileData.hobbies.map((tag, i) => (
                    <span key={i} className="bg-gray-50 border border-white/50 text-gray-700 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
                      {tag}
                    </span>
                  )) : (
                    <span className="text-theme-text-secondary text-sm font-medium">N/A</span>
                  )}`;
content = content.replace(interestsRegex, dynamicInterests);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Removed dummy data from MyProfile.jsx');
