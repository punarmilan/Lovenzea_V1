import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator, 
  Platform,
  Alert,
  PanResponder,
  KeyboardAvoidingView,
  Keyboard,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../../src/context/AuthContext';
import { useRouter, useNavigation, useFocusEffect } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal, 
  Camera, 
  MapPin, 
  Eye, 
  Star, 
  MessageCircle, 
  Edit2, 
  X, 
  Plus, 
  Check, 
  LogOut,
  Sparkle,
  Sparkles,
  Compass,
  Users,
  Award,
  Smile,
  Activity,
  Heart,
  Phone,
  Mail,
  Map,
  Briefcase,
  Globe,
  Calendar,
  Clock,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  ChevronDown,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import api, { uploadProfilePhotoApi, uploadIdProofApi } from '../../../src/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { normalizePhotoUrl, getFallbackAvatar } from '../../../src/utils/imageUrl';

export default function Profile() {
  const { user, logout, updateUserData } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [profileData, setProfileData] = useState(null);
  const [subDetails, setSubDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [updating, setUpdating] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [activeTab, setActiveTab] = useState('Personal');
  const [sentCount, setSentCount] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const tabScrollRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Document Verification States
  const [showDocUploadModal, setShowDocUploadModal] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('Aadhar Card');
  const [docNumber, setDocNumber] = useState('');
  const [docFile, setDocFile] = useState(null);
  const [submittingDoc, setSubmittingDoc] = useState(false);

  const DOC_TYPES = [
    { label: 'Aadhaar Card', value: 'Aadhar Card', placeholder: '12-digit Aadhaar Number' },
    { label: 'PAN Card', value: 'PAN Card', placeholder: '10-digit PAN (e.g. ABCDE1234F)' },
    { label: 'Passport', value: 'Passport', placeholder: 'Passport Number (e.g. A1234567)' },
    { label: 'Driving License', value: 'Driving License', placeholder: 'Driving License Number' },
    { label: 'Voter ID', value: 'Voter ID', placeholder: 'Voter ID (e.g. ABC1234567)' },
  ];

  const handlePickDocImage = () => {
    Alert.alert('Upload Document', 'Choose document photo source', [
      { text: 'Camera', onPress: () => openDocPicker('camera') },
      { text: 'Gallery', onPress: () => openDocPicker('gallery') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openDocPicker = async (source) => {
    const options = { mediaTypes: ['images'], allowsEditing: false, quality: 0.8 };
    let result;
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: 'Camera permission denied' });
        return;
      }
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: 'Gallery permission denied' });
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled && result.assets.length > 0) {
      setDocFile(result.assets[0]);
    }
  };

  const handleSubmitVerificationDoc = async () => {
    if (!docFile) {
      Toast.show({ type: 'error', text1: 'Document Required', text2: 'Please upload a photo of your ID document' });
      return;
    }
    if (!docNumber.trim()) {
      Toast.show({ type: 'error', text1: 'ID Number Required', text2: 'Please enter your document ID number' });
      return;
    }

    try {
      setSubmittingDoc(true);
      const updatedProfile = await uploadIdProofApi(docFile, selectedDocType, docNumber.trim().toUpperCase());
      setProfileData(updatedProfile);
      setShowDocUploadModal(false);
      setDocFile(null);
      setDocNumber('');
      Toast.show({ 
        type: 'success', 
        text1: 'Document Submitted!', 
        text2: 'Admin will verify your identity within 24 hours.' 
      });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit document';
      Toast.show({ type: 'error', text1: 'Submission Failed', text2: msg });
    } finally {
      setSubmittingDoc(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate && event.type !== 'dismissed') {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      const today = new Date();
      let calculatedAge = today.getFullYear() - year;
      const m = today.getMonth() - selectedDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < selectedDate.getDate())) {
        calculatedAge--;
      }
      
      setFormData(prev => ({ 
        ...prev, 
        dateOfBirth: formattedDate,
        age: calculatedAge > 0 ? String(calculatedAge) : prev.age 
      }));
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime && event.type !== 'dismissed') {
      let hours = selectedTime.getHours();
      const minutes = String(selectedTime.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
      setFormData(prev => ({ ...prev, timeOfBirth: formattedTime }));
    }
  };

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const TABS_LIST = ['Personal', 'Background', 'Family', 'Career', 'Lifestyle', 'Preferences', 'Location', 'Contact'];

  const activeTabRef = React.useRef(activeTab);
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  const handleSwipe = (direction) => {
    const currentIndex = TABS_LIST.indexOf(activeTabRef.current);
    if (direction === 'LEFT' && currentIndex < TABS_LIST.length - 1) {
      setActiveTab(TABS_LIST[currentIndex + 1]);
    } else if (direction === 'RIGHT' && currentIndex > 0) {
      setActiveTab(TABS_LIST[currentIndex - 1]);
    }
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 30 && Math.abs(gestureState.dy) < 30;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          handleSwipe('LEFT');
        } else if (gestureState.dx > 50) {
          handleSwipe('RIGHT');
        }
      },
    })
  ).current;

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const timestamp = new Date().getTime();
      const [profileRes, subRes] = await Promise.all([
        api.get(`/profiles/me?t=${timestamp}`),
        api.get('/subscriptions/details').catch(() => null)
      ]);
      
      setProfileData(profileRes.data);
      if (subRes && subRes.data) {
        setSubDetails(subRes.data);
      }
      
      if (profileRes.data.profilePhotoUrl) {
        updateUserData({ ...user, name: profileRes.data.fullName, profilePhotoUrl: profileRes.data.profilePhotoUrl });
      }
      
      try {
        const sentRes = await api.get('/connections/sent');
        setSentCount(sentRes.data?.length || 0);
      } catch (err) {
        console.log('Error fetching sent connections count:', err);
      }
    } catch (error) {
      console.error('Failed to fetch profile details:', error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Could not load profile details' });
    } finally {
      setLoading(false);
    }
  };

  const initFormData = (data) => {
    setFormData({
      fullName: data?.fullName || '',
      aboutMe: data?.aboutMe || '',
      hobbies: data?.hobbies || '',
      dateOfBirth: data?.dateOfBirth || '',
      timeOfBirth: data?.timeOfBirth || '',
      height: data?.height || '',
      weight: data?.weight || '',
      manglikStatus: data?.manglikStatus || '',
      maritalStatus: data?.maritalStatus || '',
      religion: data?.religion || '',
      caste: data?.caste || '',
      subCaste: data?.subCaste || '',
      gotra: data?.gotra || '',
      motherTongue: data?.motherTongue || '',
      placeOfBirth: data?.placeOfBirth || '',
      nakshatra: data?.nakshatra || '',
      rashi: data?.rashi || '',
      fatherStatus: data?.fatherStatus || '',
      motherStatus: data?.motherStatus || '',
      brothersCount: data?.brothersCount?.toString() || '0',
      sistersCount: data?.sistersCount?.toString() || '0',
      educationLevel: data?.educationLevel || '',
      educationField: data?.educationField || '',
      college: data?.college || '',
      occupation: data?.occupation || '',
      company: data?.company || '',
      annualIncome: data?.annualIncome || '',
      // Body & Lifestyle
      age: data?.age?.toString() || '',
      drinkingHabit: data?.drinkingHabit || '',
      smokingHabit: data?.smokingHabit || '',
      diet: data?.diet || '',
      residencyStatus: data?.residencyStatus || '',
      grewUpIn: data?.grewUpIn || '',
      bloodGroup: data?.bloodGroup || '',

      // Location
      city: data?.city || '',
      state: data?.state || '',
      country: data?.country || '',
      zipCode: data?.zipCode || '',
      address: data?.address || '',

      // Contact
      email: data?.email || '',
      mobileNumber: data?.mobileNumber || '',

      // Partner Preferences
      prefMinAge: data?.partnerPreference?.minAge?.toString() || '18',
      prefMaxAge: data?.partnerPreference?.maxAge?.toString() || '35',
      prefMinHeight: data?.partnerPreference?.minHeight || '5ft',
      prefMaxHeight: data?.partnerPreference?.maxHeight || '6ft',
      prefReligion: data?.partnerPreference?.preferredReligion || '',
      prefCaste: data?.partnerPreference?.preferredCaste || '',
      prefMotherTongue: data?.partnerPreference?.preferredMotherTongue || '',
      prefCountry: data?.partnerPreference?.preferredCountry || '',
      prefState: data?.partnerPreference?.preferredState || '',
      prefCity: data?.partnerPreference?.preferredCity || '',
      prefDiet: data?.partnerPreference?.preferredDiet || '',
      prefMaritalStatus: data?.partnerPreference?.maritalStatus || '',
    });
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      initFormData(profileData);
      setIsEditing(true);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setUpdating(true);
      
      const profilePayload = {
        fullName: formData.fullName,
        aboutMe: formData.aboutMe,
        hobbies: formData.hobbies,
        dateOfBirth: formData.dateOfBirth,
        timeOfBirth: formData.timeOfBirth,
        height: formData.height,
        weight: formData.weight,
        manglikStatus: formData.manglikStatus,
        maritalStatus: formData.maritalStatus,
        religion: formData.religion,
        caste: formData.caste,
        subCaste: formData.subCaste,
        gotra: formData.gotra,
        motherTongue: formData.motherTongue,
        placeOfBirth: formData.placeOfBirth,
        nakshatra: formData.nakshatra,
        rashi: formData.rashi,
        fatherStatus: formData.fatherStatus,
        motherStatus: formData.motherStatus,
        brothersCount: formData.brothersCount ? parseInt(formData.brothersCount, 10) : null,
        sistersCount: formData.sistersCount ? parseInt(formData.sistersCount, 10) : null,
        educationLevel: formData.educationLevel,
        educationField: formData.educationField,
        college: formData.college,
        occupation: formData.occupation,
        company: formData.company,
        annualIncome: formData.annualIncome,
        
        // Body & Lifestyle
        age: formData.age ? parseInt(formData.age, 10) : null,
        drinkingHabit: formData.drinkingHabit,
        smokingHabit: formData.smokingHabit,
        diet: formData.diet,
        residencyStatus: formData.residencyStatus,
        grewUpIn: formData.grewUpIn,
        bloodGroup: formData.bloodGroup,

        // Location
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode,
        address: formData.address,

        // Contact
        email: formData.email,
        mobileNumber: formData.mobileNumber,
      };

      const preferencePayload = {
        minAge: formData.prefMinAge ? parseInt(formData.prefMinAge, 10) : null,
        maxAge: formData.prefMaxAge ? parseInt(formData.prefMaxAge, 10) : null,
        minHeight: formData.prefMinHeight,
        maxHeight: formData.prefMaxHeight,
        preferredReligion: formData.prefReligion,
        preferredCaste: formData.prefCaste,
        preferredMotherTongue: formData.prefMotherTongue,
        preferredCountry: formData.prefCountry,
        preferredState: formData.prefState,
        preferredCity: formData.prefCity,
        preferredDiet: formData.prefDiet,
        maritalStatus: formData.prefMaritalStatus,
      };

      // 1. Update Profile Entity
      await api.patch('/profiles/me', profilePayload);
      
      // 2. Update Partner Preference Entity
      await api.post('/preferences', preferencePayload);

      // Re-fetch profile to get fully merged DTO directly from backend
      await fetchProfile();

      Toast.show({ type: 'success', text1: 'Success', text2: 'Profile details saved' });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile changes:', error);
      Toast.show({
        type: 'error',
        text1: 'Save Failed',
        text2: error.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handlePickPhoto = async (index = 0) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: 'Permission Denied', text2: 'We need camera roll permissions.' });
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.3,
      });

      if (!result.canceled) {
        uploadProfilePhoto(result.assets[0], index);
      }
    } catch (error) {
      console.error('Image picking error:', error);
    }
  };

  const handlePickAlbumPhoto = async () => {
    const currentPhotoCount = albumPhotos.length;
    if (currentPhotoCount >= 6) {
      Toast.show({ type: 'info', text1: 'Limit Reached', text2: 'You can upload up to 6 photos.' });
      return;
    }
    handlePickPhoto(currentPhotoCount);
  };

  const uploadProfilePhoto = async (asset, index = 0) => {
    try {
      setUploadingPhoto(true);

      const responseData = await uploadProfilePhotoApi(asset, index);

      setProfileData(responseData);

      if (index === 0 && responseData?.profilePhotoUrl) {
        await updateUserData({
          ...user,
          profilePhotoUrl: responseData.profilePhotoUrl,
        });
      }

      await fetchProfile();

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Photo uploaded successfully',
      });
    } catch (error) {
      const backendError = error.response?.data;
      console.error('[Profile] Upload Error:', {
        status: error.response?.status,
        backendMessage: backendError?.message || backendError,
        message: error.message,
      });

      const displayMessage =
        backendError?.message ||
        (typeof backendError === 'string' ? backendError : null) ||
        error.message ||
        'Could not upload photo';

      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: displayMessage,
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async (photoUrl) => {
    let photoIndex = 0;
    if (photoUrl === profileData?.profilePhotoUrl) photoIndex = 0;
    else if (photoUrl === profileData?.photoUrl2) photoIndex = 1;
    else if (photoUrl === profileData?.photoUrl3) photoIndex = 2;
    else if (photoUrl === profileData?.photoUrl4) photoIndex = 3;
    else if (photoUrl === profileData?.photoUrl5) photoIndex = 4;
    else if (photoUrl === profileData?.photoUrl6) photoIndex = 5;

    try {
      setUploadingPhoto(true);
      const res = await api.delete(`/profiles/photos/${photoIndex}`);
      setProfileData(res.data);
      setFormData(res.data);
      Toast.show({ type: 'success', text1: 'Photo Removed' });
    } catch (err) {
      console.error('Failed to delete photo:', err);
      Toast.show({ type: 'error', text1: 'Failed to remove photo' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C9748A" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  const albumPhotos = [
    profileData?.profilePhotoUrl,
    profileData?.photoUrl2,
    profileData?.photoUrl3,
    profileData?.photoUrl4,
    profileData?.photoUrl5,
    profileData?.photoUrl6
  ].filter(Boolean);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true}
        contentContainerStyle={{ paddingBottom: isEditing ? 80 : 30 }}
      >
      
      {/* ─── Top Bar Header & Profile Card ─── */}
      <LinearGradient
        colors={['#3D1020', '#9E546A', '#C9748A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 50 : 40) + 10 }]}
      >
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <TouchableOpacity 
              style={styles.iconCircleBtn}
              onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.dispatch(DrawerActions.toggleDrawer())}
            >
              <ChevronLeft size={24} color="#2D1E23" />
            </TouchableOpacity>
            <Text style={styles.topBarTitle}>Profile</Text>
          </View>
          <TouchableOpacity 
            style={styles.iconCircleBtn} 
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          >
            <MoreHorizontal size={24} color="#2D1E23" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <TouchableOpacity 
            style={styles.profileCardEditBtn} 
            onPress={handleToggleEdit}
          >
            {isEditing ? <X size={16} color="#FFF" /> : <Edit2 size={16} color="#FFF" />}
          </TouchableOpacity>

          <View style={styles.headerRow}>
            <View style={styles.avatarWrapper}>
              <TouchableOpacity 
                onPress={() => handlePickPhoto(0)}
                activeOpacity={0.8}
              >
                <Image
                    source={{ uri: getFallbackAvatar(profileData || user) }}
                    style={styles.headerAvatarSquircle}
                    resizeMode="cover"
                    onLoad={() => {
                      console.log('Profile image loaded');
                    }}
                    onError={(event) => {
                      console.log('Image failed:', getFallbackAvatar(profileData || user), event.nativeEvent);
                    }}
                  />
              </TouchableOpacity>
            </View>
            
            <View style={styles.headerInfo}>
              <View style={styles.nameRow}>
                {isEditing ? (
                  <TextInput
                    style={styles.inlineNameInput}
                    defaultValue={formData.fullName}
                    onChangeText={(val) => setFormData({ ...formData, fullName: val })}
                    placeholder="Enter name"
                    placeholderTextColor="#666"
                  />
                ) : (
                  <Text style={styles.profileName}>
                    {profileData?.fullName?.split(' ')[0] || 'User'}
                  </Text>
                )}
              </View>
              <View style={styles.locationRow}>
                <MapPin size={14} color="#E0E0E0" style={{ marginRight: 4 }} />
                <Text style={styles.profileLocation}>{profileData?.city || 'Mumbai'}, India</Text>
              </View>

              {profileData?.isPremium || subDetails?.active ? (
                <TouchableOpacity style={[styles.upgradePillBtn, { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }]} disabled>
                  <Text style={styles.upgradePillText}>
                    {subDetails?.planName ? `${subDetails.planName} Plan` : 'Premium Plan'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.upgradePillBtn} onPress={() => router.push('/premium')}>
                  <Text style={styles.upgradePillText}>Upgrade Plan</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* ─── Profile Details Segmented Tabs ─── */}
      <View style={styles.contentWrapper}>
        {/* Standalone Stats Row */}
        <View style={styles.standaloneStatsRow}>
          <View style={styles.standaloneStatCard}>
            <View style={[styles.standaloneStatIconWrapper, { backgroundColor: '#E8F0FE' }]}>
              <Eye size={20} color="#4285F4" />
            </View>
            <Text style={styles.standaloneStatNumber}>{profileData?.viewsCount || profileData?.profileViews || 0}</Text>
            <Text style={styles.standaloneStatLabel}>Views</Text>
          </View>

          <View style={styles.standaloneStatCard}>
            <View style={[styles.standaloneStatIconWrapper, { backgroundColor: '#FCE8E6' }]}>
              <Star size={20} color="#EA4335" />
            </View>
            <Text style={styles.standaloneStatNumber}>{sentCount}</Text>
            <Text style={styles.standaloneStatLabel}>Interested</Text>
          </View>

          <View style={styles.standaloneStatCard}>
            <View style={[styles.standaloneStatIconWrapper, { backgroundColor: '#E6F4EA' }]}>
              <MessageCircle size={20} color="#34A853" />
            </View>
            <Text style={styles.standaloneStatNumber}>{profileData?.chatsCount || profileData?.matchesCount || 0}</Text>
            <Text style={styles.standaloneStatLabel}>Chats</Text>
          </View>
        </View>



        {/* Bio Card (Always on Top) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>My Bio</Text>
          {isEditing ? (
            <TextInput
              style={[styles.inlineInput, { height: 80, textAlignVertical: 'top', paddingTop: 8 }]}
              defaultValue={formData.aboutMe}
              multiline
              onChangeText={(val) => setFormData({ ...formData, aboutMe: val })}
            />
          ) : (
            <Text style={styles.bioText}>
              {profileData?.aboutMe || "I'm someone who values good conversations, trust, and family. Looking for a partner to build a beautiful life and grow together."}
            </Text>
          )}
        </View>

        {/* Photos section (Always on Top) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>My Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photosScroll}>
            {albumPhotos.map((url, index) => (
              <View key={index} style={styles.photoContainer}>
                <TouchableOpacity onPress={() => handlePickPhoto(index)} style={{ flex: 1, width: '100%', height: '100%' }}>
                  <Image
                    source={{ uri: normalizePhotoUrl(url) }}
                    style={styles.albumPhoto}
                    resizeMode="cover"
                    onError={(event) => {
                      console.log('Image failed:', normalizePhotoUrl(url), event.nativeEvent);
                    }}
                  />
                </TouchableOpacity>
                {isEditing && (
                  <TouchableOpacity style={styles.photoDeleteBadge} onPress={() => handleDeletePhoto(url)}>
                    <X size={14} color="#FFF" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {albumPhotos.length < 6 && (
              <TouchableOpacity style={styles.addPhotoCard} onPress={handlePickAlbumPhoto} disabled={uploadingPhoto}>
                {uploadingPhoto ? (
                  <ActivityIndicator size="small" color="#C9748A" />
                ) : (
                  <Plus size={24} color="#C9748A" />
                )}
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Hobbies / Interests (Always on Top) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>My Interests</Text>
          {isEditing ? (
            <TextInput
              style={styles.inlineInput}
              defaultValue={formData.hobbies}
              placeholder="Interests separated by commas"
              onChangeText={(val) => setFormData({ ...formData, hobbies: val })}
            />
          ) : (
            <View style={styles.interestsContainer}>
              {(profileData?.hobbies ? profileData.hobbies.split(',') : ["Fitness", "Movies", "Music", "Coffee", "Travel"]).map((interest, i) => (
                <View key={i} style={styles.interestBadge}>
                  <Sparkle size={12} color="#C9748A" style={{ marginRight: 6 }} />
                  <Text style={styles.interestText}>{interest.trim()}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Tab Segment Selector Control with Scroll Indicators */}
        <View style={styles.segmentContainer}>
          {canScrollLeft && (
            <TouchableOpacity 
              style={[styles.tabArrowBtn, styles.tabArrowLeft]} 
              onPress={() => {
                if (tabScrollRef.current) tabScrollRef.current.scrollTo({ x: 0, animated: true });
              }}
              activeOpacity={0.7}
            >
              <ChevronLeft size={11} color="#C9748A" strokeWidth={2.5} />
            </TouchableOpacity>
          )}

          <ScrollView 
            ref={tabScrollRef}
            style={{ flex: 1 }}
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.segmentScroll}
            onScroll={(e) => {
              const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
              setCanScrollLeft(contentOffset.x > 8);
              setCanScrollRight(contentOffset.x < contentSize.width - layoutMeasurement.width - 8);
            }}
            scrollEventThrottle={16}
          >
            {TABS_LIST.map((tab, idx) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
                  onPress={() => {
                    setActiveTab(tab);
                    if (tabScrollRef.current) {
                      tabScrollRef.current.scrollTo({ x: Math.max(0, idx * 80 - 60), animated: true });
                    }
                  }}
                >
                  <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {canScrollRight && (
            <TouchableOpacity 
              style={[styles.tabArrowBtn, styles.tabArrowRight]} 
              onPress={() => {
                if (tabScrollRef.current) tabScrollRef.current.scrollToEnd({ animated: true });
              }}
              activeOpacity={0.7}
            >
              <ChevronRight size={11} color="#C9748A" strokeWidth={2.5} />
            </TouchableOpacity>
          )}
        </View>

        {/* Tab Contents */}
        <View {...panResponder.panHandlers}>
          {activeTab === 'Personal' && (
            <View style={styles.tabContentWrapper}>
              <View style={[styles.gridCard, { backgroundColor: '#FFF5F6', borderColor: '#EEEEEE', width: '100%' }]}>
                <View style={styles.gridCardHeader}>
                  <Sparkles size={16} color="#C9748A" />
                  <Text style={[styles.gridCardTitle, { color: '#A53D52' }]}>Personal Info</Text>
                </View>
                <View style={styles.gridCardBody}>
                   <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Born</Text>
                    {isEditing ? (
                      <TouchableOpacity 
                        style={styles.inlinePillPickerBtn}
                        onPress={() => setShowDatePicker(true)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.inlinePillPickerText, !formData.dateOfBirth && styles.inlinePillPlaceholder]}>
                          {formData.dateOfBirth || 'Select Date'}
                        </Text>
                        <Calendar size={13} color="#C9748A" />
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.dateOfBirth || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Time</Text>
                    {isEditing ? (
                      <TouchableOpacity 
                        style={styles.inlinePillPickerBtn}
                        onPress={() => setShowTimePicker(true)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.inlinePillPickerText, !formData.timeOfBirth && styles.inlinePillPlaceholder]}>
                          {formData.timeOfBirth || 'Select Time'}
                        </Text>
                        <Clock size={13} color="#C9748A" />
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.timeOfBirth || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Height</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.height} onChangeText={(val) => setFormData({ ...formData, height: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.height || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Weight</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.weight} onChangeText={(val) => setFormData({ ...formData, weight: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.weight ? `${profileData.weight} kg` : 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Manglik</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.manglikStatus} onChangeText={(val) => setFormData({ ...formData, manglikStatus: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.manglikStatus || 'NO'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Marital</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.maritalStatus} onChangeText={(val) => setFormData({ ...formData, maritalStatus: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.maritalStatus || 'N/A'}</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'Background' && (
            <View style={styles.tabContentWrapper}>
              <View style={[styles.gridCard, { backgroundColor: '#FFFDF5', borderColor: '#FBF0CE', width: '100%' }]}>
                <View style={styles.gridCardHeader}>
                  <Compass size={16} color="#C6A664" />
                  <Text style={[styles.gridCardTitle, { color: '#8F711C' }]}>Background</Text>
                </View>
                <View style={styles.gridCardBody}>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Religion</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.religion} onChangeText={(val) => setFormData({ ...formData, religion: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.religion || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Caste</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.caste} onChangeText={(val) => setFormData({ ...formData, caste: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.caste || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Sub-Caste</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.subCaste} onChangeText={(val) => setFormData({ ...formData, subCaste: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.subCaste || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Gothra</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.gotra} onChangeText={(val) => setFormData({ ...formData, gotra: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.gotra || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Tongue</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.motherTongue} onChangeText={(val) => setFormData({ ...formData, motherTongue: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.motherTongue || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Birth City</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.placeOfBirth} onChangeText={(val) => setFormData({ ...formData, placeOfBirth: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.placeOfBirth || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Star</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.nakshatra} onChangeText={(val) => setFormData({ ...formData, nakshatra: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.nakshatra || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Rashi</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.rashi} onChangeText={(val) => setFormData({ ...formData, rashi: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.rashi || 'N/A'}</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'Family' && (
            <View style={styles.tabContentWrapper}>
              <View style={[styles.gridCard, { backgroundColor: '#FFFAF0', borderColor: '#FEEBC8', width: '100%' }]}>
                <View style={styles.gridCardHeader}>
                  <Users size={16} color="#DD6B20" />
                  <Text style={[styles.gridCardTitle, { color: '#9C4221' }]}>Family Details</Text>
                </View>
                <View style={styles.gridCardBody2Col}>
                  <View style={styles.infoPillRow}>
                    <Text style={styles.infoKey}>Father Status</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.fatherStatus} onChangeText={(val) => setFormData({ ...formData, fatherStatus: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.fatherStatus || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPillRow}>
                    <Text style={styles.infoKey}>Mother Status</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.motherStatus} onChangeText={(val) => setFormData({ ...formData, motherStatus: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.motherStatus || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPillRow}>
                    <Text style={styles.infoKey}>Brothers Count</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.brothersCount} onChangeText={(val) => setFormData({ ...formData, brothersCount: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.brothersCount || '0'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPillRow}>
                    <Text style={styles.infoKey}>Sisters Count</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.sistersCount} onChangeText={(val) => setFormData({ ...formData, sistersCount: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.sistersCount || '0'}</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'Career' && (
            <View style={styles.tabContentWrapper}>
              <View style={[styles.gridCard, { backgroundColor: '#F7FAFC', borderColor: '#E2E8F0', width: '100%' }]}>
                <View style={styles.gridCardHeader}>
                  <Briefcase size={16} color="#4A5568" />
                  <Text style={[styles.gridCardTitle, { color: '#2D3748' }]}>Education & Career</Text>
                </View>
                <View style={styles.gridCardBody2Col}>
                  <View style={styles.infoPillRow}>
                    <Text style={styles.infoKey}>Education</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.educationLevel} onChangeText={(val) => setFormData({ ...formData, educationLevel: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.educationLevel || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPillRow}>
                    <Text style={styles.infoKey}>Field</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.educationField} onChangeText={(val) => setFormData({ ...formData, educationField: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.educationField || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPillRow}>
                    <Text style={styles.infoKey}>College</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.college} onChangeText={(val) => setFormData({ ...formData, college: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.college || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPillRow}>
                    <Text style={styles.infoKey}>Occupation</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.occupation} onChangeText={(val) => setFormData({ ...formData, occupation: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.occupation || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPillRow}>
                    <Text style={styles.infoKey}>Company</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.company} onChangeText={(val) => setFormData({ ...formData, company: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.company || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPillRow}>
                    <Text style={styles.infoKey}>Income</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.annualIncome} onChangeText={(val) => setFormData({ ...formData, annualIncome: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.annualIncome || 'N/A'}</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'Lifestyle' && (
            <View style={styles.tabContentWrapper}>
              <View style={[styles.gridCard, { backgroundColor: '#F0FFF4', borderColor: '#C6F6D5', width: '100%' }]}>
                <View style={styles.gridCardHeader}>
                  <Smile size={16} color="#38A169" />
                  <Text style={[styles.gridCardTitle, { color: '#276749' }]}>Lifestyle</Text>
                </View>
                <View style={styles.gridCardBody}>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Diet</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.diet} onChangeText={(val) => setFormData({ ...formData, diet: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.diet || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Drinking</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.drinkingHabit} onChangeText={(val) => setFormData({ ...formData, drinkingHabit: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.drinkingHabit || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Smoking</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.smokingHabit} onChangeText={(val) => setFormData({ ...formData, smokingHabit: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.smokingHabit || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Residency</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.residencyStatus} onChangeText={(val) => setFormData({ ...formData, residencyStatus: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.residencyStatus || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Grew Up In</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.grewUpIn} onChangeText={(val) => setFormData({ ...formData, grewUpIn: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.grewUpIn || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Blood Group</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.bloodGroup} onChangeText={(val) => setFormData({ ...formData, bloodGroup: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.bloodGroup || 'N/A'}</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'Preferences' && (
            <View style={styles.tabContentWrapper}>
              <View style={[styles.gridCard, { backgroundColor: '#F0FDFA', borderColor: '#CCFBF1', width: '100%' }]}>
                <View style={styles.gridCardHeader}>
                  <Award size={16} color="#0D9488" />
                  <Text style={[styles.gridCardTitle, { color: '#115E59' }]}>Partner Preference</Text>
                </View>
                <View style={styles.gridCardBody2Col}>
                  <View style={styles.infoPillRow}>
                    <Text style={styles.infoKey}>Min Age</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.prefMinAge} keyboardType="numeric" onChangeText={(val) => setFormData({ ...formData, prefMinAge: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.partnerPreference?.minAge || '18'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPillRow}>
                    <Text style={styles.infoKey}>Max Age</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.prefMaxAge} keyboardType="numeric" onChangeText={(val) => setFormData({ ...formData, prefMaxAge: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.partnerPreference?.maxAge || '35'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPillRow}>
                    <Text style={styles.infoKey}>Min Height</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.prefMinHeight} onChangeText={(val) => setFormData({ ...formData, prefMinHeight: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.partnerPreference?.minHeight || '5ft'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPillRow}>
                    <Text style={styles.infoKey}>Max Height</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.prefMaxHeight} onChangeText={(val) => setFormData({ ...formData, prefMaxHeight: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.partnerPreference?.maxHeight || '6ft'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPillRow}>
                    <Text style={styles.infoKey}>Religion</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.prefReligion} onChangeText={(val) => setFormData({ ...formData, prefReligion: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.partnerPreference?.preferredReligion || 'Any'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPillRow}>
                    <Text style={styles.infoKey}>Caste</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.prefCaste} onChangeText={(val) => setFormData({ ...formData, prefCaste: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.partnerPreference?.preferredCaste || 'Any'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPillRow}>
                    <Text style={styles.infoKey}>Diet</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.prefDiet} onChangeText={(val) => setFormData({ ...formData, prefDiet: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.partnerPreference?.preferredDiet || 'Any'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPillRow}>
                    <Text style={styles.infoKey}>Country</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.prefCountry} onChangeText={(val) => setFormData({ ...formData, prefCountry: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.partnerPreference?.preferredCountry || 'India'}</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'Location' && (
            <View style={styles.tabContentWrapper}>
              <View style={[styles.gridCard, { backgroundColor: '#F4F4F5', borderColor: '#E4E4E7', width: '100%' }]}>
                <View style={styles.gridCardHeader}>
                  <Globe size={16} color="#71717A" />
                  <Text style={[styles.gridCardTitle, { color: '#3F3F46' }]}>Location Details</Text>
                </View>
                <View style={styles.gridCardBody}>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>City</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.city} onChangeText={(val) => setFormData({ ...formData, city: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.city || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>State</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.state} onChangeText={(val) => setFormData({ ...formData, state: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.state || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Country</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.country} onChangeText={(val) => setFormData({ ...formData, country: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.country || 'India'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Zip Code</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.zipCode} onChangeText={(val) => setFormData({ ...formData, zipCode: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.zipCode || 'N/A'}</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'Contact' && (
            <View style={styles.tabContentWrapper}>
              <View style={[styles.gridCard, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE', width: '100%' }]}>
                <View style={styles.gridCardHeader}>
                  <Phone size={16} color="#3B82F6" />
                  <Text style={[styles.gridCardTitle, { color: '#1E3A8A' }]}>Contact Information</Text>
                </View>
                <View style={styles.gridCardBody}>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Email</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.email} onChangeText={(val) => setFormData({ ...formData, email: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.email || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoKey}>Phone</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.mobileNumber} onChangeText={(val) => setFormData({ ...formData, mobileNumber: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.mobileNumber || 'N/A'}</Text>
                    )}
                  </View>
                  <View style={styles.infoPillRow}>
                    <Text style={styles.infoKey}>Address</Text>
                    {isEditing ? (
                      <TextInput style={styles.inlinePillInput} defaultValue={formData.address} onChangeText={(val) => setFormData({ ...formData, address: val })} />
                    ) : (
                      <Text style={styles.infoVal}>{profileData?.address || 'N/A'}</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Floating Save Actions Bar */}
      {isEditing && (
        <View style={[styles.saveActionBar, { bottom: keyboardVisible ? (Platform.OS === 'ios' ? 20 : 15) : 95 }]}>
          <TouchableOpacity style={styles.cancelActionBarBtn} onPress={() => { initFormData(profileData); setIsEditing(false); }}>
            <Text style={styles.cancelActionBarBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveActionBarBtnWrapper} onPress={handleSaveChanges} disabled={updating}>
            <LinearGradient colors={['#C9748A', '#C9748A']} style={styles.saveActionBarBtnGradient}>
              {updating ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Check size={16} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={styles.saveActionBarBtnText}>Save Changes</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Identity & Document Verification Card */}
      {!isEditing && (
        <View style={styles.verificationSectionCard}>
          <View style={styles.verificationCardHeader}>
            <View style={styles.verificationTitleRow}>
              <View style={styles.verificationIconWrapper}>
                <ShieldCheck size={22} color="#C9748A" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={styles.verificationMainTitle}>Identity Verification</Text>
                  <View style={[
                    styles.verificationStatusPill,
                    profileData?.verificationStatus === 'VERIFIED' && styles.statusPillVerified,
                    profileData?.verificationStatus === 'PENDING' && styles.statusPillPending,
                    profileData?.verificationStatus === 'REJECTED' && styles.statusPillRejected,
                  ]}>
                    {profileData?.verificationStatus === 'VERIFIED' ? (
                      <CheckCircle2 size={11} color="#059669" style={{ marginRight: 4 }} />
                    ) : profileData?.verificationStatus === 'PENDING' ? (
                      <Clock size={11} color="#D97706" style={{ marginRight: 4 }} />
                    ) : profileData?.verificationStatus === 'REJECTED' ? (
                      <AlertCircle size={11} color="#DC2626" style={{ marginRight: 4 }} />
                    ) : (
                      <ShieldCheck size={11} color="#C9748A" style={{ marginRight: 4 }} />
                    )}
                    <Text style={[
                      styles.verificationStatusText,
                      profileData?.verificationStatus === 'VERIFIED' && styles.statusTextVerified,
                      profileData?.verificationStatus === 'PENDING' && styles.statusTextPending,
                      profileData?.verificationStatus === 'REJECTED' && styles.statusTextRejected,
                    ]}>
                      {profileData?.verificationStatus === 'VERIFIED' 
                        ? 'VERIFIED' 
                        : profileData?.verificationStatus === 'PENDING' 
                        ? 'IN REVIEW' 
                        : profileData?.verificationStatus === 'REJECTED' 
                        ? 'REJECTED' 
                        : 'NOT VERIFIED'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.verificationSubTitle}>
                  {profileData?.verificationStatus === 'VERIFIED'
                    ? 'Your ID is verified by admin with a 100% Trust Badge.'
                    : profileData?.verificationStatus === 'PENDING'
                    ? 'Your document is currently under admin review.'
                    : profileData?.verificationStatus === 'REJECTED'
                    ? 'Document was rejected. Please upload a clear valid ID.'
                    : 'Get a trusted verified badge by submitting your official ID.'}
                </Text>
              </View>
            </View>

            {/* Submitted Document Summary if available */}
            {profileData?.idProofType && (
              <View style={styles.submittedDocRow}>
                <FileText size={14} color="#666" style={{ marginRight: 6 }} />
                <Text style={styles.submittedDocText}>
                  {profileData.idProofType} • {profileData.idProofNumber ? `•••• ${profileData.idProofNumber.slice(-4)}` : 'Submitted'}
                </Text>
              </View>
            )}

            {/* Action Upload / Update Button */}
            {profileData?.verificationStatus !== 'VERIFIED' && (
              <TouchableOpacity
                style={styles.docUploadActionBtn}
                activeOpacity={0.85}
                onPress={() => setShowDocUploadModal(true)}
              >
                <LinearGradient
                  colors={['#C9748A', '#A85268']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.docUploadActionGradient}
                >
                  <UploadCloud size={16} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.docUploadActionBtnText}>
                    {profileData?.verificationStatus === 'PENDING' ? 'Update Document' : 'Submit ID Proof'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Modal for Submitting ID Verification Document */}
      <Modal
        visible={showDocUploadModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDocUploadModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.modalBackdrop}
        >
          <View style={styles.modalContentCard}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ShieldCheck size={20} color="#C9748A" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Submit ID Document</Text>
              </View>
              <TouchableOpacity onPress={() => setShowDocUploadModal(false)} style={styles.modalCloseBtn}>
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalInstructions}>
              Select your government-issued ID card and provide the document number for verification.
            </Text>

            {/* Document Type Pills */}
            <Text style={styles.modalInputLabel}>Select Document Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.docTypesScroll}>
              {DOC_TYPES.map((type) => {
                const isSelected = selectedDocType === type.value;
                return (
                  <TouchableOpacity
                    key={type.value}
                    style={[styles.docTypePill, isSelected && styles.docTypePillActive]}
                    onPress={() => {
                      setSelectedDocType(type.value);
                      setDocNumber('');
                    }}
                  >
                    <Text style={[styles.docTypePillText, isSelected && styles.docTypePillTextActive]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Document Number Input */}
            <Text style={[styles.modalInputLabel, { marginTop: 14 }]}>
              {selectedDocType} Number
            </Text>
            <TextInput
              style={styles.modalTextInput}
              value={docNumber}
              onChangeText={(text) => setDocNumber(text.toUpperCase())}
              placeholder={DOC_TYPES.find(d => d.value === selectedDocType)?.placeholder || 'Enter ID number'}
              placeholderTextColor="#999"
              autoCapitalize="characters"
            />

            {/* Document Photo Upload Box */}
            <Text style={[styles.modalInputLabel, { marginTop: 14 }]}>Upload Photo of Document</Text>
            {docFile ? (
              <View style={styles.docPreviewWrapper}>
                <Image source={{ uri: docFile.uri }} style={styles.docPreviewImage} resizeMode="cover" />
                <TouchableOpacity style={styles.docPreviewRemoveBtn} onPress={() => setDocFile(null)}>
                  <X size={14} color="#FFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.docUploadDropBox} onPress={handlePickDocImage} activeOpacity={0.8}>
                <Camera size={28} color="#C9748A" />
                <Text style={styles.docUploadDropText}>Tap to Capture or Select from Gallery</Text>
                <Text style={styles.docUploadDropSubText}>PNG, JPG or JPEG up to 10MB</Text>
              </TouchableOpacity>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={handleSubmitVerificationDoc}
              disabled={submittingDoc}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#C9748A', '#A85268']}
                style={styles.modalSubmitBtnGradient}
              >
                {submittingDoc ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Check size={18} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.modalSubmitBtnText}>Submit for Admin Verification</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Logout Button */}
      {!isEditing && (
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <LogOut size={20} color="#C9748A" style={{ marginRight: 8 }} />
            <Text style={styles.logoutBtnText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}

      <View style={{ height: 110 }} />
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#C9748A',
    fontWeight: '600',
  },
  contentWrapper: {
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -40,
    paddingTop: 16,
    paddingHorizontal: 20,
    position: 'relative',
  },
  headerGradient: {
    paddingBottom: 60,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginLeft: 12,
  },
  profileCard: {
    backgroundColor: 'transparent',
    borderRadius: 24,
    marginHorizontal: 20,
    padding: 20,
    position: 'relative',
  },
  profileCardEditBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#C9748A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
  },
  headerAvatarSquircle: {
    width: 90,
    height: 90,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#EEEEEE',
  },
  headerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
  },
  inlinePillInput: {
    fontSize: 14,
    color: '#2D1E23',
    padding: 0,
    margin: 0,
    textAlign: 'left',
    flex: 1,
    marginLeft: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#C9748A',
  },
  inlinePillPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginLeft: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#C9748A',
    paddingVertical: 2,
  },
  inlinePillPickerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D1E23',
  },
  inlinePillPlaceholder: {
    color: '#999999',
    fontWeight: '400',
  },
  inlineNameInput: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
    paddingVertical: 2,
    width: '90%',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  profileLocation: {
    fontSize: 12,
    color: '#777777',
  },
  upgradePillBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#C9748A',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#C9748A',
  },
  upgradePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 14,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconWrapper: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  statLabel: {
    fontSize: 10,
    color: '#777777',
    marginTop: 2,
  },
  floatingEditBtn: {
    position: 'absolute',
    right: 20,
    top: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#C9748A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F5E6EA',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2D1E23',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 12,
    color: '#88797D',
    lineHeight: 18,
  },
  bioInput: {
    minHeight: 80,
    fontSize: 14,
    lineHeight: 22,
    color: '#2D1E23',
    borderWidth: 1,
    borderColor: '#F5E6EA',
  },
  photosScroll: {
    paddingVertical: 4,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 10,
    zIndex: 10,
    overflow: 'visible',
  },
  albumPhoto: {
    width: 72,
    height: 72,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#EEEEEE',
  },
  photoDeleteBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF4B6E',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 6,
    zIndex: 20,
  },
  photoEditBadge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#C9748A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoCard: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#FFF0F4',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C9748A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  interestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F4',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  interestText: {
    fontSize: 11,
    color: '#C9748A',
    fontWeight: '600',
  },
  segmentContainer: {
    backgroundColor: '#FFF3F5',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F5E6EA',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabArrowBtn: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#F5E6EA',
  },
  tabArrowLeft: {
    marginRight: 2,
  },
  tabArrowRight: {
    marginLeft: 2,
  },
  segmentScroll: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  segmentBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 6,
  },
  segmentBtnActive: {
    backgroundColor: '#C9748A',
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9E7A82',
  },
  segmentTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  detailCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F5E6EA',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2D1E23',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5E6EA',
    paddingBottom: 8,
  },
  cardBody: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F5E6EA',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#8F7E84',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 12,
    color: '#2D1E23',
    fontWeight: '700',
  },
  inlineValueInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#F5E6EA',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    color: '#2D1E23',
    width: '60%',
    textAlign: 'right',
  },
  saveActionBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 15,
    left: 20,
    right: 20,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F5E6EA',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelActionBarBtn: {
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#FFF0F4',
  },
  cancelActionBarBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C9748A',
  },
  saveActionBarBtnWrapper: {
    flex: 1,
    marginLeft: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveActionBarBtnGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveActionBarBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0F4',
    borderRadius: 16,
    paddingVertical: 12,
  },
  logoutBtnText: {
    color: '#C9748A',
    fontWeight: '700',
    fontSize: 13,
  },
  tabContentWrapper: {
    width: '100%',
  },
  gridCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F5E6EA',
    marginBottom: 20,
  },
  gridCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5E6EA',
    paddingBottom: 8,
  },
  gridCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
  },
  gridCardBody: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridCardBody2Col: {
    gap: 10,
  },
  infoPill: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '48%',
    borderWidth: 1,
    borderColor: '#F5E6EA',
  },
  infoPillRow: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderWidth: 1,
    borderColor: '#F5E6EA',
  },
  infoKey: {
    fontSize: 11,
    color: '#718096',
    fontWeight: '600',
  },
  infoVal: {
    fontSize: 11,
    color: '#1A202C',
    fontWeight: '700',
  },

  standaloneStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -45,
    marginBottom: 24,
    gap: 12,
    position: 'relative',
    zIndex: 20,
  },
  standaloneStatCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 14,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFF0F4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  standaloneStatIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  standaloneStatNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2D1E23',
    marginTop: 2,
  },
  standaloneStatLabel: {
    fontSize: 11,
    color: '#8F7E84',
    fontWeight: '700',
    marginTop: 2,
  },

  /* Verification Card Styles */
  verificationSectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F5E6EA',
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  verificationCardHeader: {
    width: '100%',
  },
  verificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  verificationIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF0F4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCE7ED',
  },
  verificationMainTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2D1E23',
  },
  verificationSubTitle: {
    fontSize: 12,
    color: '#88797D',
    marginTop: 4,
    lineHeight: 16,
  },
  verificationStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  statusPillVerified: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusPillPending: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusPillRejected: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  verificationStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  statusTextVerified: {
    color: '#059669',
  },
  statusTextPending: {
    color: '#D97706',
  },
  statusTextRejected: {
    color: '#DC2626',
  },
  submittedDocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  submittedDocText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  docUploadActionBtn: {
    marginTop: 14,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  docUploadActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  docUploadActionBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Verification Modal Styles */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContentCard: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    maxHeight: '90%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2D1E23',
  },
  modalCloseBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  modalInstructions: {
    fontSize: 12,
    color: '#777',
    marginBottom: 16,
    lineHeight: 18,
  },
  modalInputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  docTypesScroll: {
    paddingVertical: 2,
    gap: 8,
  },
  docTypePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 6,
  },
  docTypePillActive: {
    backgroundColor: 'rgba(201, 116, 138, 0.12)',
    borderColor: '#C9748A',
  },
  docTypePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  docTypePillTextActive: {
    color: '#C9748A',
    fontWeight: '800',
  },
  modalTextInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  docUploadDropBox: {
    backgroundColor: '#FFF5F7',
    borderWidth: 2,
    borderColor: '#F8D6CB',
    borderStyle: 'dashed',
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docUploadDropText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C9748A',
    marginTop: 6,
  },
  docUploadDropSubText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  docPreviewWrapper: {
    position: 'relative',
    height: 140,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  docPreviewImage: {
    width: '100%',
    height: '100%',
  },
  docPreviewRemoveBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubmitBtn: {
    marginTop: 22,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  modalSubmitBtnGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubmitBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
