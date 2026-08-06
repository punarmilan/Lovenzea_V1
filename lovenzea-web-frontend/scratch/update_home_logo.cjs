const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.jsx', 'utf8');

// 1. Add projectLogo import if not present
if (!content.includes('import projectLogo')) {
    content = content.replace(
        "import heroImg5 from '../assets/image/hero_bg5.png'", 
        "import heroImg5 from '../assets/image/hero_bg5.png'\nimport projectLogo from '../assets/image/project_logo_new.png'"
    );
}

// 2. Replace the left brand logo in Navbar in Home.jsx (around line 458-467)
const oldBrandLogoRegex = /<div className="flex items-center gap-2 cursor-pointer" onClick=\{\(\) => navigate\('\/'\)\}>[\s\S]*?<\/div>/;

const newBrandLogo = `<div className="flex items-center gap-0 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => navigate('/')}>
                        <img src={projectLogo} alt="LovenZea Logo" className="w-14 h-14 sm:w-16 sm:h-16 object-cover drop-shadow-xl hover:scale-105 transition-transform duration-300" style={{ WebkitMaskImage: 'url("data:image/svg+xml;utf8,<svg viewBox=\\'0 0 24 24\\' xmlns=\\'http://www.w3.org/2000/svg\\'><path d=\\'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z\\' fill=\\'black\\'/></svg>")', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: 'url("data:image/svg+xml;utf8,<svg viewBox=\\'0 0 24 24\\' xmlns=\\'http://www.w3.org/2000/svg\\'><path d=\\'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z\\' fill=\\'black\\'/></svg>")', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }} />
                        <span className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-900 drop-shadow-sm flex items-center ml-[2px]">
                            Loven<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d94f73] to-rose-500">Zea</span>
                        </span>
                    </div>`;

content = content.replace(oldBrandLogoRegex, newBrandLogo);

// 3. Replace Guest Alert modal text (around line 222)
content = content.replace(
    /<span className="text-slate-900">Punar<\/span><span className="text-transparent bg-clip-text bg-gradient-to-r from-\[#d94f73\] to-rose-400">Milan<\/span> awaits you!/g,
    '<span className="text-slate-900">Loven</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d94f73] to-rose-500">Zea</span> awaits you!'
);

fs.writeFileSync('src/pages/Home.jsx', content);
console.log('Updated src/pages/Home.jsx');
