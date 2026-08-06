const fs = require('fs');

const filesToUpdate = [
    'src/components/Footer.jsx',
    'src/components/AuthenticatedFooter.jsx'
];

filesToUpdate.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;

        // Reduce main padding from py-12 to py-8
        if (content.includes('py-12')) {
            content = content.replace(/py-12/g, 'py-8');
            updated = true;
        }

        // Reduce bottom margins of sections from mb-10 to mb-6
        if (content.includes('mb-10')) {
            content = content.replace(/mb-10/g, 'mb-6');
            updated = true;
        }

        // Reduce mb-8 to mb-5
        if (content.includes('mb-8')) {
            content = content.replace(/mb-8/g, 'mb-5');
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
