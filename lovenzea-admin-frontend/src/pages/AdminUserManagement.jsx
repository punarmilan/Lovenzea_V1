import React, { useState, useEffect } from 'react';
import adminUserService from '../services/adminUserService';
import adminAuthService from '../services/adminAuthService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { 
  Users, 
  ShieldCheck, 
  Search, 
  Filter, 
  UserPlus, 
  Trash2, 
  Ban, 
  CheckCircle, 
  Eye, 
  UserX,
  Mail,
  Phone,
  Calendar,
  Lock,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const AdminUserManagement = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'staff'
  const [users, setUsers] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Pagination for users
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters
  const [genderFilter, setGenderFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [selectedUser, setSelectedUser] = useState(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ROLE_MODERATOR',
  });

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchStaff();
    }
  }, [activeTab, page, size, genderFilter, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminUserService.getAllUsers({
        page,
        size,
        search: search || undefined,
        gender: genderFilter || undefined,
      });
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const data = await adminAuthService.getAllStaff();
      setStaffList(data || []);
    } catch (error) {
      toast.error('Failed to load staff list');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  const handleToggleBlock = async (user) => {
    const isBlocked = user.accountLocked || user.status === 'BLOCKED';
    const actionName = isBlocked ? 'unblock' : 'block';

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionName} user "${user.firstName || user.name || user.email}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#334155',
      confirmButtonText: `Yes, ${actionName}`,
      background: '#0f172a',
      color: '#f8fafc',
    });

    if (result.isConfirmed) {
      try {
        if (isBlocked) {
          await adminUserService.unblockUser(user.id);
          toast.success('User unblocked successfully');
        } else {
          await adminUserService.blockUser(user.id);
          toast.success('User account blocked');
        }
        fetchUsers();
      } catch (err) {
        toast.error(`Failed to ${actionName} user`);
      }
    }
  };

  const handleDeleteUser = async (id, name) => {
    const result = await Swal.fire({
      title: 'Permanent Deletion',
      text: `This action cannot be undone. Delete user "${name || id}"?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, permanently delete',
      background: '#0f172a',
      color: '#f8fafc',
    });

    if (result.isConfirmed) {
      try {
        await adminUserService.deleteUser(id);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.email || !newStaff.password || !newStaff.name) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      await adminAuthService.createStaff(newStaff);
      toast.success('New administrative staff member created');
      setIsStaffModalOpen(false);
      setNewStaff({ name: '', email: '', password: '', role: 'ROLE_MODERATOR' });
      fetchStaff();
    } catch (err) {
      toast.error('Failed to create staff member');
    }
  };

  const handleDeleteStaff = async (id, name) => {
    const result = await Swal.fire({
      title: 'Revoke Admin Privileges',
      text: `Are you sure you want to remove staff member "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, Revoke Access',
      background: '#0f172a',
      color: '#f8fafc',
    });

    if (result.isConfirmed) {
      try {
        await adminAuthService.deleteStaff(id);
        toast.success('Staff access revoked');
        fetchStaff();
      } catch (err) {
        toast.error('Failed to revoke staff access');
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 sm:p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Identity & Staff Directory</h2>
            <p className="text-xs text-slate-400">Manage consumer registrations, roles, and administrative staff</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Registered Users ({totalElements})
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Staff & Admins ({staffList.length})
          </button>
        </div>
      </div>

      {/* TAB 1: REGISTERED USERS */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, phone..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs font-medium"
              />
            </form>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl glass-input text-xs font-medium"
              >
                <option value="">All Genders</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>

              <button
                onClick={fetchUsers}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Users Table */}
          {loading ? (
            <LoadingSpinner text="Retrieving member records..." />
          ) : users.length === 0 ? (
            <EmptyState title="No Users Found" message="No user accounts match the current filter criteria." />
          ) : (
            <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/90 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-4 px-6">User / Profile</th>
                      <th className="py-4 px-6">Contact Info</th>
                      <th className="py-4 px-6">Gender</th>
                      <th className="py-4 px-6">Role</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {users.map((user) => {
                      const isBlocked = user.accountLocked || user.status === 'BLOCKED';
                      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'Unnamed User';

                      return (
                        <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                          {/* User / Profile */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                {fullName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-white leading-tight">{fullName}</p>
                                <p className="text-[11px] text-slate-500">ID: #{user.id}</p>
                              </div>
                            </div>
                          </td>

                          {/* Contact Info */}
                          <td className="py-4 px-6 text-xs">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 text-slate-300">
                                <Mail size={12} className="text-slate-500" />
                                <span>{user.email || 'N/A'}</span>
                              </div>
                              {user.mobileNumber && (
                                <div className="flex items-center gap-1.5 text-slate-400">
                                  <Phone size={12} className="text-slate-500" />
                                  <span>{user.mobileNumber}</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Gender */}
                          <td className="py-4 px-6 text-xs font-semibold text-slate-300">
                            {user.gender || 'Not specified'}
                          </td>

                          {/* Role */}
                          <td className="py-4 px-6 text-xs">
                            <Badge variant={user.role?.includes('ADMIN') ? 'primary' : 'default'}>
                              {user.role?.replace('ROLE_', '') || 'USER'}
                            </Badge>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-6 text-xs">
                            <Badge variant={isBlocked ? 'danger' : 'success'}>
                              {isBlocked ? 'Blocked' : 'Active'}
                            </Badge>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedUser(user)}
                                title="Inspect User"
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleToggleBlock(user)}
                                title={isBlocked ? 'Unblock User' : 'Block User'}
                                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                                  isBlocked
                                    ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                                    : 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25'
                                }`}
                              >
                                {isBlocked ? <CheckCircle size={16} /> : <Ban size={16} />}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id, fullName)}
                                title="Delete User"
                                className="p-2 rounded-xl bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 transition-colors cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Showing Page {page + 1} of {totalPages} ({totalElements} total members)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={page === 0}
                      onClick={() => setPage(page - 1)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      disabled={page + 1 >= totalPages}
                      onClick={() => setPage(page + 1)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: STAFF & ADMINS */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between glass-card p-4 rounded-2xl">
            <div>
              <h3 className="text-sm font-bold text-white">Privileged Administrative Staff</h3>
              <p className="text-xs text-slate-400">Super Admins, Sub-Admins, KYC Verifiers and Event Managers</p>
            </div>
            <button
              onClick={() => setIsStaffModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-950/40 hover:from-rose-500 hover:to-pink-500 transition-all cursor-pointer"
            >
              <UserPlus size={16} />
              <span>Add Staff Member</span>
            </button>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading staff records..." />
          ) : staffList.length === 0 ? (
            <EmptyState title="No Staff Accounts Found" message="No administrative accounts have been configured." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffList.map((staff) => (
                <div key={staff.id} className="glass-card p-5 rounded-3xl space-y-4 relative group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg">
                        {staff.name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{staff.name}</h4>
                        <p className="text-xs text-slate-400">{staff.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteStaff(staff.id, staff.name)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Revoke Staff"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Assigned Role</span>
                    <Badge variant="purple">{staff.role?.replace('ROLE_', '')}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* User Details Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="User Account Details"
        subtitle={`Inspecting profile #${selectedUser?.id}`}
      >
        {selectedUser && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center text-white font-extrabold text-2xl">
                {(selectedUser.firstName || selectedUser.name || 'U').charAt(0)}
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h4>
                <p className="text-xs text-slate-400">{selectedUser.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="primary">{selectedUser.role || 'ROLE_USER'}</Badge>
                  <Badge variant={selectedUser.accountLocked ? 'danger' : 'success'}>
                    {selectedUser.accountLocked ? 'Blocked' : 'Active'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Mobile Number</span>
                <span className="font-semibold text-white">{selectedUser.mobileNumber || 'Not provided'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Gender</span>
                <span className="font-semibold text-white">{selectedUser.gender || 'Not specified'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Available Connects</span>
                <span className="font-semibold text-rose-400">{selectedUser.connects ?? 'N/A'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Joined Date</span>
                <span className="font-semibold text-white">
                  {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Staff Modal */}
      <Modal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        title="Create Administrative Staff"
        subtitle="Grant role-based administrative credentials"
      >
        <form onSubmit={handleCreateStaff} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Staff Full Name</label>
            <input
              type="text"
              required
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Email Address</label>
            <input
              type="email"
              required
              value={newStaff.email}
              onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
              placeholder="e.g. staff@lovenzea.online"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Temporary Password</label>
            <input
              type="password"
              required
              value={newStaff.password}
              onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Administrative Role</label>
            <select
              value={newStaff.role}
              onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium"
            >
              <option value="ROLE_ADMIN">ROLE_ADMIN (Full Management)</option>
              <option value="ROLE_MODERATOR">ROLE_MODERATOR (Reports & Photos)</option>
              <option value="ROLE_KYC_VERIFIER">ROLE_KYC_VERIFIER (KYC Verification)</option>
              <option value="ROLE_EVENT_MANAGER">ROLE_EVENT_MANAGER (Events & Meetups)</option>
              <option value="ROLE_SUB_ADMIN">ROLE_SUB_ADMIN (Sub-Admin)</option>
            </select>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsStaffModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-rose-950/50 hover:from-rose-500 hover:to-pink-500"
            >
              Create Staff Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUserManagement;
