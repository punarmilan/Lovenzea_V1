import React, { useState, useEffect } from "react";
import {
    MessageSquare,
    CheckCircle2,
    ChevronRight,
    Crown,
    Edit3,
    Save,
    AlertCircle,
    Undo2
} from "lucide-react";

/**
 * Messages Component
 * Redesigned for LovenZea's premium aesthetics.
 * Handles dynamic "Message on Connect" and "Message on Accept" with instant-save feedback.
 */
export default function Messages({ profile, onUpdate }) {
    const isPremium = profile?.isPremium || false;

    const [connectMsg, setConnectMsg] = useState(
        profile?.connectMessage || "Hi, it is nice connecting with you. I liked your profile and would like to take this forward."
    );
    const [acceptMsg, setAcceptMsg] = useState(
        profile?.acceptMessage || "Hi, I like your profile too. Would like to get in touch to take this forward."
    );

    const [isEditingConnect, setIsEditingConnect] = useState(false);
    const [isEditingAccept, setIsEditingAccept] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    useEffect(() => {
        if (profile?.connectMessage) setConnectMsg(profile.connectMessage);
        if (profile?.acceptMessage) setAcceptMsg(profile.acceptMessage);
    }, [profile]);

    const handleSave = async (field, value) => {
        setIsSaving(true);
        try {
            await onUpdate({ [field]: value });
            setLastSaved(new Date().toLocaleTimeString());
            if (field === "connectMessage") setIsEditingConnect(false);
            if (field === "acceptMessage") setIsEditingAccept(false);
        } catch (error) {
            console.error("Failed to save message:", error);
        } finally {
            setTimeout(() => setIsSaving(false), 500);
        }
    };

    const PredefinedSelector = ({ current, onSelect }) => {
        const choices = [
            "Hi, it is nice connecting with you. I liked your profile and would like to take this forward.",
            "Hi, I liked your profile and would love to hear back from you.",
            "Hi, I saw your profile and liked it. Let's connect to know more about each other. Have a great day 😊"
        ];

        return (
            <div className="grid grid-cols-1 gap-3 mt-4 animate-in fade-in slide-in-from-top-2">
                {choices.map((choice, i) => (
                    <button
                        key={i}
                        onClick={() => onSelect(choice)}
                        className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 text-sm font-medium ${current === choice
                                ? "border-pink-500 bg-pink-50 text-pink-700"
                                : "border-gray-50 bg-theme-surface hover:border-pink-200"
                            }`}
                    >
                        {choice}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full space-y-10 py-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                        <span className="w-2 h-6 bg-rose-500 rounded-full"></span>
                        Manage Messages
                    </h2>
                    <p className="text-sm text-theme-text-secondary mt-1 font-medium">Customize your standard response messages</p>
                </div>
                {lastSaved && (
                    <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-black text-green-500 bg-green-50 px-3 py-1.5 rounded-full uppercase tracking-tighter">
                        <CheckCircle2 size={12} />
                        Auto-saved {lastSaved}
                    </div>
                )}
            </div>

            {/* Message on Connect Card */}
            <div className="group relative bg-theme-surface border-2 border-gray-50 rounded-[2.5rem] p-6 md:p-8 hover:border-pink-100 transition-all duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex gap-5 flex-1 max-w-2xl">
                        <div className="w-14 h-14 rounded-2xl bg-green-50 text-pink-500 flex items-center justify-center shrink-0">
                            <MessageSquare size={28} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-gray-900">Message on Connect</h3>
                            <p className="text-sm text-gray-400 font-medium">Standard message sent with your connect requests</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {!isEditingConnect ? (
                            <button
                                onClick={() => setIsEditingConnect(true)}
                                className="w-full md:w-auto px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Edit3 size={16} />
                                Change Message
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditingConnect(false)}
                                className="px-4 py-3 bg-gray-50 text-theme-text-secondary rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-8 bg-gray-50/50 rounded-3xl p-6 border-2 border-gray-50 relative overflow-hidden">
                    {isEditingConnect ? (
                        <div className="space-y-4">
                            {isPremium ? (
                                <textarea
                                    value={connectMsg}
                                    onChange={(e) => setConnectMsg(e.target.value)}
                                    className="w-full bg-theme-surface border-2 border-pink-100 rounded-2xl p-4 text-gray-800 text-sm font-medium focus:ring-0 focus:border-pink-500 transition-all min-h-[120px]"
                                    placeholder="Write your custom message..."
                                />
                            ) : (
                                <PredefinedSelector
                                    current={connectMsg}
                                    onSelect={(val) => {
                                        setConnectMsg(val);
                                        handleSave("connectMessage", val);
                                    }}
                                />
                            )}

                            {isPremium && (
                                <button
                                    onClick={() => handleSave("connectMessage", connectMsg)}
                                    disabled={isSaving}
                                    className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-rose-100 hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2"
                                >
                                    {isSaving ? "Saving..." : <><Save size={18} /> Update Custom Message</>}
                                </button>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-700 text-base leading-relaxed font-semibold italic">
                            "{connectMsg}"
                        </p>
                    )}

                    {!isPremium && isEditingConnect && (
                        <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                            <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={18} />
                            <div>
                                <p className="text-xs font-bold text-blue-900 uppercase">Premium Benefit</p>
                                <p className="text-[11px] text-blue-700/80 font-medium">Upgrade to Premium to write your own personalized messages for better response rates!</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Message on Accept Card */}
            <div className={`group relative bg-theme-surface border-2 rounded-[2.5rem] p-6 md:p-8 transition-all duration-500 ${isPremium ? 'border-gray-50 hover:border-rose-100' : 'border-gray-100 opacity-90 grayscale-[0.5]'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex gap-5 flex-1 max-w-2xl">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${isPremium ? 'bg-orange-50 text-orange-500' : 'bg-gray-100 text-gray-400'}`}>
                            <Crown size={28} />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-black text-gray-900">Message on Accept</h3>
                                {!isPremium && (
                                    <span className="text-[10px] font-black bg-gray-900 text-white px-2 py-0.5 rounded-md uppercase">Locked</span>
                                )}
                            </div>
                            <p className="text-sm text-gray-400 font-medium">Message sent when you accept an interest</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {isPremium ? (
                            !isEditingAccept ? (
                                <button
                                    onClick={() => setIsEditingAccept(true)}
                                    className="w-full md:w-auto px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all flex items-center justify-center gap-2"
                                >
                                    <Edit3 size={16} />
                                    Edit Message
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsEditingAccept(false)}
                                    className="px-4 py-3 bg-gray-50 text-theme-text-secondary rounded-2xl font-bold text-sm"
                                >
                                    Cancel
                                </button>
                            )
                        ) : (
                            <button
                                onClick={() => window.location.href = '/payment'}
                                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 bg-[length:200%_auto] hover:bg-right text-white rounded-2xl font-black text-sm shadow-lg shadow-rose-100 transition-all flex items-center justify-center gap-2 animate-pulse"
                            >
                                Upgrade for this feature
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-8 bg-gray-50/50 rounded-3xl p-6 border-2 border-gray-50 relative overflow-hidden">
                    {isEditingAccept && isPremium ? (
                        <div className="space-y-4">
                            <textarea
                                value={acceptMsg}
                                onChange={(e) => setAcceptMsg(e.target.value)}
                                className="w-full bg-theme-surface border-2 border-pink-100 rounded-2xl p-4 text-gray-800 text-sm font-medium focus:ring-0 focus:border-pink-500 transition-all min-h-[120px]"
                                placeholder="Write your custom accept message..."
                            />
                            <button
                                onClick={() => handleSave("acceptMessage", acceptMsg)}
                                disabled={isSaving}
                                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-rose-100 transition-all flex items-center justify-center gap-2"
                            >
                                {isSaving ? "Saving..." : <><Save size={18} /> Save Accept Message</>}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className={`text-base leading-relaxed font-semibold italic ${isPremium ? 'text-gray-700' : 'text-gray-400'}`}>
                                "{acceptMsg}"
                            </p>
                            {!isPremium && (
                                <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-tight">
                                    <AlertCircle size={14} />
                                    Default message being used
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer hint */}
            <div className="bg-rose-50 rounded-3xl p-6 border border-rose-100 flex items-start gap-4">
                <div className="bg-theme-surface p-2.5 rounded-xl text-rose-600 shadow-sm shrink-0">
                    <Undo2 size={20} />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-black text-rose-900">Why customize?</h4>
                    <p className="text-xs text-rose-700/80 font-medium leading-relaxed">
                        Personalized messages have a <span className="font-black">2x higher</span> acceptance rate than standard messages. Express yourself to find the best match!
                    </p>
                </div>
            </div>
        </div>
    );
}