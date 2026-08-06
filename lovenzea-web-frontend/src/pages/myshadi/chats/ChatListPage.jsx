import React from 'react';
import RecentChatsCard from '../../../components/RecentChatsCard';

function ChatListPage() {
    return (
        <div className="w-full h-full max-w-4xl mx-auto pb-8 px-0 sm:px-4">
            {/* Header Area */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-serif text-gray-900 drop-shadow-sm mb-2">My Chat List</h1>
                <p className="text-sm text-gray-700 font-medium">Access your recent conversations and start talking to your matches.</p>
            </div>

            {/* Main Component */}
            <div className="animate-fade-in-up">
                <RecentChatsCard />
            </div>
        </div>
    );
}

export default ChatListPage;
