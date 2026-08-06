import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ArrowLeft, Search, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartnerPreferences, updatePartnerPreferences } from '../../../Slice/ProfileSlice';

const StateLivingPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { preferences } = useSelector((state) => state.profile);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStates, setSelectedStates] = useState([]);
    const [openToAll, setOpenToAll] = useState(true);

    useEffect(() => {
        if (!preferences) {
            dispatch(fetchPartnerPreferences());
        } else {
            const currentVal = preferences.preferredState || 'Open to All';
            setOpenToAll(currentVal === 'Open to All');
            setSelectedStates(currentVal === 'Open to All' ? [] : currentVal.split(',').map(v => v.trim()));
        }
    }, [dispatch, preferences]);

    const indianStates = [
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
    ];

    const filteredStates = indianStates.filter(state =>
        state.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStateToggle = (state) => {
        if (selectedStates.includes(state)) {
            setSelectedStates(selectedStates.filter(s => s !== state));
        } else {
            setSelectedStates([...selectedStates, state]);
            setOpenToAll(false);
        }
    };

    const handleOpenToAllToggle = () => {
        setOpenToAll(!openToAll);
        if (!openToAll) {
            setSelectedStates([]);
        }
    };

    // const handleCancel = () => {
    //     console.log('Cancelled - resetting to default');
    //     setAgeRange([22, 26]);

    // };

    const handleClearAll = () => {
        setSelectedStates([]);
        setOpenToAll(false);
    };

    const handleApply = async () => {
        let result = 'Open to All';
        if (!openToAll && selectedStates.length > 0) {
            result = selectedStates.join(', ');
        }

        try {
            await dispatch(updatePartnerPreferences({
                preferredState: result
            })).unwrap();
            navigate('/my-shadi/partner-preferences');
        } catch (error) {
            console.error('Failed to update state:', error);
            Swal.fire({ text: 'Failed to update state. Please try again.', confirmButtonColor: '#8C6D39' });
        }
    };

    const handleCancel = () => {
        setSelectedStates([]);
        setOpenToAll(false);
        setSearchTerm('');
        navigate(-1);

    };

    const removeState = (state) => {
        setSelectedStates(selectedStates.filter(s => s !== state));
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
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">State Living In</h1>
                    <p className="text-blue-100 text-xs sm:text-sm md:text-base mt-2">
                        Select states you're interested in or choose "Open to All"
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
                                placeholder="Search State living in"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-theme-border rounded-xl focus:border-blue-400 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    {/* Selected States Display */}
                    {selectedStates.length > 0 && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-semibold text-gray-700">States Selected</p>
                                <button
                                    onClick={handleClearAll}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                >
                                    Clear all
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedStates.map((state) => (
                                    <div
                                        key={state}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-medium shadow-md"
                                    >
                                        {state}
                                        <button
                                            onClick={() => removeState(state)}
                                            className="w-5 h-5 rounded-full bg-theme-surface/20 hover:bg-theme-surface/30 flex items-center justify-center transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Open to All Checkbox */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={openToAll}
                                    onChange={handleOpenToAllToggle}
                                    className="w-5 h-5 rounded border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 cursor-pointer transition-all"
                                />
                            </div>
                            <span className="text-base font-bold text-gray-800 group-hover:text-gray-900">
                                Open to All States
                            </span>
                        </label>
                    </div>

                    {/* States List */}
                    <div className="max-h-96 overflow-y-auto">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 sticky top-0 bg-theme-surface py-2">India</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {filteredStates.map((state) => (
                                <label
                                    key={state}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-all group border border-transparent hover:border-blue-200"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedStates.includes(state)}
                                        onChange={() => handleStateToggle(state)}
                                        disabled={openToAll}
                                        className="w-5 h-5 rounded border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    />
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                        {state}
                                    </span>
                                </label>
                            ))}
                        </div>
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
                            className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-500 hover:via-rose-500 hover:to-rose-500 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Apply</span>
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

export default StateLivingPage;