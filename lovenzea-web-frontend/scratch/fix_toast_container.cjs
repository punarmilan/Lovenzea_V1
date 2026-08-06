const fs = require('fs');
const path = require('path');

const profileJsxPath = path.join(process.cwd(), 'src', 'pages', 'myshadi', 'myProfile', 'MyProfile.jsx');
let content = fs.readFileSync(profileJsxPath, 'utf8');

content = content.replace(
  '<ToastContainer />',
  '<ToastContainer position="top-right" style={{ marginTop: "80px", zIndex: 999999 }} />'
);

fs.writeFileSync(profileJsxPath, content, 'utf8');
console.log('Fixed ToastContainer in MyProfile.jsx');
