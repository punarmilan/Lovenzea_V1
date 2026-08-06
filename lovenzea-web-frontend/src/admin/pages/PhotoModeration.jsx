import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import adminVerificationService from '../services/adminVerificationService';
import { Check, X, Image, Info, Eye, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PhotoModerationCard = ({ profile, onApprove, onReject }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const photos = [
        profile.profilePhotoUrl,
        profile.photoUrl2,
        profile.photoUrl3,
        profile.photoUrl4,
        profile.photoUrl5,
        profile.photoUrl6
    ].filter(Boolean);

    const nextPhoto = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    };

    const prevPhoto = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    const handleRejectSubmit = () => {
        onReject(profile.id, rejectReason);
        setIsRejecting(false);
        setRejectReason('');
    };

    const handleDeletePhoto = async (e) => {
        e.stopPropagation();
        if ((await Swal.fire({ title: 'Are you sure?', text: 'Are you sure you want to delete this specific photo?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#8C6D39', cancelButtonColor: '#d33', confirmButtonText: 'Yes' }).then(r => r.isConfirmed))) {
            try {
                // Determine the correct index in the original profile object
                const originalPhotoFields = [
                    'profilePhotoUrl',
                    'photoUrl2',
                    'photoUrl3',
                    'photoUrl4',
                    'photoUrl5',
                    'photoUrl6'
                ];

                // Find which field the current photo belongs to
                const currentPhotoUrl = photos[currentIndex];
                const originalIndex = originalPhotoFields.findIndex(field => profile[field] === currentPhotoUrl);

                if (originalIndex !== -1) {
                    await adminVerificationService.deleteUserPhoto(profile.id, originalIndex);
                    toast.success('Photo deleted successfully');

                    // Update local photos array immediately for smooth UI
                    const newPhotos = [...photos];
                    newPhotos.splice(currentIndex, 1);

                    if (newPhotos.length === 0) {
                        // If no photos left, the card will naturally be empty or we can trigger refresh
                        onApprove(profile.id); // Or some other way to remove the card
                    } else {
                        // Adjust index if we deleted the last one
                        if (currentIndex >= newPhotos.length) {
                            setCurrentIndex(newPhotos.length - 1);
                        }
                        // We still need to refresh the global state to be safe
                        // but local update makes it feel instant
                        window.location.reload(); // Quickest way to refresh since we replaced the whole album logic
                    }
                }
            } catch (error) {
                toast.error('Failed to delete photo');
            }
        }
    };

    return (
        <div className="bg-theme-surface rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full group">
            {/* Header */}
            <div className="p-4 border-b border-gray-50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 font-bold border border-pink-50 text-sm">
                        {profile.fullName?.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800 line-clamp-1">{profile.fullName}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{profile.profileId}</p>
                    </div>
                </div>
                <div className="text-[10px] bg-amber-50 text-amber-600 px-2 py-1 rounded-lg font-black uppercase whitespace-nowrap">
                    {photos.length} Photo{photos.length > 1 ? 's' : ''}
                </div>
            </div>

            {/* Photo Swap View */}
            <div className="relative aspect-[4/5] bg-gray-900 overflow-hidden group/image">
                <img
                    src={photos[currentIndex]}
                    alt="Moderation"
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={() => window.open(photos[currentIndex], '_blank')}
                />

                {photos.length > 1 && (
                    <>
                        {/* Navigation Arrows */}
                        <button
                            onClick={prevPhoto}
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-theme-surface/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-theme-surface/40 transition-colors"
                        >
                            <span className="sr-only">Previous</span>
                            <div className="border-l-2 border-t-2 border-white h-2.5 w-2.5 -rotate-45 ml-1"></div>
                        </button>
                        <button
                            onClick={nextPhoto}
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-theme-surface/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-theme-surface/40 transition-colors"
                        >
                            <span className="sr-only">Next</span>
                            <div className="border-r-2 border-t-2 border-white h-2.5 w-2.5 rotate-45 mr-1"></div>
                        </button>

                        {/* Indicators */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                            {photos.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1 rounded-full transition-all ${i === currentIndex ? 'w-6 bg-pink-500' : 'w-2 bg-theme-surface/40'}`}
                                />
                            ))}
                        </div>
                    </>
                )}

                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                        onClick={handleDeletePhoto}
                        className="bg-rose-500/80 backdrop-blur-md p-2 rounded-lg text-white hover:bg-rose-600 transition-colors shadow-lg"
                        title="Delete this photo"
                    >
                        <Trash2 size={14} />
                    </button>
                    <div className="bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white font-bold pointer-events-none flex items-center">
                        {currentIndex + 1} / {photos.length}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-theme-surface space-y-3 mt-auto shrink-0">
                {isRejecting ? (
                    <div className="animate-in slide-in-from-bottom duration-300">
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Reason for rejection..."
                            className="w-full px-4 py-2 border border-rose-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none mb-2 min-h-[60px]"
                        />
                        <div className="flex gap-2">
                            <button onClick={handleRejectSubmit} className="flex-1 bg-rose-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors">Confirm Reject</button>
                            <button onClick={() => setIsRejecting(false)} className="px-4 py-2 bg-gray-100 text-theme-text-secondary rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors">Back</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onApprove(profile.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-2xl font-bold text-xs hover:bg-emerald-600 shadow-lg shadow-emerald-50 active:scale-95 transition-all"
                        >
                            <Check size={16} /> Approve All
                        </button>
                        <button
                            onClick={() => setIsRejecting(true)}
                            className="flex-1 flex items-center justify-center gap-2 bg-rose-50 border border-rose-100 text-rose-500 py-3 rounded-2xl font-bold text-xs hover:bg-rose-100 active:scale-95 transition-all"
                        >
                            <X size={16} /> Reject Album
                        </button>
                    </div>
                )}
                <p className="text-[9px] text-gray-400 text-center font-medium">
                    <Info size={10} className="inline mr-1" /> Use Swap buttons to review multiple photos.
                </p>
            </div>
        </div>
    );
};

const PhotoModeration = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(12); // Slightly larger grid for desktop
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        fetchPendingPhotos();
    }, [page, size]);

    const fetchPendingPhotos = async () => {
        setLoading(true);
        try {
            const data = await adminVerificationService.getPendingPhotos({ page, size });
            setProfiles(data.content || []);
            setTotalElements(data.totalElements || 0);
        } catch (error) {
            toast.error('Failed to load pending photos');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await adminVerificationService.approvePhotos(id);
            toast.success('Photos approved successfully');
            fetchPendingPhotos();
        } catch (error) {
            toast.error('Approval failed');
        }
    };

    const handleReject = async (id, reason) => {
        if (!reason) {
            toast.error('Please provide a reason for rejection');
            return;
        }
        try {
            await adminVerificationService.rejectPhotos(id, reason);
            toast.success('Photos rejected');
            fetchPendingPhotos();
        } catch (error) {
            toast.error('Rejection failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-theme-surface p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">Photo Moderation</h2>
                    <p className="text-xs sm:text-sm text-theme-text-secondary font-medium italic sm:not-italic">Review and swap user photos for batch approval</p>
                </div>
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-pink-50 text-pink-700 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap">
                    {totalElements} Users
                </div>
            </div>

            {loading ? (
                <div className="p-6 sm:p-10 text-center text-gray-400 font-medium">Loading photos...</div>
            ) : profiles.length === 0 ? (
                <div className="bg-theme-surface p-8 sm:p-12 rounded-2xl sm:rounded-3xl border-2 border-dashed border-theme-border flex flex-col items-center justify-center text-gray-400">
                    <Image size={40} className="mb-4 opacity-20 sm:size-48" />
                    <p className="font-bold text-sm sm:text-base">No photos pending review!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {profiles.map((profile) => (
                        <PhotoModerationCard
                            key={profile.id}
                            profile={profile}
                            onApprove={handleApprove}
                            onReject={handleReject}
                        />
                    ))}
                </div>
            )}

            {/* Pagination placeholder */}
            {totalElements > size && (
                <div className="flex justify-center gap-2 mt-6">
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

export default PhotoModeration;
