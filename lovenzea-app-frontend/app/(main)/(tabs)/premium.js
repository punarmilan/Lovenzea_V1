import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Colors, Spacing, Typography, Shadows } from '../../../src/constants/Theme';
import { Crown, CheckCircle2, Star, Zap, Diamond, ChevronLeft } from 'lucide-react-native';
import Animated, { 
  FadeInRight, 
  FadeInLeft, 
  Layout, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '../../../src/services/api';
import Toast from 'react-native-toast-message';
import RazorpayCheckout from 'react-native-razorpay';
import { useAuth } from '../../../src/context/AuthContext';

const { width } = Dimensions.get('window');

const PremiumScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/subscriptions/plans');
      const premiumPlans = res.data.filter(p => p.planType === 'PREMIUM');
      setPlans(premiumPlans);
    } catch (error) {
      console.error('Failed to fetch premium plans', error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load plans.' });
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (name) => {
    if (name.toLowerCase().includes('gold')) return Star;
    if (name.toLowerCase().includes('diamond')) return Diamond;
    return Crown;
  };

  const getPlanColor = (name) => {
    if (name.toLowerCase().includes('gold')) return '#C6A664';
    if (name.toLowerCase().includes('diamond')) return '#5E6B70';
    return Colors.primary;
  };

  const handleSubscribe = async (plan) => {
    try {
      setLoadingPayment(plan.id);
      
      const orderResponse = await api.post(`/payments/create-order/${plan.id}`);
      const { orderId, amount, currency, key } = orderResponse.data;
      
      const options = {
        description: `Subscription for ${plan.name}`,
        image: 'https://cdn-icons-png.flaticon.com/512/3757/3757342.png',
        currency: currency,
        key: key,
        amount: amount * 100,
        name: 'LovenZea Premium',
        order_id: orderId,
        prefill: {
          email: user?.email || 'user@example.com',
          contact: user?.mobileNumber || '9999999999',
          name: user?.name || 'LovenZea User'
        },
        theme: { color: getPlanColor(plan.name) }
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
                    text2: `You are now subscribed to ${plan.name}.`
                  });
                  
                  router.back();
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
          text2: `You are now subscribed to ${plan.name}.`
        });
        
        // Go back to home or refresh state
        router.back();
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

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ─── Modern Top Navbar ─── */}
      <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 45) + 10 }]}>
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <TouchableOpacity 
              style={styles.modernIconBtn}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.modernTitle}>Premium Plans</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroSub}>UPGRADE YOUR EXPERIENCE</Text>
          <Text style={styles.heroTitle}>Unlock Premium Features</Text>
          <Text style={styles.heroDesc}>
            Get the most out of your matchmaking journey with our exclusive premium plans. Find your perfect match faster.
          </Text>
        </View>

        {/* Dynamic Plans Section */}
        <View style={styles.plansContainer}>
          {plans.map((plan, index) => {
            const IconComponent = getPlanIcon(plan.name);
            const planColor = getPlanColor(plan.name);
            const featuresList = plan.features ? plan.features.split(',') : [];

            return (
              <Animated.View 
                entering={index % 2 === 0 ? FadeInLeft.delay(index * 100) : FadeInRight.delay(index * 100)}
                layout={Layout.springify()}
                key={plan.id}
                style={[styles.planCard, { borderColor: planColor + '30' }]}
              >
                {plan.highlightTag && (
                  <View style={[styles.highlightBadge, { backgroundColor: planColor }]}>
                    <Text style={styles.highlightText}>{plan.highlightTag}</Text>
                  </View>
                )}
                
                <View style={styles.planHeader}>
                  <View style={[styles.iconWrap, { backgroundColor: planColor + '15' }]}>
                    <IconComponent size={32} color={planColor} />
                  </View>
                  <View style={styles.planTitleWrap}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planDuration}>{plan.durationLabel}</Text>
                  </View>
                </View>

                <View style={styles.pricingSection}>
                  <Text style={styles.priceText}>₹{plan.price.toLocaleString('en-IN')}</Text>
                  {plan.discountPercentage > 0 && (
                    <Text style={styles.discountText}>{plan.discountPercentage}% OFF</Text>
                  )}
                </View>

                <View style={styles.divider} />

                <View style={styles.featuresList}>
                  {featuresList.map((feature, idx) => (
                    <View key={idx} style={styles.featureItem}>
                      <CheckCircle2 size={18} color={planColor} />
                      <Text style={styles.featureText}>{feature.trim()}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity 
                  style={[styles.subscribeBtn, { backgroundColor: planColor, opacity: loadingPayment === plan.id ? 0.7 : 1 }]}
                  onPress={() => handleSubscribe(plan)}
                  disabled={loadingPayment === plan.id}
                >
                  {loadingPayment === plan.id ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <Text style={styles.subscribeBtnText}>Upgrade to {plan.name.split(' ')[0]}</Text>
                  )}
                </TouchableOpacity>

              </Animated.View>
            );
          })}
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8FA',
  },
  headerContainer: {
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
    paddingHorizontal: 16,
  },
  topBarLeft: {
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
    marginLeft: 15,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  heroSub: {
    color: '#C6A664',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#5C3843',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  plansContainer: {
    gap: 20,
  },
  planCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  highlightBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomLeftRadius: 16,
  },
  highlightText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  planTitleWrap: {
    flex: 1,
  },
  planName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D1E23',
    marginBottom: 4,
  },
  planDuration: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  pricingSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  priceText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2D1E23',
  },
  discountText: {
    fontSize: 14,
    color: '#C9748A',
    fontWeight: 'bold',
    marginLeft: 12,
    backgroundColor: '#FDECEF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 20,
  },
  featuresList: {
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 15,
    color: '#5C3843',
    marginLeft: 12,
    flex: 1,
  },
  subscribeBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  subscribeBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default PremiumScreen;
