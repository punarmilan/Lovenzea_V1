const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let modifiedFiles = 0;

walkDir('src', function(filePath) {
    if (filePath.endsWith('.jsx') || filePath.endsWith('.js') || filePath.endsWith('.html') || filePath.endsWith('.css')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;

        // Perform case-sensitive replacements
        newContent = newContent.replace(/PunarMilan/g, 'LovenZea');
        newContent = newContent.replace(/Punarmilan/g, 'LovenZea');
        newContent = newContent.replace(/punarmilan/g, 'lovenzea');
        newContent = newContent.replace(/PUNARMILAN/g, 'LOVENZEA');

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            modifiedFiles++;
        }
    }
});

console.log(`Replaced text in ${modifiedFiles} files.`);
