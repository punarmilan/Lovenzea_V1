import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { X, Send, Minus, Maximize2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { fetchChatHistory, setActiveChatUser, markAllChatAsRead, clearChatError } from '../Slice/ChatSlice';
import ChatService from '../services/chatService';
import { formatDisplayName } from '../utils/mockData';

export default function ChatWindow({ targetUser, onClose }) {
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const currentUser = useSelector((state) => state.user.user);
    const { conversations, loading, error } = useSelector((state) => state.chat);
    const messagesEndRef = useRef(null);
    const [isMinimized, setIsMinimized] = useState(false);

    const chatData = conversations[targetUser.id] || { messages: [] };

    useEffect(() => {
        if (error) {
            const errStr = typeof error === 'string' ? error : (error.message || String(error));
            if (errStr.toLowerCase().includes("premium") || errStr.toLowerCase().includes("upgrade")) {
                Swal.fire({
                    icon: 'warning',
                    title: '<span style="color:#8C6D39">Premium Feature</span>',
                    html: `<b>${error}</b>`,
                    confirmButtonText: 'Upgrade Now',
                    confirmButtonColor: '#8C6D39',
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
                toast.error(error);
            }
            dispatch(clearChatError());
        }
    }, [error, dispatch]);

    useEffect(() => {
        dispatch(setActiveChatUser(targetUser.id));
        dispatch(fetchChatHistory({ targetUserId: targetUser.id }));

        return () => {
            dispatch(setActiveChatUser(null));
        };
    }, [targetUser.id, dispatch]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        
        // Mark as read if the last message is from the other user
        if (chatData.messages.length > 0) {
            const lastMsg = chatData.messages[chatData.messages.length - 1];
            if (String(lastMsg.senderId) === String(targetUser.id)) {
                dispatch(markAllChatAsRead(targetUser.id));
            }
        }
    }, [chatData.messages, isMinimized, targetUser.id, dispatch]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            const messageDTO = {
                senderId: currentUser.id,
                recipientId: targetUser.id,
                content: message
                // Removed createdAt to let backend handle it via @CreationTimestamp
            };

            ChatService.sendMessage(messageDTO);
            setMessage('');
        } catch (err) {
            console.error("Error in handleSend:", err);
            toast.error("Failed to send message locally");
        }
    };

    if (isMinimized) {
        return (
            <div className="fixed bottom-0 right-4 w-64 bg-rose-500 text-white rounded-t-xl shadow-2xl z-[1100] flex items-center justify-between px-4 py-3 cursor-pointer"
                onClick={() => setIsMinimized(false)}>
                <div className="flex items-center gap-2">
                    <img src={targetUser.profilePhotoUrl || `https://i.pravatar.cc/40?u=${targetUser.id}`}
                        className="w-8 h-8 rounded-full border border-white/20" alt="" />
                    <span className="font-medium text-sm truncate">{formatDisplayName(targetUser.fullName, targetUser.displayNameVisibility, targetUser.id)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Maximize2 size={16} />
                    <X size={16} onClick={(e) => { e.stopPropagation(); onClose(); }} />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 right-4 w-80 md:w-96 h-[450px] bg-theme-surface rounded-t-2xl shadow-2xl z-[1100] flex flex-col border border-theme-border overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-4 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img
                            src={targetUser.profilePhotoUrl || `https://i.pravatar.cc/40?u=${targetUser.id}`}
                            className="w-10 h-10 rounded-full border-2 border-white/20"
                            alt={targetUser.fullName}
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-theme-success rounded-full border-2 border-white"></span>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm">{formatDisplayName(targetUser.fullName, targetUser.displayNameVisibility, targetUser.id)}</h4>
                        <p className="text-[10px] text-rose-100 italic">Encrypted Connection</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMinimized(true)} className="p-1 hover:bg-theme-surface/10 roundedTransition"><Minus size={18} /></button>
                    <button onClick={onClose} className="p-1 hover:bg-theme-surface/10 rounded-lg transition-all"><X size={18} /></button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                {loading && chatData.messages.length === 0 ? (
                    <div className="flex justify-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-500"></div></div>
                ) : chatData.messages.length === 0 ? (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Send size={24} className="text-gray-300" />
                        </div>
                        <p className="text-xs text-gray-400">Say hello to start the conversation!</p>
                    </div>
                ) : (
                    chatData.messages.map((msg, idx) => {
                        const isMe = String(msg.senderId) == String(currentUser.id);
                        return (
                            <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm ${isMe
                                    ? 'bg-rose-500 text-white rounded-tr-none'
                                    : 'bg-theme-surface text-gray-800 border border-gray-100 rounded-tl-none'
                                    }`}>
                                    <p className="leading-relaxed break-words">{msg.content}</p>
                                    <p className={`text-[9px] mt-1 text-right ${isMe ? 'text-rose-100' : 'text-gray-400'}`}>
                                        {format(new Date(msg.createdAt), 'HH:mm')}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-theme-surface border-t border-gray-100 flex items-center gap-2 shrink-0">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-rose-500/20 transition-all outline-none"
                />
                <button
                    type="submit"
                    disabled={!message.trim()}
                    className="w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/30 active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                    <Send size={18} />
                </button>
            </form>

            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up { animation: slide-up 0.3s ease-out; }
            `}</style>
        </div>
    );
}