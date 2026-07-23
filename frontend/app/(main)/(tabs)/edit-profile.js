import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '../../../src/context/AuthContext';
import { Colors, Spacing, Typography, Shadows } from '../../../src/constants/Theme';
import api from '../../../src/services/api';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { ChevronLeft, Camera, Save } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const FALLBACK_AVATAR = 'https://ui-avatars.com/api/?background=E91E63&color=fff&name=';

export default function EditProfile() {
  const { user, updateUserData } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [localPhoto, setLocalPhoto] = useState(user?.profilePhoto || null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    religion: user?.religion || '',
    caste: user?.caste || '',
    motherTongue: user?.motherTongue || '',
    city: user?.city || '',
    state: user?.state || '',
    education: user?.education || '',
    occupation: user?.occupation || '',
    income: user?.income || '',
    bio: user?.bio || '',
  });

  // ─── Image Picker ──────────────────────────────────────────────────────────

  const handlePickImage = () => {
    Alert.alert('Change Profile Photo', 'Select an option', [
      { text: 'Camera', onPress: () => openPicker('camera') },
      { text: 'Gallery', onPress: () => openPicker('gallery') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openPicker = async (source) => {
    let result;
    const options = {
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    };

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
      setLocalPhoto(asset.uri);
      await uploadPhoto(asset);
    }
  };

  const uploadPhoto = async (asset) => {
    try {
      setUploadingPhoto(true);
      const formDataObj = new FormData();
      const uriParts = asset.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formDataObj.append('photo', {
        uri: asset.uri,
        name: `photo-${Date.now()}.${fileType}`,
        type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
      });

      const response = await api.post('/users/profile/photo', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await updateUserData({
        profilePhoto: response.data.profilePhoto,
        profileCompletion: response.data.profileCompletion,
      });

      Toast.show({ type: 'success', text1: '✅ Photo Updated!' });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: error.response?.data?.message || 'Try again',
      });
      // Revert preview on failure
      setLocalPhoto(user?.profilePhoto || null);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // ─── Profile Data Save ─────────────────────────────────────────────────────

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await api.put('/users/profile', formData);
      await updateUserData(response.data);
      Toast.show({ type: 'success', text1: '✅ Profile Saved!' });
      router.back();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Save Failed',
        text2: error.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setSaving(false);
    }
  };

  // ─── Reusable Input ────────────────────────────────────────────────────────

  const Field = ({ label, fieldKey, placeholder, multiline = false, keyboardType = 'default' }) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, multiline && styles.fieldInputMulti]}
        value={formData[fieldKey]}
        onChangeText={(val) => setFormData((p) => ({ ...p, [fieldKey]: val }))}
        placeholder={placeholder}
        placeholderTextColor={Colors.border}
        multiline={multiline}
        keyboardType={keyboardType}
        textAlignVertical={multiline ? 'top' : 'auto'}
      />
    </View>
  );

  // ─── Derived ───────────────────────────────────────────────────────────────
  const avatarUri = localPhoto
    ? localPhoto
    : `${FALLBACK_AVATAR}${encodeURIComponent(user?.name || 'User')}`;

  const completion = user?.profileCompletion || 30;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.headerBtn, styles.saveHeaderBtn]}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Save size={18} color={Colors.white} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Avatar Section ── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            {uploadingPhoto && (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator size="large" color={Colors.white} />
              </View>
            )}
            <TouchableOpacity
              style={styles.cameraBtn}
              onPress={handlePickImage}
              disabled={uploadingPhoto}
            >
              <Camera size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarName}>{formData.name || user?.name}</Text>
          <Text style={styles.avatarSub}>{user?.email}</Text>

          {/* Completion bar */}
          <View style={styles.completionRow}>
            <View style={styles.completionBar}>
              <View style={[styles.completionFill, { width: `${completion}%` }]} />
            </View>
            <Text style={styles.completionLabel}>{completion}% complete</Text>
          </View>
        </View>

        {/* ── Basic ── */}
        <SectionHeader title="Basic Information" emoji="👤" />
        <Field label="Full Name" fieldKey="name" placeholder="Your full name" />
        <Field label="Phone Number" fieldKey="phone" placeholder="+91 XXXXX XXXXX" keyboardType="phone-pad" />
        <Field label="Mother Tongue" fieldKey="motherTongue" placeholder="e.g. Hindi, Marathi" />

        {/* ── Religion ── */}
        <SectionHeader title="Religious Background" emoji="🕌" />
        <Field label="Religion" fieldKey="religion" placeholder="e.g. Hindu, Muslim, Sikh" />
        <Field label="Caste / Community" fieldKey="caste" placeholder="e.g. Brahmin, Rajput" />

        {/* ── Location ── */}
        <SectionHeader title="Location" emoji="📍" />
        <Field label="City" fieldKey="city" placeholder="Your city" />
        <Field label="State" fieldKey="state" placeholder="Your state" />

        {/* ── Career ── */}
        <SectionHeader title="Career & Education" emoji="💼" />
        <Field label="Highest Education" fieldKey="education" placeholder="e.g. B.Tech, MBA" />
        <Field label="Occupation" fieldKey="occupation" placeholder="e.g. Software Engineer" />
        <Field label="Annual Income" fieldKey="income" placeholder="e.g. 10–15 LPA" />

        {/* ── Bio ── */}
        <SectionHeader title="About Me" emoji="✨" />
        <Field label="Bio" fieldKey="bio" placeholder="Tell potential matches about yourself..." multiline />

        {/* ── Save Button ── */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.saveBtnText}>Save Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function SectionHeader({ title, emoji }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionEmoji}>{emoji}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
    backgroundColor: Colors.white,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveHeaderBtn: {
    backgroundColor: Colors.primary,
    ...Shadows.light,
  },
  headerTitle: {
    ...Typography.h3,
    fontSize: 18,
  },

  // ── Avatar ──
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.m,
    borderRadius: 20,
    margin: Spacing.m,
    ...Shadows.light,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: Spacing.m,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.border,
    borderWidth: 4,
    borderColor: Colors.white,
    ...Shadows.medium,
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 55,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    ...Shadows.light,
  },
  avatarName: {
    ...Typography.h3,
    fontSize: 18,
    marginBottom: 2,
  },
  avatarSub: {
    ...Typography.caption,
    marginBottom: Spacing.m,
  },
  completionRow: {
    width: '75%',
    alignItems: 'center',
  },
  completionBar: {
    width: '100%',
    height: 5,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  completionFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  completionLabel: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },

  // ── Scroll ──
  scrollContent: {
    paddingBottom: 50,
  },

  // ── Section ──
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
    marginTop: Spacing.l,
    marginBottom: Spacing.s,
  },
  sectionEmoji: { fontSize: 16, marginRight: 8 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  // ── Fields ──
  fieldGroup: {
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.m,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  fieldInput: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: Spacing.m,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  fieldInputMulti: {
    height: 110,
    paddingTop: 12,
  },

  // ── Save Btn ──
  saveBtn: {
    marginHorizontal: Spacing.m,
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    ...Shadows.medium,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
