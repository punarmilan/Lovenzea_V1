import { ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartnerPreferences, updatePartnerPreferences } from '../../../Slice/ProfileSlice';

function DietPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { preferences } = useSelector((state) => state.profile);

    const [selected, setSelected] = useState('openToAll');

    useEffect(() => {
        if (!preferences) {
            dispatch(fetchPartnerPreferences());
        } else {
            const currentVal = preferences.preferredDiet || 'openToAll';
            setSelected(currentVal);
        }
    }, [dispatch, preferences]);

    const handleApply = async () => {
        try {
            await dispatch(updatePartnerPreferences({
                preferredDiet: selected
            })).unwrap();
            navigate('/my-shadi/partner-preferences');
        } catch (error) {
            console.error('Failed to update diet:', error);
            Swal.fire({ text: 'Failed to update diet. Please try again.', confirmButtonColor: '#8C6D39' });
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };


    return (
        <div className="min-h-screen  bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50  flex items-center justify-center p-2 sm:p-4md:p-6">
            <div className="w-full max-w-3xl bg-theme-surface rounded-2xl sm:rounded-3xl  shadow-2xl overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="bg-theme-surface border-b border-theme-border p-4 sm:p-6 bg-gradient-to-r from-rose-500 to-rose-600">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors mb-3 sm:mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium text-base sm:text-lg">Diet</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                    <div className="space-y-4">
                        {/* Open to All */}
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="radio"
                                    name="diet"
                                    checked={selected === 'openToAll'}
                                    onChange={() => setSelected('openToAll')}
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${selected === 'openToAll'
                                    ? 'border-cyan-500'
                                    : 'border-gray-300'
                                    } transition-all`}>
                                    {selected === 'openToAll' && (
                                        <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                                    )}
                                </div>
                            </div>
                            <span className="text-base sm:text-lg text-gray-900">Open to All</span>
                        </label>

                        {/* All Preferences Section */}
                        <div className="pt-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">All Preferences</h3>

                            <div className="space-y-4">
                                {/* Vegetarian */}
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative pt-0.5">
                                        <input
                                            type="radio"
                                            name="diet"
                                            checked={selected === 'vegetarian'}
                                            onChange={() => setSelected('vegetarian')}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${selected === 'vegetarian'
                                            ? 'border-cyan-500'
                                            : 'border-gray-300'
                                            } transition-all`}>
                                            {selected === 'vegetarian' && (
                                                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-base sm:text-lg text-gray-900">Vegetarian</div>
                                        <div className="text-sm text-theme-text-secondary italic mt-0.5">Includes Jain and Vegan Profiles</div>
                                    </div>
                                </label>

                                {/* Eggetarian */}
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative pt-0.5">
                                        <input
                                            type="radio"
                                            name="diet"
                                            checked={selected === 'eggetarian'}
                                            onChange={() => setSelected('eggetarian')}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${selected === 'eggetarian'
                                            ? 'border-cyan-500'
                                            : 'border-gray-300'
                                            } transition-all`}>
                                            {selected === 'eggetarian' && (
                                                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-base sm:text-lg text-gray-900">Eggetarian</div>
                                        <div className="text-sm text-theme-text-secondary italic mt-0.5">Includes Eggetarian and all Vegetarian Profiles</div>
                                    </div>
                                </label>

                                {/* Non Vegetarian */}
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="radio"
                                            name="diet"
                                            checked={selected === 'nonVegetarian'}
                                            onChange={() => setSelected('nonVegetarian')}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${selected === 'nonVegetarian'
                                            ? 'border-cyan-500'
                                            : 'border-gray-300'
                                            } transition-all`}>
                                            {selected === 'nonVegetarian' && (
                                                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-base sm:text-lg text-gray-900">Non Vegetarian</span>
                                </label>
                            </div>
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

export default DietPage