const fs = require('fs');
const path = require('path');

const directoriesToScan = ['app', 'src'];
const baseDir = __dirname;

const colorMap = {
  // Pinks/Reds/Current Primaries
  '#DF5F78': '#B76E79',
  '#C94063': '#9C5A66',
  '#E88C8C': '#E8CFCB',
  '#E91E63': '#B76E79',
  '#FF4081': '#D4AF37',
  '#7C4DFF': '#B76E79',
  '#D65A7C': '#B76E79',

  // Blues/Cyans
  '#34B7F1': '#B76E79',
  '#0a7ea4': '#B76E79',
  '#4DA8DA': '#D4AF37',
  '#0B1C3F': '#3E2C2C', // Dark blue text -> Text Primary
  
  // Backgrounds/Greys/Whites
  '#F8F9FA': '#FFFDFB',
  '#F0F4F8': '#E8D8D5',
  '#E5DDD5': '#FFF8F6',
  '#005C4B': '#9C5A66', // dark green whatsapp -> primary dark
  '#A0A0A0': '#8B6F74',
};

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let filesModified = 0;

directoriesToScan.forEach(dir => {
  const fullPath = path.join(baseDir, dir);
  if (fs.existsSync(fullPath)) {
    walkDir(fullPath, (filePath) => {
      if (filePath.endsWith('.js') || filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;
        
        for (const [oldColor, newColor] of Object.entries(colorMap)) {
          const regex = new RegExp(oldColor, 'gi');
          newContent = newContent.replace(regex, newColor);
        }

        newContent = newContent.replace(/colors=\{\['#DF5F78', '#C94063'\]\}/g, `colors={['#F7E7E4', '#B76E79']}`);
        newContent = newContent.replace(/colors=\{\['rgba\\(255, 248, 245, 0\\.4\\)', '#FFF8F5', '#FFF8F5'\]\}/g, `colors={['rgba(255, 253, 251, 0.4)', '#FFFDFB', '#FFFDFB']}`);

        if (content !== newContent) {
          fs.writeFileSync(filePath, newContent, 'utf8');
          filesModified++;
        }
      }
    });
  }
});

console.log(`Modified ${filesModified} files to apply the Rose Gold theme colors.`);
