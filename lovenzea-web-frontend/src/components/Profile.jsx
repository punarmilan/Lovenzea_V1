import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Slice/UserSlice';
// Removed default placeholder import

const Profile = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user: authUser, subscriptionDetails } = useSelector((state) => state.user);
    const { profile } = useSelector((state) => state.profile);
    const { summary } = useSelector((state) => state.dashboard);

    const displayUser = summary?.user || profile || authUser;
    const isPremium = subscriptionDetails?.active || displayUser?.isPremium;
    const photoUrl = displayUser?.profilePhotoUrl || displayUser?.profileImage || displayUser?.profile?.profilePictureUrl || displayUser?.profile?.profilePhotoUrl;

    // Check if mobile and handle outside click
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            window.removeEventListener('resize', checkMobile);
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    // Profile menu items with navigation logic
    const menuItems = [
        {
            icon: 'fa-solid fa-user',
            label: 'My Profile',
            onClick: () => navigate('/my-shadi/my-profile'),
            description: 'View and edit your profile'
        },
        {
            icon: 'fa-solid fa-envelope',
            label: 'Email / SMS Alerts',
            onClick: () => navigate('/my-shadi/settings'),
            description: 'Manage your notifications',
            badge: '2 New'
        },
        {
            icon: 'fa-solid fa-gear',
            label: 'Account Settings',
            onClick: () => navigate('/my-shadi/settings'),
            description: 'Manage your account preferences'
        },
        {
            icon: 'fa-solid fa-lock',
            label: 'Privacy Options',
            onClick: () => navigate('/my-shadi/settings'),
            description: 'Control your privacy settings'
        },
        {
            icon: 'fa-solid fa-filter',
            label: 'Contact Filters',
            onClick: () => navigate('/my-shadi/settings'),
            description: 'Manage who can contact you'
        },
        {
            icon: 'fa-solid fa-right-from-bracket',
            label: 'Logout',
            onClick: () => {
                dispatch(logout());
                navigate('/');
            },
            description: 'Sign out from your account',
            color: 'red'
        }
    ];

    // Handle menu item click
    const handleMenuItemClick = (item) => {
        setIsOpen(false);
        if (item.onClick) {
            item.onClick();
        }
    };

    // Handle upgrade click
    const handleUpgradeClick = () => {
        setIsOpen(false);
        navigate('/payment');
    };

    // Handle compare memberships click
    const handleCompareClick = () => {
        setIsOpen(false);
        navigate('/payment');
    };

    return (
        <div className="relative z-[999]" ref={dropdownRef}>
            {/* Profile Button - Now visible on all screens */}
            <button
                onClick={() => navigate('/my-shadi/my-profile')}
                className="flex items-center gap-1 xs:gap-2 px-1.5 xs:px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-theme-surface/10 transition-colors group"
                aria-label="Profile"
            >
                <div className="relative">
                    <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-full overflow-hidden border-2 border-white/70 group-hover:border-white bg-theme-surface/10 flex items-center justify-center">
                        {photoUrl ? (
                            <img
                                src={photoUrl}
                                alt={displayUser?.fullName || "Profile"}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <i className="fa-solid fa-user text-white text-xs"></i>
                        )}
                    </div>
                    {/* Premium Badge */}
                    {isPremium && (
                        <div className="absolute -top-1.5 -right-1.5 bg-amber-400 text-white rounded-full w-3.5 h-3.5 xs:w-4 xs:h-4 flex items-center justify-center border border-white shadow-sm z-10">
                            <i className="fa-solid fa-crown text-[6px] xs:text-[7px]"></i>
                        </div>
                    )}
                    {/* Online Status Indicator */}
                    <div className="absolute bottom-0 right-0 w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 bg-theme-success rounded-full border-2 border-white"></div>
                </div>

                {/* Text shown on md+ screens */}
                <div className="text-left hidden md:block">
                    <p className="text-[12px] font-bold text-gray-800 leading-tight truncate max-w-[120px]">{displayUser?.fullName || displayUser?.profileId || 'User'}</p>
                    <p className="text-[9px] text-theme-text-secondary font-bold uppercase tracking-tighter mt-0.5">{isPremium ? 'Premium member' : 'Free Account'}</p>
                </div>

                {/* Chevron removed since there is no dropdown */}
            </button>

            {/* Dropdown Menu removed per user request */}
        </div>
    );
};

export default Profile;
