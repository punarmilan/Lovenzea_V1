import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search as SearchIcon,
  Sliders,
  MapPin,
  Sparkles,
  Heart,
  Music,
  Camera,
  Globe,
  Feather,
  Dumbbell,
  Palette,
  Plane,
  X,
  ChevronRight,
  User,
  Users
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import api, { LOCAL_IP } from '../../../src/services/api';

const { width } = Dimensions.get('window');

const INTEREST_TAGS = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'language', label: 'Language', icon: Globe },
  { id: 'nature', label: 'Nature', icon: Feather },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'writing', label: 'Writing', icon: Feather },
  { id: 'art', label: 'Art', icon: Palette },
  { id: 'travel', label: 'Travel', icon: Plane },
];

export default function SearchScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const scrollViewRef = React.useRef(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('Music');
  const [allProfiles, setAllProfiles] = useState([]);
  const [selectedMapProfile, setSelectedMapProfile] = useState(null);
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [resultsY, setResultsY] = useState(0);

  // Advanced Filter States
  const [maxDistance, setMaxDistance] = useState(200); // 200km radius filter
  const [genderFilter, setGenderFilter] = useState('ALL'); // ALL, MALE, FEMALE
  const [ageFromFilter, setAgeFromFilter] = useState('');
  const [ageToFilter, setAgeToFilter] = useState('');
  const [maritalStatusFilter, setMaritalStatusFilter] = useState([]);
  const [religionFilter, setReligionFilter] = useState([]);
  const [educationFilter, setEducationFilter] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchProfiles({});
    }, [])
  );

  const fetchProfiles = async (filterPayload = {}) => {
    try {
      const response = await api.post('/profiles/search?page=0&size=50', filterPayload);
      const rawContent = response.data.content || [];
      const formatted = rawContent.map((p, idx) => {
        const fixedUrl = p.profilePhotoUrl ? p.profilePhotoUrl.replace('localhost', LOCAL_IP) : null;
        // Calculate deterministic distance under 200km radius
        const computedDist = Math.floor(((p.id || idx + 1) * 17) % 180 + 2); // 2km to 182km
        
        // Relative map positions (in percentage)
        const mapPositions = [
          { top: '22%', left: '32%' },
          { top: '48%', left: '62%' },
          { top: '68%', left: '28%' },
          { top: '35%', left: '72%' },
          { top: '60%', left: '78%' },
          { top: '15%', left: '68%' },
        ];
        const mapPos = mapPositions[idx % mapPositions.length];

        return {
          id: p.userId || p.id,
          profileId: p.profileId || `P${p.id}`,
          fullName: p.fullName || 'User',
          firstName: p.fullName ? p.fullName.split(' ')[0] : 'User',
          age: p.age || 25,
          city: p.city || 'Mumbai',
          image: fixedUrl ? { uri: fixedUrl } : { uri: `https://ui-avatars.com/api/?background=E91E63&color=fff&name=${encodeURIComponent(p.fullName || 'User')}` },
          distance: computedDist,
          interest: p.hobbies || (idx % 2 === 0 ? 'Music' : 'Photography'),
          isNew: idx < 5,
          mapPos: mapPos,
          maritalStatus: p.maritalStatus || 'Single',
          religion: p.religion || 'Hindu',
          educationLevel: p.educationLevel || 'Graduate',
          gender: p.gender || 'FEMALE',
        };
      });
      setAllProfiles(formatted);
      if (formatted.length > 0) {
        setSelectedMapProfile(formatted[0]);
      }
    } catch (err) {
      console.error('Failed to fetch profiles for search:', err);
    }
  };

  const handleApplyFilters = async () => {
    const payload = {};
    if (genderFilter !== 'ALL') {
      payload.gender = genderFilter;
    }
    if (ageFromFilter !== '') {
      payload.ageFrom = parseInt(ageFromFilter, 10);
    }
    if (ageToFilter !== '') {
      payload.ageTo = parseInt(ageToFilter, 10);
    }
    if (maritalStatusFilter.length > 0) {
      payload.maritalStatus = maritalStatusFilter;
    }
    if (religionFilter.length > 0) {
      payload.religion = religionFilter;
    }
    if (educationFilter.length > 0) {
      payload.educationLevel = educationFilter;
    }

    await fetchProfiles(payload);
    setShowFilterBar(false);

    // Auto-scroll to results below map
    if (scrollViewRef.current && resultsY > 0) {
      scrollViewRef.current.scrollTo({ y: resultsY, animated: true });
    }
  };

  const handleClearFilters = async () => {
    setGenderFilter('ALL');
    setAgeFromFilter('');
    setAgeToFilter('');
    setMaritalStatusFilter([]);
    setReligionFilter([]);
    setEducationFilter([]);
    setMaxDistance(200);
    
    await fetchProfiles({});
    setShowFilterBar(false);
  };

  const toggleFilterItem = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Filter profiles within 200km radius and matching selected interest / search query
  const filteredProfiles = useMemo(() => {
    return allProfiles.filter((p) => {
      // 200km radius condition
      const withinRadius = p.distance <= maxDistance;
      
      // Search query match
      const queryMatch = searchQuery === '' || 
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.profileId.toLowerCase().includes(searchQuery.toLowerCase());

      // Interest match
      const interestMatch = selectedInterest === 'All' || 
        (p.interest && p.interest.toLowerCase().includes(selectedInterest.toLowerCase()));

      return withinRadius && queryMatch && interestMatch;
    });
  }, [allProfiles, maxDistance, searchQuery, selectedInterest]);

  // Profiles strictly within 200km radius for Map view
  const mapProfiles = useMemo(() => {
    return filteredProfiles.slice(0, 5); // Limit 5 markers on map for optimal UI
  }, [filteredProfiles]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#FFF' }} />

      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* ─── Search Input & Filter Row ─── */}
        <View style={styles.searchRow}>
          <View style={styles.searchBarWrapper}>
            <SearchIcon size={20} color="#777777" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, ID, or city..."
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
          
          <TouchableOpacity 
            style={styles.filterIconBtn} 
            onPress={() => setShowFilterBar(!showFilterBar)}
          >
            <Sliders size={20} color={showFilterBar ? '#C9748A' : '#333333'} />
          </TouchableOpacity>
        </View>

        {/* ─── Expandable Advanced Filters ─── */}
        {showFilterBar && (
          <View style={styles.filterBarContainer}>
            {/* Radius Filter */}
            <Text style={styles.filterLabel}>Max Radius: <Text style={{ color: '#C9748A', fontWeight: 'bold' }}>{maxDistance} km</Text></Text>
            <View style={styles.radiusPillsRow}>
              {[50, 100, 150, 200].map((dist) => (
                <TouchableOpacity
                  key={dist}
                  style={[styles.radiusPill, maxDistance === dist && styles.radiusPillActive]}
                  onPress={() => setMaxDistance(dist)}
                >
                  <Text style={[styles.radiusPillText, maxDistance === dist && styles.radiusPillTextActive]}>
                    {dist} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Gender Filter */}
            <Text style={[styles.filterLabel, { marginTop: 14 }]}>Gender</Text>
            <View style={styles.filterOptionRow}>
              {['ALL', 'MALE', 'FEMALE'].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.filterPill, genderFilter === g && styles.filterPillActive]}
                  onPress={() => setGenderFilter(g)}
                >
                  <Text style={[styles.filterPillText, genderFilter === g && styles.filterPillTextActive]}>
                    {g.charAt(0) + g.slice(1).toLowerCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Age Range Filter */}
            <Text style={[styles.filterLabel, { marginTop: 14 }]}>Age Range</Text>
            <View style={styles.ageInputRow}>
              <TextInput
                style={styles.ageInput}
                placeholder="Min Age"
                placeholderTextColor="#777777"
                keyboardType="numeric"
                value={ageFromFilter}
                onChangeText={setAgeFromFilter}
              />
              <Text style={styles.ageDivider}>to</Text>
              <TextInput
                style={styles.ageInput}
                placeholder="Max Age"
                placeholderTextColor="#777777"
                keyboardType="numeric"
                value={ageToFilter}
                onChangeText={setAgeToFilter}
              />
            </View>

            {/* Marital Status Filter */}
            <Text style={[styles.filterLabel, { marginTop: 14 }]}>Marital Status</Text>
            <View style={styles.filterOptionRow}>
              {['SINGLE', 'DIVORCED', 'WIDOWED'].map((status) => {
                const isSelected = maritalStatusFilter.includes(status);
                return (
                  <TouchableOpacity
                    key={status}
                    style={[styles.filterPill, isSelected && styles.filterPillActive]}
                    onPress={() => toggleFilterItem(maritalStatusFilter, setMaritalStatusFilter, status)}
                  >
                    <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Religion Filter */}
            <Text style={[styles.filterLabel, { marginTop: 14 }]}>Religion</Text>
            <View style={styles.filterOptionRow}>
              {['HINDU', 'MUSLIM', 'CHRISTIAN', 'SIKH'].map((rel) => {
                const isSelected = religionFilter.includes(rel);
                return (
                  <TouchableOpacity
                    key={rel}
                    style={[styles.filterPill, isSelected && styles.filterPillActive]}
                    onPress={() => toggleFilterItem(religionFilter, setReligionFilter, rel)}
                  >
                    <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                      {rel.charAt(0) + rel.slice(1).toLowerCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Education Filter */}
            <Text style={[styles.filterLabel, { marginTop: 14 }]}>Education Level</Text>
            <View style={styles.filterOptionRow}>
              {['UNDERGRADUATE', 'GRADUATE', 'POSTGRADUATE'].map((edu) => {
                const isSelected = educationFilter.includes(edu);
                return (
                  <TouchableOpacity
                    key={edu}
                    style={[styles.filterPill, isSelected && styles.filterPillActive]}
                    onPress={() => toggleFilterItem(educationFilter, setEducationFilter, edu)}
                  >
                    <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                      {edu.charAt(0) + edu.slice(1).toLowerCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

             {/* Action Buttons Row */}
             <View style={styles.actionButtonsRow}>
               <TouchableOpacity 
                 style={styles.clearBtn} 
                 activeOpacity={0.8}
                 onPress={handleClearFilters}
               >
                 <Text style={styles.clearBtnText}>Clear Filters</Text>
               </TouchableOpacity>

               <TouchableOpacity 
                 style={styles.applyBtn} 
                 activeOpacity={0.9}
                 onPress={handleApplyFilters}
               >
                 <LinearGradient
                   colors={['#C9748A', '#C9748A']}
                   style={styles.applyBtnGradient}
                   start={{ x: 0, y: 0 }}
                   end={{ x: 1, y: 0 }}
                 >
                   <Text style={styles.applyBtnText}>Apply & Search</Text>
                 </LinearGradient>
               </TouchableOpacity>
             </View>

          </View>
        )}

        {/* ─── Featured Profiles Cards Carousel ─── */}
        <View style={styles.carouselSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselScroll}>
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.cardItem}
                  activeOpacity={0.85}
                  onPress={() => router.push({ pathname: '/user-details', params: { userId: item.id } })}
                >
                  <Image source={item.image} style={styles.cardImage} />
                  
                  {/* NEW Badge */}
                  {item.isNew && (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>NEW</Text>
                    </View>
                  )}

                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.75)']}
                    style={styles.cardGradient}
                  />

                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName} numberOfLines={1}>{item.firstName}, {item.age}</Text>
                    <View style={styles.distanceBadge}>
                      <MapPin size={10} color="#FFF" style={{ marginRight: 3 }} />
                      <Text style={styles.distanceText}>{item.distance} km away</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noResultsCard}>
                <Text style={styles.noResultsText}>No profiles found within radius</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* ─── Interest Chips Section ─── */}
        <View style={styles.interestSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Interest</Text>
            <TouchableOpacity onPress={() => setSelectedInterest('All')}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.interestsScroll}>
            {INTEREST_TAGS.map((tag) => {
              const IconComp = tag.icon;
              const isSelected = selectedInterest.toLowerCase() === tag.label.toLowerCase();
              return (
                <TouchableOpacity
                  key={tag.id}
                  style={[styles.interestChip, isSelected && styles.interestChipActive]}
                  onPress={() => setSelectedInterest(tag.label)}
                >
                  <IconComp size={15} color={isSelected ? '#FFF' : '#333333'} style={{ marginRight: 6 }} />
                  <Text style={[styles.interestChipText, isSelected && styles.interestChipTextActive]}>
                    {tag.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ─── Around Me (Interactive Map with 200km Radius Profiles) ─── */}
        <View style={styles.aroundMeSection}>
          <Text style={styles.sectionTitle}>Around me</Text>
          <Text style={styles.aroundMeSub}>
            People with <Text style={{ color: '#C9748A', fontWeight: 'bold' }}>"{selectedInterest}"</Text> interest around you (within {maxDistance}km)
          </Text>

          {/* Map Graphic Container */}
          <View style={styles.mapCard}>
            {/* Map Canvas Background Graphic */}
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop' }}
              style={styles.mapBackgroundImage}
            />
            <View style={styles.mapOverlayTint} />

            {/* Map Vector Grid Lines Accent */}
            <View style={styles.mapRoadLine1} />
            <View style={styles.mapRoadLine2} />

            {/* Render Profile Photo Markers within 200km Radius */}
            {mapProfiles.map((p) => {
              const isSelected = selectedMapProfile?.id === p.id;
              return (
                <View key={p.id} style={[styles.mapMarkerContainer, p.mapPos]}>
                  {/* Callout Bubble above selected profile */}
                  {isSelected && (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      style={styles.calloutBubble}
                      onPress={() => router.push({ pathname: '/user-details', params: { userId: p.id } })}
                    >
                      <Text style={styles.calloutText}>Connect with <Text style={{ fontWeight: 'bold' }}>{p.firstName}</Text> ✨</Text>
                      <View style={styles.calloutArrow} />
                    </TouchableOpacity>
                  )}

                  {/* Circle Profile Photo Marker */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.markerCircleWrapper, isSelected && styles.markerCircleActive]}
                    onPress={() => {
                      setSelectedMapProfile(p);
                      router.push({ pathname: '/user-details', params: { userId: p.id } });
                    }}
                  >
                    <Image source={p.image} style={styles.markerAvatar} />
                    <View style={styles.markerBadgePin}>
                      <MapPin size={8} color="#FFF" />
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}

            {/* Map Landmark Pins Accent */}
            <View style={[styles.landmarkPin, { top: '75%', left: '15%' }]}>
              <View style={styles.landmarkIconWrap}>
                <MapPin size={14} color="#C9748A" />
              </View>
              <Text style={styles.landmarkLabel}>Fun Station</Text>
            </View>

            <View style={[styles.landmarkPin, { top: '55%', left: '50%' }]}>
              <View style={[styles.landmarkIconWrap, { backgroundColor: '#C9748A' }]}>
                <MapPin size={12} color="#FFF" />
              </View>
              <Text style={styles.landmarkLabel}>Central Park</Text>
            </View>

          </View>
        </View>
        {/* ─── Search Results Section (Rendered below the map) ─── */}
        <View 
          style={styles.resultsSection}
          onLayout={(event) => {
            const { y } = event.nativeEvent.layout;
            setResultsY(y);
          }}
        >
          <Text style={styles.sectionTitle}>Search Results</Text>
          <Text style={styles.resultsSub}>
            Showing {filteredProfiles.length} profiles matching filters
          </Text>

          <View style={styles.resultsGrid}>
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.resultCard}
                  activeOpacity={0.85}
                  onPress={() => router.push({ pathname: '/user-details', params: { userId: p.id } })}
                >
                  <View style={styles.resultImageWrapper}>
                    <Image source={p.image} style={styles.resultImage} />
                    <View style={styles.resultDistanceBadge}>
                      <MapPin size={10} color="#FFF" style={{ marginRight: 2 }} />
                      <Text style={styles.resultDistanceText}>{p.distance} km</Text>
                    </View>
                  </View>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultName} numberOfLines={1}>
                      {p.fullName}, {p.age}
                    </Text>
                    <Text style={styles.resultMeta} numberOfLines={1}>
                      {p.city} • {p.religion}
                    </Text>
                    <Text style={styles.resultEducation} numberOfLines={1}>
                      {p.educationLevel}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noResultsFull}>
                <Users size={32} color="#777777" style={{ marginBottom: 8 }} />
                <Text style={styles.noResultsFullText}>No matching profiles found</Text>
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
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingBottom: 40,
  },

  /* Search Input & Filter Row */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 10,
    gap: 12,
  },
  searchBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },
  filterIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  /* Filter Bar */
  filterBarContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C9748A',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  radiusPillsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  radiusPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F5E2E5',
    alignItems: 'center',
  },
  radiusPillActive: {
    backgroundColor: '#C9748A',
    borderColor: '#C9748A',
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  radiusPillText: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '600',
  },
  radiusPillTextActive: {
    color: '#FFF',
  },

  /* Featured Carousel */
  carouselSection: {
    marginTop: 6,
    marginBottom: 20,
  },
  carouselScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  cardItem: {
    width: 130,
    height: 175,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#EEE',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  newBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#333333',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 2,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '65%',
  },
  cardInfo: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  distanceText: {
    fontSize: 9,
    color: '#FFF',
    fontWeight: '600',
  },
  noResultsCard: {
    width: width - 40,
    paddingVertical: 30,
    backgroundColor: '#FFF',
    borderRadius: 16,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#777777',
    fontSize: 14,
  },

  /* Interest Section */
  interestSection: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C9748A',
  },
  interestsScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  interestChipActive: {
    backgroundColor: '#C9748A',
    borderColor: '#C9748A',
  },
  interestChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },
  interestChipTextActive: {
    color: '#FFF',
  },

  /* Around Me Map Section */
  aroundMeSection: {
    paddingHorizontal: 20,
  },
  aroundMeSub: {
    fontSize: 12,
    color: '#777777',
    marginTop: 2,
    marginBottom: 14,
  },
  mapCard: {
    width: '100%',
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#E5E3DF',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  mapBackgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.65,
  },
  mapOverlayTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 252, 245, 0.4)',
  },
  mapRoadLine1: {
    position: 'absolute',
    top: -20,
    left: '40%',
    width: 14,
    height: 320,
    backgroundColor: 'rgba(255,255,255,0.7)',
    transform: [{ rotate: '35deg' }],
  },
  mapRoadLine2: {
    position: 'absolute',
    top: '50%',
    left: -20,
    width: 400,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.7)',
    transform: [{ rotate: '-15deg' }],
  },

  /* Map Markers */
  mapMarkerContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  calloutBubble: {
    backgroundColor: '#333333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  calloutText: {
    color: '#FFF',
    fontSize: 11,
  },
  calloutArrow: {
    position: 'absolute',
    bottom: -5,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#333333',
  },
  markerCircleWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 3,
    borderColor: '#C9748A',
    padding: 2,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    position: 'relative',
  },
  markerCircleActive: {
    borderColor: '#333333',
    transform: [{ scale: 1.15 }],
  },
  markerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  markerBadgePin: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#C9748A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
  },

  /* Landmark Pins */
  landmarkPin: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  landmarkIconWrap: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justify: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  landmarkLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#666',
  },

  /* Advanced Filters Extra Styles */
  filterOptionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F5E2E5',
  },
  filterPillActive: {
    backgroundColor: '#C9748A',
    borderColor: '#C9748A',
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  filterPillText: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#FFF',
  },
  ageInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 12,
  },
  ageInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#F5E2E5',
  },
  ageDivider: {
    fontSize: 13,
    color: '#C9748A',
    fontWeight: '600',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
  },
  clearBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C9748A',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  clearBtnText: {
    color: '#C9748A',
    fontSize: 15,
    fontWeight: 'bold',
  },
  applyBtn: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  applyBtnGradient: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  /* Results Section */
  resultsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  resultsSub: {
    fontSize: 12,
    color: '#777777',
    marginTop: 2,
    marginBottom: 16,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  resultCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 8,
  },
  resultImageWrapper: {
    width: '100%',
    height: 140,
    position: 'relative',
    backgroundColor: '#EEE',
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  resultDistanceBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  resultDistanceText: {
    fontSize: 9,
    color: '#FFF',
    fontWeight: 'bold',
  },
  resultInfo: {
    padding: 10,
  },
  resultName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 2,
  },
  resultMeta: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  resultEducation: {
    fontSize: 10,
    color: '#C9748A',
    fontWeight: '600',
  },
  noResultsFull: {
    width: '100%',
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsFullText: {
    fontSize: 13,
    color: '#777777',
  },
});
