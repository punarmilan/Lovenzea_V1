const fs = require('fs');

let navPath = 'src/components/Navbar.jsx';
let navContent = fs.readFileSync(navPath, 'utf8');

if (!navContent.includes('import projectLogo')) {
    navContent = navContent.replace(
        "import React",
        "import React\nimport projectLogo from '../assets/image/lovenzea-logo.jpg';"
    );
}

const navOldLogoRegex = /<div className="text-2xl font-bold bg-gradient-to-r from-white to-\[#FCFAF7\] bg-clip-text \s*text-transparent font-serif">\s*LovenZea\s*<\/div>/m;

const navNewLogo = `<img src={projectLogo} alt="LovenZea Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-[1rem] shadow-[0_4px_15px_rgba(255,255,255,0.3)] border border-white/50 object-cover" />\n                          <div className="text-2xl font-bold bg-gradient-to-r from-white to-[#FCFAF7] bg-clip-text text-transparent font-serif ml-1">\n                              LovenZea\n                          </div>`;

navContent = navContent.replace(navOldLogoRegex, navNewLogo);

fs.writeFileSync(navPath, navContent);
console.log('Updated Navbar.jsx');
