import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartnerPreferences, updatePartnerPreferences } from '../../../Slice/ProfileSlice';

const HeightRangePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { preferences } = useSelector((state) => state.profile);

    // Helper to parse individual height string
    const parseSingleHeight = (heightStr) => {
        if (!heightStr) return null;
        const match = heightStr.match(/(\d+)'\s*(\d+)"/);
        if (match) {
            return parseInt(match[1]) * 12 + parseInt(match[2]);
        }
        return null;
    };

    // Height options (in inches for calculation)
    const heights = [];
    for (let ft = 4; ft <= 7; ft++) {
        for (let inch = 0; inch < 12; inch++) {
            if (ft === 4 && inch < 5) continue; // Start from 4'5"
            if (ft === 7 && inch > 0) break; // End at 7'0"
            const totalInches = ft * 12 + inch;
            const cm = Math.round(totalInches * 2.54);
            heights.push({
                value: totalInches,
                display: `${ft}' ${inch}"`,
                label: `${ft}' ${inch}" (${cm}cm)`
            });
        }
    }

    const [heightRange, setHeightRange] = useState([60, 68]);

    useEffect(() => {
        if (!preferences) {
            dispatch(fetchPartnerPreferences());
        } else {
            const min = parseSingleHeight(preferences.minHeight) || 60;
            const max = parseSingleHeight(preferences.maxHeight) || 68;
            setHeightRange([min, max]);
        }
    }, [dispatch, preferences]);

    const MIN_HEIGHT = heights[0].value;
    const MAX_HEIGHT = heights[heights.length - 1].value;

    const handleMinChange = (e) => {
        const value = parseInt(e.target.value);
        if (value < heightRange[1]) {
            setHeightRange([value, heightRange[1]]);
        }
    };

    const handleMaxChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > heightRange[0]) {
            setHeightRange([heightRange[0], value]);
        }
    };

    const getHeightDisplay = (inches) => {
        const ft = Math.floor(inches / 12);
        const inch = inches % 12;
        return `${ft}' ${inch}"`;
    };

    const getHeightLabel = (inches) => {
        const ft = Math.floor(inches / 12);
        const inch = inches % 12;
        const cm = Math.round(inches * 2.54);
        return `${ft}' ${inch}" (${cm}cm)`;
    };

    const handleApply = async () => {
        try {
            await dispatch(updatePartnerPreferences({
                minHeight: getHeightDisplay(heightRange[0]),
                maxHeight: getHeightDisplay(heightRange[1])
            })).unwrap();
            navigate('/my-shadi/partner-preferences');
        } catch (error) {
            console.error('Failed to update height range:', error);
            Swal.fire({ text: 'Failed to update height range. Please try again.', confirmButtonColor: '#8C6D39' });
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Height Range</h1>
                    <p className="text-blue-100 text-sm sm:text-base mt-2">
                        Select a minimum height range of 6 inches to get relevant matches
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-10">
                    {/* Selected Range Display */}
                    <div className="text-center mb-12">
                        <p className="text-sm font-semibold text-theme-text-secondary uppercase tracking-wider mb-2">
                            Selected Height Range (ft/inch)
                        </p>
                        <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {getHeightLabel(heightRange[0])} to {getHeightLabel(heightRange[1])}
                        </p>
                    </div>

                    {/* Range Slider Visualization */}
                    <div className="relative mb-16">
                        {/* Min Value Bubble */}
                        <div
                            className="absolute -top-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white px-3 py-2 rounded-full font-bold shadow-lg text-sm"
                            style={{
                                left: `${((heightRange[0] - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT)) * 100}%`,
                                transform: 'translateX(-50%)'
                            }}
                        >
                            {getHeightDisplay(heightRange[0])}
                        </div>

                        {/* Max Value Bubble */}
                        <div
                            className="absolute -top-12 bg-gradient-to-br from-purple-500 to-pink-600 text-white px-3 py-2 rounded-full font-bold shadow-lg text-sm"
                            style={{
                                left: `${((heightRange[1] - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT)) * 100}%`,
                                transform: 'translateX(-50%)'
                            }}
                        >
                            {getHeightDisplay(heightRange[1])}
                        </div>

                        {/* Track Background */}
                        <div className="relative h-2 bg-gray-200 rounded-full">
                            {/* Active Track */}
                            <div
                                className="absolute h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
                                style={{
                                    left: `${((heightRange[0] - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT)) * 100}%`,
                                    right: `${100 - ((heightRange[1] - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT)) * 100}%`
                                }}
                            />
                        </div>

                        {/* Min Slider */}
                        <input
                            type="range"
                            min={MIN_HEIGHT}
                            max={MAX_HEIGHT}
                            value={heightRange[0]}
                            onChange={handleMinChange}
                            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-theme-surface [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                            style={{ top: '-4px' }}
                        />

                        {/* Max Slider */}
                        <input
                            type="range"
                            min={MIN_HEIGHT}
                            max={MAX_HEIGHT}
                            value={heightRange[1]}
                            onChange={handleMaxChange}
                            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-theme-surface [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                            style={{ top: '-4px' }}
                        />

                        {/* Min/Max Labels */}
                        <div className="flex justify-between mt-4 text-sm font-medium text-theme-text-secondary">
                            <span>{getHeightDisplay(MIN_HEIGHT)}</span>
                            <span>{getHeightDisplay(MAX_HEIGHT)}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6">
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-6 py-4 bg-theme-surface hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 rounded-2xl font-bold text-lg transition-all duration-300 active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            className="flex-1 px-6 py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-500 hover:via-rose-500 hover:to-rose-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
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

export default HeightRangePage;