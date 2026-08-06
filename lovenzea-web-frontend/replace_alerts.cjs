const fs = require('fs');
const path = require('path');

const directory = 'e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(directory);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let needsSwal = false;

    // Replace window.confirm
    if (content.includes('window.confirm(')) {
        needsSwal = true;
        content = content.replace(/window\.confirm\((.*?)\)/g, (match, msg) => {
            return `(await Swal.fire({ title: 'Are you sure?', text: ${msg}, icon: 'warning', showCancelButton: true, confirmButtonColor: '#8C6D39', cancelButtonColor: '#d33', confirmButtonText: 'Yes' }).then(r => r.isConfirmed))`;
        });
    }

    // Replace alert
    if (content.includes('alert(')) {
        needsSwal = true;
        content = content.replace(/\balert\((.*?)\)/g, (match, msg) => {
            if (!msg.trim()) return 'alert()';
            return `Swal.fire({ text: ${msg}, confirmButtonColor: '#8C6D39' })`;
        });
    }

    if (needsSwal && !content.includes('import Swal from')) {
        const lines = content.split('\n');
        const importIndex = lines.findIndex(l => l.startsWith('import '));
        if (importIndex !== -1) {
            lines.splice(importIndex + 1, 0, "import Swal from 'sweetalert2';");
        } else {
            lines.unshift("import Swal from 'sweetalert2';");
        }
        content = lines.join('\n');
    }

    if (needsSwal) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated ' + file);
    }
});
console.log('Done!');
