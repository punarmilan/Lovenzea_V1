import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  useAnimatedScrollHandler,
  Extrapolation,
  withRepeat,
  withTiming,
  Easing,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { Bell, MapPin, CheckCircle2, MoreHorizontal, BarChart2, Sparkles, User, Users, Image as ImageIcon, Heart, ChevronRight, X, MessageCircle, Star } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRouter, useFocusEffect } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../../src/context/AuthContext';
import api, { LOCAL_IP } from '../../../src/services/api';
import { normalizePhotoUrl, getFallbackAvatar } from '../../../src/utils/imageUrl';

const { width } = Dimensions.get('window');

// Carousel Setup
const CARD_WIDTH = width * 0.72;
const ITEM_SIZE = CARD_WIDTH + 20;

// ─── Section Header with Icon ────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, label, iconBg, right }) => (
  <View style={sectionHeaderStyles.row}>
    <View style={[sectionHeaderStyles.iconPill, { backgroundColor: iconBg || '#C9748A' }]}>
      <Icon size={14} color="#FFF" strokeWidth={2.5} />
    </View>
    <Text style={sectionHeaderStyles.label}>{label}</Text>
    {right && <View style={{ marginLeft: 'auto' }}>{right}</View>}
  </View>
);

const sectionHeaderStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconPill: {
    width: 28,
    height: 28,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2D1B22',
    letterSpacing: 0.2,
  },
});

const EmptyState = ({ title, message, image }) => (
  <View style={styles.emptyStateContainer}>
    {image ? (
      <Image source={image} style={styles.emptyStateClipart} resizeMode="contain" />
    ) : (
      <View style={styles.emptyStateIconWrapper}>
        <Users size={28} color="#C9748A" strokeWidth={1.5} />
      </View>
    )}
    {title && <Text style={styles.emptyStateTitle}>{title}</Text>}
    <Text style={styles.emptyStateMessage}>{message}</Text>
  </View>
);

