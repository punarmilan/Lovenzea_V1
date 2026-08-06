const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'pages', 'myshadi', 'myProfile', 'MyProfile.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Dynamic Title
const oldTitle = `<h3 className="text-xl font-black tracking-wide">Update Information</h3>`;
const newTitle = `<h3 className="text-xl font-black tracking-wide">
                  {modalSection === 'verification' && "Verify Your ID"}
                  {modalSection === 'basic' && "Update Basic Details"}
                  {modalSection === 'family' && "Update Family Details"}
                  {modalSection === 'lifestyle' && "Update Lifestyle"}
                  {modalSection === 'religion' && "Update Religious Info"}
                  {modalSection === 'education' && "Update Education & Career"}
                  {modalSection === 'preferences' && "Update Partner Preferences"}
                  {modalSection === 'location' && "Update Location"}
                  {modalSection === 'contact' && "Update Contact Info"}
                  {modalSection === 'about' && "About Me"}
                  {!modalSection && "Update Information"}
                </h3>`;

content = content.replace(oldTitle, newTitle);

// 2. Modernize Input Styling
// We want to replace standard input styles with modern ones.
// Example: className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-theme-magenta focus:border-transparent outline-none transition-all ${...}"

// Let's replace the standard class strings across the modal form.
// Since it's huge, let's use a regex that matches the common input/select styling in the modal.
content = content.replace(/className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-theme-magenta focus:border-transparent outline-none transition-all \$\{([^}]+)\}`}/g, 
  'className={`w-full px-5 py-3.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-[#df5f78] focus:border-transparent outline-none transition-all text-[#3d2930] shadow-sm ${$1}`}');

content = content.replace(/className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-theme-magenta focus:border-transparent outline-none transition-all"/g, 
  'className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#df5f78] focus:border-transparent outline-none transition-all text-[#3d2930] shadow-sm"');

// 3. Modernize Labels
content = content.replace(/<label className="text-sm font-semibold text-gray-700">/g, 
  '<label className="block text-xs font-bold text-[#b83f5d] uppercase tracking-wider mb-2">');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated MyProfile.jsx with modern form UI and dynamic titles.');
