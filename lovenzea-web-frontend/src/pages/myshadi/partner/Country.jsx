import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ArrowLeft, Search, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartnerPreferences, updatePartnerPreferences } from '../../../Slice/ProfileSlice';

const Country = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { preferences } = useSelector((state) => state.profile);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [openToAll, setOpenToAll] = useState(true);
    const [expandedRegion, setExpandedRegion] = useState(null);

    useEffect(() => {
        if (!preferences) {
            dispatch(fetchPartnerPreferences());
        } else {
            const currentVal = preferences.preferredCountry || 'Open to All';
            setOpenToAll(currentVal === 'Open to All');
            setSelectedCountries(currentVal === 'Open to All' ? [] : currentVal.split(',').map(v => v.trim()));
        }
    }, [dispatch, preferences]);

    // Countries organized by region
    const countriesByRegion = {
        'Open to All': [],
        'India': [
            'Andaman & Nicobar', 'Andhra Pradesh', 'Arunachal Pradesh',
            'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
            'Dadra & Nagar Haveli', 'Daman & Diu', 'Delhi-NCR',
            'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
            'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala',
            'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra',
            'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
            'Odisha', 'Puducherry', 'Punjab', 'Rajasthan',
            'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
            'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
        ],
        'USA': [
            'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
            'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
            'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
            'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
            'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
            'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
            'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
            'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
            'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
            'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
        ],
        'UK': [
            'England', 'Scotland', 'Wales', 'Northern Ireland',
            'London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow',
            'Liverpool', 'Newcastle', 'Sheffield', 'Bristol', 'Edinburgh'
        ],
        'UAE': [
            'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman',
            'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'
        ],
        'Canada': [
            'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
            'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
            'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec',
            'Saskatchewan', 'Yukon'
        ]
    };

    // Flatten all countries for search
    const allCountries = Object.values(countriesByRegion).flat();

    const filteredCountries = searchTerm
        ? allCountries.filter(country =>
            country.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : null;

    const handleCountryToggle = (country) => {
        if (selectedCountries.includes(country)) {
            setSelectedCountries(selectedCountries.filter(c => c !== country));
        } else {
            setSelectedCountries([...selectedCountries, country]);
            setOpenToAll(false);
        }
    };

    const handleOpenToAllToggle = () => {
        setOpenToAll(!openToAll);
        if (!openToAll) {
            setSelectedCountries([]);
        }
    };

    const handleClearAll = () => {
        setSelectedCountries([]);
        setOpenToAll(false);
    };

    const handleApply = async () => {
        let result = 'Open to All';
        if (!openToAll && selectedCountries.length > 0) {
            result = selectedCountries.join(', ');
        }

        try {
            await dispatch(updatePartnerPreferences({
                preferredCountry: result
            })).unwrap();
            navigate('/my-shadi/partner-preferences');
        } catch (error) {
            console.error('Failed to update country:', error);
            Swal.fire({ text: 'Failed to update country. Please try again.', confirmButtonColor: '#8C6D39' });
        }
    };

    const handleCancel = () => {
        setSelectedCountries([]);
        setOpenToAll(false);
        setSearchTerm('');
        navigate(-1);
    };

    const removeCountry = (country) => {
        setSelectedCountries(selectedCountries.filter(c => c !== country));
    };

    const toggleRegion = (region) => {
        if (region === 'Open to All') {
            handleOpenToAllToggle();
        } else {
            setExpandedRegion(expandedRegion === region ? null : region);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
            <div className="w-full max-w-4xl bg-theme-surface rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-4 sm:p-6 md:p-8">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 text-white hover:text-gray-100 transition-all mb-3 sm:mb-4 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium text-sm sm:text-base">Back</span>
                    </button>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Country</h1>
                    <p className="text-blue-100 text-xs sm:text-sm md:text-base mt-2">
                        Select countries you're interested in or choose "Open to All"
                    </p>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 md:p-10">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Country..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-theme-border rounded-xl focus:border-blue-400 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    {/* Selected Countries Display */}
                    {selectedCountries.length > 0 && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-semibold text-gray-700">Countries Selected</p>
                                <button
                                    onClick={handleClearAll}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                >
                                    Clear all
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedCountries.map((country) => (
                                    <div
                                        key={country}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-medium shadow-md"
                                    >
                                        {country}
                                        <button
                                            onClick={() => removeCountry(country)}
                                            className="w-5 h-5 rounded-full bg-theme-surface/20 hover:bg-theme-surface/30 flex items-center justify-center transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Countries List */}
                    <div className="max-h-96 overflow-y-auto">
                        {searchTerm ? (
                            // Show filtered results when searching
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {filteredCountries.map((country) => (
                                    <label
                                        key={country}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-all group border border-transparent hover:border-blue-200"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedCountries.includes(country)}
                                            onChange={() => handleCountryToggle(country)}
                                            disabled={openToAll}
                                            className="w-5 h-5 rounded border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        />
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                            {country}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            // Show regions when not searching
                            <div className="space-y-2">
                                {Object.entries(countriesByRegion).map(([region, countries]) => (
                                    <div key={region} className="border border-theme-border rounded-xl overflow-hidden">
                                        {/* Region Header */}
                                        <div
                                            onClick={() => toggleRegion(region)}
                                            className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                {region === 'Open to All' ? (
                                                    <input
                                                        type="checkbox"
                                                        checked={openToAll}
                                                        onChange={(e) => e.stopPropagation()}
                                                        className="w-5 h-5 rounded border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 cursor-pointer transition-all"
                                                    />
                                                ) : (
                                                    <input
                                                        type="checkbox"
                                                        checked={countries.some(c => selectedCountries.includes(c))}
                                                        onChange={(e) => e.stopPropagation()}
                                                        className="w-5 h-5 rounded border-2 border-gray-300 opacity-0 pointer-events-none"
                                                    />
                                                )}
                                                <span className="font-semibold text-gray-800">{region}</span>
                                            </div>
                                            {region !== 'Open to All' && (
                                                <svg
                                                    className={`w-5 h-5 text-theme-text-secondary transition-transform ${expandedRegion === region ? 'rotate-180' : ''
                                                        }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            )}
                                        </div>

                                        {/* Region Countries */}
                                        {region !== 'Open to All' && expandedRegion === region && (
                                            <div className="p-4 bg-theme-surface">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                                    {countries.map((country) => (
                                                        <label
                                                            key={country}
                                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-all group border border-transparent hover:border-blue-200"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedCountries.includes(country)}
                                                                onChange={() => handleCountryToggle(country)}
                                                                disabled={openToAll}
                                                                className="w-5 h-5 rounded border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                            />
                                                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                                                {country}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 mt-6 border-t border-theme-border">
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-theme-surface hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg transition-all duration-300 active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:via-cyan-500 hover:to-cyan-500 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span>Submit</span>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
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
                    animation: fadeIn 0.5s ease-out;
                }

                /* Custom Scrollbar */
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
        </div>
    );
};

export default Country;