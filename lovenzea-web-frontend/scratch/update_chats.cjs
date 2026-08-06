const fs = require('fs');
const path = 'e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/myshadi/chats/ChatsPage.jsx';
let content = fs.readFileSync(path, 'utf8');

// Remove from main div
content = content.replace(
    /className="w-full min-h-\[calc\(100vh-140px\)\] bg-transparent flex flex-col font-sans pb-8" style={{ backgroundImage: `url\(\$\{bannerBg\}\)`, backgroundSize: "cover", backgroundPosition: "center" }}/,
    'className="w-full min-h-[calc(100vh-140px)] bg-transparent flex flex-col font-sans pb-8"'
);

// Add to inner div with blur and opacity
content = content.replace(
    /(<div className="bg-white\/80 backdrop-blur-md border border-white rounded-\[28px\] p-6 md:px-8 shadow-\[0_8px_30px_rgb\(0,0,0,0.04\)\] mb-8 relative overflow-hidden mt-3 h-\[140px\] flex flex-col justify-center">)/,
    `$1\n              {/* Blurred Background Overlay */}\n              <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: \`url(\${bannerBg})\`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(4px)", opacity: 0.5 }}></div>`
);

fs.writeFileSync(path, content);
console.log('Updated ChatsPage.jsx');
