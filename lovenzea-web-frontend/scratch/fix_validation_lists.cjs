const fs = require('fs');
const path = require('path');

const profileJsxPath = path.join(process.cwd(), 'src', 'pages', 'myshadi', 'myProfile', 'MyProfile.jsx');
let content = fs.readFileSync(profileJsxPath, 'utf8');

const validationOptions = `
const VALID_OPTIONS = {
  bloodGroup: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  maritalStatus: ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce', 'Annulled'],
  diet: ['Veg', 'Non-Veg', 'Occasionally Non-Veg', 'Eggetarian', 'Jain', 'Vegan'],
  preferredDiet: ['Veg', 'Non-Veg', 'Occasionally Non-Veg', 'Eggetarian', 'Jain', 'Vegan'],
  disability: ['None', 'Physical Disability'],
  smokingHabit: ['Non-Smoker', 'Light / Social Smoker', 'Regular Smoker'],
  drinkingHabit: ['Non-Drinker', 'Light / Social Drinker', 'Regular Drinker'],
  healthInformation: ['No Health Problems', 'Minor Health Issues', 'Major Health Issues'],
  residencyStatus: ['Citizen', 'Permanent Resident', 'Work Permit', 'Student Visa', 'Temporary Visa'],
  manglikStatus: ['YES', 'NO', 'DONT_KNOW'],
  profileCreatedBy: ['Self', 'Parent', 'Sibling', 'Friend', 'Other'],
  profileManagedBy: ['Self', 'Parent', 'Sibling', 'Friend', 'Relative'],
  professionArea: ['IT/Software', 'Medical', 'Finance', 'Engineering', 'Teaching', 'Business', 'Marketing', 'Civil Services', 'Defense', 'Arts', 'Other'],
  workingWith: ['Private Company', 'Government / Public Sector', 'Defense / Civil Services', 'Business / Self Employed', 'Not Working'],
  matchScoreThreshold: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100', 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  astroVisibility: ['ALL_MEMBERS', 'CONTACTED_AND_ACCEPTED'],
  profilePhotoVisibility: ['ALL_MEMBERS', 'PREMIUM_MEMBERS', 'MATCHES'],
  albumPhotoVisibility: ['ALL_MEMBERS', 'PREMIUM_MEMBERS', 'MATCHES'],
  profileVisibility: ['Public', 'Members', 'Premium'],
  annualIncome: ["Don't want to specify", "1L - 2L", "2L - 5L", "5L - 10L", "10L - 15L", "15L - 20L", "20L - 30L", "30L - 50L", "50L - 1Cr", "1Cr+"],
  minAnnualIncome: ["Don't want to specify", "1L - 2L", "2L - 5L", "5L - 10L", "10L - 15L", "15L - 20L", "20L - 30L", "30L - 50L", "50L - 1Cr", "1Cr+"],
  familyAnnualIncome: ["Don't want to specify", "1L - 2L", "2L - 5L", "5L - 10L", "10L - 15L", "15L - 20L", "20L - 30L", "30L - 50L", "50L - 1Cr", "1Cr+"],
  rashi: [...rashiOptions, 'Other'],
  nakshatra: [...nakshatraOptions, 'Other'],
  religion: [...religionOptions, 'Other'],
  caste: [...communityOptions, 'Other'],
  motherTongue: motherTongueOptions,
  subCaste: subCasteOptions,
  gotra: gotraOptions,
  timeOfBirth: timeOfBirthOptions
};
`;

const oldValidOptionsRegex = /const VALID_OPTIONS = \{[\s\S]*?\};\n/m;
content = content.replace(oldValidOptionsRegex, validationOptions);

const oldValidationLogic = `      } else if (VALID_OPTIONS[key] && value) {
        if (!VALID_OPTIONS[key].includes(value)) {
          newErrors[key] = "⚠️ Invalid option selected";
        }
      }`;

const newValidationLogic = `      } else if (VALID_OPTIONS[key] && value) {
        // If it's a field with "Other" input, skip strict dropdown validation if they chose "Other" and typed something custom
        const isCustomField = ['rashi', 'nakshatra', 'religion', 'caste', 'subCaste', 'gotra', 'motherTongue'].includes(key);
        if (isCustomField && showOtherInput[key]) {
          // let it pass, it's a custom text input
        } else if (key === 'height') {
          // height is dynamic based on array mapping
        } else if (!VALID_OPTIONS[key].includes(value)) {
          newErrors[key] = "⚠️ Invalid option selected";
        }
      }`;

content = content.replace(oldValidationLogic, newValidationLogic);

fs.writeFileSync(profileJsxPath, content, 'utf8');
console.log('Fixed VALID_OPTIONS in MyProfile.jsx');

const servicePath = path.join(process.cwd(), '..', 'backend', 'src', 'main', 'java', 'com', 'punarmilan', 'service', 'impl', 'ProfileServiceImpl.java');
let backendContent = fs.readFileSync(servicePath, 'utf8');

