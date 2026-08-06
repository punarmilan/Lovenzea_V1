import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function InboxNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { id: "Received", path: "/inbox/pending/intrest" },
        { id: "Accepted", path: "/inbox/accepted/intrest" },
        { id: "Requests", path: "/inbox/pending/requests" },
        { id: "Sent", path: "/inbox/sent/request" },
        { id: "Contacts", path: "/inbox/contacts" },
        { id: "Deleted", path: "/inbox/archieved/intrest" },
    ];

    // Get active tab from current URL path
    const getActiveTabFromPath = () => {
        const currentPath = location.pathname;
        const activeTab = tabs.find(tab =>
            tab.path && (currentPath === tab.path || currentPath.startsWith(tab.path + "/"))
        );
        return activeTab?.id || "Received";
    };

    const [active, setActive] = useState(getActiveTabFromPath());

    // Update active tab when URL changes
    useEffect(() => {
        setActive(getActiveTabFromPath());
    }, [location.pathname]);

    const handleTabClick = (tab) => {
        setActive(tab.id);
        navigate(tab.path);
    };

    return (
        <>
            {/* Mobile/Tablet View (below 768px) */}
            <div className="md:hidden">
                <div className="pt-12 xs:pt-14">
                    <div className="w-full bg-white/40 backdrop-blur-md shadow-sm border-b border-white/50">
                        <div className="w-full overflow-x-auto scrollbar-hide">
                            <div className="flex min-w-max px-4 sm:px-6 h-12 items-center gap-1 justify-center">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabClick(tab)}
                                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap ${active === tab.id
                                            ? "text-red-500 bg-white/40 backdrop-blur-md border-b-2 border-red-500"
                                            : "text-theme-text-secondary hover:text-gray-900 hover:bg-gray-50"
                                            }`}
                                    >
                                        {tab.id}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop View (768px+) */}
            <div className="hidden md:block">
                <div className="pt-14 lg:pt-16">
                    <div className="w-full bg-white/40 backdrop-blur-md shadow-sm border-b border-white/50">
                        <div className="max-w-7xl mx-auto w-full">
                            <div className="overflow-x-auto scrollbar-hide">
                                <ul className="flex gap-0 px-4 sm:px-6 lg:px-8 h-12 items-end min-w-max justify-center">
                                    {tabs.map((tab) => (
                                        <li
                                            key={tab.id}
                                            onClick={() => handleTabClick(tab)}
                                            className={`cursor-pointer px-6 pb-3 text-base font-medium whitespace-nowrap relative transition-all ${active === tab.id
                                                ? "text-red-500"
                                                : "text-theme-text-secondary hover:text-gray-900"
                                                }`}
                                        >
                                            {tab.id}
                                            {/* Bottom border indicator */}
                                            {active === tab.id && (
                                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add CSS for hiding scrollbar */}
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </>
    );
}
