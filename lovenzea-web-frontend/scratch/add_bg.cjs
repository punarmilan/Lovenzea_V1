const fs = require('fs');
const path = 'e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/myshadi/dashboard/Dashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('bannerBg')) {
    content = content.replace(/import .*?;\n/, match => match + "import bannerBg from '../../../assets/image/banner-bg.png';\n");
}

// 1. Namaste section
content = content.replace(
    /<div className="mb-6 dashboard-card-bg p-4 sm:p-5 hover:-translate-y-1 transition-all duration-300">/,
    '<div className="mb-6 dashboard-card-bg p-4 sm:p-5 hover:-translate-y-1 transition-all duration-300" style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: "cover", backgroundPosition: "center" }}>'
);

// 2. My Interests
content = content.replace(
    /(<div[^>]*>[\s\S]*?<h3[^>]*>.*?My Interests.*?<\/h3>)/,
    (match) => {
        if (!match.includes('bannerBg')) {
            return match.replace(/<div className="dashboard-card-bg[^"]*"/, '$& style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: "cover", backgroundPosition: "center" }}');
        }
        return match;
    }
);

// 3. Messages
content = content.replace(
    /(<div[^>]*>[\s\S]*?<h3[^>]*>.*?Messages.*?<\/h3>)/,
    (match) => {
        if (!match.includes('bannerBg')) {
            return match.replace(/<div className="dashboard-card-bg[^"]*"/, '$& style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: "cover", backgroundPosition: "center" }}');
        }
        return match;
    }
);

// 4. Settings Hub
content = content.replace(
    /(<div[^>]*>[\s\S]*?<h3[^>]*>.*?Settings Hub.*?<\/h3>)/,
    (match) => {
        if (!match.includes('bannerBg')) {
            return match.replace(/<div className="dashboard-card-bg[^"]*"/, '$& style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: "cover", backgroundPosition: "center" }}');
        }
        return match;
    }
);

// 5. Upgrade Now
content = content.replace(
    /(<div[^>]*>[\s\S]*?<h3[^>]*>.*?Upgrade now.*?<\/h3>)/,
    (match) => {
        if (!match.includes('bannerBg')) {
            return match.replace(/<div className="[^"]*"/, '$& style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: "cover", backgroundPosition: "center" }}');
        }
        return match;
    }
);

// 6. Find Your Perfect Match Faster
content = content.replace(
    /(<div[^>]*>[\s\S]*?<h3[^>]*>[\s\S]*?Find Your Perfect Match[\s\S]*?<\/h3>)/,
    (match) => {
        if (!match.includes('bannerBg')) {
            return match.replace(/<div className="[^"]*"/, '$& style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: "cover", backgroundPosition: "center" }}');
        }
        return match;
    }
);

fs.writeFileSync(path, content);
console.log('Added background images');
