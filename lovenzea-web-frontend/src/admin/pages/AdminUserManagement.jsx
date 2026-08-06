import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import adminUserService from '../services/adminUserService';
import { adminAuthService } from '../services/adminAuthService';
import { useSelector } from 'react-redux';
import { Search, Filter, Trash2, Ban, CheckCircle, XCircle, MoreVertical, Eye, MapPin, UserPlus, ShieldCheck, Users } from 'lucide-react';
import { FaGraduationCap, FaBriefcase, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const AdminUserManagement = () => {
    const { admin } = useSelector((state) => state.adminAuth);
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'staff'
    const [users, setUsers] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
    const [totalUsers, setTotalUsers] = useState(0);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '', role: 'ROLE_ADMIN' });
    const [filters, setFilters] = useState({
        email: '',
        mobileNumber: '',
        gender: '',
        religion: '',
        city: '',
        enabled: '',
    });

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        } else {
            fetchStaff();
        }
    }, [page, size, activeTab]);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const data = await adminAuthService.getAllStaff();
            setStaffList(data || []);
        } catch (error) {
            toast.error('Failed to fetch staff');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                size,
                ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
            };
            const data = await adminUserService.getAllUsers(params);
            setUsers(data.content || []);
            setTotalUsers(data.totalElements || 0);
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const applyFilters = () => {
        setPage(0);
        fetchUsers();
    };

    const resetFilters = () => {
        setFilters({
            email: '',
            mobileNumber: '',
            gender: '',
            religion: '',
            city: '',
            enabled: '',
        });
        setPage(0);
    };

    const handleViewProfile = async (id) => {
        try {
            const data = await adminUserService.getUserById(id);
            setSelectedUser(data); // data is { user, activeSubscription }
            setIsViewModalOpen(true);
        } catch (error) {
            toast.error('Failed to load user details');
        }
    };

    const toggleUserBlock = async (user) => {
        try {
            if (user.enabled) {
                await adminUserService.blockUser(user.id);
                toast.success('User blocked successfully');
            } else {
                await adminUserService.unblockUser(user.id);
                toast.success('User unblocked successfully');
            }
            // Refresh table
            fetchUsers();
            // Refresh modal if open and matches
            if (selectedUser && selectedUser.user?.id === user.id) {
                handleViewProfile(user.id);
            }
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDeleteUser = async (id) => {
        if ((await Swal.fire({ title: 'Are you sure?', text: 'Are you sure you want to delete this user? This action cannot be undone.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#8C6D39', cancelButtonColor: '#d33', confirmButtonText: 'Yes' }).then(r => r.isConfirmed))) {
            try {
                await adminUserService.deleteUser(id);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Delete failed');
            }
        }
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            await adminAuthService.createStaff(newStaff);
            toast.success('Staff created successfully');
            setIsAddStaffModalOpen(false);
            setNewStaff({ name: '', email: '', password: '', role: 'ROLE_ADMIN' });
            fetchStaff();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create staff');
        }
    };

    const handleDeleteStaff = async (id) => {
        if ((await Swal.fire({ title: 'Are you sure?', text: 'Delete this staff member?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#8C6D39', cancelButtonColor: '#d33', confirmButtonText: 'Yes' }).then(r => r.isConfirmed))) {
            try {
                await adminAuthService.deleteStaff(id);
                toast.success('Staff deleted successfully');
                fetchStaff();
            } catch (error) {
                toast.error('Failed to delete staff');
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Tab Switcher */}
            {['ROLE_SUPER_ADMIN', 'ROLE_SUB_ADMIN'].includes(admin?.role) && (
                <div className="flex bg-theme-surface p-1 rounded-2xl shadow-sm border border-gray-100 w-fit mb-6">
                    <button
                        onClick={() => { setActiveTab('users'); setPage(0); }}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-pink-600 text-white shadow-lg shadow-pink-100' : 'text-theme-text-secondary hover:bg-gray-50'}`}
                    >
                        <Users size={16} /> User Management
                    </button>
                    <button
                        onClick={() => { setActiveTab('staff'); setPage(0); }}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'staff' ? 'bg-pink-600 text-white shadow-lg shadow-pink-100' : 'text-theme-text-secondary hover:bg-gray-50'}`}
                    >
                        <ShieldCheck size={16} /> Staff Management
                    </button>
                </div>
            )}

            {activeTab === 'users' ? (
                <>
                    {/* Filters Bar */}
                    <div className="bg-theme-surface p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    name="email"
                                    value={filters.email}
                                    onChange={handleFilterChange}
                                    placeholder="Email"
                                    className="w-full pl-10 pr-4 py-2 border border-theme-border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-sm"
                                />
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    name="mobileNumber"
                                    value={filters.mobileNumber}
                                    onChange={handleFilterChange}
                                    placeholder="Mobile"
                                    className="w-full pl-10 pr-4 py-2 border border-theme-border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-sm"
                                />
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    name="city"
                                    value={filters.city}
                                    onChange={handleFilterChange}
                                    placeholder="City"
                                    className="w-full pl-10 pr-4 py-2 border border-theme-border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-sm"
                                />
                            </div>
                            <select
                                name="gender"
                                value={filters.gender}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border border-theme-border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all appearance-none bg-theme-surface cursor-pointer text-sm"
                            >
                                <option value="">Genders</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            <select
                                name="religion"
                                value={filters.religion}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border border-theme-border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all appearance-none bg-theme-surface cursor-pointer text-sm"
                            >
                                <option value="">Religions</option>
                                {['Hindu', 'Muslim', 'Sikh', 'Christian', 'Buddhist', 'Jain', 'Other'].map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                            <select
                                name="enabled"
                                value={filters.enabled}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border border-theme-border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all appearance-none bg-theme-surface cursor-pointer text-sm"
                            >
                                <option value="">Status</option>
                                <option value="true">Active</option>
                                <option value="false">Blocked</option>
                            </select>

                            <div className="flex flex-col sm:flex-row gap-2 xl:col-span-6 mt-2">
                                <button
                                    onClick={applyFilters}
                                    className="flex-1 bg-pink-600 text-white px-6 py-2.5 sm:py-3 rounded-xl font-bold hover:bg-pink-700 transition-all shadow-lg shadow-pink-200 active:scale-95 flex items-center justify-center gap-2 text-sm"
                                >
                                    <Filter size={16} /> Apply Filters
                                </button>
                                <button
                                    onClick={() => { resetFilters(); fetchUsers(); }}
                                    className="px-6 py-2.5 sm:py-3 border border-theme-border rounded-xl hover:bg-gray-50 transition-all font-bold text-theme-text-secondary active:scale-95 text-sm"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-theme-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-4 sm:px-6 py-4 text-[10px] font-bold text-theme-text-secondary uppercase tracking-wider">User</th>
                                        <th className="hidden sm:table-cell px-4 sm:px-6 py-4 text-[10px] font-bold text-theme-text-secondary uppercase tracking-wider">Profile ID</th>
                                        <th className="hidden lg:table-cell px-4 sm:px-6 py-4 text-[10px] font-bold text-theme-text-secondary uppercase tracking-wider">Contact</th>
                                        <th className="hidden md:table-cell px-4 sm:px-6 py-4 text-[10px] font-bold text-theme-text-secondary uppercase tracking-wider">Verification</th>
                                        <th className="px-4 sm:px-6 py-4 text-[10px] font-bold text-theme-text-secondary uppercase tracking-wider">Status</th>
                                        <th className="px-4 sm:px-6 py-4 text-[10px] font-bold text-theme-text-secondary uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-10 text-center text-gray-400">Loading users...</td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-10 text-center text-gray-400 font-medium italic">No users found matching filters</td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                                                <td className="px-4 sm:px-6 py-4">
                                                    <div className="flex items-center">
                                                        {user.profile?.profilePictureUrl ? (
                                                            <img
                                                                src={user.profile.profilePictureUrl}
                                                                alt=""
                                                                className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl object-cover border-2 border-pink-50 mr-2 sm:mr-3 shrink-0"
                                                            />
                                                        ) : (
                                                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 font-bold border-2 border-pink-50 mr-2 sm:mr-3 shrink-0 text-xs sm:text-base">
                                                                {user.profile?.fullName?.charAt(0) || 'U'}
                                                            </div>
                                                        )}
                                                        <div className="min-w-0">
                                                            <p className="text-xs sm:text-sm font-bold text-gray-800 truncate">{user.profile?.fullName || 'No Name'}</p>
                                                            <p className="text-[9px] sm:text-[10px] text-theme-text-secondary truncate">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="hidden sm:table-cell px-4 sm:px-6 py-4">
                                                    <span className="text-[10px] font-mono font-bold bg-pink-50 px-2 sm:px-3 py-1 rounded-lg text-pink-700">
                                                        {user.profile?.profileId || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="hidden lg:table-cell px-4 sm:px-6 py-4">
                                                    <p className="text-xs font-medium text-gray-700">{user.mobileNumber}</p>
                                                </td>
                                                <td className="hidden md:table-cell px-4 sm:px-6 py-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                                                        (user.profile?.verificationStatus === 'APPROVED' || user.profile?.verificationStatus === 'VERIFIED')
                                                        ? 'bg-emerald-100 text-emerald-700' : user.profile?.verificationStatus === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {user.profile?.verificationStatus || 'PENDING'}
                                                    </span>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4">
                                                    <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${user.enabled ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
                                                        }`}>
                                                        {user.enabled ? 'Active' : 'Blocked'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => toggleUserBlock(user)}
                                                            className={`p-2 rounded-xl transition-all ${user.enabled ? 'text-gray-400 hover:bg-amber-50 hover:text-amber-500' : 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100'}`}
                                                            title={user.enabled ? 'Block User' : 'Unblock User'}
                                                        >
                                                            <Ban size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleViewProfile(user.id)}
                                                            className="p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-500 rounded-xl transition-all"
                                                            title="View Profile"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs font-medium text-theme-text-secondary">
                                Showing <span className="text-gray-800 font-bold">{users.length}</span> of <span className="text-gray-800 font-bold">{totalUsers}</span> registered users
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    disabled={page === 0}
                                    onClick={() => setPage(page - 1)}
                                    className="px-4 py-2 bg-theme-surface border border-theme-border rounded-xl hover:border-pink-300 hover:text-pink-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold"
                                >
                                    Previous
                                </button>
                                <div className="px-4 py-2 bg-pink-50 text-pink-700 rounded-xl text-xs font-black">
                                    {page + 1}
                                </div>
                                <button
                                    disabled={(page + 1) * size >= totalUsers}
                                    onClick={() => setPage(page + 1)}
                                    className="px-4 py-2 bg-theme-surface border border-theme-border rounded-xl hover:border-pink-300 hover:text-pink-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                /* Staff Management Section */
                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Admin Staff Members</h2>
                        <button
                            onClick={() => setIsAddStaffModalOpen(true)}
                            className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center gap-2 text-sm"
                        >
                            <UserPlus size={16} /> Add New Staff
                        </button>
                    </div>

                    <div className="bg-theme-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-bold text-theme-text-secondary uppercase tracking-wider">Staff Info</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-theme-text-secondary uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-theme-text-secondary uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-theme-text-secondary uppercase tracking-wider">Last Login</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-theme-text-secondary uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">Loading staff...</td></tr>
                                    ) : staffList.length === 0 ? (
                                        <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">No staff accounts found</td></tr>
                                    ) : (
                                        staffList.map((s) => (
                                            <tr key={s.id} className="hover:bg-gray-50/80 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 text-pink-600 bg-pink-50 rounded-xl flex items-center justify-center font-bold border border-pink-100">
                                                            {s.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-800">{s.name}</p>
                                                            <p className="text-[10px] text-gray-400">{s.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-gray-100 text-theme-text-secondary rounded-lg">
                                                        {s.role.replace('ROLE_', '').replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${s.status ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                                        {s.status ? 'Active' : 'Disabled'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-theme-text-secondary">
                                                    {s.lastLogin ? new Date(s.lastLogin).toLocaleString() : 'Never'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => handleDeleteStaff(s.id)}
                                                        disabled={s.role === 'ROLE_SUPER_ADMIN'}
                                                        className="p-2 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all disabled:opacity-30"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Add Staff Modal */}
                    {isAddStaffModalOpen && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                            <form onSubmit={handleAddStaff} className="bg-theme-surface rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
                                <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
                                    <h3 className="text-lg font-black uppercase tracking-tight">Create Staff Member</h3>
                                    <button type="button" onClick={() => setIsAddStaffModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                        <XCircle size={24} />
                                    </button>
                                </div>
                                <div className="p-8 space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                                        <input required value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm font-bold" placeholder="e.g. John Doe" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Login Email</label>
                                        <input required type="email" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm font-bold" placeholder="admin@lovenzea.com" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Login Password</label>
                                        <input required type="password" value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm font-bold" placeholder="••••••••" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Role</label>
                                        <select value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm font-bold cursor-pointer">
                                            <option value="ROLE_ADMIN">Admin</option>
                                            <option value="ROLE_SUB_ADMIN">Sub Admin</option>
                                            <option value="ROLE_MODERATOR">Moderator</option>
                                            <option value="ROLE_KYC_VERIFIER">KYC Verifier</option>
                                            <option value="ROLE_EVENT_MANAGER">Event Manager</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="w-full bg-pink-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-pink-100 hover:bg-pink-700 transition-all mt-4">
                                        Create Account
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}

            {/* Profile Detail Modal */}
            {isViewModalOpen && selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-theme-surface rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in duration-300 flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 text-white flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-4">
                                {selectedUser.user?.profile?.profilePictureUrl ? (
                                    <img
                                        src={selectedUser.user.profile.profilePictureUrl}
                                        alt=""
                                        className="h-14 w-14 rounded-2xl object-cover border border-white/30 shadow-lg"
                                    />
                                ) : (
                                    <div className="h-14 w-14 rounded-2xl bg-theme-surface/20 backdrop-blur-md flex items-center justify-center text-white text-2xl font-bold border border-white/30">
                                        {selectedUser.user?.profile?.fullName?.charAt(0) || 'U'}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xl font-bold">{selectedUser.user?.profile?.fullName || 'Full Profile'}</h3>
                                    <p className="text-pink-100 text-xs font-bold uppercase tracking-widest">{selectedUser.user?.profile?.profileId}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="p-2 bg-theme-surface/10 hover:bg-theme-surface/20 rounded-xl transition-colors"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                {/* Basic Info */}
                                <div className="space-y-6">
                                    <h4 className="text-xs sm:text-sm font-black text-pink-600 uppercase tracking-widest border-l-4 border-pink-500 pl-3">Basic Information</h4>
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        {[
                                            { label: 'Full Name', value: selectedUser.user?.profile?.fullName },
                                            { label: 'Email', value: selectedUser.user?.email },
                                            { label: 'Mobile', value: selectedUser.user?.mobileNumber },
                                            { label: 'Gender', value: selectedUser.user?.profile?.gender },
                                            { label: 'Age', value: selectedUser.user?.profile?.age },
                                            { label: 'Height', value: selectedUser.user?.profile?.height },
                                            { label: 'Marital Status', value: selectedUser.user?.profile?.maritalStatus },
                                            { label: 'Mother Tongue', value: selectedUser.user?.profile?.motherTongue },
                                        ].map((item, i) => (
                                            <div key={i} className="bg-gray-50 p-2 sm:p-3 rounded-xl border border-gray-100">
                                                <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase">{item.label}</p>
                                                <p className="text-xs sm:text-sm font-bold text-gray-800 break-words">{item.value || 'N/A'}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <h4 className="text-xs sm:text-sm font-black text-pink-600 uppercase tracking-widest border-l-4 border-pink-500 pl-3">Religious & Astro</h4>
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        {[
                                            { label: 'Religion', value: selectedUser.user?.profile?.religion },
                                            { label: 'Community', value: selectedUser.user?.profile?.caste },
                                            { label: 'Gothra', value: selectedUser.user?.profile?.gotra },
                                            { label: 'Manglik/Chevvai Dosham', value: selectedUser.user?.profile?.manglikStatus },
                                            { label: 'City Of Birth', value: selectedUser.user?.profile?.placeOfBirth },
                                            { label: 'Time Of Birth', value: selectedUser.user?.profile?.timeOfBirth },
                                        ].map((item, i) => (
                                            <div key={i} className="bg-gray-50 p-2 sm:p-3 rounded-xl border border-gray-100">
                                                <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase">{item.label}</p>
                                                <p className="text-xs sm:text-sm font-bold text-gray-800 break-words">{item.value || 'N/A'}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Education & Family */}
                                <div className="space-y-6">
                                    <h4 className="text-xs sm:text-sm font-black text-pink-600 uppercase tracking-widest border-l-4 border-pink-500 pl-3">Education & Career</h4>
                                    <div className="bg-gray-50 p-3 sm:p-4 rounded-2xl border border-gray-100 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-pink-100 rounded-lg text-pink-600"><FaGraduationCap /></div>
                                            <div>
                                                <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase">Highest Qualification</p>
                                                <p className="text-xs sm:text-sm font-bold text-gray-800">{selectedUser.user?.profile?.educationLevel || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-pink-100 rounded-lg text-pink-600"><FaBriefcase /></div>
                                            <div>
                                                <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase">Occupation & Income</p>
                                                <p className="text-xs sm:text-sm font-bold text-gray-800">{selectedUser.user?.profile?.occupation || 'N/A'} • {selectedUser.user?.profile?.annualIncome || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <h4 className="text-xs sm:text-sm font-black text-pink-600 uppercase tracking-widest border-l-4 border-pink-500 pl-3">Location</h4>
                                    <div className="bg-gray-50 p-3 sm:p-4 rounded-2xl border border-gray-100 space-y-2">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <FaMapMarkerAlt className="text-pink-500 flex-shrink-0" />
                                            <span className="text-xs sm:text-sm font-bold">{selectedUser.user?.profile?.city}, {selectedUser.user?.profile?.state}, {selectedUser.user?.profile?.country}</span>
                                        </div>
                                        <p className="text-[10px] sm:text-xs text-theme-text-secondary pl-6">{selectedUser.user?.profile?.address}</p>
                                    </div>

                                    <h4 className="text-xs sm:text-sm font-black text-pink-600 uppercase tracking-widest border-l-4 border-pink-500 pl-3">Verification Details</h4>
                                    <div className="bg-gray-900 p-3 sm:p-4 rounded-2xl text-white space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">Status</span>
                                            <span className={`px-2 sm:px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                                                (selectedUser.user?.profile?.verificationStatus === 'APPROVED' || selectedUser.user?.profile?.verificationStatus === 'VERIFIED') 
                                                ? 'bg-emerald-500/20 text-emerald-400' 
                                                : selectedUser.user?.profile?.verificationStatus === 'REJECTED' 
                                                    ? 'bg-rose-500/20 text-rose-400' 
                                                    : 'bg-amber-500/20 text-amber-400'
                                                }`}>
                                                {selectedUser.user?.profile?.verificationStatus || 'PENDING'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center gap-2">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase shrink-0">ID Type</span>
                                            <span className="text-xs sm:text-sm font-bold truncate">{selectedUser.user?.profile?.idProofType || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center gap-2">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase shrink-0">ID Number</span>
                                            <span className="text-xs sm:text-sm font-bold truncate">{selectedUser.user?.profile?.idProofNumber || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <h4 className="text-xs sm:text-sm font-black text-pink-600 uppercase tracking-widest border-l-4 border-pink-500 pl-3 mt-4">Membership Info</h4>
                                    <div className="bg-pink-600 p-3 sm:p-4 rounded-2xl text-white space-y-3">
                                        {selectedUser.activeSubscription ? (
                                            <>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] sm:text-[10px] text-pink-200 font-bold uppercase">Plan</span>
                                                    <span className="text-xs sm:text-sm font-black">{selectedUser.activeSubscription.plan.name}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] sm:text-[10px] text-pink-200 font-bold uppercase">Expiry</span>
                                                    <span className="text-xs sm:text-sm font-bold">{new Date(selectedUser.activeSubscription.expiryDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] sm:text-[10px] text-pink-200 font-bold uppercase">Status</span>
                                                    <span className="px-2 py-0.5 bg-theme-surface/20 rounded-md text-[9px] font-black uppercase tracking-widest">Active</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-1">
                                                <p className="text-xs font-bold italic text-pink-100">No Active Membership</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="px-6 py-2 border border-theme-border rounded-xl hover:bg-theme-surface transition-all text-sm font-bold text-theme-text-secondary"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => toggleUserBlock(selectedUser.user)}
                                className={`px-6 py-2 rounded-xl text-sm font-bold text-white transition-all shadow-lg ${selectedUser.user?.enabled ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'
                                    }`}
                            >
                                {selectedUser.user?.enabled ? 'Block User' : 'Unblock User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserManagement;
