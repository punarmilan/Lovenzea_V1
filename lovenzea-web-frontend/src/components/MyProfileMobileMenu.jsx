import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const MyProfileMobileMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isMobile, setIsMobile] = useState(false);
    const [isProfileExpanded, setIsProfileExpanded] = useState(false);
    const [activeItem, setActiveItem] = useState("My Profile");

    // Check if mobile device
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Profile items exactly like MarathiShadi.com image
    const profileItems = [
        {
            id: "My Profile",
            icon: "fa-solid fa-user-circle",
            label: "My Profile",
            color: "text-rose-600",
            path: "/my-profile",
            isMain: true
        },
        {
            id: "View/Edit Profile",
            icon: "fa-solid fa-user-edit",
            label: "View/Edit Profile",
            color: "text-rose-600",
            path: "/profile/edit"
        },
        {
            id: "Edit Partner Preferences",
            icon: "fa-solid fa-heart-circle-check",
            label: "Edit Partner Preferences",
            color: "text-pink-600",
            path: "/partner-preferences"
        },
        {
            id: "Manage Photos",
            icon: "fa-solid fa-images",
            label: "Manage Photos",
            color: "text-blue-600",
            path: "/manage-photos"
        },
        {
            id: "Verify Mobile Number",
            icon: "fa-solid fa-mobile-screen",
            label: "Verify Mobile Number",
            color: "text-green-600",
            path: "/verify-mobile"
        },
        {
            id: "View/Edit Horoscope Details",
            icon: "fa-solid fa-star-and-crescent",
            label: "View/Edit Horoscope Details",
            color: "text-purple-600",
            path: "/horoscope-details"
        }
    ];

    // Set active item based on current route
    useEffect(() => {
        const currentPath = location.pathname;
        const matchedItem = profileItems.find(item =>
            item.path && (item.path === currentPath || currentPath.startsWith(item.path))
        );

        if (matchedItem) {
            setActiveItem(matchedItem.id);
            // Auto-expand if on a sub-item (optional)
            if (matchedItem.id !== "My Profile") {
                setIsProfileExpanded(true);
            }
        }
    }, [location.pathname]);

    // Toggle arrow icon - show/hide sub-items
    const handleArrowClick = () => {
        setIsProfileExpanded(!isProfileExpanded);
    };

    // Handle My Profile main item click
    const handleMyProfileClick = () => {
        setActiveItem("My Profile");
        navigate("/my-profile");
    };

    // Handle sub-item click
    const handleSubItemClick = (itemId, path) => {
        setActiveItem(itemId);
        navigate(path);
    };

    // Don't render on desktop
    if (!isMobile) return null;

    return (
        <div className="my-profile-mobile-section">
            <div className="bg-theme-surface rounded-xl shadow-sm border border-theme-border p-4 mb-4">
                {/* Section Header */}
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900">My Profile</h3>
                </div>

                {/* My Profile Main Item with Arrow */}
                <div className="border-b border-theme-border pb-3 mb-3">
                    <div className="flex items-center justify-between">
                        {/* Left side: Icon and Label */}
                        <button
                            onClick={handleMyProfileClick}
                            className={`flex items-center gap-3 p-2 rounded-lg flex-1 ${activeItem === "My Profile"
                                ? "bg-rose-50 text-rose-600"
                                : "hover:bg-gray-50 text-gray-700"
                                }`}
                        >
                            <i className="fa-solid fa-user-circle text-lg text-rose-600"></i>
                            <span className="font-medium">My Profile</span>
                        </button>

                        {/* Right side: Arrow Icon for toggle */}
                        <button
                            onClick={handleArrowClick}
                            className="p-2 text-theme-text-secondary hover:text-gray-700 hover:bg-gray-100 rounded-lg ml-2"
                            aria-label={isProfileExpanded ? "Collapse menu" : "Expand menu"}
                        >
                            <i className={`fa-solid fa-chevron-${isProfileExpanded ? 'up' : 'down'} transition-transform duration-300`}></i>
                        </button>
                    </div>
                </div>

                {/* Sub-items (shown only when expanded) */}
                {isProfileExpanded && (
                    <div className="space-y-2 ml-9 animate-fadeIn">
                        {profileItems
                            .filter(item => !item.isMain)
                            .map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleSubItemClick(item.id, item.path)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeItem === item.id
                                        ? "bg-rose-50 border border-rose-100"
                                        : "hover:bg-gray-50"
                                        }`}
                                >
                                    <i className={`${item.icon} ${item.color} text-base`}></i>
                                    <span className={`font-medium ${activeItem === item.id
                                        ? "text-rose-600"
                                        : "text-gray-700"
                                        }`}>
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProfileMobileMenu;