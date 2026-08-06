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
        content = content.replace(/ml-\[5px\]/g, 'ml-[1px]');
        if (content.includes('ml-[1px]')) {
            fs.writeFileSync(file, content);
            console.log(`Updated ${file}`);
        }
    } catch (e) {
        console.error(`Error reading/writing ${file}: ${e.message}`);
    }
});
