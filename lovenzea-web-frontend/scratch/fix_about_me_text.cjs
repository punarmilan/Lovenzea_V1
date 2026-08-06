const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'pages', 'myshadi', 'myProfile', 'MyProfile.jsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  '{profileData.aboutText || "I am a simple, ambitious and family-oriented person. I love traveling, reading books and exploring new places. I believe in honesty, respect and understanding in a relationship."}',
  '{profileData.aboutText || "N/A"}'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed About Me dummy text');
