const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'pages', 'myshadi', 'myProfile', 'MyProfile.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The DOB input is likely rendered in the form. Let's find it.
// We'll calculate maxDate at the top of the component or just in the render.
// To keep it simple, we can inject the maxDate string directly into the JSX render if it's dynamic, or just add the JS logic inside the component.

const insertLogicRegex = /const MyProfile = \(\) => {/;
if (!content.includes('const maxDate18YearsAgo =')) {
  content = content.replace(insertLogicRegex, 
    `const maxDate18YearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0];\nconst MyProfile = () => {`);
}

// Find the Date of Birth input and replace it.
// The label is <label className="block text-xs font-bold text-[#b83f5d] uppercase tracking-wider mb-2">Date of Birth</label>
// Followed by <input type="date" ... />

const dobLabelRegex = /<label className="block text-xs font-bold text-\[#b83f5d\] uppercase tracking-wider mb-2">Date of Birth \?<\/?label>\s*<input\s+type="date"[^>]*>/;
const dobMatch = content.match(dobLabelRegex);

if (dobMatch) {
  // Let's replace the whole input block
  const oldInputStr = dobMatch[0];
  
  // We need to keep the name, value, onChange etc.
  const nameMatch = oldInputStr.match(/name="([^"]+)"/);
  const valueMatch = oldInputStr.match(/value={([^}]+)}/);
  const onChangeMatch = oldInputStr.match(/onChange={([^}]+)}/);
  const classNameMatch = oldInputStr.match(/className="([^"]+)"/);
  
  const name = nameMatch ? nameMatch[0] : 'name="dateOfBirth"';
  const value = valueMatch ? valueMatch[0] : 'value={modalData.dateOfBirth || \'\'}';
  const onChange = onChangeMatch ? onChangeMatch[0] : 'onChange={(e) => handleModalDataChange(\'dateOfBirth\', e.target.value)}';
  const className = classNameMatch ? classNameMatch[1] : 'w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#df5f78] focus:border-transparent outline-none transition-all text-[#3d2930] shadow-sm';
  
  const newInputStr = `<div className="relative">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-xs font-bold text-[#b83f5d] uppercase tracking-wider">Date of Birth</label>
                          <span className="text-[10px] font-semibold text-[#df5f78] bg-[#fff1ed] px-2 py-0.5 rounded-full">18+ Only</span>
                        </div>
                        <input
                          type="date"
                          ${name}
                          ${value}
                          ${onChange}
                          max={maxDate18YearsAgo}
                          className="${className} cursor-pointer appearance-none relative"
                          style={{ colorScheme: 'light' }}
                        />
                        <p className="text-[11px] text-gray-400 mt-1.5 ml-1 font-medium">* You must be at least 18 years old to register.</p>
                      </div>`;
                      
  // We need to replace the original wrapper if it had one, but our regex matched label + input.
  // We should be careful. Usually it's wrapped in <div className="space-y-2">.
  
  const fullBlockRegex = /<div className="space-y-2">\s*<label className="block text-xs font-bold text-\[#b83f5d\] uppercase tracking-wider mb-2">Date of Birth \?<\/?label>\s*<input\s+type="date"[^>]*>\s*<\/div>/;
  
  if (content.match(fullBlockRegex)) {
      content = content.replace(fullBlockRegex, newInputStr);
  } else {
      // If no space-y-2 wrapper, just replace label+input
      content = content.replace(oldInputStr, newInputStr.replace('<div className="relative">', '').replace(/<\/div>$/, ''));
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated DOB field with 18+ restriction and note.');
