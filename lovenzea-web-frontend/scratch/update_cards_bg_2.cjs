const fs = require('fs');

function applyBannerBg(filePath, titlePattern) {
    if (!fs.existsSync(filePath)) {
        console.log('File not found:', filePath);
        return;
    }
    let content = fs.readFileSync(filePath, 'utf8');

    // Add import if not present
    if (!content.includes('bannerBg')) {
        let importPath = "../../../assets/image/banner-bg.png";
        if (filePath.includes('payment/Payment.jsx')) {
             importPath = "../../assets/image/banner-bg.png";
        }
        content = content.replace(/import .*?;\n/, match => match + `import bannerBg from '${importPath}';\n`);
    }

    // Find the header card div
    // We look for a <div ...> that contains the titlePattern in its <h1>, <h2> or <h3>
    const regex = new RegExp(`(<div className="[^"]+"(?!\\s*style)[\\s\\S]*?<h[123][^>]*>[\\s\\S]*?${titlePattern}[\\s\\S]*?<\\/h[123]>)`, 'i');
    
    content = content.replace(regex, (match) => {
        // Add style to the first <div ...> in the match
        return match.replace(/<div className="([^"]+)"/, '<div className="$1" style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: "cover", backgroundPosition: "center" }}');
    });

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
}

// 4. Upgrade Now
applyBannerBg('e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/payment/Payment.jsx', 'Upgrade now');

// 5. Settings Hub
applyBannerBg('e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/myshadi/setting/Setting.jsx', 'Settings Hub');
