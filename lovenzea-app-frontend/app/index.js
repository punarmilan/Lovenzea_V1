import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography } from '../src/constants/Theme';
import Button from '../src/components/Button';

// Assets
import splashBackground from '../assets/images/splash_screen.png';
import logoTransparent from '../assets/images/project_logo_transperent.png';

export default function Index() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show the custom splash screen for 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
      router.replace('/login');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <ImageBackground source={splashBackground} style={styles.splashContainer} resizeMode="cover">
        <View style={styles.splashOverlay}>
          <SafeAreaView style={{ width: '100%', flex: 1 }}>
            <View style={{ alignItems: 'flex-end', paddingHorizontal: 20, paddingTop: 10 }}>
              <Image source={logoTransparent} style={styles.topRightLogo} resizeMode="contain" />
            </View>
            <View style={{ marginTop: 10, alignItems: 'center' }}>
              <Text style={styles.splashText}>Welcome to Lovenzea</Text>
              <Text style={styles.splashSubtext}>Find Your Perfect Match</Text>
            </View>
          </SafeAreaView>
        </View>
      </ImageBackground>
    );
  }

  // Return null briefly while router redirects
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  splashContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  splashOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Subtle darkening overlay to make text pop
  },
  topRightLogo: {
    width: 60,
    height: 60,
  },
  splashText: {
    ...Typography.h1,
    color: Colors.white,
    fontSize: 40,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  splashSubtext: {
    ...Typography.body,
    color: Colors.white,
    fontSize: 22,
    marginTop: Spacing.s,
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  content: {
    flex: 1,
    padding: Spacing.l,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: Spacing.xxl * 2,
    alignItems: 'center',
  },
  title: {
    ...Typography.h1,
    fontSize: 40,
    color: Colors.primary,
  },
  subtitle: {
    ...Typography.body,
    marginTop: Spacing.s,
    textAlign: 'center',
    color: Colors.textSecondary,
  },
  footer: {
    marginBottom: Spacing.xl,
  },
  button: {
    marginVertical: Spacing.s,
  },
});
