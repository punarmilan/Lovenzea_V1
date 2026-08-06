import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("Home");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
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
            action: "openOnlineMembers"
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

    // Determine active tab based on route
    useEffect(() => {
        const path = location.pathname;
        if (path === "/my-shadi") setActiveTab("Home");
        else if (path.startsWith("/matches")) setActiveTab("Matches");
        else if (path.startsWith("/payment")) setActiveTab("Premium");
        else if (path.startsWith("/wedding")) setActiveTab("Wedding");
        else if (path.startsWith("/special-services")) setActiveTab("SpecialServices");
        // For Chat, it opens a panel, so we don't necessarily highlight it by path
    }, [location.pathname]);

    const handleTabClick = (tabId, path, action) => {
        setActiveTab(tabId);
        if (action === "openOnlineMembers") {
            // Trigger the global chat event
            window.dispatchEvent(new CustomEvent('open-chats-sidebar'));
            return;
        }
        if (path) {
            navigate(path);
        }
    };

    if (!isMobile) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[9999] shadow-[0_-5px_15px_rgba(0,0,0,0.05)] pb-safe md:hidden">
            <div className="flex justify-around items-center h-16 px-1 xs:px-2">
                {mobileTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id, tab.path, tab.action)}
                        className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${activeTab === tab.id
                            ? 'text-[#C5A059]'
                            : 'text-gray-400 hover:text-[#8C6D39]'
                            }`}
                    >
                        <div className="relative mb-1">
                            <i className={`${tab.icon} text-lg xs:text-xl`}></i>
                            {tab.badge && (
                                <span className="absolute -top-3 -right-4 xs:-right-5 bg-[#C5A059] text-white text-[8px] xs:text-[9px] font-bold px-1 py-0.5 rounded-full min-w-[16px] text-center shadow-sm whitespace-nowrap">
                                    {tab.badge}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] xs:text-[11px] font-medium tracking-tight truncate w-full text-center">{tab.label}</span>
                        {activeTab === tab.id && (
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 xs:w-12 h-1 bg-gradient-to-r from-[#C5A059] to-[#8C6D39] rounded-b-full"></div>
                        )}
                    </button>
                ))}
            </div>
            
            <style>{`
                .pb-safe {
                    padding-bottom: env(safe-area-inset-bottom, 0px);
                }
            `}</style>
        </nav>
    );
};

export default BottomNav;
