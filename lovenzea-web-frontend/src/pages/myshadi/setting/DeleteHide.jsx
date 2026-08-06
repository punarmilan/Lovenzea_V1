import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { Eye, EyeOff, Trash2, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

/**
 * DeleteHide Component
 * Manages profile visibility (Hide/Show) and account deletion.
 * Features a premium design with instant-save for visibility and multi-step confirmation for deletion.
 */
export default function DeleteHide({ profile, onUpdate }) {
    const isHidden = profile?.profileVisibility === "HIDDEN";
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Track local toggle state
    const [currentVisibility, setCurrentVisibility] = useState(isHidden ? "hidden" : "visible");

    useEffect(() => {
        setCurrentVisibility(profile?.profileVisibility === "HIDDEN" ? "hidden" : "visible");
    }, [profile]);

    /**
     * Handles instant toggle of profile visibility
     */
    const handleHideToggle = async () => {
        setIsSaving(true);
        const newStatus = currentVisibility === "visible" ? "HIDDEN" : "Public";

        // Optimistic UI update
        setCurrentVisibility(newStatus === "HIDDEN" ? "hidden" : "visible");

        try {
            await onUpdate({ profileVisibility: newStatus });
            setLastSaved(new Date().toLocaleTimeString());
        } catch (error) {
            console.error("Failed to update visibility:", error);
            // Revert on error
            setCurrentVisibility(isHidden ? "hidden" : "visible");
        } finally {
            setTimeout(() => setIsSaving(false), 500);
        }
    };

    /**
     * Handles account deactivation (Delete Profile)
     */
    const handleDeleteProfile = async () => {
        setIsSaving(true);
        try {
            // Deactivating account by setting enabled: false
            await onUpdate({ enabled: false });
            Swal.fire({ text: "Your profile has been deactivated. You will now be logged out.", confirmButtonColor: '#8C6D39' });
            // In a real app, clear tokens and redirect to login
            window.location.href = "/login";
        } catch (error) {
            console.error("Failed to delete profile:", error);
            Swal.fire({ text: "An error occurred while trying to deactivate your profile. Please try again.", confirmButtonColor: '#8C6D39' });
            setIsSaving(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="w-full space-y-8">
            {/* Header info */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                        <span className="w-2 h-6 bg-pink-500 rounded-full"></span>
                        Privacy & Account
                    </h2>
                    <p className="text-sm text-theme-text-secondary mt-1">Control your presence on LovenZea</p>
                </div>
                {lastSaved && (
                    <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wider">
                        <CheckCircle2 size={10} />
                        Updated {lastSaved}
                    </div>
                )}
            </div>

            {/* Visibility Card */}
            <div className={`group relative bg-theme-surface border-2 rounded-[2rem] p-6 md:p-8 transition-all duration-500 ${currentVisibility === "hidden" ? 'border-orange-200 bg-orange-50/20' : 'border-gray-50'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex gap-5 flex-1 max-w-2xl">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${currentVisibility === "hidden" ? 'bg-theme-warning text-white shadow-lg shadow-orange-100' : 'bg-pink-50 text-pink-500'}`}>
                            {currentVisibility === "hidden" ? <EyeOff size={28} /> : <Eye size={28} />}
                        </div>
                        <div className="space-y-1.5">
                            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                Hide Profile
                                {currentVisibility === "hidden" && (
                                    <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase">Currently Hidden</span>
                                )}
                            </h3>
                            <p className="text-sm text-theme-text-secondary leading-relaxed font-medium">
                                When hidden, you won't appear in Search or Matches. You won't be able to send connects or messages, but your profile remains safe.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleHideToggle}
                        disabled={isSaving}
                        className={`relative flex items-center justify-center w-full md:w-auto px-10 py-4 rounded-2xl font-black transition-all duration-300 active:scale-95 shadow-md ${currentVisibility === "hidden"
                            ? "bg-theme-surface text-orange-600 border-2 border-orange-200 hover:bg-orange-50"
                            : "bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:shadow-xl hover:shadow-pink-100"
                            } disabled:opacity-50`}
                    >
                        {isSaving ? "Updating..." : currentVisibility === "hidden" ? "Un-Hide Profile" : "Hide My Profile"}
                    </button>
                </div>
            </div>

            {/* Deletion Card */}
            <div className="relative overflow-hidden bg-theme-surface border-2 border-gray-50 rounded-[2rem] p-6 md:p-8 hover:border-red-100 transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex gap-5 flex-1 max-w-2xl">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center flex-shrink-0 group-hover:text-red-500 group-hover:bg-red-50 transition-colors">
                            <Trash2 size={28} />
                        </div>
                        <div className="space-y-1.5">
                            <h3 className="text-lg font-black text-gray-900">Delete Account</h3>
                            <p className="text-sm text-theme-text-secondary leading-relaxed">
                                Permanent action. You will lose all your matches, messages, and membership benefits. This cannot be undone.
                            </p>
                        </div>
                    </div>

                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full md:w-auto px-10 py-4 rounded-2xl font-black text-gray-400 border-2 border-gray-100 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all duration-300 active:scale-95"
                        >
                            Deactivate Account
                        </button>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto animate-in zoom-in-95 duration-200">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-theme-text-secondary bg-gray-50 hover:bg-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteProfile}
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-100 transition-all active:scale-95"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    )}
                </div>

                {showDeleteConfirm && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                        <ShieldAlert className="text-red-600 shrink-0" size={20} />
                        <p className="text-xs font-bold text-red-800 leading-relaxed uppercase tracking-wide">
                            Warning: Deactivating your account will immediately hide you from all members and terminate your current session.
                        </p>
                    </div>
                )}
            </div>

            {/* Hint Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 flex items-start gap-4 shadow-sm">
                <div className="bg-theme-surface p-2.5 rounded-xl text-blue-600 shadow-sm shrink-0">
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-black text-blue-900 mb-1">
                        Need a Break?
                    </h3>
                    <p className="text-xs text-blue-700/80 leading-relaxed font-medium">
                        Instead of deleting, consider hiding your profile. You can come back and re-activate it anytime with all your data intact!
                    </p>
                </div>
            </div>
        </div>
    );
}
