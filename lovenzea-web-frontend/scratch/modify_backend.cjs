const fs = require('fs');
const path = require('path');

const servicePath = path.join(process.cwd(), '..', 'backend', 'src', 'main', 'java', 'com', 'punarmilan', 'service', 'impl', 'ProfileServiceImpl.java');
let content = fs.readFileSync(servicePath, 'utf8');

const validationLists = `
    private static final java.util.List<String> VALID_BLOOD_GROUPS = java.util.List.of("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-");
    private static final java.util.List<String> VALID_MARITAL_STATUS = java.util.List.of("Never Married", "Divorced", "Widowed", "Awaiting Divorce", "Annulled");
    private static final java.util.List<String> VALID_DIET = java.util.List.of("Veg", "Non-Veg", "Eggetarian", "Vegan");
    private static final java.util.List<String> VALID_HABITS = java.util.List.of("No", "Occasionally", "Yes");
    private static final java.util.List<String> VALID_HEALTH_INFO = java.util.List.of("No Health Issues", "Physical Disability", "Mental Disability", "HIV Positive", "Other");
    private static final java.util.List<String> VALID_RESIDENCY_STATUS = java.util.List.of("Citizen", "Permanent Resident", "Work Permit", "Student Visa", "Temporary Visa");
    private static final java.util.List<String> VALID_MANGLIK_STATUS = java.util.List.of("Manglik", "Non-Manglik", "Anshik Manglik", "Don't Know");
    private static final java.util.List<String> VALID_RASHI = java.util.List.of("Mesh (Aries)", "Vrishabh (Taurus)", "Mithun (Gemini)", "Kark (Cancer)", "Sinh (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchik (Scorpio)", "Dhanu (Sagittarius)", "Makar (Capricorn)", "Kumbh (Aquarius)", "Meen (Pisces)");
    private static final java.util.List<String> VALID_NAKSHATRA = java.util.List.of("Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Moola", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati");
    private static final java.util.List<String> VALID_RELIGIONS = java.util.List.of("Hindu", "Sikh", "Christian", "Muslim", "Parsi", "Jain", "Buddhist", "Jewish", "No Religion", "Spiritual - not religious");
    private static final java.util.List<String> VALID_COMMUNITIES = java.util.List.of("Maratha", "Brahmin", "Kunbi", "Agri", "Banjara", "Chambhar", "Dhangar", "Gond", "Koli", "Mahar", "Mali", "Matang", "Nomadic Tribes", "Paradhi", "Vanjari");
    private static final java.util.List<String> VALID_MOTHER_TONGUE = java.util.List.of("Punjabi", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali", "Oriya", "Urdu", "English", "Other");
`;

// Insert after the class definition
content = content.replace(
    'public class ProfileServiceImpl implements ProfileService {',
    'public class ProfileServiceImpl implements ProfileService {\n' + validationLists
);

const oldElseBlock = `            } else {
                try {
                    Field field = Profile.class.getDeclaredField(key);`;

const newElseBlock = `            } else if ("bloodGroup".equals(key)) {
                String val = (String) value;
                if (val != null && !VALID_BLOOD_GROUPS.contains(val)) throw new IllegalArgumentException("Invalid blood group");
                profile.setBloodGroup(val);
            } else if ("maritalStatus".equals(key)) {
                String val = (String) value;
                if (val != null && !VALID_MARITAL_STATUS.contains(val)) throw new IllegalArgumentException("Invalid marital status");
                profile.setMaritalStatus(val);
            } else if ("diet".equals(key)) {
                String val = (String) value;
                if (val != null && !VALID_DIET.contains(val)) throw new IllegalArgumentException("Invalid diet");
                profile.setDiet(val);
            } else if ("smokingHabit".equals(key)) {
                String val = (String) value;
                if (val != null && !VALID_HABITS.contains(val)) throw new IllegalArgumentException("Invalid smoking habit");
                profile.setSmokingHabit(val);
            } else if ("drinkingHabit".equals(key)) {
                String val = (String) value;
                if (val != null && !VALID_HABITS.contains(val)) throw new IllegalArgumentException("Invalid drinking habit");
                profile.setDrinkingHabit(val);
            } else if ("healthInformation".equals(key)) {
                String val = (String) value;
                if (val != null && !VALID_HEALTH_INFO.contains(val)) throw new IllegalArgumentException("Invalid health information");
                profile.setHealthInformation(val);
            } else if ("residencyStatus".equals(key)) {
                String val = (String) value;
                if (val != null && !VALID_RESIDENCY_STATUS.contains(val)) throw new IllegalArgumentException("Invalid residency status");
                profile.setResidencyStatus(val);
            } else if ("manglikStatus".equals(key)) {
                String val = (String) value;
                if (val != null && !VALID_MANGLIK_STATUS.contains(val)) throw new IllegalArgumentException("Invalid manglik status");
                profile.setManglikStatus(val);
            } else if ("rashi".equals(key)) {
                String val = (String) value;
                if (val != null && !VALID_RASHI.contains(val)) throw new IllegalArgumentException("Invalid rashi");
                profile.setRashi(val);
            } else if ("nakshatra".equals(key)) {
                String val = (String) value;
                if (val != null && !VALID_NAKSHATRA.contains(val)) throw new IllegalArgumentException("Invalid nakshatra");
                profile.setNakshatra(val);
            } else if ("motherTongue".equals(key)) {
                String val = (String) value;
                if (val != null && !VALID_MOTHER_TONGUE.contains(val)) throw new IllegalArgumentException("Invalid mother tongue");
                profile.setMotherTongue(val);
            } else {
                try {
                    Field field = Profile.class.getDeclaredField(key);`;

content = content.replace(oldElseBlock, newElseBlock);

const oldReligionBlock = `            } else if ("religion".equals(key)) {
                String rel = (String) value;
                if (rel != null && !rel.matches("^[a-zA-Z\\\\s]*$")) {
                    throw new IllegalArgumentException("Religion should only contain alphabets");
                }
                profile.setReligion(rel);`;

const newReligionBlock = `            } else if ("religion".equals(key)) {
                String rel = (String) value;
                if (rel != null && !VALID_RELIGIONS.contains(rel)) {
                    throw new IllegalArgumentException("Invalid religion");
                }
                profile.setReligion(rel);`;

content = content.replace(oldReligionBlock, newReligionBlock);

const oldCasteBlock = `            } else if ("caste".equals(key)) {
                String c = (String) value;
                if (c != null && !c.matches("^[a-zA-Z\\\\s]*$")) {
                    throw new IllegalArgumentException("Community should only contain alphabets");
                }
                profile.setCaste(c);`;

const newCasteBlock = `            } else if ("caste".equals(key)) {
                String c = (String) value;
                if (c != null && !VALID_COMMUNITIES.contains(c)) {
                    throw new IllegalArgumentException("Invalid community");
                }
                profile.setCaste(c);`;

content = content.replace(oldCasteBlock, newCasteBlock);

fs.writeFileSync(servicePath, content, 'utf8');
console.log('Modified ProfileServiceImpl.java');
