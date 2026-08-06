import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Heart, Star, MessageSquare, CheckCircle, Clock, Trash2 } from 'lucide-react';
import Header from '../components/Headers';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'match',
      icon: <Heart className="text-rose-500" size={24} />,
      title: 'New Match Found!',
      message: 'Aisha Sharma matches your partner preferences perfectly. Check her profile.',
      time: '10 mins ago',
      unread: true,
      color: 'bg-rose-100',
    },
    {
      id: 2,
      type: 'message',
      icon: <MessageSquare className="text-blue-500" size={24} />,
      title: 'New Message',
      message: 'Rahul sent you a message: "Hi, I really liked your profile..."',
      time: '1 hour ago',
      unread: true,
      color: 'bg-blue-100',
    },
    {
      id: 3,
      type: 'system',
      icon: <Star className="text-amber-500" size={24} />,
      title: 'Premium Activated',
      message: 'Your Gold Subscription has been successfully activated. Enjoy premium features!',
      time: 'Yesterday',
      unread: false,
      color: 'bg-amber-100',
    },
    {
      id: 4,
      type: 'profile',
      icon: <CheckCircle className="text-emerald-500" size={24} />,
      title: 'Profile Verified',
      message: 'Your documents have been successfully verified. You now have a verified badge.',
      time: '2 days ago',
      unread: false,
      color: 'bg-emerald-100',
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-[#f8f5f2] font-sans">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
        <div className="bg-theme-surface rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center">
                <Bell size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 font-serif">Notifications</h1>
                <p className="text-sm text-theme-text-secondary font-medium">You have {unreadCount} unread notifications</p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-sm font-semibold text-theme-magenta hover:text-theme-pink px-4 py-2 bg-[#FAF6F0] hover:bg-[#F0E6D2] rounded-full transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            <AnimatePresence>
              {notifications.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Bell className="mx-auto text-gray-300 mb-4" size={48} />
                  <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
                  <p className="text-theme-text-secondary">You have no new notifications right now.</p>
                </motion.div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                    className={`relative p-4 md:p-5 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row gap-4 group cursor-pointer ${
                      notification.unread ? 'bg-theme-surface border-rose-100 shadow-md' : 'bg-gray-50/50 border-transparent hover:bg-gray-50 hover:shadow-sm'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    {/* Unread dot */}
                    {notification.unread && (
                      <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-rose-500 rounded-full"></div>
                    )}
                    
                    <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${notification.color}`}>
                      {notification.icon}
                    </div>

                    <div className="flex-1">
                      <h4 className={`text-base font-bold mb-1 ${notification.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h4>
                      <p className="text-sm text-theme-text-secondary mb-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                        <Clock size={14} />
                        {notification.time}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="absolute bottom-4 right-4 md:static md:self-center opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
