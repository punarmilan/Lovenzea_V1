import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartnerPreferences, updatePartnerPreferences } from '../../../Slice/ProfileSlice';

const MaritalStatusPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { preferences } = useSelector((state) => state.profile);

    const maritalOptions = [
        { id: 1, label: 'Never Married', value: 'Never Married' },
        { id: 2, label: 'Divorced', value: 'Divorced' },
        { id: 3, label: 'Widowed', value: 'Widowed' },
        { id: 4, label: 'Awaiting Divorce', value: 'Awaiting Divorce' },
        { id: 5, label: 'Annulled', value: 'Annulled' }
    ];

    // Parse current selections
    const parseCurrentSelections = (value) => {
        if (!value || value === 'Open to All') return [];
        return value.split(',').map(v => v.trim());
    };

    const [openToAll, setOpenToAll] = useState(true);
    const [selectedStatuses, setSelectedStatuses] = useState([]);

    useEffect(() => {
        if (!preferences) {
            dispatch(fetchPartnerPreferences());
        } else {
            const currentVal = preferences.maritalStatus || 'Open to All';
            setOpenToAll(currentVal === 'Open to All');
            setSelectedStatuses(currentVal === 'Open to All' ? [] : parseCurrentSelections(currentVal));
        }
    }, [dispatch, preferences]);

    const handleOpenToAllChange = () => {
        setOpenToAll(!openToAll);
        if (!openToAll) {
            setSelectedStatuses([]);
        }
    };

    const handleStatusChange = (status) => {
        if (openToAll) return;

        if (selectedStatuses.includes(status)) {
            setSelectedStatuses(selectedStatuses.filter(s => s !== status));
        } else {
            setSelectedStatuses([...selectedStatuses, status]);
        }
    };

    const handleApply = async () => {
        let result = 'Open to All';
        if (!openToAll && selectedStatuses.length > 0) {
            result = selectedStatuses.join(', ');
        }

        try {
            await dispatch(updatePartnerPreferences({
                maritalStatus: result
            })).unwrap();
            navigate('/my-shadi/partner-preferences');
        } catch (error) {
            console.error('Failed to update marital status:', error);
            Swal.fire({ text: 'Failed to update marital status. Please try again.', confirmButtonColor: '#8C6D39' });
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-fuchsia-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-theme-surface rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="bg-gradient-to-r from-rose-500 to-rose-600  p-6 sm:p-8">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 text-white hover:text-gray-100 transition-colors mb-4 group"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back</span>
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Marital Status</h1>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-10">
                    {/* Scroll Indicators */}
                    <div className="flex justify-center mb-4">
                        <FaChevronUp className="text-gray-400 animate-bounce" />
                    </div>

                    {/* Options Container */}
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        {/* Open to All Option */}
                        <div className="mb-6 pb-6 border-b-2 border-theme-border">
                            <label className="flex items-center gap-4 p-4 rounded-xl hover:bg-purple-50 cursor-pointer transition-all duration-300 group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={openToAll}
                                        onChange={handleOpenToAllChange}
                                        className="w-6 h-6 rounded-lg border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer transition-all"
                                    />
                                    {openToAll && (
                                        <FaCheck className="absolute top-1 left-1 text-white text-xs pointer-events-none" />
                                    )}
                                </div>
                                <span className="text-base sm:text-lg font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">
                                    Open to All
                                </span>
                            </label>
                        </div>

                        {/* All Preferences Header */}
                        <h3 className="text-sm font-bold text-theme-text-secondary uppercase tracking-wider mb-4">
                            All Preferences
                        </h3>

                        {/* Status Options */}
                        <div className="space-y-3">
                            {maritalOptions.map((option) => (
                                <label
                                    key={option.id}
                                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${openToAll
                                        ? 'opacity-50 cursor-not-allowed bg-gray-50'
                                        : 'hover:bg-purple-50 hover:shadow-md group'
                                        }`}
                                >
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            disabled={openToAll}
                                            checked={selectedStatuses.includes(option.value)}
                                            onChange={() => handleStatusChange(option.value)}
                                            className={`w-6 h-6 rounded-lg border-2 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all ${openToAll
                                                ? 'cursor-not-allowed border-gray-300'
                                                : 'cursor-pointer border-gray-300'
                                                }`}
                                        />
                                        {selectedStatuses.includes(option.value) && !openToAll && (
                                            <div className="absolute inset-0 bg-purple-600 rounded-lg flex items-center justify-center">
                                                <FaCheck className="text-white text-xs" />
                                            </div>
                                        )}
                                    </div>
                                    <span
                                        className={`text-base sm:text-lg font-medium transition-colors ${openToAll
                                            ? 'text-gray-400'
                                            : selectedStatuses.includes(option.value)
                                                ? 'text-purple-600 font-semibold'
                                                : 'text-gray-700 group-hover:text-purple-600'
                                            }`}
                                    >
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Scroll Indicators */}
                    <div className="flex justify-center mt-4">
                        <FaChevronDown className="text-gray-400 animate-bounce" />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 mt-6 border-t-2 border-theme-border">
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-6 py-4 bg-theme-surface hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 rounded-2xl font-bold text-lg transition-all duration-300 active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            className="flex-1 px-6 py-4 bg-gradient-to-r  from-rose-500 to-rose-600 hover:from-rose-500 hover:via-rose-500 hover:to-rose-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <FaCheck />
                            <span>Apply</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaritalStatusPage;