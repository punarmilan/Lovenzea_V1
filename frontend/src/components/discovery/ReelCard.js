import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, Spacing, Typography, Shadows } from '../../constants/Theme';
import { Heart, MoreVertical, MapPin } from 'lucide-react-native';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

const ReelCard = ({ user, onConnect, onMore, onDetails }) => {
  const getFallbackUri = (item) =>
    item.profilePhoto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=E91E63&color=fff&size=600`;

  const age = user.dob ? new Date().getFullYear() - new Date(user.dob).getFullYear() : 'N/A';

  return (
    <TouchableOpacity 
      activeOpacity={1} 
      onPress={() => onDetails(user)} 
      style={styles.container}
    >
      <Image
        source={{ uri: getFallbackUri(user) }}
        style={styles.image}
        contentFit="cover"
        transition={1000}
      />
      
      {/* Simulated Gradient Overlay at Bottom */}
      <View style={styles.gradientBottom}>
        <View style={[styles.gradientLayer, { opacity: 0.2, height: 160 }]} />
        <View style={[styles.gradientLayer, { opacity: 0.4, height: 120 }]} />
        <View style={[styles.gradientLayer, { opacity: 0.6, height: 80 }]} />
        <View style={[styles.gradientLayer, { opacity: 0.8, height: 40 }]} />
      </View>

      {/* Info Content */}
      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{user.name}, {age}</Text>
          <View style={styles.locationRow}>
            <MapPin size={14} color="rgba(255,255,255,0.9)" />
            <Text style={styles.locationText}>
              {[user.city, user.state].filter(Boolean).join(', ')}
            </Text>
          </View>
          <Text style={styles.professionText}>
            {user.occupation || 'Professional Member'}
          </Text>
          <Text style={styles.religionText}>
            {[user.religion, user.caste].filter(Boolean).join(' • ')}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.connectBtn, Shadows.medium]} 
            onPress={() => onConnect(user)}
          >
            <Heart size={22} color={Colors.white} fill={Colors.white} />
            <Text style={styles.connectText}>Connect Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Top Controls Overlay */}
      <View style={styles.topControls}>
        <TouchableOpacity style={styles.moreBtn} onPress={() => onMore(user)}>
          <MoreVertical size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height, // Full screen height
    backgroundColor: Colors.black,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'stretch',
    pointerEvents: 'none',
  },
  gradientLayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.black,
  },
  content: {
    position: 'absolute',
    bottom: 90, // Above bottom tab bar
    left: 0,
    right: 0,
    padding: Spacing.l,
    paddingBottom: Spacing.xl,
  },
  infoContainer: {
    marginBottom: Spacing.l,
  },
  name: {
    ...Typography.h1,
    color: Colors.white,
    fontSize: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
  locationText: {
    ...Typography.body,
    color: Colors.white,
    marginLeft: 4,
    fontSize: 16,
  },
  professionText: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
    fontWeight: '600',
  },
  religionText: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.m,
    borderRadius: 30,
    alignItems: 'center',
  },
  connectText: {
    color: Colors.white,
    fontWeight: 'bold',
    marginLeft: Spacing.s,
    fontSize: 18,
  },
  topControls: {
    position: 'absolute',
    top: 60, // Safe area
    right: Spacing.m,
    zIndex: 100,
  },
  moreBtn: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 25,
  },
});

export default React.memo(ReelCard);

