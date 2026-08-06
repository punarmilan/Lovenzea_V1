const fs = require('fs');
const path = 'e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/payment/Payment.jsx';

let content = fs.readFileSync(path, 'utf8');

// 1. Remove mb-12 from Hero banner and add extra bottom padding for overlap
content = content.replace(
    /className="relative overflow-hidden rounded-\[2\.5rem\] shadow-2xl mb-12 group border border-white\/50"/,
    'className="relative overflow-hidden rounded-[2.5rem] shadow-xl mb-0 group border border-white/50"'
);

// 2. Reduce internal padding and text sizes
content = content.replace(
    /<div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">/,
    '<div className="relative z-10 pt-8 pb-28 px-6 md:pt-12 md:pb-40 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">'
);

content = content.replace(
    /text-4xl md:text-6xl font-black/,
    'text-3xl md:text-5xl font-black'
);

content = content.replace(
    /text-lg md:text-xl font-medium max-w-xl/,
    'text-base md:text-lg font-medium max-w-lg'
);

content = content.replace(
    /w-32 h-32 rounded-full bg-white\/10/,
    'w-24 h-24 rounded-full bg-white/10'
);

content = content.replace(
    /size=\{60\}/,
    'size={40}'
);

// 3. Add negative top margin to Pricing Grid to make it overlap
content = content.replace(
    /<div className="grid lg:grid-cols-3 gap-8 relative z-10 pb-16">/,
    '<div className="grid lg:grid-cols-3 gap-6 relative z-10 pb-16 px-2 md:px-8 -mt-20 md:-mt-32">'
);

fs.writeFileSync(path, content);
console.log('Reduced banner size and overlapped pricing cards');
