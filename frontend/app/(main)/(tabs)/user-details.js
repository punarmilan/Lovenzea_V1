import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Platform,
  Dimensions,
  PanResponder,
  Image
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { DrawerActions } from '@react-navigation/native';
import { 
  ArrowLeft, 
  Heart, 
  MapPin, 
  MessageCircleHeart, 
  Star,
  CheckCircle,
  Activity,
  Smile,
  Compass,
  Sparkles,
  Users,
  Briefcase,
  Award,
  Globe,
  Phone,
  Mail,
  Map,
} from 'lucide-react-native';
import api from '../../../src/services/api';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

export default function UserDetails() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interestStatus, setInterestStatus] = useState(null);
  const [interestId, setInterestId] = useState(null);
  const [activeTab, setActiveTab] = useState('Personal');

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

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/profiles/${userId}`);
      setProfile(res.data);
      checkInterestStatus();
    } catch (error) {
      console.error('Failed to load user details:', error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Could not load profile details.' });
    } finally {
      setLoading(false);
    }
  };

  const checkInterestStatus = async () => {
    try {
      const res = await api.get('/connection-requests/sent');
      const request = res.data.find(req => req.receiverId === parseInt(userId, 10));
      if (request) {
        setInterestStatus(request.status);
        setInterestId(request.id);
      }
    } catch (error) {
      console.error('Error checking interest status:', error);
    }
  };

  const handleSendInterest = async () => {
    try {
      // Optimistic update
      setInterestStatus('PENDING');
      const res = await api.post(`/connection-requests/send/${userId}`);
      setInterestId(res.data.id);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Interest sent successfully!' });
    } catch (error) {
      console.error('Failed to send interest:', error);
      setInterestStatus(null);
      Toast.show({ type: 'error', text1: 'Error', text2: error.response?.data?.message || 'Failed to send interest.' });
    }
  };

  if (loading || !profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C9748A" />
        <Text style={styles.loadingText}>Fetching profile details...</Text>
      </View>
    );
  }

  const albumPhotos = [
    profile.profilePhotoUrl,
    profile.photoUrl2,
    profile.photoUrl3,
    profile.photoUrl4,
    profile.photoUrl5,
    profile.photoUrl6
  ].filter(Boolean);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* ─── Header Image Backdrop ─── */}
        <View style={styles.imageBackdropContainer}>
          <Image 
            source={profile.profilePhotoUrl ? { uri: profile.profilePhotoUrl } : require('../../../assets/images/female_avatar.png')} 
            style={styles.backdropImage} 
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.95)', '#FFF']}
            style={styles.gradientOverlay}
          />
          
          {/* Header Controls */}
          <View style={styles.headerControlsRow}>
            <TouchableOpacity style={styles.backCircleBtn} onPress={() => router.back()}>
              <ArrowLeft size={22} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Bottom-Right Action Buttons */}
          <View style={styles.photoActionsRow}>
            <TouchableOpacity 
              style={styles.actionCircleBtn} 
              onPress={() => router.push({ pathname: '/messages', params: { userId: profile.userId, name: profile.fullName } })}
            >
              <MessageCircleHeart size={22} color="#FFF" />
            </TouchableOpacity>

            {interestStatus === 'PENDING' || interestStatus === 'ACCEPTED' ? (
              <View style={[styles.actionCircleBtn, styles.actionCircleBtnSent]}>
                <Heart size={22} color="#319795" fill="#319795" />
              </View>
            ) : (
              <TouchableOpacity style={styles.actionCircleBtn} onPress={handleSendInterest}>
                <Heart size={22} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ─── Profile Content Area ─── */}
        <View style={styles.content}>
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.profileName}>{profile.fullName}, {profile.age || 'N/A'}</Text>
              <CheckCircle size={18} color="#C6A664" style={{ marginLeft: 8 }} />
            </View>
            <View style={styles.locationRow}>
              <MapPin size={15} color="#C9748A" style={{ marginRight: 4 }} />
              <Text style={styles.profileLocation}>{profile.city || 'Mumbai'}, India</Text>
            </View>
          </View>

          {/* Quick Summary Pills Bar */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickStatsRow}>
            {profile.height && (
              <View style={styles.statPill}>
                <Activity size={12} color="#C9748A" style={{ marginRight: 6 }} />
                <Text style={styles.statPillText}>{profile.height}</Text>
              </View>
            )}
            {profile.maritalStatus && (
              <View style={[styles.statPill, { backgroundColor: '#F8F9FA', borderColor: '#D6E4F0' }]}>
                <Smile size={12} color="#3182CE" style={{ marginRight: 6 }} />
                <Text style={[styles.statPillText, { color: '#2B6CB0' }]}>{profile.maritalStatus}</Text>
              </View>
            )}
            {profile.religion && (
              <View style={[styles.statPill, { backgroundColor: '#FFF9E6', borderColor: '#FFEAA7' }]}>
                <Compass size={12} color="#C6A664" style={{ marginRight: 6 }} />
                <Text style={[styles.statPillText, { color: '#B7791F' }]}>{profile.religion}</Text>
              </View>
            )}
            {profile.motherTongue && (
              <View style={[styles.statPill, { backgroundColor: '#EBF8FF', borderColor: '#BEE3F8' }]}>
                <Sparkles size={12} color="#319795" style={{ marginRight: 6 }} />
                <Text style={[styles.statPillText, { color: '#2C7A7B' }]}>{profile.motherTongue}</Text>
              </View>
            )}
          </ScrollView>

          {/* Bio Panel (Always on Top) */}
          <View style={styles.bioCard}>
            <Text style={styles.cardHeaderTitle}>My Story</Text>
            <Text style={styles.bioText}>
              {profile.aboutMe || "I'm someone who values good conversations, trust, and family. Looking for a partner to build a beautiful life and grow together."}
            </Text>
          </View>

          {/* Photo Album Gallery (Always on Top) */}
          {albumPhotos.length > 0 && (
            <View style={styles.albumSection}>
              <Text style={styles.sectionHeaderTitle}>Photo Gallery</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.albumScroll}>
                {albumPhotos.map((url, index) => (
                  <View key={index} style={styles.albumPhotoWrapper}>
                    <Image source={{ uri: url }} style={styles.albumImage} />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Interests Badges Card (Always on Top) */}
          <View style={styles.interestsCard}>
            <Text style={styles.cardHeaderTitle}>Interests & Hobbies</Text>
            <View style={styles.interestsGrid}>
              {(profile.hobbies ? profile.hobbies.split(',') : ["Fitness", "Movies", "Music", "Coffee", "Travel"]).map((interest, i) => (
                <View key={i} style={styles.interestTag}>
                  <Star size={11} color="#C6A664" fill="#C6A664" style={{ marginRight: 6 }} />
                  <Text style={styles.interestTagText}>{interest.trim()}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Tab Segment Selector Control */}
          <View style={styles.segmentContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.segmentScroll}>
              {TABS_LIST.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                      {tab}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
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
                    <View style={styles.infoPill}><Text style={styles.infoKey}>Born</Text><Text style={styles.infoVal}>{profile.dateOfBirth || 'N/A'}</Text></View>
                    <View style={styles.infoPill}><Text style={styles.infoKey}>Time</Text><Text style={styles.infoVal}>{profile.timeOfBirth || 'N/A'}</Text></View>
                    <View style={styles.infoPill}><Text style={styles.infoKey}>Weight</Text><Text style={styles.infoVal}>{profile.weight ? `${profile.weight} kg` : 'N/A'}</Text></View>
                    <View style={styles.infoPill}><Text style={styles.infoKey}>Manglik</Text><Text style={styles.infoVal}>{profile.manglikStatus || 'NO'}</Text></View>
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
                    <View style={styles.infoPill}><Text style={styles.infoKey}>Religion</Text><Text style={styles.infoVal}>{profile.religion || 'N/A'}</Text></View>
                    <View style={styles.infoPill}><Text style={styles.infoKey}>Caste</Text><Text style={styles.infoVal}>{profile.caste || 'N/A'}</Text></View>
                    <View style={styles.infoPill}><Text style={styles.infoKey}>Sub-Caste</Text><Text style={styles.infoVal}>{profile.subCaste || 'N/A'}</Text></View>
                    <View style={styles.infoPill}><Text style={styles.infoKey}>Gothra</Text><Text style={styles.infoVal}>{profile.gotra || 'N/A'}</Text></View>
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
                    <View style={styles.infoPillRow}><Text style={styles.infoKey}>Father Status</Text><Text style={styles.infoVal}>{profile.fatherStatus || 'N/A'}</Text></View>
                    <View style={styles.infoPillRow}><Text style={styles.infoKey}>Mother Status</Text><Text style={styles.infoVal}>{profile.motherStatus || 'N/A'}</Text></View>
                    <View style={styles.infoPillRow}><Text style={styles.infoKey}>Brothers</Text><Text style={styles.infoVal}>{profile.brothersCount || '0'}</Text></View>
                    <View style={styles.infoPillRow}><Text style={styles.infoKey}>Sisters</Text><Text style={styles.infoVal}>{profile.sistersCount || '0'}</Text></View>
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
                    <View style={styles.infoPillRow}><Text style={styles.infoKey}>Education</Text><Text style={styles.infoVal}>{profile.educationLevel || 'N/A'}</Text></View>
                    <View style={styles.infoPillRow}><Text style={styles.infoKey}>Field</Text><Text style={styles.infoVal}>{profile.educationField || 'N/A'}</Text></View>
                    <View style={styles.infoPillRow}><Text style={styles.infoKey}>Occupation</Text><Text style={styles.infoVal}>{profile.occupation || 'N/A'}</Text></View>
                    <View style={styles.infoPillRow}><Text style={styles.infoKey}>Income</Text><Text style={styles.infoVal}>{profile.annualIncome || 'N/A'}</Text></View>
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
                    <View style={styles.infoPill}><Text style={styles.infoKey}>Diet</Text><Text style={styles.infoVal}>{profile.diet || 'N/A'}</Text></View>
                    <View style={styles.infoPill}><Text style={styles.infoKey}>Drinking</Text><Text style={styles.infoVal}>{profile.drinkingHabit || 'N/A'}</Text></View>
                    <View style={styles.infoPill}><Text style={styles.infoKey}>Smoking</Text><Text style={styles.infoVal}>{profile.smokingHabit || 'N/A'}</Text></View>
                    <View style={styles.infoPill}><Text style={styles.infoKey}>Residency</Text><Text style={styles.infoVal}>{profile.residencyStatus || 'N/A'}</Text></View>
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
                    <View style={styles.infoPillRow}><Text style={styles.infoKey}>Age Range</Text><Text style={styles.infoVal}>{profile.partnerPreference?.minAge || '18'} - {profile.partnerPreference?.maxAge || '35'}</Text></View>
                    <View style={styles.infoPillRow}><Text style={styles.infoKey}>Height Range</Text><Text style={styles.infoVal}>{profile.partnerPreference?.minHeight || '5ft'} - {profile.partnerPreference?.maxHeight || '6ft'}</Text></View>
                    <View style={styles.infoPillRow}><Text style={styles.infoKey}>Religion</Text><Text style={styles.infoVal}>{profile.partnerPreference?.preferredReligion || 'Any'}</Text></View>
                    <View style={styles.infoPillRow}><Text style={styles.infoKey}>Diet</Text><Text style={styles.infoVal}>{profile.partnerPreference?.preferredDiet || 'Any'}</Text></View>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'Location' && (
              <View style={styles.tabContentWrapper}>
                <View style={[styles.gridCard, { backgroundColor: '#F4F4F5', borderColor: '#E4E4E7', width: '100%' }]}>
                  <View style={styles.gridCardHeader}>
                    <Globe size={16} color="#71717A" />
                    <Text style={[styles.gridCardTitle, { color: '#3F3F46' }]}>Location</Text>
                  </View>
                  <View style={styles.gridCardBody}>
                    <View style={styles.infoPill}><Text style={styles.infoKey}>City</Text><Text style={styles.infoVal}>{profile.city || 'N/A'}</Text></View>
                    <View style={styles.infoPill}><Text style={styles.infoKey}>State</Text><Text style={styles.infoVal}>{profile.state || 'N/A'}</Text></View>
                    <View style={styles.infoPill}><Text style={styles.infoKey}>Country</Text><Text style={styles.infoVal}>{profile.country || 'India'}</Text></View>
                    <View style={styles.infoPill}><Text style={styles.infoKey}>Zip Code</Text><Text style={styles.infoVal}>{profile.zipCode || 'N/A'}</Text></View>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'Contact' && (
              <View style={styles.tabContentWrapper}>
                <View style={[styles.gridCard, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE', width: '100%' }]}>
                  <View style={styles.gridCardHeader}>
                    <Phone size={16} color="#3B82F6" />
                    <Text style={[styles.gridCardTitle, { color: '#1E3A8A' }]}>Contact Info</Text>
                  </View>
                  <View style={styles.gridCardBody}>
                    <View style={styles.infoPill}><Text style={styles.infoKey}>Email</Text><Text style={styles.infoVal}>{profile.email || 'N/A'}</Text></View>
                    <View style={styles.infoPill}><Text style={styles.infoKey}>Phone</Text><Text style={styles.infoVal}>{profile.mobileNumber || 'N/A'}</Text></View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
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
  imageBackdropContainer: {
    height: 380,
    width: '100%',
    position: 'relative',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
  },
  headerControlsRow: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoActionsRow: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 10,
  },
  actionCircleBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#C9748A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionCircleBtnSent: {
    backgroundColor: '#E6F4EA',
    borderWidth: 1.5,
    borderColor: '#319795',
  },
  content: {
    marginTop: -40,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },
  headerInfo: {
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2D1E23',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  profileLocation: {
    fontSize: 13,
    color: '#8F7E84',
    fontWeight: '600',
  },
  quickStatsRow: {
    paddingVertical: 4,
    marginBottom: 20,
    gap: 8,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C9748A',
  },
  bioCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#777777',
    marginBottom: 14,
  },
  cardHeaderTitle: {
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
  albumSection: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#777777',
    marginBottom: 14,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2D1E23',
    marginBottom: 12,
  },
  albumScroll: {
    gap: 10,
  },
  albumPhotoWrapper: {
    width: 90,
    height: 90,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#777777',
  },
  albumImage: {
    width: '100%',
    height: '100%',
  },
  interestsCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#777777',
    marginBottom: 20,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F4',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  interestTagText: {
    fontSize: 11,
    color: '#C9748A',
    fontWeight: '700',
  },
  segmentContainer: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    marginTop: 6,
    marginBottom: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#777777',
  },
  segmentScroll: {
    paddingHorizontal: 4,
  },
  segmentBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 6,
  },
  segmentBtnActive: {
    backgroundColor: '#C9748A',
  },
  segmentText: {
    fontSize: 12,
    color: '#8F7E84',
    fontWeight: '700',
  },
  segmentTextActive: {
    color: '#FFF',
  },
  tabContentWrapper: {
    width: '100%',
  },
  gridCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
  },
  gridCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
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
    borderColor: 'rgba(0,0,0,0.03)',
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
    borderColor: 'rgba(0,0,0,0.03)',
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
});
