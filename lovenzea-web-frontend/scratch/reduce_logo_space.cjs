const fs = require('fs');

const files = [
    'src/components/Headers.jsx',
    'src/components/Navbar.jsx',
    'src/components/Footer.jsx',
    'src/components/AuthenticatedFooter.jsx',
    'src/admin/AdminLayout.jsx'
];

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        
        // 1. Remove the gap class from the flex container holding the logo
        content = content.replace(/className="flex items-center gap-2 sm:gap-3"/g, 'className="flex items-center gap-0"');
        
        // 2. Add negative margin to the LovenZea text span to pull it closer
        // The text span in Headers, Navbar, AdminLayout starts with text-2xl
        content = content.replace(/className="text-2xl sm:text-3xl font-black tracking-tighter text-([a-z0-9-]+) drop-shadow-sm flex items-center"/g, 'className="text-2xl sm:text-3xl font-black tracking-tighter text-$1 drop-shadow-sm flex items-center -ml-2 sm:-ml-3"');
        
        // The text span in Navbar specifically might be slightly different
        content = content.replace(/className="text-2xl font-bold bg-gradient-to-r from-white to-\[#FCFAF7\] bg-clip-text text-transparent font-serif drop-shadow-sm flex items-center"/g, 'className="text-2xl font-bold bg-gradient-to-r from-white to-[#FCFAF7] bg-clip-text text-transparent font-serif drop-shadow-sm flex items-center -ml-2 sm:-ml-3"');

        // The text span in Footers starts with text-3xl
        content = content.replace(/className="text-3xl sm:text-4xl font-black tracking-tighter text-([a-z0-9-]+) drop-shadow-sm flex items-center"/g, 'className="text-3xl sm:text-4xl font-black tracking-tighter text-$1 drop-shadow-sm flex items-center -ml-3 sm:-ml-5"');

        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    } catch (e) {
        console.error(`Error reading/writing ${file}: ${e.message}`);
    }
});
