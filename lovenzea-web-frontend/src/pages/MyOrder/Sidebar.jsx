import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const [profileId, setProfileId] = useState('');

    const handleProfileSearch = (e) => {
        e.preventDefault();
        if (profileId.trim()) {
            Swal.fire({ text: `Searching for Profile ID: ${profileId}`, confirmButtonColor: '#8C6D39' });
            // You can implement actual search logic here
        }
    };

    return (
        <div className="space-y-6">
            {/* Quick Links */}
            <div className="bg-theme-surface rounded-2xl shadow-xl overflow-hidden border border-rose-100">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-4">
                    <h2 className="text-xl font-bold text-white font-serif">Quick Links</h2>
                </div>

                <nav className="p-4">
                    <ul className="space-y-1">
                        <li>
                            <button
                                onClick={() => navigate('/matches')}
                                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-rose-50 rounded-lg transition-all duration-200 hover:pl-6 font-medium"
                            >
                                - Shortlists & more
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => navigate('/matches')}
                                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-rose-50 rounded-lg transition-all duration-200 hover:pl-6 font-medium"
                            >
                                - New Matches
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => navigate('/matches')}
                                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-rose-50 rounded-lg transition-all duration-200 hover:pl-6 font-medium"
                            >
                                - My Matches
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => navigate('/matches')}
                                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-rose-50 rounded-lg transition-all duration-200 hover:pl-6 font-medium"
                            >
                                - Near Me
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => navigate('/search')}
                                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-rose-50 rounded-lg transition-all duration-200 hover:pl-6 font-medium"
                            >
                                - Add Saved Searches
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => navigate('/my-tickets')}
                                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-rose-50 rounded-lg transition-all duration-200 hover:pl-6 font-medium"
                            >
                                - My Help
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => navigate('/my-tickets')}
                                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-rose-50 rounded-lg transition-all duration-200 hover:pl-6 font-medium"
                            >
                                - My Support Tickets
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Profile ID Search */}
            <div className="bg-theme-surface rounded-2xl shadow-xl p-5 border border-rose-100 ">
                <h3 className="text-lg font-bold text-gray-800 mb-3 font-serif">Profile ID Search</h3>
                <form onSubmit={handleProfileSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={profileId}
                        onChange={(e) => setProfileId(e.target.value)}
                        placeholder="Enter Profile ID"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-2 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                        Go
                    </button>
                </form>
            </div>

            {/* Useful Links */}
            <div className="bg-theme-surface rounded-2xl shadow-xl overflow-hidden border border-rose-100">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-4">
                    <h2 className="text-xl font-bold text-white font-serif">Useful Links</h2>
                </div>

                <div className="p-4 space-y-2">
                    <button
                        onClick={() => navigate('/my-shadi/refer')}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rose-50 rounded-lg transition-all duration-200 group"
                    >
                        <span className="text-2xl">🎁</span>
                        <span className="text-cyan-600 group-hover:text-cyan-800 font-semibold">Refer A Friend</span>
                    </button>

                    <button
                        onClick={() => navigate('/my-tickets')}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rose-50 rounded-lg transition-all duration-200 group"
                    >
                        <span className="text-2xl">❓</span>
                        <span className="text-cyan-600 group-hover:text-cyan-800 font-semibold">Need Help?</span>
                    </button>

                    <button
                        onClick={() => navigate('/my-shadi/security')}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rose-50 rounded-lg transition-all duration-200 group"
                    >
                        <span className="text-2xl">🔒</span>
                        <span className="text-cyan-600 group-hover:text-cyan-800 font-semibold">Security Tips</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;