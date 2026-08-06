const fs = require('fs');

const files = [
    'src/components/Headers.jsx',
    'src/components/Navbar.jsx',
    'src/components/Footer.jsx',
    'src/components/AuthenticatedFooter.jsx',
    'src/admin/AdminLayout.jsx'
];

const maskStyle = `style={{ WebkitMaskImage: 'url("data:image/svg+xml;utf8,<svg viewBox=\\'0 0 24 24\\' xmlns=\\'http://www.w3.org/2000/svg\\'><path d=\\'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z\\' fill=\\'black\\'/></svg>")', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: 'url("data:image/svg+xml;utf8,<svg viewBox=\\'0 0 24 24\\' xmlns=\\'http://www.w3.org/2000/svg\\'><path d=\\'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z\\' fill=\\'black\\'/></svg>")', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}`;

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        
        // Find the image tag for projectLogo
        const imgRegex = /<img src=\{projectLogo\} alt="LovenZea Logo" className="([^"]+)" \/>/g;
        
        // Let's remove rounded properties from the class so the mask stands out nicely, 
        // and add the inline style
        let newContent = content.replace(imgRegex, (match, className) => {
            let newClass = className.replace(/rounded-\[.*?\]|rounded-[a-z]+|border\s|border-[a-z0-9/-]+/g, ' ').replace(/\s+/g, ' ').trim();
            return `<img src={projectLogo} alt="LovenZea Logo" className="${newClass}" ${maskStyle} />`;
        });
        
        if (content !== newContent) {
            fs.writeFileSync(file, newContent);
            console.log(`Updated ${file}`);
        }
    } catch (e) {
        console.error(`Error reading/writing ${file}: ${e.message}`);
    }
});
