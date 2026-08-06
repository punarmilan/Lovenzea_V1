const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'pages', 'myshadi', 'myProfile', 'MyProfile.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Insert maxDate18YearsAgo
if (!content.includes('maxDate18YearsAgo')) {
  content = content.replace('const MyProfile = ({ editModePage = false }) => {', 
    `const maxDate18YearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0];\nconst MyProfile = ({ editModePage = false }) => {`);
}

// 2. Fix the dynamic labels and the dynamic input rendering

// Find the generic label block
const oldLabelBlock = `<label className="block text-xs font-bold text-[#b83f5d] uppercase tracking-wider mb-2 ml-1">
                          {fieldLabels[key] || key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>`;
                        
// Find the original label string in case the previous script replaced it slightly differently
// Wait, my previous script had: `<label className="text-xs font-bold text-theme-text-secondary uppercase tracking-wider mb-1 block ml-1">`
// Let me just replace the exact one I know exists:
const regexLabel = /<label className="text-xs font-bold text-theme-text-secondary uppercase tracking-wider mb-1 block ml-1">\s*\{fieldLabels\[key\] \|\| key\.replace\(\/\(\[A-Z\]\)\/g, ' \$1'\)\.trim\(\)\}\s*<\/label>/;

const newLabelBlock = `<div className="flex justify-between items-end mb-2">
                          <label className="block text-xs font-bold text-[#b83f5d] uppercase tracking-wider ml-1">
                            {fieldLabels[key] || key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          {key === 'dateOfBirth' && (
                            <span className="text-[10px] font-bold text-[#df5f78] bg-[#fff1ed] px-2 py-0.5 rounded-full border border-[#f1d8d1]">18+ ONLY</span>
                          )}
                        </div>`;

content = content.replace(regexLabel, newLabelBlock);

// 3. Fix the dynamic input block
const fallbackRegex = /\) : \(\s*<input\s+type=\{key\.toLowerCase\(\)\.includes\('email'\) \? 'email' : key\.toLowerCase\(\)\.includes\('date'\) \? 'date' : 'text'\}\s+value=\{value \|\| ''\}\s+onChange=\{\(e\) => handleModalDataChange\(key, e\.target\.value\)\}\s+placeholder=\{`Enter \$\{key\.replace\(\/\(\[A-Z\]\)\/g, ' \\$1'\)\.toLowerCase\(\)\}`\}\s+className=\{`w-full px-5 py-3\.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-\[#df5f78\] focus:border-transparent outline-none transition-all text-\[#3d2930\] shadow-sm \$\{errors\[key\] \? 'border-red-500' : 'border-theme-border'\}`\}\s+\/>\s*\)\}/;

const newFallback = `) : (
                          <div className="relative">
                            <input
                              type={key.toLowerCase().includes('email') ? 'email' : key.toLowerCase().includes('date') ? 'date' : 'text'}
                              value={value || ''}
                              onChange={(e) => handleModalDataChange(key, e.target.value)}
                              max={key === 'dateOfBirth' ? maxDate18YearsAgo : undefined}
                              placeholder={\`Enter \${key.replace(/([A-Z])/g, ' $1').toLowerCase()}\`}
                              className={\`w-full px-5 py-3.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-[#df5f78] focus:border-transparent outline-none transition-all text-[#3d2930] shadow-sm \${errors[key] ? 'border-red-500' : 'border-[#f1d8d1]/60'}\`}
                              style={key === 'dateOfBirth' ? { colorScheme: 'light' } : undefined}
                            />
                            {key === 'dateOfBirth' && (
                              <p className="text-[11px] text-[#b83f5d]/70 mt-1.5 ml-1 font-medium">* You must be at least 18 years old to register.</p>
                            )}
                          </div>
                        )}`;

content = content.replace(fallbackRegex, newFallback);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed dynamic DOB inputs.');
