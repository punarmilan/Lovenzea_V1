const fs = require('fs');

const path = 'e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/myshadi/dashboard/Dashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Further reduce height:
// Padding from p-3 sm:p-4 -> py-2 px-3 sm:py-3 sm:px-4
content = content.replace(
    /className="mb-4 rounded-\[24px\] border border-\[#F2D7D9\] shadow-\[0_10px_30px_rgba\(216,154,116,0\.12\)\] p-3 sm:p-4 hover:-translate-y-1 transition-all duration-300"/,
    'className="mb-4 rounded-[20px] border border-[#F2D7D9] shadow-[0_10px_30px_rgba(216,154,116,0.12)] py-2 px-3 sm:py-2.5 sm:px-4 hover:-translate-y-1 transition-all duration-300"'
);

// Profile pic size w-20 h-20 sm:w-24 sm:h-24 -> w-16 h-16 sm:w-20 sm:h-20
content = content.replace(
    /className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-md"/,
    'className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-[3px] border-white shadow-sm"'
);

// 2. Fix Text colors (White -> #5A2332 for Name, #4A3728 for others)
// Name
content = content.replace(
    /className="text-2xl sm:text-3xl font-bold font-serif text-white"/,
    'className="text-xl sm:text-2xl font-bold font-serif text-[#5A2332]"'
);

// Profile ID text
content = content.replace(
    /className="text-sm text-white\/90 mt-1"/,
    'className="text-[13px] text-[#4A3728] mt-0.5"'
);
content = content.replace(
    /className="font-mono font-bold text-\[#FFF6F2\]"/,
    'className="font-mono font-bold text-[#5A2332]"'
);

// Logged in as
content = content.replace(
    /className="text-xs text-white\/70 mt-0\.5"/,
    'className="text-xs text-[#4A3728]/80 mt-0.5"'
);

// 3. Fix Premium Member tag (add whitespace-nowrap and ensure it's inline-flex)
content = content.replace(
    /className=\{\`inline-flex items-center justify-center px-2 py-0\.5 rounded-full text-\[10px\] tracking-wide font-semibold shadow-sm \$\{isPremium/g,
    'className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] tracking-wide font-bold shadow-sm whitespace-nowrap ${isPremium'
);

// 4. Fix Stats text
// Numbers
content = content.replace(
    /className="text-sm font-bold text-white leading-tight"/g,
    'className="text-sm font-bold text-[#5A2332] leading-tight"'
);
// Labels (Views, Received, etc)
content = content.replace(
    /className="text-\[10px\] text-white\/80 uppercase font-semibold tracking-wider"/g,
    'className="text-[10px] text-[#4A3728]/90 uppercase font-bold tracking-wider"'
);
// Icons
content = content.replace(
    /className="text-sm text-white"/g,
    'className="text-sm text-[#5A2332]"'
);

// Stats container background
content = content.replace(
    /className="bg-theme-surface\/20 backdrop-blur-sm border border-white\/30/g,
    'className="bg-white/40 backdrop-blur-sm border border-[#E88C8C]/30'
);

// 5. Fix Profile Completion text
content = content.replace(
    /className="text-xs font-semibold text-white\/90">Profile Completion<\/span>/,
    'className="text-xs font-bold text-[#4A3728]">Profile Completion</span>'
);
content = content.replace(
    /className="bg-theme-surface\/20 backdrop-blur-md w-full md:w-64 border border-white\/30 rounded-2xl p-3 flex flex-col justify-between mt-2 md:mt-0"/,
    'className="bg-white/40 backdrop-blur-md w-full md:w-64 border border-[#E88C8C]/30 rounded-2xl p-2.5 flex flex-col justify-between mt-2 md:mt-0"'
);

fs.writeFileSync(path, content);
console.log('Fixed text colors and height');
