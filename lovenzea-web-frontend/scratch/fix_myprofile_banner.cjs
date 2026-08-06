const fs = require('fs');
const path = 'e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/myshadi/myProfile/MyProfile.jsx';

let content = fs.readFileSync(path, 'utf8');

// 1. Change import
content = content.replace(
    /import profileBanner from '\.\.\/\.\.\/\.\.\/assets\/image\/profile_baner1\.avif';/,
    "import profileBanner from '../../../assets/image/behind_profile.jpg';"
);

// 2. Remove top padding to align with SecondNav
content = content.replace(
    /<div className="bg-transparent p-3 sm:p-4 md:p-6 pb-20">/,
    '<div className="bg-transparent pb-20">'
);

// 3. Remove -scale-x-100 and increase height to show more image
content = content.replace(
    /<div className="h-48 md:h-64 w-full relative">/,
    '<div className="h-56 md:h-72 w-full relative">'
);
content = content.replace(
    /className="absolute inset-0 bg-cover bg-center -scale-x-100"/,
    'className="absolute inset-0 bg-cover bg-center"'
);

fs.writeFileSync(path, content);
console.log('Fixed MyProfile banner');
