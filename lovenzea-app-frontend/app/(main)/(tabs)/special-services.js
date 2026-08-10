import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
  ActivityIndicator,
  Modal,
  TextInput,
  StatusBar,
  Animated,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../../src/constants/Theme';
import { 
  ChevronLeft, 
  Crown, 
  Star, 
  ShieldCheck, 
  Heart, 
  Users, 
  BrainCircuit, 
  MessageCircle,
  Diamond,
  CheckCircle2,
  Info,
  Sparkles,
  MoreHorizontal,
  Bell,
  Check,
  CheckCircle,
  HelpCircle,
  Award,
  Shield,
  Smile,
  DollarSign,
  TrendingUp,
  Activity,
  User,
  Home,
  MessageSquare,
} from 'lucide-react-native';
import api from '../../../src/services/api';
import Toast from 'react-native-toast-message';
import RazorpayCheckout from 'react-native-razorpay';
import { useAuth } from '../../../src/context/AuthContext';

const { width, height } = Dimensions.get('window');

// Services List
const SERVICES_DATA = [
  { title: 'Couple Coaching', desc: 'Personalized guidance for a harmonious union.', icon: Users },
  { title: 'Personality Analysis', desc: 'Understand behaviors and traits thoroughly.', icon: BrainCircuit },
  { title: 'Communication Skills', desc: 'Strengthen dialogues and resolve conflicts.', icon: MessageCircle },
  { title: 'Emotional Intelligence', desc: 'Build empathy and mutual understanding.', icon: Heart },
  { title: 'Habit Management', desc: 'Align daily lifestyle patterns gracefully.', icon: Smile },
  { title: 'Family Relationships', desc: 'Foster seamless bonding across families.', icon: Award },
  { title: 'Financial Planning', desc: 'Align wealth and life goals together.', icon: DollarSign },
  { title: 'Goal Setting', desc: 'Draft plans for a unified future journey.', icon: TrendingUp },
  { title: 'Health & Wellness', desc: 'Achieve physical and mental synchrony.', icon: Activity },
];

// Why Choose Us
const WHY_CHOOSE_DATA = [
  { title: '100% Confidentiality', icon: Shield },
  { title: 'Expert Matchmaking', icon: Sparkles },
  { title: 'One-on-One Support', icon: Users },
  { title: 'Pre-Marriage Wellness', icon: Heart },
];

// Expert Panel Categories
const EXPERT_PANEL_CATEGORIES = [
  'Relationship Coach',
  'Family Counselor',
  'Psychologist',
  'Financial Coach',
  'Lifestyle Coach',
  'Marriage Mentor',
];

