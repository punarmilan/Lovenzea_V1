import React, { useState } from 'react';
import { Search, Eye, Edit2, Trash2, X, User as UserIcon, BookOpen, Users, Star, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

// --- DUMMY DATA ---
const dummyMobileUsers = [
    {
        id: 101,
        name: "Rahul Sharma",
        email: "rahul.s@example.com",
        mobileNumber: "9876543210",
        status: "ACTIVE",
        createdAt: "2024-05-12T10:30:00",
        details: {
            personal: { age: 28, height: "5'10\"", religion: "Hindu", caste: "Brahmin", maritalStatus: "Never Married", diet: "Vegetarian", smoke: "No", drink: "No" },
            education: { level: "Masters", occupation: "Software Engineer", income: "₹15,00,000", company: "Tech Solutions", location: "Bangalore" },
            family: { fatherStatus: "Retired", motherStatus: "Homemaker", brothers: 1, sisters: 0, familyType: "Nuclear", familyValues: "Moderate" },
            astro: { manglik: "No", gotra: "Bharadwaj", timeOfBirth: "14:30", placeOfBirth: "Delhi" },
            preferences: { ageRange: "24-28", heightRange: "5'2\" - 5'7\"", religion: "Hindu", education: "Bachelors or higher", occupation: "Professional" }
        }
    },
    {
        id: 102,
        name: "Priya Patel",
        email: "priya.p@example.com",
        mobileNumber: "9123456789",
        status: "INACTIVE",
        createdAt: "2024-05-14T14:15:00",
        details: {
            personal: { age: 26, height: "5'4\"", religion: "Hindu", caste: "Patel", maritalStatus: "Never Married", diet: "Vegetarian", smoke: "No", drink: "Occasionally" },
            education: { level: "Bachelors", occupation: "Marketing Manager", income: "₹9,00,000", company: "Creative Agency", location: "Mumbai" },
            family: { fatherStatus: "Business", motherStatus: "Homemaker", brothers: 0, sisters: 1, familyType: "Joint", familyValues: "Traditional" },
            astro: { manglik: "Yes", gotra: "Kashyap", timeOfBirth: "08:15", placeOfBirth: "Ahmedabad" },
            preferences: { ageRange: "27-31", heightRange: "5'8\" - 6'0\"", religion: "Hindu", education: "Masters", occupation: "Business/Professional" }
        }
    }
];

import { useNavigate } from 'react-router-dom';

const MobileUsersManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const filteredUsers = dummyMobileUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.mobileNumber.includes(searchTerm)
    );

    const handleViewDetails = (id) => {
        navigate(`/admin/mobile-users/${id}`);
    };

    const handleDeleteUser = (id) => {
        toast.success(`User ${id} deleted (Simulation)`);
    };



    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-theme-surface p-6 sm:p-8 rounded-[32px] shadow-sm border border-gray-100 gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Mobile Users Data</h2>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Manage detailed profiles from mobile app</p>
                </div>
            </div>

            <div className="bg-theme-surface rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="p-4 sm:px-6 font-black text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100">User</th>
                                <th className="p-4 sm:px-6 font-black text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100">Contact</th>
                                <th className="p-4 sm:px-6 font-black text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100">Registration Date</th>
                                <th className="p-4 sm:px-6 font-black text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100">Status</th>
                                <th className="p-4 sm:px-6 font-black text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="p-4 sm:px-6">
                                        <div>
                                            <p className="font-bold text-gray-900">{user.name}</p>
                                            <p className="text-xs text-theme-text-secondary">ID: {user.id}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 sm:px-6">
                                        <p className="text-sm font-medium text-gray-900">{user.mobileNumber}</p>
                                        <p className="text-xs text-theme-text-secondary">{user.email}</p>
                                    </td>
                                    <td className="p-4 sm:px-6">
                                        <p className="text-sm font-medium text-theme-text-secondary">
                                            {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </td>
                                    <td className="p-4 sm:px-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-theme-text-secondary'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-4 sm:px-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleViewDetails(user.id)} 
                                                className="p-2 border border-blue-50 text-blue-500 rounded-xl hover:bg-blue-50 transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteUser(user.id)} 
                                                className="p-2 border border-rose-50 text-rose-500 rounded-xl hover:bg-rose-50 transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-gray-400 font-bold">No mobile users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MobileUsersManagement;
