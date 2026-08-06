const fs = require('fs');
const path = 'e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/components/ProfileAside.jsx';

let content = fs.readFileSync(path, 'utf8');

// 1. Reduce width by 10% (280px -> 250px)
content = content.replace(
    /max-w-\[280px\]/,
    'max-w-[250px]'
);

// 2. Reduce Height by reducing padding and element sizes (approx 30%)
// Profile section padding p-4 -> p-3
content = content.replace(
    /flex items-center gap-3 p-4/,
    'flex items-center gap-3 p-3'
);

// Profile picture w-[72px] h-[72px] -> w-[56px] h-[56px]
content = content.replace(
    /w-\[72px\] h-\[72px\]/,
    'w-[56px] h-[56px]'
);

// Tab Menu padding p-3 -> p-2
content = content.replace(
    /<nav className="p-3 space-y-1">/,
    '<nav className="p-2 space-y-0.5">'
);

// Tab button px-4 py-3 -> px-3 py-2
content = content.replace(
    /px-4 py-3 rounded-2xl/,
    'px-3 py-2 rounded-xl'
);
content = content.replace(
    /text-sm font-semibold/,
    'text-[13px] font-semibold'
);

// Tab Icon w-8 h-8 -> w-7 h-7
content = content.replace(
    /w-8 h-8 rounded-xl flex items-center justify-center/,
    'w-7 h-7 rounded-lg flex items-center justify-center'
);

// Tab Icon size 15 -> 14
content = content.replace(
    /size=\{15\}/g,
    'size={14}'
);

// Upgrade Plan Banner padding and margin
content = content.replace(
    /p-4 mx-4 mb-5 mt-2 rounded-2xl/,
    'p-3 mx-3 mb-3 mt-1 rounded-xl'
);
content = content.replace(
    /w-8 h-8 mx-auto mb-2 text-\[#D98C72\]/,
    'w-6 h-6 mx-auto mb-1 text-[#D98C72]'
);
content = content.replace(
    /mb-3 font-medium leading-relaxed/,
    'mb-2 font-medium leading-tight'
);
content = content.replace(
    /px-5 py-2 rounded-full/,
    'px-4 py-1.5 rounded-full'
);

fs.writeFileSync(path, content);
console.log('Reduced width and height of ProfileAside (SecondNav)');
