const fs = require('fs');

const footers = ['src/components/Footer.jsx', 'src/components/AuthenticatedFooter.jsx'];

const footerNewLogo = `<img src={projectLogo} alt="LovenZea Logo" className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1rem] shadow-[0_4px_15px_rgba(255,45,122,0.3)] border border-pink-200/50 object-cover" />\n                              <h2 className="text-3xl font-black tracking-wider flex items-center ml-1">\n                                  LOVEN<span className="bg-gradient-to-r from-[#ff2d7a] to-rose-500 bg-clip-text text-transparent">ZEA</span>\n                              </h2>`;

footers.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('import projectLogo')) {
        content = content.replace(
            "import React",
            "import React\nimport projectLogo from '../assets/image/lovenzea-logo.jpg';"
        ).replace("import React\nimport projectLogo", "import React from 'react';\nimport projectLogo"); // simple hack
    }
    
    // Using regex to replace the specific block
    content = content.replace(
        /<div className="w-11 h-11 rounded-xl bg-gradient-to-br from-\[#ff2d7a\][\s\S]*?<\/h2>/m,
        footerNewLogo
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
});
