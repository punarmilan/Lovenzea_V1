import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, Mail, Lock, Eye, EyeOff, ShieldCheck, HeartHandshake, Users, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

import { useAuth } from '../../src/context/AuthContext';
import Toast from 'react-native-toast-message';

// Asset references (Fallback to a solid premium color if images are missing, but assuming these exist or will be replaced)
// Use generic images if specific ones don't exist yet. The prompt specifies adding these elements.
const bgImage = require('../../assets/images/login.png'); // Using login.png as premium background
const logoImage = require('../../assets/images/project_logo_transperent.png');
// We will use a generic couple image if we had one, but we'll simulate the top section blending naturally.

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill in all fields' });
      return;
    }
    try {
      setLoading(true);
      await login(identifier, password);
      Toast.show({ type: 'success', text1: 'Welcome back!', text2: 'Logged in successfully' });
      router.replace('/(main)/(tabs)/home');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.response?.data?.message || 'Invalid credentials',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={bgImage} style={styles.bgImage} imageStyle={{ opacity: 0.15 }}>
        {/* Soft Background Gradient Override */}
        <LinearGradient
          colors={['rgba(255, 248, 246, 0.4)', '#FFF6F5', '#FFF6F5']}
          style={StyleSheet.absoluteFillObject}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
            
            {/* ─── Top Section (Logo & Headline) ─── */}
            <SafeAreaView edges={['top']} />
            <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.topSection}>
              <View style={styles.logoContainer}>
                <Image source={logoImage} style={styles.logo} resizeMode="contain" />
                <Text style={styles.logoText}>LovenZea</Text>
              </View>
              <View style={styles.taglineContainer}>
                <View style={styles.taglineLine} />
                <Text style={styles.tagline}>Find Your Perfect Match</Text>
                <View style={styles.taglineLine} />
              </View>

              <Text style={styles.headline}>A New Beginning{'\n'}for a <Text style={styles.headlineItalic}>Lifetime...</Text></Text>
              <View style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>India's Trusted Matrimonial Platform </Text>
                <HeartHandshake size={16} color="#C9748A" />
              </View>
            </Animated.View>

            {/* ─── Glassmorphism Login Card ─── */}
            <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.loginCard}>
              
              {/* Tabs */}
              <View style={styles.tabsContainer}>
                <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('login')}>
                  <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Member Login</Text>
                  {activeTab === 'login' && (
                    <LinearGradient colors={['#C9748A', '#C9748A']} style={styles.activeTabIndicator} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={() => router.push('/register')}>
                  <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>Create Account</Text>
                </TouchableOpacity>
              </View>

              {/* Input: Mobile/Email */}
              <View style={styles.inputContainer}>
                <Phone size={20} color="#F5E6E8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mobile Number / Email"
                  placeholderTextColor="#88797D"
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                />
              </View>

              {/* Input: Password */}
              <View style={styles.inputContainer}>
                <Lock size={20} color="#F5E6E8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#88797D"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  {showPassword ? <Eye size={20} color="#88797D" /> : <EyeOff size={20} color="#88797D" />}
                </TouchableOpacity>
              </View>

              {/* Remember Me & Forgot Password */}
              <View style={styles.optionsRow}>
                <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
                  <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                    {rememberMe && <CheckCircle2 size={12} color="#FFF" />}
                  </View>
                  <Text style={styles.checkboxText}>Remember me</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity onPress={handleLogin} activeOpacity={0.8} style={styles.loginBtnWrapper} disabled={loading}>
                <LinearGradient
                  colors={['#C9748A', '#C9748A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginBtnGradient}
                >
                  <Text style={styles.loginBtnText}>{loading ? 'Logging In...' : 'Log In'}</Text>
                  {!loading && (
                    <View style={styles.loginBtnIcon}>
                      <ArrowRight size={18} color="#C9748A" />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* OR Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login */}
              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialBtn}>
                  <Text style={styles.socialBtnText}>Google</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* ─── Trust Badges ─── */}
            <Animated.View entering={FadeInUp.duration(600).delay(400)} style={styles.trustSection}>
              <View style={styles.trustBadge}>
                <ShieldCheck size={24} color="#C9748A" />
                <Text style={styles.trustText}>100%</Text>
                <Text style={styles.trustSubtext}>Verified Profiles</Text>
              </View>
              <View style={styles.trustDivider} />
              <View style={styles.trustBadge}>
                <HeartHandshake size={24} color="#C9748A" />
                <Text style={styles.trustText}>Safe & Secure</Text>
                <Text style={styles.trustSubtext}>Platform</Text>
              </View>
              <View style={styles.trustDivider} />
              <View style={styles.trustBadge}>
                <Users size={24} color="#C9748A" />
                <Text style={styles.trustText}>Lakhs of</Text>
                <Text style={styles.trustSubtext}>Happy Matches</Text>
              </View>
            </Animated.View>

            {/* ─── Bottom Quote ─── */}
            <Animated.View entering={FadeInUp.duration(600).delay(500)} style={styles.bottomQuoteContainer}>
              <HeartHandshake size={16} color="#C9748A" style={{ marginBottom: 5 }} />
              <Text style={styles.bottomQuote}>Because Every Match{'\n'}Deserves a Happy Story</Text>
              <View style={styles.quoteUnderline} />
            </Animated.View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

// Quick fallback icon for the checkbox if not imported above
const CheckCircle2 = ({ size, color }) => (
  <View style={{ width: size, height: size, borderRadius: size/2, backgroundColor: color }} />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6F5',
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: Platform.OS === 'ios' ? 20 : 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 45,
    height: 45,
    tintColor: '#C9748A',
  },
  logoText: {
    fontSize: 32,
    color: '#3C2430',
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'serif',
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  taglineLine: {
    height: 1,
    backgroundColor: '#F5E6E8',
    width: 30,
    marginHorizontal: 10,
  },
  tagline: {
    fontSize: 12,
    color: '#88797D',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headline: {
    fontSize: 36,
    color: '#3C2430',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 42,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  headlineItalic: {
    color: '#C9748A',
    fontStyle: 'italic',
    fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'cursive',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#88797D',
  },
  loginCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#88797D',
  },
  activeTabText: {
    color: '#3C2430',
    fontWeight: '700',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -1,
    width: '60%',
    height: 3,
    borderRadius: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F8D6CB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#3C2430',
    fontSize: 15,
  },
  eyeIcon: {
    padding: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F5E6E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: '#C9748A',
    borderColor: '#C9748A',
  },
  checkboxText: {
    fontSize: 13,
    color: '#3C2430',
  },
  forgotPasswordText: {
    fontSize: 13,
    color: '#C9748A',
    fontWeight: '600',
  },
  loginBtnWrapper: {
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 25,
  },
  loginBtnGradient: {
    height: 56,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
  },
  loginBtnIcon: {
    backgroundColor: '#FFF',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#88797D',
    fontSize: 12,
    fontWeight: '600',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialBtn: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  socialBtnText: {
    color: '#3C2430',
    fontSize: 14,
    fontWeight: '600',
  },
  trustSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 10,
  },
  trustBadge: {
    alignItems: 'center',
    flex: 1,
  },
  trustText: {
    color: '#3C2430',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  trustSubtext: {
    color: '#88797D',
    fontSize: 10,
    textAlign: 'center',
  },
  trustDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#F5E6E8',
    opacity: 0.3,
  },
  bottomQuoteContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  bottomQuote: {
    fontSize: 14,
    color: '#88797D',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  quoteUnderline: {
    width: 40,
    height: 1,
    backgroundColor: '#C9748A',
    marginTop: 10,
    opacity: 0.5,
  }
});
