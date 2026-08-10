import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  Platform,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../src/constants/Theme';
import { ChevronLeft, Plus, Bookmark, MoreHorizontal } from 'lucide-react-native';
import api, { LOCAL_IP } from '../../../src/services/api';
import { normalizePhotoUrl, getFallbackAvatar } from '../../../src/utils/imageUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useAuth } from '../../../src/context/AuthContext';
import MatchFeedCard from '../../../src/components/discovery/MatchFeedCard';
import ProfileOptionsBottomSheet from '../../../src/components/discovery/ProfileOptionsBottomSheet';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function Matches() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user: currentUser } = useAuth();
  
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedUserForMenu, setSelectedUserForMenu] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fixUrl = (url) => {
    return normalizePhotoUrl(url);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch matches
      const response = await api.post('/profiles/search?page=0&size=20', {});
      
      // Fetch sent interests to mark cards
      let sentIds = new Set();
      try {
        const sentRes = await api.get('/connections/sent');
        const sentList = sentRes.data || [];
        sentList.forEach(item => {
          if (item.receiverId) sentIds.add(item.receiverId.toString());
          if (item.receiverProfile && item.receiverProfile.userId) sentIds.add(item.receiverProfile.userId.toString());
        });
      } catch (err) {
        console.error('Failed to load sent interests for discover feed:', err);
      }

      const formattedProfiles = (response.data.content || []).map(p => {
        const userId = p.userId || p.id;
        return {
          ...p,
          id: userId,
          interestSent: sentIds.has(userId.toString()),
          profilePhotoUrl: fixUrl(p.profilePhotoUrl),
          photoUrl2: fixUrl(p.photoUrl2),
          photoUrl3: fixUrl(p.photoUrl3),
          photoUrl4: fixUrl(p.photoUrl4),
          photoUrl5: fixUrl(p.photoUrl5),
          photoUrl6: fixUrl(p.photoUrl6),
          photos: p.photos ? p.photos.map(photo => ({ uri: fixUrl(photo) })) : [],
        };
      });

      setProfiles(formattedProfiles);
    } catch (error) {
      console.error('Failed to load matches view data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not load data',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOptions = (user) => {
    setSelectedUserForMenu(user);
    setMenuVisible(true);
  };

  const handleMenuAction = (action) => {
    setMenuVisible(false);
    if (!selectedUserForMenu) return;

    if (action === 'view_profile') {
      router.push({ pathname: '/user-details', params: { userId: selectedUserForMenu.id } });
    } else if (action === 'hide') {
      handleDismiss(selectedUserForMenu);
    } else {
      Toast.show({ type: 'info', text1: 'Action recorded', text2: `Profile ${action}ed.` });
    }
  };

  const handleDismiss = async (userToDismiss) => {
    try {
      const existing = await AsyncStorage.getItem('SEE_LATER_MATCHES');
      const parsed = existing ? JSON.parse(existing) : [];
      if (!parsed.find(p => p.id === userToDismiss.id)) {
        parsed.push(userToDismiss);
        await AsyncStorage.setItem('SEE_LATER_MATCHES', JSON.stringify(parsed));
      }
      setProfiles(prev => prev.filter(p => p.id !== userToDismiss.id));
      Toast.show({ type: 'success', text1: 'Added to See Later', text2: 'You can view this profile later.' });
    } catch (e) {
      console.error('Failed to save to see later', e);
      setProfiles(prev => prev.filter(p => p.id !== userToDismiss.id));
      Toast.show({ type: 'success', text1: 'Profile Hidden' });
    }
  };

  const handleShortlist = (user, isShortlisted) => {
    Toast.show({ type: 'success', text1: isShortlisted ? 'Shortlisted' : 'Removed', text2: isShortlisted ? 'Profile added to your shortlist' : 'Profile removed from shortlist' });
  };

  const handleSendInterest = async (user) => {
    try {
      try {
        await api.post(`/connections/send/${user.id}`);
      } catch (e) {
        await api.post(`/connections/send/${user.id}`);
      }
      Toast.show({ type: 'success', text1: 'Interest Sent!', text2: `Interest sent to ${user.fullName || 'User'}.` });
    } catch (err) {
      console.error('Failed to send interest:', err);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Could not send interest.' });
    }
  };

  const handleChat = (user) => {
    console.log('Opening chat:', {
      targetUserId: user.id,
      name: user.fullName || user.name || 'User',
      route: '/chat/[id]',
    });

    router.push({ 
      pathname: '/chat/[id]', 
      params: { 
        id: String(user.id),
        name: user.fullName || user.name || 'User',
        photo: user.profilePhotoUrl || user.profilePhoto || '' 
      } 
    });
  };

  const renderStoryCard = ({ item, index }) => {
    if (index === 0) {
      // My Profile story
      const myAvatarUri = getFallbackAvatar(currentUser);
      return (
        <TouchableOpacity style={styles.storyCard} onPress={() => router.push('/profile')}>
          <Image 
            source={{ uri: myAvatarUri }} 
            style={styles.myStoryImage} 
            contentFit="cover"
            onError={(e) => console.log('Image failed:', myAvatarUri, e.nativeEvent)}
          />
          <View style={styles.myStoryBottom}>
            <View style={styles.addStoryBtn}>
              <Plus size={10} color="#757575" strokeWidth={3} />
            </View>
            <Text style={styles.myStoryText}>Update Profile</Text>
          </View>
        </TouchableOpacity>
      );
    }

    // Other matches stories
    const matchUser = item;
    const storyPhoto = matchUser.photos && matchUser.photos.length > 0 
      ? { uri: fixUrl(matchUser.photos[0]) } 
      : { uri: getFallbackAvatar(matchUser) };
    const avatarPhoto = { uri: getFallbackAvatar(matchUser) };
    
    return (
      <View style={styles.storyCard}>
        <Image 
          source={storyPhoto} 
          style={styles.storyFullImage} 
          contentFit="cover" 
          onError={(e) => console.log('Image failed:', storyPhoto?.uri || storyPhoto, e.nativeEvent)}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.storyOverlay}
        >
          <View style={styles.storyUserInfo}>
            <Image 
              source={avatarPhoto} 
              style={styles.storySmallAvatar} 
              contentFit="cover" 
              onError={(e) => console.log('Image failed:', avatarPhoto?.uri || avatarPhoto, e.nativeEvent)}
            />
            <Text style={styles.storyNameOverlay} numberOfLines={1}>
              {matchUser.fullName ? matchUser.fullName.split(' ')[0] : 'User'}
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* ─── Modern Top Navbar ─── */}
      <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 45 : 30) + 10 }]}>
        <View style={styles.topBar}>
          {/* Left: Back Button & Title */}
          <View style={styles.topBarLeft}>
            <TouchableOpacity 
              style={styles.modernIconBtn}
              onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.dispatch(DrawerActions.toggleDrawer())}
            >
              <ChevronLeft size={24} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.modernTitle}>Discover</Text>
          </View>

          {/* Right: Actions */}
          <View style={styles.topBarRight}>
            <TouchableOpacity 
              style={styles.modernIconBtn} 
              onPress={() => router.push('/see-later')}
            >
              <Bookmark size={22} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modernIconBtn, { marginLeft: 8 }]} 
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            >
              <MoreHorizontal size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ─── Main Feed ─── */}
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            {/* Top Stories Section */}
            <View style={styles.storiesSection}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={[{ id: 'me' }, ...profiles.slice(0, 8)]}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderStoryCard}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              />
            </View>
            <Text style={styles.feedTitle}>Your Matches</Text>
          </>
        }
        renderItem={({ item }) => (
          <MatchFeedCard 
            user={item}
            onMenuOptions={handleMenuOptions}
            onDismiss={handleDismiss}
            onShortlist={handleShortlist}
            onSendInterest={handleSendInterest}
            onChat={handleChat}
            onPress={(u) => router.push({ pathname: '/user-details', params: { userId: u.id } })}
            onViewProfile={(u) => router.push({ pathname: '/user-details', params: { userId: u.id } })}
          />
        )}
        ListEmptyComponent={
          !loading && (
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <Text style={{ color: '#88797D', fontFamily: 'Inter-Medium' }}>No new matches in your feed.</Text>
            </View>
          )
        }
      />

      <ProfileOptionsBottomSheet 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)} 
        user={selectedUserForMenu} 
        onAction={handleMenuAction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8FA',
  },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 50 : 35,
    paddingBottom: 15,
    backgroundColor: '#FFF8FA',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(242, 82, 104, 0.05)',
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modernIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(242, 82, 104, 0.05)',
  },
  modernTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0,
    marginLeft: 15,
  },
  storiesSection: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE4ED',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  storyCard: {
    width: 90,
    height: 130,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  myStoryImage: {
    width: '100%',
    height: '65%',
  },
  myStoryBottom: {
    height: '35%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addStoryBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    marginTop: -10, // pull up slightly over the image
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  myStoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#212121',
  },
  storyFullImage: {
    width: '100%',
    height: '100%',
  },
  storyOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    justifyContent: 'flex-end',
    padding: 8,
  },
  storyUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storySmallAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginRight: 6,
  },
  storyNameOverlay: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#FFFFFF',
    flex: 1,
  },
  feedTitle: {
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 22,
    color: '#212121',
    marginLeft: 20,
    marginBottom: 16,
  }
});
