import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { normalizePhotoUrl, getFallbackAvatar } from '../../utils/imageUrl';
import { Colors, Spacing, Typography, Shadows } from '../../constants/Theme';
import { CheckCircle, Wifi, Info } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height * 0.78;

const ProfileCard = ({ user, onConnect, onDetails }) => {
  const getFallbackUri = (item) => getFallbackAvatar(item);

  const age = user.dob
    ? new Date().getFullYear() - new Date(user.dob).getFullYear()
    : null;

  const detailParts = [
    user.height ? `${user.height}` : null,
    [user.religion, user.caste].filter(Boolean).join(' '),
    user.occupation || null,
  ].filter(Boolean);

  return (
    <View style={styles.cardWrapper}>
      <View style={[styles.card, Shadows.medium]}>
        {/* Profile Image */}
        <TouchableOpacity
          activeOpacity={0.97}
          onPress={() => onDetails(user)}
          style={styles.imageContainer}
        >
          <Image
            source={{ uri: getFallbackUri(user) }}
            style={styles.image}
            contentFit="cover"
            transition={600}
            onError={(e) => console.log('[ProfileCard] Image failed:', getFallbackUri(user), e)}
          />

          {/* Info button top right */}
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.infoBtn} onPress={() => onDetails(user)}>
              <Info size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Match Score Badge (if present) */}
          {!!user.matchScore && (
            <View style={styles.matchBadge}>
              <Text style={styles.matchText}>{user.matchScore}% Match</Text>
            </View>
          )}

          {/* Info Overlay at bottom of image */}
          <View style={styles.imageOverlay}>
            <Text style={styles.nameText}>
              {user.name || 'User'}{!!age ? `, ${age}` : ''}
            </Text>

            {detailParts.length > 0 && (
              <Text style={styles.detailsText} numberOfLines={1}>
                {detailParts.join('  •  ')}
              </Text>
            )}

            {!!(user.city || user.state) && (
              <Text style={styles.locationText}>
                {[user.city, user.state].filter(Boolean).join(', ')}
              </Text>
            )}

            {/* Status Row */}
            <View style={styles.statusRow}>
              <View style={styles.statusChip}>
                <Wifi size={11} color={Colors.success} />
                <Text style={styles.statusChipText}>Online</Text>
              </View>
              {!!user.matchScore && (
                <View style={[styles.statusChip, { backgroundColor: 'rgba(124,77,255,0.18)' }]}>
                  <Text style={[styles.statusChipText, { color: '#C9748A' }]}>You & Her</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* Connection Footer Bar */}
        <View style={styles.footer}>
          <Text style={styles.footerPrompt}>
            Like this Profile?{' '}
            <Text style={styles.footerConnectText}>Connect Now</Text>
          </Text>
          <TouchableOpacity
            style={styles.connectCircle}
            onPress={() => onConnect(user)}
            activeOpacity={0.85}
          >
            <CheckCircle size={28} color={Colors.white} fill={Colors.success} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width,
    height: CARD_HEIGHT,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topActions: {
    position: 'absolute',
    top: Spacing.m,
    right: Spacing.m,
    flexDirection: 'row',
    gap: 8,
  },
  infoBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchBadge: {
    position: 'absolute',
    top: Spacing.m,
    left: Spacing.m,
    backgroundColor: 'rgba(233,30,99,0.88)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.m,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.m,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  detailsText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.92)',
    marginTop: 3,
  },
  locationText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 1,
  },
  statusRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76,175,80,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  statusChipText: {
    color: Colors.success,
    fontSize: 11,
    fontWeight: '600',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerPrompt: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  footerConnectText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  connectCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
  },
});

export default React.memo(ProfileCard);
