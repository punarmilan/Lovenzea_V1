import React, { useState, useEffect, useRef } from 'react';
import projectLogo from '../assets/image/project_logo_transperent.png';
import { HiHeart } from "react-icons/hi";
import HelpDropdown from "./HelpDropdown";
import Profile from "./Profile";
import profileImg from '../assets/image/profile.png'
import { Link, useLocation, useNavigate } from "react-router-dom";
import MyProfileMobileMenu from "./MyProfileMobileMenu";
import MoreMenuMobile from "./MoreMenuMobile";
import MobileProfile from "./MobileProfile";
import OnlineMembers from "./OnlineMembers";
import { useSelector, useDispatch } from 'react-redux';
import { fetchSubscriptionDetails } from '../Slice/UserSlice';
import { fetchMyProfile } from '../Slice/ProfileSlice';
import {
  ShieldCheck,
  CreditCard,
  Phone,
  Mail,
  ChevronDown,
  Menu,
  X,
  Bell,
  ChevronRight,
  Crown,
  Heart
} from "lucide-react";

const Header = () => {
    const [helpOpen, setHelpOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [showMyLovenZeaMenu, setShowMyLovenZeaMenu] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState("Home");
    const [activeDesktopMenu, setActiveDesktopMenu] = useState("Dashboard");


    // const [isMobile, setIsMobile] = useState(false);
    const [showOnlineMembers, setShowOnlineMembers] = useState(false);

    const helpRef = useRef(null);
    const profileRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { isAuthenticated, subscriptionDetails, user } = useSelector((state) => state.user);
    const { profile } = useSelector((state) => state.profile);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchSubscriptionDetails());
            if (!profile) {
                dispatch(fetchMyProfile());
            }
        }
    }, [isAuthenticated, dispatch, profile]);

    const isPremiumActive = subscriptionDetails?.active;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const [showPremiumDropdown, setShowPremiumDropdown] = useState(false);

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setMobileOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const mobileTabs = [
        {
            id: "Home",
            icon: "fa-solid fa-house",
            label: "Home",
            path: "/my-shadi"
        },
        {
            id: "Matches",
            icon: "fa-solid fa-heart",
            label: "Matches",
            path: "/matches"
        },

        {
            id: "Chat",
            icon: "fa-solid fa-message",
            label: "Chat",
            action: "openOnlineMembers" // Change from path to action
        },
        {
            id: "Premium",
            icon: "fa-solid fa-crown",
            badge: "85% OFF",
            label: "Premium",
            path: "/payment"
        },
        {
            id: "Wedding",
            icon: "fa-solid fa-ring",
            label: "Wedding",
            path: "/wedding"
        },
        {
            id: "SpecialServices",
            icon: "fa-solid fa-gem",
            label: "Special Services",
            path: "/special-services"
        }
    ];

    const handleTabClick = (tabId, path, action) => {
        setActiveTab(tabId);

        // Handle special action for Chat tab
        if (action === "openOnlineMembers") {
            setShowOnlineMembers(true);
            return;
        }

        // Navigate to path for other tabs
        if (path) {
            navigate(path);
        }
    };

    // Add handler to close OnlineMembers
    const handleCloseOnlineMembers = () => {
        setShowOnlineMembers(false);
        setActiveTab(""); // Reset active tab when closing
    };



    const desktopMenuItems = [
        {
            label: "Dashboard",
            icon: "fa-solid fa-house",
            path: "/my-shadi",
            onClick: () => {
                navigate("/my-shadi");
                setActiveDesktopMenu("Dashboard");
            }
        },
        {
            label: "Matches",
            icon: "fa-solid fa-heart",
            path: "/matches",
            onClick: () => {
                navigate("/matches?tab=new");
                setActiveDesktopMenu("Matches");
            }
        },

        // {
        //     label: "Log Out",
        //     path: "/",
        //     onClick: () => {
        //         navigate("/");
        //         setActiveDesktopMenu("Home");
        //     }
        // },
        {
            label: "Wedding",
            icon: "fa-solid fa-ring",
            path: "/wedding",
            onClick: () => {
                navigate("/wedding");
                setActiveDesktopMenu("Wedding");
            }
        },
        {
            label: "Special Services",
            icon: "fa-solid fa-gem",
            path: "/special-services",
            onClick: () => {
                navigate("/special-services");
                setActiveDesktopMenu("Special Services");
            }
        }
    ];

    // Update active tab based on current route
    useEffect(() => {
        const currentPath = location.pathname;

        // Sync Mobile Tabs
        const matchedTab = mobileTabs.find(tab =>
            tab.path === currentPath ||
            (tab.path && tab.path !== "/" && currentPath.startsWith(tab.path)) ||
            (tab.id === "Home" && (currentPath === "/my-shadi" || currentPath.startsWith("/my-shadi/")))
        );
        if (matchedTab) {
            setActiveTab(matchedTab.id);
        }

        // Sync Desktop Menu
        const matchedDesktopMenu = desktopMenuItems.find(item =>
            item.path === currentPath ||
            currentPath.startsWith(item.path) ||
            (item.label === "Dashboard" && currentPath.startsWith("/my-shadi")) ||
            (item.label === "Matches" && currentPath.startsWith("/matches")) ||
            (item.label === "Wedding" && currentPath.startsWith("/wedding")) ||
            (item.label === "Special Services" && currentPath.startsWith("/special-services"))
        );
        if (matchedDesktopMenu) {
            setActiveDesktopMenu(matchedDesktopMenu.label);
        }
    }, [location.pathname, navigate]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (helpRef.current && !helpRef.current.contains(e.target)) setHelpOpen(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) setMobileOpen(false);
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
        };
    }, []);

    const [dropdownOpen, setDropdownOpen] = useState(null);
    const dropdownTimeoutRef = useRef(null);

    const handleMouseEnter = (label) => {
        if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
        setDropdownOpen(label);
    };

    const handleMouseLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => {
            setDropdownOpen(null);
        }, 150); // Small delay to prevent flickering
    };


    const [activeMenuItem, setActiveMenuItem] = useState("My Profile");
    const menuItems = [
        {
            id: "Account & Settings",
            icon: "fa-solid fa-cog",
            label: "Account & Settings",
            color: "text-gray-600",
            path: "/my-shadi/settings"
        },
        {
            id: "Notifications",
            icon: "fa-solid fa-bell",
            label: "Notifications",
            color: "text-amber-600",
            count: "3",
            path: "/notifications"
        },
        {
            id: "Be Safe Online",
            icon: "fa-solid fa-shield-halved",
            label: "Be Safe Online",
            color: "text-teal-600",
            path: "/safety"
        },
        {
            id: "Help & Support",
            icon: "fa-solid fa-circle-question",
            label: "Help & Support",
            color: "text-indigo-600",
            path: "/help"
        },
        {
            id: "Log Out",
            icon: "fa-solid fa-sign-out-alt",
            label: "Log Out",
            color: "text-rose-600",
            path: "/"
        }
    ];

    const handleMenuItemClick = (itemId, path) => {
        setActiveMenuItem(itemId);
        navigate(path);
    };

    // Update active menu item based on current route
    React.useEffect(() => {
        const currentPath = location.pathname;
        const matchedItem = menuItems.find(item =>
            item.path === currentPath ||
            currentPath.startsWith(item.path)
        );

        if (matchedItem) {
            setActiveMenuItem(matchedItem.id);
        }
    }, [location.pathname]);

    return (
        <>
            {/* MAIN HEADER - Now fully visible on all devices */}
            <header className="w-full bg-gradient-to-r from-slate-100 via-gray-50 to-slate-100 text-slate-800 shadow-sm border-b border-slate-200/80 fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="flex justify-between items-center h-12 xs:h-14 sm:h-16 px-2 xs:px-1 sm:px-4 md:px-2">
                        {/* LOGO */}
                        <Link to="/my-shadi" className="hover:opacity-90 transition-opacity">

                            <div className="flex items-center gap-0">
                                <img src={projectLogo} alt="LovenZea Logo" className="w-14 h-14 sm:w-16 sm:h-16 object-cover drop-shadow-xl hover:scale-105 transition-transform duration-300" />
                                <span className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-800 drop-shadow-sm flex items-center ml-[1px]">
                                    Loven<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d94f73] to-rose-500">Zea</span>
                                </span>
                            </div>

                          </Link>

                        {/* RIGHT SIDE - All items visible on all screens */}
                        <div className="flex items-center gap-3">

                    {/* Saved Profiles */}
                    <button
                        onClick={() => navigate("/my-shadi/saved-profiles")}
                        className="relative p-2 rounded-full text-slate-600 hover:text-rose-500 hover:bg-slate-100 transition"
                        title="Likes & Shortlisted"
                    >
                        <Heart size={20} />
                    </button>

                    {/* Notification */}
                    <button
                        onClick={() => navigate("/notifications")}
                        className="relative p-2 rounded-full text-slate-600 hover:text-rose-500 hover:bg-slate-100 transition"
                    >
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                    </button>

                    {/* Profile */}
                    <div className="flex items-center" ref={profileRef}>
                        <Profile />
                    </div>

                    {/* Hamburger */}
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2 rounded-full text-slate-600 hover:text-rose-500 hover:bg-slate-100 transition"
                    >
                        <Menu size={22} />
                    </button>

                </div>
                    </div>
                </div>
            </header>

            {/* Add safe area padding for devices with notches */}
            <style>{`
                .safe-area-pb {
                    padding-bottom: env(safe-area-inset-bottom);
                }
            `}</style>

            {/* At the end of your component, before closing tag */}
            {isMobile && showOnlineMembers && (
                <OnlineMembers
                    open={showOnlineMembers}
                    setOpen={setShowOnlineMembers}
                    onClose={handleCloseOnlineMembers}
                />
            )}

            {/* Overlay */}
{mobileOpen && (
    <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[998]"
        onClick={() => setMobileOpen(false)}
    />
)}

