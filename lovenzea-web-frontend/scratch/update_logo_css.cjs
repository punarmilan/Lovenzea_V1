const fs = require('fs');

const files = [
    'src/components/Headers.jsx',
    'src/components/Navbar.jsx',
    'src/components/Footer.jsx',
    'src/components/AuthenticatedFooter.jsx',
    'src/admin/AdminLayout.jsx'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Replace w-10, w-12, w-14, w-9 with w-auto
    content = content.replace(/w-10\s/g, 'w-auto ');
    content = content.replace(/w-12\s/g, 'w-auto ');
    content = content.replace(/sm:w-12\s/g, 'sm:w-auto ');
    content = content.replace(/sm:w-14\s/g, 'sm:w-auto ');
    content = content.replace(/w-14\s/g, 'w-auto ');
    content = content.replace(/w-9\s/g, 'w-auto ');

    // Replace object-cover with object-contain
    content = content.replace(/object-cover/g, 'object-contain');

    // Remove rounded corners just in case it's a wide rectangle text logo
    content = content.replace(/rounded-\[1rem\]/g, 'rounded-md');
    content = content.replace(/rounded-lg/g, 'rounded-md');

    fs.writeFileSync(file, content);
    console.log(`Adjusted dimensions in ${file}`);
});
