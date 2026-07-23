import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography, Shadows } from '../../constants/Theme';
import { Heart, MoreHorizontal, Star, MapPin } from 'lucide-react-native';
import { Image } from 'expo-image';

const MatchCard = ({ user, onConnect, onMore, onPress }) => {
  const getFallbackUri = (item) =>
    item.profilePhoto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=E91E63&color=fff&size=500`;

  const age = user.dob ? new Date().getFullYear() - new Date(user.dob).getFullYear() : 'N/A';

  return (
    <TouchableOpacity 
      style={[styles.card, Shadows.medium]} 
      onPress={() => onPress(user)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: getFallbackUri(user) }}
        style={styles.image}
        contentFit="cover"
        transition={500}
      />
      
      {/* Match Percentage Badge */}
      {user.matchScore && (
        <View style={styles.matchBadge}>
          <Star size={12} color={Colors.white} fill={Colors.white} />
          <Text style={styles.matchText}>{user.matchScore}% Match</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user.name}, {age}</Text>
            <View style={styles.locationRow}>
              <MapPin size={12} color={Colors.textSecondary} />
              <Text style={styles.location}>
                {[user.city, user.state].filter(Boolean).join(', ')}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => onMore(user)} style={styles.moreBtn}>
            <MoreHorizontal size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.profession} numberOfLines={1}>
            {user.occupation || 'Professional Member'}
          </Text>
          <Text style={styles.religion}>
            {[user.religion, user.caste].filter(Boolean).join(' • ')}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <TouchableOpacity 
            style={[styles.connectBtn, Shadows.light]} 
            onPress={() => onConnect(user)}
          >
            <Heart size={18} color={Colors.white} fill={Colors.white} />
            <Text style={styles.connectBtnText}>Connect Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    marginBottom: Spacing.l,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  image: {
    width: '100%',
    height: 280,
  },
  matchBadge: {
    position: 'absolute',
    top: Spacing.m,
    left: Spacing.m,
    backgroundColor: 'rgba(233, 30, 99, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  matchText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  content: {
    padding: Spacing.m,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    ...Typography.h3,
    fontSize: 22,
    color: Colors.text,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  moreBtn: {
    padding: 5,
  },
  detailsContainer: {
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  profession: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: '600',
  },
  religion: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
    fontStyle: 'italic',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.m,
  },
  connectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    width: '80%',
  },
  connectBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default React.memo(MatchCard);

