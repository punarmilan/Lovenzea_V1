import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    fetchNotifications,
    loadMoreNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from "../Slice/NotificationSlice";
import {
    User as UserIcon, Eye, CheckCircle, Heart, UserPlus,
    ShieldCheck, ShieldAlert, FileCheck, Bell, Check, Camera,
    ChevronDown, Loader2, X
} from "lucide-react";
import PremiumLock from "./PremiumLock";

// ── Filter tab definitions ───────────────────────────────────────────────
const FILTER_TABS = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'connection', label: 'Connection' },
    { key: 'match', label: 'Match' },
    { key: 'profile', label: 'Profile' },
    { key: 'system', label: 'System' },
];

const TYPE_TO_FILTER = {
    CONNECTION_REQUEST: 'connection',
    CONNECTION_ACCEPTED: 'connection',
    CONNECTION_DECLINED: 'connection',
    PHOTO_REQUEST: 'connection',
    NEW_MATCH: 'match',
    PROFILE_VIEW: 'profile',
    VERIFICATION_APPROVED: 'system',
    VERIFICATION_REJECTED: 'system',
    PROFILE_COMPLETION: 'system',
};

// ── Icon helpers ─────────────────────────────────────────────────────────
const getIcon = (type) => {
    const props = { size: 12 };
    switch (type) {
        case 'PROFILE_VIEW': return <Eye {...props} />;
        case 'CONNECTION_REQUEST': return <UserPlus {...props} />;
        case 'CONNECTION_ACCEPTED': return <CheckCircle {...props} />;
        case 'CONNECTION_DECLINED': return <X {...props} />;
        case 'NEW_MATCH': return <Heart {...props} />;
        case 'PHOTO_REQUEST': return <Camera {...props} />;
        case 'VERIFICATION_APPROVED': return <ShieldCheck {...props} />;
        case 'VERIFICATION_REJECTED': return <ShieldAlert {...props} />;
        case 'PROFILE_COMPLETION': return <FileCheck {...props} />;
        default: return <Bell {...props} />;
    }
};

const getIconBg = (type) => {
    switch (type) {
        case 'PROFILE_VIEW': return 'bg-blue-500';
        case 'CONNECTION_REQUEST': return 'bg-purple-500';
        case 'CONNECTION_ACCEPTED': return 'bg-theme-success';
        case 'CONNECTION_DECLINED': return 'bg-gray-400';
        case 'NEW_MATCH': return 'bg-pink-500';
        case 'PHOTO_REQUEST': return 'bg-cyan-500';
        case 'VERIFICATION_APPROVED': return 'bg-emerald-500';
        case 'VERIFICATION_REJECTED': return 'bg-red-500';
        case 'PROFILE_COMPLETION': return 'bg-theme-warning';
        default: return 'bg-gray-500';
    }
};

