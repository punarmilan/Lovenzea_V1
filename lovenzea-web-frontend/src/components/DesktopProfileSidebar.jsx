import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Edit, Camera, CheckCircle, X, User as UserIcon, Phone, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import heic2any from 'heic2any';
import Notifications from './Notification';
import { useSelector, useDispatch } from 'react-redux';
import { uploadProfilePhoto, uploadIdProof } from '../Slice/ProfileSlice';
import { fetchDashboardSummary } from '../Slice/DashboardSlice';

const DesktopProfileSidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { summary } = useSelector((state) => state.dashboard);
    const { loading: profileLoading } = useSelector((state) => state.profile);
    const { subscriptionDetails } = useSelector((state) => state.user);
    const user = summary?.user;
    const isPremium = subscriptionDetails?.active || user?.isPremium;

    const [isVerificationOpen, setIsVerificationOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [panNumber, setPanNumber] = useState('');
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [showVerifiedTooltip, setShowVerifiedTooltip] = useState(false);
    const [idProofFile, setIdProofFile] = useState(null);
    const fileInputRef = useRef(null);
    const idProofInputRef = useRef(null);
    const tooltipRef = useRef(null);

    // Handle click outside to close tooltip
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
                setShowVerifiedTooltip(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        } catch (error) {
            toast.error(error || 'Failed to upload photo');
            setPhotoPreview(null); // Revert on failure
        }

        setShowFileUpload(false);
    };

    const handleIdProofFileChange = async (e) => {
        let file = e.target.files[0];
        if (!file) return;

        // Handle HEIC/HEIF conversion (ID Proofs can be images)
        const isHeic = file.name.toLowerCase().endsWith('.heic') || 
                       file.name.toLowerCase().endsWith('.heif') || 
                       file.type === 'image/heic' || 
                       file.type === 'image/heif';

        if (isHeic) {
            const loadingToast = toast.loading(`Converting HEIC document...`);
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
                toast.success('Document converted!', { id: loadingToast });
            } catch (err) {
                console.error("HEIC conversion error:", err);
                toast.error('Failed to convert HEIC document.', { id: loadingToast });
                return;
            }
        }

        setIdProofFile(file);
    };

    const removeFile = (index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Handle profile actions
    const handleEditProfile = () => {
        navigate('/my-shadi/my-profile', { state: { openSection: 'person' } });
    };

    const handleUpgrade = () => {
        navigate('/payment/');
    };

    const handleGetBlueTick = () => {
        setIsVerificationOpen(true);
    };

    const handleVerify = async () => {
        const validTypes = ['PAN Card', 'Aadhar Card', 'Driving License', 'Voter ID', 'Passport'];
        if (!selectedDoc || !validTypes.includes(selectedDoc)) {
            toast.error('Please select a valid document type');
            return;
        }
        if (!panNumber) {
            toast.error(`Please enter ${selectedDoc} number`);
            return;
        }

        const idNum = panNumber.trim().toUpperCase();
        
        // Validation logic
        if (selectedDoc === 'PAN Card' && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(idNum)) {
            toast.error('Invalid PAN format (e.g., ABCDE1234F)');
            return;
        }
        if (selectedDoc === 'Aadhar Card' && !/^[2-9]{1}[0-9]{11}$/.test(idNum)) {
            toast.error('Invalid Aadhaar format (12 digits, cannot start with 0 or 1)');
            return;
        }
        if (selectedDoc === 'Driving License' && !/^[A-Z]{2}[0-9]{2}[0-9]{11}$/.test(idNum) && !/^[A-Z]{2}[0-9]{13}$/.test(idNum)) {
            toast.error('Invalid Driving License format (15 characters)');
            return;
        }
        if (selectedDoc === 'Voter ID' && !/^[A-Z]{3}[0-9]{7}$/.test(idNum)) {
            toast.error('Invalid Voter ID format (e.g., ABC1234567)');
            return;
        }
        if (selectedDoc === 'Passport' && !/^[A-Z]{1}[0-9]{7}$/.test(idNum)) {
            toast.error('Invalid Passport format (e.g., A1234567)');
            return;
        }

        if (!idProofFile) {
            toast.error('Please upload your ID document image');
            return;
        }

        try {
            await dispatch(uploadIdProof({
                file: idProofFile,
                idProofType: selectedDoc,
                idProofNumber: idNum
            })).unwrap();

            toast.success('Verification submitted successfully!');
            setIsVerificationOpen(false);
            setPanNumber('');
            setIdProofFile(null);
            dispatch(fetchDashboardSummary());
        } catch (error) {
            toast.error(error || 'Failed to submit verification');
        }
    };

    return (
        <div className='hidden lg:block'>
            <aside className="w-full bg-theme-surface min-h-screen p-6 border-r">
                {/* Profile Section */}
                <div className="mb-8 bg-amber-300">
                    <div className="bg-theme-surface p-4 rounded">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                                    {photoPreview || user?.profilePhotoUrl ? (
                                        <img
                                            src={photoPreview || user?.profilePhotoUrl}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <UserIcon size={40} className="text-gray-400" />
                                    )}
                                </div>
                                <button
                                    onClick={handleAddPicture}
                                    className="absolute bottom-0 right-0 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-rose-600 transition-colors"
                                >
                                    <Camera size={16} className='cursor-pointer' />
                                </button>
                            </div>

                            {/* Profile IDs */}
                            <div>
                                <div className="font-bold  text-gray-800 mb-1">{user?.profileId || 'PM00000000'}</div>
                                <div className="font-bold  text-gray-800 mb-1">{user?.fullName || 'User'}</div>
                                <div className="text-sm text-theme-text-secondary mb-2 flex items-center gap-1">
                                    <Phone size={14} /> {user?.mobileNumber || 'No Number'}
                                </div>
                                <button
                                    onClick={handleEditProfile}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                                >
                                    <Edit size={16} className='cursor-pointer' />
                                    {/* Edit Profile */}
                                </button>
                            </div>
                        </div>


                    </div>

                    {/* Account Type */}
                    <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl border mb-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4 gap-2">
                            <span className="text-gray-700 font-medium">Account Type</span>
                            <span className="font-bold text-rose-500">{isPremium ? 'Premium Membership' : 'Free Membership'}</span>
                        </div>
                        {!isPremium && (
                            <button
                                onClick={handleUpgrade}
                                className="w-full bg-gradient-to-r cursor-pointer from-rose-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 mb-4"
                            >
                                Upgrade
                            </button>
                        )}
                        <p className="text-sm text-gray-700 flex items-center">
                            {user?.verificationStatus === 'VERIFIED' ? (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                                    <span className="font-medium text-emerald-600">Profile Verified</span>
                                </>
                            ) : (
                                <>
                                    <Shield className="w-4 h-4 mr-2 text-blue-500" />
                                    Standout with Verification
                                    <button
                                        onClick={handleGetBlueTick}
                                        className="ml-2 text-blue-600 font-medium hover:text-blue-700 cursor-pointer"
                                    >
                                        Get Blue Tick
                                    </button>
                                </>
                            )}
                        </p>
                    </div>

                    {/* Blue Tick Verification */}
                    {user?.verificationStatus === 'VERIFIED' ? (
                        <div className="bg-theme-surface p-5 rounded-2xl border border-gray-100 mb-6 shadow-sm relative">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">Blue Tick Verified</h3>
                                    <p className="text-theme-text-secondary text-sm">Valid till 11-Jan-27</p>
                                </div>
                                <div className="relative" ref={tooltipRef}>
                                    <button
                                        onClick={() => setShowVerifiedTooltip(!showVerifiedTooltip)}
                                        className="focus:outline-none"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-cyan-500 fill-current">
                                            <path d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
                                        </svg>
                                    </button>

                                    {showVerifiedTooltip && (
                                        <div className="absolute right-0 top-10 w-64 bg-[#1a1a1b] text-white p-4 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
                                            {/* Tooltip Arrow */}
                                            <div className="absolute -top-2 right-3 w-4 h-4 bg-[#1a1a1b] rotate-45"></div>

                                            <h4 className="font-bold text-lg mb-4">Verified Profile</h4>

                                            <div className="space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1 w-4 h-4 rounded-full border border-green-500 flex items-center justify-center flex-shrink-0">
                                                        <CheckCircle size={12} className="text-green-500" />
                                                    </div>
                                                    <p className="text-sm font-medium leading-tight">Selfie verified with Profile Photo</p>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <div className={`mt-1 w-4 h-4 rounded-full border ${user?.mobileVerified ? 'border-green-500' : 'border-gray-500'} flex items-center justify-center flex-shrink-0`}>
                                                        <CheckCircle size={12} className={user?.mobileVerified ? "text-green-500" : "text-gray-400"} />
                                                    </div>
                                                    <p className={`text-sm font-medium leading-tight ${user?.mobileVerified ? 'text-white' : 'text-gray-400'}`}>Mobile no. is {user?.mobileVerified ? 'verified' : 'not verified'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : user?.verificationStatus === 'PENDING' ? (
                        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-5 rounded-2xl border border-orange-100 mb-6 shadow-sm">
                            <div className="flex items-center mb-3">
                                <Clock className="w-6 h-6 text-orange-500 mr-2" />
                                <h3 className="font-bold text-lg text-orange-800">Verification Pending</h3>
                            </div>
                            <p className="text-orange-700 mb-2 font-medium">We're reviewing your documents</p>
                            <p className="text-orange-600 text-xs italic">This usually takes 24-48 hours. We'll notify you once verified!</p>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-2xl border border-blue-100 mb-6 shadow-sm">
                            <div className="flex items-center mb-3">
                                <Shield className="w-6 h-6 text-blue-500 mr-2" />
                                <h3 className="font-bold text-lg cursor-pointer">Blue Tick Verification</h3>
                            </div>
                            <p className="text-theme-text-secondary mb-4 cursor-pointer">Verify your profile with Govt. ID</p>
                            <button
                                onClick={handleGetBlueTick}
                                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                            >
                                Get Blue Tick
                            </button>
                        </div>
                    )}

                    {/* Notifications Section - Added here */}
                    <div className="mb-6">
                        <Notifications />
                    </div>

                    {/* Uploaded Files Preview */}
                    {uploadedFiles.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-medium text-gray-700 mb-3">Uploaded Photos</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Upload ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg"
                                        />
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Desktop File Upload Modal */}
            {showFileUpload && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
                    <div className="bg-theme-surface rounded-2xl p-8 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-2xl">Add Photos</h3>
                            <button
                                onClick={() => setShowFileUpload(false)}
                                className="text-theme-text-secondary hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center mb-6">
                            <p className="text-theme-text-secondary mb-4">Select photos to upload</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*,.heic,.heif"
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="bg-rose-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-rose-600 transition-colors"
                            >
                                Choose Photos
                            </button>
                        </div>

                        {uploadedFiles.length > 0 && (
                            <div>
                                <h4 className="font-medium mb-4">Selected Files:</h4>
                                <div className="max-h-60 overflow-y-auto space-y-2">
                                    {uploadedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                            <span className="text-sm truncate">{file.name}</span>
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Desktop Verification Modal */}
            {isVerificationOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4">
                    <div className="bg-theme-surface rounded-2xl p-5 sm:p-6 w-full max-w-lg shadow-2xl relative overflow-y-auto max-h-[95vh]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-xl sm:text-2xl">Verify your Profile</h3>
                            <button
                                onClick={() => setIsVerificationOpen(false)}
                                className="text-theme-text-secondary hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <p className="text-theme-text-secondary mb-4 text-sm sm:text-base">
                            Verification is important to ensure safety and establish authenticity of your Profile.
                        </p>

                        {/* Document Selection */}
                        <div className="space-y-2 mb-4">
                            {[
                                { id: 'PAN Card', label: 'PAN Card' },
                                { id: 'Aadhar Card', label: 'Aadhar Card' },
                                { id: 'Driving License', label: 'Driving License' },
                                { id: 'Voter ID', label: 'Voter ID' },
                                { id: 'Passport', label: 'Passport' }
                            ].map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100"
                                    onClick={() => setSelectedDoc(doc.id)}
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedDoc === doc.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                                        {selectedDoc === doc.id && <CheckCircle size={16} className="text-white" />}
                                    </div>
                                    <span className="flex-1 font-medium text-gray-700">
                                        {doc.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {selectedDoc && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Your {selectedDoc} number
                                </label>
                                <input
                                    type="text"
                                    value={panNumber}
                                    onChange={(e) => setPanNumber(e.target.value)}
                                    placeholder={`Enter ${selectedDoc} number`}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                />
                            </div>
                        )}

                        {/* File Upload for ID Proof */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Upload Document (Image or PDF)
                            </label>
                            <input
                                type="file"
                                ref={idProofInputRef}
                                onChange={handleIdProofFileChange}
                                accept="image/*,application/pdf,.heic,.heif"
                                className="hidden"
                            />
                             <div
                                onClick={() => idProofInputRef.current.click()}
                                className={`border-2 border-dashed rounded-xl p-2.5 text-center cursor-pointer transition-colors ${idProofFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400'}`}
                            >
                                {idProofFile ? (
                                    <div className="text-green-600 font-medium truncate">
                                        <CheckCircle size={16} className="inline mr-2" />
                                        {idProofFile.name}
                                    </div>
                                ) : (
                                    <div className="text-theme-text-secondary">
                                        Click to select file
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-gray-100 my-4"></div>

                        <button
                            onClick={handleVerify}
                            disabled={profileLoading}
                            className="w-full bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold text-base hover:from-blue-600 hover:to-blue-700 transition-all shadow-md disabled:opacity-50"
                        >
                            {profileLoading ? 'Submitting...' : 'Verify'}
                        </button>

                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-500" />
                                <p className="text-sm text-blue-700">
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

export default DesktopProfileSidebar;