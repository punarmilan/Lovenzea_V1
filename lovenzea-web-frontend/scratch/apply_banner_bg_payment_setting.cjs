const fs = require('fs');

function applyBg(filePath, titlePattern) {
    let content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('bannerBg')) {
        // Find first import and insert after it
        content = content.replace(/import .*?;\n/, match => match + "import bannerBg from '../../../assets/image/banner-bg.png';\n");
        // For Payment.jsx, path is ../../
        if (filePath.includes('Payment.jsx')) {
            content = content.replace(/import bannerBg from '\.\.\/\.\.\/\.\.\/assets\/image\/banner-bg\.png';/, "import bannerBg from '../../assets/image/banner-bg.png';");
        }
    }

    if (filePath.includes('Payment.jsx')) {
        content = content.replace(
            /<div className="dashboard-card-bg border border-white\/50 pt-8 pb-24 md:pb-28 px-4 rounded-b-3xl md:rounded-3xl shadow-sm"(?! style)/,
            '<div className="dashboard-card-bg border border-white/50 pt-8 pb-24 md:pb-28 px-4 rounded-b-3xl md:rounded-3xl shadow-sm" style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: "cover", backgroundPosition: "center" }}'
        );
    } else if (filePath.includes('Setting.jsx')) {
        content = content.replace(
            /<div className="mb-6 overflow-hidden rounded-\[32px\] border border-white\/70 dashboard-card-bg shadow-\[0_22px_70px_rgba\(190,24,93,0\.06\)\]"(?! style)/,
            '<div className="mb-6 overflow-hidden rounded-[32px] border border-white/70 dashboard-card-bg shadow-[0_22px_70px_rgba(190,24,93,0.06)]" style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: "cover", backgroundPosition: "center" }}'
        );
    }
    
    fs.writeFileSync(filePath, content);
}

applyBg('e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/payment/Payment.jsx');
applyBg('e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/myshadi/setting/Setting.jsx');

console.log('Applied bannerBg to Payment and Setting');
