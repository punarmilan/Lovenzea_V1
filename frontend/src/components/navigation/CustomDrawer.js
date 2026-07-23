import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Home, 
  Heart, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  Star
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { Colors, Spacing, Typography } from '../../constants/Theme';
import DrawerItem from './DrawerItem';

const CustomDrawer = (props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleNavigation = (route) => {
    router.push(route);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const isActive = (path) => pathname.includes(path);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF6F5' }}>
      {/* Header Section with Rose Gold Gradient */}
      <LinearGradient
        colors={['#5C1E3A', '#9E546A', '#C9748A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.profileSection}
          onPress={() => handleNavigation('/profile')}
          activeOpacity={0.9}
        >
          <View style={styles.avatarContainer}>
            {user?.profilePhotoUrl ? (
              <Image source={{ uri: user.profilePhotoUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.placeholderAvatar]}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
            )}
            <View style={styles.onlineBadge} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.name || 'User'}
            </Text>
            <View style={styles.premiumTagContainer}>
              <Sparkles size={12} color="#F3A738" style={{ marginRight: 4 }} />
              <Text style={styles.premiumTag}>Premium Member</Text>
            </View>
          </View>
          <ChevronRight size={18} color="#FFF" style={{ opacity: 0.8 }} />
        </TouchableOpacity>
      </LinearGradient>

      {/* Scrollable Content */}
      <DrawerContentScrollView 
        {...props} 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Main Menu</Text>
          <DrawerItem
            label="Discovery"
            icon={Home}
            onPress={() => handleNavigation('/home')}
            active={isActive('/home')}
          />
          <DrawerItem
            label="My Matches"
            icon={Heart}
            onPress={() => handleNavigation('/matches')}
            active={isActive('/matches')}
          />
          <DrawerItem
            label="Messages"
            icon={MessageSquare}
            onPress={() => handleNavigation('/messages')}
            active={isActive('/messages')}
          />
          <DrawerItem
            label="Premium Plans"
            icon={Sparkles}
            onPress={() => handleNavigation('/premium')}
            active={isActive('/premium')}
          />
          <DrawerItem
            label="Special Service"
            icon={Star}
            onPress={() => handleNavigation('/special-services')}
            active={isActive('/special-services')}
          />
          <DrawerItem
            label="My Profile"
            icon={User}
            onPress={() => handleNavigation('/profile')}
            active={isActive('/profile')}
          />
        </View>

        <View style={styles.divider} />

        {/* Support */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account & Support</Text>
          <DrawerItem
            label="Settings"
            icon={Settings}
            onPress={() => {}}
            active={false}
          />
          <DrawerItem
            label="Privacy Policy"
            icon={ShieldCheck}
            onPress={() => {}}
            active={false}
          />
          <DrawerItem
            label="Help & Support"
            icon={HelpCircle}
            onPress={() => {}}
            active={false}
          />
        </View>
      </DrawerContentScrollView>

      {/* Footer Section */}
      <View style={styles.footer}>
        <DrawerItem
          label="Logout"
          icon={LogOut}
          onPress={handleLogout}
          color="#C9748A"
        />
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>LovenZea v1.1</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: Spacing.l,
    paddingHorizontal: Spacing.m,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#9E546A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.s,
  },
  avatarContainer: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    borderColor: '#F3A738', // Gold border for premium style
    backgroundColor: '#FFF',
  },
  placeholderAvatar: {
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#C9748A',
    fontSize: 26,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CD964',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  userInfo: {
    flex: 1,
    marginLeft: Spacing.m,
  },
  userName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFF',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  premiumTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  premiumTag: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  scrollContainer: {
    paddingTop: Spacing.s,
  },
  menuSection: {
    marginTop: Spacing.m,
  },
  sectionTitle: {
    marginLeft: Spacing.m + 8,
    marginBottom: Spacing.s,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '800',
    fontSize: 11,
    color: '#88797D',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3EAE8',
    marginVertical: Spacing.m,
    marginHorizontal: Spacing.m + 8,
  },
  footer: {
    paddingBottom: Spacing.m,
    borderTopWidth: 1,
    borderTopColor: '#F3EAE8',
    backgroundColor: '#FFF6F5',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: Spacing.s,
  },
  versionText: {
    fontSize: 10,
    color: '#D2C4C1',
    fontWeight: '600',
  },
});

export default CustomDrawer;
