import React, { useState, useEffect } from "react";
import {
    ChevronDown,
    Mail,
    Bell,
    MessageSquare,
    Eye,
    Heart,
    Users,
    Phone,
    Zap,
} from "lucide-react";

/**
 * AlertSettingsManager Component
 * Manages email and SMS alert preferences with a nested accordion interface.
 */
const AlertSettingsManager = ({ profile, onUpdate }) => {
    // State for expanded sections
    const [expandedSections, setExpandedSections] = useState({
        contactAlert: false,
        messageReceived: false,
        smsAlert: false,
        profileBlaster: false,
        LovenZeaSpecials: false,
        LovenZeaInSite: false,
    });

    const defaultSettings = {
        contactAlert: {
            enabled: true,
            frequency: "instant",
        },
        messageReceived: {
            enabled: true,
            frequency: "instant",
        },
        smsAlert: {
            enabled: false,
            phoneNumber: "",
            invitationReceived: true,
            acceptInvitation: true,
        },
        profileBlaster: {
            enabled: true,
            frequency: "monthly",
            subscribed: true,
        },
        LovenZeaSpecials: {
            enabled: true,
            frequency: "occasionally",
        },
        LovenZeaInSite: {
            enabled: true,
            frequency: "monthly",
        },
    };

    // State for all alert settings
    const [alertSettings, setAlertSettings] = useState(defaultSettings);

    useEffect(() => {
        if (profile?.notificationSettings) {
            try {
                const parsed = typeof profile.notificationSettings === 'string'
                    ? JSON.parse(profile.notificationSettings)
                    : profile.notificationSettings;
                setAlertSettings({ ...defaultSettings, ...parsed });
            } catch (e) {
                console.error("Error parsing notification settings:", e);
            }
        }
    }, [profile]);

    // Alert sections configuration
    const alertSections = [
        {
            id: "contactAlert",
            title: "Contact Alert",
            description:
                "Alerts you receive every time someone contacts you or you receive a response to a contact initiated by you. Get them in your mailbox at a frequency of your choice. Essential to keep you informed of all responses received.",
            icon: Mail,
            type: "toggle",
            frequencies: ["instant", "daily", "unsubscribe"],
        },
        {
            id: "messageReceived",
            title: "Message Received Alert",
            description: "An email notification of new messages received recently.",
            icon: MessageSquare,
            type: "toggle",
            frequencies: ["daily", "unsubscribe"],
        },
        {
            id: "smsAlert",
            title: "SMS Alert",
            description:
                `All SMS alerts will be sent to you on this mobile phone number : ${profile?.mobileNumber || "Not Provided"}`,
            icon: Phone,
            type: "sms",
        },
        {
            id: "profileBlaster",
            title: "LovenZea.com Profile Blaster",
            description:
                "Perfect matches for you through profile blaster delivered via email as often as you like. The Exact match-making tool.",
            icon: Zap,
            type: "newsletter-radio",
            frequencies: ["subscribe", "unsubscribe"],
        },
    ];

    const newsletterSections = [
        {
            id: "LovenZeaSpecials",
            title: "LovenZea Specials",
            description:
                "Exclusive offers, tips, and success stories from LovenZea.com.",
            icon: Mail,
            type: "newsletter-radio",
            frequencies: ["occasionally", "unsubscribe"],
        },
        {
            id: "LovenZeaInSite",
            title: "LovenZea InSite",
            description:
                "Weekly insights and advice for a successful matchmaking journey.",
            icon: Bell,
            type: "newsletter-radio",
            frequencies: ["monthly", "unsubscribe"],
        },
    ];

    // Toggle section expansion
    const toggleSection = (sectionId) => {
        setExpandedSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

    // Update alert setting
    const updateSetting = (sectionId, field, value) => {
        setAlertSettings((prev) => ({
            ...prev,
            [sectionId]: {
                ...prev[sectionId],
                [field]: value,
            },
        }));
    };

    // Handle submit
    const handleSubmit = (sectionId) => {
        onUpdate({ notificationSettings: JSON.stringify(alertSettings) });
        setExpandedSections(prev => ({ ...prev, [sectionId]: false }));
    };

    // Handle cancel
    const handleCancel = (sectionId) => {
        setExpandedSections((prev) => ({
            ...prev,
            [sectionId]: false,
        }));
    };

    // Standardized Action Buttons Component
    const ActionButtons = ({ id }) => (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end mt-8 pt-6 border-t border-gray-100">
            <button
                type="button"
                onClick={() => handleCancel(id)}
                className="w-full sm:w-auto px-8 py-3 text-sm md:text-base font-bold text-theme-text-secondary bg-gray-50 rounded-xl hover:bg-gray-100 hover:text-gray-700 transition-all border border-transparent"
            >
                Cancel
            </button>
            <button
                type="button"
                onClick={() => handleSubmit(id)}
                className="w-full sm:w-auto px-10 py-3 text-sm md:text-base font-bold text-white bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl hover:shadow-lg hover:shadow-pink-200 active:scale-[0.98] transition-all shadow-md"
            >
                Update Settings
            </button>
        </div>
    );

    // Render frequency options with optional checkbox
    const renderFrequencyOptions = (section) => {
        const settings = alertSettings[section.id];
        const currentFreq = settings.emailFrequency;

        return (
            <div className="space-y-6">
                <div>
                    <label className="block text-sm md:text-base font-bold text-gray-900 mb-4">
                        Email Alert Frequency
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {section.frequencies.map((freq) => (
                            <label
                                key={freq}
                                className={`
                                    relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all group
                                    ${currentFreq === freq
                                        ? "border-pink-500 bg-pink-50/50 shadow-sm"
                                        : "border-theme-border hover:border-pink-200 hover:bg-gray-50"
                                    }
                                `}>
                                <div className="flex items-center w-full">
                                    <input
                                        type="radio"
                                        name={`${section.id}-frequency`}
                                        value={freq}
                                        checked={currentFreq === freq}
                                        onChange={(e) => updateSetting(section.id, "emailFrequency", e.target.value)}
                                        className="w-5 h-5 text-pink-600 border-gray-300 focus:ring-pink-500"
                                    />
                                    <span className={`ml-3 text-sm md:text-base font-semibold capitalize ${currentFreq === freq ? "text-pink-900" : "text-gray-700"}`}>
                                        {freq.replace("-", " ")}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {section.hasCheckbox && currentFreq !== "unsubscribe" && (
                    <label className={`
                        flex items-start p-4 rounded-xl border-2 transition-all cursor-pointer group
                        ${settings.sendBroaderMatches ? "border-pink-500 bg-pink-50/50" : "border-theme-border hover:border-pink-200 hover:bg-gray-50"}
                    `}>
                        <input
                            type="checkbox"
                            checked={settings.sendBroaderMatches || false}
                            onChange={(e) => updateSetting(section.id, "sendBroaderMatches", e.target.checked)}
                            className="w-5 h-5 text-pink-600 rounded border-gray-300 focus:ring-pink-500 mt-0.5"
                        />
                        <span className={`ml-3 text-sm md:text-base font-medium ${settings.sendBroaderMatches ? "text-pink-900" : "text-gray-700"}`}>
                            {section.checkboxLabel}
                        </span>
                    </label>
                )}

                <ActionButtons id={section.id} />
            </div>
        );
    };

    // Render toggle options (for sections with enable/disable toggle)
    const renderToggleOptions = (section) => {
        const settings = alertSettings[section.id];
        const currentFreq = settings.frequency;

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                        <span className="block text-sm md:text-base font-bold text-gray-900">
                            Enable Email Alerts
                        </span>
                        <p className="text-xs md:text-sm text-theme-text-secondary">Receive notifications for this category</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.enabled}
                            onChange={(e) => updateSetting(section.id, "enabled", e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-12 h-6.5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-theme-surface after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                </div>

                {settings.enabled && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-sm md:text-base font-bold text-gray-900 mb-4">
                            Notification Frequency
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {(section.frequencies || ["daily", "unsubscribe"]).map((freq) => (
                                <label
                                    key={freq}
                                    className={`
                                        relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all group
                                        ${currentFreq === freq
                                            ? "border-pink-500 bg-pink-50/50 shadow-sm"
                                            : "border-theme-border hover:border-pink-200 hover:bg-gray-50"
                                        }
                                    `}>
                                    <div className="flex items-center w-full">
                                        <input
                                            type="radio"
                                            name={`${section.id}-freq`}
                                            value={freq}
                                            checked={currentFreq === freq}
                                            onChange={(e) => updateSetting(section.id, "frequency", e.target.value)}
                                            className="w-5 h-5 text-pink-600 border-gray-300 focus:ring-pink-500"
                                        />
                                        <span className={`ml-3 text-sm md:text-base font-semibold capitalize ${currentFreq === freq ? "text-pink-900" : "text-gray-700"}`}>
                                            {freq}
                                        </span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
                <ActionButtons id={section.id} />
            </div>
        );
    };

    // Render SMS checkbox options
    const renderSMSOptions = (section) => {
        const settings = alertSettings[section.id];

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                        <span className="block text-sm md:text-base font-bold text-gray-900">
                            Enable SMS Alerts
                        </span>
                        <p className="text-xs md:text-sm text-theme-text-secondary">Receive alerts directly on your phone</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.enabled}
                            onChange={(e) => updateSetting(section.id, "enabled", e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-12 h-6.5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-theme-surface after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                </div>

                {settings.enabled && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <label className={`
                                flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer
                                ${settings.invitationReceived ? "border-pink-500 bg-pink-50/50" : "border-theme-border hover:border-pink-200 hover:bg-gray-50"}
                            `}>
                                <input
                                    type="checkbox"
                                    checked={settings.invitationReceived}
                                    onChange={(e) => updateSetting(section.id, "invitationReceived", e.target.checked)}
                                    className="w-5 h-5 text-pink-600 rounded border-gray-300 focus:ring-pink-500"
                                />
                                <span className={`ml-3 text-xs md:text-sm font-semibold ${settings.invitationReceived ? "text-pink-900" : "text-gray-700"}`}>
                                    Invitations received (max 2/day)
                                </span>
                            </label>
                            <label className={`
                                flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer
                                ${settings.acceptInvitation ? "border-pink-500 bg-pink-50/50" : "border-theme-border hover:border-pink-200 hover:bg-gray-50"}
                            `}>
                                <input
                                    type="checkbox"
                                    checked={settings.acceptInvitation}
                                    onChange={(e) => updateSetting(section.id, "acceptInvitation", e.target.checked)}
                                    className="w-5 h-5 text-pink-600 rounded border-gray-300 focus:ring-pink-500"
                                />
                                <span className={`ml-3 text-xs md:text-sm font-semibold ${settings.acceptInvitation ? "text-pink-900" : "text-gray-700"}`}>
                                    Acceptances received (max 2/day)
                                </span>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm md:text-base font-bold text-gray-900 mb-2">
                                Mobile Number
                            </label>
                            <input
                                type="tel"
                                value={settings.phoneNumber}
                                onChange={(e) => updateSetting(section.id, "phoneNumber", e.target.value)}
                                placeholder="Enter your mobile number"
                                className="w-full px-4 py-3 border-2 border-theme-border rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all text-sm md:text-base font-medium"
                            />
                            <p className="mt-2 text-xs md:text-sm text-theme-text-secondary">
                                SMS alerts will be sent to the number associated with your profile
                            </p>
                        </div>
                    </div>
                )}
                <ActionButtons id={section.id} />
            </div>
        );
    };

    // Render newsletter radio options (standardized)
    const renderNewsletterRadioOptions = (section) => {
        const settings = alertSettings[section.id];
        const currentFreq = section.id === "profileBlaster"
            ? (settings.subscribed ? "subscribe" : "unsubscribe")
            : settings.frequency;

        return (
            <div className="space-y-6">
                <div>
                    <label className="block text-sm md:text-base font-bold text-gray-900 mb-4">
                        Alert Settings
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {section.frequencies.map((freq) => (
                            <label
                                key={freq}
                                className={`
                                    relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all group
                                    ${currentFreq === freq
                                        ? "border-pink-500 bg-pink-50/50 shadow-sm"
                                        : "border-theme-border hover:border-pink-200 hover:bg-gray-50"
                                    }
                                `}>
                                <div className="flex items-center w-full">
                                    <input
                                        type="radio"
                                        name={`${section.id}-status`}
                                        value={freq}
                                        checked={currentFreq === freq}
                                        onChange={() => {
                                            if (section.id === "profileBlaster") {
                                                updateSetting(section.id, "subscribed", freq === "subscribe");
                                            } else {
                                                updateSetting(section.id, "frequency", freq);
                                            }
                                        }}
                                        className="w-5 h-5 text-pink-600 border-gray-300 focus:ring-pink-500"
                                    />
                                    <span className={`ml-3 text-sm md:text-base font-semibold capitalize ${currentFreq === freq ? "text-pink-900" : "text-gray-700"}`}>
                                        {freq === "occasionally" ? "Occasionally (Max twice/month)" : freq}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
                <ActionButtons id={section.id} />
            </div>
        );
    };

    // Render section content based on type (Standardized Switch)
    const renderSectionContent = (section) => {
        const sectionData =
            alertSections.find((s) => s.id === section.id) ||
            newsletterSections.find((s) => s.id === section.id);

        if (!sectionData) return null;

        switch (sectionData.type) {
            case "frequency":
                return renderFrequencyOptions(sectionData);
            case "toggle":
                return renderToggleOptions(sectionData);
            case "sms":
                return renderSMSOptions(sectionData);
            case "newsletter-radio":
                return renderNewsletterRadioOptions(sectionData);
            default:
                return null;
        }
    };

    return (
        <div className="w-full space-y-8">
            {/* My Alerts Section */}
            <div>
                <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-2 h-6 bg-pink-500 rounded-full"></span>
                    My Alerts
                </h2>

                <div className="space-y-4">
                    {alertSections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <div
                                key={section.id}
                                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${expandedSections[section.id] ? 'border-pink-200 shadow-md' : 'border-theme-border hover:border-gray-300'}`}>
                                {/* Collapsible Header */}
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className={`w-full p-4 md:p-5 text-left transition-all ${expandedSections[section.id] ? 'bg-pink-50/50' : 'bg-theme-surface hover:bg-gray-50'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`p-3 rounded-xl shadow-sm transition-colors ${expandedSections[section.id] ? 'bg-pink-500 text-white' : 'bg-gray-50 text-pink-600'}`}>
                                                <Icon size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base font-bold text-gray-900">
                                                    {section.title}
                                                </h3>
                                                <p className="text-sm text-theme-text-secondary line-clamp-1">
                                                    {section.description}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${expandedSections[section.id] ? "rotate-180" : ""}`}
                                        />
                                    </div>
                                </button>

                                {/* Collapsible Content */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${expandedSections[section.id] ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
                                    <div className="p-6 md:p-8 bg-theme-surface border-t border-gray-100">
                                        {renderSectionContent(section)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Newsletters Section */}
            <div>
                <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                    LovenZea.com Newsletters
                </h2>

                <div className="space-y-4">
                    {newsletterSections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <div
                                key={section.id}
                                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${expandedSections[section.id] ? 'border-purple-200 shadow-md' : 'border-theme-border hover:border-gray-300'}`}>
                                {/* Collapsible Header */}
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className={`w-full p-4 md:p-5 text-left transition-all ${expandedSections[section.id] ? 'bg-purple-50/50' : 'bg-theme-surface hover:bg-gray-50'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`p-3 rounded-xl shadow-sm transition-colors ${expandedSections[section.id] ? 'bg-purple-500 text-white' : 'bg-gray-50 text-purple-600'}`}>
                                                <Icon size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base font-bold text-gray-900">
                                                    {section.title}
                                                </h3>
                                                <p className="text-sm text-theme-text-secondary line-clamp-1">
                                                    {section.description}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${expandedSections[section.id] ? "rotate-180" : ""}`}
                                        />
                                    </div>
                                </button>

                                {/* Collapsible Content */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${expandedSections[section.id] ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
                                    <div className="p-6 md:p-8 bg-theme-surface border-t border-gray-100">
                                        {renderSectionContent(section)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                <div className="bg-theme-surface p-2.5 rounded-xl text-blue-600 shadow-sm">
                    <Mail size={24} />
                </div>
                <div>
                    <h3 className="text-base font-bold text-blue-900 mb-1">
                        Stay Updated
                    </h3>
                    <p className="text-sm text-blue-700/80 leading-relaxed max-w-2xl">
                        Choose your preferred frequency to receive the best matches
                        tailored for you. You can modify these settings anytime.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AlertSettingsManager;
