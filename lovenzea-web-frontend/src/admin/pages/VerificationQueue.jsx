import React, { useState, useEffect } from 'react';
import adminVerificationService from '../services/adminVerificationService';
import { Check, X, Shield, Eye, FileText, Calendar, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

const VerificationQueue = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        fetchPendingProfiles();
    }, [page, size]);

    const fetchPendingProfiles = async () => {
        setLoading(true);
        try {
            const data = await adminVerificationService.getPendingProfiles({ page, size });
            setProfiles(data.content || []);
            setTotalElements(data.totalElements || 0);
        } catch (error) {
            toast.error('Failed to load pending profiles');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await adminVerificationService.approveProfile(id);
            toast.success('Profile approved successfully');
            fetchPendingProfiles();
        } catch (error) {
            toast.error('Approval failed');
        }
    };

    const handleReject = async () => {
        if (!rejectReason) {
            toast.error('Please provide a reason for rejection');
            return;
        }
        try {
            await adminVerificationService.rejectProfile(rejectingId, rejectReason);
            toast.success('Profile rejected');
            setRejectingId(null);
            setRejectReason('');
            fetchPendingProfiles();
        } catch (error) {
            toast.error('Rejection failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-theme-surface p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">Verification Queue</h2>
                    <p className="text-xs sm:text-sm text-theme-text-secondary font-medium">Manage pending profile and ID verifications</p>
                </div>
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-pink-50 text-pink-700 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap">
                    {totalElements} Pending
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="p-10 text-center text-gray-400 font-medium">Loading queue...</div>
                ) : profiles.length === 0 ? (
                    <div className="bg-theme-surface p-12 rounded-3xl border-2 border-dashed border-theme-border flex flex-col items-center justify-center text-gray-400">
                        <Shield size={48} className="mb-4 opacity-20" />
                        <p className="font-bold">Queue is empty!</p>
                        <p className="text-sm">All profiles are currently processed.</p>
                    </div>
                ) : (
                    profiles.map((profile) => (
                        <div key={profile.id} className="bg-theme-surface rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row">
                                {/* User Basic Info */}
                                <div className="p-4 sm:p-6 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/30">
                                    <div className="flex items-center gap-3 sm:gap-4 mb-4">
                                        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 text-lg sm:text-xl font-bold border-2 border-pink-50 shadow-sm shrink-0">
                                            {profile.fullName?.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-gray-800 leading-tight text-sm sm:text-base truncate">{profile.fullName}</h3>
                                            <p className="text-[10px] sm:text-xs font-black text-pink-600 uppercase tracking-widest">{profile.profileId}</p>
                                            <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium mt-1">Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap lg:flex-col gap-3 sm:gap-4">
                                        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-theme-text-secondary font-medium whitespace-nowrap">
                                            <MapPin size={12} className="text-pink-500" />
                                            {profile.city}, {profile.state}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-theme-text-secondary font-medium whitespace-nowrap">
                                            <Calendar size={12} className="text-pink-500" />
                                            {profile.gender} • {profile.age} Years
                                        </div>
                                    </div>
                                </div>

                                {/* ID Proof Details */}
                                <div className="p-4 sm:p-6 lg:flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <FileText size={14} className="text-pink-600" />
                                            ID Proof Information
                                        </h4>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div className="bg-gray-50 p-2.5 sm:p-3 rounded-xl border border-gray-100">
                                            <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase">Document Type</p>
                                            <p className="text-xs sm:text-sm font-bold text-gray-800">{profile.idProofType || 'Aadhar Card'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-2.5 sm:p-3 rounded-xl border border-gray-100">
                                            <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase">Document Number</p>
                                            <p className="text-xs sm:text-sm font-bold text-gray-800 break-all">{profile.idProofNumber || 'XXXX-XXXX-1234'}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                        <div
                                            onClick={() => profile.idProofUrl && window.open(profile.idProofUrl, '_blank')}
                                            className="h-16 w-28 sm:h-20 sm:w-32 bg-gray-100 rounded-xl border border-theme-border flex items-center justify-center overflow-hidden group relative cursor-pointer"
                                        >
                                            {profile.idProofUrl ? (
                                                <img src={profile.idProofUrl} alt="ID Proof" className="w-full h-full object-cover" />
                                            ) : (
                                                <FileText className="text-gray-300" />
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold">
                                                Click to View
                                            </div>
                                        </div>
                                        <div className="text-[10px] sm:text-xs text-theme-text-secondary font-medium">
                                            <p>Verify that name on ID matches</p>
                                            <p className="text-gray-800 font-bold">"{profile.fullName}"</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="p-4 sm:p-6 lg:w-48 bg-gray-50/50 flex flex-row lg:flex-col justify-center gap-2 sm:gap-3 border-t lg:border-t-0 lg:border-l border-gray-100">
                                    <button
                                        onClick={() => handleApprove(profile.id)}
                                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-emerald-500 text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-emerald-50 hover:bg-emerald-600 transition-all active:scale-95"
                                    >
                                        <Check size={16} className="sm:size-5" />
                                        Verified
                                    </button>
                                    <button
                                        onClick={() => setRejectingId(profile.id)}
                                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-theme-surface border border-rose-200 text-rose-500 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:bg-rose-50 transition-all active:scale-95"
                                    >
                                        <X size={16} className="sm:size-5" />
                                        Reject
                                    </button>
                                </div>
                            </div>

                            {/* Rejection form overlay */}
                            {rejectingId === profile.id && (
                                <div className="p-4 sm:p-6 bg-rose-50 border-t border-rose-100 animate-in slide-in-from-top duration-300">
                                    <label className="block text-[10px] font-bold text-rose-700 uppercase mb-2">Reason for Rejection</label>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                            placeholder="e.g. ID blurred, Name mismatch..."
                                            className="flex-1 px-4 py-2.5 border border-rose-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleReject}
                                                className="flex-1 sm:flex-none px-4 py-2.5 bg-rose-600 text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-rose-700 transition-colors"
                                            >
                                                Submit
                                            </button>
                                            <button
                                                onClick={() => { setRejectingId(null); setRejectReason(''); }}
                                                className="flex-1 sm:flex-none px-4 py-2.5 bg-rose-100 text-rose-700 rounded-xl font-bold text-xs sm:text-sm hover:bg-rose-200 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Pagination placeholder */}
            {totalElements > size && (
                <div className="flex justify-center gap-2">
                    <button
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                        className="px-4 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs font-bold disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        disabled={(page + 1) * size >= totalElements}
                        onClick={() => setPage(page + 1)}
                        className="px-4 py-2 bg-theme-surface border border-theme-border rounded-xl text-xs font-bold disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default VerificationQueue;
