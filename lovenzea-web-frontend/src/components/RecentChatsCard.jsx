import React, { useEffect } from 'react';
import noChatData from '../assets/image/no_chat_data.png';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Clock, ArrowRight, UserCheck, MessageCircle } from 'lucide-react';
import { fetchRecentConversations, openChatWith, markAllChatAsRead } from '../Slice/ChatSlice';
import { motion } from 'framer-motion';

const RecentChatsCard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { recentConversations, loading } = useSelector((state) => state.chat);

    useEffect(() => {
        dispatch(fetchRecentConversations());
    }, [dispatch]);

    const handleOpenChat = (c) => {
        navigate(`/my-shadi/chats`, {
            state: {
                openChatUser: {
                    id: c.otherUserId,
                    fullName: c.otherUserName,
                    profilePhotoUrl: c.otherProfilePhotoUrl
                }
            }
        });
    };

    const activeChats = recentConversations || [];

    return (
        <div className="w-full bg-theme-surface shadow-[var(--theme-shadow-soft)] rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-[var(--theme-shadow-soft)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-theme-border">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FFF6F2] to-white flex items-center justify-center text-[#C99853] border border-[#FFD8C2] shadow-sm">
                        <MessageCircle className="w-5 h-5 fill-[#C99853] text-[#C99853]" />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold font-serif text-theme-text">Recent Conversations</h2>
                        <p className="text-[11px] text-theme-text-secondary font-medium uppercase tracking-wider">Latest accepted chats</p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/my-shadi/chats')}
                    className="flex items-center gap-1 text-xs font-bold text-theme-violet hover:text-theme-violet transition-all duration-200 border border-theme-border hover:border-theme-violet px-3.5 py-1.5 rounded-full bg-theme-surface shadow-sm hover:shadow active:scale-95"
                >
                    View All
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                    <div className="w-8 h-8 rounded-full border-4 border-theme-border border-t-[#16A085] animate-spin" />
                    <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">Loading chats...</span>
                </div>
            ) : activeChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-32 h-32 mx-auto mb-2"><img src={noChatData} alt="No Chats" className="w-full h-full object-contain opacity-90 drop-shadow-sm" /></div>
                    <h4 className="text-sm font-bold text-[#D89A74] mb-1 font-serif">No Chats Yet</h4>
                    <p className="text-xs text-[#7A6666] max-w-[260px] leading-relaxed">Accept a connection request or send a message to start chatting with your matches!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {activeChats.slice(0, 4).map((c, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                            key={c.otherUserId || i}
                            onClick={() => handleOpenChat(c)}
                            className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-theme-surface/80 backdrop-blur-md border border-white/60 hover:border-theme-primary/40 hover:bg-theme-lavender shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-theme-primary/10 group-hover:ring-theme-primary/40 transition-all duration-300">
                                        <img 
                                            src={c.otherProfilePhotoUrl || `https://ui-avatars.com/api/?name=${c.otherUserName}&background=FCFAF7&color=0F766E`} 
                                            alt={c.otherUserName} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    {c.isOnline ? (
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-theme-success rounded-full border-2 border-white shadow-sm" />
                                    ) : (
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-gray-300 rounded-full border-2 border-white shadow-sm" />
                                    )}
                                </div>

                                {/* Text Details */}
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-base font-bold text-theme-text truncate group-hover:text-theme-primary transition-colors">{c.otherUserName}</h3>
                                    <p className={`text-xs mt-1 truncate ${c.unreadCount > 0 ? 'text-theme-text font-bold' : 'text-theme-text-secondary font-medium'}`}>
                                        {c.lastMessage || "No messages yet"}
                                    </p>
                                </div>
                            </div>

                            {/* Right Side Info */}
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded uppercase tracking-wider">
                                    {c.lastActive ? new Date(c.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                                </span>
                                {c.unreadCount > 0 ? (
                                    <span className="bg-gradient-to-r from-[#0F9D8A] to-[#2DD4BF] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                                        {c.unreadCount} NEW
                                    </span>
                                ) : (
                                    <UserCheck className="w-4 h-4 text-[#10B981]/70" />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentChatsCard;
