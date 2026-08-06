import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartnerPreferences, updatePartnerPreferences } from '../../../Slice/ProfileSlice';

const MotherTonguePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { preferences } = useSelector((state) => state.profile);

    const [searchTerm, setSearchTerm] = useState('');
    const [openToAll, setOpenToAll] = useState(true);
    const [selectedLanguages, setSelectedLanguages] = useState([]);

    useEffect(() => {
        if (!preferences) {
            dispatch(fetchPartnerPreferences());
        } else {
            const currentVal = preferences.preferredMotherTongue || 'Open to All';
            setOpenToAll(currentVal === 'Open to All');
            setSelectedLanguages(currentVal === 'Open to All' ? [] : currentVal.split(',').map(v => v.trim()));
        }
    }, [dispatch, preferences]);

    const languages = [
        'Hindi', 'Marathi', 'Punjabi', 'English', 'Bengali', 'Gujarati', 'Urdu',
        'Telugu', 'Kannada', 'Odia', 'Tamil', 'Malayalam', 'Assamese', 'Kashmiri',
        'Konkani', 'Manipuri', 'Nepali', 'Sanskrit', 'Sindhi', 'Bodo', 'Dogri',
        'Maithili', 'Santali', 'Arabic', 'French', 'German', 'Spanish', 'Other'
    ];

    const filteredLanguages = languages.filter(l =>
        l.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Show selected languages as tags
    const SelectedTags = () => (
        selectedLanguages.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
                <p className="text-sm font-semibold text-teal-600 uppercase tracking-wider w-full mb-2">
                    Mother Tongue Selected
                </p>
                {selectedLanguages.map((lang, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full font-medium text-sm shadow-md"
                    >
                        {lang}
                        <button
                            onClick={() => setSelectedLanguages(selectedLanguages.filter(l => l !== lang))}
                            className="hover:bg-theme-surface/20 rounded-full p-1 transition-colors"
                        >
                            ✕
                        </button>
                    </span>
                ))}
                <button
                    onClick={() => setSelectedLanguages([])}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium underline"
                >
                    Clear all
                </button>
            </div>
        )
    );

    const handleLanguageChange = (language) => {
        if (openToAll) return;

        if (selectedLanguages.includes(language)) {
            setSelectedLanguages(selectedLanguages.filter(l => l !== language));
        } else {
            setSelectedLanguages([...selectedLanguages, language]);
        }
    };

    const handleApply = async () => {
        let result = 'Open to All';
        if (!openToAll && selectedLanguages.length > 0) {
            result = selectedLanguages.join(', ');
        }

        try {
            await dispatch(updatePartnerPreferences({
                preferredMotherTongue: result
            })).unwrap();
            navigate('/my-shadi/partner-preferences');
        } catch (error) {
            console.error('Failed to update mother tongue:', error);
            Swal.fire({ text: 'Failed to update mother tongue. Please try again.', confirmButtonColor: '#8C6D39' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-theme-surface rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
                <div className="bg-gradient-to-r  from-rose-500 to-rose-600 p-6 sm:p-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white hover:text-gray-100 transition-colors mb-4 group"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back</span>
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Mother Tongue</h1>
                </div>

                <div className="p-6 sm:p-10">
                    {/* Search Box */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="🔍 Search Mother Tongue"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-base"
                        />
                    </div>

                    {/* Selected Tags */}
                    <SelectedTags />

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        <div className="mb-6 pb-6 border-b-2 border-theme-border">
                            <label className="flex items-center gap-4 p-4 rounded-xl hover:bg-teal-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={openToAll}
                                    onChange={() => {
                                        setOpenToAll(!openToAll);
                                        if (!openToAll) setSelectedLanguages([]);
                                    }}
                                    className="w-6 h-6 rounded-lg border-2 text-teal-600 focus:ring-2 focus:ring-teal-500 cursor-pointer"
                                />
                                <span className="text-base sm:text-lg font-semibold text-gray-700">
                                    Open to All
                                </span>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {filteredLanguages.map((language, index) => (
                                <label
                                    key={index}
                                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${openToAll ? 'opacity-50 bg-gray-50' : 'hover:bg-teal-50 hover:shadow-md'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        disabled={openToAll}
                                        checked={selectedLanguages.includes(language)}
                                        onChange={() => handleLanguageChange(language)}
                                        className="w-6 h-6 rounded-lg border-2 text-teal-600 focus:ring-2 focus:ring-teal-500"
                                    />
                                    <span className={`text-sm sm:text-base font-medium ${selectedLanguages.includes(language) ? 'text-teal-600 font-semibold' : 'text-gray-700'
                                        }`}>
                                        {language}
                                    </span>
                                </label>
                            ))}
                        </div>
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
                            className="flex-1 px-6 py-4 bg-gradient-to-r  from-rose-500 to-rose-600 hover:from-rose-500 hover:via-rose-500 hover:to-rose-500 text-white rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
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

export default MotherTonguePage