{/* Right Drawer */}
<div
    ref={mobileMenuRef}
    className={`fixed top-4 right-0 h-[calc(100vh-16px)] w-[85%] max-w-[280px] sm:max-w-[320px] lg:max-w-[400px]
        bg-white/95 backdrop-blur-md border-l border-white/80
        rounded-tl-[32px]
        shadow-[0_20px_60px_rgba(0,0,0,0.18)]
        z-[999]
        transition-all duration-300
        overflow-hidden
        ${
            mobileOpen
                ? "translate-x-0"
                : "translate-x-full"
        }`}
        >

    {/* Header */}
    <div className="bg-gradient-to-br from-pink-50 to-rose-100/50 p-4 sm:p-6 text-gray-900 border-b border-rose-100 rounded-tl-[32px]">

        <div className="flex justify-between items-start">
            <div className="flex gap-3">

                <img
                    src={profile?.profilePhotoUrl || user?.profilePhotoUrl || profileImg}
                    alt=""
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-white shadow-sm"
                />
                <div className="mt-1 sm:mt-2">
                    <h2 className="text-lg sm:text-xl font-bold font-serif text-rose-600 leading-tight">
                        {profile?.fullName || user?.fullName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User')}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 opacity-90">
                        {profile?.profileId || user?.profileId || ''}
                    </p>
                </div>
            </div>
            <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100/50 text-gray-400 hover:text-gray-600 transition"
            >
                <X size={24} />
            </button>
        </div>

        <button
            onClick={() => navigate("/payment")}
            className="w-full mt-4 sm:mt-5 bg-gradient-to-r from-[#C5A059] to-[#8C6D39] hover:from-[#B59049] hover:to-[#7C5D29] text-white font-bold py-2.5 sm:py-3 text-sm sm:text-base rounded-xl shadow-md shadow-[#C5A059]/30 hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
            <Crown size={18} className="text-white fill-white sm:w-[20px] sm:h-[20px]" />
            Upgrade Membership
        </button>
    </div>

    {/* Menu */}
    <div className="p-4 overflow-y-auto h-[calc(100%-180px)]">

        {/* Main Menus */}
        <div className="space-y-2 mb-6">

            {desktopMenuItems.map((item) => (
                <button
                    key={item.label}
                    onClick={() => {
                        item.onClick();
                        setMobileOpen(false);
                    }}
                    className={`w-full flex justify-between items-center px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition ${
                        activeDesktopMenu === item.label
                            ? "bg-gradient-to-r from-rose-100 to-pink-50 border border-pink-200 text-rose-700 font-bold shadow-sm"
                            : "text-gray-600 font-medium hover:bg-gray-100 hover:text-rose-600"
                    }`}
                >
                    <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                        <i className={`${item.icon} ${activeDesktopMenu === item.label ? 'text-rose-600' : 'text-gray-400'}`}></i>
                        <span>{item.label}</span>
                    </div>
                    <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                </button>
            ))}
        </div>

        {/* Premium Card */}
        {isPremiumActive && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 mb-5">

                <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="text-amber-600" size={18} />
                    <span className="font-semibold">
                        Premium Active
                    </span>
                </div>

                <p className="text-sm text-gray-600">
                    Plan: {subscriptionDetails?.planName}
                </p>

                <p className="text-sm text-gray-600">
                    Valid Till: {formatDate(subscriptionDetails?.expiryDate)}
                </p>

                <div className="mt-3 bg-white rounded-full h-2">
                    <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                            width: `${
                                (subscriptionDetails?.balance /
                                    (subscriptionDetails?.totalConnects || 1)) *
                                100
                            }%`
                        }}
                    />
                </div>

            </div>
        )}

        {/* Other Menu Items */}
        <div className="space-y-2">

            {menuItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => {
                        handleMenuItemClick(item.id, item.path);
                        setMobileOpen(false);
                    }}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-xl transition ${
                        activeMenuItem === item.id
                            ? "bg-rose-50 text-rose-600"
                            : "hover:bg-gray-50"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <i className={item.icon}></i>
                        <span>{item.label}</span>
                    </div>

                    <ChevronRight size={16} />
                </button>
            ))}

        </div>
    </div>
</div>
        </>
    );
};

export default Header;
