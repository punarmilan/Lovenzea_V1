import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ArrowLeft, User, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartnerPreferences, updatePartnerPreferences } from '../../../Slice/ProfileSlice';

function ProfileManagedByPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { preferences } = useSelector((state) => state.profile);

    const [selections, setSelections] = useState({
        openToAll: false,
        self: true,
        parent: true,
        sibling: false
    });

    useEffect(() => {
        if (!preferences) {
            dispatch(fetchPartnerPreferences());
        } else {
            const currentVal = preferences.profileManagedBy || 'openToAll';
            const keys = currentVal.split(',').map(s => s.trim());
            setSelections({
                openToAll: keys.includes('openToAll'),
                self: keys.includes('self'),
                parent: keys.includes('parent'),
                sibling: keys.includes('sibling')
            });
        }
    }, [dispatch, preferences]);

    const handleCheckboxChange = (key) => {
        setSelections(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleApply = async () => {
        const selected = [];
        if (selections.openToAll) selected.push('openToAll');
        if (selections.self) selected.push('self');
        if (selections.parent) selected.push('parent');
        if (selections.sibling) selected.push('sibling');

        const result = selected.join(', ') || 'openToAll';

        try {
            await dispatch(updatePartnerPreferences({
                profileManagedBy: result
            })).unwrap();
            navigate('/my-shadi/partner-preferences');
        } catch (error) {
            console.error('Failed to update managed by:', error);
            Swal.fire({ text: 'Failed to update managed by. Please try again.', confirmButtonColor: '#8C6D39' });
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 sm:p-4">
            <div className="w-full max-w-xl bg-theme-surface rounded-2xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-theme-surface border-b border-theme-border p-4 sm:p-6 bg-gradient-to-r from-rose-500 to-rose-600">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors mb-3 sm:mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium text-base sm:text-lg">Profile Managed by</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                    {/* Open to All Option */}
                    <div className="mb-6">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={selections.openToAll}
                                    onChange={() => handleCheckboxChange('openToAll')}
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 border-2 rounded ${selections.openToAll
                                    ? 'bg-cyan-500 border-cyan-500'
                                    : 'bg-theme-surface border-gray-300'
                                    } transition-all`}>
                                    {selections.openToAll && (
                                        <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <div>
                                <span className="text-base sm:text-lg text-gray-900 font-normal">Open to All</span>
                                <span className="text-theme-text-secondary text-sm ml-2">(Recommended)</span>
                            </div>
                        </label>
                    </div>

                    {/* All Preferences Section */}
                    <div className="mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">All Preferences</h3>

                        <div className="space-y-4">
                            {/* Self */}
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={selections.self}
                                        onChange={() => handleCheckboxChange('self')}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 border-2 rounded ${selections.self
                                        ? 'bg-cyan-500 border-cyan-500'
                                        : 'bg-theme-surface border-gray-300'
                                        } transition-all`}>
                                        {selections.self && (
                                            <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span className="text-base sm:text-lg text-gray-900">Self</span>
                            </label>

                            {/* Parent / Guardian */}
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={selections.parent}
                                        onChange={() => handleCheckboxChange('parent')}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 border-2 rounded ${selections.parent
                                        ? 'bg-cyan-500 border-cyan-500'
                                        : 'bg-theme-surface border-gray-300'
                                        } transition-all`}>
                                        {selections.parent && (
                                            <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span className="text-base sm:text-lg text-gray-900">Parent / Guardian</span>
                            </label>

                            {/* Sibling / Friend / Other */}
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={selections.sibling}
                                        onChange={() => handleCheckboxChange('sibling')}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 border-2 rounded ${selections.sibling
                                        ? 'bg-cyan-500 border-cyan-500'
                                        : 'bg-theme-surface border-gray-300'
                                        } transition-all`}>
                                        {selections.sibling && (
                                            <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span className="text-base sm:text-lg text-gray-900">Sibling / Friend / Other</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 sm:p-6 pt-2 sm:pt-4 flex gap-3 sm:gap-4">
                    <button
                        onClick={handleCancel}
                        className="flex-1 px-6 py-3 bg-theme-surface text-theme-text-secondary border border-gray-300 rounded-full font-medium text-base sm:text-lg hover:bg-gray-50 transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 px-6 py-3 bg-cyan-500 text-white rounded-full font-medium text-base sm:text-lg hover:bg-cyan-600 transition-all active:scale-95 shadow-md"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileManagedByPage 