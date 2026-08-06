import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ArrowLeft, Search, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartnerPreferences, updatePartnerPreferences } from '../../../Slice/ProfileSlice';

const ProfessionPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { preferences } = useSelector((state) => state.profile);

    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState('Open to All');

    useEffect(() => {
        if (!preferences) {
            dispatch(fetchPartnerPreferences());
        } else {
            const currentVal = preferences.occupation || 'Open to All';
            setSelected(currentVal);
        }
    }, [dispatch, preferences]);

    const professions = [
        { id: 1, name: 'Accounting, Banking & Finance' },
        { id: 2, name: 'Administration & HR' },
        { id: 3, name: 'Advertising, Media & Entertainment' },
        { id: 4, name: 'Agriculture' },
        { id: 5, name: 'Airline & Aviation' },
        { id: 6, name: 'Architecture & Design' },
        { id: 7, name: 'Artists, Animators & Web Designers' },
        { id: 8, name: 'Beauty, Fashion & Jewellery Designers' },
        { id: 9, name: 'BPO, KPO, & Customer Support' },
        { id: 10, name: 'Civil Services / Law Enforcement' },
        { id: 11, name: 'Defense' },
        { id: 12, name: 'Education & Training' },
        { id: 13, name: 'Engineering' },
        { id: 14, name: 'Hotel & Hospitality' },
        { id: 15, name: 'IT & Software Engineering' },
        { id: 16, name: 'Legal' },
        { id: 17, name: 'Medical & Healthcare' },
        { id: 18, name: 'Merchant Navy' },
        { id: 19, name: 'Sales & Marketing' },
        { id: 20, name: 'Science & Research' }
    ];

    // FIX 1: Access p.name before calling toLowerCase()
    const filtered = professions.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleApply = async () => {
        let result = selected || 'Open to All';

        try {
            await dispatch(updatePartnerPreferences({
                occupation: result
            })).unwrap();
            navigate('/my-shadi/partner-preferences');
        } catch (error) {
            console.error('Failed to update profession:', error);
            Swal.fire({ text: 'Failed to update profession. Please try again.', confirmButtonColor: '#8C6D39' });
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
            <div className="w-full max-w-4xl bg-theme-surface rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
                <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-4 sm:p-6 md:p-8">
                    <button onClick={handleCancel} className="flex items-center gap-2 text-white hover:text-gray-100 transition-all mb-3 sm:mb-4 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium text-sm sm:text-base">Back</span>
                    </button>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Profession</h1>
                    <p className="text-blue-100 text-xs sm:text-sm md:text-base mt-2">Select your preferred profession</p>
                </div>

                <div className="p-4 sm:p-6 md:p-10">
                    <div className="mb-6 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search Profession"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-theme-border rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
                        />
                    </div>

                    {selected && selected !== 'Open to All' && (
                        <div className="mb-6">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Profession Selected</p>
                            <div className="inline-flex px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-medium shadow-md">
                                {selected}
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl hover:bg-blue-50 transition-colors border-2 border-transparent hover:border-blue-200">
                            <input
                                type="radio"
                                checked={selected === 'Open to All'}
                                onChange={() => setSelected('Open to All')}
                                className="w-5 h-5 cursor-pointer"
                            />
                            <span className="text-base font-bold text-gray-700 group-hover:text-gray-900">Open to All</span>
                        </label>
                    </div>

                    <div className="max-h-80 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {filtered.map(p => (
                            // FIX 2: Use p.id for key and p.name for the value/label
                            <label key={p.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors border border-transparent hover:border-blue-200">
                                <input
                                    type="radio"
                                    checked={selected === p.name}
                                    onChange={() => setSelected(p.name)}
                                    className="w-5 h-5 mt-0.5 cursor-pointer flex-shrink-0"
                                />
                                <span className="text-sm font-medium text-gray-700">{p.name}</span>
                            </label>
                        ))}
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 mt-6 border-t border-theme-border">
                        <button onClick={handleCancel} className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-theme-surface hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg transition-all duration-300 active:scale-95">
                            Cancel
                        </button>
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

export default ProfessionPage;