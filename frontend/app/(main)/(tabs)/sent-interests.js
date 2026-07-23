import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Search, MapPin, Send, MessageCircle, RefreshCw, X, Heart, Bookmark, BookmarkCheck } from 'lucide-react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import api, { LOCAL_IP } from '../../../src/services/api';

const { width } = Dimensions.get('window');

export default function SentInterestsScreen() {
  const router = useRouter();
  const { initialTab } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState(initialTab || 'sent');
  const [sentInterests, setSentInterests] = useState([]);
  const [receivedInterests, setReceivedInterests] = useState([]);
  const [shortlisted, setShortlisted] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchSentInterests = async () => {
    setLoading(true);
    try {
      let response;
      try {
        response = await api.get('/connections/sent');
      } catch (e) {
        response = await api.get('/connection-requests/sent');
      }
      const list = response.data || [];
      const formatted = list.map((item, idx) => {
        const profile = item.receiverProfile || {};
        const fixedUrl = profile.profilePhotoUrl ? profile.profilePhotoUrl.replace('localhost', LOCAL_IP) : null;
        const heightVal = profile.height || '165';
        const heightFt = (parseFloat(heightVal) / 30.48).toFixed(1);

        return {
          id: item.id ? item.id.toString() : Math.random().toString(),
          userId: item.receiverId || profile.userId || item.receiverProfileId || idx,
          name: profile.fullName || 'User',
          firstName: profile.fullName ? profile.fullName.split(' ')[0] : 'User',
          age: profile.age || 25,
          gender: profile.gender || 'FEMALE',
          city: profile.city || 'Mumbai',
          occupation: profile.occupation || 'Software Engg',
          profileId: profile.profileId || `LZEA${item.id || idx + 1001}`,
          heightCm: heightVal,
          heightFt: heightFt,
          status: item.status || 'PENDING',
          image: fixedUrl ? { uri: fixedUrl } : require('../../../assets/images/female_avatar.png'),
        };
      });
      setSentInterests(formatted);
    } catch (err) {
      console.error('Failed to fetch sent interests:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReceivedInterests = async () => {
    setLoading(true);
    try {
      let response;
      try {
        response = await api.get('/connections/received');
      } catch (e) {
        response = await api.get('/connection-requests/received');
      }
      const list = response.data || [];
      console.log('--- RECEIVED INTERESTS FROM API ---', list);
      const formatted = list.map((item, idx) => {
        const profile = item.senderProfile || {};
        const fixedUrl = profile.profilePhotoUrl ? profile.profilePhotoUrl.replace('localhost', LOCAL_IP) : null;
        const heightVal = profile.height || '165';
        const heightFt = (parseFloat(heightVal) / 30.48).toFixed(1);

        return {
          id: item.id ? item.id.toString() : Math.random().toString(),
          userId: item.senderId || profile.userId || item.senderProfileId || idx,
          name: profile.fullName || 'User',
          firstName: profile.fullName ? profile.fullName.split(' ')[0] : 'User',
          age: profile.age || 25,
          gender: profile.gender || 'FEMALE',
          city: profile.city || 'Mumbai',
          occupation: profile.occupation || 'Software Engg',
          profileId: profile.profileId || `LZEA${item.id || idx + 1001}`,
          heightCm: heightVal,
          heightFt: heightFt,
          status: item.status || 'PENDING',
          image: fixedUrl ? { uri: fixedUrl } : require('../../../assets/images/female_avatar.png'),
        };
      });
      setReceivedInterests(formatted);
    } catch (err) {
      console.error('Failed to fetch received interests:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchShortlisted = async () => {
    try {
      const response = await api.get('/shortlist/my');
      const list = response.data || [];
      const formatted = list.map((profile, idx) => {
        const fixedUrl = profile.profilePhotoUrl ? profile.profilePhotoUrl.replace('localhost', LOCAL_IP) : null;
        const heightVal = profile.height || '165';
        const heightFt = (parseFloat(heightVal) / 30.48).toFixed(1);
        return {
          id: (profile.id || idx).toString(),
          userId: profile.userId || profile.id || idx,
          profileId: profile.profileId || `LZEA${profile.id || idx}`,
          name: profile.fullName || 'User',
          age: profile.age || 25,
          city: profile.city || 'Mumbai',
          occupation: profile.occupation || 'Professional',
          heightCm: heightVal,
          heightFt: heightFt,
          image: fixedUrl ? { uri: fixedUrl } : require('../../../assets/images/female_avatar.png'),
        };
      });
      setShortlisted(formatted);
    } catch (err) {
      console.error('Failed to fetch shortlisted:', err);
    }
  };

  const handleRemoveShortlist = async (profileId) => {
    setShortlisted(prev => prev.filter(p => p.profileId !== profileId && p.id !== profileId));
    try {
      await api.delete(`/shortlist/${profileId}`);
      fetchShortlisted();
    } catch (err) {
      console.error('Failed to remove from shortlist:', err);
      fetchShortlisted();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchSentInterests();
      fetchReceivedInterests();
      fetchShortlisted();
    }, [])
  );

  const handleAcceptInterest = async (requestId) => {
    setReceivedInterests((prev) => 
      prev.map((item) => 
        item.id === requestId ? { ...item, status: 'ACCEPTED' } : item
      )
    );
    try {
      await api.put(`/connections/accept/${requestId}`);
      fetchReceivedInterests();
    } catch (err) {
      console.error('Failed to accept connection request:', err);
      fetchReceivedInterests();
    }
  };

  const filteredInterests = useMemo(() => {
    if (activeTab === 'shortlisted') {
      return shortlisted.filter(item => {
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.city.toLowerCase().includes(q);
      });
    }
    const listToFilter = activeTab === 'sent' ? sentInterests : receivedInterests;
    return listToFilter.filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.city.toLowerCase().includes(query) ||
        item.age.toString().includes(query) ||
        item.profileId.toLowerCase().includes(query) ||
        item.occupation.toLowerCase().includes(query)
      );
    });
  }, [sentInterests, receivedInterests, shortlisted, searchQuery, activeTab]);

  const renderShortlistedItem = ({ item }) => (
    <TouchableOpacity
      style={styles.shortlistCard}
      activeOpacity={0.92}
      onPress={() => router.push({ pathname: '/user-details', params: { userId: item.userId } })}
    >
      <Image source={item.image} style={styles.shortlistImage} />
      <LinearGradient
        colors={['transparent', 'rgba(30,8,18,0.85)']}
        style={styles.shortlistGradient}
      />
      {/* Heart badge */}
      <View style={styles.shortlistHeartBadge}>
        <Heart size={14} color="#FFF" fill="#C9748A" strokeWidth={0} />
      </View>
      <View style={styles.shortlistInfo}>
        <Text style={styles.shortlistName}>{item.name}, {item.age}</Text>
        <Text style={styles.shortlistSub}>{item.occupation} • {item.city}</Text>
        <View style={styles.shortlistActions}>
          <TouchableOpacity
            style={styles.shortlistChatBtn}
            onPress={(e) => { e.stopPropagation(); router.push({ pathname: `/chat/${item.userId}`, params: { name: item.name } }); }}
          >
            <MessageCircle size={13} color="#FFF" />
            <Text style={styles.shortlistChatBtnText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shortlistRemoveBtn}
            onPress={(e) => { e.stopPropagation(); handleRemoveShortlist(item.profileId || item.id); }}
          >
            <BookmarkCheck size={13} color="#C9748A" />
            <Text style={styles.shortlistRemoveBtnText}>Saved</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => router.push({ pathname: '/user-details', params: { userId: item.userId } })}
      >
        <View style={styles.imageWrapper}>
          <Image source={item.image} style={styles.cardImage} />
          <View style={styles.occupationOverlay}>
            <Text style={styles.occupationText} numberOfLines={1}>{item.occupation}</Text>
          </View>
        </View>

        <View style={styles.cardDetails}>
          <Text style={styles.nameText} numberOfLines={1}>{item.name}</Text>
          
          <Text style={styles.metaText}>
            Age {item.age}, {item.heightCm}CM • {item.heightFt} Ft
          </Text>

          <View style={styles.locationRow}>
            <MapPin size={13} color="#777777" style={{ marginRight: 4 }} />
            <Text style={styles.locationText} numberOfLines={1}>{item.city}, India</Text>
          </View>

          <View style={styles.cardBottomRow}>
            <View style={styles.actionsRow}>
              <TouchableOpacity 
                style={styles.chatCircle}
                onPress={(e) => {
                  e.stopPropagation();
                  router.push({
                    pathname: `/chat/${item.userId}`,
                    params: { name: item.name }
                  });
                }}
              >
                <MessageCircle size={14} color="#FFF" />
              </TouchableOpacity>

              {activeTab === 'received' ? (
                item.status && item.status.toUpperCase() === 'ACCEPTED' ? (
                  <View style={styles.acceptedBadge}>
                    <Text style={styles.acceptedBadgeText}>Accepted ✓</Text>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.acceptButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleAcceptInterest(item.id);
                    }}
                  >
                    <Text style={styles.acceptButtonText}>Accept</Text>
                  </TouchableOpacity>
                )
              ) : (
                <View style={[styles.acceptedBadge, { backgroundColor: '#F0F0F0' }]}>
                  <Text style={[styles.acceptedBadgeText, { color: '#777' }]}>{item.status}</Text>
                </View>
              )}
            </View>

            <View style={styles.idBadge}>
              <Text style={styles.idText}>{item.profileId}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#FFF' }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#2D1E23" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Interests</Text>
        <TouchableOpacity 
          onPress={() => {
            fetchSentInterests();
            fetchReceivedInterests();
          }} 
          style={styles.refreshBtn}
        >
          <RefreshCw size={18} color="#C9748A" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'sent' && styles.tabBtnActive]}
          onPress={() => setActiveTab('sent')}
        >
          <Send size={15} color={activeTab === 'sent' ? '#C9748A' : '#999'} />
          <Text style={[styles.tabText, activeTab === 'sent' && styles.tabTextActive]}>Sent</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'received' && styles.tabBtnActive]}
          onPress={() => setActiveTab('received')}
        >
          <MapPin size={15} color={activeTab === 'received' ? '#C9748A' : '#999'} />
          <Text style={[styles.tabText, activeTab === 'received' && styles.tabTextActive]}>Received</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'shortlisted' && styles.tabBtnActive]}
          onPress={() => setActiveTab('shortlisted')}
        >
          <Heart size={15} color={activeTab === 'shortlisted' ? '#C9748A' : '#999'} fill={activeTab === 'shortlisted' ? '#C9748A' : 'none'} />
          <Text style={[styles.tabText, activeTab === 'shortlisted' && styles.tabTextActive]}>Shortlisted</Text>
        </TouchableOpacity>
      </View>

      {showSearchBar && (
        <View style={styles.searchBarWrapper}>
          <Search size={18} color="#777777" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, city, or ID..."
            placeholderTextColor="#777777"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color="#777777" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {activeTab === 'shortlisted' ? (
        filteredInterests.length > 0 ? (
          <FlatList
            data={filteredInterests}
            keyExtractor={(item) => item.id}
            renderItem={renderShortlistedItem}
            numColumns={2}
            columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
            contentContainerStyle={{ paddingTop: 12, paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Heart size={60} color="#F5C0CC" fill="#FFF0F4" strokeWidth={1} />
            <Text style={styles.emptyTitle}>No Shortlisted Profiles</Text>
            <Text style={styles.emptyText}>Profiles you shortlist will appear here</Text>
          </View>
        )
      ) : (
        <FlatList
          data={filteredInterests}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Image
                source={require('../../../assets/images/no_interest_data.png')}
                style={styles.emptyImage}
                resizeMode="contain"
              />
              <Text style={styles.emptyText}>
                {activeTab === 'sent' ? 'No sent interests found' : 'No received interests found'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D1E23',
  },
  refreshBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
    gap: 12,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabBtnActive: {
    backgroundColor: '#FFF0F4',
    borderColor: '#C9748A',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777777',
  },
  tabTextActive: {
    color: '#C9748A',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#2D1E23',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100, // Adjusted padding for global bottom tab height
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F5F5F7',
  },
  imageWrapper: {
    width: 105,
    height: 135,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#EEE',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  occupationOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  occupationText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  cardDetails: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D1E23',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 11,
    color: '#777777',
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chatCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
  },
  acceptButton: {
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E3C72',
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  acceptedBadge: {
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  acceptedBadgeText: {
    color: '#4CAF50',
    fontSize: 11,
    fontWeight: '700',
  },
  idBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#EBEBEB',
    borderStyle: 'dashed',
  },
  idText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#777777',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyImage: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  emptyTitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D1E23',
  },
  // Shortlist styles
  shortlistCard: {
    width: '48%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  shortlistImage: {
    width: '100%',
    height: '100%',
  },
  shortlistGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  shortlistHeartBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortlistInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  shortlistName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  shortlistSub: {
    color: '#E0E0E0',
    fontSize: 10,
    marginBottom: 8,
  },
  shortlistActions: {
    flexDirection: 'row',
    gap: 6,
  },
  shortlistChatBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#C9748A',
    paddingVertical: 6,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  shortlistChatBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  shortlistRemoveBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFF0F4',
    paddingVertical: 6,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  shortlistRemoveBtnText: {
    color: '#C9748A',
    fontSize: 11,
    fontWeight: '600',
  },
});
