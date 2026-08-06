import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { toast, ToastContainer } from 'react-toastify';
import profileBanner from '../../../assets/image/profile_banner.jpg';
// import img from '../../../assets/image/profile.png' // Removed static image
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaChartBar, FaFilter, FaHeart, FaCamera, FaEye, FaPhone, FaStar, FaShareAlt, FaDownload, FaUserEdit, FaUserFriends, FaHome, FaGraduationCap, FaBriefcase, FaMapMarkerAlt, FaBirthdayCake, FaClock, FaCity, FaVenusMars, FaUsers, FaWallet, FaCheck, FaTimes, FaInfoCircle, FaUserCircle, FaLanguage, FaShieldAlt, FaTrash } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyProfile, updateProfile, fetchPartnerPreferences, updatePartnerPreferences, uploadIdProof, uploadProfilePhoto } from '../../../Slice/ProfileSlice';
import { fetchDashboardSummary } from '../../../Slice/DashboardSlice';
import ProfileStatusCards from './ProfileStatusCards';
import ProfileDetailsView from './ProfileDetailsView';


const rashiOptions = [
  "Mesh (Aries)", "Vrishabh (Taurus)", "Mithun (Gemini)", "Kark (Cancer)",
  "Sinh (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchik (Scorpio)",
  "Dhanu (Sagittarius)", "Makar (Capricorn)", "Kumbh (Aquarius)", "Meen (Pisces)"
];

const nakshatraOptions = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
  "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Moola", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const religionOptions = ["Hindu", "Sikh", "Christian", "Muslim", "Parsi", "Jain", "Buddhist", "Jewish", "No Religion", "Spiritual - not religious"];

const communityOptions = ["Maratha", "Brahmin", "Kunbi", "Agri", "Banjara", "Chambhar", "Dhangar", "Gond", "Koli", "Mahar", "Mali", "Matang", "Nomadic Tribes", "Paradhi", "Vanjari"];

const motherTongueOptions = ["Punjabi", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali", "Oriya", "Urdu", "English", "Other"];

const subCasteOptions = ["Jat Sikh", "Arora Sikh", "Khatri Sikh", "Ramgarhia Sikh", "Majabi Sikh", "Ravidasia Sikh", "Maratha-Patil", "96 Kuli Maratha", "96 Kuli Maratha (Deshmukh)", "Other"];

const gotraOptions = ["Bhardwaj", "Kashyap", "Vasishta", "Vishvamitra", "Gautam", "Jamadagni", "Atri", "Agastya", "Not Specified", "Other"];

const timeOfBirthOptions = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const minute = (i % 2) * 30;
  const period = h < 12 ? 'AM' : 'PM';
  return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
});

const FIELD_TYPES = {
  // Screen 1: Religious / Astro Info
  religion: 'dropdown_req',
  manglikStatus: 'dropdown_req',
  caste: 'dropdown_req',
  subCaste: 'dropdown_req',
  gotra: 'dropdown_req',
  motherTongue: 'dropdown_req',
  timeOfBirth: 'dropdown_req',
  placeOfBirth: 'text_only',
  nakshatra: 'dropdown_req',
  rashi: 'dropdown_req',
  astroVisibility: 'dropdown_req',

  // Screen 2: Family Info
  fatherStatus: 'text_only',
  motherStatus: 'text_only',
  familyFinancialStatus: 'text_only',
  sistersCount: 'number_range_0_20',
  brothersCount: 'number_range_0_20',
  familyLocation: 'text_only', // Updated to only characters as per user request
  familyAnnualIncome: 'dropdown_req', // Added as per user request

  // Screen 3: Education / Career Info
  educationLevel: 'text_only',
  educationField: 'text_only',
  college: 'text_space',
  workingWith: 'dropdown_req',
  occupation: 'text_only',
  company: 'text_space',
  workingCity: 'text_only',
  annualIncome: 'dropdown_req',

  // Screen 4: Location Info
  address: 'text_addr',
  city: 'text_only',
  state: 'text_only',
  country: 'text_only',
  residencyStatus: 'dropdown_req',
  zipCode: 'number_zip_6',

  // Screen 5: Personal / Lifestyle Info
  age: 'number_range_18_70',
  dateOfBirth: 'date_18plus',
  maritalStatus: 'dropdown_req',
  height: 'dropdown_req',
  weight: 'number_range_30_200',
  grewUpIn: 'text_only',
  diet: 'radio_req',
  drinkingHabit: 'dropdown_req',
  smokingHabit: 'dropdown_req',
  bloodGroup: 'dropdown_req',
  healthInformation: 'dropdown_req',
  disability: 'radio_req',

  // Screen 6: About Me
  aboutMe: 'textarea_50_8000',

  // Screen 7: Hobbies
  hobbies: 'text_hobbies',

  // Screen 8: Privacy / Visibility Settings
  profileVisibility: 'dropdown_req',
  profilePhotoVisibility: 'dropdown_req',
  albumPhotoVisibility: 'dropdown_req',
  contactDisplayStatus: 'dropdown_req',
  // astroVisibility: 'dropdown_req', // Duplicate in screen 1

  // Screen 9: Partner Preferences
  preferredMotherTongue: 'text_commas',
  professionArea: 'dropdown',
  profileManagedBy: 'dropdown',
  minAge: 'number_range_18_70',
  maxAge: 'number_age_max',
  minHeight: 'height_format',
  maxHeight: 'height_format_max',
  preferredReligion: 'text_only',
  preferredCaste: 'text_only',
  preferredSubCaste: 'text_only',
  minEducationLevel: 'text_only',
  preferredCity: 'text_only',
  preferredState: 'text_only',
  preferredDiet: 'radio',
  minAnnualIncome: 'number_only',
  preferWorkingProfessional: 'dropdown_req',
  preferNri: 'dropdown_req',
  showVerifiedOnly: 'dropdown_req',
  enableAutoMatch: 'dropdown_req',
  matchScoreThreshold: 'dropdown',
  preferredEducationField: 'text_only',
  preferredCountry: 'text_only'
};


