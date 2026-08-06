const fs = require('fs');
const file = 'e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/myshadi/myProfile/MyProfile.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/className="bg-white /g, 'className="bg-white/60 backdrop-blur-md ');
content = content.replace(/border-gray-100/g, 'border-white/50');
fs.writeFileSync(file, content);
