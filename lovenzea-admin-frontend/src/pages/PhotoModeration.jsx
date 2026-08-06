import React, { useState, useEffect } from 'react';
import adminVerificationService from '../services/adminVerificationService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { 
  Image as ImageIcon, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ZoomIn, 
  ShieldAlert, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Sparkles 
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const PhotoModeration = () => {
  const [photoProfiles, setPhotoProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Zoom preview
  const [previewPhoto, setPreviewPhoto] = useState(null);
  
  // Rejection dialog
  const [rejectingItem, setRejectingItem] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchPendingPhotos();
  }, [page, size]);

  const fetchPendingPhotos = async () => {
    setLoading(true);
    try {
      const data = await adminVerificationService.getPendingPhotos({ page, size });
      setPhotoProfiles(data.content || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load pending photos');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminVerificationService.approvePhotos(id);
      toast.success('Photos approved for profile');
      fetchPendingPhotos();
    } catch (error) {
      toast.error('Failed to approve photos');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectReason) {
      toast.error('Please enter a rejection reason');
      return;
    }
    try {
      await adminVerificationService.rejectPhotos(rejectingItem.id, rejectReason);
      toast.success('Photos rejected');
      setRejectingItem(null);
      setRejectReason('');
      fetchPendingPhotos();
    } catch (error) {
      toast.error('Failed to reject photos');
    }
  };

  const handleDeleteIndividualPhoto = async (profileId, photoIndex) => {
    const result = await Swal.fire({
      title: 'Remove Photo',
      text: 'Permanently remove this photo from user profile?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, Delete',
      background: '#0f172a',
      color: '#f8fafc',
    });

    if (result.isConfirmed) {
      try {
        await adminVerificationService.deleteUserPhoto(profileId, photoIndex);
        toast.success('Photo removed');
        fetchPendingPhotos();
      } catch (err) {
        toast.error('Failed to delete photo');
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ImageIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Photo Moderation Desk</h2>
            <p className="text-xs text-slate-400">Ensure profile pictures follow community standards and modesty guidelines</p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold text-xs self-start sm:self-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
          <span>{totalElements} Profiles Awaiting Photo Review</span>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <LoadingSpinner text="Scanning pending photograph uploads..." />
      ) : photoProfiles.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No Flagged or Pending Photos"
          message="All candidate photographs have been moderated and approved."
        />
      ) : (
        <div className="space-y-6">
          {photoProfiles.map((item) => {
            const photos = item.photos || item.photoUrls || (item.profilePic ? [item.profilePic] : []);
            const fullName = `${item.firstName || ''} ${item.lastName || ''}`.trim() || item.name || 'Candidate';

            return (
              <div key={item.id} className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800">
                {/* Candidate Info Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-rose-400 font-bold">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{fullName}</h4>
                      <p className="text-xs text-slate-400">Profile #{item.id} • {item.gender} • {item.city || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRejectingItem(item)}
                      className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <XCircle size={14} />
                      <span>Reject All</span>
                    </button>
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 size={14} />
                      <span>Approve Photos</span>
                    </button>
                  </div>
                </div>

                {/* Photo Thumbnails Gallery */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {photos.map((photoUrl, idx) => (
                    <div key={idx} className="relative group rounded-2xl overflow-hidden border border-slate-800 aspect-square bg-slate-900">
                      <img
                        src={photoUrl}
                        alt={`Candidate Photo #${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => setPreviewPhoto(photoUrl)}
                          className="p-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                          title="Zoom"
                        >
                          <ZoomIn size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteIndividualPhoto(item.id, idx)}
                          className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      <Modal
        isOpen={!!rejectingItem}
        onClose={() => {
          setRejectingItem(null);
          setRejectReason('');
        }}
        title="Reject Uploaded Photographs"
        subtitle={`Flagging media for ${rejectingItem?.firstName || 'Candidate'}`}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Rejection Reason</label>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Faces are obscured, watermark detected, group picture..."
              className="w-full p-3 rounded-xl glass-input text-xs font-medium"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setRejectingItem(null);
                setRejectReason('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>

      {/* Zoom Modal */}
      {previewPhoto && (
        <div 
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <img src={previewPhoto} alt="Zoom" className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl border border-slate-700 shadow-2xl" />
        </div>
      )}
    </div>
  );
};

export default PhotoModeration;
