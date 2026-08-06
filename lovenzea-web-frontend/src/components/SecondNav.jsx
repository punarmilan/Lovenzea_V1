import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import ProfileAside from "./ProfileAside";
import More from "../pages/myshadi/more/More";
import { logout } from "../Slice/UserSlice";

export default function SecondNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const fileInputRef = useRef(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const { summary } = useSelector((state) => state.dashboard);
    const user = summary?.user;

    const myShadiTabs = [
        { id: "Dashboard", path: "/my-shadi", icon: "fa-solid fa-border-all", color: "text-amber-500" },
        { id: "Profile", path: "/my-shadi/my-profile", subPaths: ["/my-shadi/edit-profile", "/my-shadi/my-photos", "/my-shadi/partner-preferences"], icon: "fa-regular fa-user", color: "text-cyan-500" },
        { id: "Interests", path: "/inbox", icon: "fa-regular fa-handshake", color: "text-rose-500" },
        { id: "Chat list", path: "/my-shadi/chats", icon: "fa-regular fa-comment-dots", color: "text-indigo-500" },
        { id: "Plan", path: "/payment", icon: "fa-regular fa-credit-card", color: "text-emerald-500" },
        { id: "Setting", path: "/my-shadi/settings", icon: "fa-solid fa-gear", color: "text-slate-500" },
        { id: "Log out", path: "/logout", icon: "fa-solid fa-right-from-bracket", color: "text-red-500" },
    ];

    const matchesTabs = [
        { id: "Dashboard", path: "/my-shadi", icon: "fa-solid fa-border-all" },
        { id: "New Matches", path: "/matches?tab=new", icon: "fa-solid fa-bolt" },
        { id: "Near Me", path: "/matches?tab=nearme", icon: "fa-solid fa-location-dot" },
        { id: "Viewed My Profile", path: "/matches?tab=viewedme", icon: "fa-solid fa-eye" },
    ];

    const searchTabs = [
        { id: "Basic Search", path: "/search", icon: "fa-solid fa-magnifying-glass" },
        { id: "Advance Search", path: "/search/advance", icon: "fa-solid fa-sliders" }
    ];

    const isMatchesPage = location.pathname.startsWith("/matches");
    const isSearchPage = location.pathname.startsWith("/search");
    const tabs =
        isMatchesPage ? matchesTabs :
        isSearchPage ? searchTabs :
        myShadiTabs;

    const getActiveTabFromPath = () => {
        const currentPath = location.pathname;
        const exactMatch = tabs.find((tab) => tab.path === currentPath);
        if (exactMatch) return exactMatch.id;
        const subPathMatch = tabs.find((tab) =>
            tab.subPaths?.some((sp) => currentPath === sp || currentPath.startsWith(sp + "/"))
        );
        if (subPathMatch) return subPathMatch.id;
        const prefixMatch = [...tabs]
            .filter((tab) => tab.path && tab.path !== "/my-shadi")
            .sort((a, b) => b.path.length - a.path.length)
            .find((tab) => currentPath.startsWith(tab.path + "/"));
        if (prefixMatch) return prefixMatch.id;
        if (currentPath.startsWith("/inbox")) return "Interests";
        if (currentPath === "/my-shadi") return "Dashboard";
        return "";
    };

    const [active, setActive] = useState(getActiveTabFromPath());
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setActive(getActiveTabFromPath());
    }, [location.pathname]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (isMatchesPage) {
            const params = new URLSearchParams(location.search);
            const tab = params.get("tab");
            if (tab === "new") setActive("New Matches");
            else if (tab === "today") setActive("Today's Match");
            else if (tab === "my") setActive("My Matches");
            else if (tab === "near") setActive("Near Me");
            else if (tab === "more") setActive("More Matches");
        } else if (isSearchPage) {
            const params = new URLSearchParams(location.search);
            const tab = params.get("tab");
            if (tab === "advance") setActive("Advance Search");
            else setActive("Basic Search");
        }
    }, [location.search, isMatchesPage, isSearchPage]);

    const handleTabClick = (tab) => {
        if (tab.id === "Log out") {
            dispatch(logout());
            navigate("/");
            toast.success("Logged out successfully");
            return;
        }

        if (tab.component) {
            setActive(tab.id);
        } else {
            setActive(tab.id);
            navigate(tab.path);
        }
    };

    const handleAddPicture = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        let file = e.target.files[0];
        if (!file) return;
        setPhotoPreview(URL.createObjectURL(file));
        toast.success("Photo selected");
        // Add upload logic here if needed
    };

    return (
        <>
            {/* Desktop View (768px+) */}
            <div className="hidden md:block">
                <ProfileAside 
                    user={user}
                    tabs={tabs}
                    active={active}
                    handleTabClick={handleTabClick}
                    handleEditProfile={() => navigate('/my-shadi/edit-profile')}
                    photoPreview={photoPreview}
                    handleAddPicture={handleAddPicture}
                    fileInputRef={fileInputRef}
                    handleFileChange={handleFileChange}
                />
            </div>

            {/* Mobile View (< 768px) - Bottom Navigation Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-theme-surface border-t border-gray-100 z-[9999] shadow-[0_-10px_20px_rgba(0,0,0,0.05)] pb-safe">
                 <div className="flex overflow-x-auto scrollbar-hide items-center justify-start sm:justify-center h-16 px-1 xs:px-2">
                     {tabs.map(tab => (
                         <button 
                             key={tab.id}
                             onClick={() => handleTabClick(tab)}
                             className={`flex flex-col items-center justify-center flex-shrink-0 min-w-[72px] sm:min-w-[80px] h-full relative transition-all duration-300 ${active === tab.id ? `${tab.color || 'text-theme-magenta'} scale-105 font-bold` : `${tab.color || 'text-gray-400'} opacity-70 hover:opacity-100 font-medium`}`}
                         >
                             <div className="relative mb-1">
                                 <i className={`${tab.icon} text-lg xs:text-xl drop-shadow-sm`}></i>
                             </div>
                             <span className="text-[10px] xs:text-[11px] tracking-tight truncate w-[90%] text-center">{tab.id}</span>
                             {active === tab.id && (
                                <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-8 xs:w-12 h-1 bg-current rounded-b-full opacity-80`}></div>
                             )}
                         </button>
                     ))}
                 </div>
            </div>

            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .pb-safe {
                    padding-bottom: env(safe-area-inset-bottom, 0px);
                }
            `}</style>
        </>
    );
}
