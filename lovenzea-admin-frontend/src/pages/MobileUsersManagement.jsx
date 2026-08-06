import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminUserService from '../services/adminUserService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import { 
  Smartphone, 
  Search, 
  Eye, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  ShieldCheck, 
  ChevronRight,
  UserCheck,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const MobileUsersManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchMobileUsers();
  }, [page, size, genderFilter]);

  const fetchMobileUsers = async () => {
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
      toast.error('Failed to load mobile app profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchMobileUsers();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 sm:p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-950/40">
            <Smartphone size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Mobile Matrimony Profiles</h2>
            <p className="text-xs text-slate-400">Inspect and manage full matrimony dossiers registered via mobile apps</p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-bold text-rose-400 self-start sm:self-auto">
          {totalElements} Profiles Tracked
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city, caste..."
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
            <option value="MALE">Grooms (Male)</option>
            <option value="FEMALE">Brides (Female)</option>
          </select>

          <button
            onClick={fetchMobileUsers}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
          >
            Filter Directory
          </button>
        </div>
      </div>

      {/* Grid of Mobile Profile Cards */}
      {loading ? (
        <LoadingSpinner text="Retrieving mobile user profiles..." />
      ) : users.length === 0 ? (
        <EmptyState title="No Profiles Found" message="No matrimony profiles found matching your search." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => {
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'Unnamed Profile';
            const isVerified = user.isVerified || user.profileVerified;

            return (
              <div
                key={user.id}
                onClick={() => navigate(`/mobile-users/${user.id}`)}
                className="glass-card p-5 rounded-3xl space-y-4 hover:border-rose-500/50 transition-all duration-300 group cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700/80 overflow-hidden flex items-center justify-center text-white font-extrabold text-xl shrink-0 group-hover:scale-105 transition-transform">
                      {user.profilePic || user.profilePhotoUrl ? (
                        <img 
                          src={user.profilePic || user.profilePhotoUrl} 
                          alt={fullName} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        fullName.charAt(0)
                      )}
                    </div>
                    {isVerified && (
                      <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-white shadow-md">
                        <ShieldCheck size={12} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors truncate">
                        {fullName}
                      </h4>
                      <Badge variant={user.gender === 'FEMALE' ? 'primary' : 'info'} size="xs">
                        {user.gender || 'N/A'}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email || 'No email'}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Profile ID: #{user.id}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin size={13} className="text-rose-400 shrink-0" />
                    <span className="truncate">{user.city || user.location || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Briefcase size={13} className="text-cyan-400 shrink-0" />
                    <span className="truncate">{user.occupation || user.job || 'Profession not added'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {user.maritalStatus || 'Never Married'}
                  </span>
                  <span className="text-rose-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Inspect</span>
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="glass-card p-4 rounded-2xl flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition-colors"
            >
              Previous
            </button>
            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileUsersManagement;
