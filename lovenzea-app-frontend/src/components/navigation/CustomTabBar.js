import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Platform, Text } from 'react-native';
import { Home, Heart, MessageSquare, User, Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width - 40;

export default function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const bottomPosition = insets.bottom;

  const visibleRoutes = state.routes.filter(route => {
    const { options } = descriptors[route.key];
    return options.href !== null;
  });

  const orderedRoutes = [];
  const homeRoute = visibleRoutes.find(r => r.name === 'home');
  const messagesRoute = visibleRoutes.find(r => r.name === 'messages');
  const matchesRoute = visibleRoutes.find(r => r.name === 'matches');
  const searchRoute = visibleRoutes.find(r => r.name === 'search');
  const profileRoute = visibleRoutes.find(r => r.name === 'profile');

  if (homeRoute && messagesRoute && matchesRoute && searchRoute && profileRoute) {
    orderedRoutes.push(homeRoute, messagesRoute, matchesRoute, searchRoute, profileRoute);
  } else {
    orderedRoutes.push(...visibleRoutes);
  }

  const getIcon = (routeName, isFocused) => {
    const color = isFocused ? '#FFF' : '#F5DEE4';
    const size = 20;
    switch (routeName) {
      case 'home': return <Home size={size} color={color} strokeWidth={2} />;
      case 'messages': return <MessageSquare size={size} color={color} strokeWidth={2} />;
      case 'matches': return <Heart size={24} color="#FFF" fill="#FFF" strokeWidth={2} />;
      case 'search': return <Search size={size} color={color} strokeWidth={2} />;
      case 'profile': return <User size={size} color={color} strokeWidth={2} />;
      default: return null;
    }
  };

  const getLabel = (routeName) => {
    switch (routeName) {
      case 'home': return 'Home';
      case 'messages': return 'Chat';
      case 'matches': return 'Matches';
      case 'search': return 'Search';
      case 'profile': return 'Profile';
      default: return '';
    }
  };

  return (
    <>
      <View style={[styles.wrapper, { bottom: bottomPosition }]}>
        <LinearGradient
          colors={['#5C1E3A', '#9E546A', '#5C1E3A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          {orderedRoutes.map((route, index) => {
            const isFocused = state.index === state.routes.findIndex(r => r.key === route.key);
            const isCenter = route.name === 'matches';

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate({ name: route.name, merge: true });
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={onPress}
                style={[styles.tabItem, isCenter && styles.centerTabItem]}
                activeOpacity={0.8}
              >
                {isCenter ? (
                  <View style={styles.centerContent}>
                    <LinearGradient
                      colors={['#C9748A', '#E8A4B0']}
                      style={[styles.fab, isFocused && styles.fabFocused]}
                    >
                      {getIcon(route.name, isFocused)}
                    </LinearGradient>
                    <Text style={[styles.label, styles.centerLabel, { color: isFocused ? '#FFF' : '#F5DEE4' }]}>
                      {getLabel(route.name)}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.normalContent}>
                    <View style={[styles.iconWrapper, isFocused && styles.activeIconWrapper]}>
                      {getIcon(route.name, isFocused)}
                    </View>
                    <Text style={[styles.label, { color: isFocused ? '#FFF' : '#F5DEE4' }]}>
                      {getLabel(route.name)}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </LinearGradient>
      </View>
      {insets.bottom > 0 && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: insets.bottom, backgroundColor: '#2A1020' }} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignSelf: 'center',
    width: TAB_BAR_WIDTH,
    zIndex: 10,
  },
  container: {
    flexDirection: 'row',
    borderRadius: 32,
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    shadowColor: '#9E546A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(201, 116, 138, 0.3)',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  centerTabItem: {
    top: -18,
    height: 64,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  normalContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  centerLabel: {
    marginTop: 4,
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconWrapper: {
    backgroundColor: '#C9748A',
    borderRadius: 17,
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  fab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C9748A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'rgba(255, 230, 235, 0.9)',
  },
  fabFocused: {
    transform: [{ scale: 1.05 }],
  },
});
