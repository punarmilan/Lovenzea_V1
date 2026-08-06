const fs = require('fs');

let path = 'e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/myshadi/dashboard/Dashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add import
if (!content.includes('bannerBg')) {
    content = content.replace(/import React, \{ useState \} from 'react'/, "import React, { useState } from 'react'\nimport bannerBg from '../../../assets/image/banner-bg.png';");
}

// 2. Namaste Banner
// The current code has a div with "overflow-hidden relative mb-6 dashboard-card-bg..."
// Then inside it, it has "Blurred Background Overlay"
const overlayRegex = /\{\/\* Blurred Background Overlay \*\/\}\s*<div className="absolute inset-0 z-0 pointer-events-none"[^>]*><\/div>/;
content = content.replace(overlayRegex, '');

// Now add the style to the container itself
content = content.replace(
    /<div className="overflow-hidden relative mb-6 dashboard-card-bg p-4 sm:p-5 hover:-translate-y-1 transition-all duration-300"(?! style)/,
    '<div className="overflow-hidden relative mb-6 dashboard-card-bg p-4 sm:p-5 hover:-translate-y-1 transition-all duration-300" style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: "cover", backgroundPosition: "center" }}'
);

fs.writeFileSync(path, content);
console.log('Fixed Dashboard');
