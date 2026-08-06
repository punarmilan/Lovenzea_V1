import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Upload, Heart, UserPlus, MapPin, Save, HelpCircle, X, Check, Shield, Users, Camera, Trash2, Edit3, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyProfile, updateProfile, uploadProfilePhoto, deleteProfilePhoto } from '../../../Slice/ProfileSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import heic2any from 'heic2any';
import { motion, AnimatePresence } from 'framer-motion';

// Import fallback images in case no photo is present (optional, or just use placeholders)
import close from '../../../assets/image/closejpg.jpg'
import full from '../../../assets/image/full-view.jpg'
import blur from '../../../assets/image/blur-face.jpg'
import group from '../../../assets/image/group-img.jpg'
import side from '../../../assets/image/side-face.jpg'
const water = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60";

export default function MyShadiPhotoSection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  // Redux State
  const { profile, loading, error } = useSelector((state) => state.profile);

  // Local State
  const [activeTab, setActiveTab] = useState('photo');
  const [showGuidelines, setShowGuidelines] = useState(false);

  // These will be populated from Redux
  const [albumPhotos, setAlbumPhotos] = useState(Array(6).fill(null)); 
  const [optimisticPhotos, setOptimisticPhotos] = useState({}); // mapping index to url/loading
  
  // Settings State
  const [profilePhotoVisibility, setProfilePhotoVisibility] = useState('ALL_MEMBERS');
  const [albumVisibility, setAlbumVisibility] = useState('LIKED_AND_PREMIUM');

  // Fetch Profile on Mount
  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  // Sync Redux Profile Data to Local State
  useEffect(() => {
    if (profile) {
      setProfilePhotoVisibility(profile.profilePhotoVisibility || 'ALL_MEMBERS');
      setAlbumVisibility(profile.albumPhotoVisibility || 'LIKED_AND_PREMIUM');

      // Update 6-slot array
      const photos = [
        profile.profilePhotoUrl || null,
        profile.photoUrl2 || null,
        profile.photoUrl3 || null,
        profile.photoUrl4 || null,
        profile.photoUrl5 || null,
        profile.photoUrl6 || null
      ];
      setAlbumPhotos(photos);
    }
  }, [profile]);

  const acceptablePhotos = [
    { src: [close], label: "Close Up" },
    { src: [full], label: "Full View" }
  ];

  const unacceptablePhotos = [
    { src: [side], label: "Side Face", transform: "-rotate-12" },
    { src: [blur], label: "Blur", blur: true },
    { src: [group], label: "Group" },
    { src: [water], label: "Watermark", watermark: true }
  ];

  const handleFileUpload = async (e, targetIndex = -1) => {
    const files = Array.from(e.target.files);
    if(files.length === 0) return;

    // Reset input
    e.target.value = '';

    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      // Handle HEIC/HEIF conversion
      const isHeic = file.name.toLowerCase().endsWith('.heic') || 
                     file.name.toLowerCase().endsWith('.heif') || 
                     file.type === 'image/heic' || 
                     file.type === 'image/heif';

      if (isHeic) {
        const convertingToast = toast.loading(`Converting HEIC image: ${file.name}...`);
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
          
          toast.update(convertingToast, { render: 'Conversion successful!', type: 'success', isLoading: false, autoClose: 2000 });
        } catch (err) {
          console.error("HEIC conversion error:", err);
          toast.update(convertingToast, { render: `Failed to convert HEIC: ${file.name}. Please upload a JPG/PNG instead.`, type: 'error', isLoading: false, autoClose: 4000 });
          continue;
        }
      }

      if (file.size > 15 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (>15MB)`);
        continue;
      }

      // Determine next available index if targetIndex is -1
      let uploadIndex = targetIndex;
      if (uploadIndex === -1) {
        // Find empty slot strictly from album (index 1 to 5) so we don't accidentally overwrite main photo (index 0)
        uploadIndex = albumPhotos.findIndex((p, idx) => p === null && idx > 0);
        if (uploadIndex === -1) {
          toast.error(`You have reached the maximum of 5 album photos.`);
          return;
        }
      }

      // Optimistic Update: Show preview
      const previewUrl = URL.createObjectURL(file);
      setOptimisticPhotos(prev => ({ ...prev, [uploadIndex]: { src: previewUrl, loading: true }}));

      try {
        await dispatch(uploadProfilePhoto({ file, photoIndex: uploadIndex })).unwrap();
        toast.success(`Photo uploaded successfully!`);
      } catch (err) {
        toast.error(`Failed to upload ${file.name}: ${err}`);
      } finally {
        setOptimisticPhotos(prev => {
          const newState = { ...prev };
          delete newState[uploadIndex];
          return newState;
        });
      }
      
      // If we are uploading multiple files from the general browse button, we need to increment targetIndex if we want to handle multiple
      if(targetIndex === -1) {
          // just process one file if they used the general browse to prevent index clashes without complex logic
          break; 
      }
    }
  };

  const removePhoto = async (photoIndex) => {
    if ((await Swal.fire({ title: 'Are you sure?', text: "Are you sure you want to delete this photo?", icon: 'warning', showCancelButton: true, confirmButtonColor: '#8C6D39', cancelButtonColor: '#d33', confirmButtonText: 'Yes' }).then(r => r.isConfirmed))) {
      try {
        setOptimisticPhotos(prev => ({ ...prev, [photoIndex]: { src: null, loading: true }}));
        await dispatch(deleteProfilePhoto(photoIndex)).unwrap();
        toast.success("Photo deleted successfully");
        dispatch(fetchMyProfile()); // Force refetch as delete may not return full updated profile immediately
      } catch (err) {
        toast.error("Failed to delete photo");
      } finally {
        setOptimisticPhotos(prev => {
          const newState = { ...prev };
          delete newState[photoIndex];
          return newState;
        });
      }
    }
  };

  const hasSettingsChanged = () => {
    if (!profile) return false;
    return profilePhotoVisibility !== profile.profilePhotoVisibility ||
      albumVisibility !== profile.albumPhotoVisibility;
  };

  const handleSaveSettings = async () => {
    try {
      await dispatch(updateProfile({
        profilePhotoVisibility,
        albumPhotoVisibility: albumVisibility
      })).unwrap();
      toast.success('Photo settings saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings');
    }
  };

  const quickLinks = [
    { name: 'Shortlists & more', icon: Heart, route: '/matches?tab=more' },
    { name: 'New Matches', icon: Users, route: '/matches?tab=new' },
    { name: 'My Matches', icon: Check, route: '/matches?tab=my' },
    { name: 'Near Me', icon: MapPin, route: '/matches?tab=near' },
    { name: 'My Help', icon: HelpCircle, route: '/my-tickets' }
  ];

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }
  };

  const gridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } }
  };

  const photoCardVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.92, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { type: "spring", stiffness: 120, damping: 16, mass: 0.8 } },
    exit: { opacity: 0, scale: 0.85, y: 20 }
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-transparent font-sans pb-12"
    >
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Hidden File Input for General Browse */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileUpload(e, -1)}
        className="hidden"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Title */}
        <div className="mb-6">
          <span className="text-theme-text-secondary text-sm font-semibold">My Photos</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="flex-grow">
            
            <div className="dashboard-card-bg rounded-[32px] border border-white/50 overflow-hidden mb-8 shadow-md">
              {/* Header/Tabs */}
              <div className="flex items-center border-b border-gray-100 bg-theme-surface/20 backdrop-blur-md">
                <button
                  onClick={() => setActiveTab('photo')}
                  className={`flex items-center gap-2 px-8 py-5 text-sm font-bold transition-all ${
                    activeTab === 'photo' 
                      ? 'text-theme-pink bg-theme-surface/40 border-b-2 border-[#8C6D39]' 
                      : 'text-theme-text-secondary hover:text-gray-800'
                  }`}
                >
                  <Camera size={18} />
                  My Album
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-2 px-8 py-5 text-sm font-bold transition-all ${
                    activeTab === 'settings' 
                      ? 'text-theme-pink bg-theme-surface/40 border-b-2 border-[#8C6D39]' 
                      : 'text-theme-text-secondary hover:text-gray-800'
                  }`}
                >
                  <Settings size={18} />
                  Privacy Settings
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  
                  {activeTab === 'photo' && (
                    <motion.div
                      key="photo-tab"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-center mb-8">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Manage Your Photos</h2>
                          <p className="text-theme-text-secondary text-sm">Upload up to 6 photos. Clear, smiling pictures get 5x more responses.</p>
                        </div>
                        <button 
                          onClick={() => setShowGuidelines(true)}
                          className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-theme-pink bg-[#FAF6F0] rounded-full hover:bg-pink-100 transition-colors"
                        >
                          <HelpCircle size={16} /> Photo Guidelines
                        </button>
                      </div>

                      <motion.div 
                        variants={gridVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full max-w-[900px] mx-auto"
                      >
                        <AnimatePresence>
                        {albumPhotos.map((photoUrl, index) => {
                          const isOptimistic = optimisticPhotos[index];
                          const displayUrl = isOptimistic ? optimisticPhotos[index].src : photoUrl;
                          const isLoading = isOptimistic?.loading;

                          return (
                            <React.Fragment key={index}>
                              
                              <motion.div 
                                variants={photoCardVariants}
                                exit="exit"
                                whileHover={{ y: -8, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative group overflow-hidden bg-gray-50 border-2 border-transparent hover:border-[#C5A059] hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all duration-300 rounded-2xl aspect-[4/3] md:aspect-[5/4] col-span-1 row-span-1`}
                              >
                                {displayUrl ? (
                                  <div className="w-full h-full relative">
                                    <img 
                                      src={displayUrl} 
                                      alt={`Album ${index + 1}`} 
                                      className={`w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.08] ${isLoading ? 'opacity-50 blur-sm' : ''}`}
                                    />
                                    
                                    {/* Profile Photo Badge for index 0 */}
                                    {index === 0 && (
                                      <div className="absolute top-3 left-3 bg-gradient-to-r from-theme-primary to-theme-pink text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-sm flex items-center gap-1">
                                        <Shield size={12} /> Main Photo
                                      </div>
                                    )}

                                    {/* Hover Actions */}
                                    {!isLoading && (
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                                        <label className="w-12 h-12 bg-theme-surface/20 hover:bg-theme-surface/40 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer transition-colors text-white shadow-lg">
                                          <Edit3 size={20} />
                                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, index)} />
                                        </label>
                                        {index !== 0 && (
                                          <button 
                                            onClick={(e) => { e.preventDefault(); removePhoto(index); }}
                                            className="w-12 h-12 bg-rose-500/80 hover:bg-rose-500 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer transition-colors text-white shadow-lg"
                                          >
                                            <Trash2 size={20} />
                                          </button>
                                        )}
                                      </div>
                                    )}

                                    {isLoading && (
                                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-[#8C6D39] border-t-transparent rounded-full animate-spin mb-2"></div>
                                        <span className="text-pink-600 font-bold text-xs bg-theme-surface/80 px-2 py-1 rounded-full backdrop-blur-sm">Uploading...</span>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer md:border-none border-2 border-dashed border-theme-border group-hover:border-[#C5A059] hover:bg-[#FAF6F0]/50 transition-all duration-300 md:bg-theme-surface/90">
                                    <div className="w-14 h-14 bg-theme-surface shadow-sm rounded-full flex items-center justify-center mb-3 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 animate-[pulse_3s_ease-in-out_infinite]">
                                      <Upload className="text-theme-pink" size={24} />
                                    </div>
                                    <span className="font-bold text-gray-700">Add Photo</span>
                                    <span className="text-xs text-gray-400 mt-1">Tap to browse</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, index)} />
                                  </label>
                                )}
                              </motion.div>
                            </React.Fragment>
                          );
                        })}
                        </AnimatePresence>
                      </motion.div>
                      
                      {/* Mobile Guidelines Button */}
                      <button 
                        onClick={() => setShowGuidelines(true)}
                        className="mt-8 md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-theme-pink bg-[#FAF6F0] rounded-xl hover:bg-pink-100 transition-colors"
                      >
                        <HelpCircle size={18} /> View Photo Guidelines
                      </button>

                    </motion.div>
                  )}

                  {activeTab === 'settings' && (
                    <motion.div
                      key="settings-tab"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Privacy Settings</h2>
                      
                      <div className="space-y-6">
                        {/* Profile Photo Visibility */}
                        <div className="bg-theme-surface/20 rounded-2xl p-6 border border-white/30">
                          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Shield className="text-theme-pink" size={20} /> Main Profile Photo
                          </h3>
                          <div className="space-y-3">
                            <label className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all border-2 ${profilePhotoVisibility === 'ALL_MEMBERS' ? 'border-[#8C6D39] bg-theme-surface shadow-sm' : 'border-transparent hover:bg-gray-100'}`}>
                              <div className="flex-shrink-0 mt-1">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${profilePhotoVisibility === 'ALL_MEMBERS' ? 'border-[#8C6D39]' : 'border-gray-400'}`}>
                                  {profilePhotoVisibility === 'ALL_MEMBERS' && <div className="w-2.5 h-2.5 bg-[#8C6D39] rounded-full"></div>}
                                </div>
                              </div>
                              <div>
                                <div className={`font-bold ${profilePhotoVisibility === 'ALL_MEMBERS' ? 'text-gray-900' : 'text-gray-700'}`}>Visible to all Members</div>
                                <div className="text-sm text-theme-text-secondary mt-1">Recommended. Profiles with public photos get the most engagement.</div>
                              </div>
                            </label>

                            <label className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all border-2 ${profilePhotoVisibility === 'ONLY_PREMIUM' ? 'border-[#8C6D39] bg-theme-surface shadow-sm' : 'border-transparent hover:bg-gray-100'}`}>
                              <div className="flex-shrink-0 mt-1">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${profilePhotoVisibility === 'ONLY_PREMIUM' ? 'border-[#8C6D39]' : 'border-gray-400'}`}>
                                  {profilePhotoVisibility === 'ONLY_PREMIUM' && <div className="w-2.5 h-2.5 bg-[#8C6D39] rounded-full"></div>}
                                </div>
                              </div>
                              <div>
                                <div className={`font-bold ${profilePhotoVisibility === 'ONLY_PREMIUM' ? 'text-gray-900' : 'text-gray-700'}`}>Visible to Premium Members & Matches</div>
                                <div className="text-sm text-theme-text-secondary mt-1">Only premium members or those you have liked can view your main photo.</div>
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* Album Visibility */}
                        <div className="bg-theme-surface/20 rounded-2xl p-6 border border-white/30">
                          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Camera className="text-theme-pink" size={20} /> Photo Album (Photos 2-6)
                          </h3>
                          <div className="space-y-3">
                            <label className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all border-2 ${albumVisibility === 'ALL_MEMBERS' ? 'border-[#8C6D39] bg-theme-surface shadow-sm' : 'border-transparent hover:bg-gray-100'}`}>
                              <div className="flex-shrink-0 mt-1">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${albumVisibility === 'ALL_MEMBERS' ? 'border-[#8C6D39]' : 'border-gray-400'}`}>
                                  {albumVisibility === 'ALL_MEMBERS' && <div className="w-2.5 h-2.5 bg-[#8C6D39] rounded-full"></div>}
                                </div>
                              </div>
                              <div>
                                <div className={`font-bold ${albumVisibility === 'ALL_MEMBERS' ? 'text-gray-900' : 'text-gray-700'}`}>Visible to all Members</div>
                              </div>
                            </label>

                            <label className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all border-2 ${albumVisibility === 'LIKED_AND_PREMIUM' ? 'border-[#8C6D39] bg-theme-surface shadow-sm' : 'border-transparent hover:bg-gray-100'}`}>
                              <div className="flex-shrink-0 mt-1">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${albumVisibility === 'LIKED_AND_PREMIUM' ? 'border-[#8C6D39]' : 'border-gray-400'}`}>
                                  {albumVisibility === 'LIKED_AND_PREMIUM' && <div className="w-2.5 h-2.5 bg-[#8C6D39] rounded-full"></div>}
                                </div>
                              </div>
                              <div>
                                <div className={`font-bold ${albumVisibility === 'LIKED_AND_PREMIUM' ? 'text-gray-900' : 'text-gray-700'}`}>Visible to Premium & Liked Members</div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {hasSettingsChanged() && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="pt-6 border-t border-gray-100 flex justify-end"
                        >
                          <button
                            onClick={handleSaveSettings}
                            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-theme-primary to-theme-pink text-white rounded-full font-bold shadow-lg shadow-[#C5A059]/20 hover:shadow-xl hover:shadow-pink-500/40 hover:-translate-y-0.5 transition-all"
                          >
                            <Save size={18} /> Save Settings
                          </button>
                        </motion.div>
                      )}

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>



        </div>
      </div>

      {/* Guidelines Modal (Preserved from original) */}
      <AnimatePresence>
        {showGuidelines && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowGuidelines(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-theme-surface rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-theme-surface/80 backdrop-blur-md border-b border-gray-100 p-6 flex justify-between items-center rounded-t-3xl z-10">
                <h2 className="text-2xl font-bold text-gray-900 font-serif">
                  Photo Guidelines
                </h2>
                <button
                  onClick={() => setShowGuidelines(false)}
                  className="w-10 h-10 bg-gray-100 hover:bg-rose-100 hover:text-rose-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* ... (Guidelines content identical to original but slightly styled) */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-6 h-6 bg-theme-success rounded-full flex items-center justify-center text-white text-sm">✓</span>
                      <h3 className="font-bold text-gray-800 uppercase text-sm">Photos you can upload</h3>
                    </div>
                    <div className="flex gap-6 justify-center">
                      {acceptablePhotos.map((photo, idx) => (
                        <div key={idx} className="text-center">
                          <div className="w-32 h-32 bg-gray-100 rounded-full shadow-lg flex items-center justify-center mb-3 border-4 border-white overflow-hidden">
                            <img src={photo.src} alt={photo.label} className="w-full h-full object-cover" />
                          </div>
                          <p className="text-sm font-semibold text-theme-text-secondary">{photo.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">✕</span>
                      <h3 className="font-bold text-gray-800 uppercase text-sm">Photos you cannot upload</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {unacceptablePhotos.map((photo, idx) => (
                        <div key={idx} className="text-center">
                          <div className="w-28 h-28 bg-gray-100 rounded-full shadow-lg flex items-center justify-center mb-2 border-4 border-white overflow-hidden relative">
                            <img src={photo.src} alt={photo.label} className={`w-full h-full object-cover ${photo.blur ? 'blur-sm' : ''} ${photo.transform || ''}`} />
                            {photo.watermark && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-theme-surface/90 px-2 py-1 rounded text-xs font-bold text-red-500 transform -rotate-12">WATERMARK</div>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-500/20"></div>
                          </div>
                          <p className="text-xs font-semibold text-theme-text-secondary">{photo.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="text-blue-500" size={24} />
                    <h3 className="text-lg font-bold text-gray-900">Important Rules</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-blue-400 mt-1">•</span>
                      <span><strong>Smile.</strong> Your matches are more likely to respond.</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-blue-400 mt-1">•</span>
                      <span><strong>Add recent and clear photos.</strong> Do not add group photos.</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Maximum size is <strong>15 MB</strong> in <strong>jpg, png or webp</strong> format.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
