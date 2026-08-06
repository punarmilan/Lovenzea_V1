import React from "react";
import {
    UserIcon,
    Camera,
    Phone,
    Edit,
    LayoutDashboard,
    User,
    Images,
    Heart,
    Settings,
    Search,
    MapPin,
    Users,
    Star,
    Sliders,
    MessageCircle,
    CreditCard,
    LogOut,
    Handshake,
    Crown,
} from "lucide-react";

// Map tab IDs to Lucide icons
const TAB_ICONS = {
    Dashboard:              LayoutDashboard,
    Profile:                User,
    Interests:              Handshake,
    "Chat list":            MessageCircle,
    Plan:                   CreditCard,
    Setting:                Settings,
    "Log out":              LogOut,
    "My Profile":           User,
    "My Photos":            Images,
    "Partner Preferences":  Sliders,
    Settings:               Settings,
    "New Matches":          Star,
    "Today's Match":        Heart,
    "My Matches":           Users,
    "Near Me":              MapPin,
    "More Matches":         Search,
};

export default function ProfileAside({
    user,
    tabs,
    active,
    handleTabClick,
    handleEditProfile,
    photoPreview,
    handleAddPicture,
    fileInputRef,
    handleFileChange,
}) {
    return (
        <aside
            className="
                hidden md:block
                w-full max-w-[250px]
                flex-shrink-0
            "
        >
            <div
                className="
                    bg-gradient-to-b from-[#F7C7B8]/30 to-[#E88C8C]/30
                    backdrop-blur-xl
                    rounded-3xl
                    border border-white/50
                    shadow-[0_12px_35px_rgba(222,120,120,0.12)]
                    overflow-hidden
                "
            >
                {/* ── Profile Section ── */}
                <div
                    className="
                        flex items-center gap-3 p-3
                        bg-white/40
                        border-b border-white/30
                    "
                >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div
                            className="
                                w-[56px] h-[56px] rounded-full overflow-hidden
                                border-4 border-white shadow-md
                                ring-2 ring-[#E88C8C]
                                bg-white/50 flex items-center justify-center
                            "
                        >
                            {photoPreview || user?.profilePhotoUrl ? (
                                <img
                                    src={photoPreview || user?.profilePhotoUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <UserIcon size={32} className="text-[#6B5A5A]" />
                            )}
                        </div>

                        {/* Camera button */}
                        <button
                            onClick={handleAddPicture}
                            className="
                                absolute -bottom-1 -right-1
                                w-7 h-7 rounded-full
                                bg-gradient-to-r from-[#E88C8C] to-[#B54768]
                                text-white flex items-center justify-center
                                shadow-lg hover:scale-110 transition-all
                            "
                        >
                            <Camera size={13} />
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,.heic,.heif"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    {/* User details */}
                    <div className="flex-1 min-w-0">
                        <span
                            className="
                                px-2 py-0.5 text-[10px] font-extrabold
                                bg-[#B54768]/10 text-[#B54768] rounded-full inline-block mb-1 uppercase tracking-wider
                            "
                        >
                            {user?.profileId || "Loading..."}
                        </span>

                        <h3 className="text-[15px] font-bold text-[#5A2332] truncate leading-tight">
                            {user?.fullName || (
                                <span className="animate-pulse text-gray-400">
                                    Loading...
                                </span>
                            )}
                        </h3>

                        <div className="flex items-center gap-1.5 text-[#6B5A5A] text-xs mt-0.5">
                            <Phone size={12} className="text-[#E88C8C]" />
                            <span className="truncate font-medium">
                                {user?.mobileNumber || "Fetching..."}
                            </span>
                        </div>

                        <button
                            onClick={handleEditProfile}
                            className="
                                mt-2 inline-flex items-center gap-1.5
                                px-4 py-1.5 rounded-full
                                bg-gradient-to-r from-[#E88C8C] to-[#B54768] text-white
                                text-xs font-semibold
                                hover:shadow-[0_4px_10px_rgba(222,120,120,0.2)] transition-all
                            "
                        >
                            <Edit size={11} />
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* ── Tab Menu ── */}
                <nav className="p-2 space-y-0.5">
                    {tabs.map((tab) => {
                        const Icon = TAB_ICONS[tab.id] || LayoutDashboard;
                        const isActive = active === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab)}
                                className={`
                                    w-full flex items-center gap-3
                                    px-3 py-2 rounded-xl
                                    text-[13px] font-semibold
                                    transition-all duration-200 border
                                    ${
                                        isActive
                                            ? "bg-gradient-to-r from-[#E88C8C] to-[#B54768] text-white border-transparent shadow-[0_4px_15px_rgba(222,120,120,0.2)]"
                                            : "text-[#6B5A5A] hover:bg-white/50 hover:text-[#B54768] border-transparent"
                                    }
                                `}
                            >
                                {/* Icon pill */}
                                <div
                                    className={`
                                        w-7 h-7 rounded-lg flex items-center justify-center
                                        flex-shrink-0 transition-all
                                        ${isActive ? "bg-transparent" : "bg-white/40 shadow-sm border border-white/20"}
                                    `}
                                >
                                    <Icon
                                        size={14}
                                        className={
                                            isActive
                                                ? "text-white"
                                                : "text-[#B54768]"
                                        }
                                    />
                                </div>

                                <span className={isActive ? "text-white font-bold" : "font-medium"}>{tab.id}</span>

                                {/* Active indicator dot */}
                                {isActive && (
                                    <span className="ml-auto w-1.5 h-5 rounded-full bg-white flex-shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* ── Upgrade Plan Banner ── */}
                <div className="p-3 mx-3 mb-3 mt-1 rounded-xl bg-white/40 border border-white/50 text-[#6B5A5A] text-center shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[#E88C8C]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                        <Crown className="w-6 h-6 mx-auto mb-1 text-[#D98C72] drop-shadow-sm animate-pulse" />
                        <h4 className="font-bold text-sm mb-1 tracking-wide text-[#5A2332]">Upgrade to Premium</h4>
                        <p className="text-[10px] text-[#6B5A5A] mb-2 font-medium leading-tight">Unlock exclusive features & stand out from the crowd.</p>
                        <button 
                            onClick={() => window.location.href = '/payment'} 
                            className="bg-gradient-to-r from-[#E88C8C] to-[#B54768] text-white text-xs font-black px-4 py-1.5 rounded-full hover:scale-105 hover:shadow-[0_8px_20px_rgba(222,120,120,0.3)] transition-all duration-300 w-full"
                        >
                            Upgrade Now →
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