// ── Relative time helper ─────────────────────────────────────────────────
const timeAgo = (dateString) => {
    if (!dateString) return '';
    const diff = Date.now() - new Date(dateString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

// ── Main Component ────────────────────────────────────────────────────────
const Notifications = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: notifications, loading, currentPage, totalPages, unreadCount } = useSelector((state) => state.notifications);

    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedNotification, setSelectedNotification] = useState(null);

    useEffect(() => {
        dispatch(fetchNotifications({ page: 0, size: 20 }));
    }, [dispatch]);

    const handleMarkAsRead = useCallback((id) => {
        dispatch(markNotificationAsRead(id));
    }, [dispatch]);

    const handleMarkAllAsRead = useCallback(() => {
        dispatch(markAllNotificationsAsRead());
    }, [dispatch]);

    const handleLoadMore = useCallback(() => {
        if (!loading && currentPage + 1 < totalPages) {
            dispatch(loadMoreNotifications({ page: currentPage + 1, size: 20 }));
        }
    }, [dispatch, loading, currentPage, totalPages]);

    const handleNotificationClick = (notification) => {
        if (!notification.read) handleMarkAsRead(notification.id);

        // Prevent immediate navigation for profile completion or system messages.
        // Instead, show the full details modal.
        if (
            notification.type === 'VERIFICATION_APPROVED' ||
            notification.type === 'VERIFICATION_REJECTED' ||
            notification.type === 'PROFILE_COMPLETION' ||
            notification.type === 'SYSTEM' ||
            (!notification.referenceId && notification.type === 'GENERAL')
        ) {
            setSelectedNotification(notification);
            return;
        }

        // If there's a referenceId (usually means a profile ID), navigate to that profile
        if (notification.referenceId) {
            navigate(`/matches/${notification.referenceId}`);
            return;
        }

        // Navigate based on type (fallback)
        switch (notification.type) {
            case 'CONNECTION_REQUEST':
            case 'PROFILE_VIEW':
            case 'CONNECTION_DECLINED':
                navigate('/inbox/pending/intrest');
                break;
            case 'PHOTO_REQUEST':
                navigate('/inbox/pending/requests');
                break;
            case 'CONNECTION_ACCEPTED':
            case 'NEW_MATCH':
                navigate('/inbox/accepted/intrest');
                break;
            case 'VERIFICATION_APPROVED':
            case 'VERIFICATION_REJECTED':
            case 'PROFILE_COMPLETION':
                navigate('/myshadi/profile');
                break;
            default:
                navigate('/inbox/pending/intrest');
                break;
        }
    };

    // Filter logic
    const filteredNotifications = notifications.filter(n => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'unread') return !n.read;
        return TYPE_TO_FILTER[n.type] === activeFilter;
    });

    const filterCount = (key) => {
        if (key === 'all') return notifications.length;
        if (key === 'unread') return notifications.filter(n => !n.read).length;
        return notifications.filter(n => TYPE_TO_FILTER[n.type] === key).length;
    };

    return (
        <div className="bg-theme-surface rounded-lg border border-theme-border w-full max-w-sm mx-auto shadow-sm">
            {/* Header */}
            <div className="px-4 py-3 border-b border-theme-border flex items-center justify-between bg-gray-50/50 rounded-t-lg">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-800">Notifications</h2>
                    {unreadCount > 0 && (
                        <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                    >
                        <Check size={12} />
                        Mark all read
                    </button>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-100 px-2 pt-2 gap-1 scrollbar-none">
                {FILTER_TABS.map(tab => {
                    const count = filterCount(tab.key);
                    const isActive = activeFilter === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveFilter(tab.key)}
                            className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-t-md transition-all border-b-2 cursor-pointer ${isActive
                                ? 'border-rose-500 text-rose-600 bg-rose-50'
                                : 'border-transparent text-theme-text-secondary hover:text-gray-700'
                                }`}
                        >
                            {tab.label}
                            {count > 0 && (
                                <span className={`ml-1 text-[10px] px-1 rounded-full ${isActive ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-theme-text-secondary'}`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Notifications List */}
            <div className="divide-y divide-gray-100 max-h-[420px] overflow-y-auto">
                {loading && notifications.length === 0 ? (
                    <div className="p-8 text-center text-theme-text-secondary flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
                        <p className="text-sm">Loading notifications...</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 flex flex-col items-center gap-2">
                        <Bell className="w-10 h-10 opacity-20" />
                        <p className="text-sm">No {activeFilter !== 'all' ? activeFilter : ''} notifications</p>
                    </div>
                ) : (
                    filteredNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-rose-50/40' : ''}`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div className="flex items-start gap-3">
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    {notification.senderPhotoUrl ? (
                                        <img
                                            src={notification.senderPhotoUrl}
                                            alt={notification.senderName || 'User'}
                                            className={`w-10 h-10 rounded-full object-cover border border-theme-border ${notification.premiumVisible === false ? 'blur-[2px]' : ''}`}
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-theme-border">
                                            <UserIcon className="text-gray-400" size={20} />
                                        </div>
                                    )}
                                    <div className={`absolute -bottom-1 -right-1 ${getIconBg(notification.type)} text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white`}>
                                        {getIcon(notification.type)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-800 leading-snug line-clamp-2">
                                        {notification.senderName && (
                                            <span className="font-semibold">{notification.senderName} </span>
                                        )}
                                        {notification.message}
                                    </p>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-gray-400">{timeAgo(notification.createdAt)}</span>
                                        {!notification.read && (
                                            <span className="w-2 h-2 bg-rose-500 rounded-full ring-2 ring-rose-100 flex-shrink-0" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Load More */}
                {currentPage + 1 < totalPages && !loading && (
                    <div className="p-3 text-center">
                        <button
                            onClick={handleLoadMore}
                            className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 mx-auto cursor-pointer"
                        >
                            <ChevronDown size={14} />
                            Load more
                        </button>
                    </div>
                )}
                {loading && notifications.length > 0 && (
                    <div className="p-3 text-center">
                        <Loader2 className="w-4 h-4 text-rose-400 animate-spin mx-auto" />
                    </div>
                )}
            </div>

            {/* Notification Details Modal */}
            {selectedNotification && (
                <div className="fixed inset-0 z-[10010] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-theme-surface rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 border border-gray-100/50">
                        {/* Header Image/Pattern Background Option */}
                        <div className="h-24 bg-gradient-to-r from-rose-500 to-pink-500 absolute top-0 left-0 w-full opacity-10"></div>

                        {/* Header */}
                        <div className="flex justify-between items-center p-4 relative z-10">
                            <h3 className="font-bold text-gray-800 text-lg">Notification</h3>
                            <button
                                onClick={() => setSelectedNotification(null)}
                                className="text-gray-400 hover:text-gray-700 bg-theme-surface shadow-sm border border-gray-100 hover:bg-gray-50 p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 pb-6 pt-2 flex flex-col items-center gap-4 relative z-10">

                            {/* Profile / Icon Area */}
                            <div className="relative mb-2">
                                {/* Decorative ring */}
                                <div className="absolute inset-0 bg-rose-100 rounded-full animate-pulse blur-sm"></div>
                                <div className="relative">
                                    {selectedNotification.senderPhotoUrl ? (
                                        <img
                                            src={selectedNotification.senderPhotoUrl}
                                            alt={selectedNotification.senderName || 'System'}
                                            className={`w-20 h-20 rounded-full object-cover border-4 border-white shadow-md relative z-10 ${selectedNotification.premiumVisible === false ? 'blur-sm scale-110' : ''}`}
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-white shadow-md relative z-10">
                                            <UserIcon className="text-gray-400" size={32} />
                                        </div>
                                    )}
                                    <div className={`absolute -bottom-1 -right-1 z-20 ${getIconBg(selectedNotification.type)} text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm`}>
                                        {React.cloneElement(getIcon(selectedNotification.type), { size: 14 })}
                                    </div>
                                    {selectedNotification.premiumVisible === false && (
                                        <div className="absolute inset-0 z-[15] scale-75">
                                            <PremiumLock hideButton={true} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Title / Sender */}
                            <div className="text-center">
                                <h4 className="font-bold text-gray-900 text-lg">
                                    {selectedNotification.senderName || 'LovenZea Admin'}
                                </h4>
                                <p className="text-xs font-medium text-theme-text-secondary mt-0.5">
                                    {timeAgo(selectedNotification.createdAt)}
                                </p>
                            </div>

                            {/* Message Bubble */}
                            <div className="w-full mt-2 relative">
                                <div className="absolute top-0 left-1/2 -mt-2 -ml-2 w-4 h-4 bg-rose-50 transform rotate-45 border-t border-l border-rose-100/50 hidden"></div>
                                <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-4 rounded-xl border border-rose-100/50 shadow-inner text-sm text-gray-700 whitespace-pre-wrap leading-relaxed relative z-10">
                                    {selectedNotification.message}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50/80 flex flex-col gap-2 relative z-10">
                            <button
                                onClick={() => setSelectedNotification(null)}
                                className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white rounded-xl shadow-sm hover:shadow text-sm font-semibold transition-all"
                            >
                                Okay, got it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;