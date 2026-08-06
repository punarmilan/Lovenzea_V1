const fs = require('fs');

function applyBgAndRemoveBlur(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove the blurred background overlay
    content = content.replace(/\s*\{\/\*\s*Blurred Background Overlay\s*\*\/\}\s*<div className="absolute inset-0 z-0 pointer-events-none"[^>]*><\/div>/g, '');
    
    if (filePath.includes('Payment.jsx')) {
        content = content.replace(
            /(<div className="[^"]*dashboard-card-bg[^"]* border border-white\/50 pt-8 pb-24 md:pb-28 px-4 rounded-b-3xl md:rounded-3xl shadow-sm"[^>]*?)(\s*style=\{[^\}]*\})?([^>]*>)/g,
            (match, p1, p2, p3) => p1 + ' style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: "cover", backgroundPosition: "center" }}' + p3
        );
    } else if (filePath.includes('Setting.jsx')) {
        content = content.replace(
            /(<div className="[^"]*dashboard-card-bg[^"]* rounded-\[32px\] border border-white\/70 dashboard-card-bg shadow-\[0_22px_70px_rgba\(190,24,93,0\.06\)\]"[^>]*?)(\s*style=\{[^\}]*\})?([^>]*>)/g,
            (match, p1, p2, p3) => p1 + ' style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: "cover", backgroundPosition: "center" }}' + p3
        );
        // Fallback for Setting.jsx if the class string was modified slightly:
        content = content.replace(
            /(<div className="[^"]*rounded-\[32px\] border border-white\/70 dashboard-card-bg shadow-\[0_22px_70px_rgba\(190,24,93,0\.06\)\]"[^>]*?)(\s*style=\{[^\}]*\})?([^>]*>)/g,
            (match, p1, p2, p3) => p1 + ' style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: "cover", backgroundPosition: "center" }}' + p3
        );
    }
    
    fs.writeFileSync(filePath, content);
}

applyBgAndRemoveBlur('e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/payment/Payment.jsx');
applyBgAndRemoveBlur('e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/myshadi/setting/Setting.jsx');

console.log('Fixed Payment and Setting background');
