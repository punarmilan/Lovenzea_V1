import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography, Shadows } from '../../constants/Theme';
import { Heart, MapPin, UserCheck } from 'lucide-react-native';
import { Image } from 'expo-image';

const DailyCard = ({ user, onPress, onConnect }) => {
  const getFallbackUri = (item) =>
    item.profilePhoto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=E91E63&color=fff&size=400`;

  const age = user.dob ? new Date().getFullYear() - new Date(user.dob).getFullYear() : 'N/A';

  return (
    <View style={[styles.card, Shadows.medium]}>
      <TouchableOpacity 
        style={styles.clickableArea} 
        onPress={() => onPress(user)}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: getFallbackUri(user) }}
          style={styles.image}
          contentFit="cover"
          transition={500}
        />
        <View style={styles.verifiedBadge}>
          <UserCheck size={12} color={Colors.white} />
        </View>

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>{user.name}, {age}</Text>
          
          <View style={styles.infoRow}>
            <MapPin size={12} color={Colors.textSecondary} />
            <Text style={styles.infoText} numberOfLines={1}>
              {user.city || 'N/A'}
            </Text>
          </View>
          
          <Text style={styles.subText} numberOfLines={1}>
            {[user.religion, user.caste].filter(Boolean).join(', ')}
          </Text>
          
          <Text style={styles.profession} numberOfLines={1}>
            {user.occupation || 'Member'}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.connectBtn} 
        onPress={() => onConnect && onConnect(user)}
      >
        <Heart size={16} color={Colors.primary} fill={Colors.white} />
        <Text style={styles.connectText}>Connect</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 180,
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginRight: Spacing.m,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  clickableArea: {
    padding: 10,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 15,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    borderRadius: 10,
    padding: 3,
  },
  content: {
    marginTop: 10,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  name: {
    ...Typography.body,
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginLeft: 3,
  },
  subText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
    fontSize: 11,
  },
  profession: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 4,
    fontSize: 10,
  },
  connectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFF9FB',
  },
  connectText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
});

export default React.memo(DailyCard);

