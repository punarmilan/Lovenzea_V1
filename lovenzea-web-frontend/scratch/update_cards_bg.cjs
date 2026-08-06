const fs = require('fs');

function applyBannerBg(filePath, titlePattern) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Add import if not present
    if (!content.includes('bannerBg')) {
        content = content.replace(/import .*?;\n/, match => match + "import bannerBg from '../../../assets/image/banner-bg.png';\n");
    }

    // Find the header card div
    // We look for a <div ...> that contains the titlePattern in its <h1> or <h3>
    const regex = new RegExp(`(<div className="[^"]+"(?!\\s*style)[\\s\\S]*?<h[13][^>]*>[\\s\\S]*?${titlePattern}[\\s\\S]*?<\\/h[13]>)`, 'i');
    
    content = content.replace(regex, (match) => {
        // Add style to the first <div ...> in the match
        return match.replace(/<div className="([^"]+)"/, '<div className="$1" style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: "cover", backgroundPosition: "center" }}');
    });

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
}

// 1. Dashboard: "Find Your Perfect Match"
const dashPath = 'e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/myshadi/dashboard/Dashboard.jsx';
let dashContent = fs.readFileSync(dashPath, 'utf8');
const dashRegex = /(<div className="bg-gradient-to-br from-\[#FDFBF7\] to-\[#FAF8F5\][^>]+>)([\s\S]*?<h3[^>]*>[\s\S]*?Find Your Perfect Match)/;
dashContent = dashContent.replace(dashRegex, (match, p1, p2) => {
    if (!p1.includes('style=')) {
        return p1.replace('>', ' style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: "cover", backgroundPosition: "center" }}>') + p2;
    }
    return match;
});
fs.writeFileSync(dashPath, dashContent);
console.log('Updated Find Your Perfect Match in Dashboard');

// 2. Interests
applyBannerBg('e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/myshadi/interests/InterestsPage.jsx', 'My Interests');

// 3. Messages
applyBannerBg('e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/myshadi/chats/ChatsPage.jsx', 'Messages');

// 4. Upgrade Now
applyBannerBg('e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/myshadi/payment/PaymentOptions.jsx', 'Upgrade now');

// 5. Settings Hub
applyBannerBg('e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/myshadi/settings/SettingsPage.jsx', 'Settings Hub');

