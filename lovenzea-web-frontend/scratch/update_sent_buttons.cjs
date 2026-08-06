const fs = require('fs');

const filesToUpdate = [
    {
        path: 'src/components/MatchProfileCard.jsx',
        replacements: [
            {
                find: "'bg-gray-100 text-gray-400 cursor-not-allowed'",
                replace: "'bg-gradient-to-r from-emerald-500 to-teal-500 text-white cursor-not-allowed'"
            }
        ]
    }
];

filesToUpdate.forEach(file => {
    try {
        let content = fs.readFileSync(file.path, 'utf8');
        let updated = false;
        file.replacements.forEach(rep => {
            if (content.includes(rep.find)) {
                content = content.split(rep.find).join(rep.replace);
                updated = true;
            }
        });
        
        if (updated) {
            fs.writeFileSync(file.path, content);
            console.log(`Updated ${file.path}`);
        }
    } catch (e) {
        console.error(`Failed to update ${file.path}:`, e.message);
    }
});
