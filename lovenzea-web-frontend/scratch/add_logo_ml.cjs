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
        
        // Remove the negative margins and add ml-[5px]
        content = content.replace(/-ml-2 sm:-ml-3/g, 'ml-[5px]');
        content = content.replace(/-ml-3 sm:-ml-5/g, 'ml-[5px]');

        if (content.includes('ml-[5px]')) {
            fs.writeFileSync(file, content);
            console.log(`Updated ${file}`);
        }
    } catch (e) {
        console.error(`Error reading/writing ${file}: ${e.message}`);
    }
});
