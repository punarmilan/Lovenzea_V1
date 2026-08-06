
const names = [
    "Priya Sharma", "Anjali Gupta", "Sneha Patel", "Riya Singh", "Kavita Reddy",
    "Meera Joshi", "Divya Desai", "Neha Verma", "Pooja Malhotra", "Roshni Mehta",
    "Sanjana Kapoor", "Tanvi Rao", "Ishita Nair", "Aditi Agarwal", "Kriti Saxena",
    "Nisha Pandey", "Swati Kulkarni", "Aishwarya Iyer", "Shruti Choudhary", "Varsha Hegde",
    "Nikita Deshmukh", "Amruta Patil", "Pallavi Shinde", "Sonal Kadam", "Ashwini More"
];

const images = [
    "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?q=80&w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1597466765990-64ad1c35dafc?q=80&w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514315384763-ba401779410f?q=80&w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1589156206699-dec21e656842?q=80&w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1589156280359-27697a8c391d?q=80&w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1617922001439-4a2e65df1fb3?q=80&w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1631526673177-18451f2f8113?q=80&w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1616683914524-405cc585062a?q=80&w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620661618242-a841263884cf?q=80&w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?q=80&w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1601233089609-b64d1f215ac5?q=80&w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1619323147817-de7525350320?q=80&w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?q=80&w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1596728321064-3235930332ef?q=80&w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618485233267-275d2729a569?q=80&w=400&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611603221082-8438181653ff?q=80&w=400&h=600&auto=format&fit=crop"
];

const religions = ["Hindu", "Muslim", "Christian", "Sikh", "Jain"];
const castes = ["Maratha", "Brahmin", "Kshatriya", "Vaishya", "Patel"];
const occupations = ["Software Engineer", "Teacher", "Doctor", "Business Owner", "Lecturer", "Designer"];
const locations = ["Mumbai, Maharashtra", "Pune, Maharashtra", "Nagpur, Maharashtra", "Nashik, Maharashtra", "Aurangabad, Maharashtra"];

export const getProfileById = (id) => {
    if (!id) return null;

    const parts = id.split('-');
    const type = parts[0] || 'new';
    const index = parseInt(parts[1]) - 1 || 0;

    // Use a composite seed for the name/image selection
    const seed = index + (type.charCodeAt(0) * 10);

    const name = names[seed % names.length];
    const img = images[seed % images.length];
    const religion = religions[index % religions.length];
    const caste = castes[index % castes.length];
    const profession = occupations[index % occupations.length];
    const location = locations[index % locations.length];

    let ageBase = 22;
    if (type === 'today') ageBase = 25;
    if (type === 'near') ageBase = 23;
    if (type === 'more') ageBase = 27;

    return {
        id: id,
        rawId: id,
        name,
        age: ageBase + (index % 6),
        height: `5' ${2 + (index % 8)}"`,
        religion,
        caste: religion === 'Hindu' ? `${caste}` : religion,
        motherTongue: "Marathi",
        location,
        country: "India",
        education: index % 2 === 0 ? "Masters in Arts" : "B.Tech / B.E.",
        profession,
        income: "Earns INR 4 Lakh to 7 Lakh annually",
        maritalStatus: "Never Married",
        managedBy: "Self",
        posted: type === 'new' ? "Joined 2 hours ago" : (type === 'today' ? "Posted Today" : "27 Jan 2025"),
        online: "14h ago",
        img,
        about: `Thanks for visiting my profile. In terms of education, I have completed my studies. I am backed with a strong academic background. At present, I am working professionally. I am a blend of consistency and hard work. I am seeking a simple and loving partner who will support me in every phase of life. Thank you for your time.`,
        diet: "Vegetarian",
        isPremium: index % 3 === 0,
        online: index % 2 === 0,
        family: {
            status: "Middle Class",
            type: "Joint",
            values: "Moderate"
        },
        preferences: {
            age: `22 to 28`,
            height: "5' 0\" to 6' 2\"",
            maritalStatus: 'Never Married',
            religion: religion + ": Marathi",
            community: "Hindu: 96 Kuli Maratha",
            motherTongue: "Marathi",
            country: "India",
            state: "Maharashtra",
            income: "INR 2 lakhs to 10 lakhs"
        }
    };
};

// Helper to format name based on visibility
export const formatDisplayName = (fullName, visibility, profileId) => {
    if (!fullName) return 'Member';
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';

    // Handle backend legacy values or direct enum values
    const normalizedVisibility = visibility === 'show-all' ? 'SHOW_FULL' : visibility;

    switch (normalizedVisibility) {
        case 'HIDE_LAST':
            return `${firstName} ${lastName ? lastName.charAt(0) : ''}`.trim();
        case 'HIDE_FIRST':
            return `${firstName ? firstName.charAt(0) : ''} ${lastName}`.trim();
        case 'HIDE_FULL':
            return profileId || 'Member';
        case 'SHOW_FULL':
            return fullName;
        default:
            return fullName;
    }
};

export const generateProfiles = (count, type) => {
    return Array.from({ length: count }, (_, i) => getProfileById(`${type}-${i + 1}`));
};
