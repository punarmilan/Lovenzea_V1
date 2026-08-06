import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaCalendarAlt, FaArrowsAltV, FaGlobe, FaBook, FaUsers, FaLanguage, FaHeart, FaChevronRight, FaArrowLeft } from 'react-icons/fa';

/**
 * ContactFilters Page
 * A modern and attractive interface for managing contact privacy.
 * Matches the user's latest design request with clean cards, vibrant labels, and pill-style indicators.
 */
const ContactFilters = () => {
    const navigate = useNavigate();
    const { preferences } = useSelector((state) => state.profile);

    const filters = [
        {
            id: 'age',
            label: 'Age',
            icon: '📅',
            color: 'text-rose-600',
            value: preferences ? `${preferences.minAge || 20} - ${preferences.maxAge || 28}` : '20 - 28',
            path: '/my-shadi/partner-preferences/age-range',
            isActive: true // Special highlight from the image
        },
        {
            id: 'height',
            label: 'Height',
            icon: '↕️',
            color: 'text-gray-900',
            value: preferences ? `${preferences.minHeight || "4' 5\""} - ${preferences.maxHeight || "7' 0\""}` : "4' 5\" - 7' 0\"",
            path: '/my-shadi/partner-preferences/height-range'
        },
        {
            id: 'country',
            label: 'Country',
            icon: '🌐',
            color: 'text-gray-900',
            value: preferences?.preferredCountry || 'Open to All',
            path: '/my-shadi/partner-preferences/country'
        },
        {
            id: 'religion',
            label: 'Religion',
            icon: '📒',
            color: 'text-gray-900',
            value: preferences?.preferredReligion || 'Open to All',
            path: '/my-shadi/partner-preferences/religion'
        },
        {
            id: 'community',
            label: 'Community',
            icon: '👥',
            color: 'text-gray-900',
            value: preferences?.preferredCaste || 'Open to All',
            path: '/my-shadi/partner-preferences/community'
        },
        {
            id: 'motherTongue',
            label: 'Mother tongue',
            icon: '🌐',
            color: 'text-gray-900',
            value: 'Open to All',
            path: '/my-shadi/partner-preferences/mothertongue'
        },
        {
            id: 'maritalStatus',
            label: 'Marital status',
            icon: '💑',
            color: 'text-gray-900',
            value: preferences?.maritalStatus || 'Open to All',
            path: '/my-shadi/partner-preferences/maritalstatus'
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8f9fc] py-8 sm:py-12 px-4 select-none">
            <div className="max-w-3xl mx-auto">
                {/* Navigation Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-gray-400 hover:text-rose-600 font-medium transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-theme-surface shadow-sm flex items-center justify-center group-hover:bg-rose-50 transition-colors">
                        <FaArrowLeft className="text-sm" />
                    </div>
                    <span className="text-sm uppercase tracking-wider">Back to Profile</span>
                </button>

                <div className="bg-theme-surface rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
                    {/* Header Section - Matches Image Styling */}
                    <div className="p-8 sm:p-12 pb-6">
                        <h1 className="text-4xl sm:text-5xl font-black text-[#1a1c23] mb-4 tracking-tight">
                            Who can contact me?
                        </h1>
                        <p className="text-theme-text-secondary text-lg sm:text-xl font-medium leading-relaxed max-w-xl">
                            Only Members matching the below criteria will get to see your contact details.
                        </p>
                        <div className="mt-6">
                            <span className="inline-flex items-center px-4 py-2 bg-gray-50 text-[#c1c4d6] italic text-sm font-medium rounded-2xl border border-gray-100/50">
                                Tap on the field to edit
                            </span>
                        </div>
                    </div>

                    {/* Filters List */}
                    <div className="px-4 pb-8 sm:px-8">
                        <div className="divide-y divide-gray-50">
                            {filters.map((filter) => (
                                <div
                                    key={filter.id}
                                    onClick={() => navigate(filter.path)}
                                    className="group flex items-center p-6 sm:p-8 hover:bg-rose-50/30 transition-all cursor-pointer rounded-2xl sm:rounded-[1.5rem]"
                                >
                                    {/* Icon with Subtle Background */}
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-theme-surface rounded-xl shadow-sm border border-gray-50 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                        <span className="text-2xl sm:text-3xl">
                                            {filter.icon}
                                        </span>
                                    </div>

                                    {/* Label & Value */}
                                    <div className="flex-1">
                                        <p className={`text-lg sm:text-xl font-black ${filter.isActive ? 'text-rose-600' : 'text-gray-900'} transition-colors`}>
                                            {filter.label}
                                        </p>
                                        <p className="text-base sm:text-lg text-gray-400 font-medium">
                                            {filter.value}
                                        </p>
                                    </div>

                                    {/* Circular Button - Matches Image (Top Right Icon) */}
                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${filter.isActive ? 'bg-rose-50 text-rose-500 border border-rose-100 shadow-sm' : 'bg-theme-surface text-gray-200 border border-gray-100 group-hover:border-rose-200 group-hover:text-rose-400 shadow-sm'}`}>
                                        <FaChevronRight className="text-xs sm:text-sm" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Premium Footer Box */}
                    <div className="p-8 sm:p-12 pt-4">
                        <div className="bg-[#f0f7ff] rounded-3xl p-6 sm:p-8 flex gap-6 items-start border border-blue-100/50 shadow-inner shadow-blue-500/5">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mt-2 shrink-0 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            <p className="text-[#3a4e69] text-base sm:text-lg leading-relaxed font-semibold">
                                Connection requests from all other Members will appear in the{' '}
                                <span className="text-blue-600 bg-blue-100/50 px-2 py-0.5 rounded-lg">Filtered out</span> folder of your
                                Inbox. These members can Chat with you, but will not be able to see your contact
                                details until you accept their request.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactFilters;
