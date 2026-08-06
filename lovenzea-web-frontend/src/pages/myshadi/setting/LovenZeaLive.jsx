import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Phone, Smartphone, CheckCircle2, RotateCcw } from 'lucide-react';

/**
 * LovenZeaLive Component
 * Manages communication preferences for LovenZea Live sessions.
 * Features a premium design with instant-save functionality.
 */
function LovenZeaLive({ profile, onUpdate }) {
    const defaultLovenZeaLive = {
        pushNotification: true,
        email: true,
        sms: true,
        whatsapp: false,
        call: true
    };

    const [preferences, setPreferences] = useState(defaultLovenZeaLive);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    // Load initial settings
    useEffect(() => {
        if (profile?.notificationSettings) {
            try {
                const parsed = typeof profile.notificationSettings === 'string'
                    ? JSON.parse(profile.notificationSettings)
                    : profile.notificationSettings;
                if (parsed.LovenZeaLive) {
                    setPreferences({ ...defaultLovenZeaLive, ...parsed.LovenZeaLive });
                }
            } catch (e) {
                console.error("Error parsing settings for LovenZeaLive:", e);
            }
        }
    }, [profile]);

    /**
     * Handles instant toggle of preferences
     */
    const handleToggle = async (key) => {
        setIsSaving(true);
        const newPreferences = {
            ...preferences,
            [key]: !preferences[key]
        };

        // Optimistic update
        setPreferences(newPreferences);

        try {
            let currentSettings = {};
            if (profile?.notificationSettings) {
                try {
                    currentSettings = typeof profile.notificationSettings === 'string'
                        ? JSON.parse(profile.notificationSettings)
                        : profile.notificationSettings;
                } catch (e) {
                    console.error("Error parsing settings:", e);
                }
            }

            // Perform update
            await onUpdate({
                notificationSettings: JSON.stringify({
                    ...currentSettings,
                    LovenZeaLive: newPreferences
                })
            });

            setLastSaved(new Date().toLocaleTimeString());
        } catch (error) {
            console.error("Failed to update preferences:", error);
            // Revert on error
            setPreferences(preferences);
        } finally {
            setTimeout(() => setIsSaving(false), 500);
        }
    };

    /**
     * Resets all preferences to default
     */
    const handleReset = async () => {
        setIsSaving(true);
        setPreferences(defaultLovenZeaLive);

        try {
            let currentSettings = {};
            if (profile?.notificationSettings) {
                try {
                    currentSettings = typeof profile.notificationSettings === 'string'
                        ? JSON.parse(profile.notificationSettings)
                        : profile.notificationSettings;
                } catch (e) {
                    console.error("Error parsing settings:", e);
                }
            }

            await onUpdate({
                notificationSettings: JSON.stringify({
                    ...currentSettings,
                    LovenZeaLive: defaultLovenZeaLive
                })
            });
            setLastSaved(new Date().toLocaleTimeString());
        } catch (error) {
            console.error("Failed to reset preferences:", error);
        } finally {
            setTimeout(() => setIsSaving(false), 500);
        }
    };

    const communicationOptions = [
        {
            key: 'pushNotification',
            label: 'Push Notification',
            icon: Bell,
            description: 'Receive instant alerts on your mobile device'
        },
        {
            key: 'email',
            label: 'Email Notifications',
            icon: Mail,
            description: 'Get match updates and alerts in your inbox'
        },
        {
            key: 'sms',
            label: 'SMS Alerts',
            icon: MessageSquare,
            description: 'Direct text message notifications for urgent updates'
        },
        {
            key: 'whatsapp',
            label: 'WhatsApp Status',
            icon: Smartphone,
            description: 'Receive personalized updates on your WhatsApp'
        },
        {
            key: 'call',
            label: 'Voice Call',
            icon: Phone,
            description: 'Option for voice call reminders and verification'
        }
    ];

    return (
        <div className="w-full">
            {/* Header info */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                        <span className="w-2 h-6 bg-rose-500 rounded-full"></span>
                        Live Preferences
                    </h2>
                    <p className="text-sm text-theme-text-secondary mt-1">Manage how we reach you for Live sessions</p>
                </div>
                {lastSaved && (
                    <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wider">
                        <CheckCircle2 size={10} />
                        Saved at {lastSaved}
                    </div>
                )}
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {communicationOptions.map((option) => {
                    const Icon = option.icon;
                    const isEnabled = preferences[option.key];

                    return (
                        <div
                            key={option.key}
                            className={`group relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 ${isEnabled
                                ? 'bg-rose-50/50 border-rose-200 shadow-sm'
                                : 'bg-theme-surface border-gray-100 hover:border-theme-border'
                                }`}
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isEnabled
                                        ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-200'
                                        : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon size={22} strokeWidth={2.5} />
                                </div>
                                <div className="flex-1 min-w-0 pr-2">
                                    <h3 className={`text-sm md:text-base font-bold transition-colors ${isEnabled ? 'text-rose-900' : 'text-gray-900'}`}>
                                        {option.label}
                                    </h3>
                                    <p className="text-xs text-theme-text-secondary line-clamp-1 group-hover:line-clamp-none transition-all">
                                        {option.description}
                                    </p>
                                </div>
                            </div>

                            {/* Premium Toggle Switch */}
                            <button
                                onClick={() => handleToggle(option.key)}
                                disabled={isSaving}
                                className={`relative inline-flex w-12 h-6 items-center rounded-full transition-all duration-300 active:scale-90 ${isEnabled
                                    ? 'bg-rose-500 shadow-inner'
                                    : 'bg-gray-200'
                                    } ${isSaving ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                                aria-label={`Toggle ${option.label}`}
                                aria-checked={isEnabled}
                                role="switch"
                            >
                                <span
                                    className={`inline-block w-4.5 h-4.5 transform rounded-full bg-theme-surface shadow-md transition-transform duration-300 ${isEnabled
                                        ? 'translate-x-6.5'
                                        : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <button
                    onClick={handleReset}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-theme-text-secondary hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                >
                    <RotateCcw size={16} />
                    Restore Defaults
                </button>

                <div className="flex items-center gap-3">
                    {isSaving && (
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce"></div>
                        </div>
                    )}
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        Updates Automatically
                    </span>
                </div>
            </div>
        </div>
    );
}

export default LovenZeaLive;