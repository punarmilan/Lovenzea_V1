import React, { useState, useEffect } from 'react'

function AccountSettings({ email, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [localEmail, setLocalEmail] = useState(email || '');

    useEffect(() => {
        setLocalEmail(email || '');
    }, [email]);

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-gray-50">
            <div className="bg-theme-surface border border-theme-border rounded-lg p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                        <label className="block text-sm md:text-base text-theme-text-secondary mb-2">
                            Update Email Id:
                        </label>
                        {isEditing ? (
                            <input
                                type="email"
                                value={localEmail}
                                onChange={(e) => setLocalEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm md:text-base"
                            />
                        ) : (
                            <div className="text-sm md:text-base lg:text-lg font-medium text-gray-900">
                                {email}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            if (isEditing && localEmail !== email) {
                                onUpdate({ email: localEmail });
                            }
                            setIsEditing(!isEditing);
                        }}
                        className="text-cyan-500 font-semibold text-sm md:text-base hover:text-cyan-600 transition-colors self-start sm:self-auto"
                    >
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AccountSettings