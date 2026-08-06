const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'pages', 'myshadi', 'myProfile', 'MyProfile.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const interestsRegex = /\{\['🎵 Music', '✈️ Traveling', '📚 Reading', '🍳 Cooking', '📸 Photography', '🧘‍♀️ Yoga'\]\.map\(\(tag, i\) => \([\s\S]*?\)\)\}/;
const dynamicInterests = `{(profileData.hobbies && profileData.hobbies.length > 0 ? (Array.isArray(profileData.hobbies) ? profileData.hobbies : profileData.hobbies.split(',')) : []).length > 0 
                    ? (Array.isArray(profileData.hobbies) ? profileData.hobbies : profileData.hobbies.split(',')).map((tag, i) => (
                    <span key={i} className="bg-gray-50 border border-white/50 text-gray-700 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
                      {tag}
                    </span>
                  )) : (
                    <span className="text-theme-text-secondary text-sm font-medium">N/A</span>
                  )}`;

if (content.match(interestsRegex)) {
  content = content.replace(interestsRegex, dynamicInterests);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed Interests Mock data');
} else {
  console.log('Interests Mock data not found or already replaced.');
}
