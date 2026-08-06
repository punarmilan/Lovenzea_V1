const fs = require('fs');
const path = require('path');

const profileJsxPath = path.join(process.cwd(), 'src', 'pages', 'myshadi', 'myProfile', 'MyProfile.jsx');
let content = fs.readFileSync(profileJsxPath, 'utf8');

const validationOptions = `
const VALID_OPTIONS = {
  bloodGroup: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  maritalStatus: ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce', 'Annulled'],
  diet: ['Veg', 'Non-Veg', 'Eggetarian', 'Vegan'],
  smokingHabit: ['No', 'Occasionally', 'Yes'],
  drinkingHabit: ['No', 'Occasionally', 'Yes'],
  healthInformation: ['No Health Issues', 'Physical Disability', 'Mental Disability', 'HIV Positive', 'Other'],
  residencyStatus: ['Citizen', 'Permanent Resident', 'Work Permit', 'Student Visa', 'Temporary Visa'],
  manglikStatus: ['Manglik', 'Non-Manglik', 'Anshik Manglik', "Don't Know"],
  rashi: rashiOptions,
  nakshatra: nakshatraOptions,
  religion: religionOptions,
  caste: communityOptions,
  motherTongue: motherTongueOptions
};
`;

// Insert after FIELD_TYPES
content = content.replace(
  `const FIELD_TYPES = {`,
  validationOptions + `\nconst FIELD_TYPES = {`
);

const oldValidationLogic = `      // Required Dropdown/Radio checks
      if (type.includes('_req') && (!value || value === '')) {
        if (type.includes('dropdown')) newErrors[key] = "⚠️ Please select a valid option";
        else newErrors[key] = "⚠️ This field is required";
      }`;

const newValidationLogic = `      // Required Dropdown/Radio checks
      if (type.includes('_req') && (!value || value === '')) {
        if (type.includes('dropdown')) newErrors[key] = "⚠️ Please select a valid option";
        else newErrors[key] = "⚠️ This field is required";
      } else if (VALID_OPTIONS[key] && value) {
        if (!VALID_OPTIONS[key].includes(value)) {
          newErrors[key] = "⚠️ Invalid option selected";
        }
      }`;

content = content.replace(oldValidationLogic, newValidationLogic);

fs.writeFileSync(profileJsxPath, content, 'utf8');
console.log('Modified MyProfile.jsx');
