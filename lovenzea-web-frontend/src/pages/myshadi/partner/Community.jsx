import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartnerPreferences, updatePartnerPreferences } from '../../../Slice/ProfileSlice';

const Community = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { preferences } = useSelector((state) => state.profile);

    const [searchTerm, setSearchTerm] = useState('');
    const [openToAll, setOpenToAll] = useState(true);
    const [selectedCommunities, setSelectedCommunities] = useState([]);

    useEffect(() => {
        if (!preferences) {
            dispatch(fetchPartnerPreferences());
        } else {
            const currentVal = preferences.preferredCaste || 'Open to All';
            setOpenToAll(currentVal === 'Open to All');
            setSelectedCommunities(currentVal === 'Open to All' ? [] : currentVal.split(',').map(v => v.trim()));
        }
    }, [dispatch, preferences]);

    const communities = [
        'Maratha', 'Brahmin', 'Kunbi', 'Agri', 'Banjara', 'Chambhar', 'Dhangar', 'Gond', 'Koli',
        'Mahar', 'Mali', 'Matang', 'Nomadic Tribes', 'Paradhi', 'Vanjari', 'Other'
    ];

    const filteredCommunities = communities.filter(c =>
        c.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCommunityChange = (community) => {
        if (openToAll) return;

        if (selectedCommunities.includes(community)) {
            setSelectedCommunities(selectedCommunities.filter(c => c !== community));
        } else {
            setSelectedCommunities([...selectedCommunities, community]);
        }
    };

    const handleApply = async () => {
        let result = 'Open to All';
        if (!openToAll && selectedCommunities.length > 0) {
            result = selectedCommunities.join(', ');
        }

        try {
            await dispatch(updatePartnerPreferences({
                preferredCaste: result
            })).unwrap();
            navigate('/my-shadi/partner-preferences');
        } catch (error) {
            console.error('Failed to update community:', error);
            Swal.fire({ text: 'Failed to update community. Please try again.', confirmButtonColor: '#8C6D39' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-theme-surface rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
                <div className="bg-gradient-to-r  from-rose-500 to-rose-600  p-6 sm:p-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white hover:text-gray-100 transition-colors mb-4 group"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back</span>
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Community</h1>
                </div>

                <div className="p-6 sm:p-10">
                    {/* Search Box */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search Community"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-base"
                        />
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        <div className="mb-6 pb-6 border-b-2 border-theme-border">
                            <label className="flex items-center gap-4 p-4 rounded-xl hover:bg-rose-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={openToAll}
                                    onChange={() => {
                                        setOpenToAll(!openToAll);
                                        if (!openToAll) setSelectedCommunities([]);
                                    }}
                                    className="w-6 h-6 rounded-lg border-2 text-rose-600 focus:ring-2 focus:ring-rose-500 cursor-pointer"
                                />
                                <span className="text-base sm:text-lg font-semibold text-gray-700">
                                    Open to All
                                </span>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {filteredCommunities.map((community, index) => (
                                <label
                                    key={index}
                                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${openToAll ? 'opacity-50 bg-gray-50' : 'hover:bg-rose-50 hover:shadow-md'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        disabled={openToAll}
                                        checked={selectedCommunities.includes(community)}
                                        onChange={() => handleCommunityChange(community)}
                                        className="w-6 h-6 rounded-lg border-2 text-rose-600 focus:ring-2 focus:ring-rose-500"
                                    />
                                    <span className={`text-sm sm:text-base font-medium ${selectedCommunities.includes(community) ? 'text-rose-600 font-semibold' : 'text-gray-700'
                                        }`}>
                                        {community}
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
                            className="flex-1 px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
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

export default Community
