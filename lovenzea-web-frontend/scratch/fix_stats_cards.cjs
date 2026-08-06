const fs = require('fs');
const path = require('path');

const profileJsxPath = path.join(process.cwd(), 'src', 'pages', 'myshadi', 'myProfile', 'MyProfile.jsx');
let content = fs.readFileSync(profileJsxPath, 'utf8');

// Replace the grid container
content = content.replace(
  'className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"',
  'className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 mb-6"'
);

// Replace the card padding and text
const oldCard = `className="dashboard-card-bg p-5 rounded-2xl shadow-sm border border-white/50 flex items-center gap-4 hover:shadow-md transition-shadow"`;
const newCard = `className="dashboard-card-bg p-3 sm:p-4 lg:p-5 rounded-2xl shadow-sm border border-white/50 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 hover:shadow-md transition-shadow"`;
content = content.replace(oldCard, newCard);
content = content.replace(oldCard, newCard);
content = content.replace(oldCard, newCard);
content = content.replace(oldCard, newCard);

fs.writeFileSync(profileJsxPath, content, 'utf8');
console.log('Fixed STATS ROW responsive classes in MyProfile.jsx');