export default function SpecialServices() {
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [packages, setPackages] = useState([]);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [form, setForm] = useState({ fullName: '', phoneNumber: '', comments: '' });
  
  // States for UX interactions
  const [selectedExpertCat, setSelectedExpertCat] = useState('Relationship Coach');
  const [activeBottomNav, setActiveBottomNav] = useState('Home');

  // Anim values
  const [heroScale] = useState(new Animated.Value(1));

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get('/subscriptions/plans');
      const specialPlans = res.data.filter(p => p.planType === 'SPECIAL_SERVICE');
      setPackages(specialPlans);
    } catch (error) {
      console.error('Failed to fetch special services', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookConsultation = () => {
    // Select first packages if available, or default package
    const defaultPkg = packages.find(p => p.name.toLowerCase().includes('gold')) || packages[0] || { name: 'VIP Coaching Consultation', price: 999 };
    setSelectedPkg(defaultPkg);
    setModalVisible(true);
  };

  const handlePayment = async () => {
    if (!form.fullName || !form.phoneNumber) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please fill in all required fields.' });
      return;
    }
    try {
      setLoadingPayment(selectedPkg.id);
      
      const orderResponse = await api.post('/payments/create-vip-order', {
        amount: selectedPkg.price,
        packageType: selectedPkg.name,
        planId: selectedPkg.id,
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        comments: form.comments
      });
      
      setModalVisible(false);
      
      const { orderId, amount, currency, key } = orderResponse.data;
      
      const options = {
        description: `Payment for ${selectedPkg.name}`,
        image: 'https://cdn-icons-png.flaticon.com/512/3757/3757342.png',
        currency: currency,
        key: key,
        amount: amount * 100,
        name: 'VIP Pre-Marriage Coaching',
        order_id: orderId,
        prefill: {
          email: user?.email || 'user@example.com',
          contact: user?.mobileNumber || '9999999999',
          name: user?.name || 'LovenZea User'
        },
        theme: { color: '#E88A9A' }
      };

      if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
        Alert.alert(
          'SDK Mode / Expo Go Detected',
          'Razorpay Native Checkout is unavailable in Expo Go. Would you like to use simulated success for testing?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => setLoadingPayment(null)
            },
            {
              text: 'Simulate Success',
              onPress: async () => {
                try {
                  await api.post('/payments/verify', {
                    razorpayOrderId: orderId,
                    razorpayPaymentId: 'pay_simulated_' + Math.random().toString(36).substring(7),
                    razorpaySignature: 'sig_simulated_' + Math.random().toString(36).substring(7)
                  });
                  
                  Toast.show({
                    type: 'success',
                    text1: 'Simulated Payment Successful',
                    text2: `You are now enrolled in the ${selectedPkg.name}.`
                  });
                } catch (simError) {
                  console.error('Simulated payment verification failed:', simError);
                  Toast.show({
                    type: 'error',
                    text1: 'Verification Failed',
                    text2: 'Failed to verify simulated payment.'
                  });
                } finally {
                  setLoadingPayment(null);
                }
              }
            }
          ]
        );
        return;
      }

      RazorpayCheckout.open(options).then(async (data) => {
        await api.post('/payments/verify', {
          razorpayOrderId: data.razorpay_order_id,
          razorpayPaymentId: data.razorpay_payment_id,
          razorpaySignature: data.razorpay_signature
        });
        
        Toast.show({
          type: 'success',
          text1: 'Payment Successful',
          text2: `You are now enrolled in the ${selectedPkg.name}.`
        });
      }).catch((error) => {
        console.error("Razorpay Error: ", error);
        Toast.show({
          type: 'error',
          text1: 'Payment Failed',
          text2: error.description || error.message || 'Transaction was cancelled or failed.'
        });
      });
    } catch (err) {
      console.error('Order creation failed:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create payment order.'
      });
    } finally {
      setLoadingPayment(false);
    }
  };

  const getPackageBadge = (name) => {
    if (name.toLowerCase().includes('gold') || name.toLowerCase().includes('premium')) {
      return 'Most Popular';
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E88A9A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {/* Sticky Premium Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
            <Image
              source={require('../../../assets/images/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Bell size={20} color="#5C1E3A" />
            <View style={styles.notiBadge} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={true} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 160 }]}
      >
        {/* ─── Hero Section ─── */}
        <Animated.View style={[styles.heroCard, { transform: [{ scale: heroScale }] }]}>
          <LinearGradient
            colors={['#FFD9C8', '#FFF5F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroLeft}>
              <Text style={styles.heroLabel}>VIP SERVICES</Text>
              <Text style={styles.heroTitle}>VIP Pre-Marriage Coaching</Text>
              <Text style={styles.heroSubTitle}>& Couple Development</Text>
              <Text style={styles.heroDesc}>
                Build a foundation of harmony, trust, and lasting happiness before the big day.
              </Text>
              <TouchableOpacity 
                activeOpacity={0.8}
                style={styles.heroCta}
                onPress={handleBookConsultation}
              >
                <Text style={styles.heroCtaText}>Book Consultation</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.heroRight}>
              <View style={styles.curvedFrameWrapper}>
                <Image
                  source={require('../../../assets/images/indian_couple_vip.png')}
                  style={styles.heroCoupleImage}
                />
                {/* Floating Heart / Star accents */}
                <View style={[styles.floatingAccent, { top: -10, left: 10 }]}>
                  <Heart size={16} color="#E88A9A" fill="#E88A9A" />
                </View>
                <View style={[styles.floatingAccent, { bottom: 15, right: -5 }]}>
                  <Sparkles size={16} color="#C6A664" />
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ─── Mission Card ─── */}
        <View style={styles.missionCard}>
          <LinearGradient
            colors={['#5C1E3A', '#3D1326']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.missionGradient}
          >
            <View style={styles.missionIconWrapper}>
              <Crown size={22} color="#C6A664" />
            </View>
            <View style={styles.missionTextWrapper}>
              <Text style={styles.missionTitle}>Our Mission</Text>
              <Text style={styles.missionDesc}>
                To empower couples with emotional intelligence, financial harmony, and relationship skills to embark on an enduring journey of marriage.
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* ─── Services Section ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Premium Services</Text>
          <Text style={styles.sectionSubTitle}>Curated modules for comprehensive couple readiness</Text>
        </View>

        <View style={styles.servicesGrid}>
          {SERVICES_DATA.map((srv, idx) => {
            const SrvIcon = srv.icon;
            return (
              <TouchableOpacity 
                key={idx} 
                activeOpacity={0.9} 
                style={styles.serviceCard}
              >
                <View style={styles.serviceIconContainer}>
                  <SrvIcon size={20} color="#E88A9A" />
                </View>
                <Text style={styles.serviceCardTitle}>{srv.title}</Text>
                <Text style={styles.serviceCardDesc}>{srv.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ─── Program Packages ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Exclusive Programs</Text>
          <Text style={styles.sectionSubTitle}>Select a membership plan tailored to your timeline</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={width * 0.85 + 16}
          decelerationRate="fast"
          contentContainerStyle={styles.packagesScroll}
        >
          {packages.map((pkg, idx) => {
            const isPopular = getPackageBadge(pkg.name);
            const isGold = pkg.name.toLowerCase().includes('gold') || pkg.name.toLowerCase().includes('platinum');

            return (
              <View 
                key={pkg.id} 
                style={[
                  styles.packageCard,
                  isGold && styles.packageCardGold
                ]}
              >
                {isPopular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>{isPopular}</Text>
                  </View>
                )}

                <Text style={[styles.packageName, isGold && styles.packageNameGold]}>
                  {pkg.name}
                </Text>
                
                <View style={styles.priceRow}>
                  <Text style={[styles.packagePrice, isGold && styles.packagePriceGold]}>
                    ₹{pkg.price}
                  </Text>
                  <Text style={[styles.packageDuration, isGold && styles.packageDurationGold]}>
                    /{pkg.durationMonths} Months
                  </Text>
                </View>

                {/* Features List */}
                <View style={styles.featuresList}>
                  {pkg.features ? pkg.features.split(',').map((feat, fIdx) => (
                    <View key={fIdx} style={styles.featureRow}>
                      <CheckCircle size={14} color={isGold ? '#C6A664' : '#E88A9A'} style={{ marginRight: 8, marginTop: 2 }} />
                      <Text style={[styles.featureText, isGold && styles.featureTextGold]} numberOfLines={2}>
                        {feat.trim()}
                      </Text>
                    </View>
                  )) : (
                    <View style={styles.featureRow}>
                      <CheckCircle size={14} color="#E88A9A" style={{ marginRight: 8 }} />
                      <Text style={styles.featureText}>Premium relationship counseling</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.pkgSelectBtn, isGold && styles.pkgSelectBtnGold]}
                  onPress={() => {
                    setSelectedPkg(pkg);
                    setModalVisible(true);
                  }}
                >
                  <Text style={[styles.pkgSelectBtnText, isGold && styles.pkgSelectBtnTextGold]}>
                    Select Plan
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>

        {/* ─── Why Choose Us ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Why Choose Us</Text>
        </View>

        <View style={styles.whyChooseContainer}>
          {WHY_CHOOSE_DATA.map((item, idx) => {
            const ItemIcon = item.icon;
            return (
              <View key={idx} style={styles.whyChooseCard}>
                <View style={styles.checkCirclePink}>
                  <Check size={14} color="#FFF" />
                </View>
                <Text style={styles.whyChooseText}>{item.title}</Text>
              </View>
            );
          })}
        </View>

        {/* ─── Our Expert Panel ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Expert Panel</Text>
          <Text style={styles.sectionSubTitle}>Learn from certified marriage counselors & advisors</Text>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.expertChipsScroll}
        >
          {EXPERT_PANEL_CATEGORIES.map((cat, idx) => {
            const isSelected = selectedExpertCat === cat;
            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.8}
                onPress={() => setSelectedExpertCat(cat)}
                style={[styles.expertChip, isSelected && styles.expertChipSelected]}
              >
                <Text style={[styles.expertChipText, isSelected && styles.expertChipTextSelected]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </ScrollView>

      {/* ─── Sticky Bottom CTA Button ─── */}
      <View style={[styles.bottomCtaContainer, { paddingBottom: insets.bottom + 65 }]}>
        <TouchableOpacity 
          activeOpacity={0.9} 
          style={styles.stickyBtn}
          onPress={handleBookConsultation}
        >
          <LinearGradient
            colors={['#5C1E3A', '#E88A9A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.stickyGradient}
          >
            <Crown size={16} color="#C6A664" style={{ marginRight: 8 }} />
            <Text style={styles.stickyBtnText}>Join VIP Program</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ─── Floating Bottom Navigation replica ─── */}
      <View style={[styles.floatingBottomNav, { paddingBottom: insets.bottom + 4 }]}>
        {[
          { name: 'Home', icon: Home, route: '/home' },
          { name: 'Matches', icon: Heart, route: '/matches' },
          { name: 'Chats', icon: MessageSquare, route: '/messages' },
          { name: 'Special', icon: Crown, route: '/special-services' },
          { name: 'Profile', icon: User, route: '/profile' }
        ].map((tab, idx) => {
          const isActive = tab.name === 'Special';
          return (
            <TouchableOpacity 
              key={idx} 
              onPress={() => router.push(tab.route)}
              style={styles.navItem}
            >
              {isActive ? (
                <LinearGradient
                  colors={['#E88A9A', '#5C1E3A']}
                  style={styles.activeNavPill}
                >
                  <tab.icon size={18} color="#FFF" />
                  <Text style={styles.activeNavText}>{tab.name}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.inactiveNavWrapper}>
                  <tab.icon size={20} color="#8F7E84" />
                  <Text style={styles.inactiveNavText}>{tab.name}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Booking Form Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>VIP Consultation</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Text style={styles.formInstructions}>
                Please enter your contact details. A VIP relationship counselor will reach out to you within 24 hours.
              </Text>

              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter your full name"
                placeholderTextColor="#777777"
                value={form.fullName}
                onChangeText={(text) => setForm({ ...form, fullName: text })}
              />

              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                placeholderTextColor="#777777"
                value={form.phoneNumber}
                onChangeText={(text) => setForm({ ...form, phoneNumber: text })}
              />

              <Text style={styles.inputLabel}>Comments / Special Requests (Optional)</Text>
              <TextInput
                style={[styles.modalInput, { height: 75, textAlignVertical: 'top', paddingTop: 8 }]}
                placeholder="E.g., Preferred time to call, specific requirements"
                multiline
                placeholderTextColor="#777777"
                value={form.comments}
                onChangeText={(text) => setForm({ ...form, comments: text })}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.modalSubmitBtn}
                onPress={handlePayment}
                disabled={!!loadingPayment}
              >
                {loadingPayment ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.modalSubmitBtnText}>Proceed to Payment</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#F5EAE6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 110,
    height: 35,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  notiBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E88A9A',
  },
  scrollContent: {
    paddingTop: 16,
  },
  heroCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#5C1E3A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
    marginBottom: 20,
  },
  heroGradient: {
    flexDirection: 'row',
    padding: 22,
    alignItems: 'center',
  },
  heroLeft: {
    flex: 1.2,
    paddingRight: 10,
  },
  heroLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E88A9A',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#5C1E3A',
  },
  heroSubTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E88A9A',
    marginBottom: 8,
  },
  heroDesc: {
    fontSize: 11,
    color: '#88797D',
    lineHeight: 16,
    marginBottom: 14,
  },
  heroCta: {
    alignSelf: 'flex-start',
    backgroundColor: '#5C1E3A',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 16,
  },
  heroCtaText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  heroRight: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  curvedFrameWrapper: {
    width: 100,
    height: 130,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFF',
    position: 'relative',
  },
  heroCoupleImage: {
    width: '100%',
    height: '100%',
  },
  floatingAccent: {
    position: 'absolute',
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  missionCard: {
    marginHorizontal: 20,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 26,
  },
  missionGradient: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  missionIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  missionTextWrapper: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#C6A664',
    marginBottom: 4,
  },
  missionDesc: {
    fontSize: 11,
    color: '#FFECED',
    lineHeight: 16,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 14,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#5C1E3A',
  },
  sectionSubTitle: {
    fontSize: 12,
    color: '#8F7E84',
    marginTop: 2,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  serviceCard: {
    width: (width - 48) / 2,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#F9ECE9',
    shadowColor: '#5C1E3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF0F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  serviceCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5C1E3A',
    marginBottom: 4,
  },
  serviceCardDesc: {
    fontSize: 10,
    color: '#8F7E84',
    lineHeight: 14,
  },
  packagesScroll: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 24,
  },
  packageCard: {
    width: width * 0.82,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 22,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#F9ECE9',
    shadowColor: '#5C1E3A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    position: 'relative',
  },
  packageCardGold: {
    backgroundColor: '#5C1E3A',
    borderColor: '#E88A9A',
    shadowOpacity: 0.12,
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#C6A664',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  packageName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#5C1E3A',
    marginBottom: 6,
  },
  packageNameGold: {
    color: '#FFF',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: '800',
    color: '#E88A9A',
  },
  packagePriceGold: {
    color: '#C6A664',
  },
  packageDuration: {
    fontSize: 12,
    color: '#8F7E84',
    marginLeft: 4,
  },
  packageDurationGold: {
    color: '#FFECED',
  },
  featuresList: {
    marginBottom: 20,
    minHeight: 110,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 11,
    color: '#88797D',
    lineHeight: 15,
    flex: 1,
  },
  featureTextGold: {
    color: '#FFF',
  },
  pkgSelectBtn: {
    backgroundColor: '#FFF0F4',
    paddingVertical: 11,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pkgSelectBtnGold: {
    backgroundColor: '#C6A664',
  },
  pkgSelectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E88A9A',
  },
  pkgSelectBtnTextGold: {
    color: '#5C1E3A',
  },
  whyChooseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  whyChooseCard: {
    width: (width - 48) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#777777',
  },
  checkCirclePink: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E88A9A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  whyChooseText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5C1E3A',
    flex: 1,
  },
  expertChipsScroll: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 24,
  },
  expertChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F9ECE9',
    marginRight: 10,
  },
  expertChipSelected: {
    backgroundColor: '#E88A9A',
    borderColor: '#E88A9A',
  },
  expertChipText: {
    fontSize: 12,
    color: '#5C1E3A',
    fontWeight: '600',
  },
  expertChipTextSelected: {
    color: '#FFF',
  },
  bottomCtaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  stickyBtn: {
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: '#5C1E3A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  stickyGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickyBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  floatingBottomNav: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    shadowColor: '#5C1E3A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    zIndex: 20,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeNavPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  activeNavText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  inactiveNavWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveNavText: {
    color: '#8F7E84',
    fontSize: 8,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: height * 0.85,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#777777',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#5C1E3A',
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    fontSize: 18,
    color: '#8F7E84',
    fontWeight: 'bold',
  },
  modalScroll: {
    padding: 24,
  },
  formInstructions: {
    fontSize: 11,
    color: '#8F7E84',
    lineHeight: 16,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5C1E3A',
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F9ECE9',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 13,
    color: '#5C1E3A',
    marginBottom: 16,
  },
  modalSubmitBtn: {
    backgroundColor: '#5C1E3A',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#5C1E3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  modalSubmitBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
