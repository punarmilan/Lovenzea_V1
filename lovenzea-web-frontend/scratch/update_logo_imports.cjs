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
        let newContent = content.replace(/lovenzea-logo\.jpg/g, 'light_project_logo.jpeg');
        newContent = newContent.replace(/project_logo\.jpeg/g, 'light_project_logo.jpeg');
        
        if (content !== newContent) {
            fs.writeFileSync(file, newContent);
            console.log(`Updated ${file}`);
        }
    } catch (e) {
        console.error(`Error reading/writing ${file}: ${e.message}`);
    }
});
