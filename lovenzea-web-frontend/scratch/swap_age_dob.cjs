const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'components', 'profile', 'LifestyleForm.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const ageRegex = /\/\* AGE \*\/[\s\S]*?(?=\/\* DOB \*\/)/;
const dobRegex = /\/\* DOB \*\/[\s\S]*?(?=\/\* MARITAL STATUS \*\/)/;

const ageMatch = content.match(ageRegex);
const dobMatch = content.match(dobRegex);

if (ageMatch && dobMatch) {
  const ageBlock = ageMatch[0];
  const dobBlock = dobMatch[0];
  
  // Replace the combined block with DOB first, then AGE
  const combinedRegex = /\/\* AGE \*\/[\s\S]*?(?=\/\* MARITAL STATUS \*\/)/;
  content = content.replace(combinedRegex, dobBlock + '\n            ' + ageBlock);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Swapped DOB and AGE in LifestyleForm.jsx');
} else {
  console.log('Could not find AGE or DOB blocks');
}
