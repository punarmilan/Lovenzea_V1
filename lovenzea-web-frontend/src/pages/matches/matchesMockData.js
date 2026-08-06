
const names = [
    "Priya Sharma", "Anjali Gupta", "Sneha Patel", "Riya Singh", "Kavita Reddy",
    "Meera Joshi", "Divya Desai", "Neha Verma", "Pooja Malhotra", "Roshni Mehta",
    "Sanjana Kapoor", "Tanvi Rao", "Ishita Nair", "Aditi Agarwal", "Kriti Saxena",
    "Nisha Pandey", "Swati Kulkarni", "Aishwarya Iyer", "Shruti Choudhary", "Varsha Hegde",
    "Nikita Deshmukh", "Amruta Patil", "Pallavi Shinde", "Sonal Kadam", "Ashwini More"
];

const images = [
    "https://images.unsplash.com/photo-1628153403212-be0072b2512f?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1622325325590-50d4d805090f?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1594916328329-a1b6ac164047?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1598550880863-4e8aa3d0edb4?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1616002411355-495288961561?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1621570169561-0c2a2e193ee1?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1588611910606-c80cc5538e1b?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1618288874139-497805178344?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1583391733958-37d45e3c7901?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1601288496920-b6154fe41873?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1593345472288-06d2c488053a?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1506544974012-706509426952?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1552699609-89958742880c?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1512411545632-132d75a6c0e5?w=400&auto=format&fit=crop&q=60"
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
        phone: `91${9876500000 + index}`, // Deterministic 12 digit phone number
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

export const generateProfiles = (count, type) => {
    return Array.from({ length: count }, (_, i) => getProfileById(`${type}-${i + 1}`));
};
