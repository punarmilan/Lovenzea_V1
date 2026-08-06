const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'components', 'profile', 'ReligiousBackgroundForm.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix Sub-Community options
content = content.replace(
  /\{subCommunityOptions\.map\(\(item\) => \(\s*<option\s*key=\{item\.value\}\s*value=\{item\.value\}\s*>\s*\{item\}\s*<\/option>\s*\)\)\}/g,
  `{subCommunityOptions.map((item) => (
                <option
                  key={item}
                  value={item} 
                >
                  {item}
                </option>
              ))}`
);

// Fix Gothra options
content = content.replace(
  /\{gotraOptions\.map\(\(item\) => \(\s*<option\s*key=\{item\.value\}\s*value=\{item\.value\}\s*>\s*\{item\}\s*<\/option>\s*\)\)\}/g,
  `{gotraOptions.map((item) => (
                <option
                  key={item}
                  value={item} 
                >
                  {item}
                </option>
              ))}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed React key warnings in ReligiousBackgroundForm.jsx');
