import React, { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Shield, Camera, CheckCircle, X, Upload, User as UserIcon, Phone } from 'lucide-react';
import heic2any from 'heic2any';
import { useSelector, useDispatch } from 'react-redux';
import { uploadProfilePhoto } from '../Slice/ProfileSlice';
import { fetchDashboardSummary } from '../Slice/DashboardSlice';
import toast from 'react-hot-toast';

const MobileProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { summary } = useSelector((state) => state.dashboard);
    const user = summary?.user;

    const [isVerificationOpen, setIsVerificationOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState('driving');
    const [panNumber, setPanNumber] = useState('');
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [photoPreview, setPhotoPreview] = useState(null);
    const fileInputRef = useRef(null);

    // Handle profile picture upload
    const handleAddPicture = () => {
        setShowFileUpload(true);
    };

    const handleFileChange = async (e) => {
        let file = e.target.files[0];
        if (!file) return;

        // Handle HEIC/HEIF conversion
        const isHeic = file.name.toLowerCase().endsWith('.heic') || 
                       file.name.toLowerCase().endsWith('.heif') || 
                       file.type === 'image/heic' || 
                       file.type === 'image/heif';

        if (isHeic) {
            const loadingToast = toast.loading(`Converting HEIC image...`);
            try {
                const blob = await heic2any({
                    blob: file,
                    toType: 'image/jpeg',
                    quality: 0.8
                });
                
                const newFileName = file.name.replace(/\.[^/.]+$/, ".jpg");
                file = new File([Array.isArray(blob) ? blob[0] : blob], newFileName, {
                    type: 'image/jpeg',
                    lastModified: new Date().getTime()
                });
                toast.success('Conversion successful!', { id: loadingToast });
            } catch (err) {
                console.error("HEIC conversion error:", err);
                toast.error('Failed to convert HEIC image. Please use JPG/PNG.', { id: loadingToast });
                return;
            }
        }

        // 1. Show immediate preview
        const reader = new FileReader();
        reader.onload = (event) => {
            setPhotoPreview(event.target.result);
        };
        reader.readAsDataURL(file);

        // 2. Upload to backend
        try {
            await dispatch(uploadProfilePhoto({ file, photoIndex: 0 })).unwrap();
            toast.success('Profile photo updated!');
            // 3. Refresh summary to get permanent URL
            dispatch(fetchDashboardSummary());
        } catch (error) {
            toast.error(error || 'Failed to upload photo');
            setPhotoPreview(null);
        }

        setShowFileUpload(false);
    };

    const removeFile = (index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Handle profile actions
    const handleEditProfile = () => {
        navigate('/my-profile/basic-details');
    };

    const handleUpgrade = () => {
        navigate('/payment');
    };

    const handleGetBlueTick = () => {
        setIsVerificationOpen(true);
    };

    const handleVerify = () => {
        // Handle verification logic
        Swal.fire({ text: 'Verification submitted!', confirmButtonColor: '#8C6D39' });
        setIsVerificationOpen(false);
        setPanNumber('');
    };

    return (
        <div className="w-full px-2 xs:px-3 sm:px-4 md:px-0">
            {/* Blue Tick Verification Banner */}
            {user?.verificationStatus === 'VERIFIED' || user?.isVerified ? (
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg sm:rounded-xl p-3 xs:p-4 mb-3 xs:mb-4 shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="bg-theme-surface/20 p-2 rounded-full">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-base xs:text-lg">Profile Verified</p>
                            <p className="text-xs xs:text-sm opacity-90">Your account is fully verified</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl p-3 xs:p-4 mb-3 xs:mb-4 shadow-lg">
                    <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0">
                        <div className="flex-1">
                            <p className="font-bold text-base xs:text-lg">Stand out with Verification</p>
                            <p className="text-xs xs:text-sm opacity-90">Get Blue Tick now</p>
                        </div>
                        <button
                            onClick={handleGetBlueTick}
                            className="bg-theme-surface text-blue-600 px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg font-bold text-xs xs:text-sm hover:bg-theme-surface/90 active:bg-theme-surface/80 transition-colors whitespace-nowrap"
                        >
                            Get Now
                        </button>
                    </div>
                </div>
            )}

            {/* Profile Card */}
            <div className="bg-theme-surface rounded-lg sm:rounded-xl shadow-md sm:shadow-lg border border-gray-100 p-3 xs:p-4 sm:p-6 mb-4 xs:mb-6">
                {/* Profile Header */}
                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4 mb-4 xs:mb-6">
                    <div className="flex items-center gap-3 xs:gap-4 w-full xs:w-auto">
                        <div className="relative flex-shrink-0">
                            <div className="w-16 h-16 xs:w-20 xs:h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                                {photoPreview || user?.profilePhotoUrl?.url ? (
                                    <img
                                        src={photoPreview || user?.profilePhotoUrl?.url}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <UserIcon size={32} className="text-gray-400" />
                                )}
                            </div>
                            {/* Upload Button */}
                            <button
                                onClick={handleAddPicture}
                                className="absolute bottom-0 right-0 w-7 h-7 xs:w-8 xs:h-8 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-rose-600 active:scale-95 transition-all"
                            >
                                <Camera size={14} className="xs:w-4 xs:h-4" />
                            </button>
                        </div>

                        {/* Profile Info */}
                        <div className="flex flex-col flex-1 min-w-0">
                            <div className="mb-1 xs:mb-2">
                                <h1 className="font-bold text-lg xs:text-xl text-gray-900 truncate">{user?.fullName || 'User'}</h1>
                                <p className="text-xs xs:text-sm text-theme-text-secondary">ID: {user?.profileId || 'PM00000000'}</p>
                                <p className="text-xs xs:text-sm text-theme-text-secondary flex items-center gap-1">
                                    <Phone size={12} /> {user?.mobileNumber || 'No Number'}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 xs:gap-2 text-xs xs:text-sm">
                                <span className="text-theme-text-secondary">Account - {user?.isPremium ? 'Premium' : 'Free'}</span>
                                <span className="text-gray-400 hidden xs:inline">•</span>
                                <button
                                    onClick={handleEditProfile}
                                    className="text-blue-600 font-medium hover:text-blue-700 active:text-blue-800"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Upgrade Button - Hidden on smallest screens, shown on xs+ */}
                    <div className="w-full xs:w-auto">
                        <button
                            onClick={handleUpgrade}
                            className="w-full xs:w-auto bg-gradient-to-r from-rose-500 to-rose-600 text-white px-3 xs:px-4 py-2 xs:py-3 rounded-lg xs:rounded-xl font-bold text-xs xs:text-sm shadow-sm hover:from-rose-600 hover:to-rose-700 active:scale-95 transition-all whitespace-nowrap"
                        >
                            Upgrade now
                        </button>
                    </div>
                </div>

                {/* Account Details Grid */}
                <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
                    <div className="bg-gray-50 p-3 xs:p-4 rounded-lg">
                        <p className="text-[10px] xs:text-xs sm:text-sm text-theme-text-secondary mb-0.5 xs:mb-1">Account Type</p>
                        <p className="font-bold text-xs xs:text-sm sm:text-base text-rose-500">Free Membership</p>
                    </div>
                    <div className="bg-gray-50 p-3 xs:p-4 rounded-lg">
                        <p className="text-[10px] xs:text-xs sm:text-sm text-theme-text-secondary mb-0.5 xs:mb-1">Status</p>
                        <div className="flex items-center gap-1.5 xs:gap-2">
                            <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-theme-success rounded-full"></div>
                            <p className="font-bold text-xs xs:text-sm sm:text-base text-gray-800">Active</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* File Upload Modal */}
            {showFileUpload && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 xs:p-4">
                    <div className="bg-theme-surface rounded-xl xs:rounded-2xl p-4 xs:p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-3 xs:mb-4">
                            <h3 className="font-bold text-lg xs:text-xl">Add Photos</h3>
                            <button
                                onClick={() => setShowFileUpload(false)}
                                className="text-theme-text-secondary hover:text-gray-700 p-1"
                            >
                                <X size={20} className="xs:w-6 xs:h-6" />
                            </button>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 xs:p-8 text-center mb-3 xs:mb-4">
                            <Upload className="w-10 h-10 xs:w-12 xs:h-12 text-gray-400 mx-auto mb-3 xs:mb-4" />
                            <p className="text-sm xs:text-base text-theme-text-secondary mb-2">Drag & drop photos here</p>
                            <p className="text-xs xs:text-sm text-theme-text-secondary mb-3 xs:mb-4">or</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*,.heic,.heif"
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="bg-rose-500 text-white px-4 xs:px-6 py-2 xs:py-3 rounded-lg font-medium text-sm xs:text-base hover:bg-rose-600 active:scale-95 transition-all"
                            >
                                Browse Files
                            </button>
                        </div>

                        {uploadedFiles.length > 0 && (
                            <div className="mt-3 xs:mt-4">
                                <h4 className="font-medium text-sm xs:text-base mb-2">Uploaded Files:</h4>
                                <div className="space-y-2">
                                    {uploadedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 xs:p-3 rounded-lg">
                                            <span className="text-xs xs:text-sm truncate">{file.name}</span>
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                            >
                                                <X size={14} className="xs:w-4 xs:h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Verification Modal */}
            {isVerificationOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 xs:p-4">
                    <div className="bg-theme-surface rounded-xl xs:rounded-2xl p-4 xs:p-5 w-full max-w-md max-h-[95vh] overflow-y-auto relative shadow-2xl">
                        <div className="flex justify-between items-center mb-3 xs:mb-4">
                            <h3 className="font-bold text-lg xs:text-xl">Verify your Profile</h3>
                            <button
                                onClick={() => setIsVerificationOpen(false)}
                                className="text-theme-text-secondary hover:text-gray-700 p-1"
                            >
                                <X size={20} className="xs:w-6 xs:h-6" />
                            </button>
                        </div>

                        <p className="text-xs xs:text-sm text-theme-text-secondary mb-3 xs:mb-4">
                            Verification is important to ensure safety and establish authenticity of your Profile.
                        </p>

                        {/* Document Selection */}
                        <div className="space-y-2 xs:space-y-3 mb-4">
                            {[
                                { id: 'pan', label: 'PAN card', checked: selectedDoc === 'pan' },
                                { id: 'driving', label: 'Driving license', checked: selectedDoc === 'driving' },
                                { id: 'voter', label: 'Voter ID', checked: selectedDoc === 'voter' }
                            ].map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center gap-2 xs:gap-3 cursor-pointer"
                                    onClick={() => setSelectedDoc(doc.id)}
                                >
                                    <div className={`w-5 h-5 xs:w-6 xs:h-6 rounded-full border-2 flex items-center justify-center ${doc.checked ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                                        {doc.checked && <CheckCircle size={14} className="xs:w-4 xs:h-4 text-white" />}
                                    </div>
                                    <label className="flex-1 cursor-pointer text-sm xs:text-base">
                                        {doc.label}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* PAN Number Input (if PAN selected) */}
                        {selectedDoc === 'pan' && (
                            <div className="mb-4 xs:mb-6">
                                <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-2">
                                    Your PAN Card number
                                </label>
                                <input
                                    type="text"
                                    value={panNumber}
                                    onChange={(e) => setPanNumber(e.target.value)}
                                    placeholder="Enter PAN number"
                                    className="w-full px-3 xs:px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        )}

                        {/* Divider */}
                        <div className="border-t border-gray-100 my-4"></div>

                        {/* Verify Button */}
                        <button
                            onClick={handleVerify}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold text-base hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all shadow-md"
                        >
                            Verify
                        </button>

                        {/* Safety Note */}
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-start xs:items-center gap-2">
                                <Shield className="w-4 h-4 xs:w-5 xs:h-5 text-blue-500 flex-shrink-0" />
                                <p className="text-xs xs:text-sm text-blue-700">
                                    Your details will NOT BE stored or shown anywhere.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileProfile;
