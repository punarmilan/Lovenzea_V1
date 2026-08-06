const fs = require('fs');
const path = require('path');

// 1. Fix the "About Me" edit button calling 'person' instead of 'about'
const myProfilePath = path.join(process.cwd(), 'src', 'pages', 'myshadi', 'myProfile', 'MyProfile.jsx');
let myProfileContent = fs.readFileSync(myProfilePath, 'utf8');

myProfileContent = myProfileContent.replace(
  "onClick={() => handleOpenEditModal('person')} className=\"text-theme-text-secondary hover:text-gray-900 p-1 transition-colors\" title=\"Edit About Me\"",
  "onClick={() => handleOpenEditModal('about')} className=\"text-theme-text-secondary hover:text-gray-900 p-1 transition-colors\" title=\"Edit About Me\""
);

fs.writeFileSync(myProfilePath, myProfileContent, 'utf8');
console.log('Fixed About Me edit button parameter.');

// 2. Add anti-inspect script to index.html
const indexHtmlPath = path.join(process.cwd(), 'index.html');
let indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

const antiInspectScript = `
  <!-- Anti-Inspect Security Script -->
  <script>
    document.addEventListener('contextmenu', event => event.preventDefault());
    document.onkeydown = function(e) {
      if(e.keyCode == 123) return false; // F12
      if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) return false; // Ctrl+Shift+I
      if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) return false; // Ctrl+Shift+C
      if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) return false; // Ctrl+Shift+J
      if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false; // Ctrl+U
    }
  </script>
`;

if (!indexHtmlContent.includes('Anti-Inspect Security Script')) {
  indexHtmlContent = indexHtmlContent.replace('</head>', antiInspectScript + '</head>');
  fs.writeFileSync(indexHtmlPath, indexHtmlContent, 'utf8');
  console.log('Added anti-inspect script to index.html.');
} else {
  console.log('Anti-inspect script already present.');
}
