import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { uploadProfilePhotoApi } from '../services/api';
import { normalizePhotoUrl } from '../utils/imageUrl';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const authDataSerialized = await AsyncStorage.getItem('userData');
      if (authDataSerialized) {
        const _user = JSON.parse(authDataSerialized);
        setUserState(_user);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  // Helper to update user in both state and AsyncStorage
  const updateUserData = async (updatedFields) => {
    const fieldsCopy = { ...updatedFields };
    if (fieldsCopy.profilePhotoUrl) {
      fieldsCopy.profilePhotoUrl = normalizePhotoUrl(fieldsCopy.profilePhotoUrl);
    }
    if (fieldsCopy.profilePhoto) {
      fieldsCopy.profilePhoto = normalizePhotoUrl(fieldsCopy.profilePhoto);
    }
    const updated = { ...user, ...fieldsCopy };
    setUserState(updated);
    await AsyncStorage.setItem('userData', JSON.stringify(updated));
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email: email.trim(), password });
    const { accessToken, refreshToken, ...userData } = response.data;
    const token = accessToken;
    
    const finalUserData = {
      ...userData,
      profilePhoto: normalizePhotoUrl(userData.profilePhoto || userData.profilePhotoUrl),
      profilePhotoUrl: normalizePhotoUrl(userData.profilePhoto || userData.profilePhotoUrl),
    };
    
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(finalUserData));
    setUserState(finalUserData);
  };

  const register = async (name, email, password, phone, dob, gender, photoData) => {
    // 1. Send JSON registration request
    const names = name.trim().split(' ');
    const firstName = names[0];
    const lastName = names.length > 1 ? names.slice(1).join(' ') : '';

    const registerPayload = {
      firstName,
      lastName,
      email,
      password,
      mobileNumber: phone,
      gender,
      profileCreatedBy: 'Self',
      dob // the backend doesn't seem to explicitly take dob in RegisterRequest but we can send it or ignore if ignored
    };

    const response = await api.post('/auth/register', registerPayload);
    const { accessToken, refreshToken, ...userData } = response.data;
    const token = accessToken;

    // Save token immediately so subsequent API calls (like photo upload) are authenticated
    await AsyncStorage.setItem('userToken', token);

    // 2. Upload photo if provided
    if (photoData) {
      try {
        const photoResponseData = await uploadProfilePhotoApi(photoData, 0, token);

        if (photoResponseData && photoResponseData.profilePhotoUrl) {
          userData.profilePhoto = normalizePhotoUrl(photoResponseData.profilePhotoUrl);
          userData.profilePhotoUrl = normalizePhotoUrl(photoResponseData.profilePhotoUrl);
        }
      } catch (photoError) {
        const backendError = photoError.response?.data;
        console.error('[AuthContext] Register photo upload error:', {
          status: photoError.response?.status,
          backendMessage: backendError?.message || backendError,
          message: photoError.message,
        });
      }
    }

    const finalUserData = {
      ...userData,
      profilePhoto: normalizePhotoUrl(userData.profilePhoto || userData.profilePhotoUrl),
      profilePhotoUrl: normalizePhotoUrl(userData.profilePhoto || userData.profilePhotoUrl),
    };
    await AsyncStorage.setItem('userData', JSON.stringify(finalUserData));
    setUserState(finalUserData);
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
