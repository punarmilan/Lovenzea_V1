import React, { useState, useEffect, useRef } from 'react';
import noChatData from '../../../assets/image/no_chat_data.png';
import bannerBg from '../../../assets/image/banner-bg.png';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { MessageSquare, Send, Clock, User, ArrowLeft, ShieldAlert, Search } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { fetchRecentConversations, fetchChatHistory, setActiveChatUser, markAllChatAsRead, clearChatError } from '../../../Slice/ChatSlice';
import ChatService from '../../../services/chatService';

const ChatsPage = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const currentUser = useSelector((state) => state.user.user);
    const { recentConversations, conversations, loading, error } = useSelector((state) => state.chat);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageText, setMessageText] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (location.state?.openChatUser) {
            setSelectedUser(location.state.openChatUser);
        }
    }, [location.state]);

    useEffect(() => {
        if (error) {
            const errStr = typeof error === 'string' ? error : (error.message || String(error));
            if (errStr.toLowerCase().includes("premium") || errStr.toLowerCase().includes("upgrade")) {
                Swal.fire({
                    icon: 'warning',
                    title: '<span style="color:#B54768">Premium Feature</span>',
                    html: `<b>${error}</b>`,
                    confirmButtonText: 'Upgrade Now',
                    confirmButtonColor: '#B54768',
                    showCancelButton: true,
                    cancelButtonText: 'Later',
                    cancelButtonColor: '#6c757d',
                    background: '#fcfaf8'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/payment';
                    }
                });
            } else {
                toast.error(error, { duration: 4000 });
            }
            dispatch(clearChatError());
        }
    }, [error, dispatch]);

    const activeConversations = React.useMemo(() => {
        let baseList = recentConversations && recentConversations.length > 0 ? [...recentConversations] : [];
        
        if (selectedUser) {
            const isPresent = baseList.some(c => c.otherUserId === selectedUser.id);
            if (!isPresent) {
                baseList.unshift({
                    otherUserId: selectedUser.id,
                    otherUserName: selectedUser.fullName,
                    otherProfilePhotoUrl: selectedUser.profilePhotoUrl,
                    lastMessage: "New Conversation",
                    lastActive: new Date().toISOString(),
                    isOnline: true,
                    unreadCount: 0
                });
            }
        }
        return baseList;
    }, [recentConversations, selectedUser]);

    useEffect(() => {
        dispatch(fetchRecentConversations());
    }, [dispatch]);

    useEffect(() => {
        if (selectedUser) {
            dispatch(setActiveChatUser(selectedUser.id));
            dispatch(fetchChatHistory({ targetUserId: selectedUser.id }));
            dispatch(markAllChatAsRead(selectedUser.id));
        }
        return () => {
            dispatch(setActiveChatUser(null));
        };
    }, [selectedUser, dispatch]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedUser, conversations]);

    const activeChatData = selectedUser ? conversations[selectedUser.id] || { messages: [] } : { messages: [] };

    const handleSend = (e) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedUser) return;

        try {
            const messageDTO = {
                senderId: currentUser.id,
                recipientId: selectedUser.id,
                content: messageText
            };

            ChatService.sendMessage(messageDTO);
            setMessageText('');
        } catch (err) {
            console.error("Error in handleSend:", err);
            toast.error("Failed to send message");
        }
    };

    return (
        <div className="w-full min-h-[calc(100vh-140px)] bg-transparent flex flex-col font-sans pb-8">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border border-white rounded-[28px] p-6 md:px-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 relative overflow-hidden mt-3 h-[140px] flex flex-col justify-center" style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
              {/* Blurred Background Overlay */}
              <div className="absolute inset-0 z-0 pointer-events-none"></div>
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#F8D6CB]/50 rounded-full blur-[60px] opacity-50 pointer-events-none"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E88C8C]/30 rounded-full blur-[60px] opacity-50 pointer-events-none"></div>
                
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#B54768] to-[#E88C8C] mb-2 flex items-center gap-3 drop-shadow-sm tracking-tight relative z-10">Messages</h1>
                    <p className="text-sm text-gray-600 font-medium max-w-2xl leading-relaxed relative z-10">Connect with your accepted matches in real-time</p>
                </div>
            </div>

            {/* Main Chat Area Split Panel */}
            <div className="flex-1 w-full bg-white/80 backdrop-blur-md rounded-[32px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex overflow-hidden min-h-[600px] max-h-[750px]">
                {/* Left Side: Conversations List */}
                <div className={`w-full md:w-full max-w-[360px] border-r border-white/40 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-5 border-b border-white/40 bg-[#FFF8F5]/30 flex flex-col gap-4 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E88C8C] to-[#B54768] flex items-center justify-center shadow-md">
                                <MessageSquare className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-black font-serif text-[#5A2332] tracking-wide drop-shadow-sm">Chats</h2>
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                                <Search className="w-4 h-4" />
                            </span>
                            <input 
                                type="text" 
                                placeholder="Search conversations..." 
                                className="w-full pl-9 pr-4 py-2 text-sm bg-white/60 border border-white/80 rounded-xl outline-none focus:border-[#E88C8C] focus:bg-white transition-all placeholder-gray-500 text-gray-800 font-medium shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-gray-100/50">
                        {activeConversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                                <div className="w-32 h-32 mb-2 mx-auto"><img src={noChatData} alt="No Chats" className="w-full h-full object-contain drop-shadow-sm opacity-80" /></div>
                                <h4 className="text-sm font-bold text-[#E86D8A] mb-1 font-serif">No Chats Found</h4>
                                <p className="text-[11px] text-[#7A6666] max-w-[200px] leading-relaxed">Connect with your matches to start a conversation here!</p>
                            </div>
                        ) : (
                            activeConversations.map((c) => {
                                const isSelected = selectedUser && selectedUser.id === c.otherUserId;
                                return (
                                    <div
                                        key={c.otherUserId}
                                        onClick={() => setSelectedUser({
                                            id: c.otherUserId,
                                            fullName: c.otherUserName,
                                            profilePhotoUrl: c.otherProfilePhotoUrl
                                        })}
                                        className={`flex items-center gap-3.5 px-5 py-4 cursor-pointer transition-all duration-200 ${
                                            isSelected 
                                                ? 'bg-[#FFF8F5] border-l-4 border-l-[#B54768]' 
                                                : 'hover:bg-gray-50/50 border-l-4 border-l-transparent'
                                        }`}
                                    >
                                        {/* Avatar */}
                                        <div className="relative flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-[#F8D6CB]">
                                                <img 
                                                    src={c.otherProfilePhotoUrl || `https://i.pravatar.cc/100?u=${c.otherUserId}`} 
                                                    alt={c.otherUserName} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {c.isOnline && (
                                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                                            )}
                                        </div>

                                        {/* User Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <span className="font-bold text-sm text-[#B54768] truncate">{c.otherUserName}</span>
                                                <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                                                    {c.lastActive ? new Date(c.lastActive).toLocaleDateString([], { day: '2-digit', month: 'short' }) : ''}
                                                </span>
                                            </div>
                                            <p className="text-xs text-theme-text-secondary truncate">{c.lastMessage || 'No messages yet'}</p>
                                        </div>

                                        {/* Unread Badge */}
                                        {c.unreadCount > 0 && (
                                            <span className="h-5 min-w-[20px] px-1.5 bg-gradient-to-r from-[#B54768] to-[#E88C8C] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                                                {c.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Side: Messages Pane */}
                <div className={`flex-1 flex flex-col bg-[#FFF8F5]/20 ${!selectedUser ? 'hidden md:flex items-center justify-center p-12 text-center' : 'flex'}`}>
                    {selectedUser ? (
                        <>
                            {/* Selected Chat Header */}
                            <div className="px-6 py-4 border-b border-theme-border/60 bg-theme-surface flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-3.5">
                                    <button 
                                        onClick={() => setSelectedUser(null)} 
                                        className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <ArrowLeft className="w-5 h-5 text-theme-text-secondary" />
                                    </button>
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-[#F8D6CB] shadow-sm">
                                            <img 
                                                src={selectedUser.profilePhotoUrl || `https://i.pravatar.cc/100?u=${selectedUser.id}`} 
                                                alt={selectedUser.fullName} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm sm:text-base text-[#4A3728]">{selectedUser.fullName}</h3>
                                        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            Active Session
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Messages List Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FFF8F5]/40">
                                {loading && activeChatData.messages.length === 0 ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B54768]" />
                                    </div>
                                ) : activeChatData.messages.length === 0 ? (
                                    <div className="text-center py-20">
                                        <div className="w-32 h-32 mb-4 mx-auto"><img src={noChatData} alt="No Messages" className="w-full h-full object-contain drop-shadow-sm opacity-80" /></div>
                                        <p className="text-sm font-medium text-theme-text-secondary">Say hello to {selectedUser.fullName}!</p>
                                        <p className="text-xs text-gray-400 mt-1">Start your beautiful conversation today.</p>
                                    </div>
                                ) : (
                                    activeChatData.messages.map((msg, idx) => {
                                        const isMe = String(msg.senderId) === String(currentUser.id);
                                        return (
                                            <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                                    isMe
                                                        ? 'bg-gradient-to-r from-[#B54768] to-[#E88C8C] text-white rounded-tr-none shadow-md'
                                                        : 'bg-white text-gray-800 border border-[#F8D6CB] rounded-tl-none shadow-sm'
                                                }`}>
                                                    <p className="leading-relaxed break-words">{msg.content}</p>
                                                    <span className={`text-[9px] block text-right mt-1 ${isMe ? 'text-white/80' : 'text-gray-400'}`}>
                                                        {format(new Date(msg.createdAt), 'HH:mm')}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message input panel */}
                            <form onSubmit={handleSend} className="p-4 bg-theme-surface border-t border-theme-border/60 flex items-center gap-3 shrink-0">
                                <input
                                    type="text"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Type your message here..."
                                    className="flex-1 bg-[#FFF8F5] border border-white rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-[#E88C8C]/20 focus:border-[#E88C8C] outline-none transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!messageText.trim()}
                                    className="w-12 h-12 bg-gradient-to-r from-[#B54768] to-[#E88C8C] hover:from-[#E88C8C] hover:to-[#B54768] text-white rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:scale-100"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="max-w-md flex flex-col items-center">
                            <div className="w-48 h-48 mb-5 mx-auto"><img src={noChatData} alt="Select Conversation" className="w-full h-full object-contain drop-shadow-md opacity-90" /></div>
                            <h2 className="text-xl font-bold font-serif text-[#4A3728] mb-2">Your Conversations</h2>
                            <p className="text-sm text-theme-text-secondary leading-relaxed">
                                Select a profile from the left sidebar to start sending and receiving messages. All messages are encrypted and completely secure.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatsPage;
