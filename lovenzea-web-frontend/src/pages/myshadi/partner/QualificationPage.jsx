import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartnerPreferences, updatePartnerPreferences } from '../../../Slice/ProfileSlice';

const QualificationPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { preferences } = useSelector((state) => state.profile);

    const [selected, setSelected] = useState('Open to All');

    useEffect(() => {
        if (!preferences) {
            dispatch(fetchPartnerPreferences());
        } else {
            const currentVal = preferences.minEducationLevel || 'Open to All';
            setSelected(currentVal);
        }
    }, [dispatch, preferences]);

    const qualifications = [
        'Doctorate',
        'Masters',
        'Bachelor / Undergraduate',
        'Associate / Diploma',
        'High School and below'
    ];

    const handleApply = async () => {
        let result = selected || 'Open to All';

        try {
            await dispatch(updatePartnerPreferences({
                minEducationLevel: result
            })).unwrap();
            navigate('/my-shadi/partner-preferences');
        } catch (error) {
            console.error('Failed to update qualification:', error);
            Swal.fire({ text: 'Failed to update qualification. Please try again.', confirmButtonColor: '#8C6D39' });
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
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Qualification</h1>
                    <p className="text-blue-100 text-xs sm:text-sm md:text-base mt-2">Select your preferred qualification level</p>
                </div>
                <div className="p-4 sm:p-6 md:p-10">
                    <div className="mb-6">
                        <label className="flex items-center gap-3 cursor-pointer group p-4 rounded-xl hover:bg-blue-50 transition-colors border-2 border-transparent hover:border-blue-200">
                            <input type="radio" checked={selected === 'Open to All'} onChange={() => setSelected('Open to All')} className="w-6 h-6 cursor-pointer" />
                            <span className="text-base sm:text-lg font-bold text-gray-700 group-hover:text-gray-900">Open to All</span>
                        </label>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4">All qualifications</h3>
                    <div className="space-y-3">
                        {qualifications.map(q => (
                            <label key={q} className="flex items-center gap-3 cursor-pointer group p-4 rounded-xl hover:bg-blue-50 transition-colors border-2 border-transparent hover:border-blue-200">
                                <input type="radio" checked={selected === q} onChange={() => setSelected(q)} className="w-6 h-6 cursor-pointer" />
                                <span className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-gray-900">{q}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 mt-6 border-t border-theme-border">
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

export default QualificationPage;