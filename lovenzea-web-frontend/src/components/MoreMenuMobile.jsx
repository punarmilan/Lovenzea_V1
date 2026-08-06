import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../Slice/UserSlice";

const MoreMenuMobile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [isMobile, setIsMobile] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        moreMenu: false,
        helpSupport: false,
        legal: false
    });
    const [activeItem, setActiveItem] = useState(null);

    // Check if mobile device
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Menu sections exactly like the image
    const menuSections = [
        {
            id: "moreMenu",
            title: "More",
            icon: "fa-solid fa-ellipsis-h",
            items: [
                {
                    id: "sent",
                    label: "Sent",
                    icon: "fa-solid fa-paper-plane",
                    color: "text-blue-600",
                    path: "/sent"
                },
                {
                    id: "deleted",
                    label: "Deleted",
                    icon: "fa-solid fa-trash",
                    color: "text-red-600",
                    path: "/deleted"
                },
                {
                    id: "contactFilters",
                    label: "Contact Filters",
                    icon: "fa-solid fa-filter",
                    color: "text-purple-600",
                    path: "/contact-filters"
                },
                {
                    id: "termsConditions",
                    label: "Terms & Conditions",
                    icon: "fa-solid fa-file-contract",
                    color: "text-theme-text-secondary",
                    path: "/terms-conditions"
                },
                {
                    id: "contactUs",
                    label: "Contact Us",
                    icon: "fa-solid fa-headset",
                    color: "text-green-600",
                    path: "/contact-us"
                },
                {
                    id: "LovenZeaLive",
                    label: "LovenZea Live",
                    icon: "fa-solid fa-video",
                    color: "text-rose-600",
                    path: "/LovenZea-live"
                },
                {
                    id: "logout",
                    label: "Logout",
                    icon: "fa-solid fa-sign-out-alt",
                    color: "text-orange-600",
                    path: "/logout"
                },
                {
                    id: "downloadApp",
                    label: "Download the LovenZea.com App",
                    icon: "fa-solid fa-mobile-alt",
                    color: "text-teal-600",
                    path: "/download-app"
                }
            ]
        }
    ];


    // Set active item based on current route
    useEffect(() => {
        const currentPath = location.pathname;

        // Check main sections
        menuSections.forEach(section => {
            section.items.forEach(item => {
                if (item.path && (currentPath === item.path || currentPath.startsWith(item.path))) {
                    setActiveItem(item.id);
                    // Auto-expand the section if on a sub-item
                    if (!expandedSections[section.id]) {
                        setExpandedSections(prev => ({
                            ...prev,
                            [section.id]: true
                        }));
                    }
                }
            });
        });

        // Check additional sections

    }, [location.pathname]);

    // Toggle section expansion
    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    // Handle item click
    const handleItemClick = (itemId, path) => {
        setActiveItem(itemId);
        navigate(path);
    };

    // Handle logout
    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    // Handle download app
    const handleDownloadApp = () => {
        // Add your app download logic here
        console.log("Downloading app...");
        // Redirect to app store or show download modal
        window.open("https://play.google.com/store/apps/details?id=com.LovenZea.android", "_blank");
    };

    // Don't render on desktop
    if (!isMobile) return null;

    return (
        <div className="more-menu-mobile">
            {/* Main More Menu Section */}
            {menuSections.map(section => (
                <div key={section.id} className="bg-theme-surface rounded-xl shadow-sm border border-theme-border p-4 mb-4">
                    {/* Section Header with Toggle */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <i className={`${section.icon} text-gray-700 text-lg`}></i>
                            <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                        </div>

                        {/* Toggle Arrow */}
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="p-2 text-theme-text-secondary hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                            aria-label={expandedSections[section.id] ? "Collapse menu" : "Expand menu"}
                        >
                            <i className={`fa-solid fa-chevron-${expandedSections[section.id] ? 'up' : 'down'} transition-transform duration-300`}></i>
                        </button>
                    </div>

                    {/* Section Items (only when expanded) */}
                    {expandedSections[section.id] && (
                        <div className="mt-3  animate-fadeIn">
                            {section.items.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (item.id === "logout") {
                                            handleLogout();
                                        } else if (item.id === "downloadApp") {
                                            handleDownloadApp();
                                        } else {
                                            handleItemClick(item.id, item.path);
                                        }
                                    }}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeItem === item.id
                                        ? "bg-blue-50 border border-blue-100"
                                        : "hover:bg-gray-50"
                                        }`}
                                >
                                    <i className={`${item.icon} ${item.color} text-base`}></i>
                                    <span className={`font-medium ${activeItem === item.id
                                        ? "text-blue-600"
                                        : "text-gray-700"
                                        }`}>
                                        {item.label}
                                    </span>

                                    {/* Special indicators */}
                                    {item.id === "logout" && (
                                        <span className="ml-auto text-xs text-red-500 font-medium">⚠️</span>
                                    )}
                                    {item.id === "downloadApp" && (
                                        <span className="ml-auto text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full font-bold">
                                            NEW
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}


        </div>
    );
};

export default MoreMenuMobile;