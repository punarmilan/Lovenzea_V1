const fs = require('fs');

const files = [
    'src/components/Headers.jsx',
    'src/components/Navbar.jsx',
    'src/components/Footer.jsx',
    'src/components/AuthenticatedFooter.jsx',
    'src/admin/AdminLayout.jsx',
    'src/pages/Home.jsx'
];

const maskStyle = ` style={{ WebkitMaskImage: 'url("data:image/svg+xml;utf8,<svg viewBox=\\'0 0 24 24\\' xmlns=\\'http://www.w3.org/2000/svg\\'><path d=\\'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z\\' fill=\\'black\\'/></svg>")', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: 'url("data:image/svg+xml;utf8,<svg viewBox=\\'0 0 24 24\\' xmlns=\\'http://www.w3.org/2000/svg\\'><path d=\\'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z\\' fill=\\'black\\'/></svg>")', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}`;

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        
        // 1. Change the image import
        content = content.replace(/project_logo_new\.png/g, 'project_logo_transperent.png');
        
        // 2. Remove the mask style
        // Need to be careful with spaces. We'll replace it with an empty string.
        content = content.replace(maskStyle, '');
        // Just in case there was no leading space in the replacement
        content = content.replace(maskStyle.trim(), '');

        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    } catch (e) {
        console.error(`Error reading/writing ${file}: ${e.message}`);
    }
});
