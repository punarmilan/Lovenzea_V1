import React, { useState } from "react";
import Swal from 'sweetalert2';
import { ShieldAlert, Trash2, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * DeleteProfile Component (Standalone Version)
 * Provides a dedicated interface for hiding or deleting the user profile.
 */
function DeleteProfile({ profile, onUpdate }) {
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState(profile?.profileVisibility === "HIDDEN" ? "hidden" : "visible");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleToggleVisibility = async () => {
        setIsSaving(true);
        const nextStatus = status === "visible" ? "HIDDEN" : "Public";
        try {
            await onUpdate({ profileVisibility: nextStatus });
            setStatus(nextStatus === "HIDDEN" ? "hidden" : "visible");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsSaving(true);
        try {
            await onUpdate({ enabled: false });
            Swal.fire({ text: "Account deactivated successfully.", confirmButtonColor: '#8C6D39' });
            window.location.href = "/login";
        } catch (e) {
            setIsSaving(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
            <div className="bg-theme-surface rounded-[2.5rem] border-2 border-gray-50 p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-pink-50 text-pink-500 rounded-2xl">
                        <ShieldAlert size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Manage Account</h2>
                        <p className="text-sm text-theme-text-secondary font-medium">Temporary hide or permanent delete</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Hide Option */}
                    <div className={`p-6 rounded-3xl border-2 transition-all duration-300 ${status === "hidden" ? 'border-orange-200 bg-orange-50/30' : 'border-gray-50 bg-gray-50/30'}`}>
                        <div className="flex justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${status === "hidden" ? 'bg-theme-warning text-white' : 'bg-theme-surface text-gray-400'}`}>
                                    <EyeOff size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Hide Profile</h3>
                                    <p className="text-xs text-theme-text-secondary">Take a break from searches</p>
                                </div>
                            </div>
                            <button
                                onClick={handleToggleVisibility}
                                disabled={isSaving}
                                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${status === "hidden" ? 'bg-theme-surface text-orange-600 shadow-sm' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                            >
                                {status === "hidden" ? "Show Me" : "Hide Me"}
                            </button>
                        </div>
                    </div>

                    {/* Delete Option */}
                    <div className={`p-6 rounded-3xl border-2 transition-all duration-300 ${showDeleteConfirm ? 'border-red-200 bg-red-50/30' : 'border-gray-50 bg-gray-50/30'}`}>
                        {!showDeleteConfirm ? (
                            <div className="flex justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-theme-surface text-gray-400">
                                        <Trash2 size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Delete Account</h3>
                                        <p className="text-xs text-theme-text-secondary">Permanent data removal</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="px-6 py-2 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all underline decoration-2 underline-offset-4"
                                >
                                    Delete
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in zoom-in-95">
                                <div className="flex items-center gap-2 text-red-600">
                                    <AlertCircle size={18} />
                                    <span className="text-sm font-black uppercase tracking-tight">Are you absolutely sure?</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDelete}
                                        disabled={isSaving}
                                        className="flex-1 bg-red-600 text-white font-black py-3 rounded-xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all text-sm"
                                    >
                                        Yes, Delete
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 bg-theme-surface text-theme-text-secondary font-bold py-3 rounded-xl border border-theme-border transition-all text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {status === "hidden" && !showDeleteConfirm && (
                    <div className="mt-6 flex items-center gap-2 text-orange-600 bg-orange-50 p-3 rounded-xl animate-pulse">
                        <CheckCircle2 size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Profile is currently hidden</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DeleteProfile;