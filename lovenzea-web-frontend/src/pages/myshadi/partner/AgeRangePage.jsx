import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartnerPreferences, updatePartnerPreferences } from '../../../Slice/ProfileSlice';

const AgeRangePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { preferences } = useSelector((state) => state.profile);

    const MIN_AGE = 18;
    const MAX_AGE = 37;

    const [ageRange, setAgeRange] = useState([22, 26]);

    useEffect(() => {
        if (!preferences) {
            dispatch(fetchPartnerPreferences());
        } else {
            setAgeRange([preferences.minAge || 22, preferences.maxAge || 26]);
        }
    }, [dispatch, preferences]);

    const handleMinChange = (e) => {
        const value = parseInt(e.target.value);
        if (value < ageRange[1] - 2) {
            setAgeRange([value, ageRange[1]]);
        }
    };

    const handleMaxChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > ageRange[0] + 2) {
            setAgeRange([ageRange[0], value]);
        }
    };

    const handleApply = async () => {
        try {
            await dispatch(updatePartnerPreferences({
                minAge: ageRange[0],
                maxAge: ageRange[1]
            })).unwrap();
            navigate('/my-shadi/partner-preferences');
        } catch (error) {
            console.error('Failed to update age range:', error);
            Swal.fire({ text: 'Failed to update age range. Please try again.', confirmButtonColor: '#8C6D39' });
        }
    };

    const handleCancel = () => {
        console.log('Cancelled - resetting to default');
        setAgeRange([22, 26]);
        navigate(-1);

    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
            <div className="w-full max-w-2xl bg-theme-surface rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-4 sm:p-6 md:p-8">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 text-white hover:text-gray-100 transition-all mb-3 sm:mb-4 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium text-sm sm:text-base" >Back</span>
                    </button>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Age Range</h1>
                    <p className="text-blue-100 text-xs sm:text-sm md:text-base mt-2">
                        Select a minimum age range of 3 years to get relevant matches
                    </p>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 md:p-10">
                    {/* Selected Range Display */}
                    <div className="text-center mb-8 sm:mb-12">
                        <p className="text-xs sm:text-sm font-semibold text-theme-text-secondary uppercase tracking-wider mb-2">
                            Selected Age Range
                        </p>
                        <p className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {ageRange[0]} to {ageRange[1]} yrs
                        </p>
                    </div>

                    {/* Range Slider Visualization */}
                    <div className="relative mb-12 sm:mb-16">
                        {/* Min Value Bubble */}
                        <div
                            className="absolute -top-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full font-bold shadow-lg text-xs sm:text-sm"
                            style={{
                                left: `${((ageRange[0] - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100}%`,
                                transform: 'translateX(-50%)'
                            }}
                        >
                            {ageRange[0]}
                        </div>

                        {/* Max Value Bubble */}
                        <div
                            className="absolute -top-12 bg-gradient-to-br from-purple-500 to-pink-600 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full font-bold shadow-lg text-xs sm:text-sm"
                            style={{
                                left: `${((ageRange[1] - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100}%`,
                                transform: 'translateX(-50%)'
                            }}
                        >
                            {ageRange[1]}
                        </div>

                        {/* Track Background */}
                        <div className="relative h-1.5 sm:h-2 bg-gray-200 rounded-full">
                            {/* Active Track */}
                            <div
                                className="absolute h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
                                style={{
                                    left: `${((ageRange[0] - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100}%`,
                                    right: `${100 - ((ageRange[1] - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100}%`
                                }}
                            />
                        </div>

                        {/* Min Slider */}
                        <input
                            type="range"
                            min={MIN_AGE}
                            max={MAX_AGE}
                            value={ageRange[0]}
                            onChange={handleMinChange}
                            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 sm:[&::-webkit-slider-thumb]:w-6 sm:[&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-theme-surface [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 sm:[&::-moz-range-thumb]:w-6 sm:[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-theme-surface [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg hover:[&::-moz-range-thumb]:scale-110 [&::-moz-range-thumb]:transition-transform"
                            style={{ top: '-4px', zIndex: 3 }}
                        />

                        {/* Max Slider */}
                        <input
                            type="range"
                            min={MIN_AGE}
                            max={MAX_AGE}
                            value={ageRange[1]}
                            onChange={handleMaxChange}
                            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 sm:[&::-webkit-slider-thumb]:w-6 sm:[&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-theme-surface [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 sm:[&::-moz-range-thumb]:w-6 sm:[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-theme-surface [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-purple-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg hover:[&::-moz-range-thumb]:scale-110 [&::-moz-range-thumb]:transition-transform"
                            style={{ top: '-4px', zIndex: 4 }}
                        />

                        {/* Min/Max Labels */}
                        <div className="flex justify-between mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-theme-text-secondary px-1">
                            <span>{MIN_AGE} yrs</span>
                            <span>{MAX_AGE} yrs</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
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

                input[type="range"]:focus {
                    outline: none;
                }

                input[type="range"]::-webkit-slider-runnable-track {
                    background: transparent;
                }

                input[type="range"]::-moz-range-track {
                    background: transparent;
                }
            `}</style>
        </div>
    );
};

export default AgeRangePage;