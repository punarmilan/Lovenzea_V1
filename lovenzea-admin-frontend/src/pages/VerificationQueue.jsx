import React, { useState, useEffect } from 'react';
import adminVerificationService from '../services/adminVerificationService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Eye, 
  UserCheck, 
  MapPin, 
  Briefcase, 
  Calendar,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const VerificationQueue = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Rejection & Inspection State
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [rejectingProfile, setRejectingProfile] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const PRESET_REASONS = [
    'Profile photographs are blurry or unrecognizable',
    'Inappropriate or offensive biographical content',
    'Identity documents did not match profile details',
    'Candidate does not meet minimum age criteria (21+ for males, 18+ for females)',
    'Suspected duplicate or fraudulent registration',
  ];

  useEffect(() => {
    fetchPendingProfiles();
  }, [page, size]);

  const fetchPendingProfiles = async () => {
    setLoading(true);
    try {
      const data = await adminVerificationService.getPendingProfiles({ page, size });
      setProfiles(data.content || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load pending KYC verifications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminVerificationService.approveProfile(id);
      toast.success('Profile verified and approved successfully');
      fetchPendingProfiles();
    } catch (error) {
      toast.error('Approval failed');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectReason) {
      toast.error('Please specify a rejection reason');
      return;
    }

    try {
      await adminVerificationService.rejectProfile(rejectingProfile.id, rejectReason);
      toast.success('Profile rejected and feedback sent');
      setRejectingProfile(null);
      setRejectReason('');
      fetchPendingProfiles();
    } catch (error) {
      toast.error('Rejection failed');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <UserCheck size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">KYC Verification Pipeline</h2>
            <p className="text-xs text-slate-400">Review pending matrimony registrations before public discovery</p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs self-start sm:self-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{totalElements} Verification Requests Pending</span>
        </div>
      </div>

      {/* Main Profiles Content */}
      {loading ? (
        <LoadingSpinner text="Loading verification requests..." />
      ) : profiles.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="All Caught Up!"
          message="There are no pending profile verification requests waiting in the queue."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map((profile) => {
            const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.name || 'Candidate';
            const photos = profile.photos || profile.photoUrls || (profile.profilePic ? [profile.profilePic] : []);

            return (
              <div key={profile.id} className="glass-card p-6 rounded-3xl space-y-5 border border-slate-800 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Top info */}
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-white font-extrabold text-2xl shrink-0">
                      {photos.length > 0 ? (
                        <img src={photos[0]} alt={fullName} className="w-full h-full object-cover" />
                      ) : (
                        fullName.charAt(0)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-base font-bold text-white truncate">{fullName}</h4>
                        <Badge variant="warning" size="xs">Pending KYC</Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{profile.email || 'No email'}</p>
                      <p className="text-[11px] text-slate-500 mt-1">Dossier #{profile.id} • {profile.gender}</p>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Location</span>
                      <span className="font-semibold text-slate-300 truncate block">
                        {profile.city || profile.location || 'Not given'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Profession</span>
                      <span className="font-semibold text-slate-300 truncate block">
                        {profile.occupation || 'Not given'}
                      </span>
                    </div>
                  </div>

                  {/* Bio Snippet */}
                  {profile.aboutMe && (
                    <p className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 line-clamp-2">
                      "{profile.aboutMe}"
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedProfile(profile)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>Inspect</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRejectingProfile(profile)}
                      className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <XCircle size={14} />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApprove(profile.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 size={14} />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inspect Profile Modal */}
      <Modal
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
        title="Candidate Profile Dossier"
        subtitle={`Verifying candidate #${selectedProfile?.id}`}
      >
        {selectedProfile && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center font-bold text-2xl text-white">
                {selectedProfile.photos?.[0] ? (
                  <img src={selectedProfile.photos[0]} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  (selectedProfile.firstName || 'C').charAt(0)
                )}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {selectedProfile.firstName} {selectedProfile.lastName}
                </h4>
                <p className="text-xs text-slate-400">{selectedProfile.email} • {selectedProfile.mobileNumber}</p>
                <p className="text-xs text-rose-400 font-semibold mt-1">{selectedProfile.maritalStatus || 'Never Married'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block mb-1">Education</span>
                <span className="font-semibold text-white">{selectedProfile.highestDegree || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block mb-1">Occupation & Package</span>
                <span className="font-semibold text-white">{selectedProfile.occupation || 'N/A'} • {selectedProfile.annualIncome || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block mb-1">Religion & Caste</span>
                <span className="font-semibold text-white">{selectedProfile.religion || 'Hindu'} • {selectedProfile.caste || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block mb-1">Location</span>
                <span className="font-semibold text-white">{selectedProfile.city || 'N/A'}, {selectedProfile.state || 'N/A'}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  const prof = selectedProfile;
                  setSelectedProfile(null);
                  setRejectingProfile(prof);
                }}
                className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-bold hover:bg-rose-500/30"
              >
                Reject Profile
              </button>
              <button
                onClick={() => {
                  handleApprove(selectedProfile.id);
                  setSelectedProfile(null);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg"
              >
                Approve Verification
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Reason Dialog */}
      <Modal
        isOpen={!!rejectingProfile}
        onClose={() => {
          setRejectingProfile(null);
          setRejectReason('');
        }}
        title="Reject Profile Verification"
        subtitle={`Select or provide feedback for ${rejectingProfile?.firstName || 'Candidate'}`}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Preset Feedback Options</label>
            <div className="space-y-2">
              {PRESET_REASONS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setRejectReason(preset)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-medium transition-all ${
                    rejectReason === preset
                      ? 'bg-rose-600/30 border border-rose-500 text-white'
                      : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Custom Feedback Message</label>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explain what the candidate needs to rectify..."
              className="w-full p-3 rounded-xl glass-input text-xs font-medium"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setRejectingProfile(null);
                setRejectReason('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950/40"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VerificationQueue;