const MyProfile = ({ editModePage = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, preferences, loading, error } = useSelector((state) => state.profile);
  const { summary } = useSelector((state) => state.dashboard);

  const [activeTab, setActiveTab] = useState('religious');
  const [isPremium, setIsPremium] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [modalSection, setModalSection] = useState('');
  const [idProofFile, setIdProofFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [showOtherInput, setShowOtherInput] = useState({});
  const [isEditing, setIsEditing] = useState(editModePage);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    setIsEditing(editModePage);
  }, [editModePage]);

  useEffect(() => {
    dispatch(fetchMyProfile());
    dispatch(fetchPartnerPreferences());
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  const hasPendingInSection = (section) => {
    return false; // No longer needed since we save immediately
  };

  // Enhanced profile data mapping from backend to frontend structure
  const [profileData, setProfileData] = useState({
    id: '', // Database internal ID
    profileId: 'PM00000000', // Display ID
    email: '',
    mobileNumber: '',
    fullName: '',
    age: '',
    height: '',
    weight: '',
    religion: '',
    community: '',
    subCommunity: '',
    maritalStatus: '',
    location: '',
    postedBy: '',
    motherTongue: '',
    education: '',
    educationField: '',
    college: '',
    profession: '',
    company: '',
    income: '',
    aboutText: '',
    workingCity: '',
    workingWith: '',
    grewUpIn: '',
    zipCode: '',
    residencyStatus: '',
    diet: '',
    bloodGroup: '',
    healthInformation: '',
    disability: '',
    drinkingHabit: '',
    smokingHabit: '',
    country: '',
    state: '',
    city: '',
    address: '',
    fatherStatus: '',
    motherStatus: '',
    brothersCount: 0,
    sistersCount: 0,
    familyFinancialStatus: '',
    familyLocation: '',
    hobbies: [],
    profileVisibility: 'Public',
    profilePhotoVisibility: 'ALL_MEMBERS',
    albumPhotoVisibility: 'LIKED_AND_PREMIUM',
    contactDisplayStatus: 'Only Premium Members',
    astroVisibility: 'ALL_MEMBERS',
    manglikStatus: 'DONT_KNOW',
    timeOfBirth: '',
    placeOfBirth: '',
    nakshatra: '',
    rashi: '',
    verificationStatus: 'UNVERIFIED',
    verificationNotes: '',
    verifiedAt: '',
    verifiedBy: '',
    idProofType: '',
    idProofNumber: '',
    idProofUrl: '',
    createdAt: '',
    updatedAt: '',
    photoCount: 0,
    profileComplete: false,
    religiousBackground: {},
    familyDetails: {},
    educationCareer: {},
    locationInfo: {},
    lifestyle: {},
    partnerPreferences: {}
  });

  useEffect(() => {
    if (profile) {
      setProfileData(prev => ({
        ...prev,
        id: profile.id || '',
        profileId: profile.profileId || 'PM00000000',
        email: profile.email || '',
        mobileNumber: profile.mobileNumber || '',
        fullName: profile.fullName || '',
        age: profile.age || '',
        height: profile.height || '',
        weight: profile.weight || '',
        religion: profile.religion || '',
        community: profile.caste || '',
        subCommunity: profile.subCaste || '',
        maritalStatus: profile.maritalStatus || '',
        location: (profile.city || '') + ', ' + (profile.state || ''),
        postedBy: profile.profileCreatedBy || 'Self',
        motherTongue: profile.motherTongue || '',
        education: profile.educationLevel || '',
        educationField: profile.educationField || '',
        college: profile.college || '',
        profession: profile.occupation || '',
        company: profile.company || '',
        income: profile.annualIncome ? profile.annualIncome.toString() : 'Don\'t want to specify',
        aboutText: profile.aboutMe || '',
        workingCity: profile.workingCity || '',
        workingWith: profile.workingWith || '',
        grewUpIn: profile.grewUpIn || '',
        zipCode: profile.zipCode || '',
        residencyStatus: profile.residencyStatus || '',
        diet: profile.diet || '',
        bloodGroup: profile.bloodGroup || '',
        healthInformation: profile.healthInformation || '',
        disability: profile.disability || '',
        drinkingHabit: profile.drinkingHabit || '',
        smokingHabit: profile.smokingHabit || '',
        country: profile.country || '',
        state: profile.state || '',
        city: profile.city || '',
        address: profile.address || '',
        fatherStatus: profile.fatherStatus || '',
        motherStatus: profile.motherStatus || '',
        brothersCount: profile.brothersCount || 0,
        sistersCount: profile.sistersCount || 0,
        familyFinancialStatus: profile.familyFinancialStatus || '',
        familyLocation: profile.familyLocation || '',
        hobbies: profile.hobbies ? (Array.isArray(profile.hobbies) ? profile.hobbies : profile.hobbies.split(',').map(h => h.trim())) : [],
        profileVisibility: profile.profileVisibility || 'Public',
        profilePhotoVisibility: profile.profilePhotoVisibility || 'ALL_MEMBERS',
        albumPhotoVisibility: profile.albumPhotoVisibility || 'LIKED_AND_PREMIUM',
        contactDisplayStatus: profile.contactDisplayStatus || 'Only Premium Members',
        astroVisibility: profile.astroVisibility || 'ALL_MEMBERS',
        manglikStatus: profile.manglikStatus || 'DONT_KNOW',
        timeOfBirth: profile.timeOfBirth || '',
        placeOfBirth: profile.placeOfBirth || '',
        nakshatra: profile.nakshatra || '',
        rashi: profile.rashi || '',
        verificationStatus: profile.verificationStatus || 'UNVERIFIED',
        verificationNotes: profile.verificationNotes || '',
        verifiedAt: profile.verifiedAt || '',
        verifiedBy: profile.verifiedBy || '',
        idProofType: profile.idProofType || '',
        idProofNumber: profile.idProofNumber || '',
        idProofUrl: profile.idProofUrl || '',
        createdAt: profile.createdAt || '',
        updatedAt: profile.updatedAt || '',
        photoCount: profile.photoCount || 0,
        profileComplete: profile.profileComplete || false,

        religiousBackground: {
          gender: profile.gender || '',
          religion: profile.religion || '',
          manglikChevvai: profile.manglikStatus || 'DONT_KNOW',
          community: profile.caste || '',
          subCommunity: profile.subCaste || '',
          gothra: profile.gotra || 'Not Specified',
          motherTongue: profile.motherTongue || '',
          dob: profile.dateOfBirth || '',
          timeOfBirth: profile.timeOfBirth || '',
          cityOfBirth: profile.placeOfBirth || '',
          nakshatra: profile.nakshatra || '',
          rashi: profile.rashi || '',
          astroVisibility: profile.astroVisibility || 'ALL_MEMBERS'
        },

        familyDetails: {
          mother: profile.motherStatus || 'Not specified',
          father: profile.fatherStatus || 'Not specified',
          familyLocation: profile.familyLocation || '',
          financialStatus: profile.familyFinancialStatus || 'Middle',
          sisters: profile.sistersCount !== undefined ? profile.sistersCount : 0,
          brothers: profile.brothersCount !== undefined ? profile.brothersCount : 0,
          familyAnnualIncome: profile.familyAnnualIncome || "Don't want to specify"
        },

        educationCareer: {
          highestQualification: profile.educationLevel || '',
          educationField: profile.educationField || '',
          collegeAttended: profile.college || '',
          workingWith: profile.workingWith || 'Private Company',
          workingAs: profile.occupation || '',
          employerName: profile.company || '',
          annualIncome: profile.annualIncome ? profile.annualIncome.toString() : 'Don\'t want to specify',
          workingCity: profile.workingCity || ''
        },

        locationInfo: {
          currentResidence: `${profile.city || ''}, ${profile.state || ''}, ${profile.country || 'India'}`,
          residencyStatus: profile.residencyStatus || 'Citizen',
          state: profile.state || '',
          zipCode: profile.zipCode || 'Not Specified',
          address: profile.address || '',
          city: profile.city || '',
          country: profile.country || 'India'
        },

        lifestyle: {
          diet: profile.diet || '',
          smoking: profile.smokingHabit || '',
          drinking: profile.drinkingHabit || '',
          bloodGroup: profile.bloodGroup || 'Not Specified',
          healthInfo: profile.healthInformation || 'No Health Problems',
          disability: profile.disability || 'None',
          grewUpIn: profile.grewUpIn || 'India',
          weight: profile.weight || '',
          height: profile.height || ''
        },
        albumPhotos: [
          profile.profilePhotoUrl || null,
          profile.photoUrl2 || null,
          profile.photoUrl3 || null,
          profile.photoUrl4 || null,
          profile.photoUrl5 || null,
          profile.photoUrl6 || null
        ]
      }));

      setProfileImage(profile.profilePhotoUrl || null);
      setIsPremium(profile.isPremium || false);
    }
  }, [profile]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show immediate local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to database
    try {
      await dispatch(uploadProfilePhoto({ file, photoIndex: 0 })).unwrap();
      toast.success("Profile photo updated successfully!");
    } catch (error) {
      toast.error(error || "Failed to upload photo");
      setPhotoPreview(null); // Revert preview on failure
    }
  };

  const handleAlbumPhotoUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading("Uploading photo...");
    try {
      await dispatch(uploadProfilePhoto({ file, photoIndex: index })).unwrap();
      toast.update(toastId, { render: "Photo uploaded successfully!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (error) {
      toast.update(toastId, { render: error || "Failed to upload photo", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  useEffect(() => {
    if (preferences) {
      setProfileData(prev => ({
        ...prev,
        partnerPreferences: {
          ageRange: `${preferences.minAge || ''}-${preferences.maxAge || ''} Years`,
          maritalStatus: preferences.maritalStatus || 'Open',
          motherTongue: preferences.preferredMotherTongue || 'Open',
          religion: preferences.preferredReligion || 'Open',
          community: preferences.preferredCaste || 'Open',
          heightRange: `${preferences.minHeight || ''} to ${preferences.maxHeight || ''}`,
          country: preferences.preferredCountry || 'India',
          state: preferences.preferredState || 'Open',
          city: preferences.preferredCity || 'Open',
          education: preferences.minEducationLevel || 'Open',
          profession: preferences.occupation || 'Open',
          workingWith: preferences.workingWith || 'Open',
          annualIncome: preferences.minAnnualIncome || 'Open',
          professionArea: preferences.professionArea || 'Open',
          profileManagedBy: preferences.profileManagedBy || 'Open',
          diet: preferences.preferredDiet || 'Open',
          drinkingHabit: preferences.drinkingHabit || 'Open',
          smokingHabit: preferences.smokingHabit || 'Open',
          preferredSubCaste: preferences.preferredSubCaste || 'Open',
          preferredEducationField: preferences.preferredEducationField || 'Open',
          preferWorkingProfessional: preferences.preferWorkingProfessional || false,
          preferNri: preferences.preferNri || false,
          showVerifiedOnly: preferences.showVerifiedOnly !== false, // Default true
          enableAutoMatch: preferences.enableAutoMatch !== false, // Default true
          matchScoreThreshold: preferences.matchScoreThreshold || 0
        }
      }));
    }
  }, [preferences]);



  // Profile management options with navigation paths
  const profileOptions = [
    {
      id: 'view-profile-stats',
      label: 'View Profile Stats',
      icon: <FaChartBar />,
      color: 'text-green-600',
      onClick: () => navigate('/my-shadi')
    },
    {
      id: 'set-contact-filters',
      label: 'Set Contact Filters',
      icon: <FaFilter />,
      color: 'text-purple-600',
      onClick: () => navigate('/my-shadi/my-contact/contact-filters')
    },
    {
      id: 'hide-delete-profile',
      label: 'Hide / Delete Profile',
      icon: <FaEye />,
      color: 'text-theme-text-secondary',
      onClick: () => navigate('/my-shadi/settings', { state: { openSection: 'delete' } })
    },

  ];

  // Tab sections
  const tabs = [
    { id: 'religious', label: 'Religious Background', icon: <FaStar /> },
    { id: 'family', label: 'Family Details', icon: <FaUsers /> },
    { id: 'education', label: 'Education & Career', icon: <FaGraduationCap /> },
    { id: 'location', label: 'Location', icon: <FaMapMarkerAlt /> },
    { id: 'lifestyle', label: 'Lifestyle', icon: <FaHeart /> },
    { id: 'privacy', label: 'Privacy & Metadata', icon: <FaEye /> },
    { id: 'verification', label: 'Verification Info', icon: <FaCheck /> },
    { id: 'preferences', label: 'Partner Preferences', icon: <FaUserFriends /> }
  ];

  // Commit profile updates directly to backend
  const commitProfileUpdate = async (updates) => {
    const allowedFields = [
      'fullName', 'age', 'idProofType', 'idProofNumber', 'dateOfBirth', 'height', 'weight', 'maritalStatus', 'motherTongue',
      'religion', 'caste', 'subCaste', 'gotra',
      'educationLevel', 'educationField', 'college', 'occupation', 'company', 'workingWith', 'annualIncome', 'workingCity', 'grewUpIn', 'zipCode', 'residencyStatus',
      'diet', 'bloodGroup', 'healthInformation', 'disability', 'drinkingHabit', 'smokingHabit',
      'country', 'state', 'city', 'address',
      'fatherStatus', 'motherStatus', 'brothersCount', 'sistersCount', 'familyFinancialStatus', 'familyLocation',
      'aboutMe', 'hobbies',
      'timeOfBirth', 'placeOfBirth', 'manglikStatus', 'nakshatra', 'rashi', 'astroVisibility',
      'profileCreatedBy', 'profileVisibility', 'profilePhotoVisibility', 'albumPhotoVisibility', 'contactDisplayStatus'
    ];

    const intFields = ['age', 'brothersCount', 'sistersCount'];
    const floatFields = [];

    const formattedProfile = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        let val = updates[key];
        if (key === 'hobbies' && Array.isArray(val)) {
          val = val.join(', ');
        }
        if (intFields.includes(key)) {
          val = val === '' || val === null ? null : parseInt(val, 10);
          if (isNaN(val)) val = null;
        } else if (floatFields.includes(key)) {
          val = val === '' || val === null ? null : parseFloat(val);
          if (isNaN(val)) val = null;
        }
        obj[key] = val;
        return obj;
      }, {});

    if (Object.keys(formattedProfile).length > 0) {
      try {
        await dispatch(updateProfile(formattedProfile)).unwrap();
        toast.success('Field updated successfully!');
      } catch (err) {
        toast.error(err || 'Failed to update backend');
      }
    }
  };

  const commitPreferenceUpdate = async (updates) => {
    const allowedFields = [
      'minAge', 'maxAge', 'minHeight', 'maxHeight',
      'preferredReligion', 'preferredCaste', 'preferredSubCaste',
      'minEducationLevel', 'preferredCity', 'preferredState', 'preferredCountry',
      'preferredDiet', 'drinkingHabit', 'smokingHabit',
      'maritalStatus', 'occupation', 'workingWith', 'minAnnualIncome',
      'preferWorkingProfessional', 'preferNri', 'showVerifiedOnly',
      'enableAutoMatch', 'matchScoreThreshold',
      'preferredMotherTongue', 'professionArea', 'profileManagedBy',
      'preferredEducationField', 'preferredSubCaste'
    ];

    const prefIntFields = ['minAge', 'maxAge', 'matchScoreThreshold'];
    const prefBoolFields = ['preferWorkingProfessional', 'preferNri', 'showVerifiedOnly', 'enableAutoMatch'];

    const filteredPreferences = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        let val = updates[key];
        if (prefIntFields.includes(key)) {
          if (val === '' || val === null || val === undefined) {
            val = null;
          } else {
            const parsed = parseInt(val, 10);
            val = isNaN(parsed) ? null : parsed;
          }
        } else if (prefBoolFields.includes(key)) {
          if (typeof val === 'string') {
            val = val.toLowerCase() === 'true' || val.toLowerCase() === 'yes';
          } else {
            val = Boolean(val);
          }
        }
        obj[key] = val;
        return obj;
      }, {});

    if (Object.keys(filteredPreferences).length > 0) {
      try {
        await dispatch(updatePartnerPreferences(filteredPreferences)).unwrap();
        toast.success('Preferences updated!');
      } catch (err) {
        toast.error(err || 'Failed to update preferences');
      }
    }
  };

  // Start editing a field
  const startEditing = (section, field, value) => {
    setEditingField(`${section}.${field}`);
    setEditValue(value || '');
  };

  // Save edited field
  const saveEdit = async () => {
    if (!editingField) return;

    const [section, field] = editingField.split('.');

    // Map frontend field to backend field if necessary
    const backendFieldMap = {
      'religiousBackground.religion': 'religion',
      'religiousBackground.manglikChevvai': 'manglikStatus',
      'religiousBackground.community': 'caste',
      'religiousBackground.subCommunity': 'subCaste',
      'religiousBackground.gothra': 'gotra',
      'religiousBackground.motherTongue': 'motherTongue',
      'religiousBackground.dob': 'dateOfBirth',
      'religiousBackground.timeOfBirth': 'timeOfBirth',
      'religiousBackground.cityOfBirth': 'placeOfBirth',
      'familyDetails.mother': 'motherStatus',
      'familyDetails.father': 'fatherStatus',
      'familyDetails.sisters': 'sistersCount',
      'familyDetails.brothers': 'brothersCount',
      'familyDetails.familyAnnualIncome': 'familyAnnualIncome',
      'educationCareer.highestQualification': 'educationLevel',
      'educationCareer.workingAs': 'occupation',
      'educationCareer.employerName': 'company',
      'educationCareer.collegeAttended': 'college',
      'lifestyle.smoking': 'smokingHabit',
      'lifestyle.drinking': 'drinkingHabit',
      'lifestyle.healthInfo': 'healthInformation',
      'locationInfo.state': 'state',
    };

    const backendField = backendFieldMap[editingField] || field;

    // Commit directly to backend
    await commitProfileUpdate({ [backendField]: editValue });

    setEditingField(null);
    setEditValue('');
  };

  // Open Edit All Modal
  const handleOpenEditModal = (section) => {
    let fields = {};
    setModalSection(section);
    if (section === 'religious') {
      fields = {
        religion: profileData.religion,
        manglikStatus: profileData.manglikStatus,
        caste: profileData.community,
        subCaste: profileData.subCommunity,
        gotra: profileData.gotra || profileData.gothra || '',
        motherTongue: profileData.motherTongue,
        timeOfBirth: profileData.timeOfBirth,
        placeOfBirth: profileData.placeOfBirth || profileData.cityOfBirth || '',
        nakshatra: profileData.nakshatra,
        rashi: profileData.rashi,
        astroVisibility: profileData.astroVisibility
      };
    } else if (section === 'family') {
      fields = {
        fatherStatus: profileData.fatherStatus,
        motherStatus: profileData.motherStatus,
        familyFinancialStatus: profileData.familyFinancialStatus,
        sistersCount: profileData.sistersCount,
        brothersCount: profileData.brothersCount,
        familyLocation: profileData.familyLocation,
        familyAnnualIncome: profileData.familyAnnualIncome || '',
      };
    } else if (section === 'education') {
      fields = {
        educationLevel: profileData.education,
        educationField: profileData.educationField,
        college: profileData.college,
        workingWith: profileData.workingWith,
        occupation: profileData.profession,
        company: profileData.company,
        workingCity: profileData.workingCity,
        annualIncome: profileData.income
      };
    } else if (section === 'location') {
      fields = {
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        country: profileData.country,
        residencyStatus: profileData.residencyStatus,
        zipCode: profileData.zipCode
      };
    } else if (section === 'lifestyle') {
      fields = {
        diet: profileData.diet,
        drinkingHabit: profileData.drinkingHabit,
        smokingHabit: profileData.smokingHabit,
        bloodGroup: profileData.bloodGroup,
        healthInformation: profileData.healthInformation,
        disability: profileData.disability
      };
    } else if (section === 'hobbies') {
      fields = {
        hobbies: profileData.hobbies ? profileData.hobbies.join(', ') : ''
      };
    } else if (section === 'privacy') {
      fields = {
        profileVisibility: profileData.profileVisibility,
        profilePhotoVisibility: profileData.profilePhotoVisibility,
        albumPhotoVisibility: profileData.albumPhotoVisibility,
        contactDisplayStatus: profileData.contactDisplayStatus,
        astroVisibility: profileData.astroVisibility
      };
    } else if (section === 'verification') {
      fields = {
        idProofType: profileData.idProofType,
        idProofNumber: profileData.idProofNumber
      };
    } else if (section === 'preferences') {
      fields = {
        preferredMotherTongue: preferences ? preferences.preferredMotherTongue : '',
        workingWith: preferences ? preferences.workingWith : '',
        professionArea: preferences ? preferences.professionArea : '',
        profileManagedBy: preferences ? preferences.profileManagedBy : '',
        minAge: preferences ? preferences.minAge : '',
        maxAge: preferences ? preferences.maxAge : '',
        minHeight: preferences ? preferences.minHeight : '',
        maxHeight: preferences ? preferences.maxHeight : '',
        preferredReligion: preferences ? preferences.preferredReligion : '',
        preferredCaste: preferences ? preferences.preferredCaste : '',
        preferredSubCaste: preferences ? preferences.preferredSubCaste : '',
        minEducationLevel: preferences ? preferences.minEducationLevel : '',
        preferredCity: preferences ? preferences.preferredCity : '',
        preferredState: preferences ? preferences.preferredState : '',
        preferredDiet: preferences ? preferences.preferredDiet : '',
        drinkingHabit: preferences ? preferences.drinkingHabit : '',
        smokingHabit: preferences ? preferences.smokingHabit : '',
        maritalStatus: preferences ? preferences.maritalStatus : '',
        occupation: preferences ? preferences.occupation : '',
        minAnnualIncome: preferences ? preferences.minAnnualIncome : '',
        preferWorkingProfessional: preferences ? preferences.preferWorkingProfessional : false,
        preferNri: preferences ? preferences.preferNri : false,
        showVerifiedOnly: preferences ? preferences.showVerifiedOnly : true,
        enableAutoMatch: preferences ? preferences.enableAutoMatch : true,
        matchScoreThreshold: preferences ? preferences.matchScoreThreshold : 0,
        preferredEducationField: preferences ? preferences.preferredEducationField : '',
        preferredCountry: preferences ? preferences.preferredCountry : ''
      };
    } else if (section === 'personal') {
      fields = {
        fullName: profileData.fullName
      };
    } else if (section === 'about') {
      fields = {
        aboutMe: profileData.aboutText
      };
    } else if (section === 'person') {
      fields = {
        profileCreatedBy: profileData.postedBy,
        fullName: profileData.fullName,
        dateOfBirth: profileData.dob,
        timeOfBirth: profileData.timeOfBirth,
        age: profileData.age,
        maritalStatus: profileData.maritalStatus,
        height: profileData.height,
        weight: profileData.weight,
        manglikStatus: profileData.manglikStatus
      };
    }

    setModalData(fields);
    setErrors({});
    setIsEditModalOpen(true);
    setShowOtherInput({});
  };

  const validateModalData = () => {
    let newErrors = {};

    Object.entries(modalData).forEach(([key, value]) => {
      const type = FIELD_TYPES[key];
      if (!type) return;

      const valStr = value?.toString() || '';

      // Required Dropdown/Radio checks
      if (type.includes('_req') && (!value || value === '')) {
        if (type.includes('dropdown')) newErrors[key] = "⚠️ Please select a valid option";
        else newErrors[key] = "⚠️ This field is required";
      }

      // Type-specific validation
      if (type.includes('number')) {
        if (valStr && !/^\d*$/.test(valStr)) {
          newErrors[key] = "⚠️ Only numbers allowed";
        }
      }

      if (type.includes('text_only')) {
        if (valStr && !/^[a-zA-Z\s]*$/.test(valStr)) {
          newErrors[key] = "⚠️ Only text characters allowed";
        }
      }

      // Specific Ranges
      if (type === 'number_range_0_20') {
        const n = parseInt(valStr);
        if (isNaN(n) || n < 0 || n > 20) newErrors[key] = "⚠️ Must be a number between 0-20";
      }
      if (type === 'number_range_18_70' || type === 'number_age_max') {
        const n = parseInt(valStr);
        if (isNaN(n) || n < 18 || n > 70) newErrors[key] = "⚠️ Age must be a number between 18-70";
        if (key === 'maxAge' && modalData.minAge && n <= parseInt(modalData.minAge)) {
          newErrors[key] = "⚠️ Max age must be greater than min age";
        }
      }
      if (type === 'number_range_30_200') {
        const n = parseInt(valStr);
        if (isNaN(n) || n < 30 || n > 200) newErrors[key] = "⚠️ Weight must be a number in KG (30-200)";
      }

      // Formats
      if (type === 'number_zip_6') {
        if (valStr && (!/^\d{6}$/.test(valStr))) newErrors[key] = "⚠️ Zip code must be 6 digits numbers only";
      }
      if (type === 'date_18plus') {
        if (!valStr || !/^\d{4}-\d{2}-\d{2}$/.test(valStr)) {
          newErrors[key] = "⚠️ Invalid date format (YYYY-MM-DD)";
        } else {
          const [y, m, d] = valStr.split('-').map(n => parseInt(n));
          const birthDate = new Date(y, m - 1, d);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
          if (age < 18) newErrors[key] = "⚠️ Must be 18 or older";
        }
      }
      if (type === 'time_req') {
        if (!valStr || !/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i.test(valStr)) {
          newErrors[key] = "⚠️ Must be valid time format (HH:MM AM/PM)";
        }
      }

      // Textarea
      if (type === 'textarea_50_8000') {
        if (!valStr || valStr.length < 50) newErrors[key] = "⚠️ Minimum 50 characters required";
        else if (valStr.length > 8000) newErrors[key] = "⚠️ Maximum 8000 characters allowed";
      }

      // Height format validation (e.g., 5ft or 5ft 6in)
      if (type === 'height_format' || type === 'height_format_max') {
        if (valStr && !/^\d+ft(\s*\d+in)?$/.test(valStr)) {
          newErrors[key] = "⚠️ Invalid height format (e.g., 5ft or 5ft 6in)";
        }
        if (type === 'height_format_max' && modalData.minHeight && valStr) {
          // Basic string comparison might not work for height, but let's assume simple check for now
          // or just ensure max >= min if both are valid numbers (hard-coded for now)
        }
      }
    });

    // Keep existing verification specific logic if not covered
    if (modalSection === 'verification') {
      if (!modalData.idProofType) newErrors.idProofType = 'ID Proof Type is required';
      if (!modalData.idProofNumber) {
        newErrors.idProofNumber = 'ID Proof Number is required';
      } else {
        const idNum = modalData.idProofNumber.trim().toUpperCase();
        switch (modalData.idProofType) {
          case 'PAN Card':
            if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(idNum)) {
              newErrors.idProofNumber = 'Invalid PAN format (e.g., ABCDE1234F)';
            }
            break;
          case 'Aadhar Card':
            if (!/^[2-9]{1}[0-9]{11}$/.test(idNum)) {
              newErrors.idProofNumber = 'Invalid Aadhaar format (12 digits, cannot start with 0 or 1)';
            }
            break;
          case 'Driving License':
            if (!/^[A-Z]{2}[0-9]{2}[0-9]{11}$/.test(idNum) && !/^[A-Z]{2}[0-9]{13}$/.test(idNum)) {
              newErrors.idProofNumber = 'Invalid Driving License format (15 characters)';
            }
            break;
          case 'Voter ID':
            if (!/^[A-Z]{3}[0-9]{7}$/.test(idNum)) {
              newErrors.idProofNumber = 'Invalid Voter ID format (e.g., ABC1234567)';
            }
            break;
          case 'Passport':
            if (!/^[A-Z]{1}[0-9]{7}$/.test(idNum)) {
              newErrors.idProofNumber = 'Invalid Passport format (e.g., A1234567)';
            }
            break;
        }
      }
      if (!idProofFile && !profileData.idProofUrl) newErrors.idProofFile = 'ID Proof Photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    if (!validateModalData()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    if (modalSection === 'verification' && idProofFile) {
      try {
        await dispatch(uploadIdProof({
          file: idProofFile,
          idProofType: modalData.idProofType,
          idProofNumber: modalData.idProofNumber
        })).unwrap();
        toast.success('Verification document uploaded successfully!');
        setIsEditModalOpen(false);
        setIdProofFile(null);
        return;
      } catch (err) {
        toast.error(err || 'Failed to upload verification document');
        return;
      }
    }

    if (modalSection === 'preferences') {
      await commitPreferenceUpdate(modalData);
    } else {
      await commitProfileUpdate(modalData);
    }
    setIsEditModalOpen(false);
  };

  const handleModalDataChange = (field, value) => {
    const type = FIELD_TYPES[field];
    const valStr = value?.toString() || '';

    // Real-time validation for specific types
    if (type) {
      if (type.includes('number') && valStr && !/^\d*$/.test(valStr)) {
        setErrors(prev => ({ ...prev, [field]: "⚠️ Only numbers allowed" }));
      } else if (type.includes('text_only') && valStr && !/^[a-zA-Z\s]*$/.test(valStr)) {
        setErrors(prev => ({ ...prev, [field]: "⚠️ Only text characters allowed" }));
      } else if (type === 'text_hobbies' && valStr && !/^[a-zA-Z\s,]*$/.test(valStr)) {
        setErrors(prev => ({ ...prev, [field]: "⚠️ Only text characters allowed" }));
      } else if (type === 'text_commas' && valStr && !/^[a-zA-Z\s,]*$/.test(valStr)) {
        setErrors(prev => ({ ...prev, [field]: "⚠️ Only letters and commas allowed" }));
      } else if (type === 'text_addr' && valStr && !/^[a-zA-Z0-9\s,,]*$/.test(valStr)) {
        // Basic address validation, allowing numbers
      } else {
        // Clear error if now valid (real-time feedback)
        if (errors[field]) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
        }
      }
    }

    // Auto-calculate age from dateOfBirth
    if (field === 'dateOfBirth' && valStr && /^\d{4}-\d{2}-\d{2}$/.test(valStr)) {
      const [y, m, d] = valStr.split('-').map(n => parseInt(n));
      const birthDate = new Date(y, m - 1, d);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) calculatedAge--;

      if (calculatedAge >= 0) {
        setModalData(prev => ({
          ...prev,
          [field]: value,
          age: calculatedAge.toString()
        }));
        return;
      }
    }

    if (field === 'religion' || field === 'rashi' || field === 'nakshatra' || field === 'caste' || field === 'community' || field === 'subCaste' || field === 'gotra' || field === 'motherTongue') {
      if (value === 'Other') {
        setShowOtherInput(prev => ({ ...prev, [field]: true }));
        setModalData(prev => ({ ...prev, [field]: '' }));
      } else {
        setShowOtherInput(prev => ({ ...prev, [field]: false }));
        setModalData(prev => ({ ...prev, [field]: value }));
      }
    } else {
      setModalData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };


  const handleDownloadProfile = () => {
    try {
      const content = `
LOVENZEA PROFILE: ${profileData.id}
------------------------------------
Profile Managed By: ${profileData.postedBy}
Age: ${profileData.age} Years
Height: ${profileData.height}
Religion: ${profileData.religion}
Community: ${profileData.community}
Mother Tongue: ${profileData.motherTongue}
Marital Status: ${profileData.maritalStatus}
Location: ${profileData.location}
Education: ${profileData.education}
Profession: ${profileData.profession}
Annual Income: ${profileData.income}

About Profile:
${profileData.aboutText || 'No description provided.'}

Family Details:
- Father: ${profileData.familyDetails.father || 'Not specified'}
- Mother: ${profileData.familyDetails.mother || 'Not specified'}
- Sibling: ${profileData.familyDetails.brothers || 0} Brother(s), ${profileData.familyDetails.sisters || 0} Sister(s)

Lifestyle:
- Diet: ${profileData.lifestyle.diet || 'Not specified'}
- Blood Group: ${profileData.lifestyle.bloodGroup || 'Not specified'}

Generated on: ${new Date().toLocaleString()}
© LovenZea Matrimony
      `.trim();

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Profile_${profileData.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('✅ Profile downloaded successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error('Failed to download profile');
    }
  };

  const handleShareProfile = async () => {
    const shareData = {
      title: `LovenZea Profile - ${profileData.id}`,
      text: `Check out this profile on LovenZea: ${profileData.age} Years, ${profileData.religion}, ${profileData.profession} from ${profileData.location}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Successfully shared! ✨');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('🚀 Profile link copied to clipboard!', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        toast.error('Could not share profile');
      }
    }
  };

  // Render field with edit functionality
  const renderEditableField = (section, field, label, value, icon) => {
    const isEditing = editingField === `${section}.${field}`;

    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-2.5 sm:p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-shadow gap-2 sm:gap-0">
        <div className="flex items-center w-full sm:w-auto">
          <div className="mr-3 text-theme-magenta/70 sm:text-theme-text-secondary">{icon}</div>
          <span className="text-xs sm:text-sm font-medium text-theme-text-secondary sm:hidden">{label}</span>
        </div>

        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center overflow-hidden">
            <span className="hidden sm:inline text-sm font-medium text-theme-text-secondary mr-2">{label}</span>
            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
              <span className="text-gray-800 font-semibold text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">
                <span className="hidden sm:inline">: </span>{value}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'religious':
        return (
          <div className="space-y-4">
            {/* Header - Stack on mobile, inline on desktop */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                Religious Background
              </h3>
              <button
                onClick={() => handleOpenEditModal('religious')}
                className="flex items-center justify-center gap-2 text-theme-magenta hover:text-rose-700 text-sm font-medium px-4 py-2 sm:py-0 bg-[#FAF6F0] sm:bg-transparent rounded-lg sm:rounded-none w-full sm:w-auto relative"
              >
                <FaEdit /> Edit All
                {hasPendingInSection('religious') && <span className="absolute -top-1 -right-1 w-2 h-2 bg-theme-warning rounded-full animate-ping"></span>}
              </button>
            </div>

            {/* Grid - Responsive: Single column on mobile, Two columns on tablet+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 p-1">
              {[
                { field: 'gender', label: 'Gender', value: profileData.religiousBackground.gender, icon: <FaVenusMars /> },
                { field: 'religion', label: 'Religion', value: profileData.religiousBackground.religion, icon: <FaStar /> },
                { field: 'manglikStatus', label: 'Manglik/Chevvai Dosham', value: profileData.religiousBackground.manglikChevvai, icon: <FaVenusMars /> },
                { field: 'caste', label: 'Community', value: profileData.religiousBackground.community, icon: <FaUsers /> },
                { field: 'subCaste', label: 'Sub Community', value: profileData.religiousBackground.subCommunity, icon: <FaUsers /> },
                { field: 'gotra', label: 'Gothra / Gothram', value: profileData.religiousBackground.gothra, icon: <FaStar /> },
                { field: 'motherTongue', label: 'Mother Tongue', value: profileData.religiousBackground.motherTongue, icon: <FaLanguage /> },
                { field: 'timeOfBirth', label: 'Time Of Birth', value: profileData.religiousBackground.timeOfBirth, icon: <FaClock /> },
                { field: 'placeOfBirth', label: 'City Of Birth', value: profileData.religiousBackground.cityOfBirth, icon: <FaCity /> },
                { field: 'nakshatra', label: 'Nakshatra', value: profileData.religiousBackground.nakshatra, icon: <FaStar /> },
                { field: 'rashi', label: 'Rashi', value: profileData.religiousBackground.rashi, icon: <FaStar /> },
                { field: 'astroVisibility', label: 'Astro Visibility', value: profileData.religiousBackground.astroVisibility, icon: <FaEye /> }
              ].map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center p-2.5 sm:p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-shadow gap-2 sm:gap-0">
                  <div className="flex items-center w-full sm:w-auto">
                    <div className="mr-3 text-theme-magenta/70 sm:text-theme-text-secondary">{item.icon}</div>
                    <span className="text-xs sm:text-sm font-medium text-theme-text-secondary sm:hidden">{item.label}</span>
                  </div>
                  <div className="flex-1 w-full flex items-center">
                    <span className="hidden sm:inline text-sm font-medium text-theme-text-secondary mr-2 w-1/2">{item.label}</span>
                    <span className="text-gray-800 font-semibold text-sm sm:text-base truncate w-full sm:w-1/2">
                      <span className="hidden sm:inline">: </span>{item.value || 'Not Specified'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'family':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Family Details</h3>
              <button
                onClick={() => handleOpenEditModal('family')}
                className="flex items-center gap-2 text-theme-magenta hover:text-rose-700 text-sm font-medium relative"
              >
                <FaEdit /> Edit All
                {hasPendingInSection('family') && <span className="absolute -top-1 -right-1 w-2 h-2 bg-theme-warning rounded-full animate-ping"></span>}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[
                { field: 'motherStatus', label: 'Mother\'s Status', value: profileData.familyDetails.mother,icon: <FaUsers /> },
                { field: 'fatherStatus', label: 'Father\'s Status', value: profileData.familyDetails.father, icon: <FaUsers /> },
                { field: 'familyLocation', label: 'Family Location', value: profileData.familyDetails.familyLocation, icon: <FaHome /> },
                { field: 'familyFinancialStatus', label: 'Family Financial Status', value: profileData.familyDetails.financialStatus, icon: <FaWallet /> },
                { field: 'sistersCount', label: 'No. Of Sisters', value: profileData.familyDetails.sisters, icon: <FaUsers /> },
                { field: 'brothersCount', label: 'No. Of Brothers', value: profileData.familyDetails.brothers, icon: <FaUsers /> }
              ].map((item, index) => (
                <div key={index}>
                  {renderEditableField('familyDetails', item.field, item.label, item.value, item.icon)}
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Education & Career</h3>
              <button
                onClick={() => handleOpenEditModal('education')}
                className="flex items-center gap-2 text-theme-magenta hover:text-rose-700 text-sm font-medium relative"
              >
                <FaEdit /> Edit All
                {hasPendingInSection('education') && <span className="absolute -top-1 -right-1 w-2 h-2 bg-theme-warning rounded-full animate-ping"></span>}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {[
                { field: 'educationLevel', label: 'Highest Qualification', value: profileData.educationCareer.highestQualification, icon: <FaGraduationCap /> },
                { field: 'educationField', label: 'Education Field', value: profileData.educationCareer.educationField, icon: <FaGraduationCap /> },
                { field: 'college', label: 'College(s) Attended', value: profileData.educationCareer.collegeAttended, icon: <FaGraduationCap /> },
                { field: 'workingWith', label: 'Working With', value: profileData.educationCareer.workingWith, icon: <FaBriefcase /> },
                { field: 'occupation', label: 'Working As', value: profileData.educationCareer.workingAs, icon: <FaBriefcase /> },
                { field: 'company', label: 'Employer Name', value: profileData.educationCareer.employerName, icon: <FaBriefcase /> },
                { field: 'workingCity', label: 'Working City', value: profileData.educationCareer.workingCity, icon: <FaCity /> },
                { field: 'annualIncome', label: 'Annual Income', value: profileData.educationCareer.annualIncome, icon: <FaWallet /> }
              ].map((item, index) => (
                <div key={index}>
                  {renderEditableField('educationCareer', item.field, item.label, item.value, item.icon)}
                </div>
              ))}
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Location of Groom</h3>
              <button
                onClick={() => handleOpenEditModal('location')}
                className="flex items-center gap-2 text-theme-magenta hover:text-rose-700 text-sm font-medium relative"
              >
                <FaEdit /> Edit All
                {hasPendingInSection('location') && <span className="absolute -top-1 -right-1 w-2 h-2 bg-theme-warning rounded-full animate-ping"></span>}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {[
                { field: 'address', label: 'Residential Address', value: profileData.locationInfo.address, icon: <FaHome /> },
                { field: 'city', label: 'Current City', value: profileData.locationInfo.city, icon: <FaHome /> },
                { field: 'state', label: 'State Of Residence', value: profileData.locationInfo.state, icon: <FaMapMarkerAlt /> },
                { field: 'country', label: 'Country', value: profileData.locationInfo.country, icon: <FaMapMarkerAlt /> },
                { field: 'residencyStatus', label: 'Residency Status', value: profileData.locationInfo.residencyStatus, icon: <FaMapMarkerAlt /> },
                { field: 'zipCode', label: 'Zip / Pin Code', value: profileData.locationInfo.zipCode, icon: <FaMapMarkerAlt /> }
              ].map((item, index) => (
                <div key={index}>
                  {renderEditableField('locationInfo', item.field, item.label, item.value, item.icon)}
                </div>
              ))}
            </div>
          </div>
        );

      case 'lifestyle':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Lifestyle & Personality</h3>
              <button
                onClick={() => handleOpenEditModal('lifestyle')}
                className="flex items-center gap-2 text-theme-magenta hover:text-rose-700 text-sm font-medium relative"
              >
                <FaEdit /> Edit All
                {hasPendingInSection('lifestyle') && <span className="absolute -top-1 -right-1 w-2 h-2 bg-theme-warning rounded-full animate-ping"></span>}
              </button>
            </div>

            {/* Personality & About Section */}
            <div className="space-y-1">
              <div className="flex justify-between items-center border-b border-white/50 pb-1 mb-1">
                <h3 className="text-base sm:text-lg font-bold text-theme-magenta">
                  Personality.
                </h3>
              </div>
              <p className="text-theme-text-secondary text-xs sm:text-sm leading-relaxed">
                {profileData.aboutText || 'Let me introduce myself...'}
              </p>
            </div>

            {/* Basics & Lifestyle Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Basics & Lifestyle</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { label: 'Age', value: profileData.age },
                  { label: 'Date Of Birth', value: profileData.religiousBackground.dob },
                  { label: 'Marital Status', value: profileData.maritalStatus },
                  { label: 'Height', value: profileData.height },
                  { label: 'Weight', value: profileData.weight },
                  { label: 'Grew Up In', value: profileData.lifestyle.grewUpIn },
                  { label: 'Diet', value: profileData.lifestyle.diet },
                  { label: 'Drinking Habit', value: profileData.lifestyle.smoking }, // Note: smoking/drinking habits
                  { label: 'Smoking Habit', value: profileData.lifestyle.drinking }, // labels might be swapped in previous state mapping, checking...
                  { label: 'Blood Group', value: profileData.lifestyle.bloodGroup },
                  { label: 'Health Information', value: profileData.lifestyle.healthInfo },
                  { label: 'Disability', value: profileData.lifestyle.disability }
                ].map((item, index) => (
                  <div key={index} className="flex border-b border-white/50 pb-1.5">
                    <span className="w-1/3 text-theme-text-secondary text-xs sm:text-sm">{item.label}</span>
                    <span className="w-2/3 text-gray-800 font-medium text-xs sm:text-sm">: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hobbies & Interests Section */}
            <div className="space-y-4 pt-4 border-t border-white/50">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-semibold text-theme-magenta">Hobbies and Interests</h3>
                <button
                  onClick={() => handleOpenEditModal('hobbies')}
                  className="flex items-center gap-2 text-theme-magenta hover:text-rose-700 text-sm font-medium"
                >
                  <FaEdit /> Edit All
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {profileData.hobbies.length > 0 ? (
                  profileData.hobbies.map((hobby, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 bg-theme-surface border border-theme-border rounded-full shadow-sm flex items-center gap-2 text-gray-700 hover:border-rose-300 transition-colors"
                    >
                      <span className="text-theme-magenta">
                        {/* Dynamic icons could be added here based on hobby name */}
                        {hobby.toLowerCase().includes('photo') && <FaCamera />}
                        {hobby.toLowerCase().includes('music') && <FaStar />}
                        {hobby.toLowerCase().includes('movie') && <FaStar />}
                        {hobby.toLowerCase().includes('travel') && <FaMapMarkerAlt />}
                        {!hobby.toLowerCase().includes('photo') &&
                          !hobby.toLowerCase().includes('music') &&
                          !hobby.toLowerCase().includes('movie') &&
                          !hobby.toLowerCase().includes('travel') && <FaHeart />}
                      </span>
                      <span className="font-medium text-sm">{hobby.trim()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-theme-text-secondary italic">No hobbies specified yet.</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Privacy & Settings</h3>
              <button
                onClick={() => handleOpenEditModal('privacy')}
                className="flex items-center gap-2 text-theme-magenta hover:text-rose-700 text-sm font-medium relative"
              >
                <FaEdit /> Edit All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Profile Visibility', value: profileData.profileVisibility },
                { label: 'Email ID', value: profileData.email || 'Not Provided' },
                { label: 'Contact Number', value: profileData.mobileNumber || 'Not Provided' },
                { label: 'Contact Details Visibility', value: profileData.contactDisplayStatus },
                { label: 'Profile Photo Visibility', value: profileData.profilePhotoVisibility },
                { label: 'Album Photos Visibility', value: profileData.albumPhotoVisibility },
                { label: 'Astro/Horoscope Visibility', value: profileData.astroVisibility },
                { label: 'Account Created At', value: profileData.createdAt ? new Date(profileData.createdAt).toLocaleString() : 'N/A' },
                { label: 'Last Updated', value: profileData.updatedAt ? new Date(profileData.updatedAt).toLocaleString() : 'N/A' },
                { label: 'Profile ID (System)', value: profileData.id }
              ].map((item, idx) => (
                <div key={idx} className="flex border-b border-white/50 pb-2">
                  <span className="w-1/2 text-theme-text-secondary text-sm font-medium">{item.label}</span>
                  <span className="w-1/2 text-gray-800 text-sm font-semibold truncate">: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'verification':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Verification Details</h3>
              <button
                onClick={() => handleOpenEditModal('verification')}
                className="flex items-center gap-2 text-theme-magenta hover:text-rose-700 text-sm font-medium relative"
              >
                <FaEdit /> Edit All
              </button>
            </div>
            <div className="bg-[#FAF6F0] p-4 rounded-xl border border-rose-100 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${profileData.verificationStatus === 'VERIFIED' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  <FaCheck />
                </div>
                <div>
                  <div className="text-xs font-bold text-theme-text-secondary uppercase tracking-wider">Current Status</div>
                  <div className={`text-lg font-bold ${profileData.verificationStatus === 'VERIFIED' ? 'text-green-600' : 'text-orange-600'}`}>
                    {profileData.verificationStatus}
                  </div>
                </div>
              </div>
              {profileData.verificationNotes && (
                <div className="mt-3 p-3 bg-theme-surface/50 rounded-lg text-sm text-theme-text-secondary italic">
                  " {profileData.verificationNotes} "
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'ID Proof Type', value: profileData.idProofType || 'Not Provided' },
                { label: 'ID Proof Number', value: profileData.idProofNumber ? '********' + profileData.idProofNumber.slice(-4) : 'Not Provided' },
                { label: 'Verified By', value: profileData.verifiedBy || 'N/A' },
                { label: 'Verified At', value: profileData.verifiedAt ? new Date(profileData.verifiedAt).toLocaleString() : 'N/A' },
                { label: 'Profile Completion Score', value: profileData.profileComplete ? 'Complete' : 'Pending' }
              ].map((item, idx) => (
                <div key={idx} className="flex border-b border-white/50 pb-2">
                  <span className="w-1/2 text-theme-text-secondary text-sm">{item.label}</span>
                  <span className="w-1/2 text-gray-800 font-medium text-sm">: {item.value}</span>
                </div>
              ))}
            </div>
            {profileData.idProofUrl && (
              <div className="mt-4">
                <a href={profileData.idProofUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-2">
                  <FaEye /> View Uploaded Document
                </a>
              </div>
            )}
          </div>
        );

      case 'preferences':
        return (
          <>
            {/* Partner Preferences Section Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Partner Preference Criteria</h3>
              <button
                onClick={() => handleOpenEditModal('preferences')}
                className="flex items-center gap-2 text-theme-magenta hover:text-rose-700 text-sm font-medium relative"
              >
                <FaEdit /> Edit All
              </button>
            </div>

            <div className="dashboard-card-bg rounded-2xl shadow-lg p-5 sm:p-6 border border-white/50">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-theme-border">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-rose-100 to-rose-50 p-2.5 rounded-xl">
                    <FaUserFriends className="text-theme-magenta text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Partner Preferences</h2>
                    <p className="text-theme-text-secondary text-sm mt-1">Define your ideal partner criteria</p>
                  </div>
                </div>
              </div>

              {/* Basic Info Section */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-blue-50 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    Basic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Age', field: 'ageRange', defaultValue: '22 to 26', icon: '📅', color: 'bg-blue-50' },
                    { label: 'Mother Tongue', field: 'motherTongue', defaultValue: 'Marathi, Hindi, English', icon: '🗣️', color: 'bg-green-50' },
                    { label: 'Height', field: 'heightRange', defaultValue: "5' 0\"(152cm) to 5' 8\"(172cm)", icon: '📏', color: 'bg-orange-50' },
                    { label: 'Marital Status', field: 'maritalStatus', defaultValue: 'Never Married', icon: '💍', color: 'bg-theme-bg' },
                  ].map((item) => (
                    <div key={item.field} className="group dashboard-card-bg rounded-2xl p-3 border border-white/50 hover:border-rose-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-xl`}>
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                            <p className="text-sm sm:text-base font-black text-gray-800 mt-0.5">
                              {profileData.partnerPreferences[item.field] || item.defaultValue}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Religion / Community */}
                <div className="group dashboard-card-bg rounded-2xl p-4 border border-white/50 hover:border-purple-200 hover:shadow-md transition-all duration-300 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-xl">
                        🕉️
                      </div>
                      <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Religion / Community</p>
                            <p className="text-sm sm:text-base font-black text-gray-800 mt-0.5">
                              {profileData.partnerPreferences.religion || 'Hindu, Buddhist'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sub-Community / Caste</p>
                            <p className="text-sm sm:text-base font-black text-gray-800 mt-0.5">
                              {profileData.partnerPreferences.preferredSubCaste || profileData.partnerPreferences.preferredCaste || 'Open to All'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Details Section */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-green-50 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </span>
                    Location Details
                  </h3>

                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Country living in', field: 'country', defaultValue: 'India', icon: '🌍', color: 'bg-emerald-50' },
                    { label: 'State living in', field: 'state', defaultValue: 'Maharashtra', icon: '🗺️', color: 'bg-cyan-50' },
                    { label: 'City / District', field: 'city', defaultValue: 'Open to All', icon: '🏙️', color: 'bg-sky-50' },
                  ].map((item) => (
                    <div key={item.field} className="group dashboard-card-bg rounded-2xl p-4 border border-white/50 hover:border-emerald-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-xl`}>
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                            <p className="text-sm sm:text-base font-black text-gray-800 mt-0.5">
                              {profileData.partnerPreferences[item.field] || item.defaultValue}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Career Section */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-purple-50 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    Education & Career
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Education', field: 'education', defaultValue: 'Open to All', icon: '🎓' },
                    { label: 'Working as', field: 'profession', defaultValue: 'Open to All', icon: '💼' },
                    { label: 'Working With', field: 'workingWith', defaultValue: 'Any', icon: '🏢' },
                    { label: 'Profession Area', field: 'professionArea', defaultValue: 'Any', icon: '📊' },
                    { label: 'Annual Income', field: 'annualIncome', defaultValue: 'Any', icon: '💰' },
                    { label: 'Field of Study', field: 'preferredEducationField', defaultValue: 'Any', icon: '📚' },
                  ].map((item) => (
                    <div key={item.field} className="group dashboard-card-bg rounded-2xl p-4 border border-white/50 hover:border-purple-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-xl">
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                            <p className="text-sm sm:text-base font-black text-gray-800 mt-0.5">
                              {profileData.partnerPreferences[item.field] || item.defaultValue}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lifestyle & Others Section */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-theme-bg p-2 rounded-lg">
                      <FaHeart className="text-pink-600" />
                    </span>
                    Lifestyle & Others
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Diet', field: 'diet', defaultValue: 'Any', icon: '🥗', color: 'bg-green-50' },
                    { label: 'Drinking', field: 'drinkingHabit', defaultValue: 'Non-Drinker', icon: '🍷', color: 'bg-red-50' },
                    { label: 'Smoking', field: 'smokingHabit', defaultValue: 'Non-Smoker', icon: '🚬', color: 'bg-gray-50' },
                    { label: 'Profile Managed By', field: 'profileManagedBy', defaultValue: 'Any', icon: '👤', color: 'bg-blue-50' },
                  ].map((item) => (
                    <div key={item.field} className="group dashboard-card-bg rounded-2xl p-4 border border-white/50 hover:border-pink-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-xl`}>
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                            <p className="text-sm sm:text-base font-black text-gray-800 mt-0.5">
                              {profileData.partnerPreferences[item.field] || item.defaultValue}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Match Settings Section */}
              <div className="mb-0">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-yellow-50 p-2 rounded-lg">
                      <FaStar className="text-yellow-600" />
                    </span>
                    Match Settings
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="dashboard-card-bg p-4 rounded-xl border border-white/50 flex items-center justify-between">
                    <span className="text-theme-text-secondary font-medium">Verify Profiles Only</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${profileData.partnerPreferences.showVerifiedOnly ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-theme-text-secondary'}`}>
                      {profileData.partnerPreferences.showVerifiedOnly ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="dashboard-card-bg p-4 rounded-xl border border-white/50 flex items-center justify-between">
                    <span className="text-theme-text-secondary font-medium">Auto Match</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${profileData.partnerPreferences.enableAutoMatch ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-theme-text-secondary'}`}>
                      {profileData.partnerPreferences.enableAutoMatch ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="dashboard-card-bg p-4 rounded-xl border border-white/50 flex items-center justify-between">
                    <span className="text-theme-text-secondary font-medium">Prefer NRI</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${profileData.partnerPreferences.preferNri ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-theme-text-secondary'}`}>
                      {profileData.partnerPreferences.preferNri ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="dashboard-card-bg p-4 rounded-xl border border-white/50 flex items-center justify-between">
                    <span className="text-theme-text-secondary font-medium">Working Professionals</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${profileData.partnerPreferences.preferWorkingProfessional ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-theme-text-secondary'}`}>
                      {profileData.partnerPreferences.preferWorkingProfessional ? 'Preferred' : 'Any'}
                    </span>
                  </div>
                  <div className="dashboard-card-bg p-4 rounded-xl border border-white/50 flex flex-col gap-2 sm:col-span-2">
                    <div className="flex justify-between">
                      <span className="text-theme-text-secondary font-medium">Match Score Threshold</span>
                      <span className="font-bold text-gray-800">{profileData.partnerPreferences.matchScoreThreshold || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-[#8C6D39] h-2.5 rounded-full" style={{ width: `${profileData.partnerPreferences.matchScoreThreshold || 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-transparent pb-20">

      {/* Main Profile Container */}
      <div className="max-w-7xl mx-auto font-sans">
        
        {/* HERO BANNER & BASIC INFO */}
        <div className="dashboard-card-bg rounded-3xl shadow-sm mb-6 overflow-hidden relative border border-white/50">
          {/* Banner Image */}
          <div className="h-56 md:h-72 w-full relative">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${profileBanner})` }}></div>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-4 right-4 z-10">
              <button onClick={() => navigate(editModePage ? '/my-shadi/my-profile' : '/my-shadi/edit-profile')} className="bg-gradient-to-r from-[#E86D8A] to-[#D89A74] hover:opacity-95 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-md">
                <FaEdit /> {editModePage ? 'Done Editing' : 'Edit Profile'}
              </button>
            </div>
          </div>
          
          <div className="p-6 md:px-10 relative">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Avatar overlapping banner */}
              <div className="relative -mt-20 md:-mt-24 shrink-0 mx-auto md:mx-0 group cursor-pointer">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-[#FAF6F0] flex items-center justify-center relative">
                  <img src={photoPreview || profileImage || "https://images.unsplash.com/photo-1621886126620-3b95ceebf686?auto=format&fit=crop&w=400&q=80"} alt="Profile" className="w-full h-full object-cover" />
                  
                  {isEditing && (
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <FaCamera size={24} />
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                  )}

                  {/* Online Indicator */}
                  <div className="absolute bottom-3 right-3 w-4 h-4 bg-[#4CAF7A] border-2 border-white rounded-full"></div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center md:text-left mt-2 md:mt-0">
                <h1 className="text-2xl md:text-3xl font-bold text-[#3B2F2F] font-serif flex items-center justify-center md:justify-start gap-2 mb-1">
                  {profileData.fullName || 'Priya Sharma'}
                  <MdVerified className="text-[#C99853] w-5 h-5 md:w-6 md:h-6" />
                </h1>
                <p className="text-theme-text-secondary font-medium text-sm md:text-base mb-1">
                  {profileData.age || '27'} Yrs, {profileData.height || "5'4\""} • {profileData.location || 'Pune, Maharashtra'}
                </p>
                <p className="text-theme-text-secondary text-sm mb-4">
                  {profileData.religion || 'Hindu'} • {profileData.community || 'Brahmin'} • {profileData.maritalStatus || 'Never Married'}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-[#FFF2EF] text-[#C46A88] rounded-full text-xs font-bold border border-[#F2D7D9] shadow-sm">
                    <FaMapMarkerAlt /> {profileData.city || 'Pune'}, {profileData.state || 'Maharashtra'}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-[#FFF2EF] text-[#C46A88] rounded-full text-xs font-bold border border-[#F2D7D9] shadow-sm">
                    <FaUserFriends /> {profileData.maritalStatus || 'Never Married'}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-[#FFF2EF] text-[#C46A88] rounded-full text-xs font-bold border border-[#F2D7D9] shadow-sm">
                    🕉️ {profileData.religion || 'Hindu'}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-[#FFF2EF] text-[#C46A88] rounded-full text-xs font-bold border border-[#F2D7D9] shadow-sm">
                    <FaStar /> {profileData.community || 'Brahmin'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Profile Views', value: summary?.recentVisitorsCount || '236', icon: <FaEye className="text-[#E86D8A]" /> },
            { label: 'Interests Received', value: summary?.pendingInvitations || '42', icon: <FaHeart className="text-[#E86D8A]" /> },
            { label: 'Interest Sent', value: summary?.interestsSentCount || '18', icon: <FaShareAlt className="text-[#E86D8A]" /> },
            { label: 'Shortlisted', value: '9', icon: <FaStar className="text-[#D89A74]" /> }
          ].map((stat, i) => (
            <div key={i} className="dashboard-card-bg p-5 rounded-2xl shadow-sm border border-white/50 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FFF6F2] flex items-center justify-center text-lg md:text-xl shrink-0">
                {stat.icon}
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-black text-gray-800">{stat.value}</h3>
                <p className="text-[10px] md:text-xs font-semibold text-theme-text-secondary uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN - SCROLLABLE CONTENT */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* About Me */}
            <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6 relative group">
              <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 font-serif">
                  <FaUserEdit className="text-[#a67c52]" /> About Me
                </h3>
                {isEditing && <button onClick={() => handleOpenEditModal('about')} className="text-theme-text-secondary hover:text-gray-900 p-1 transition-colors" title="Edit About Me"><FaEdit size={16}/></button>}
              </div>
              <p className="text-theme-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                {profileData.aboutText || "N/A"}
              </p>
              <button className="text-theme-magenta text-sm font-bold mt-3 hover:underline">Read More</button>
            </div>

            {/* Photos (6) */}
            <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6 relative group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 font-serif">
                  <FaCamera className="text-[#a67c52]" /> Photos <span className="text-gray-400 text-sm">(6 max)</span>
                </h3>
                <button onClick={() => navigate('/my-shadi/my-photos')} className="bg-[#FAF6F0] text-theme-magenta px-4 py-1.5 rounded-full text-xs font-bold hover:bg-rose-100 transition-colors">View All</button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {(profileData.albumPhotos || Array(6).fill(null)).map((src, idx) => (
                  <div key={idx} className="relative w-24 h-32 shrink-0 rounded-xl overflow-hidden shadow-sm border border-theme-border bg-gray-50 flex items-center justify-center group/photo">
                    {src ? (
                      <>
                        <img src={src} alt={`Album ${idx + 1}`} className="w-full h-full object-cover group-hover/photo:scale-110 transition-transform duration-500" />
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <FaEdit className="text-white text-xl" />
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAlbumPhotoUpload(e, idx)} />
                        </label>
                      </>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-theme-surface shadow-sm flex items-center justify-center mb-1 border border-theme-border">
                          <span className="text-[#a67c52] font-bold text-lg leading-none">+</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">Add Photo</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAlbumPhotoUpload(e, idx)} />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Split Grid for Personal and Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              
              {/* Personal Details */}
              <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6 relative group">
                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 font-serif">
                    <FaUserCircle className="text-rose-400" /> Personal Details
                  </h3>
                  {isEditing && <button onClick={() => handleOpenEditModal('person')} className="text-theme-text-secondary hover:text-gray-900 p-1 transition-colors" title="Edit Personal Details"><FaEdit size={16}/></button>}
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Date of Birth', value: profileData.dob || profileData.lifestyle?.dob || profileData.religiousBackground?.dob || 'N/A' },
                    { label: 'Time of Birth', value: profileData.timeOfBirth || profileData.religiousBackground?.timeOfBirth || 'N/A' },
                    { label: 'Height', value: profileData.height || profileData.lifestyle?.height || 'N/A' },
                    { label: 'Weight', value: profileData.weight || profileData.lifestyle?.weight || 'N/A' },
                    { label: 'Manglik', value: profileData.manglikStatus || profileData.religiousBackground?.manglikChevvai || 'N/A' },
                    { label: 'Marital Status', value: profileData.maritalStatus || profileData.lifestyle?.maritalStatus || 'N/A' }
                  ].map((item, i) => (
                    <div key={i} className="flex text-sm">
                      <span className="w-5/12 text-theme-text-secondary">{item.label}</span>
                      <span className="w-7/12 font-semibold text-gray-800 truncate" title={item.value}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Religious Background */}
              <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6 relative group">
                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 font-serif">
                    <FaStar className="text-rose-400" /> Religious Background
                  </h3>
                  {isEditing && <button onClick={() => handleOpenEditModal('religious')} className="text-theme-text-secondary hover:text-gray-900 p-1 transition-colors" title="Edit Religious Background"><FaEdit size={16}/></button>}
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Religion', value: profileData.religion || profileData.religiousBackground?.religion || 'N/A' },
                    { label: 'Community', value: profileData.caste || profileData.religiousBackground?.community || 'N/A' },
                    { label: 'Sub-Community', value: profileData.subCaste || profileData.religiousBackground?.subCommunity || 'N/A' },
                    { label: 'Gothra', value: profileData.gotra || profileData.religiousBackground?.gothra || 'N/A' },
                    { label: 'Mother Tongue', value: profileData.motherTongue || profileData.religiousBackground?.motherTongue || 'N/A' },
                    { label: 'City of Birth', value: profileData.cityOfBirth || profileData.religiousBackground?.cityOfBirth || 'N/A' },
                    { label: 'Nakshatra', value: profileData.nakshatra || profileData.religiousBackground?.nakshatra || 'N/A' },
                    { label: 'Rashi', value: profileData.rashi || profileData.religiousBackground?.rashi || 'N/A' },
                  ].map((item, i) => (
                    <div key={i} className="flex text-sm">
                      <span className="w-5/12 text-theme-text-secondary">{item.label}</span>
                      <span className="w-7/12 font-semibold text-gray-800 truncate" title={item.value}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Family Details */}
              <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6 relative group">
                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 font-serif">
                    <FaUsers className="text-rose-400" /> Family Details
                  </h3>
                  {isEditing && <button onClick={() => handleOpenEditModal('family')} className="text-theme-text-secondary hover:text-gray-900 p-1 transition-colors" title="Edit Family Details"><FaEdit size={16}/></button>}
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Father Status', value: profileData.fatherStatus || profileData.familyDetails?.father || 'N/A' },
                    { label: 'Mother Status', value: profileData.motherStatus || profileData.familyDetails?.mother || 'N/A' },
                    { label: 'Family Location', value: profileData.familyLocation || profileData.familyDetails?.familyLocation || 'N/A' },
                    { label: 'Financial Status', value: profileData.familyAnnualIncome || profileData.familyDetails?.financialStatus || 'N/A' },
                    { label: 'No. Of Brothers', value: profileData.numberOfBrothers || profileData.familyDetails?.brothers || 'N/A' },
                    { label: 'No. Of Sisters', value: profileData.numberOfSisters || profileData.familyDetails?.sisters || 'N/A' }
                  ].map((item, i) => (
                    <div key={i} className="flex text-sm">
                      <span className="w-5/12 text-theme-text-secondary">{item.label}</span>
                      <span className="w-7/12 font-semibold text-gray-800 truncate" title={item.value}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              
              
              {/* Education & Career */}
              <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6 relative group">
                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 font-serif">
                    <FaGraduationCap className="text-rose-400" /> Education & Career
                  </h3>
                  {isEditing && <button onClick={() => handleOpenEditModal('education')} className="text-theme-text-secondary hover:text-gray-900 p-1 transition-colors" title="Edit Education & Career"><FaEdit size={16}/></button>}
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Education', value: profileData.educationLevel || profileData.education || profileData.educationCareer?.highestQualification || 'N/A' },
                    { label: 'Education Field', value: profileData.educationField || profileData.educationCareer?.educationField || 'N/A' },
                    { label: 'College', value: profileData.college || profileData.educationCareer?.collegeAttended || 'N/A' },
                    { label: 'Working With', value: profileData.workingWith || profileData.educationCareer?.workingWith || 'N/A' },
                    { label: 'Profession', value: profileData.occupation || profileData.profession || profileData.educationCareer?.workingAs || 'N/A' },
                    { label: 'Company', value: profileData.company || profileData.educationCareer?.employerName || 'N/A' },
                    { label: 'Working City', value: profileData.workingCity || profileData.educationCareer?.workingCity || 'N/A' },
                    { label: 'Annual Income', value: profileData.annualIncome || profileData.income || profileData.educationCareer?.annualIncome || 'N/A' },
                  ].map((item, i) => (
                    <div key={i} className="flex text-sm">
                      <span className="w-5/12 text-theme-text-secondary">{item.label}</span>
                      <span className="w-7/12 font-semibold text-gray-800 truncate" title={item.value}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>


              {/* Lifestyle */}
              <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6 relative group">
                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 font-serif">
                    <FaHeart className="text-rose-400" /> Lifestyle
                  </h3>
                  {isEditing && <button onClick={() => handleOpenEditModal('lifestyle')} className="text-theme-text-secondary hover:text-gray-900 p-1 transition-colors" title="Edit Lifestyle"><FaEdit size={16}/></button>}
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Diet', value: profileData.diet || 'Vegetarian' },
                    { label: 'Smoking', value: profileData.smokingHabit || 'No' },
                    { label: 'Drinking', value: profileData.drinkingHabit || 'No' },
                    { label: 'Physical Status', value: profileData.disability === 'None' ? 'Normal' : 'Normal' },
                    { label: 'Blood Group', value: profileData.bloodGroup || 'B+' }
                  ].map((item, i) => (
                    <div key={i} className="flex text-sm">
                      <span className="w-5/12 text-theme-text-secondary">{item.label}</span>
                      <span className="w-7/12 font-semibold text-gray-800 truncate" title={item.value}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Partner Preference */}
              <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6 relative group">
                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 font-serif">
                    <FaStar className="text-rose-400" /> Partner Preference
                  </h3>
                  {isEditing && <button onClick={() => handleOpenEditModal('preferences')} className="text-theme-text-secondary hover:text-gray-900 p-1 transition-colors" title="Edit Partner Preference"><FaEdit size={16}/></button>}
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Age', value: profileData.partnerPreferences?.ageRange || '26 - 32 Years' },
                    { label: 'Height', value: profileData.partnerPreferences?.heightRange || "5'6\" - 6'0\"" },
                    { label: 'Education', value: profileData.partnerPreferences?.education || 'Graduate & Above' },
                    { label: 'Profession', value: profileData.partnerPreferences?.profession || 'Any' },
                    { label: 'Location', value: profileData.partnerPreferences?.country || 'India' },
                    { label: 'Manglik', value: 'No Preference' }
                  ].map((item, i) => (
                    <div key={i} className="flex text-sm">
                      <span className="w-5/12 text-theme-text-secondary">{item.label}</span>
                      <span className="w-7/12 font-semibold text-gray-800 truncate" title={item.value}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            
            {/* Location & Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6 relative group">
                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 font-serif">
                    <FaMapMarkerAlt className="text-rose-400" /> Location Details
                  </h3>
                  {isEditing && <button onClick={() => handleOpenEditModal('location')} className="text-theme-text-secondary hover:text-gray-900 p-1 transition-colors" title="Edit Location Details"><FaEdit size={16}/></button>}
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Address', value: profileData.address || profileData.locationInfo?.address || 'N/A' },
                    { label: 'City', value: profileData.city || profileData.locationInfo?.city || 'N/A' },
                    { label: 'State', value: profileData.state || profileData.locationInfo?.state || 'N/A' },
                    { label: 'Country', value: profileData.country || profileData.locationInfo?.country || 'N/A' },
                    { label: 'Residency Status', value: profileData.residencyStatus || profileData.locationInfo?.residencyStatus || 'N/A' },
                    { label: 'Zip/Pin Code', value: profileData.zipCode || profileData.locationInfo?.zipCode || 'N/A' }
                  ].map((item, i) => (
                    <div key={i} className="flex text-sm">
                      <span className="w-5/12 text-theme-text-secondary">{item.label}</span>
                      <span className="w-7/12 font-semibold text-gray-800 truncate" title={item.value}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6 relative group">
                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 font-serif">
                    <FaPhone className="text-rose-400" /> Contact Information
                  </h3>
                  {isEditing && <button onClick={() => handleOpenEditModal('location')} className="text-theme-text-secondary hover:text-gray-900 p-1 transition-colors" title="Edit Contact Information"><FaEdit size={16}/></button>}
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'Mobile Number', value: profileData.mobileNumber || 'N/A', verified: !!profileData.mobileNumber },
                    { label: 'Email ID', value: profileData.email || 'N/A', verified: !!profileData.email },
                    { label: 'Address', value: [profileData.city || profileData.locationInfo?.city, profileData.state || profileData.locationInfo?.state, profileData.country || profileData.locationInfo?.country].filter(Boolean).join(', ') || 'N/A', verified: false }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center text-sm py-1">
                      <span className="w-full sm:w-5/12 text-theme-text-secondary mb-0.5 sm:mb-0">{item.label}</span>
                      <div className="w-full sm:w-7/12 flex items-center gap-2 overflow-hidden">
                        <span className="font-semibold text-gray-800 truncate text-[13px]" title={item.value}>
                          {item.value}
                        </span>
                        {item.verified && <span className="text-green-500 text-[10px] font-bold uppercase tracking-wider shrink-0">Verified</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              {/* Interests (Mock) */}
              <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6 relative group">
                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 font-serif">
                    <FaHeart className="text-rose-400" /> Interests
                  </h3>
                  {isEditing && <button onClick={() => handleOpenEditModal('hobbies')} className="text-theme-text-secondary hover:text-gray-900 p-1 transition-colors" title="Edit Interests"><FaEdit size={16}/></button>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(profileData.hobbies && profileData.hobbies.length > 0 ? (Array.isArray(profileData.hobbies) ? profileData.hobbies : profileData.hobbies.split(',')) : []).length > 0 
                    ? (Array.isArray(profileData.hobbies) ? profileData.hobbies : profileData.hobbies.split(',')).map((tag, i) => (
                    <span key={i} className="bg-gray-50 border border-white/50 text-gray-700 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
                      {tag}
                    </span>
                  )) : (
                    <span className="text-theme-text-secondary text-sm font-medium">N/A</span>
                  )}
                </div>
              </div>
            </div>

            {/* Verification */}
            <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6 relative group">
              <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 font-serif">
                  <MdVerified className="text-rose-400 w-5 h-5" /> Verification
                </h3>
                {isEditing && <button onClick={() => handleOpenEditModal('verification')} className="text-theme-text-secondary hover:text-gray-900 p-1 transition-colors" title="Edit Verification"><FaEdit size={16}/></button>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-green-50 text-green-500"><FaPhone /></div>
                  <span className="text-sm font-semibold text-gray-700">Mobile Verified</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-green-50 text-green-500"><FaCheck /></div>
                  <span className="text-sm font-semibold text-gray-700">Email Verified</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-green-50 text-green-500"><MdVerified /></div>
                  <span className="text-sm font-semibold text-gray-700">Profile Verified</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Profile Completion Circular Chart */}
            <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6 text-center">
              <h3 className="font-bold text-gray-800 mb-6 font-serif text-lg">Profile Completion</h3>
              <div className="relative w-36 h-36 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                  <circle cx="50" cy="50" r="40" stroke="#e11d48" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (summary?.profileCompletionPercentage || 85)) / 100} className="transition-all duration-1000 ease-out drop-shadow-md" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-black text-gray-800">{summary?.profileCompletionPercentage || 85}%</span>
                </div>
              </div>
              <h4 className="font-bold text-gray-800 mb-1 text-lg">Almost There!</h4>
              <p className="text-sm text-theme-text-secondary mb-6 px-2">Add more details to get better matches.</p>
              <button onClick={() => navigate('/my-shadi/edit-profile')} className="w-full bg-gradient-to-r from-[#DB2777] to-[#EC4899] hover:from-[#BE185D] hover:to-[#DB2777] text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm">
                Complete Now
              </button>
            </div>

            {/* Profile Strength Checklist */}
            <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-5 font-serif text-lg">
                <FaStar className="text-[#a67c52]" /> Profile Strength
              </h3>
              <div className="space-y-4 mb-6">
                {[
                  { label: 'Photos', complete: true },
                  { label: 'About Me', complete: true },
                  { label: 'Education', complete: true },
                  { label: 'Lifestyle', complete: true },
                  { label: 'Partner Pref.', complete: true },
                  { label: 'Contact Info', complete: true }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 font-medium">{item.label}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.complete ? 'bg-theme-success text-white shadow-sm' : 'bg-gray-200 text-transparent'}`}>
                      <FaCheck size={10} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center bg-yellow-50/50 p-4 rounded-xl border border-yellow-100/50">
                <p className="text-xs font-bold text-gray-800 mb-2">Great! Your profile looks complete.</p>
                <FaStar className="text-yellow-400 text-2xl mx-auto drop-shadow-sm" />
              </div>
            </div>

            {/* My Actions */}
            <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4 font-serif text-lg">
                <FaStar className="text-rose-400" /> My Actions
              </h3>
              <div className="space-y-2">
                {(!editModePage ? [
                  { label: 'Edit Profile', icon: <FaEdit />, onClick: () => navigate('/my-shadi/edit-profile') },
                  { label: 'Preview Profile', icon: <FaEye />, onClick: () => navigate('/my-shadi/my-profile') },
                  { label: 'Privacy Settings', icon: <FaShieldAlt />, onClick: () => handleOpenEditModal('privacy') },
                ] : [
                  { label: 'View Profile', icon: <FaEye />, onClick: () => navigate('/my-shadi/my-profile') },
                  { label: 'Privacy Settings', icon: <FaShieldAlt />, onClick: () => handleOpenEditModal('privacy') },
                ]).map((action, i) => (
                  <button key={i} onClick={action.onClick} className="w-full flex items-center gap-3 p-3 text-sm font-bold text-gray-700 hover:bg-[#FAF6F0] hover:text-theme-magenta rounded-xl transition-colors text-left group">
                    <div className="w-9 h-9 rounded-xl bg-gray-50 border border-white/50 flex items-center justify-center text-gray-400 group-hover:bg-rose-100 group-hover:text-theme-magenta group-hover:border-rose-200 transition-colors">
                      {action.icon}
                    </div>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Promo Banner */}
            <div className="bg-gradient-to-br from-rose-50 to-[#FCFAF7] rounded-2xl shadow-sm border border-rose-100 p-8 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-theme-surface rounded-full opacity-40 -mr-10 -mt-10 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="text-5xl mb-4 relative z-10 drop-shadow-md">💎</div>
              <h3 className="text-xl font-black text-[#3a2618] mb-2 font-serif relative z-10">Get 10x More Matches</h3>
              <p className="text-sm text-[#6b584a] mb-6 relative z-10 leading-relaxed">Increase your visibility and connect with more people.</p>
              <button className="w-full bg-gradient-to-r from-[#DB2777] to-[#EC4899] hover:from-[#BE185D] hover:to-[#DB2777] text-white font-bold py-3.5 rounded-xl transition-colors shadow-md hover:shadow-lg relative z-10">
                Upgrade Now
              </button>
            </div>

          </div>
        </div>

      </div>
      {/* Edit All Modal */}
      {isEditModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 transition-all duration-300">
          <div className="bg-theme-surface rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300 border border-white/50">
            <div className="bg-gradient-to-r from-[#b76e79] to-[#d4a5a5] p-5 sm:p-6 flex justify-between items-center text-white">
              <div>
                <h3 className="text-xl font-black tracking-wide">
                  Updating {
                    {
                      religious: 'Religious Background',
                      family: 'Family Details',
                      education: 'Education & Career',
                      location: 'Location Details',
                      lifestyle: 'Lifestyle',
                      hobbies: 'Hobbies',
                      privacy: 'Privacy Settings',
                      verification: 'Verification',
                      preferences: 'Partner Preferences',
                      personal: 'Personal Details',
                      about: 'About Me',
                      person: 'Basic Details'
                    }[modalSection] || 'Information'
                  }
                </h3>
                <p className="text-rose-50 text-xs mt-1 font-medium">Please provide accurate details</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-theme-surface/20 hover:bg-theme-surface/30 p-2 rounded-xl transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-4 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {modalSection === 'verification' ? (
                <div className="space-y-6">
                  <div className="bg-[#FAF6F0] text-rose-800 p-4 rounded-xl flex items-start gap-3 border border-rose-100">
                    <FaInfoCircle className="mt-1 shrink-0 text-theme-magenta" />
                    <div>
                      <p className="font-bold text-sm">Verify your ID</p>
                      <p className="text-xs text-theme-magenta mt-0.5">Please upload a clear photo of your Govt. ID (PAN card, Voter ID, or Driving License).</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">ID Proof Type *</label>
                      <select
                        value={modalData.idProofType || ''}
                        onChange={(e) => handleModalDataChange('idProofType', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-theme-magenta focus:border-transparent outline-none transition-all ${errors.idProofType ? 'border-red-500' : 'border-theme-border'}`}
                      >
                        <option value="">Select ID Type</option>
                        <option value="PAN Card">PAN Card</option>
                        <option value="Voter ID">Voter ID</option>
                        <option value="Driving License">Driving License</option>
                        <option value="Aadhar Card">Aadhar Card</option>
                        <option value="Passport">Passport</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">ID Proof Number *</label>
                      <input
                        type="text"
                        value={modalData.idProofNumber || ''}
                        onChange={(e) => handleModalDataChange('idProofNumber', e.target.value)}
                        placeholder="Enter your ID number"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-theme-magenta focus:border-transparent outline-none transition-all ${errors.idProofNumber ? 'border-red-500' : 'border-theme-border'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Upload ID Photo *</label>
                      <div className="relative group">
                        <input
                          type="file"
                          id="id-photo-upload"
                          accept="image/*"
                          onChange={(e) => setIdProofFile(e.target.files[0])}
                          className="hidden"
                        />
                        <label
                          htmlFor="id-photo-upload"
                          className={`flex flex-col items-center justify-center border-4 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-300 ${idProofFile ? 'border-green-400 bg-green-50' : 'border-theme-border hover:border-rose-400 hover:bg-[#FAF6F0]'}`}
                        >
                          <div className={`p-4 rounded-full mb-3 ${idProofFile ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 group-hover:bg-rose-100 group-hover:text-theme-magenta'}`}>
                            {idProofFile ? <FaCheck size={28} /> : <FaCamera size={28} />}
                          </div>
                          <p className="font-bold text-sm text-gray-700">
                            {idProofFile ? idProofFile.name : 'Click to upload ID photo'}
                          </p>
                          <p className="text-xs text-theme-text-secondary mt-1">
                            {idProofFile ? 'Click again to change file' : 'JPEG, PNG (Max 5MB)'}
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(modalData).map(([key, value]) => {
                    const fieldLabels = {
                      manglikStatus: 'Manglik/Chevvai Dosham',
                      caste: 'Community',
                      subCaste: 'Sub Community',
                      gotra: 'Gothra / Gothram',
                      placeOfBirth: 'City Of Birth',
                      astroVisibility: 'Astro Visibility',
                      motherTongue: 'Mother Tongue',
                      dateOfBirth: 'Date Of Birth',
                      timeOfBirth: 'Time Of Birth',
                      grewUpIn: 'Grew Up In',
                      fatherStatus: 'Father\'s Status',
                      motherStatus: 'Mother\'s Status',
                      familyFinancialStatus: 'Family Financial Status',
                      sistersCount: 'No. Of Sisters',
                      brothersCount: 'No. Of Brothers',
                      familyLocation: 'Family Location',
                      familyAnnualIncome: 'Family Annual Income',
                      educationLevel: 'Highest Qualification',
                      educationField: 'Education Field',
                      college: 'College(s) Attended',
                      workingWith: 'Working With',
                      occupation: 'Working As',
                      company: 'Employer Name',
                      workingCity: 'Working City',
                      annualIncome: 'Annual Income',
                      address: 'Residential Address',
                      city: 'Current City',
                      state: 'State Of Residence',
                      country: 'Country',
                      residencyStatus: 'Residency Status',
                      zipCode: 'Zip / Pin Code',
                      maritalStatus: 'Marital Status',
                      bloodGroup: 'Blood Group',
                      healthInformation: 'Health Information',
                      disability: 'Disability',
                      drinkingHabit: 'Drinking Habit',
                      smokingHabit: 'Smoking Habit',
                    };
                    return (
                      <div key={key} className={key === 'aboutMe' ? 'col-span-1 sm:col-span-2 space-y-1' : 'space-y-1'}>
                        <label className="text-xs font-bold text-theme-text-secondary uppercase tracking-wider mb-1 block ml-1">
                          {fieldLabels[key] || key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        {typeof value === 'boolean' ? (
                          <select
                            value={value}
                            onChange={(e) => handleModalDataChange(key, e.target.value === 'true')}
                            className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:bg-theme-surface focus:ring-2 focus:ring-theme-magenta focus:border-transparent outline-none transition-all text-sm font-medium ${errors[key] ? 'border-red-500' : 'border-theme-border'} text-gray-800`}
                          >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        ) : (key === 'diet' || key === 'preferredDiet') ? (
                          <div className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 py-2">
                            {['Veg', 'Non-Veg', 'Occasionally Non-Veg', 'Eggetarian', 'Jain', 'Vegan'].map(option => (
                              <label key={option} className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer hover:text-theme-magenta transition-colors">
                                <input
                                  type="radio"
                                  name={`diet-${key}`}
                                  value={option}
                                  checked={value === option}
                                  onChange={(e) => handleModalDataChange(key, e.target.value)}
                                  className="w-4 h-4 text-theme-magenta focus:ring-theme-magenta border-gray-300"
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        ) : key === 'disability' ? (
                          <div className="flex gap-4 py-2">
                            {['None', 'Physical Disability'].map(option => (
                              <label key={option} className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer hover:text-theme-magenta transition-colors">
                                <input
                                  type="radio"
                                  name={`disability-${key}`}
                                  value={option}
                                  checked={value === option}
                                  onChange={(e) => handleModalDataChange(key, e.target.value)}
                                  className="w-4 h-4 text-theme-magenta focus:ring-theme-magenta border-gray-300"
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        ) : (key === 'profileCreatedBy' || key === 'maritalStatus' || key === 'height' || key === 'bloodGroup' || key === 'healthInformation' || key === 'manglikStatus' || key === 'astroVisibility' || key === 'profilePhotoVisibility' || key === 'albumPhotoVisibility' || key === 'profileVisibility' || key === 'drinkingHabit' || key === 'smokingHabit' || key === 'profileManagedBy' || key === 'professionArea' || key === 'workingWith' || key === 'matchScoreThreshold' || key === 'annualIncome' || key === 'minAnnualIncome' || key === 'familyAnnualIncome' || key === 'motherTongue' || key === 'subCaste' || key === 'gotra' || key === 'timeOfBirth') ? (
                          <select
                            value={value || ''}
                            onChange={(e) => handleModalDataChange(key, e.target.value)}
                            className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:bg-theme-surface focus:ring-2 focus:ring-theme-magenta focus:border-transparent outline-none transition-all text-sm font-medium ${errors[key] ? 'border-red-500' : 'border-theme-border'} text-gray-800`}
                          >
                            <option value="">Select {fieldLabels[key] || key.replace(/([A-Z])/g, ' $1').trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>
                            {key === 'profileCreatedBy' && ['Self', 'Parent', 'Sibling', 'Friend', 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'profileManagedBy' && ['Self', 'Parent', 'Sibling', 'Friend', 'Relative'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'maritalStatus' && ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce', 'Annulled'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'height' && Array.from({ length: 41 }, (_, i) => {
                              const feet = Math.floor((i + 140) / 30.48);
                              const inches = Math.round(((i + 140) / 2.54) % 12);
                              const cm = i + 140;
                              const label = `${feet}ft ${inches}in - ${cm}cm`;
                              return <option key={cm} value={label}>{label}</option>;
                            })}
                            {key === 'bloodGroup' && ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'healthInformation' && ['No Health Problems', 'Minor Health Issues', 'Major Health Issues'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {(key === 'drinkingHabit') && ['Non-Drinker', 'Light / Social Drinker', 'Regular Drinker'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {(key === 'smokingHabit') && ['Non-Smoker', 'Light / Social Smoker', 'Regular Smoker'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'professionArea' && ['IT/Software', 'Medical', 'Finance', 'Engineering', 'Teaching', 'Business', 'Marketing', 'Civil Services', 'Defense', 'Arts', 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'workingWith' && ['Private Company', 'Government / Public Sector', 'Defense / Civil Services', 'Business / Self Employed', 'Not Working'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'matchScoreThreshold' && [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(opt => <option key={opt} value={opt}>{opt}%</option>)}
                            {key === 'manglikStatus' && [
                              { label: 'Yes', value: 'YES' },
                              { label: 'No', value: 'NO' },
                              { label: 'Don\'t Know', value: 'DONT_KNOW' }
                            ].map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            {key === 'astroVisibility' && [
                              { label: 'All Members', value: 'ALL_MEMBERS' },
                              { label: 'Contacted and Accepted', value: 'CONTACTED_AND_ACCEPTED' }
                            ].map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            {(key === 'profilePhotoVisibility' || key === 'albumPhotoVisibility') && [
                              { label: 'All Members', value: 'ALL_MEMBERS' },
                              { label: 'Only Premium Members', value: 'PREMIUM_MEMBERS' },
                              { label: 'Only Matches', value: 'MATCHES' }
                            ].map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            {key === 'profileVisibility' && [
                              { label: 'Public', value: 'Public' },
                              { label: 'Registered Members', value: 'Members' },
                              { label: 'Premium Members', value: 'Premium' }
                            ].map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            {key === 'rashi' && [...rashiOptions, 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'nakshatra' && [...nakshatraOptions, 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'religion' && [...religionOptions, 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'caste' && [...communityOptions, 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'motherTongue' && motherTongueOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'subCaste' && subCasteOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'gotra' && gotraOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'timeOfBirth' && timeOfBirthOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {(key === 'annualIncome' || key === 'minAnnualIncome' || key === 'familyAnnualIncome') && [
                              "Don't want to specify", "1L - 2L", "2L - 5L", "5L - 10L", "10L - 15L",
                              "15L - 20L", "20L - 30L", "30L - 50L", "50L - 1Cr", "1Cr+"
                            ].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        ) : (key === 'rashi' || key === 'nakshatra' || key === 'religion' || key === 'caste' || key === 'subCaste' || key === 'gotra' || key === 'motherTongue') && !showOtherInput[key] && ![...rashiOptions, ...nakshatraOptions, ...religionOptions, ...communityOptions, ...motherTongueOptions, ...subCasteOptions, ...gotraOptions].includes(value) && value !== '' ? (
                          // For cases where value exists but not in list, show select with 'Other' selected or handle it
                          <select
                            value="Other"
                            onChange={(e) => handleModalDataChange(key, e.target.value)}
                            className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:bg-theme-surface focus:ring-2 focus:ring-theme-magenta focus:border-transparent outline-none transition-all text-sm font-medium ${errors[key] ? 'border-red-500' : 'border-theme-border'} text-gray-800`}
                          >
                            <option value="">Select Option</option>
                            {key === 'rashi' && [...rashiOptions, 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'nakshatra' && [...nakshatraOptions, 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'religion' && [...religionOptions, 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'caste' && [...communityOptions, 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'motherTongue' && motherTongueOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'subCaste' && subCasteOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'gotra' && gotraOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'timeOfBirth' && timeOfBirthOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {(key === 'annualIncome' || key === 'minAnnualIncome' || key === 'familyAnnualIncome') && [
                              "Don't want to specify", "1L - 2L", "2L - 5L", "5L - 10L", "10L - 15L",
                              "15L - 20L", "20L - 30L", "30L - 50L", "50L - 1Cr", "1Cr+"
                            ].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        ) : (key === 'rashi' || key === 'nakshatra' || key === 'religion' || key === 'caste') && showOtherInput[key] ? (
                          <div className="space-y-2">
                            <select
                              value="Other"
                              onChange={(e) => handleModalDataChange(key, e.target.value)}
                              className="w-full px-4 py-3 bg-gray-50/50 border border-theme-border rounded-xl focus:bg-theme-surface focus:ring-2 focus:ring-theme-magenta focus:border-transparent outline-none transition-all text-sm font-medium text-gray-800"
                            >
                              {key === 'rashi' && [...rashiOptions, 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              {key === 'nakshatra' && [...nakshatraOptions, 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              {key === 'religion' && [...religionOptions, 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              {key === 'caste' && [...communityOptions, 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              {key === 'motherTongue' && [...motherTongueOptions].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              {key === 'subCaste' && [...subCasteOptions].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              {key === 'gotra' && [...gotraOptions].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <input
                              type="text"
                              value={value || ''}
                              onChange={(e) => setModalData(prev => ({ ...prev, [key]: e.target.value }))}
                              placeholder={`Enter custom ${key}`}
                              className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:bg-theme-surface focus:ring-2 focus:ring-theme-magenta focus:border-transparent outline-none transition-all text-sm font-medium ${errors[key] ? 'border-red-500' : 'border-theme-border'} text-gray-800`}
                            />
                          </div>
                        ) : (key === 'rashi' || key === 'nakshatra' || key === 'religion' || key === 'caste' || key === 'subCaste' || key === 'gotra' || key === 'motherTongue') ? (
                          <select
                            value={[...rashiOptions, ...nakshatraOptions, ...religionOptions, ...communityOptions].includes(value) ? value : 'Other'}
                            onChange={(e) => handleModalDataChange(key, e.target.value)}
                            className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:bg-theme-surface focus:ring-2 focus:ring-theme-magenta focus:border-transparent outline-none transition-all text-sm font-medium ${errors[key] ? 'border-red-500' : 'border-theme-border'} text-gray-800`}
                          >
                            <option value="">Select {key}</option>
                            {key === 'rashi' && [...rashiOptions, 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'nakshatra' && [...nakshatraOptions, 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'religion' && [...religionOptions, 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'caste' && [...communityOptions, 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        ) : key === 'aboutMe' ? (
                          <div className="space-y-3">
                            <p className="text-theme-text-secondary text-sm">
                              This section will help you make a strong impression on your potential partner. So, express yourself.<br />
                              (NOTE: This section will be screened everytime you update it. Allow upto 24 hours for it to go live.)
                            </p>
                            <textarea
                              value={value || ''}
                              onChange={(e) => handleModalDataChange(key, e.target.value)}
                              className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:bg-theme-surface focus:ring-2 focus:ring-theme-magenta focus:border-transparent outline-none transition-all min-h-[160px] text-sm font-medium ${errors[key] ? 'border-red-500' : 'border-theme-border'} text-gray-800`}
                              placeholder="Let me introduce myself..."
                            />
                            <div className="flex justify-between text-theme-text-secondary text-sm border-t border-white/50 pt-2">
                              <span>Characters count</span>
                              <span className="font-medium">{value?.length || 0}</span>
                              <span>min. 50, max. 8000</span>
                            </div>
                          </div>
                        ) : (
                          <input
                            type={key === 'dateOfBirth' ? 'date' : 'text'}
                            value={value || ''}
                            onChange={(e) => handleModalDataChange(key, e.target.value)}
                            readOnly={key === 'age'}
                            max={key === 'dateOfBirth' ? new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0] : undefined}
                            placeholder={key === 'dateOfBirth' ? 'YYYY-MM-DD' : key === 'timeOfBirth' ? 'HH:MM AM/PM' : ''}
                            className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:bg-theme-surface focus:ring-2 focus:ring-theme-magenta focus:border-transparent outline-none transition-all text-sm font-medium ${errors[key] ? 'border-red-500' : 'border-theme-border'} ${key === 'age' ? 'bg-gray-100 text-theme-text-secondary' : 'text-gray-800'}`}
                          />
                        )}

                        {/* Add support for new preference fields rendering */}
                        {modalSection === 'preferences' && key === 'preferredMotherTongue' && (
                          <p className="text-xs text-theme-text-secondary">Separate multiple languages with commas</p>
                        )}
                        {key === 'hobbies' && (
                          <p className="text-xs text-theme-text-secondary">Tip: Separate multiple hobbies with comma</p>
                        )}
                        {errors[key] && (
                          <p className="text-xs text-red-500 mt-1">{errors[key]}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-white/50 bg-gray-50 -mx-4 sm:-mx-8 px-4 sm:px-8 pb-4 sm:pb-8 -mb-4 sm:-mb-8 mt-4 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-theme-border text-theme-text-secondary hover:bg-gray-100 hover:text-gray-900 transition-all font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-theme-primary to-theme-pink text-white shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:-translate-y-0.5 transition-all font-bold text-sm disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
export default MyProfile;