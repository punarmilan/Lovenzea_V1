import React, { useState, useEffect } from 'react';
import { User, Star, Bell, Package, X, ChevronDown, ChevronLeft, ChevronRight, Inbox, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationAsRead } from '../../../Slice/NotificationSlice';

export default function More({ isActive }) {
  const [showPopup, setShowPopup] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = (page) => {
    setShowPopup(false);

    // Route mapping
    const routes = {
      'contact-details': '/my-shadi/my-profile',
      'horoscope-details': '/my-shadi/my-profile',
      'my-orders': '/my-shadi/my-order',
      'my-tickets': '/my-tickets'
    };

    if (page === 'notifications') {
      setShowNotifications(true);
    } else if (routes[page]) {
      navigate(routes[page]);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowPopup(!showPopup)}
        className={`flex items-center gap-1 cursor-pointer font-medium transition-colors ${isActive ? 'text-rose-500' : 'text-theme-text-secondary hover:text-gray-900'}`}
        aria-label="More options"
      >
        <span>More</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${showPopup ? 'rotate-180' : ''}`}
        />
      </button>

      {/* More Options Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-theme-surface rounded-2xl shadow-2xl w-full max-w-sm animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-theme-border">
              <h2 className="text-xl font-bold text-gray-800">More Options</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-theme-text-secondary hover:text-gray-700 transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-2">
              <MenuItem
                icon={<User className="text-blue-600" size={22} />}
                text="My Contact Details"
                onClick={() => handleMenuClick('contact-details')}
              />
              <MenuItem
                icon={<Star className="text-yellow-600" size={22} />}
                text="Add Horoscope Details"
                onClick={() => handleMenuClick('horoscope-details')}
              />
              <MenuItem
                icon={<Bell className="text-green-600" size={22} />}
                text="Notifications"
                onClick={() => handleMenuClick('notifications')}
              />
              <MenuItem
                icon={<Package className="text-purple-600" size={22} />}
                text="My Orders"
                onClick={() => handleMenuClick('my-orders')}
              />
              <MenuItem
                icon={<Ticket className="text-rose-600" size={22} />}
                text="My Support Tickets"
                onClick={() => handleMenuClick('my-tickets')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Notifications Popup */}
      {showNotifications && (
        <NotificationPopup onClose={() => setShowNotifications(false)} />
      )}

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

function MenuItem({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:shadow-sm active:scale-98"
    >
      <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">
        {icon}
      </div>
      <span className="text-gray-700 font-medium text-left flex-1">{text}</span>
    </button>
  );
}

function NotificationPopup({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPages, totalItems, loading } = useSelector((state) => state.notifications);
  const [includeDeclined, setIncludeDeclined] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchNotifications({ page: currentPage - 1, size: itemsPerPage }));
  }, [dispatch, currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleProfileClick = (profileId) => {
    if (profileId) {
      navigate(`/matches/${profileId}`);
      onClose();
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-theme-surface rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-theme-border">
          <h2 className="text-xl md:text-2xl font-bold text-cyan-500 uppercase tracking-wide">
            Notifications
          </h2>
          <button
            onClick={onClose}
            className="text-theme-text-secondary hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filter Options */}
        <div className="px-5 md:px-6 py-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeDeclined}
                onChange={(e) => setIncludeDeclined(e.target.checked)}
                className="w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500"
              />
              <span className="text-sm text-theme-text-secondary">Include Declined Notifications</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-sm text-cyan-500 font-medium">All Notifications</span>
              <ChevronDown size={16} className="text-cyan-500" />
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto px-5 md:px-6 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-cyan-100 border-t-cyan-500 rounded-full animate-spin"></div>
              <p className="text-theme-text-secondary font-medium italic">Finding your latest updates...</p>
            </div>
          ) : items.length > 0 ? (
            <div className="space-y-3">
              {items.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onProfileClick={() => handleProfileClick(notification.referenceId)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Inbox size={32} className="text-gray-300" />
              </div>
              <p className="text-theme-text-secondary font-medium">No notifications yet.</p>
              <p className="text-sm text-gray-400">We'll notify you when something happens!</p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-5 md:px-6 py-4 border-t border-theme-border bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-text-secondary">
                Showing <span className="font-semibold">{startIndex + 1}-{Math.min(startIndex + items.length, totalItems)}</span> of <span className="font-semibold">{totalItems}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-all ${currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-theme-surface text-gray-700 hover:bg-gray-100 shadow-sm'
                    }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="px-3 py-1 bg-theme-surface border border-theme-border rounded-md text-sm font-medium text-gray-700">
                  {currentPage} / {totalPages}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-all ${currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-theme-surface text-gray-700 hover:bg-gray-100 shadow-sm'
                    }`}
                  aria-label="Next page"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}

function NotificationItem({ notification, onProfileClick }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  return (
    <div className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-transparent hover:border-theme-border ${!notification.read ? 'bg-cyan-50/30' : ''}`}>
      <div className="flex-shrink-0 relative">
        <div
          className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-gray-100 border border-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onProfileClick();
          }}
        >
          <img
            src={notification.senderPhotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.senderName || 'User')}&background=random`}
            alt={notification.senderName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.senderName || 'User')}&background=random`;
            }}
          />
        </div>
        {!notification.read && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-cyan-500 rounded-full border-2 border-white"></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col">
          <p className="text-sm md:text-base text-gray-800 leading-snug">
            <span
              className="font-bold text-gray-900 cursor-pointer hover:text-cyan-600 hover:underline transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onProfileClick();
              }}
            >
              {notification.senderName || 'System'}
            </span>
            <span className="ml-2 text-theme-text-secondary font-medium">
              {notification.message}
            </span>
          </p>
          <p className="text-xs text-gray-400 mt-1 font-medium italic">
            {notification.title}
          </p>
        </div>
      </div>

      <div className="flex-shrink-0">
        <span className={`inline-block text-[10px] md:text-xs px-2 md:px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${!notification.read ? 'bg-cyan-500 text-white shadow-sm' : 'bg-gray-100 text-theme-text-secondary'}`}>
          {formatDate(notification.createdAt)}
        </span>
      </div>
    </div>
  );
}