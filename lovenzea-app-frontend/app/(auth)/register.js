import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, Mail, Lock, Eye, EyeOff, User, Camera, Calendar, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../src/context/AuthContext';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

// Assets
const bgImage = require('../../assets/images/login.png');
const logoImage = require('../../assets/images/project_logo_transperent.png');

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [activeTab, setActiveTab] = useState('register'); // Keeps UI consistent with login.js

  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dob: eighteenYearsAgo,
    gender: 'male',
  });
  const [photoData, setPhotoData] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) handleInputChange('dob', selectedDate);
  };

  const handlePickImage = () => {
    Alert.alert('Profile Photo', 'Select an option', [
      { text: 'Camera', onPress: () => openPicker('camera') },
      { text: 'Gallery', onPress: () => openPicker('gallery') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openPicker = async (source) => {
    const options = { mediaTypes: ['images'], allowsEditing: false, quality: 0.3 };
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
      const asset = result.assets[0];
      setPhotoData({
        uri: asset.uri,
        type: asset.mimeType || 'image/jpeg',
        name: `photo-${Date.now()}.jpg`,
      });
    }
  };

  const handleRegister = async () => {
    const { name, email, password, phone, dob } = formData;
    if (!name || !email || !password || !phone || !dob) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill all required fields' });
      return;
    }
    if (password.length < 6) {
      Toast.show({ type: 'error', text1: 'Weak Password', text2: 'Password must be at least 6 characters long' });
      return;
    }

    try {
      setLoading(true);
      const formattedDob = dob.toISOString().split('T')[0];
      await register(name, email, password, phone, formattedDob, formData.gender, photoData);
      Toast.show({ type: 'success', text1: 'Welcome!', text2: 'Account created successfully' });
      router.replace('/(main)/(tabs)/home');
    } catch (error) {
      let errorMsg = 'Something went wrong';
      if (error.response?.data) {
        if (error.response.data.errors && error.response.data.errors.length > 0) {
          errorMsg = error.response.data.errors[0].defaultMessage;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        }
      }
      Toast.show({ type: 'error', text1: 'Registration Failed', text2: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={bgImage} style={styles.bgImage} imageStyle={{ opacity: 0.15 }}>
        <LinearGradient colors={['rgba(255, 248, 246, 0.4)', '#FFF6F5', '#FFF6F5']} style={StyleSheet.absoluteFillObject} />

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true} persistentScrollbar={true} keyboardShouldPersistTaps="handled">
            
            <SafeAreaView edges={['top']} />
            <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.topSection}>
              <View style={styles.logoContainer}>
                <Image source={logoImage} style={styles.logo} resizeMode="contain" />
                <Text style={styles.logoText}>LovenZea</Text>
              </View>
              <View style={styles.taglineContainer}>
                <View style={styles.taglineLine} />
                <Text style={styles.tagline}>Find Your Perfect Match</Text>
                <View style={styles.taglineLine} />
              </View>
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.loginCard}>
              
              {/* Tabs */}
              <View style={styles.tabsContainer}>
                <TouchableOpacity style={styles.tab} onPress={() => router.push('/login')}>
                  <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Member Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('register')}>
                  <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>Create Account</Text>
                  {activeTab === 'register' && <LinearGradient colors={['#C9748A', '#C9748A']} style={styles.activeTabIndicator} />}
                </TouchableOpacity>
              </View>

              {/* Avatar Upload */}
              <View style={styles.avatarSection}>
                <TouchableOpacity onPress={handlePickImage} style={styles.avatarWrapper} activeOpacity={0.85}>
                  {photoData ? (
                    <Image 
                      source={{ uri: photoData.uri }} 
                      style={styles.avatar} 
                      onError={(e) => console.log('Image failed:', photoData.uri, e.nativeEvent)}
                    />
                  ) : (
                    <LinearGradient
                      colors={['#FFF0F3', '#FFE4E8']}
                      style={[styles.avatar, styles.avatarPlaceholder]}
                    >
                      <Camera size={34} color="#C9748A" />
                    </LinearGradient>
                  )}
                  <View style={styles.cameraBtn}>
                    <Camera size={13} color="#FFF" />
                  </View>
                </TouchableOpacity>

                <View style={styles.avatarLabelsContainer}>
                  <TouchableOpacity onPress={handlePickImage} activeOpacity={0.7} style={styles.avatarTitleRow}>
                    <Text style={styles.avatarMainTitle}>
                      {photoData ? 'Change Profile Photo' : 'Add Profile Photo'}
                    </Text>
                    <View style={styles.optionalBadge}>
                      <Text style={styles.optionalBadgeText}>Optional</Text>
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.avatarSubTitle}>
                    {photoData ? 'Looking great! Tap to pick a different picture' : 'Profiles with photos receive 5x more responses'}
                  </Text>
                </View>
              </View>

              {/* Form Fields */}
              <View style={styles.inputContainer}>
                <User size={20} color="#F5E6E8" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#88797D" value={formData.name} onChangeText={(v) => handleInputChange('name', v)} />
              </View>

              <View style={styles.inputContainer}>
                <Mail size={20} color="#F5E6E8" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#88797D" value={formData.email} onChangeText={(v) => handleInputChange('email', v)} keyboardType="email-address" autoCapitalize="none" />
              </View>

              <View style={styles.inputContainer}>
                <Phone size={20} color="#F5E6E8" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor="#88797D" value={formData.phone} onChangeText={(v) => handleInputChange('phone', v)} keyboardType="phone-pad" />
              </View>

              <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
                <Calendar size={20} color="#F5E6E8" style={styles.inputIcon} />
                <Text style={[styles.input, { textAlignVertical: 'center', paddingTop: Platform.OS === 'ios' ? 18 : 14 }]}>
                  {formData.dob.toISOString().split('T')[0]}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker value={formData.dob} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onChangeDate} maximumDate={eighteenYearsAgo} />
              )}
              {Platform.OS === 'ios' && showDatePicker && (
                <TouchableOpacity onPress={() => setShowDatePicker(false)} style={{alignSelf: 'flex-end', marginBottom: 15}}><Text style={{color: '#C9748A', fontWeight: 'bold'}}>Done</Text></TouchableOpacity>
              )}

              <View style={styles.inputContainer}>
                <Lock size={20} color="#F5E6E8" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#88797D" secureTextEntry={!showPassword} value={formData.password} onChangeText={(v) => handleInputChange('password', v)} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  {showPassword ? <Eye size={20} color="#88797D" /> : <EyeOff size={20} color="#88797D" />}
                </TouchableOpacity>
              </View>

              <View style={styles.genderContainer}>
                {['male', 'female', 'other'].map((g) => (
                  <TouchableOpacity key={g} style={[styles.genderButton, formData.gender === g && styles.genderButtonActive]} onPress={() => handleInputChange('gender', g)}>
                    <Text style={[styles.genderButtonText, formData.gender === g && styles.genderButtonTextActive]}>{g.charAt(0).toUpperCase() + g.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Register Button */}
              <TouchableOpacity onPress={handleRegister} activeOpacity={0.8} style={styles.loginBtnWrapper} disabled={loading}>
                <LinearGradient colors={['#C9748A', '#C9748A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.loginBtnGradient}>
                  <Text style={styles.loginBtnText}>{loading ? 'Creating...' : 'Create Account'}</Text>
                  {!loading && (
                    <View style={styles.loginBtnIcon}>
                      <ArrowRight size={18} color="#C9748A" />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>

            </Animated.View>
            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF6F5' },
  bgImage: { flex: 1, width: '100%', height: '100%' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 20 },
  topSection: { alignItems: 'center', marginBottom: 20, marginTop: Platform.OS === 'ios' ? 20 : 40 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  logo: { width: 45, height: 45, tintColor: '#C9748A' },
  logoText: { fontSize: 32, color: '#3C2430', fontWeight: '800', fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'serif' },
  taglineContainer: { flexDirection: 'row', alignItems: 'center' },
  taglineLine: { height: 1, backgroundColor: '#F5E6E8', width: 30, marginHorizontal: 10 },
  tagline: { fontSize: 12, color: '#88797D', letterSpacing: 1, textTransform: 'uppercase' },
  
  loginCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  tabsContainer: { flexDirection: 'row', marginBottom: 25, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', position: 'relative' },
  tabText: { fontSize: 15, fontWeight: '600', color: '#88797D' },
  activeTabText: { color: '#3C2430', fontWeight: '700' },
  activeTabIndicator: { position: 'absolute', bottom: -1, width: '60%', height: 3, borderRadius: 3 },
  
  avatarSection: { alignItems: 'center', marginBottom: 22 },
  avatarWrapper: {
    position: 'relative',
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 6,
  },
  avatar: { width: 92, height: 92, borderRadius: 46, backgroundColor: '#FFF', borderWidth: 3, borderColor: '#FFF' },
  avatarPlaceholder: { justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#F8D6CB' },
  cameraBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#C9748A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  avatarLabelsContainer: { alignItems: 'center', marginTop: 10 },
  avatarTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatarMainTitle: { fontSize: 14, fontWeight: '700', color: '#3C2430' },
  optionalBadge: {
    backgroundColor: 'rgba(201, 116, 138, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(201, 116, 138, 0.25)',
  },
  optionalBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C9748A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  avatarSubTitle: { fontSize: 11, color: '#88797D', marginTop: 3, fontWeight: '500' },

  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 18, paddingHorizontal: 16, height: 56, marginBottom: 16, borderWidth: 1, borderColor: '#F8D6CB' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, height: '100%', color: '#3C2430', fontSize: 15 },
  eyeIcon: { padding: 10 },

  genderContainer: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  genderButton: { flex: 1, height: 48, borderRadius: 16, borderWidth: 1, borderColor: '#F8D6CB', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  genderButtonActive: { borderColor: '#C9748A', backgroundColor: 'rgba(223, 95, 120, 0.08)' },
  genderButtonText: { fontSize: 14, color: '#88797D', fontWeight: '600' },
  genderButtonTextActive: { color: '#C9748A', fontWeight: '700' },

  loginBtnWrapper: { shadowColor: '#C9748A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10, marginTop: 10 },
  loginBtnGradient: { height: 56, borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  loginBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700', marginRight: 10 },
  loginBtnIcon: { backgroundColor: '#FFF', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