const MatchCard = ({ item, index, scrollX, onPress, onSendInterest, isInterestSent, onChat, onShortlist, isShortlisted }) => {
  const inputRange = [
    (index - 1) * ITEM_SIZE,
    index * ITEM_SIZE,
    (index + 1) * ITEM_SIZE,
  ];

  const animatedStyle = useAnimatedStyle(() => {
    // No scale/opacity — keep all cards sharp, just shift non-center cards down
    const translateY = interpolate(scrollX.value, inputRange, [12, 0, 12], Extrapolation.CLAMP);
    return { transform: [{ translateY }] };
  });

  const imageSource = typeof item.image === 'string' ? { uri: item.image } : item.image;

  return (
    <View style={{ width: ITEM_SIZE, alignItems: 'center', paddingVertical: 16 }}>
      <TouchableOpacity
        activeOpacity={0.96}
        onPress={onPress}
        style={{ width: CARD_WIDTH }}
      >
        <Animated.View style={[styles.matchCard, animatedStyle]}>
          {/* Full-bleed photo */}
          <Image 
            source={imageSource} 
            style={styles.matchImage} 
            resizeMode="cover" 
            onError={(e) => console.log('Image failed:', imageSource?.uri || imageSource, e.nativeEvent)}
          />

          {/* Match % badge — top left */}
          <View style={styles.matchBadge}>
            <Text style={styles.matchBadgeText}>{item.match}% Match</Text>
          </View>

          {/* Dark gradient overlay at bottom */}
          <LinearGradient
            colors={['transparent', 'rgba(20,6,14,0.55)', 'rgba(20,6,14,0.92)']}
            style={styles.matchGradient}
          />

          {/* Profile info */}
          <View style={styles.matchContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.matchName}>{item.name}</Text>
              <View style={styles.verifiedBadge}>
                <CheckCircle2 size={13} color="#FFF" fill="#4CD964" strokeWidth={0} />
              </View>
            </View>
            <Text style={styles.matchSub}>{item.age} • {item.education} • {item.location}</Text>
            <Text style={[styles.matchSub, { marginTop: 2 }]}>Ht. {item.height}</Text>

            {/* Action buttons row — each button stops propagation to parent */}
            <View style={styles.matchActionRow}>
              {/* Shortlist */}
              <TouchableOpacity
                style={styles.matchCircleActionBtn}
                onPress={(e) => { e.stopPropagation?.(); onShortlist && onShortlist(item); }}
                activeOpacity={0.8}
              >
                <Heart size={18} color="#C9748A" fill={isShortlisted ? '#C9748A' : 'none'} strokeWidth={2.2} />
              </TouchableOpacity>

              {/* Send Interest — primary sleeker pill */}
              <TouchableOpacity
                style={[styles.matchSendBtn, isInterestSent && styles.matchSendBtnSent]}
                onPress={(e) => { e.stopPropagation?.(); onSendInterest && onSendInterest(item); }}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={isInterestSent ? ['#4CAF50', '#388E3C'] : ['#C9748A', '#9E546A']}
                  style={styles.matchSendGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Heart size={14} color="#FFF" fill={isInterestSent ? '#FFF' : 'none'} strokeWidth={2} />
                  <Text style={styles.matchSendText}>{isInterestSent ? 'Sent ✓' : 'Send Interest'}</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Chat */}
              <TouchableOpacity
                style={styles.matchCircleActionBtn}
                onPress={(e) => { e.stopPropagation?.(); onChat && onChat(item); }}
                activeOpacity={0.8}
              >
                <MessageCircle size={18} color="#D4AF37" strokeWidth={2.2} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};


export default function DiscoveryDashboard() {
  const scrollX = useSharedValue(0);
  const navigation = useNavigation();
  const router = useRouter();
  const { user } = useAuth();
  const [realMatches, setRealMatches] = useState([]);
  const [realConnections, setRealConnections] = useState([]);
  const [sentInterests, setSentInterests] = useState([]);
  const [chats, setChats] = useState([]);
  const [shortlistedIds, setShortlistedIds] = useState(new Set());
  const [dashboardStats, setDashboardStats] = useState({
    profileViews: 0,
    newMatches: 0,
    likesReceived: 0,
    activeChats: 0,
    interestsSent: 0,
    profileViewsWeekly: [0, 0, 0, 0],
    matchesWeekly: [0, 0, 0, 0],
    messagesWeekly: [0, 0, 0, 0],
    hobbies: [],
  });

  const { completionPercentage, personalInfoDone, picturesAdded, interestsDone } = useMemo(() => {
    let score = 20; // Base score for account creation
    let piDone = !!user?.name && !!user?.email;
    let pics = user?.profilePhotoUrl ? 1 : 0;
    
    if (piDone) score += 25;
    if (pics > 0) score += 20;
    // Interests logic placeholder, assumes not done unless we fetch profile fully
    let intDone = false; 

    return { 
      completionPercentage: score, 
      personalInfoDone: piDone, 
      picturesAdded: pics, 
      interestsDone: intDone 
    };
  }, [user]);

  useEffect(() => {
    fetchPremiumProfiles();
    fetchRealMatches();
    fetchSentInterests();
    fetchRecentChats();
    fetchDashboardStats();
    fetchShortlistedIds();
  }, []);

  const fetchPremiumProfiles = async () => {
    try {
      let response = await api.post('/profiles/search?page=0&size=50', { isPremium: true });
      let content = response.data.content || [];
      if (content.length === 0) {
        response = await api.post('/profiles/search?page=0&size=50', {});
        content = response.data.content || [];
      }
      const formatted = content.map((p) => {
        return {
          id: p.userId || p.id,
          name: p.fullName ? p.fullName.split(' ')[0] : 'User',
          fullName: p.fullName || 'User',
          image: { uri: getFallbackAvatar(p) },
          isPremium: p.isPremium,
        };
      });
      setRealConnections(formatted);
    } catch (err) {
      console.error('Failed to load premium profiles:', err);
    }
  };

  const fetchRealMatches = async () => {
    try {
      const response = await api.post('/profiles/search?page=0&size=6', {});
      const formatted = (response.data.content || []).map((p, idx) => {
        return {
          id: p.userId,
          name: p.fullName || 'User',
          age: p.age || 25,
          location: p.city || 'Mumbai',
          education: p.educationLevel || 'Graduate',
          height: p.height || "5'5\"",
          match: 85 + (idx * 3) % 14,
          image: getFallbackAvatar(p),
        };
      });
      setRealMatches(formatted);
    } catch (err) {
      console.error('Failed to load real potential matches:', err);
    }
  };

  const [sentInterestIds, setSentInterestIds] = useState(new Set());

  useFocusEffect(
    React.useCallback(() => {
      fetchPremiumProfiles();
      fetchRealMatches();
      fetchSentInterests();
      fetchRecentChats();
    }, [])
  );

  const fetchSentInterests = async () => {
    try {
      let response;
      try {
        response = await api.get('/connections/sent');
      } catch (e) {
        response = await api.get('/connections/sent');
      }
      const list = response.data || [];
      
      const ids = new Set();
      list.forEach(item => {
        if (item.receiverId) ids.add(item.receiverId);
        if (item.receiverProfile && item.receiverProfile.userId) ids.add(item.receiverProfile.userId);
      });
      setSentInterestIds(ids);

      const formatted = list.map((item) => {
        const profile = item.receiverProfile || {};
        const photo = profile.profilePhotoUrl || profile.profilePhoto;
        const normalizedUrl = normalizePhotoUrl(photo);
        let timeAgo = 'Recent';
        if (item.createdAt) {
          const diffHours = Math.floor((new Date() - new Date(item.createdAt)) / (1000 * 60 * 60));
          if (diffHours < 1) timeAgo = 'Just now';
          else if (diffHours < 24) timeAgo = `${diffHours}h`;
          else timeAgo = `${Math.floor(diffHours / 24)}d`;
        }
        
        let displayStatus = 'Pending';
        if (item.status === 'ACCEPTED') displayStatus = 'Accepted';
        else if (item.status === 'DECLINED') displayStatus = 'Declined';
        else if (item.status === 'VIEWED') displayStatus = 'Viewed';

        return {
          id: item.id ? item.id.toString() : Math.random().toString(),
          userId: item.receiverId || profile.userId || item.receiverProfileId,
          name: profile.fullName || 'User',
          age: profile.age || 25,
          status: displayStatus,
          time: timeAgo,
          image: { uri: getFallbackAvatar(profile) },
        };
      });
      setSentInterests(formatted);
    } catch (err) {
      console.error('Failed to fetch sent interests:', err);
    }
  };

  const fetchRecentChats = async () => {
    try {
      const response = await api.get('/chat/conversations');
      const list = response.data || [];
      const formatted = list.map((c) => {
        const photo = c.otherProfilePhotoUrl || c.otherProfilePhoto || c.profilePhoto;
        const normalizedUrl = normalizePhotoUrl(photo);
        let timeStr = 'Recent';
        if (c.lastActive) {
          const date = new Date(c.lastActive);
          timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return {
          id: c.otherUserId ? c.otherUserId.toString() : Math.random().toString(),
          name: c.otherUserName || 'User',
          message: c.lastMessage || 'Start conversation',
          time: timeStr,
          unread: c.unreadCount || 0,
          image: { uri: getFallbackAvatar({ name: c.otherUserName, profilePhoto: photo }) },
        };
      });
      setChats(formatted);
    } catch (err) {
      console.error('Failed to fetch recent chats:', err);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const [profileRes, sentRes, receivedRes, chatsRes] = await Promise.all([
        api.get('/profiles/me').catch(() => null),
        api.get('/connections/sent').catch(() => null),
        api.get('/connections/received').catch(() => null),
        api.get('/chat/conversations').catch(() => null),
      ]);

      const profile = profileRes?.data || {};
      const sentList = sentRes?.data || [];
      const receivedList = receivedRes?.data || [];
      const chatList = chatsRes?.data || [];

      const newMatches = [...sentList, ...receivedList].filter(
        (c) => c.status?.toUpperCase() === 'ACCEPTED'
      ).length;
      const likesReceived = receivedList.length;
      const interestsSent = sentList.length;
      const activeChats = chatList.length;
      const profileViews = profile.viewsCount || profile.profileViews || 0;
      const rawHobbies = profile.hobbies
        ? profile.hobbies.split(',').map((h) => h.trim()).filter(Boolean)
        : [];

      // Build simple weekly chart data from totals (distributed across 4 days for visualization)
      const spread = (total) => {
        const base = Math.floor(total / 4);
        const rem = total % 4;
        return [base, base + Math.min(rem, 1), base + Math.min(rem, 2), base + (rem > 0 ? 1 : 0)];
      };

      setDashboardStats({
        profileViews,
        newMatches,
        likesReceived,
        activeChats,
        interestsSent,
        profileViewsWeekly: spread(profileViews),
        matchesWeekly: spread(newMatches),
        messagesWeekly: spread(activeChats * 3),
        hobbies: rawHobbies.slice(0, 6),
      });
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    }
  };

  const handleSendInterest = async (matchUser) => {
    try {
      try {
        await api.post(`/connections/send/${matchUser.id}`);
      } catch (e) {
        await api.post(`/connections/send/${matchUser.id}`);
      }
      setSentInterestIds((prev) => new Set(prev).add(matchUser.id));
      Toast.show({
        type: 'success',
        text1: 'Interest Sent!',
        text2: `Interest sent to ${matchUser.name}.`,
      });
      fetchSentInterests();
    } catch (err) {
      console.error('Failed to send interest:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to send interest. Please try again.',
      });
    }
  };

  const fetchShortlistedIds = async () => {
    try {
      const res = await api.get('/shortlist/my');
      const ids = (res.data || []).map((p) => p.userId || p.id).filter(Boolean);
      setShortlistedIds(new Set(ids));
    } catch (err) {
      console.error('Failed to load shortlist:', err);
    }
  };

  const handleShortlist = async (matchItem) => {
    const id = matchItem.id;
    const alreadyShortlisted = shortlistedIds.has(id);
    try {
      if (alreadyShortlisted) {
        await api.delete(`/shortlist/${id}`);
        setShortlistedIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
        Toast.show({ type: 'info', text1: 'Removed', text2: `${matchItem.name} removed from shortlist.` });
      } else {
        await api.post(`/shortlist/${id}`);
        setShortlistedIds((prev) => new Set(prev).add(id));
        Toast.show({ type: 'success', text1: 'Shortlisted!', text2: `${matchItem.name} added to your shortlist.` });
      }
    } catch (err) {
      console.error('Shortlist error:', err);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Could not update shortlist.' });
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2D1B22" />
      
      <ScrollView showsVerticalScrollIndicator={true} persistentScrollbar={true} bounces={false}>
        
        {/* ─── Header Section (Rose Gold) ─── */}
        <LinearGradient
          colors={['#3D1020', '#9E546A', '#C9748A']}
          style={styles.headerBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <SafeAreaView edges={['top']} />
          <View style={styles.headerTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -8 }}>
              <Image 
                source={require('../../../assets/images/project_logo_transperent.png')} 
                style={{ width: 30, height: 30, marginRight: 6 }} 
                resizeMode="contain"
              />
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.logoTextGold}>LOVEN</Text>
                <Text style={styles.logoTextPink}>ZEA</Text>
              </View>
            </View>
            <View style={styles.headerIcons}>
              <View style={styles.bellWrapper}>
                <Bell size={24} color="#FFF" />
                <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
              </View>
              <Image 
                source={{ uri: getFallbackAvatar(user) }} 
                style={styles.headerAvatar} 
                onError={(e) => console.log('Image failed:', getFallbackAvatar(user), e.nativeEvent)}
              />
              <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} style={{ marginLeft: 6 }}>
                <MoreHorizontal size={26} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.greetingSection}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.greetingText}>Good Morning, <Text style={styles.greetingName}>{user?.name ? user.name.split(' ')[0] : 'User'}!</Text></Text>
              <CheckCircle2 size={18} color="#D4AF37" style={{ marginLeft: 8 }} />
            </View>
            <View style={styles.locationRow}>
              <MapPin size={14} color="#A0B3D6" />
              <Text style={styles.locationText}>Mumbai, India</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.contentWrapper}>
          {/* ─── Profile Insights Card ─── */}
          <TouchableOpacity 
            style={[styles.card, styles.insightsCard]} 
            activeOpacity={0.9}
            onPress={() => router.push('/(main)/(tabs)/profile')}
          >
            <View style={styles.insightsHeader}>
              <View style={styles.insightsHeaderLeft}>
                <View style={styles.insightsIconCircle}>
                  <BarChart2 size={16} color="#FFF" />
                </View>
                <Text style={styles.insightsTitle}>Profile Insights</Text>
              </View>
              <Sparkles size={20} color="#F3D9DC" />
            </View>

            <View style={styles.insightsProgressHeader}>
              <Text style={styles.insightsSubText}>Profile Completed</Text>
              <Text style={styles.insightsPercentage}>{completionPercentage}%</Text>
            </View>
            
            <View style={styles.progressBarBg}>
              <LinearGradient
                colors={['#C9748A', '#E8A4B0']}
                style={[styles.progressBarFill, { width: `${completionPercentage}%` }]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              />
            </View>

            <View style={styles.insightsPillsRow}>
              <View style={styles.insightPill}>
                <View style={[styles.insightPillIcon, { backgroundColor: '#E8F5E9' }]}>
                  <User size={14} color="#4CAF50" />
                </View>
                <View style={styles.insightPillTextCol}>
                  <Text style={styles.insightPillTitle}>Personal Info</Text>
                  <View style={styles.insightPillSubRow}>
                    <Text style={styles.insightPillSub}>{personalInfoDone ? 'Completed ' : 'Pending '}</Text>
                    {personalInfoDone ? <CheckCircle2 size={10} color="#4CAF50" /> : <ChevronRight size={10} color="#7A6B72" />}
                  </View>
                </View>
              </View>

              <View style={styles.insightPill}>
                <View style={[styles.insightPillIcon, { backgroundColor: '#E3F2FD' }]}>
                  <ImageIcon size={14} color="#2196F3" />
                </View>
                <View style={styles.insightPillTextCol}>
                  <Text style={styles.insightPillTitle}>Pictures</Text>
                  <View style={styles.insightPillSubRow}>
                    <Text style={styles.insightPillSubAdded}>{picturesAdded}/6 Added </Text>
                    <ChevronRight size={10} color="#2196F3" />
                  </View>
                </View>
              </View>

              <View style={styles.insightPill}>
                <View style={[styles.insightPillIcon, { backgroundColor: '#FCE4EC' }]}>
                   <Heart size={14} color="#C9748A" />
                </View>
                <View style={styles.insightPillTextCol}>
                  <Text style={styles.insightPillTitle}>Interests</Text>
                  <View style={styles.insightPillSubRow}>
                    <Text style={styles.insightPillSub}>{interestsDone ? 'Completed ' : 'Pending '}</Text>
                     {interestsDone ? <CheckCircle2 size={10} color="#C9748A" /> : <ChevronRight size={10} color="#7A6B72" />}
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Heart shortlist FAB on Profile Insights card */}
          <TouchableOpacity
            style={styles.insightHeartFab}
            onPress={() => router.push({ pathname: '/(main)/(tabs)/sent-interests', params: { initialTab: 'shortlisted' } })}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#C9748A', '#9E546A']}
              style={styles.insightHeartFabGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Heart size={18} color="#FFF" fill="#FFF" strokeWidth={0} />
            </LinearGradient>
          </TouchableOpacity>

          {/* ─── Premium Profiles ─── */}
          <View style={{ marginLeft: 20, marginTop: 10, marginBottom: 12 }}>
            <SectionHeader icon={Sparkles} label="Premium Profiles" iconBg="#D4AF37" />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.connectionsScroll}>
            {realConnections.length > 0 ? (
              <>
                {realConnections.map(user => (
                  <TouchableOpacity key={user.id} style={styles.connectionItem} onPress={() => router.push({ pathname: '/user-details', params: { userId: user.id } })}>
                    <View style={styles.connectionAvatarWrapper}>
                      <Image 
                        source={user.image} 
                        style={styles.connectionAvatar} 
                        onError={(e) => console.log('Image failed:', user.image?.uri, e.nativeEvent)}
                      />
                      {user.isPremium && (
                        <View style={styles.proBadge}>
                          <Text style={styles.proBadgeText}>PRO</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.connectionName} numberOfLines={1}>{user.name}</Text>
                  </TouchableOpacity>
                ))}
                
                {/* See All card at the end */}
                <TouchableOpacity 
                  style={[styles.connectionItem, { justifyContent: 'center' }]} 
                  onPress={() => navigation.navigate('matches')}
                >
                  <View style={[styles.connectionAvatar, { backgroundColor: '#FCE8E6', justifyContent: 'center', alignItems: 'center', borderRadius: 28 }]}>
                    <Sparkles size={24} color="#D4AF37" />
                  </View>
                  <Text style={[styles.connectionName, { fontWeight: '700', color: '#D4AF37' }]} numberOfLines={1}>See All</Text>
                </TouchableOpacity>
              </>
            ) : (
              <EmptyState message="No profiles found" />
            )}
          </ScrollView>

          {/* ─── Potential Matches Carousel ─── */}
          <View style={[styles.matchesHeader, { marginBottom: 4 }]}>
            <SectionHeader icon={Heart} label="Potential Matches" iconBg="#e096aaff" />
            <TouchableOpacity onPress={() => navigation.navigate('matches')}><Text style={styles.swipeAllText}>Swipe All</Text></TouchableOpacity>
          </View>
          
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_SIZE}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: (width - ITEM_SIZE) / 2, paddingBottom: 20 }}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
          >
            {realMatches.length > 0 ? realMatches.map((item, index) => (
              <MatchCard 
                key={item.id} 
                item={item} 
                index={index} 
                scrollX={scrollX} 
                onPress={() => router.push({ pathname: '/user-details', params: { userId: item.id } })}
                onSendInterest={handleSendInterest}
                isInterestSent={sentInterestIds.has(item.id)}
                onShortlist={handleShortlist}
                isShortlisted={shortlistedIds.has(item.id)}
                onChat={(chatItem) => {
                  console.log('Opening chat from dashboard potential matches:', {
                    targetUserId: chatItem.id,
                    name: chatItem.name,
                    route: '/chat/[id]',
                  });
                  router.push({
                    pathname: '/chat/[id]',
                    params: {
                      id: String(chatItem.id),
                      name: chatItem.name,
                      photo: chatItem.image || ''
                    }
                  });
                }}
              />
            )) : (
              <View style={{ width: width, alignItems: 'center' }}>
                <EmptyState message="No potential matches found" />
              </View>
            )}
          </Animated.ScrollView>

          {/* ─── Recent Sent Interests ─── */}
          <View style={[styles.matchesHeader, { marginTop: 10, paddingHorizontal: 20 }]}>
            <SectionHeader icon={Star} label="Sent Interests" iconBg="#9E546A" />
            <TouchableOpacity onPress={() => router.push('/(main)/(tabs)/sent-interests')}>
              <Text style={styles.swipeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {sentInterests.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, paddingTop: 10 }}>
              {sentInterests.map(item => {
                const isViewed = item.status === 'Viewed';
                const isAccepted = item.status === 'Accepted';
                const isDeclined = item.status === 'Declined';
              
                let statusBg = '#FFF0F5';
                let statusColor = '#C9748A';
                if(isViewed) { statusBg = '#E8F4F8'; statusColor = '#D4AF37'; }
                else if(isAccepted) { statusBg = '#E8F5E9'; statusColor = '#4CAF50'; }
                else if(isDeclined) { statusBg = '#FFEBEE'; statusColor = '#F44336'; }

                return (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.sentInterestHorizontalCard}
                    onPress={() => item.userId && router.push({ pathname: '/user-details', params: { userId: item.userId } })}
                  >
                    <Image 
                      source={item.image} 
                      style={styles.sentHorizontalAvatar} 
                      onError={(e) => console.log('Image failed:', item.image?.uri, e.nativeEvent)}
                    />
                    <View style={styles.sentHorizontalInfo}>
                      <Text style={styles.sentHorizontalName} numberOfLines={1}>{item.name}, {item.age}</Text>
                      <Text style={styles.sentHorizontalTime}>{item.time}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                      <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <EmptyState 
              title="No Sent Interests"
              message="You haven't sent any interests yet." 
              image={require('../../../assets/images/no_interest_data.jpg')} 
            />
          )}

          {/* ─── Recent Chats ─── */}
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <SectionHeader icon={MessageCircle} label="Recent Chats" iconBg="#5C1E3A" />
              <TouchableOpacity onPress={() => navigation.navigate('messages')}>
                <Text style={styles.swipeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={{ marginTop: 15 }}>
              {chats.length > 0 ? (
                chats.map((chat, index) => (
                  <TouchableOpacity 
                    key={chat.id} 
                    activeOpacity={0.7} 
                    style={[styles.chatListItem, index !== chats.length - 1 && styles.chatDivider]}
                    onPress={() => {
                      console.log('Opening chat:', {
                        targetUserId: chat.id,
                        name: chat.name,
                        route: '/chat/[id]',
                      });
                      router.push({
                        pathname: '/chat/[id]',
                        params: {
                          id: String(chat.id),
                          name: chat.name,
                          photo: chat.image?.uri || ''
                        }
                      });
                    }}
                  >
                    <Image 
                      source={chat.image} 
                      style={styles.chatAvatar} 
                      onError={(e) => console.log('Image failed:', chat.image?.uri, e.nativeEvent)}
                    />
                    <View style={styles.chatInfo}>
                      <Text style={styles.chatName}>{chat.name}</Text>
                      <Text style={[styles.chatMessage, chat.unread > 0 && styles.chatMessageUnread]} numberOfLines={1}>{chat.message}</Text>
                    </View>
                    <View style={styles.chatMeta}>
                      <Text style={[styles.chatTime, chat.unread > 0 && styles.chatTimeUnread]}>{chat.time}</Text>
                      {chat.unread > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadText}>{chat.unread}</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <EmptyState 
                  title="No Recent Conversations"
                  message="Start a chat with your matches!" 
                  image={require('../../../assets/images/no_chat_data.png')} 
                />
              )}
            </View>
          </View>

          {/* ─── Engagement Stats ─── */}
          <View style={styles.card}>
            <View style={{ marginBottom: 12 }}>
              <SectionHeader icon={BarChart2} label="Engagement Stats" iconBg="#2D1B22" />
            </View>
            <Text style={styles.chartSubtitle}>Weekly Activity</Text>
            
            <View style={styles.legendRow}>
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#2D1B22' }]} /><Text style={styles.legendText}>Matches</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#C9748A' }]} /><Text style={styles.legendText}>Interests</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#D4AF37' }]} /><Text style={styles.legendText}>Messages</Text></View>
            </View>

            <LineChart
              data={{
                labels: ["Mon", "Tue", "Wed", "Thu"],
                datasets: [
                  { data: dashboardStats.matchesWeekly.map(v => Math.max(v, 0.1)), color: () => '#2D1B22', strokeWidth: 2 },
                  { data: dashboardStats.profileViewsWeekly.map(v => Math.max(v, 0.1)), color: () => '#C9748A', strokeWidth: 2 },
                  { data: dashboardStats.messagesWeekly.map(v => Math.max(v, 0.1)), color: () => '#D4AF37', strokeWidth: 2 },
                ]
              }}
              width={width - 60}
              height={180}
              withDots={false}
              withInnerLines={true}
              withOuterLines={false}
              withVerticalLines={false}
              chartConfig={{
                backgroundGradientFrom: "#FFF",
                backgroundGradientTo: "#FFF",
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: () => '#8E8E93',
                propsForBackgroundLines: { strokeDasharray: "", stroke: '#F0F0F0' },
              }}
              bezier
              style={styles.lineChart}
            />

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{dashboardStats.newMatches}</Text>
                <Text style={styles.statLabel}>New Matches</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{dashboardStats.likesReceived}</Text>
                <Text style={styles.statLabel}>Interests In</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{dashboardStats.activeChats}</Text>
                <Text style={styles.statLabel}>Chats Active</Text>
              </View>
            </View>
          </View>

          {/* ─── Your Highlights ─── */}
          <View style={{ marginLeft: 20, marginTop: 10, marginBottom: 8 }}>
            <SectionHeader icon={Sparkles} label="Your Highlights" iconBg="#C9748A" />
          </View>
          <View style={[styles.card, styles.highlightsRow]}>
            <View style={styles.highlightCol}>
              <Text style={styles.chartSubtitleCentered}>Profile Views</Text>
              <View style={styles.donutContainer}>
                <ProgressChart
                  data={[
                    Math.min((dashboardStats.profileViews || 0) / Math.max(dashboardStats.profileViews * 1.25 || 100, 1), 1),
                    Math.min((dashboardStats.newMatches || 0) / Math.max(dashboardStats.newMatches * 1.5 || 10, 1), 1),
                    Math.min((dashboardStats.interestsSent || 0) / Math.max(dashboardStats.interestsSent * 1.5 || 10, 1), 1),
                  ]}
                  width={120}
                  height={120}
                  strokeWidth={12}
                  radius={40}
                  chartConfig={{
                    backgroundGradientFrom: "#FFF",
                    backgroundGradientTo: "#FFF",
                    color: (opacity = 1, index) => {
                      const colors = ['rgba(11,28,63,1)', 'rgba(214,90,124,1)', 'rgba(212,175,55,1)'];
                      return colors[index] || `rgba(0,0,0,${opacity})`;
                    },
                  }}
                  hideLegend={true}
                />
                <View style={styles.donutCenter}>
                  <Text style={styles.donutValue}>{dashboardStats.profileViews}</Text>
                  <Text style={styles.donutLabel}>Profile views</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.highlightCol}>
              <Text style={styles.chartSubtitleCentered}>Interests Overview</Text>
              <View style={styles.interestTags}>
                {dashboardStats.hobbies.length > 0 ? (
                  dashboardStats.hobbies.map((hobby, i) => (
                    <View key={i} style={styles.intTag}><Text style={styles.intTagText}>{hobby}</Text></View>
                  ))
                ) : (
                  <>
                    <View style={styles.intTag}><Text style={styles.intTagText}>Matches: {dashboardStats.newMatches}</Text></View>
                    <View style={styles.intTag}><Text style={styles.intTagText}>Interests: {dashboardStats.interestsSent}</Text></View>
                    <View style={styles.intTag}><Text style={styles.intTagText}>Chats: {dashboardStats.activeChats}</Text></View>
                  </>
                )}
              </View>
            </View>
          </View>
          
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F7' },
  headerBackground: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoTextGold: {
    color: '#D4AF37', // Gold color to match the reference image
    fontSize: 22,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
    letterSpacing: 1.5,
  },
  logoTextPink: {
    color: '#E8A4B0', // Rose gold to match new theme
    fontSize: 22,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
    letterSpacing: 1.5,
  },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  bellWrapper: { position: 'relative' },
  badge: {
    position: 'absolute', top: -4, right: -4, backgroundColor: '#C9748A',
    width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: '#D4AF37' },
  
  greetingSection: { marginTop: 25 },
  greetingText: { color: '#FFF', fontSize: 24 },
  greetingName: { fontWeight: '700', color: '#D4AF37' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  locationText: { color: '#A0B3D6', fontSize: 14 },
  
  contentWrapper: { marginTop: -40 },
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  insightsCard: { 
    padding: 16, 
    backgroundColor: '#FFFBF9', 
    borderWidth: 1, 
    borderColor: '#FDF1EE', 
    borderRadius: 20,
    zIndex: 10,
    elevation: 6,
    overflow: 'visible',
  },
  insightsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  insightsHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  insightsIconCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#C9748A', justifyContent: 'center', alignItems: 'center' },
  insightsTitle: { fontSize: 16, fontWeight: '700', color: '#2D1B22' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#2D1B22', marginBottom: 5 },
  
  insightsProgressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  insightsSubText: { fontSize: 12, color: '#2D1B22', fontWeight: '600' },
  insightsPercentage: { fontSize: 14, color: '#C9748A', fontWeight: 'bold' },
  
  progressBarBg: { height: 8, backgroundColor: '#F3E2E5', borderRadius: 4, marginBottom: 20 },
  progressBarFill: { height: 8, borderRadius: 4 },
  
  insightsPillsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  insightHeartFab: {
    position: 'absolute',
    right: 30,
    top: 165,
    zIndex: 20,
    elevation: 12,
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  insightHeartFabGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#FFF',
  },
  insightPill: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    borderRadius: 14, 
    padding: 6, 
    borderWidth: 1, 
    borderColor: '#FDE8EE',
    shadowColor: '#C9748A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1
  },
  insightPillIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#C9748A', justifyContent: 'center', alignItems: 'center', marginRight: 6 },
  insightPillTextCol: { flex: 1 },
  insightPillTitle: { fontSize: 9, fontWeight: '700', color: '#2D1B22', marginBottom: 2 },
  insightPillSubRow: { flexDirection: 'row', alignItems: 'center' },
  insightPillSub: { fontSize: 7, color: '#7A6B72' },
  insightPillSubAdded: { fontSize: 7, color: '#C9748A' },

  connectionsScroll: { paddingHorizontal: 20, paddingVertical: 12, gap: 12 },
  connectionItem: { alignItems: 'center', width: 66 },
  connectionAvatarWrapper: {
    width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#C9748A',
    padding: 2, justifyContent: 'center', alignItems: 'center', marginBottom: 4, position: 'relative'
  },
  connectionAvatar: { width: 52, height: 52, borderRadius: 26 },
  connectionName: { fontSize: 11, fontWeight: '600', color: '#2D1B22', textAlign: 'center' },
  proBadge: {
    position: 'absolute', bottom: -4, backgroundColor: '#FFD700', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 8, borderWidth: 1, borderColor: '#FFF'
  },
  proBadgeText: { fontSize: 7, color: '#000', fontWeight: 'bold' },

  matchesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: -10 },
  swipeAllText: { color: '#2D1B22', fontSize: 14, fontWeight: '600' },
  
  matchCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.55,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#1A0A12',
    shadowColor: '#9E546A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  matchImage: { width: '100%', height: '100%', position: 'absolute' },
  matchBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#C9748A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  matchBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchGradient: { position: 'absolute', bottom: 0, width: '100%', height: '65%' },
  matchContent: { position: 'absolute', bottom: 0, width: '100%', padding: 14 },
  matchName: { color: '#FFF', fontSize: 20, fontWeight: '700', marginBottom: 3 },
  matchSub: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginBottom: 1 },
  matchScoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  matchScoreLabel: { color: '#A0B3D6', fontSize: 12 },
  matchScoreValue: { color: '#D4AF37', fontSize: 14, fontWeight: 'bold' },
  matchActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 12,
  },
  matchCircleActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  matchSendBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  matchSendBtnSent: {
    opacity: 0.9,
    shadowColor: '#4CAF50',
  },
  matchSendGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 6,
  },
  matchSendText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  viewProfileBtn: { borderRadius: 12, overflow: 'hidden' },
  viewProfileGradient: { paddingVertical: 12, alignItems: 'center' },
  viewProfileText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  chartSubtitle: { fontSize: 14, color: '#111', fontWeight: '600', marginBottom: 15 },
  chartSubtitleCentered: { fontSize: 14, color: '#111', fontWeight: '600', marginBottom: 10, textAlign: 'center' },
  legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 15, marginBottom: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, color: '#666' },
  lineChart: { marginLeft: -15 },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#666', textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: '#EEE', height: 30, alignSelf: 'center' },

  highlightsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  highlightCol: { flex: 1, alignItems: 'center' },
  donutContainer: { position: 'relative', width: 120, height: 120, justifyContent: 'center', alignItems: 'center' },
  donutCenter: { position: 'absolute', alignItems: 'center' },
  donutValue: { fontSize: 20, fontWeight: '700', color: '#111' },
  donutLabel: { fontSize: 8, color: '#666', textAlign: 'center', width: 50 },
  
  interestTags: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 10 },
  intTag: { backgroundColor: '#FFF8F7', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 15 },
  intTagText: { fontSize: 11, color: '#333'  },
  sentInterestHorizontalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 16,
    marginRight: 15,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sentHorizontalAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  sentHorizontalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  sentHorizontalName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D1B22',
  },
  sentHorizontalTime: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  chatListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  chatDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  chatAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D1B22',
  },
  chatMessage: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },
  chatMessageUnread: {
    color: '#2D1B22',
    fontWeight: '600',
  },
  chatMeta: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  chatTime: {
    fontSize: 11,
    color: '#8E8E93',
  },
  chatTimeUnread: {
    color: '#C9748A',
    fontWeight: '700',
  },
  unreadBadge: {
    backgroundColor: '#C9748A',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  unreadText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#FFF8F9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FCE4EC',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  emptyStateClipart: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  emptyStateIconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D1B22',
    marginBottom: 4,
  },
  emptyStateMessage: {
    color: '#7A6B72',
    fontSize: 13,
    textAlign: 'center',
  }
});
