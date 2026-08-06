const fs = require('fs');

const filesToUpdate = [
    'src/components/Footer.jsx',
    'src/components/AuthenticatedFooter.jsx'
];

filesToUpdate.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;

        // 1. Reduce padding (size) of the footer by ~10-20%
        // Change py-16 to py-12 or py-14
        if (content.includes('py-16')) {
            content = content.replace(/py-16/g, 'py-12');
            updated = true;
        }

        // 2. Change text-slate-800 to text-white for LOVEN text
        if (content.includes('text-slate-800')) {
            content = content.replace(/text-slate-800/g, 'text-white');
            updated = true;
        }
        
        if (content.includes('text-slate-900')) { // Just in case some places use 900
            content = content.replace(/text-slate-900/g, 'text-white');
            updated = true;
        }

        // 3. Reduce text size of LOVENZEA
        if (content.includes('text-2xl sm:text-3xl font-black tracking-tighter')) {
            content = content.replace(/text-2xl sm:text-3xl font-black tracking-tighter/g, 'text-xl sm:text-2xl font-black tracking-tighter');
            updated = true;
        }

        if (updated) {
            fs.writeFileSync(filePath, content);
            console.log(`Successfully updated ${filePath}`);
        } else {
            console.log(`No changes made to ${filePath}`);
        }
    } catch (e) {
        console.error(`Error processing ${filePath}:`, e.message);
    }
});
