const fs = require('fs');
const path = 'src/pages/myshadi/matches/PremiumMatchDashboard.jsx';

let content = fs.readFileSync(path, 'utf8');

// 1. Import bannerBg
if (!content.includes('import bannerBg')) {
    content = content.replace(
        "import React",
        "import React"
    ).replace(
        "import { motion } from 'framer-motion';",
        "import { motion } from 'framer-motion';\nimport bannerBg from '../../../assets/image/banner-bg.png';"
    );
}

// 2. Apply background image to banner
content = content.replace(
    'className="relative w-full rounded-[20px] overflow-hidden dashboard-card-bg shadow-sm mb-4 flex flex-col md:flex-row items-center px-6 py-3 border border-white/50"',
    'className="relative w-full rounded-[20px] overflow-hidden shadow-sm mb-4 flex flex-col md:flex-row items-center px-6 py-3 border border-[#f1d8d1]"\n                    style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: "cover", backgroundPosition: "center" }}'
);

// 3. Fix button colors
content = content.replace(
    'className="px-5 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-bold rounded-full shadow-md transition-colors flex items-center gap-2"',
    'className="px-5 py-1.5 bg-gradient-to-r from-[#ef7f8f] to-[#c93f65] hover:from-[#df5f78] hover:to-[#b83f5d] text-white text-xs font-bold rounded-full shadow-[0_4px_10px_rgba(201,63,101,0.2)] hover:shadow-[0_6px_15px_rgba(201,63,101,0.3)] hover:-translate-y-0.5 transition-all flex items-center gap-2"'
);

content = content.replace(
    'className="px-5 py-1.5 bg-theme-surface border border-pink-200 hover:bg-pink-50 text-pink-600 text-xs font-bold rounded-full transition-colors flex items-center gap-2 shadow-sm"',
    'className="px-5 py-1.5 bg-white border border-[#ef7f8f] hover:bg-[#fff1ed] text-[#c93f65] text-xs font-bold rounded-full transition-colors flex items-center gap-2 shadow-sm"'
);

fs.writeFileSync(path, content);
console.log('Fixed PremiumMatchDashboard');
