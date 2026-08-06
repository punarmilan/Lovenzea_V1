const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'components', 'profile', 'ReligiousBackgroundForm.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find the Gender div
// It starts with {/* GENDER */} and ends with the Religion div
const genderRegex = /\/\* GENDER \*\/[\s\S]*?(?=\/\* RELIGION \*\/)/;
content = content.replace(genderRegex, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Removed Gender from ReligiousBackgroundForm.jsx');
