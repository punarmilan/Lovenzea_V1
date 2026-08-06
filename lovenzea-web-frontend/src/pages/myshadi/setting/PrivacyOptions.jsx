import React, { useState, useEffect } from "react";
import { ChevronDown, Info } from "lucide-react";
import toast from "react-hot-toast";

function PrivacyOptions({ profile, onUpdate }) {
    const [openSection, setOpenSection] = useState(null);
    const [photoTab, setPhotoTab] = useState("profile"); // 'profile' or 'album'

    // Map backend values to local labels for display
    const labelMap = {
        displayNameVisibility: {
            'SHOW_FULL': 'Show my full name',
            'HIDE_LAST': 'Hide my last name',
            'HIDE_FIRST': 'Hide my first name',
            'HIDE_FULL': 'Hide my full name'
        },
        profilePhotoVisibility: {
            'ALL_MEMBERS': 'Visible to all Members',
            'MEMBERS_LIKED_PREMIUM': 'Visible to Members I like and to all Premium Members'
        },
        albumPhotoVisibility: {
            'MEMBERS_LIKED_PREMIUM': 'Visible to Members I like and to all Premium Members',
            'ONLY_LIKED': 'Only visible to members I like'
        },
        contactDisplayStatus: {
            'Only Premium Members': 'Only Premium Members',
            'Only Premium Members you like': 'Only Premium Members you like',
            'No one': 'No one'
        },
        emailVisibility: {
            'ALL_PREMIUM': 'Visible to all Premium Members',
            'PREMIUM_WISH_CONNECT': 'Visible to Premium Members you wish to connect to',
            'HIDE_EMAIL': 'Hide my Email Address'
        },
        dobVisibility: {
            'FULL': 'Show my full Date of Birth',
            'MONTH_YEAR': 'Show only the Month & Year'
        },
        annualIncomeVisibility: {
            'ALL_MEMBERS': 'Visible to all Members',
            'KEEP_PRIVATE': 'Keep this private'
        },
        shortlistVisibility: {
            'LET_KNOW': 'Let other Members know',
            'DO_NOT_LET_KNOW': 'Do not let other Members know'
        },
        profileVisibility: {
            'ALL_VISITORS': 'Visible to all',
            'HIDDEN': 'Hidden'
        }
    };

    const getInitialName = (fullName) => {
        if (!fullName) return { first: "", last: "" };
        const parts = fullName.split(" ");
        return {
            first: parts[0] || "",
            last: parts.slice(1).join(" ") || ""
        };
    };

    const [settings, setSettings] = useState({
        firstName: getInitialName(profile?.fullName).first,
        lastName: getInitialName(profile?.fullName).last,
        displayNameVisibility: profile?.displayNameVisibility || "HIDE_FULL",
        profilePhotoVisibility: profile?.profilePhotoVisibility || "ALL_MEMBERS",
        albumPhotoVisibility: profile?.albumPhotoVisibility || "MEMBERS_LIKED_PREMIUM",
        contactDisplayStatus: profile?.contactDisplayStatus || "Only Premium Members",
        emailVisibility: profile?.emailVisibility || "ALL_PREMIUM",
        dobVisibility: profile?.dobVisibility || "FULL",
        annualIncomeVisibility: profile?.annualIncomeVisibility || "ALL_MEMBERS",
        shortlistVisibility: profile?.shortlistVisibility || "LET_KNOW",
        doNotDisturb: profile?.doNotDisturb ?? true,
        profileVisibility: profile?.profileVisibility || "ALL_VISITORS",
    });

    useEffect(() => {
        if (profile) {
            const { first, last } = getInitialName(profile.fullName);
            const mapping = {
                displayNameVisibility: profile.displayNameVisibility === "show-all" ? "SHOW_FULL" : profile.displayNameVisibility,
                profileVisibility: profile.profileVisibility === "Public" ? "ALL_VISITORS" : profile.profileVisibility,
            };

            setSettings({
                firstName: first,
                lastName: last,
                displayNameVisibility: mapping.displayNameVisibility || "SHOW_FULL",
                profilePhotoVisibility: profile.profilePhotoVisibility || "ALL_MEMBERS",
                albumPhotoVisibility: profile.albumPhotoVisibility || "MEMBERS_LIKED_PREMIUM",
                contactDisplayStatus: profile.contactDisplayStatus || "Only Premium Members",
                emailVisibility: profile.emailVisibility || "ALL_PREMIUM",
                dobVisibility: profile.dobVisibility || "FULL",
                annualIncomeVisibility: profile.annualIncomeVisibility || "ALL_MEMBERS",
                shortlistVisibility: profile.shortlistVisibility || "LET_KNOW",
                doNotDisturb: profile.doNotDisturb ?? true,
                profileVisibility: mapping.profileVisibility || "ALL_VISITORS",
            });
        }
    }, [profile]);

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const handleSubmit = (field, value) => {
        onUpdate({ [field]: value });
        setOpenSection(null);
    };

    const privacyOptions = [
        {
            id: "displayName",
            title: "Display Name",
            currentValue: labelMap.displayNameVisibility[settings.displayNameVisibility],
            icon: "👤",
        },
        {
            id: "photo",
            title: "Photo",
            currentValue: photoTab === "profile"
                ? labelMap.profilePhotoVisibility[settings.profilePhotoVisibility]
                : labelMap.albumPhotoVisibility[settings.albumPhotoVisibility],
            icon: "📷",
        },
        {
            id: "phone",
            title: "Phone",
            currentValue: labelMap.contactDisplayStatus[settings.contactDisplayStatus],
            icon: "📞",
        },
        {
            id: "email",
            title: "Email",
            currentValue: labelMap.emailVisibility[settings.emailVisibility],
            icon: "✉️",
        },
        {
            id: "dateOfBirth",
            title: "Date of Birth",
            currentValue: labelMap.dobVisibility[settings.dobVisibility],
            icon: "🎂",
        },
        {
            id: "annualIncome",
            title: "Annual Income",
            currentValue: labelMap.annualIncomeVisibility[settings.annualIncomeVisibility],
            icon: "💰",
        },
        {
            id: "shortlistSetting",
            title: "Shortlist Setting",
            currentValue: labelMap.shortlistVisibility[settings.shortlistVisibility],
            icon: "⭐",
        },
        {
            id: "doNotDisturb",
            title: "Do Not Disturb",
            currentValue: settings.doNotDisturb ? "Active" : "Inactive",
            icon: "🔔",
        },
        {
            id: "profilePrivacy",
            title: "Profile Privacy",
            currentValue: labelMap.profileVisibility[settings.profileVisibility],
            icon: "🔒",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}

                {/* Privacy Settings List */}
                <div className="bg-theme-surface rounded-xl shadow-sm border border-theme-border overflow-hidden">
                    {privacyOptions.map((option, index) => (
                        <div
                            key={option.id}
                            className="border-b border-gray-100 last:border-b-0">
                            <button
                                onClick={() => toggleSection(option.id)}
                                className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-gray-50 transition-colors duration-200">
                                <div className="flex items-center gap-3 flex-1 text-left">
                                    <span className="text-2xl">{option.icon}</span>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                                            {option.title}
                                        </h3>
                                        <p className="text-xs md:text-sm text-theme-text-secondary mt-1 line-clamp-1">
                                            {option.currentValue}
                                        </p>
                                    </div>
                                </div>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openSection === option.id ? "rotate-180" : ""}`}
                                />
                            </button>

                            {/* Expandable Content */}
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openSection === option.id ? "max-h-[2000px]" : "max-h-0"}`}>
                                <div className="p-6 bg-gray-50 border-t border-theme-border">
                                    {/* Display Name Content */}
                                    {option.id === "displayName" && (
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Full Name
                                                </label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="First Name"
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                                                            value={settings.firstName}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (val && !/^[a-zA-Z\s]*$/.test(val)) return;
                                                                setSettings({
                                                                    ...settings,
                                                                    firstName: val,
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="Last Name"
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                                                            value={settings.lastName}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (val && !/^[a-zA-Z\s]*$/.test(val)) return;
                                                                setSettings({
                                                                    ...settings,
                                                                    lastName: val,
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2 mt-3 text-sm text-theme-text-secondary">
                                                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                    <p>
                                                        Note: Name changes will be screened before they are
                                                        viewable in your Profile.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="bg-theme-surface p-4 rounded-lg border border-theme-border">
                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                    Display Name as
                                                </label>
                                                <div className="space-y-3">
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="displayName"
                                                            value="SHOW_FULL"
                                                            checked={settings.displayNameVisibility === "SHOW_FULL"}
                                                            onChange={(e) =>
                                                                setSettings({
                                                                    ...settings,
                                                                    displayNameVisibility: e.target.value,
                                                                })
                                                            }
                                                            className="w-5 h-5 text-pink-500"
                                                        />
                                                        <span className="text-sm text-gray-700">
                                                            Show my full name
                                                        </span>
                                                    </label>
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="displayName"
                                                            value="HIDE_LAST"
                                                            checked={settings.displayNameVisibility === "HIDE_LAST"}
                                                            onChange={(e) =>
                                                                setSettings({
                                                                    ...settings,
                                                                    displayNameVisibility: e.target.value,
                                                                })
                                                            }
                                                            className="w-5 h-5 text-pink-500"
                                                        />
                                                        <span className="text-sm text-gray-700">
                                                            Hide my last name (e.g Raj M)
                                                        </span>
                                                    </label>
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="displayName"
                                                            value="HIDE_FIRST"
                                                            checked={settings.displayNameVisibility === "HIDE_FIRST"}
                                                            onChange={(e) =>
                                                                setSettings({
                                                                    ...settings,
                                                                    displayNameVisibility: e.target.value,
                                                                })
                                                            }
                                                            className="w-5 h-5 text-pink-500"
                                                        />
                                                        <span className="text-sm text-gray-700">
                                                            Hide my first name (e.g R Malhotra)
                                                        </span>
                                                    </label>
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="displayName"
                                                            value="HIDE_FULL"
                                                            checked={settings.displayNameVisibility === "HIDE_FULL"}
                                                            onChange={(e) =>
                                                                setSettings({
                                                                    ...settings,
                                                                    displayNameVisibility: e.target.value,
                                                                })
                                                            }
                                                            className="w-5 h-5 text-pink-500"
                                                        />
                                                        <span className="text-sm text-gray-700">
                                                            Hide my full name (Displays only Profile ID)
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setOpenSection(null)}
                                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors">
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (!settings.firstName || !settings.lastName) {
                                                            toast.error("Both first name and last name are required");
                                                            return;
                                                        }
                                                        if (!/^[a-zA-Z\s]+$/.test(settings.firstName) || !/^[a-zA-Z\s]+$/.test(settings.lastName)) {
                                                            toast.error("Names should only contain alphabets");
                                                            return;
                                                        }
                                                        const fullName = `${settings.firstName} ${settings.lastName}`.trim();
                                                        onUpdate({
                                                            fullName,
                                                            displayNameVisibility: settings.displayNameVisibility
                                                        });
                                                        setOpenSection(null);
                                                    }}
                                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg">
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Photo Content */}
                                    {option.id === "photo" && (
                                        <div className="space-y-6">
                                            <div className="flex gap-4 border-b border-gray-300">
                                                <button
                                                    onClick={() => setPhotoTab("profile")}
                                                    className={`pb-3 px-1 font-medium transition-colors ${photoTab === "profile"
                                                        ? "text-gray-800 border-b-2 border-gray-800"
                                                        : "text-theme-text-secondary hover:text-gray-700"
                                                        }`}>
                                                    Profile Photo
                                                </button>
                                                <button
                                                    onClick={() => setPhotoTab("album")}
                                                    className={`pb-3 px-1 font-medium transition-colors ${photoTab === "album"
                                                        ? "text-gray-800 border-b-2 border-gray-800"
                                                        : "text-theme-text-secondary hover:text-gray-700"
                                                        }`}>
                                                    Album
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                {photoTab === "profile" ? (
                                                    <div className="space-y-4">
                                                        <label className="flex items-center gap-3 cursor-pointer group">
                                                            <div className="relative flex items-center justify-center">
                                                                <input
                                                                    type="radio"
                                                                    name="photoVisibility"
                                                                    value="ALL_MEMBERS"
                                                                    checked={settings.profilePhotoVisibility === "ALL_MEMBERS"}
                                                                    onChange={(e) => setSettings({ ...settings, profilePhotoVisibility: e.target.value })}
                                                                    className="w-5 h-5 border-2 border-gray-300 rounded-full checked:border-cyan-500 appearance-none cursor-pointer"
                                                                />
                                                                {settings.profilePhotoVisibility === "ALL_MEMBERS" && (
                                                                    <div className="absolute w-2.5 h-2.5 bg-cyan-500 rounded-full"></div>
                                                                )}
                                                            </div>
                                                            <span className="text-sm text-gray-700">Visible to all Members (Recommended)</span>
                                                        </label>

                                                        <label className="flex items-center gap-3 cursor-pointer group">
                                                            <div className="relative flex items-center justify-center">
                                                                <input
                                                                    type="radio"
                                                                    name="photoVisibility"
                                                                    value="MEMBERS_LIKED_PREMIUM"
                                                                    checked={settings.profilePhotoVisibility === "MEMBERS_LIKED_PREMIUM"}
                                                                    onChange={(e) => setSettings({ ...settings, profilePhotoVisibility: e.target.value })}
                                                                    className="w-5 h-5 border-2 border-gray-300 rounded-full checked:border-cyan-500 appearance-none cursor-pointer"
                                                                />
                                                                {settings.profilePhotoVisibility === "MEMBERS_LIKED_PREMIUM" && (
                                                                    <div className="absolute w-2.5 h-2.5 bg-cyan-500 rounded-full"></div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm text-gray-700">Visible to Members I like and to all Premium Members</span>
                                                                <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[10px] text-theme-text-secondary">?</div>
                                                                <span className="text-sm text-cyan-500">| More</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <label className="flex items-center gap-3 cursor-pointer group">
                                                            <div className="relative flex items-center justify-center">
                                                                <input
                                                                    type="radio"
                                                                    name="albumPhotoVisibility"
                                                                    value="MEMBERS_LIKED_PREMIUM"
                                                                    checked={settings.albumPhotoVisibility === "MEMBERS_LIKED_PREMIUM"}
                                                                    onChange={(e) => setSettings({ ...settings, albumPhotoVisibility: e.target.value })}
                                                                    className="w-5 h-5 border-2 border-gray-300 rounded-full checked:border-cyan-500 appearance-none cursor-pointer"
                                                                />
                                                                {settings.albumPhotoVisibility === "MEMBERS_LIKED_PREMIUM" && (
                                                                    <div className="absolute w-2.5 h-2.5 bg-cyan-500 rounded-full"></div>
                                                                )}
                                                            </div>
                                                            <span className="text-sm text-gray-700">Visible to Members I like and to all Premium Members</span>
                                                        </label>

                                                        <label className="flex items-center gap-3 cursor-pointer group">
                                                            <div className="relative flex items-center justify-center">
                                                                <input
                                                                    type="radio"
                                                                    name="albumPhotoVisibility"
                                                                    value="ONLY_LIKED"
                                                                    checked={settings.albumPhotoVisibility === "ONLY_LIKED"}
                                                                    onChange={(e) => setSettings({ ...settings, albumPhotoVisibility: e.target.value })}
                                                                    className="w-5 h-5 border-2 border-gray-300 rounded-full checked:border-cyan-500 appearance-none cursor-pointer"
                                                                />
                                                                {settings.albumPhotoVisibility === "ONLY_LIKED" && (
                                                                    <div className="absolute w-2.5 h-2.5 bg-cyan-500 rounded-full"></div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm text-gray-700">Only visible to members I like</span>
                                                                <span className="text-sm text-cyan-500">| More</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                )}

                                                {photoTab === "profile" && (
                                                    <div className="mt-4 pt-4 border-t border-theme-border">
                                                        <p className="text-sm font-medium text-theme-text-secondary mb-4 italic">
                                                            This is how your Photos will look to other Members
                                                        </p>
                                                        <div className="grid grid-cols-2 gap-8 max-w-sm mt-6">
                                                            <div className="text-center">
                                                                <p className="text-[11px] text-gray-400 mb-2 uppercase tracking-tight">Premium Member view</p>
                                                                <div className="aspect-[4/5] rounded overflow-hidden shadow-sm border border-theme-border">
                                                                    <img
                                                                        src={profile?.profilePhotoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"}
                                                                        alt="Premium view"
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-[11px] text-gray-400 mb-2 uppercase tracking-tight">Free Member view</p>
                                                                <div className="aspect-[4/5] rounded overflow-hidden shadow-sm border border-theme-border relative">
                                                                    <img
                                                                        src={profile?.profilePhotoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"}
                                                                        alt="Free view"
                                                                        className={`w-full h-full object-cover ${settings.profilePhotoVisibility === "MEMBERS_LIKED_PREMIUM" ? "blur-md" : ""}`}
                                                                    />
                                                                    {settings.profilePhotoVisibility === "MEMBERS_LIKED_PREMIUM" && (
                                                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
                                                                            <div className="bg-theme-surface/90 p-2 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center gap-1">
                                                                                <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                                                                    <path d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zm3 8H9V7c0-1.654 1.346-3 3-3s3 1.346 3 3v3z" />
                                                                                </svg>
                                                                                <div className="text-[10px] font-bold text-gray-700 leading-tight">
                                                                                    Visible to<br />Premium Members
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-3 pt-8">
                                                <button
                                                    onClick={() => setOpenSection(null)}
                                                    className="flex-1 px-6 py-2.5 bg-gray-100 text-theme-text-secondary rounded-full font-bold hover:bg-gray-200 transition-colors uppercase text-sm tracking-wide">
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        onUpdate({
                                                            profilePhotoVisibility: settings.profilePhotoVisibility,
                                                            albumPhotoVisibility: settings.albumPhotoVisibility
                                                        });
                                                        setOpenSection(null);
                                                    }}
                                                    className="flex-1 px-6 py-2.5 bg-cyan-400 text-white rounded-full font-bold hover:bg-cyan-500 transition-all shadow-md uppercase text-sm tracking-wide">
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Phone Content */}
                                    {option.id === "phone" && (
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${settings.contactDisplayStatus === "Only Premium Members" ? "border-pink-500 bg-pink-50/30" : "border-gray-100 hover:border-pink-200"}`}>
                                                    <input
                                                        type="radio"
                                                        name="contactDisplayStatus"
                                                        value="Only Premium Members"
                                                        checked={settings.contactDisplayStatus === "Only Premium Members"}
                                                        onChange={(e) =>
                                                            setSettings({
                                                                ...settings,
                                                                contactDisplayStatus: e.target.value,
                                                            })
                                                        }
                                                        className="w-5 h-5 text-pink-500 mt-0.5 accent-pink-500"
                                                    />
                                                    <span className={`text-sm font-medium ${settings.contactDisplayStatus === "Only Premium Members" ? "text-pink-900" : "text-gray-700"}`}>
                                                        Only Premium Members
                                                    </span>
                                                </label>

                                                <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${settings.contactDisplayStatus === "Only Premium Members you like" ? "border-pink-500 bg-pink-50/30" : "border-gray-100 hover:border-pink-200"}`}>
                                                    <input
                                                        type="radio"
                                                        name="contactDisplayStatus"
                                                        value="Only Premium Members you like"
                                                        checked={settings.contactDisplayStatus === "Only Premium Members you like"}
                                                        onChange={(e) =>
                                                            setSettings({
                                                                ...settings,
                                                                contactDisplayStatus: e.target.value,
                                                            })
                                                        }
                                                        className="w-5 h-5 text-pink-500 mt-0.5 accent-pink-500"
                                                    />
                                                    <span className={`text-sm font-medium ${settings.contactDisplayStatus === "Only Premium Members you like" ? "text-pink-900" : "text-gray-700"}`}>
                                                        Only Premium Members you like
                                                    </span>
                                                </label>

                                                <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${settings.contactDisplayStatus === "No one" ? "border-pink-500 bg-pink-50/30" : "border-gray-100 hover:border-pink-200"}`}>
                                                    <input
                                                        type="radio"
                                                        name="contactDisplayStatus"
                                                        value="No one"
                                                        checked={settings.contactDisplayStatus === "No one"}
                                                        onChange={(e) =>
                                                            setSettings({
                                                                ...settings,
                                                                contactDisplayStatus: e.target.value,
                                                            })
                                                        }
                                                        className="w-5 h-5 text-pink-500 mt-0.5 accent-pink-500"
                                                    />
                                                    <div>
                                                        <span className={`text-sm font-medium ${settings.contactDisplayStatus === "No one" ? "text-pink-900" : "text-gray-700"}`}>
                                                            No one (Matches won't be able to call you)
                                                        </span>
                                                    </div>
                                                </label>

                                                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 border-gray-50 bg-gray-50 opacity-50">
                                                    <input
                                                        type="radio"
                                                        name="contactDisplayStatus"
                                                        value="matches-only"
                                                        checked={false}
                                                        className="w-5 h-5 text-gray-300 mt-0.5"
                                                        disabled
                                                    />
                                                    <div>
                                                        <span className="text-sm font-medium text-theme-text-secondary">
                                                            Only visible to all your Matches (Expires with Membership)
                                                        </span>
                                                        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                                                            <Info className="w-3 h-3" />
                                                            <span>Standard Feature</span>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>

                                            <div className="flex gap-3 pt-4">
                                                <button
                                                    onClick={() => {
                                                        setSettings({
                                                            ...settings,
                                                            contactDisplayStatus: profile?.contactDisplayStatus || "Only Premium Members"
                                                        });
                                                        setOpenSection(null);
                                                    }}
                                                    className="flex-1 px-6 py-3 bg-gray-100 text-theme-text-secondary rounded-full font-bold hover:bg-gray-200 transition-colors uppercase text-sm tracking-wide">
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleSubmit("contactDisplayStatus", settings.contactDisplayStatus)}
                                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold hover:from-pink-600 hover:to-purple-600 transition-all shadow-md uppercase text-sm tracking-wide">
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Email Content */}
                                    {option.id === "email" && (
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${settings.emailVisibility === "ALL_PREMIUM" ? "border-pink-500 bg-pink-50/30" : "border-gray-100 hover:border-pink-200"}`}>
                                                    <input
                                                        type="radio"
                                                        name="emailVisibility"
                                                        value="ALL_PREMIUM"
                                                        checked={settings.emailVisibility === "ALL_PREMIUM"}
                                                        onChange={(e) =>
                                                            setSettings({
                                                                ...settings,
                                                                emailVisibility: e.target.value,
                                                            })
                                                        }
                                                        className="w-5 h-5 text-pink-500 mt-0.5 accent-pink-500"
                                                    />
                                                    <span className={`text-sm font-medium ${settings.emailVisibility === "ALL_PREMIUM" ? "text-pink-900" : "text-gray-700"}`}>
                                                        Visible to all Premium Members
                                                    </span>
                                                </label>

                                                <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${settings.emailVisibility === "PREMIUM_WISH_CONNECT" ? "border-pink-500 bg-pink-50/30" : "border-gray-100 hover:border-pink-200"}`}>
                                                    <input
                                                        type="radio"
                                                        name="emailVisibility"
                                                        value="PREMIUM_WISH_CONNECT"
                                                        checked={settings.emailVisibility === "PREMIUM_WISH_CONNECT"}
                                                        onChange={(e) =>
                                                            setSettings({
                                                                ...settings,
                                                                emailVisibility: e.target.value,
                                                            })
                                                        }
                                                        className="w-5 h-5 text-pink-500 mt-0.5 accent-pink-500"
                                                    />
                                                    <span className={`text-sm font-medium ${settings.emailVisibility === "PREMIUM_WISH_CONNECT" ? "text-pink-900" : "text-gray-700"}`}>
                                                        Visible to Premium Members you wish to connect to
                                                    </span>
                                                </label>

                                                <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${settings.emailVisibility === "HIDE_EMAIL" ? "border-pink-500 bg-pink-50/30" : "border-gray-100 hover:border-pink-200"}`}>
                                                    <input
                                                        type="radio"
                                                        name="emailVisibility"
                                                        value="HIDE_EMAIL"
                                                        checked={settings.emailVisibility === "HIDE_EMAIL"}
                                                        onChange={(e) =>
                                                            setSettings({
                                                                ...settings,
                                                                emailVisibility: e.target.value,
                                                            })
                                                        }
                                                        className="w-5 h-5 text-pink-500 mt-0.5 accent-pink-500"
                                                    />
                                                    <span className={`text-sm font-medium ${settings.emailVisibility === "HIDE_EMAIL" ? "text-pink-900" : "text-gray-700"}`}>
                                                        Hide my Email Address
                                                    </span>
                                                </label>

                                                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 border-gray-50 bg-gray-50 opacity-50">
                                                    <input
                                                        type="radio"
                                                        name="emailVisibility"
                                                        value="matches-only"
                                                        checked={false}
                                                        className="w-5 h-5 text-gray-300 mt-0.5"
                                                        disabled
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-400">
                                                            Visible to all your Matches (Expires with Membership)
                                                        </span>
                                                        <Info className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                </label>
                                            </div>

                                            <div className="flex gap-3 pt-4">
                                                <button
                                                    onClick={() => {
                                                        setSettings({
                                                            ...settings,
                                                            emailVisibility: profile?.emailVisibility || "ALL_PREMIUM"
                                                        });
                                                        setOpenSection(null);
                                                    }}
                                                    className="flex-1 px-6 py-3 bg-gray-100 text-theme-text-secondary rounded-full font-bold hover:bg-gray-200 transition-colors uppercase text-sm tracking-wide">
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleSubmit("emailVisibility", settings.emailVisibility)}
                                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold hover:from-pink-600 hover:to-purple-600 transition-all shadow-md uppercase text-sm tracking-wide">
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Date of Birth Content */}
                                    {option.id === "dateOfBirth" && (
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${settings.dobVisibility === "FULL" ? "border-pink-500 bg-pink-50/30" : "border-gray-100 hover:border-pink-200"}`}>
                                                    <input
                                                        type="radio"
                                                        name="dobVisibility"
                                                        value="FULL"
                                                        checked={settings.dobVisibility === "FULL"}
                                                        onChange={(e) =>
                                                            setSettings({
                                                                ...settings,
                                                                dobVisibility: e.target.value,
                                                            })
                                                        }
                                                        className="w-5 h-5 text-pink-500 mt-0.5 accent-pink-500"
                                                    />
                                                    <span className={`text-sm font-medium ${settings.dobVisibility === "FULL" ? "text-pink-900" : "text-gray-700"}`}>
                                                        Show my full Date of Birth (dd/mm/yyyy)
                                                    </span>
                                                </label>

                                                <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${settings.dobVisibility === "MONTH_YEAR" ? "border-pink-500 bg-pink-50/30" : "border-gray-100 hover:border-pink-200"}`}>
                                                    <input
                                                        type="radio"
                                                        name="dobVisibility"
                                                        value="MONTH_YEAR"
                                                        checked={settings.dobVisibility === "MONTH_YEAR"}
                                                        onChange={(e) =>
                                                            setSettings({
                                                                ...settings,
                                                                dobVisibility: e.target.value,
                                                            })
                                                        }
                                                        className="w-5 h-5 text-pink-500 mt-0.5 accent-pink-500"
                                                    />
                                                    <span className={`text-sm font-medium ${settings.dobVisibility === "MONTH_YEAR" ? "text-pink-900" : "text-gray-700"}`}>
                                                        Show only the Month & Year (mm/yyyy)
                                                    </span>
                                                </label>
                                            </div>

                                            <div className="flex gap-3 pt-4">
                                                <button
                                                    onClick={() => {
                                                        setSettings({
                                                            ...settings,
                                                            dobVisibility: profile?.dobVisibility || "FULL"
                                                        });
                                                        setOpenSection(null);
                                                    }}
                                                    className="flex-1 px-6 py-3 bg-gray-100 text-theme-text-secondary rounded-full font-bold hover:bg-gray-200 transition-colors uppercase text-sm tracking-wide">
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleSubmit("dobVisibility", settings.dobVisibility)}
                                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold hover:from-pink-600 hover:to-purple-600 transition-all shadow-md uppercase text-sm tracking-wide">
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Annual Income Content */}
                                    {option.id === "annualIncome" && (
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${settings.annualIncomeVisibility === "ALL_MEMBERS" ? "border-pink-500 bg-pink-50/30" : "border-gray-100 hover:border-pink-200"}`}>
                                                    <input
                                                        type="radio"
                                                        name="annualIncomeVisibility"
                                                        value="ALL_MEMBERS"
                                                        checked={settings.annualIncomeVisibility === "ALL_MEMBERS"}
                                                        onChange={(e) =>
                                                            setSettings({
                                                                ...settings,
                                                                annualIncomeVisibility: e.target.value,
                                                            })
                                                        }
                                                        className="w-5 h-5 text-pink-500 mt-0.5 accent-pink-500"
                                                    />
                                                    <span className={`text-sm font-medium ${settings.annualIncomeVisibility === "ALL_MEMBERS" ? "text-pink-900" : "text-gray-700"}`}>
                                                        Visible to all Members
                                                    </span>
                                                </label>

                                                <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${settings.annualIncomeVisibility === "KEEP_PRIVATE" ? "border-pink-500 bg-pink-50/30" : "border-gray-100 hover:border-pink-200"}`}>
                                                    <input
                                                        type="radio"
                                                        name="annualIncomeVisibility"
                                                        value="KEEP_PRIVATE"
                                                        checked={settings.annualIncomeVisibility === "KEEP_PRIVATE"}
                                                        onChange={(e) =>
                                                            setSettings({
                                                                ...settings,
                                                                annualIncomeVisibility: e.target.value,
                                                            })
                                                        }
                                                        className="w-5 h-5 text-pink-500 mt-0.5 accent-pink-500"
                                                    />
                                                    <span className={`text-sm font-medium ${settings.annualIncomeVisibility === "KEEP_PRIVATE" ? "text-pink-900" : "text-gray-700"}`}>
                                                        Keep this private
                                                    </span>
                                                </label>
                                            </div>

                                            <div className="flex gap-3 pt-4">
                                                <button
                                                    onClick={() => {
                                                        setSettings({
                                                            ...settings,
                                                            annualIncomeVisibility: profile?.annualIncomeVisibility || "ALL_MEMBERS"
                                                        });
                                                        setOpenSection(null);
                                                    }}
                                                    className="flex-1 px-6 py-3 bg-gray-100 text-theme-text-secondary rounded-full font-bold hover:bg-gray-200 transition-colors uppercase text-sm tracking-wide">
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleSubmit("annualIncomeVisibility", settings.annualIncomeVisibility)}
                                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold hover:from-pink-600 hover:to-purple-600 transition-all shadow-md uppercase text-sm tracking-wide">
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Shortlist Setting Content */}
                                    {option.id === "shortlistSetting" && (
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${settings.shortlistVisibility === "LET_KNOW" ? "border-pink-500 bg-pink-50/30" : "border-gray-100 hover:border-pink-200"}`}>
                                                    <input
                                                        type="radio"
                                                        name="shortlistVisibility"
                                                        value="LET_KNOW"
                                                        checked={settings.shortlistVisibility === "LET_KNOW"}
                                                        onChange={(e) =>
                                                            setSettings({
                                                                ...settings,
                                                                shortlistVisibility: e.target.value,
                                                            })
                                                        }
                                                        className="w-5 h-5 text-pink-500 mt-0.5 accent-pink-500"
                                                    />
                                                    <span className={`text-sm font-medium ${settings.shortlistVisibility === "LET_KNOW" ? "text-pink-900" : "text-gray-700"}`}>
                                                        Let other Members know that I have shortlisted their Profile
                                                    </span>
                                                </label>

                                                <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${settings.shortlistVisibility === "DO_NOT_LET_KNOW" ? "border-pink-500 bg-pink-50/30" : "border-gray-100 hover:border-pink-200"}`}>
                                                    <input
                                                        type="radio"
                                                        name="shortlistVisibility"
                                                        value="DO_NOT_LET_KNOW"
                                                        checked={settings.shortlistVisibility === "DO_NOT_LET_KNOW"}
                                                        onChange={(e) =>
                                                            setSettings({
                                                                ...settings,
                                                                shortlistVisibility: e.target.value,
                                                            })
                                                        }
                                                        className="w-5 h-5 text-pink-500 mt-0.5 accent-pink-500"
                                                    />
                                                    <span className={`text-sm font-medium ${settings.shortlistVisibility === "DO_NOT_LET_KNOW" ? "text-pink-900" : "text-gray-700"}`}>
                                                        Do not let other Members know that I have shortlisted their Profile
                                                    </span>
                                                </label>
                                            </div>

                                            <div className="flex gap-3 pt-4">
                                                <button
                                                    onClick={() => {
                                                        setSettings({
                                                            ...settings,
                                                            shortlistVisibility: profile?.shortlistVisibility || "LET_KNOW"
                                                        });
                                                        setOpenSection(null);
                                                    }}
                                                    className="flex-1 px-6 py-3 bg-gray-100 text-theme-text-secondary rounded-full font-bold hover:bg-gray-200 transition-colors uppercase text-sm tracking-wide">
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleSubmit("shortlistVisibility", settings.shortlistVisibility)}
                                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold hover:from-pink-600 hover:to-purple-600 transition-all shadow-md uppercase text-sm tracking-wide">
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Do Not Disturb Content */}
                                    {option.id === "doNotDisturb" && (
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <label className={`flex items-start gap-4 cursor-pointer p-5 rounded-xl border-2 transition-all ${settings.doNotDisturb ? "border-pink-500 bg-pink-50/30" : "border-gray-100 hover:border-pink-200"}`}>
                                                    <div className="relative inline-flex items-center cursor-pointer mt-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={settings.doNotDisturb}
                                                            onChange={(e) => {
                                                                const newValue = e.target.checked;
                                                                setSettings({
                                                                    ...settings,
                                                                    doNotDisturb: newValue,
                                                                });
                                                            }}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-theme-surface after:border-gray-300 after:border after:rounded-full after:h-5 after:after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className={`text-sm font-bold block mb-1 ${settings.doNotDisturb ? "text-pink-900" : "text-gray-700"}`}>
                                                            LovenZea.com can call me
                                                        </span>
                                                        <span className="text-xs text-theme-text-secondary leading-relaxed">
                                                            Allow LovenZea.com to contact you for Premium membership related offers and wedding planning services.
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>

                                            <div className="flex gap-3 pt-4">
                                                <button
                                                    onClick={() => {
                                                        setSettings({
                                                            ...settings,
                                                            doNotDisturb: profile?.doNotDisturb || false
                                                        });
                                                        setOpenSection(null);
                                                    }}
                                                    className="flex-1 px-6 py-3 bg-gray-100 text-theme-text-secondary rounded-full font-bold hover:bg-gray-200 transition-colors uppercase text-sm tracking-wide">
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleSubmit("doNotDisturb", settings.doNotDisturb)}
                                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold hover:from-pink-600 hover:to-purple-600 transition-all shadow-md uppercase text-sm tracking-wide">
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Profile Privacy Content */}
                                    {option.id === "profilePrivacy" && (
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${settings.profileVisibility === "ALL_VISITORS" ? "border-pink-500 bg-pink-50/30" : "border-gray-100 hover:border-pink-200"}`}>
                                                    <input
                                                        type="radio"
                                                        name="profileVisibility"
                                                        value="ALL_VISITORS"
                                                        checked={settings.profileVisibility === "ALL_VISITORS"}
                                                        onChange={(e) =>
                                                            setSettings({
                                                                ...settings,
                                                                profileVisibility: e.target.value,
                                                            })
                                                        }
                                                        className="w-5 h-5 text-pink-500 mt-0.5 accent-pink-500"
                                                    />
                                                    <span className={`text-sm font-medium ${settings.profileVisibility === "ALL_VISITORS" ? "text-pink-900" : "text-gray-700"}`}>
                                                        Visible to all, including unregistered visitors (Photo and Name will not be visible on Profile)
                                                    </span>
                                                </label>

                                                <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${settings.profileVisibility === "HIDDEN" ? "border-pink-500 bg-pink-50/30" : "border-gray-100 hover:border-pink-200"}`}>
                                                    <input
                                                        type="radio"
                                                        name="profileVisibility"
                                                        value="HIDDEN"
                                                        checked={settings.profileVisibility === "HIDDEN"}
                                                        onChange={(e) =>
                                                            setSettings({
                                                                ...settings,
                                                                profileVisibility: e.target.value,
                                                            })
                                                        }
                                                        className="w-5 h-5 text-pink-500 mt-0.5 accent-pink-500"
                                                    />
                                                    <span className={`text-sm font-medium ${settings.profileVisibility === "HIDDEN" ? "text-pink-900" : "text-gray-700"}`}>
                                                        Hidden (Profile will not be visible to anyone)
                                                    </span>
                                                </label>
                                            </div>

                                            <div className="flex gap-3 pt-4">
                                                <button
                                                    onClick={() => {
                                                        setSettings({
                                                            ...settings,
                                                            profileVisibility: profile?.profileVisibility || "ALL_VISITORS"
                                                        });
                                                        setOpenSection(null);
                                                    }}
                                                    className="flex-1 px-6 py-3 bg-gray-100 text-theme-text-secondary rounded-full font-bold hover:bg-gray-200 transition-colors uppercase text-sm tracking-wide">
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleSubmit("profileVisibility", settings.profileVisibility)}
                                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold hover:from-pink-600 hover:to-purple-600 transition-all shadow-md uppercase text-sm tracking-wide">
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PrivacyOptions;
