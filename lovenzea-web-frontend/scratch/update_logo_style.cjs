const fs = require('fs');

const files = [
    'src/components/Headers.jsx',
    'src/components/Navbar.jsx',
    'src/components/Footer.jsx',
    'src/components/AuthenticatedFooter.jsx',
    'src/admin/AdminLayout.jsx',
    'src/pages/Home.jsx'
];

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        
        // Change ml-[2px] to ml-[1px]
        content = content.replace(/ml-\[2px\]/g, 'ml-[1px]');
        
        // For Footers, reduce text size
        if (file.includes('Footer.jsx') || file.includes('AuthenticatedFooter.jsx')) {
            // It currently has text-3xl sm:text-4xl
            content = content.replace(/text-3xl sm:text-4xl/g, 'text-2xl sm:text-3xl');
        }

        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    } catch (e) {
        console.error(`Error reading/writing ${file}: ${e.message}`);
    }
});
