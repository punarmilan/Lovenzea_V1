import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

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
    const updated = { ...user, ...updatedFields };
    setUserState(updated);
    await AsyncStorage.setItem('userData', JSON.stringify(updated));
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email: email.trim(), password });
    const { accessToken, refreshToken, ...userData } = response.data;
    const token = accessToken;
    
    const finalUserData = {
      ...userData,
      profilePhoto: userData.profilePhoto || userData.profilePhotoUrl,
      profilePhotoUrl: userData.profilePhoto || userData.profilePhotoUrl,
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

    // 2. Upload photo if provided
    if (photoData) {
      try {
        const photoFormData = new FormData();
        photoFormData.append('file', {
          uri: photoData.uri,
          type: photoData.type,
          name: photoData.name || 'profile.jpg',
        });
        
        const photoResponse = await api.post('/profiles/photo', photoFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (photoResponse.data && photoResponse.data.profilePhotoUrl) {
          userData.profilePhoto = photoResponse.data.profilePhotoUrl;
          userData.profilePhotoUrl = photoResponse.data.profilePhotoUrl;
        }
      } catch (photoError) {
        console.error('Photo upload failed:', photoError);
      }
    }

    const finalUserData = {
      ...userData,
      profilePhoto: userData.profilePhoto || userData.profilePhotoUrl,
      profilePhotoUrl: userData.profilePhoto || userData.profilePhotoUrl,
    };

    await AsyncStorage.setItem('userToken', token);
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
