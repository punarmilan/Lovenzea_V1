const fs = require('fs');
const path = require('path');

const dirToScan = ['src/pages', 'src/components', 'src/admin', 'src/layouts'];
const excludeFiles = ['Headers.jsx', 'Navbar.jsx', 'BottomNav.jsx', 'Footer.jsx', 'AuthenticatedFooter.jsx'];

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      const base = path.basename(file);
      if (!excludeFiles.includes(base)) {
        results.push(file);
      }
    }
  });
  return results;
}

const colorMap = {
  // Backgrounds
  'bg-[#FCFAF7]': 'bg-theme-bg',
  'bg-[#F7FAFC]': 'bg-theme-bg',
  'bg-[#ECFDF5]': 'bg-theme-lavender',
  'bg-[#F0FDFA]': 'bg-theme-lavender',
  'bg-[#D1FAE5]': 'bg-theme-lavender',
  'bg-[#FFF1F6]': 'bg-theme-soft-pink',
  'bg-white': 'bg-theme-surface',

  // Borders
  'border-[#EBDCCB]': 'border-theme-border',
  'border-[#E2E8F0]': 'border-theme-border',
  'border-[#A7F3D0]': 'border-theme-border',
  'border-[#E9E2F5]': 'border-theme-border',
  'border-gray-200': 'border-theme-border',
  'border-[#0F9D8A]': 'border-theme-primary',
  'border-[#2DD4BF]': 'border-theme-border',
  'border-[#0878D1]': 'border-theme-violet',
  
  // Text
  'text-[#1E293B]': 'text-theme-text',
  'text-[#0F172A]': 'text-theme-text',
  'text-[#475569]': 'text-theme-text-secondary',
  'text-[#667085]': 'text-theme-text-secondary',
  'text-gray-500': 'text-theme-text-secondary',
  'text-gray-600': 'text-theme-text-secondary',
  'text-[#0F9D8A]': 'text-theme-primary',
  'text-[#16A085]': 'text-theme-primary',
  'text-[#0878D1]': 'text-theme-violet',
  'text-[#115E59]': 'text-theme-primary-dark',
  'text-[#2563EB]': 'text-theme-violet',
  'text-[#C5A059]': 'text-theme-magenta',
  'text-[#8C6D39]': 'text-theme-pink',
  
  // Buttons & Badges (Background)
  'bg-[#0F9D8A]': 'bg-theme-primary',
  'bg-[#16A085]': 'bg-theme-primary',
  'bg-[#10B981]': 'bg-theme-success',
  'bg-green-500': 'bg-theme-success',
  'bg-[#F59E0B]': 'bg-theme-warning',
  'bg-orange-500': 'bg-theme-warning',
  'bg-[#EF4444]': 'bg-theme-error',
  'bg-[#F87171]': 'bg-theme-error',
  'bg-[#0878D1]': 'bg-theme-violet',
  'bg-[#C5A059]': 'bg-theme-magenta',
  
  // Fills & Strokes
  'fill-[#16A085]': 'fill-theme-primary',
  'fill-[#0F9D8A]': 'fill-theme-primary',
  'fill-[#0878D1]': 'fill-theme-violet',
  'fill-[#C5A059]': 'fill-theme-magenta',
  
  // Hover
  'hover:text-[#0F9D8A]': 'hover:text-theme-primary',
  'hover:text-[#16A085]': 'hover:text-theme-primary',
  'hover:bg-[#F0FDFA]': 'hover:bg-theme-lavender',
  'hover:bg-[#ECFDF5]': 'hover:bg-theme-lavender',
  'hover:bg-[#FCFAF7]': 'hover:bg-theme-lavender',
  'hover:border-[#0F9D8A]': 'hover:border-theme-primary'
};

let files = [];
dirToScan.forEach(dir => {
  files = files.concat(walk(dir));
});

let updatedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  // Simple string replacements
  for (const [key, value] of Object.entries(colorMap)) {
    content = content.split(key).join(value);
  }

  // Regex replacements for gradients and rings
  content = content.replace(/from-\[#C5A059\] to-\[#8C6D39\]/g, 'from-theme-primary to-theme-pink');
  content = content.replace(/from-\[#0F9D8A\] to-\[#0878D1\]/g, 'from-theme-primary to-theme-violet');
  content = content.replace(/from-\[#16A085\] to-\[#2DD4BF\]/g, 'from-theme-primary to-theme-pink');
  content = content.replace(/from-\[#064E4A\]/g, 'from-theme-primary-dark');
  content = content.replace(/to-\[#1D4ED8\]/g, 'to-theme-magenta');
  
  content = content.replace(/ring-\[#0F9D8A\]/g, 'ring-theme-primary');
  content = content.replace(/ring-\[#16A085\]/g, 'ring-theme-primary');
  content = content.replace(/ring-\[#C5A059\]/g, 'ring-theme-magenta');
  content = content.replace(/ring-\[#2DD4BF\]/g, 'ring-theme-pink');

  // Fix custom shadows
  content = content.replace(/shadow-\[0_12px_40px_rgba\(229,213,192,0\.15\)\]/g, 'shadow-[var(--theme-shadow-soft)]');
  content = content.replace(/shadow-\[0_15px_30px_rgba\(229,213,192,0\.2\)\]/g, 'shadow-[var(--theme-shadow-soft)]');
  content = content.replace(/shadow-\[0_20px_48px_rgba\(229,213,192,0\.22\)\]/g, 'shadow-[var(--theme-shadow-soft)]');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf-8');
    updatedCount++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`Successfully updated ${updatedCount} files.`);
