import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartnerPreferences, updatePartnerPreferences } from '../../../Slice/ProfileSlice';

const AnnualIncomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { preferences } = useSelector((state) => state.profile);

    const [option, setOption] = useState('openToAll');
    const [min, setMin] = useState('');
    const [max, setMax] = useState('');

    useEffect(() => {
        if (!preferences) {
            dispatch(fetchPartnerPreferences());
        } else {
            const currentVal = preferences.minAnnualIncome || 'Open to All';
            if (currentVal === 'Open to All') {
                setOption('openToAll');
            } else {
                setOption('specify');
                // Attempt to parse min/max if needed, but for now just setting the specified state
                // Typically we'd need regex to parse "₹10 - ₹20 Lakhs"
                const match = currentVal.match(/₹(\d+)\s*-\s*₹(\d+)\s*Lakhs/);
                if (match) {
                    setMin(match[1]);
                    setMax(match[2]);
                } else {
                    const aboveMatch = currentVal.match(/Above ₹(\d+)/);
                    if (aboveMatch) setMin(aboveMatch[1]);
                    const belowMatch = currentVal.match(/Below ₹(\d+)/);
                    if (belowMatch) setMax(belowMatch[1]);
                }
            }
        }
    }, [dispatch, preferences]);


    // const handleOptionChange = (option) => {
    //     setSelectedOption(option);
    // };

    // const handleApply = () => {
    //     if (selectedOption === 'openToAll') {
    //         onSelect('Open to All');
    //     } else {
    //         if (minIncome && maxIncome) {
    //             onSelect(`₹${minIncome} - ₹${maxIncome} Lakhs`);
    //         } else if (minIncome) {
    //             onSelect(`Above ₹${minIncome} Lakhs`);
    //         } else if (maxIncome) {
    //             onSelect(`Below ₹${maxIncome} Lakhs`);
    //         } else {
    //             onSelect('Open to All');
    //         }
    //     }
    // };

    const handleApply = async () => {
        let result = 'Open to All';
        if (option === 'specify') {
            if (min && max) {
                result = `₹${min} - ₹${max} Lakhs`;
            } else if (min) {
                result = `Above ₹${min} Lakhs`;
            } else if (max) {
                result = `Below ₹${max} Lakhs`;
            }
        }

        try {
            await dispatch(updatePartnerPreferences({
                minAnnualIncome: result
            })).unwrap();
            navigate('/my-shadi/partner-preferences');
        } catch (error) {
            console.error('Failed to update annual income:', error);
            Swal.fire({ text: 'Failed to update annual income. Please try again.', confirmButtonColor: '#8C6D39' });
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
            <div className="w-full max-w-3xl bg-theme-surface rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
                <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-4 sm:p-6 md:p-8">
                    <button onClick={handleCancel} className="flex items-center gap-2 text-white hover:text-gray-100 transition-all mb-3 sm:mb-4 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium text-sm sm:text-base">Back</span>
                    </button>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Annual Income</h1>
                    <p className="text-blue-100 text-xs sm:text-sm md:text-base mt-2">Specify your preferred income range</p>
                </div>
                <div className="p-4 sm:p-6 md:p-10 space-y-6">
                    <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-xl hover:bg-blue-50 transition-colors border-2 border-transparent hover:border-blue-200">
                        <input type="radio" checked={option === 'openToAll'} onChange={() => setOption('openToAll')} className="w-6 h-6 mt-1 cursor-pointer" />
                        <div>
                            <span className="text-base sm:text-lg font-bold text-gray-700 group-hover:text-gray-900 block">Open to All</span>
                            <p className="text-sm text-theme-text-secondary mt-1">No income preference</p>
                        </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-xl hover:bg-blue-50 transition-colors border-2 border-transparent hover:border-blue-200">
                        <input type="radio" checked={option === 'specify'} onChange={() => setOption('specify')} className="w-6 h-6 mt-1 cursor-pointer" />
                        <div className="flex-1">
                            <span className="text-base sm:text-lg font-bold text-gray-700 group-hover:text-gray-900 block mb-4">Specify an income range</span>
                            {option === 'specify' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Annual Income</label>
                                        <input type="number" placeholder="Enter amount in Lakhs" value={min} onChange={(e) => setMin(e.target.value)} className="w-full px-4 py-3 border-2 border-theme-border rounded-xl focus:border-blue-400 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Annual Income</label>
                                        <input type="number" placeholder="Enter amount in Lakhs" value={max} onChange={(e) => setMax(e.target.value)} className="w-full px-4 py-3 border-2 border-theme-border rounded-xl focus:border-blue-400 focus:outline-none" />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button type="button" onClick={() => { setMin('5'); setMax('10'); }} className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-sm font-medium">5-10 Lakhs</button>
                                        <button type="button" onClick={() => { setMin('10'); setMax('20'); }} className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-sm font-medium">10-20 Lakhs</button>
                                        <button type="button" onClick={() => { setMin('20'); setMax('50'); }} className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-sm font-medium">20-50 Lakhs</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </label>
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-theme-border">
                        <button onClick={handleCancel} className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-theme-surface hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg transition-all duration-300 active:scale-95">Cancel</button>
                        <button onClick={handleApply} className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2">
                            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Apply</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnualIncomePage;