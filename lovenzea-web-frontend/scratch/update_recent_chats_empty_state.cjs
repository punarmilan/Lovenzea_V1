const fs = require('fs');
const path = 'e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/components/RecentChatsCard.jsx';

let content = fs.readFileSync(path, 'utf8');

if (!content.includes('noChatData')) {
    content = content.replace(
        /import React.*?;\n/,
        match => match + "import noChatData from '../assets/image/no_chat_data.png';\n"
    );
}

content = content.replace(
    /<div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-tr from-\[#FFF6F2\] to-white border border-\[#FFD8C2\] flex items-center justify-center shadow-inner">\s*<MessageSquare className="w-10 h-10 text-\[#D89A74\]" \/>\s*<\/div>/,
    '<div className="w-32 h-32 mx-auto mb-2"><img src={noChatData} alt="No Chats" className="w-full h-full object-contain opacity-90 drop-shadow-sm" /></div>'
);

fs.writeFileSync(path, content);
console.log('Updated RecentChatsCard empty state');
