import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartnerPreferences, updatePartnerPreferences } from '../../../Slice/ProfileSlice';

const ReligionPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { preferences } = useSelector((state) => state.profile);

    const parseCurrentSelections = (value) => {
        if (!value || value === 'Open to All') return [];
        return value.split(',').map(v => v.trim());
    };

    const [openToAll, setOpenToAll] = useState(true);
    const [selectedReligions, setSelectedReligions] = useState([]);

    useEffect(() => {
        if (!preferences) {
            dispatch(fetchPartnerPreferences());
        } else {
            const currentVal = preferences.preferredReligion || 'Open to All';
            setOpenToAll(currentVal === 'Open to All');
            setSelectedReligions(currentVal === 'Open to All' ? [] : parseCurrentSelections(currentVal));
        }
    }, [dispatch, preferences]);

    const religionOptions = [
        { id: 'hindu', label: 'Hindu', value: 'Hindu' },
        { id: 'sikh', label: 'Sikh', value: 'Sikh' },
        { id: 'christian', label: 'Christian', value: 'Christian' },
        { id: 'muslim', label: 'Muslim', value: 'Muslim' },
        { id: 'parsi', label: 'Parsi', value: 'Parsi' },
        { id: 'jain', label: 'Jain', value: 'Jain' },
        { id: 'buddhist', label: 'Buddhist', value: 'Buddhist' },
        { id: 'jewish', label: 'Jewish', value: 'Jewish' },
        { id: 'no-religion', label: 'No Religion', value: 'No Religion' },
        { id: 'spiritual', label: 'Spiritual - not religious', value: 'Spiritual - not religious' },
        { id: 'other', label: 'Other', value: 'Other' }
    ];


    const handleOpenToAllChange = () => {
        setOpenToAll(!openToAll);
        if (!openToAll) {
            setSelectedReligions([]);
        }
    };

    const handleReligionChange = (religion) => {
        if (openToAll) return;

        if (selectedReligions.includes(religion)) {
            setSelectedReligions(selectedReligions.filter(r => r !== religion));
        } else {
            setSelectedReligions([...selectedReligions, religion]);
        }
    };

    const handleApply = async () => {
        let result = 'Open to All';
        if (!openToAll && selectedReligions.length > 0) {
            result = selectedReligions.join(', ');
        }

        try {
            await dispatch(updatePartnerPreferences({
                preferredReligion: result
            })).unwrap();
            navigate('/my-shadi/partner-preferences');
        } catch (error) {
            console.error('Failed to update religion:', error);
            Swal.fire({ text: 'Failed to update religion. Please try again.', confirmButtonColor: '#8C6D39' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-theme-surface rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
                <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-6 sm:p-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white hover:text-gray-100 transition-colors mb-4 group"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back</span>
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Religion</h1>
                </div>

                <div className="p-6 sm:p-10">
                    <div className="flex justify-center mb-4">
                        <FaChevronUp className="text-gray-400 animate-bounce" />
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        <div className="mb-6 pb-6 border-b-2 border-theme-border">
                            <label className="flex items-center gap-4 p-4 rounded-xl hover:bg-orange-50 cursor-pointer transition-all duration-300 group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={openToAll}
                                        onChange={handleOpenToAllChange}
                                        className="w-6 h-6 rounded-lg border-2 border-gray-300 text-orange-600 focus:ring-2 focus:ring-orange-500 cursor-pointer"
                                    />
                                </div>
                                <span className="text-base sm:text-lg font-semibold text-gray-700 group-hover:text-orange-600">
                                    Open to All
                                </span>
                            </label>
                        </div>

                        <h3 className="text-sm font-bold text-theme-text-secondary uppercase tracking-wider mb-4">
                            All religions
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {religionOptions.map((option) => (
                                <label
                                    key={option.id}
                                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 ${openToAll
                                        ? 'opacity-50 cursor-not-allowed bg-gray-50'
                                        : 'hover:bg-orange-50 hover:shadow-md group'
                                        }`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <input
                                            type="checkbox"
                                            disabled={openToAll}
                                            checked={selectedReligions.includes(option.value)}
                                            onChange={() => handleReligionChange(option.value)}
                                            className={`w-6 h-6 rounded-lg border-2 text-orange-600 focus:ring-2 focus:ring-orange-500 ${openToAll ? 'cursor-not-allowed' : 'cursor-pointer'
                                                }`}
                                        />
                                    </div>
                                    <span
                                        className={`text-sm sm:text-base font-medium ${openToAll
                                            ? 'text-gray-400'
                                            : selectedReligions.includes(option.value)
                                                ? 'text-orange-600 font-semibold'
                                                : 'text-gray-700 group-hover:text-orange-600'
                                            }`}
                                    >
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center mt-4">
                        <FaChevronDown className="text-gray-400 animate-bounce" />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 mt-6 border-t-2 border-theme-border">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex-1 px-6 py-4 bg-theme-surface hover:bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-2xl font-bold text-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            className="flex-1 px-6 py-4 bg-gradient-to-r  from-rose-500 to-rose-600 hover:from-rose-500 hover:via-rose-500 hover:to-rose-500text-white rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
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

export default ReligionPage
