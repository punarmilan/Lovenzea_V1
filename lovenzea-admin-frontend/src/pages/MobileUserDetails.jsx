import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import adminUserService from '../services/adminUserService';
import adminVerificationService from '../services/adminVerificationService';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';
import { 
  ArrowLeft, 
  ShieldCheck, 
  ShieldAlert, 
  User, 
  Briefcase, 
  GraduationCap, 
  Home, 
  Sparkles, 
  Heart, 
  Image as ImageIcon, 
  Trash2, 
  CheckCircle, 
  Ban, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar 
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const MobileUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'career' | 'family' | 'astro' | 'preferences' | 'photos'
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const data = await adminUserService.getUserById(id);
      setUser(data);
    } catch (error) {
      toast.error('Failed to load user profile details');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProfile = async () => {
    try {
      await adminVerificationService.approveProfile(id);
      toast.success('User profile verified and approved');
      fetchUserDetails();
    } catch (err) {
      toast.error('Failed to approve profile');
    }
  };

  const handleToggleBlock = async () => {
    const isBlocked = user.accountLocked || user.status === 'BLOCKED';
    const action = isBlocked ? 'unblock' : 'block';

    const result = await Swal.fire({
      title: `${action.toUpperCase()} User Profile?`,
      text: `Do you want to ${action} profile #${id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#334155',
      confirmButtonText: `Yes, ${action}`,
      background: '#0f172a',
      color: '#f8fafc',
    });

    if (result.isConfirmed) {
      try {
        if (isBlocked) {
          await adminUserService.unblockUser(id);
          toast.success('User unblocked');
        } else {
          await adminUserService.blockUser(id);
          toast.success('User blocked');
        }
        fetchUserDetails();
      } catch (err) {
        toast.error(`Failed to ${action} user`);
      }
    }
  };

  const handleDeletePhoto = async (photoIndex) => {
    const result = await Swal.fire({
      title: 'Remove Photo?',
      text: 'Are you sure you want to permanently remove this photo from user profile?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, Delete Photo',
      background: '#0f172a',
      color: '#f8fafc',
    });

    if (result.isConfirmed) {
      try {
        await adminVerificationService.deleteUserPhoto(id, photoIndex);
        toast.success('Photo removed successfully');
        fetchUserDetails();
      } catch (err) {
        toast.error('Failed to delete photo');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving complete user dossier..." />;
  }

  if (!user) {
    return (
      <div className="glass-card p-12 rounded-3xl text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Profile Not Found</h3>
        <p className="text-xs text-slate-400">The requested matrimony dossier could not be located.</p>
        <Link to="/mobile-users" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs">
          <ArrowLeft size={16} />
          <span>Back to Directory</span>
        </Link>
      </div>
    );
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'Unnamed Profile';
  const isBlocked = user.accountLocked || user.status === 'BLOCKED';
  const isVerified = user.isVerified || user.profileVerified;

  // Extract photos list
  const photosList = Array.isArray(user.photos) 
    ? user.photos 
    : user.photoUrls || (user.profilePic ? [user.profilePic] : []);

  const TABS = [
    { id: 'basic', label: 'Personal & Basics', icon: User },
    { id: 'career', label: 'Career & Education', icon: Briefcase },
    { id: 'family', label: 'Family Background', icon: Home },
    { id: 'astro', label: 'Horoscope & Astro', icon: Sparkles },
    { id: 'preferences', label: 'Partner Preferences', icon: Heart },
    { id: 'photos', label: `Photos (${photosList.length})`, icon: ImageIcon },
  ];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/mobile-users"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all"
        >
          <ArrowLeft size={16} />
          <span>Back to Directory</span>
        </Link>

        <div className="flex items-center gap-3">
          {!isVerified && (
            <button
              onClick={handleApproveProfile}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <CheckCircle size={16} />
              <span>Approve Profile</span>
            </button>
          )}

          <button
            onClick={handleToggleBlock}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isBlocked
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {isBlocked ? <CheckCircle size={16} /> : <Ban size={16} />}
            <span>{isBlocked ? 'Unblock Profile' : 'Block Account'}</span>
          </button>
        </div>
      </div>

      {/* Profile Header Hero Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-800 border-2 border-slate-700 overflow-hidden flex items-center justify-center text-white font-extrabold text-3xl shadow-xl">
                {photosList.length > 0 ? (
                  <img src={photosList[0]} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  fullName.charAt(0)
                )}
              </div>
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-white shadow-lg">
                  <ShieldCheck size={16} />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-white">{fullName}</h2>
                <Badge variant={isBlocked ? 'danger' : isVerified ? 'success' : 'warning'}>
                  {isBlocked ? 'Blocked' : isVerified ? 'Verified' : 'Pending Verification'}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">Matrimony Dossier ID: #{user.id} • Registered Member</p>
              
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Mail size={13} className="text-rose-400" />
                  <span>{user.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone size={13} className="text-emerald-400" />
                  <span>{user.mobileNumber || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-cyan-400" />
                  <span>{user.city || user.location || 'Location unlisted'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex md:flex-col items-center justify-around gap-2 text-center">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Connects</p>
              <p className="text-xl font-extrabold text-rose-400">{user.connects ?? 0}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Gender</p>
              <p className="text-xs font-bold text-white">{user.gender || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-950/40'
                  : 'glass-card text-slate-400 hover:text-white'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Basic Info */}
      {activeTab === 'basic' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white">Demographics & Vital Stats</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Age & Date of Birth</span>
                <span className="font-semibold text-white">{user.age ? `${user.age} Years` : user.dob || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Height & Weight</span>
                <span className="font-semibold text-white">{user.height || 'N/A'} • {user.weight || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Marital Status</span>
                <span className="font-semibold text-white">{user.maritalStatus || 'Never Married'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Mother Tongue</span>
                <span className="font-semibold text-white">{user.motherTongue || 'Hindi'}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white">Religious & Cultural Identity</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Religion</span>
                <span className="font-semibold text-white">{user.religion || 'Hindu'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Caste / Sub-Caste</span>
                <span className="font-semibold text-white">{user.caste || 'N/A'} {user.subCaste ? `(${user.subCaste})` : ''}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Gotra</span>
                <span className="font-semibold text-white">{user.gotra || 'Not Specified'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Diet / Eating Habits</span>
                <span className="font-semibold text-white">{user.diet || 'Vegetarian'}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 glass-card p-6 rounded-3xl space-y-3">
            <h3 className="text-sm font-bold text-white">About Candidate (Bio)</h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
              {user.aboutMe || user.bio || 'Candidate has not provided a personalized biographical statement yet.'}
            </p>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Career & Education */}
      {activeTab === 'career' && (
        <div className="glass-card p-6 rounded-3xl space-y-6">
          <h3 className="text-sm font-bold text-white">Professional & Academic Portfolio</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Highest Education Degree</span>
              <p className="text-sm font-bold text-white">{user.highestDegree || user.education || 'N/A'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">College / University</span>
              <p className="text-sm font-bold text-white">{user.college || user.university || 'N/A'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Employment Sector</span>
              <p className="text-sm font-bold text-white">{user.employedIn || 'Private Sector'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Occupation / Job Title</span>
              <p className="text-sm font-bold text-rose-400">{user.occupation || 'Software Engineer'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Annual Income Package</span>
              <p className="text-sm font-bold text-emerald-400">{user.annualIncome || 'Not disclosed'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Work Location</span>
              <p className="text-sm font-bold text-white">{user.workLocation || user.city || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Family */}
      {activeTab === 'family' && (
        <div className="glass-card p-6 rounded-3xl space-y-6">
          <h3 className="text-sm font-bold text-white">Family Background & Heritage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Family Type</span>
              <p className="text-sm font-bold text-white">{user.familyType || 'Nuclear Family'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Family Values</span>
              <p className="text-sm font-bold text-white">{user.familyValues || 'Moderate'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Father's Profession</span>
              <p className="text-sm font-bold text-white">{user.fatherOccupation || 'Business'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Mother's Profession</span>
              <p className="text-sm font-bold text-white">{user.motherOccupation || 'Homemaker'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Siblings</span>
              <p className="text-sm font-bold text-white">{user.brothersCount || 0} Brother(s), {user.sistersCount || 0} Sister(s)</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Native Place</span>
              <p className="text-sm font-bold text-white">{user.nativePlace || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Astro */}
      {activeTab === 'astro' && (
        <div className="glass-card p-6 rounded-3xl space-y-6">
          <h3 className="text-sm font-bold text-white">Astrological & Horoscope Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Rashi / Moon Sign</span>
              <p className="text-sm font-bold text-white">{user.rashi || 'Not Specified'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Nakshatra</span>
              <p className="text-sm font-bold text-white">{user.nakshatra || 'Not Specified'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Manglik Status</span>
              <p className="text-sm font-bold text-rose-400">{user.manglikStatus || 'Non-Manglik'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Time of Birth</span>
              <p className="text-sm font-bold text-white">{user.birthTime || 'N/A'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Place of Birth</span>
              <p className="text-sm font-bold text-white">{user.birthPlace || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Preferences */}
      {activeTab === 'preferences' && (
        <div className="glass-card p-6 rounded-3xl space-y-6">
          <h3 className="text-sm font-bold text-white">Desired Partner Preferences</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Preferred Age Range</span>
              <p className="text-sm font-bold text-white">{user.preferredAgeMin || 22} - {user.preferredAgeMax || 30} Years</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Preferred Marital Status</span>
              <p className="text-sm font-bold text-white">{user.preferredMaritalStatus || 'Never Married'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Preferred Religion</span>
              <p className="text-sm font-bold text-white">{user.preferredReligion || 'Any'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Preferred Education</span>
              <p className="text-sm font-bold text-white">{user.preferredEducation || 'Graduate & Above'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500">Preferred Location</span>
              <p className="text-sm font-bold text-white">{user.preferredCity || 'Open to all cities'}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Photos */}
      {activeTab === 'photos' && (
        <div className="glass-card p-6 rounded-3xl space-y-6">
          <h3 className="text-sm font-bold text-white">Uploaded Photographs ({photosList.length})</h3>
          
          {photosList.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">No photos uploaded by this candidate.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photosList.map((photoUrl, idx) => (
                <div key={idx} className="relative group rounded-2xl overflow-hidden border border-slate-800 aspect-square bg-slate-900">
                  <img
                    src={photoUrl}
                    alt={`Photo #${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => setSelectedPhoto(photoUrl)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                    <span className="text-[10px] font-bold text-white">#{idx + 1}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(idx);
                      }}
                      className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-colors"
                      title="Delete Photo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Photo Zoom Modal */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <img src={selectedPhoto} alt="Zoom" className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl border border-slate-700 shadow-2xl" />
        </div>
      )}
    </div>
  );
};

export default MobileUserDetails;
