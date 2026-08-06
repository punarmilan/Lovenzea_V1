import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchOnlineMatches,
    fetchOnlineAccepted,
    fetchShortlistedSocial
} from "../Slice/MatchSlice";
import { fetchUnreadChatCount, setCurrentUserId, fetchRecentConversations, markAllChatAsRead } from "../Slice/ChatSlice";
import { fetchNotifications } from "../Slice/NotificationSlice";
import ChatService from "../services/chatService";
import ChatWindow from "./ChatWindow";
import { MessageCircle, Bell, Users, Heart, ChevronRight, Volume2, VolumeX, X as CloseIcon } from "lucide-react";
import { formatDisplayName } from "../utils/mockData";

export default function OnlineMembers({ open, setOpen, onClose }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { onlineMatches, onlineAccepted, shortlistedProfiles } = useSelector((state) => state.match);
    const { unreadCount: notificationsUnreadCount, items: notificationItems } = useSelector((state) => state.notifications) || { unreadCount: 0, items: [] };
    const { unreadCount, recentConversations } = useSelector((state) => state.chat);

    const [activeTab, setActiveTab] = useState("active");
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [chatTarget, setChatTarget] = useState(null);

    useEffect(() => {
        if (open && user?.id) {
            dispatch(fetchOnlineMatches());
            dispatch(fetchOnlineAccepted());
            dispatch(fetchShortlistedSocial());
            dispatch(fetchUnreadChatCount());
            dispatch(fetchRecentConversations());
            dispatch(fetchNotifications({ page: 0, size: 20 }));
        }
    }, [open, user?.id, dispatch]);

    useEffect(() => {
        const handleOpenChats = () => setActiveTab("chats");
        window.addEventListener('open-chats-sidebar', handleOpenChats);
        return () => window.removeEventListener('open-chats-sidebar', handleOpenChats);
    }, []);

    // Toggle audio mute
    const toggleAudioMute = () => {
        setIsAudioMuted(!isAudioMuted);
    };

    const handleClose = () => {
        if (onClose) onClose();
        else setOpen(false);
    };

    const handleChatClick = (target) => {
        setChatTarget(target);
        if (target && target.id) {
            dispatch(markAllChatAsRead(target.id));
        } else if (target && target.otherUserId) {
            dispatch(markAllChatAsRead(target.otherUserId));
        }
    };

    const getRecentChatUsers = () => {
        // Simple heuristic: users we have messages with
        const userIds = Object.keys(conversations);
        // This would ideally be a dedicated endpoint, but we can combine with accepted online
        return onlineAccepted;
    };

    return (
        <>
            {/* BACKDROP */}
            {open && (
                <div
                    onClick={handleClose}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998] md:z-[999] transition-opacity duration-300"
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
                    fixed bg-gradient-to-b from-white to-gray-50 
                    shadow-2xl
                    transition-all duration-300 ease-out
                    
                    /* Mobile: Full screen modal from bottom */
                    bottom-0 left-0 right-0 
                    rounded-t-3xl
                    h-[calc(100vh-80px)] max-h-[90vh]
                    z-[999]
                    ${open ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
                    
                    /* Tablet and Desktop: Side panel from right */
                    md:right-0 md:left-auto md:bottom-4 
                    md:h-[580px] md:w-full max-w-[320px]
                    md:rounded-2xl md:rounded-r-none
                    md:border-l md:border-theme-border
                    md:z-[1000]
                    ${open ? "md:translate-x-0 md:translate-y-0" : "md:translate-x-full md:translate-y-0"}
                    
                    /* Large Desktop */
                    lg:w-full max-w-[360px] lg:h-[620px]
                `}
            >
                {/* HEADER with gradient background */}
                <div className="relative bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-4 md:py-3 rounded-t-3xl md:rounded-tr-none shadow-lg">
                    {/* Mobile drag handle */}
                    <div className="md:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-theme-surface/30 rounded-full"></div>

                    <div className="flex items-center justify-between mt-2 md:mt-0">
                        <div className="flex items-center gap-2.5">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400 shadow-lg shadow-green-500/50"></span>
                            </span>
                            <span className="text-sm md:text-base font-semibold text-white">
                                I am Online
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            {/* Audio Icon */}
                            <button
                                onClick={toggleAudioMute}
                                className="p-2 hover:bg-theme-surface/20 rounded-lg transition-all duration-200 active:scale-95"
                                title={isAudioMuted ? "Unmute all" : "Mute all"}
                            >
                                {isAudioMuted ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                                        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                                        <line x1="12" y1="19" x2="12" y2="23"></line>
                                        <line x1="8" y1="23" x2="16" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                    </svg>
                                )}
                            </button>

                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-theme-surface/20 rounded-lg transition-all duration-200 active:scale-95"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="h-[calc(100%-140px)] md:h-[calc(100%-115px)] lg:h-[calc(100%-120px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">

                    {/* ACCEPTED MEMBERS SECTION */}
                    <div className="border-b border-theme-border">
                        <div className="flex items-center justify-between px-4 py-3.5 bg-blue-50/30">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                                    <Users size={16} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-800">Accepted & Online</h3>
                                    <p className="text-xs text-theme-text-secondary">{onlineAccepted.length} online</p>
                                </div>
                            </div>
                        </div>

                        {onlineAccepted.length === 0 ? (
                            <p className="px-4 py-3 text-xs text-gray-400 italic">None of your accepted members are online.</p>
                        ) : (
                            onlineAccepted.map((m) => (
                                <div
                                    key={m.id}
                                    onClick={() => handleChatClick(m)}
                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors cursor-pointer group"
                                >
                                    <div className="relative">
                                        <img
                                            src={m.profilePhotoUrl || `https://i.pravatar.cc/40?u=${m.id}`}
                                            className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm"
                                            alt={formatDisplayName(m.fullName, m.displayNameVisibility, m.id)}
                                        />
                                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-theme-success rounded-full border-2 border-white shadow-md"></span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800 truncate">{formatDisplayName(m.fullName, m.displayNameVisibility, m.id)}</p>
                                        <p className="text-[10px] text-green-600">Online</p>
                                    </div>
                                    <MessageCircle size={18} className="text-gray-300 group-hover:text-blue-500" />
                                </div>
                            ))
                        )}
                    </div>

                    {/* SHORTLISTED SECTION */}
                    <div className="border-b border-theme-border">
                        <div className="flex items-center justify-between px-4 py-3.5 bg-purple-50/30">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                                    <Heart size={16} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-800">Shortlisted</h3>
                                    <p className="text-xs text-theme-text-secondary">{shortlistedProfiles.length} total</p>
                                </div>
                            </div>
                        </div>

                        {shortlistedProfiles.length === 0 ? (
                            <p className="px-4 py-3 text-xs text-gray-400 italic">Your shortlist is empty.</p>
                        ) : (
                            shortlistedProfiles.slice(0, 3).map((m) => (
                                <div
                                    key={m.id}
                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition-colors cursor-pointer group"
                                >
                                    <img
                                        src={m.profilePhotoUrl || `https://i.pravatar.cc/40?u=${m.id}`}
                                        className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm"
                                        alt={formatDisplayName(m.fullName, m.displayNameVisibility, m.id)}
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800 truncate">{formatDisplayName(m.fullName, m.displayNameVisibility, m.id)}</p>
                                        <p className="text-[10px] text-theme-text-secondary">{m.city}, {m.state}</p>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-300" />
                                </div>
                            ))
                        )}
                    </div>

                    {/* CHAT PAGE */}
                    {activeTab === "chats" && (
                        <div className="p-0">
                            <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-700">Recent Chats</h3>
                            </div>

                            {recentConversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-10 text-center">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <MessageCircle size={32} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-700">No Recent Chats</h3>
                                    <p className="text-xs text-theme-text-secondary mt-1">Start chatting with your matches!</p>
                                </div>
                            ) : (
                                recentConversations.map((c) => (
                                    <div
                                        key={c.otherUserId}
                                        onClick={() => handleChatClick({
                                            id: c.otherUserId,
                                            fullName: c.otherUserName,
                                            profilePhotoUrl: c.otherProfilePhotoUrl
                                        })}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-rose-50/30 border-b border-gray-50 transition-colors cursor-pointer group"
                                    >
                                        <div className="relative">
                                            <img
                                                src={c.otherProfilePhotoUrl || `https://i.pravatar.cc/40?u=${c.otherUserId}`}
                                                className="w-12 h-12 rounded-full ring-2 ring-white shadow-sm"
                                                alt={c.otherUserName}
                                            />
                                            {c.isOnline && (
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-theme-success rounded-full border-2 border-white shadow-sm"></span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <p className="text-sm font-semibold text-gray-800 truncate">{c.otherUserName}</p>
                                                <p className="text-[10px] text-gray-400">
                                                    {new Date(c.lastActive).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                                                </p>
                                            </div>
                                            <p className="text-xs text-theme-text-secondary truncate mt-0.5">{c.lastMessage}</p>
                                        </div>
                                        {c.unreadCount > 0 && (
                                            <span className="w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                                {c.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* ACTIVE MEMBERS */}
                    {activeTab === "active" && (
                        <>
                            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-rose-50 to-transparent border-b border-theme-border">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                                        <Heart size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-800">My Matches</h3>
                                        <p className="text-xs text-theme-text-secondary">{onlineMatches.length} online</p>
                                    </div>
                                </div>
                            </div>

                            {onlineMatches.length === 0 ? (
                                <div className="p-10 text-center">
                                    <p className="text-sm text-gray-400 italic">No matches currently online.</p>
                                </div>
                            ) : (
                                onlineMatches.map((m) => (
                                    <div
                                        key={m.id}
                                        onClick={() => handleChatClick(m)}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-rose-50 hover:to-transparent transition-all cursor-pointer group"
                                    >
                                        <div className="relative">
                                            <img
                                                src={m.profilePhotoUrl || `https://i.pravatar.cc/40?u=${m.id}`}
                                                className="w-11 h-11 rounded-full ring-2 ring-white shadow-md group-hover:ring-rose-200 transition-all"
                                                alt={formatDisplayName(m.fullName, m.displayNameVisibility, m.id)}
                                            />
                                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-theme-success rounded-full border-2 border-white shadow-md">
                                                <span className="absolute inset-0 rounded-full bg-theme-success animate-ping opacity-75"></span>
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">{formatDisplayName(m.fullName, m.displayNameVisibility, m.id)}</p>
                                            <p className="text-xs text-green-600 font-medium">● Online now</p>
                                        </div>
                                        <MessageCircle size={18} className="text-gray-300 group-hover:text-rose-400 transition-colors" />
                                    </div>
                                ))
                            )}
                        </>
                    )}
                </div>

                {/* CHAT WINDOW RENDERER */}
                {chatTarget && (
                    <ChatWindow
                        targetUser={chatTarget}
                        onClose={() => setChatTarget(null)}
                    />
                )}


                {/* BOTTOM TABS */}
                <div className="absolute bottom-0 left-0 right-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 border-t border-theme-border text-sm bg-theme-surface rounded-b-3xl md:rounded-bl-none shadow-lg">
                    <button
                        onClick={() => setActiveTab("chats")}
                        className={`py-3.5 flex flex-col items-center justify-center gap-1 transition-all duration-200 relative border-x border-theme-border ${activeTab === "chats"
                            ? "text-rose-600"
                            : "text-theme-text-secondary hover:text-gray-700"
                            }`}
                    >
                        {activeTab === "chats" && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-b-full"></div>
                        )}
                        <MessageCircle size={20} fill={activeTab === "chats" ? "currentColor" : "none"} />
                        <span className={`text-xs ${activeTab === "chats" ? "font-semibold" : "font-medium"}`}>
                            Chats
                        </span>
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-4 w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center border border-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab("active")}
                        className={`py-3.5 flex flex-col items-center justify-center gap-1 transition-all duration-200 relative ${activeTab === "active"
                            ? "text-rose-600"
                            : "text-theme-text-secondary hover:text-gray-700"
                            }`}
                    >
                        {activeTab === "active" && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-b-full"></div>
                        )}
                        <Users size={20} fill={activeTab === "active" ? "currentColor" : "none"} />
                        <span className={`text-xs ${activeTab === "active" ? "font-semibold" : "font-medium"}`}>
                            Active
                        </span>
                    </button>
                </div>
            </aside>

            {/* Add custom CSS for animations */}
            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                
                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }
                
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 10px;
                }
                
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
            `}</style>
        </>
    );
}