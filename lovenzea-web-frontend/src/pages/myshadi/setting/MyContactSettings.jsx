import React, { useState, useEffect } from 'react'
import { Check, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';


function MyContactSettings({ profile, onUpdate }) {
    const [localDisplayStatus, setLocalDisplayStatus] = useState(profile?.contactDisplayStatus || 'Only Premium Members');
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [localPhone, setLocalPhone] = useState(profile?.mobileNumber || '');

    useEffect(() => {
        setLocalDisplayStatus(profile?.contactDisplayStatus || 'Only Premium Members');
        setLocalPhone(profile?.mobileNumber || '');
    }, [profile]);

    const handleSubmit = () => {
        onUpdate({ contactDisplayStatus: localDisplayStatus });
    };

    const handlePhoneSubmit = () => {
        if (!/^[6-9][0-9]{9}$/.test(localPhone)) {
            toast.error("Please enter a valid 10-digit mobile number starting with 6-9");
            return;
        }
        onUpdate({ mobileNumber: localPhone });
        setIsEditingPhone(false);
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-gray-50">
            {/* Contact Number Section */}
            <div className="bg-theme-surface border border-theme-border rounded-lg p-4 md:p-6 mb-4 md:mb-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="text-sm md:text-base lg:text-lg font-semibold text-gray-800">
                        Contact Number
                    </div>
                    {!isEditingPhone ? (
                        <button
                            onClick={() => setIsEditingPhone(true)}
                            className="text-cyan-500 font-semibold text-sm hover:text-cyan-600 transition-colors"
                        >
                            Edit
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditingPhone(false)}
                                className="text-gray-400 font-semibold text-sm hover:text-theme-text-secondary transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePhoneSubmit}
                                className="text-cyan-500 font-semibold text-sm hover:text-cyan-600 transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                    <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    {isEditingPhone ? (
                        <input
                            type="text"
                            value={localPhone}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val && !/^\d*$/.test(val)) return;
                                setLocalPhone(val);
                            }}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm md:text-base rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-1.5 px-3 max-w-[200px]"
                            placeholder="Mobile Number"
                        />
                    ) : (
                        <>
                            <span className="text-gray-900 text-sm md:text-base lg:text-lg font-medium">
                                {profile?.mobileNumber || "Not Provided"}
                            </span>
                            <div className="flex items-center gap-1 text-green-600 ml-2">
                                <Check className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="text-xs md:text-sm font-medium">Verified</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Contact Display Status */}
            <div className="bg-theme-surface border border-theme-border rounded-lg p-4 md:p-6">
                <div className="text-sm md:text-base lg:text-lg font-semibold text-gray-800 mb-4 md:mb-6">
                    Contact display status
                </div>

                <div className="space-y-4">
                    {[
                        { id: "premium", label: "Only Premium Members", value: "Only Premium Members" },
                        { id: "liked", label: "Only Premium Members you like", value: "Only Premium Members you like" },
                        { id: "none", label: "No one", value: "No one" },
                    ].map((option) => (
                        <label
                            key={option.id}
                            className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${localDisplayStatus === option.value
                                ? "border-pink-500 bg-pink-50/50 shadow-sm"
                                : "border-gray-100 hover:border-pink-200 hover:bg-gray-50"
                                }`}
                        >
                            <input
                                type="radio"
                                name="displayStatus"
                                value={option.value}
                                checked={localDisplayStatus === option.value}
                                onChange={(e) => {
                                    setLocalDisplayStatus(e.target.value);
                                    onUpdate({ contactDisplayStatus: e.target.value });
                                }}
                                className="w-5 h-5 text-pink-500 border-gray-300 focus:ring-pink-500 mt-0.5"
                            />
                            <div className="flex-1">
                                <span className={`block font-medium ${localDisplayStatus === option.value ? "text-pink-900" : "text-gray-700"
                                    }`}>
                                    {option.label}
                                </span>
                                {option.value === "No one" && (
                                    <span className="text-xs text-theme-text-secondary mt-1 block">
                                        Matches won't be able to call you
                                    </span>
                                )}
                            </div>
                        </label>
                    ))}
                </div>

            </div>
        </div>
    )
}
export default MyContactSettings;