const newBackendLists = `
    private static final java.util.List<String> VALID_BLOOD_GROUPS = java.util.List.of("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-");
    private static final java.util.List<String> VALID_MARITAL_STATUS = java.util.List.of("Never Married", "Divorced", "Widowed", "Awaiting Divorce", "Annulled");
    private static final java.util.List<String> VALID_DIET = java.util.List.of("Veg", "Non-Veg", "Occasionally Non-Veg", "Eggetarian", "Jain", "Vegan");
    private static final java.util.List<String> VALID_SMOKING = java.util.List.of("Non-Smoker", "Light / Social Smoker", "Regular Smoker");
    private static final java.util.List<String> VALID_DRINKING = java.util.List.of("Non-Drinker", "Light / Social Drinker", "Regular Drinker");
    private static final java.util.List<String> VALID_HEALTH_INFO = java.util.List.of("No Health Problems", "Minor Health Issues", "Major Health Issues");
    private static final java.util.List<String> VALID_DISABILITY = java.util.List.of("None", "Physical Disability");
    private static final java.util.List<String> VALID_RESIDENCY_STATUS = java.util.List.of("Citizen", "Permanent Resident", "Work Permit", "Student Visa", "Temporary Visa");
    private static final java.util.List<String> VALID_MANGLIK_STATUS = java.util.List.of("YES", "NO", "DONT_KNOW");
    
    // Add missing options
    private static final java.util.List<String> VALID_PROFILE_CREATED_BY = java.util.List.of("Self", "Parent", "Sibling", "Friend", "Other");
    private static final java.util.List<String> VALID_PROFILE_MANAGED_BY = java.util.List.of("Self", "Parent", "Sibling", "Friend", "Relative");
    private static final java.util.List<String> VALID_PROFESSION_AREA = java.util.List.of("IT/Software", "Medical", "Finance", "Engineering", "Teaching", "Business", "Marketing", "Civil Services", "Defense", "Arts", "Other");
    private static final java.util.List<String> VALID_WORKING_WITH = java.util.List.of("Private Company", "Government / Public Sector", "Defense / Civil Services", "Business / Self Employed", "Not Working");
    private static final java.util.List<String> VALID_VISIBILITY = java.util.List.of("ALL_MEMBERS", "CONTACTED_AND_ACCEPTED", "PREMIUM_MEMBERS", "MATCHES", "Public", "Members", "Premium");
    private static final java.util.List<String> VALID_INCOME = java.util.List.of("Don't want to specify", "1L - 2L", "2L - 5L", "5L - 10L", "10L - 15L", "15L - 20L", "20L - 30L", "30L - 50L", "50L - 1Cr", "1Cr+");
    
    // Note: Rashi, Nakshatra, Religion, Caste, Subcaste, Gotra, MotherTongue can have custom "Other" values typed in by the user.
    // So we shouldn't strictly block them if they don't match the list.
`;

const oldBackendListsRegex = /    private static final java\.util\.List<String> VALID_BLOOD_GROUPS[\s\S]*?VALID_MOTHER_TONGUE.*?;\n/m;
backendContent = backendContent.replace(oldBackendListsRegex, newBackendLists);

const oldSmoking = /else if \("smokingHabit"\.equals\(key\)\) \{[\s\S]*?VALID_HABITS[\s\S]*?\}/m;
backendContent = backendContent.replace(oldSmoking, `else if ("smokingHabit".equals(key)) {
                String val = (String) value;
                if (val != null && !VALID_SMOKING.contains(val)) throw new IllegalArgumentException("Invalid smoking habit");
                profile.setSmokingHabit(val);
            }`);

const oldDrinking = /else if \("drinkingHabit"\.equals\(key\)\) \{[\s\S]*?VALID_HABITS[\s\S]*?\}/m;
backendContent = backendContent.replace(oldDrinking, `else if ("drinkingHabit".equals(key)) {
                String val = (String) value;
                if (val != null && !VALID_DRINKING.contains(val)) throw new IllegalArgumentException("Invalid drinking habit");
                profile.setDrinkingHabit(val);
            }`);

const oldRashi = /else if \("rashi"\.equals\(key\)\) \{[\s\S]*?VALID_RASHI[\s\S]*?\}/m;
backendContent = backendContent.replace(oldRashi, `else if ("rashi".equals(key)) {
                String val = (String) value;
                profile.setRashi(val);
            }`);
const oldNak = /else if \("nakshatra"\.equals\(key\)\) \{[\s\S]*?VALID_NAKSHATRA[\s\S]*?\}/m;
backendContent = backendContent.replace(oldNak, `else if ("nakshatra".equals(key)) {
                String val = (String) value;
                profile.setNakshatra(val);
            }`);
const oldMotherTongue = /else if \("motherTongue"\.equals\(key\)\) \{[\s\S]*?VALID_MOTHER_TONGUE[\s\S]*?\}/m;
backendContent = backendContent.replace(oldMotherTongue, `else if ("motherTongue".equals(key)) {
                String val = (String) value;
                profile.setMotherTongue(val);
            }`);

const oldRel = /else if \("religion"\.equals\(key\)\) \{[\s\S]*?VALID_RELIGIONS[\s\S]*?profile\.setReligion\(rel\);\s*\}/m;
backendContent = backendContent.replace(oldRel, `else if ("religion".equals(key)) {
                String rel = (String) value;
                profile.setReligion(rel);
            }`);

const oldCaste = /else if \("caste"\.equals\(key\)\) \{[\s\S]*?VALID_COMMUNITIES[\s\S]*?profile\.setCaste\(c\);\s*\}/m;
backendContent = backendContent.replace(oldCaste, `else if ("caste".equals(key)) {
                String c = (String) value;
                profile.setCaste(c);
            }`);

fs.writeFileSync(servicePath, backendContent, 'utf8');
console.log('Fixed VALID_OPTIONS in backend ProfileServiceImpl.java');
