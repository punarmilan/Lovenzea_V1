const fs = require('fs');

// Headers.jsx
let headersPath = 'src/components/Headers.jsx';
let headersContent = fs.readFileSync(headersPath, 'utf8');

if (!headersContent.includes('import projectLogo')) {
    headersContent = headersContent.replace(
        "import React",
        "import React, { useState } from 'react';\nimport projectLogo from '../assets/image/lovenzea-logo.jpg';"
    );
}

const headerOldLogo = `<div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#d94f73] \r
to-orange-400 flex items-center justify-center text-white shadow-md shadow-[#d94f73]/25">\r
                                  <HiHeart className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-current" />\r
                              </div>\r
                              <span className="text-xl sm:text-2xl font-black tracking-tighter flex items-center">\r
                                  <span className="text-slate-900 drop-shadow-sm">Punar</span>\r
                                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d94f73] \r
to-rose-400">Milan</span>\r
                              </span>`;

const headerOldLogoWindows = headerOldLogo.replace(/\r\n/g, '\n');
const headersFixed = headersContent.replace(/\r\n/g, '\n');

const headerNewLogo = `<img src={projectLogo} alt="LovenZea Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-[1rem] shadow-[0_4px_15px_rgba(217,79,115,0.3)] border border-rose-100 object-cover" />\n                              <span className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900 drop-shadow-sm flex items-center ml-1">Loven<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d94f73] to-rose-400">Zea</span></span>`;

let newHeadersContent = headersFixed.replace(
    /<div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-\[#d94f73\][\s\S]*?<\/span>/m,
    headerNewLogo
);

fs.writeFileSync(headersPath, newHeadersContent);
console.log('Updated Headers.jsx');
