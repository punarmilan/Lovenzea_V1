const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'pages', 'myshadi', 'myProfile', 'MyProfile.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update Modal Header Gradient
content = content.replace(
  'className="bg-gradient-to-r from-theme-primary to-theme-pink p-5 sm:p-6 flex justify-between items-center text-white"',
  'className="bg-gradient-to-r from-[#df5f78] to-[#c93f65] p-5 sm:p-6 flex justify-between items-center text-white"'
);

// 2. Update Modal Content Background
content = content.replace(
  'className="p-4 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar"',
  'className="p-4 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar bg-[#fffaf7]"'
);

// 3. Update Save Changes Button
content = content.replace(
  'className="px-6 py-2.5 bg-gradient-to-r from-theme-primary to-theme-pink hover:from-theme-primary-dark hover:to-theme-pink-dark text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-theme-primary/20 outline-none"',
  'className="px-8 py-3 bg-gradient-to-r from-[#ef7f8f] to-[#c93f65] text-white font-bold rounded-xl shadow-[0_8px_20px_rgba(201,63,101,0.25)] hover:shadow-[0_12px_25px_rgba(201,63,101,0.35)] hover:-translate-y-0.5 transition-all outline-none"'
);

// 4. Update Cancel Button
content = content.replace(
  'className="px-6 py-2.5 border-2 border-theme-border text-theme-primary font-bold rounded-xl hover:bg-theme-surface transition-colors focus:ring-2 focus:ring-theme-primary/20 outline-none"',
  'className="px-8 py-3 border-2 border-[#f1d8d1] text-[#b83f5d] font-bold rounded-xl hover:bg-[#fff1ed] hover:border-[#e88c8c] transition-all outline-none"'
);

// 5. Update Bottom Action Bar Background
content = content.replace(
  'className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-end gap-3 rounded-b-3xl border-t border-theme-border"',
  'className="bg-white px-4 py-5 sm:px-8 flex justify-end gap-4 rounded-b-3xl border-t border-[#f1d8d1]/60"'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated MyProfile.jsx modal color theme to match premium UI.');
