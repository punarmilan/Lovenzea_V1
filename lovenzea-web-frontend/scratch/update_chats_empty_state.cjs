const fs = require('fs');
const path = 'e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/myshadi/chats/ChatsPage.jsx';

let content = fs.readFileSync(path, 'utf8');

if (!content.includes('noChatData')) {
    content = content.replace(
        /import React.*?;\n/,
        match => match + "import noChatData from '../../../assets/image/no_chat_data.png';\n"
    );
}

// 1. Replace empty state in left pane (activeConversations.length === 0)
content = content.replace(
    /<div className="w-16 h-16 mb-4 rounded-full bg-\[#FFF8F5\] border border-\[#F8D6CB\] flex items-center justify-center shadow-inner">\s*<MessageSquare className="w-8 h-8 text-\[#B54768\]" \/>\s*<\/div>/,
    '<div className="w-32 h-32 mb-2 mx-auto"><img src={noChatData} alt="No Chats" className="w-full h-full object-contain drop-shadow-sm opacity-80" /></div>'
);

// 2. Replace empty state in right pane no messages (activeChatData.messages.length === 0)
content = content.replace(
    /<div className="w-16 h-16 bg-\[#FFF8F5\]\/80 border border-theme-border\/40 rounded-full flex items-center justify-center mx-auto mb-4">\s*<MessageSquare className="w-6 h-6 text-\[#E88C8C\]" \/>\s*<\/div>/,
    '<div className="w-32 h-32 mb-4 mx-auto"><img src={noChatData} alt="No Messages" className="w-full h-full object-contain drop-shadow-sm opacity-80" /></div>'
);

// 3. Replace empty state in right pane no user selected (!selectedUser)
content = content.replace(
    /<div className="w-20 h-20 bg-\[#FFF8F5\] border border-theme-border rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">\s*<MessageSquare className="w-10 h-10 text-theme-pink" \/>\s*<\/div>/,
    '<div className="w-48 h-48 mb-5 mx-auto"><img src={noChatData} alt="Select Conversation" className="w-full h-full object-contain drop-shadow-md opacity-90" /></div>'
);

// Ensure the container for !selectedUser is centered nicely
content = content.replace(
    /<div className="max-w-md">/,
    '<div className="max-w-md flex flex-col items-center">'
);

fs.writeFileSync(path, content);
console.log('Updated ChatsPage empty states');
