import { ChevronDown, ChevronUp, Clock, MapPin, Star, Grid, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';

function AstroDetails({ profile, onUpdate }) {
    // State for collapsible sections
    const [isPrivacyExpanded, setIsPrivacyExpanded] = useState(false);
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Initial data from profile
    const [astroData, setAstroData] = useState({
        timeOfBirth: profile?.timeOfBirth || '08:00',
        placeOfBirth: profile?.placeOfBirth || 'Pune, Maharashtra, India',
        manglikStatus: profile?.manglikStatus || "Don't Know",
        rashi: profile?.rashi || 'Capricorn (Makar)',
        nakshatra: profile?.nakshatra || 'Shravana'
    });

    // Privacy option mapping
    const privacyMap = {
        'ALL_MEMBERS': 'Visible to all Members',
        'PREMIUM_ONLY': 'Visible to Premium Members only',
        'HIDDEN': 'Hidden'
    };
    const reversePrivacyMap = {
        'Visible to all Members': 'ALL_MEMBERS',
        'Visible to Premium Members only': 'PREMIUM_ONLY',
        'Hidden': 'HIDDEN'
    };

    const [privacyOption, setPrivacyOption] = useState(privacyMap[profile?.astroVisibility] || 'Visible to all Members');

    useEffect(() => {
        if (profile) {
            setAstroData({
                timeOfBirth: profile.timeOfBirth || '08:00',
                placeOfBirth: profile.placeOfBirth || 'Pune, Maharashtra, India',
                manglikStatus: profile.manglikStatus || "Don't Know",
                rashi: profile.rashi || 'Capricorn (Makar)',
                nakshatra: profile.nakshatra || 'Shravana'
            });
            setPrivacyOption(privacyMap[profile.astroVisibility] || 'Visible to all Members');
            setShowOtherRashi(profile.rashi && !rashiOptions.includes(profile.rashi));
            setShowOtherNakshatra(profile.nakshatra && !nakshatraOptions.includes(profile.nakshatra));
        }
    }, [profile]);

    // Temporary state for form inputs
    const [formData, setFormData] = useState({ ...astroData });
    const [showOtherRashi, setShowOtherRashi] = useState(false);
    const [showOtherNakshatra, setShowOtherNakshatra] = useState(false);

    // Manglik options
    const manglikOptions = ["Don't Know", "Yes", "No"];

    // Rashi options
    const rashiOptions = [
        'Aries (Mesh)',
        'Taurus (Vrishabh)',
        'Gemini (Mithun)',
        'Cancer (Kark)',
        'Leo (Sinh)',
        'Virgo (Kanya)',
        'Libra (Tula)',
        'Scorpio (Vrishchik)',
        'Sagittarius (Dhanu)',
        'Capricorn (Makar)',
        'Aquarius (Kumbh)',
        'Pisces (Meen)'
    ];

    // Nakshatra options (27 nakshatras)
    const nakshatraOptions = [
        'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
        'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
        'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
        'Moola', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
        'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];

    // Place options
    const placeOptions = [
        'Pune, Maharashtra, India',
        'Mumbai, Maharashtra, India',
        'Delhi, Delhi, India',
        'Bangalore, Karnataka, India',
        'Chennai, Tamil Nadu, India',
        'Kolkata, West Bengal, India',
        'Hyderabad, Telangana, India',
        'Ahmedabad, Gujarat, India',
        'Jaipur, Rajasthan, India',
        'Lucknow, Uttar Pradesh, India'
    ];

    const handleEditClick = () => {
        setFormData({ ...astroData });
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setFormData({ ...astroData });
    };

    const handleInputChange = (field, value) => {
        if (field === 'rashi') {
            if (value === 'Other') {
                setShowOtherRashi(true);
                setFormData(prev => ({ ...prev, rashi: '' }));
            } else {
                setShowOtherRashi(false);
                setFormData(prev => ({ ...prev, [field]: value }));
            }
        } else if (field === 'nakshatra') {
            if (value === 'Other') {
                setShowOtherNakshatra(true);
                setFormData(prev => ({ ...prev, nakshatra: '' }));
            } else {
                setShowOtherNakshatra(false);
                setFormData(prev => ({ ...prev, [field]: value }));
            }
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSave = () => {
        onUpdate({
            ...formData,
            manglikStatus: formData.manglikStatus, // Sync field name
        });
        setIsEditModalOpen(false);
    };

    const handlePrivacyChange = (option) => {
        setPrivacyOption(option);
        onUpdate({ astroVisibility: reversePrivacyMap[option] });
    };

    return (
        <>
            <div className="p-4 md:p-6 lg:p-8 bg-gray-50">
                {/* Main Container */}
                <div className="bg-theme-surface border border-theme-border rounded-lg overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="bg-gray-100 border-b border-theme-border p-4 md:p-5">
                        <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-800">
                            Astro Details
                        </h2>
                    </div>

                    {/* Astro Privacy Settings */}
                    <div className="border-b border-theme-border">
                        <div
                            className="flex items-center justify-between p-4 md:p-5 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => setIsPrivacyExpanded(!isPrivacyExpanded)}
                        >
                            <div className="flex-1">
                                <div className="text-sm md:text-base lg:text-lg font-semibold text-gray-800">
                                    Astro Privacy Settings
                                </div>
                                <div className="text-xs md:text-sm text-theme-text-secondary mt-1">
                                    {privacyOption}
                                </div>
                            </div>
                            {isPrivacyExpanded ? (
                                <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0" />
                            ) : (
                                <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0" />
                            )}
                        </div>

                        {isPrivacyExpanded && (
                            <div className="p-4 md:p-5 bg-gray-50 border-t border-theme-border">
                                <p className="text-xs md:text-sm text-theme-text-secondary mb-3">
                                    Choose who can see your astro details
                                </p>
                                <div className="space-y-2">
                                    {['Visible to all Members', 'Visible to Premium Members only', 'Hidden'].map((option) => (
                                        <label
                                            key={option}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-theme-surface cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="radio"
                                                name="privacy"
                                                checked={privacyOption === option}
                                                onChange={() => handlePrivacyChange(option)}
                                                className="w-4 h-4 text-cyan-500 focus:ring-cyan-500"
                                            />
                                            <span className="text-sm md:text-base text-gray-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Astro Details Section */}
                    <div>
                        <div
                            className="flex items-center justify-between p-4 md:p-5 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                        >
                            <div className="flex items-center gap-2 md:gap-3 flex-1">
                                <div className="text-sm md:text-base lg:text-lg font-semibold text-gray-800">
                                    Astro Details
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick();
                                    }}
                                    className="text-cyan-500 font-semibold text-xs md:text-sm hover:text-cyan-600 border border-cyan-500 px-2 md:px-3 py-1 rounded transition-colors"
                                >
                                    EDIT
                                </button>
                            </div>
                            {isDetailsExpanded ? (
                                <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0" />
                            ) : (
                                <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0" />
                            )}
                        </div>

                        {isDetailsExpanded && (
                            <div className="p-4 md:p-5 space-y-4 bg-theme-surface border-t border-theme-border">
                                {/* Time of Birth */}
                                <div className="flex items-start gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs md:text-sm text-theme-text-secondary mb-1">Time Of Birth</div>
                                        <div className="text-sm md:text-base lg:text-lg font-semibold text-gray-800">
                                            {astroData.timeOfBirth}
                                        </div>
                                    </div>
                                </div>

                                {/* Place of Birth */}
                                <div className="flex items-start gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs md:text-sm text-theme-text-secondary mb-1">City Of Birth</div>
                                        <div className="text-sm md:text-base lg:text-lg font-semibold text-gray-800">
                                            {astroData.placeOfBirth}
                                        </div>
                                    </div>
                                </div>

                                {/* Manglik */}
                                <div className="flex items-start gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                        <Star className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs md:text-sm text-theme-text-secondary mb-1">Manglik/Chevvai Dosham</div>
                                        <div className="text-sm md:text-base lg:text-lg font-semibold text-gray-800">
                                            {astroData.manglikStatus}
                                        </div>
                                    </div>
                                </div>

                                {/* Nakshatra */}
                                <div className="flex items-start gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                        <Star className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs md:text-sm text-theme-text-secondary mb-1">Nakshatra</div>
                                        <div className="text-sm md:text-base lg:text-lg font-semibold text-gray-800">
                                            {astroData.nakshatra}
                                        </div>
                                    </div>
                                </div>

                                {/* Rashi */}
                                <div className="flex items-start gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                        <Grid className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs md:text-sm text-theme-text-secondary mb-1">Rashi</div>
                                        <div className="text-sm md:text-base lg:text-lg font-semibold text-gray-800">
                                            {astroData.rashi}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-theme-surface rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-theme-surface border-b border-theme-border p-4 md:p-6 flex items-center justify-between z-10">
                            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
                                Edit Details
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 md:w-6 md:h-6 text-theme-text-secondary" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4 md:p-6 space-y-6">
                            {/* Time of Birth and Place of Birth - Side by Side on larger screens */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {/* Time of Birth */}
                                <div>
                                    <label className="block text-sm md:text-base font-semibold text-gray-800 mb-2">
                                        Time Of Birth
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            value={formData.timeOfBirth}
                                            onChange={(e) => handleInputChange('timeOfBirth', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-theme-border rounded-xl focus:border-cyan-400 focus:outline-none text-sm md:text-base transition-colors"
                                        />
                                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Place of Birth */}
                                <div>
                                    <label className="block text-sm md:text-base font-semibold text-gray-800 mb-2">
                                        City Of Birth
                                    </label>
                                    <select
                                        value={formData.placeOfBirth}
                                        onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-theme-border rounded-xl focus:border-cyan-400 focus:outline-none text-sm md:text-base appearance-none bg-theme-surface cursor-pointer transition-colors"
                                    >
                                        {placeOptions.map((place) => (
                                            <option key={place} value={place}>
                                                {place}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Manglik Dosha */}
                            <div>
                                <label className="block text-sm md:text-base font-semibold text-gray-800 mb-3">
                                    Manglik/Chevvai Dosham
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {manglikOptions.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => handleInputChange('manglikStatus', option)}
                                            className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-semibold text-sm md:text-base transition-all ${formData.manglikStatus === option
                                                ? 'bg-cyan-500 text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Raashi */}
                            <div>
                                <label className="block text-sm md:text-base font-semibold text-gray-800 mb-2">
                                    Rashi
                                </label>
                                <p className="text-xs md:text-sm text-theme-text-secondary mb-3">
                                    This is based on lunar star sign.
                                </p>
                                <select
                                    value={showOtherRashi ? 'Other' : formData.rashi}
                                    onChange={(e) => handleInputChange('rashi', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-theme-border rounded-xl focus:border-cyan-400 focus:outline-none text-sm md:text-base appearance-none bg-theme-surface cursor-pointer transition-colors"
                                >
                                    <option value="">Select Rashi</option>
                                    {[...rashiOptions, 'Other'].map((rashi) => (
                                        <option key={rashi} value={rashi}>
                                            {rashi}
                                        </option>
                                    ))}
                                </select>
                                {showOtherRashi && (
                                    <input
                                        type="text"
                                        value={formData.rashi}
                                        onChange={(e) => setFormData(prev => ({ ...prev, rashi: e.target.value }))}
                                        placeholder="Enter custom Rashi"
                                        className="mt-2 w-full px-4 py-2 border-2 border-theme-border rounded-xl focus:border-cyan-400 focus:outline-none text-sm md:text-base transition-colors"
                                    />
                                )}
                            </div>

                            {/* Nakshatra */}
                            <div>
                                <label className="block text-sm md:text-base font-semibold text-gray-800 mb-2">
                                    Nakshatra
                                </label>
                                <p className="text-xs md:text-sm text-theme-text-secondary mb-3">
                                    Selected based on your Raashi
                                </p>
                                <select
                                    value={showOtherNakshatra ? 'Other' : formData.nakshatra}
                                    onChange={(e) => handleInputChange('nakshatra', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-theme-border rounded-xl focus:border-cyan-400 focus:outline-none text-sm md:text-base appearance-none bg-theme-surface cursor-pointer transition-colors"
                                >
                                    <option value="">Select Nakshatra</option>
                                    {[...nakshatraOptions, 'Other'].map((nakshatra) => (
                                        <option key={nakshatra} value={nakshatra}>
                                            {nakshatra}
                                        </option>
                                    ))}
                                </select>
                                {showOtherNakshatra && (
                                    <input
                                        type="text"
                                        value={formData.nakshatra}
                                        onChange={(e) => setFormData(prev => ({ ...prev, nakshatra: e.target.value }))}
                                        placeholder="Enter custom Nakshatra"
                                        className="mt-2 w-full px-4 py-2 border-2 border-theme-border rounded-xl focus:border-cyan-400 focus:outline-none text-sm md:text-base transition-colors"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-theme-surface border-t border-theme-border p-4 md:p-6">
                            <button
                                onClick={handleSave}
                                className="w-full px-6 py-3 md:py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-bold text-sm md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }

                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }

                /* Custom select arrow */
                select {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 0.75rem center;
                    background-size: 1.5em 1.5em;
                    padding-right: 2.5rem;
                }

                /* Custom scrollbar for modal */
                .overflow-y-auto::-webkit-scrollbar {
                    width: 8px;
                }

                .overflow-y-auto::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }

                .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }

                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </>
    );
}

export default AstroDetails;
