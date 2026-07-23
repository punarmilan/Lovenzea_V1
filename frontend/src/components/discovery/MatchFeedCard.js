import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, Shadows } from '../../constants/Theme';
import { Heart, MessageSquare, Send, MoreHorizontal, UserPlus, CheckCircle2, X } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function MatchFeedCard({ user, onShortlist, onSendInterest, onChat, onViewProfile, onMenuOptions, onDismiss, onPress }) {
  const [isShortlisted, setIsShortlisted] = useState(user.isShortlisted || false);
  const [interestSent, setInterestSent] = useState(user.interestSent || false);

  const handleShortlist = () => {
    setIsShortlisted(!isShortlisted);
    onShortlist && onShortlist(user, !isShortlisted);
  };

  const handleInterest = () => {
    setInterestSent(true);
    onSendInterest && onSendInterest(user);
  };

  const age = user.age || (user.dob ? new Date().getFullYear() - new Date(user.dob).getFullYear() : '26');
  const height = user.height || "5'4\"";
  const profession = user.occupation || 'Software Engineer';
  const location = user.city ? `${user.city}, ${user.state || 'India'}` : 'Pune, Maharashtra';
  const religion = user.religion ? `${user.religion} • ${user.caste || ''}` : 'Hindu • Brahmin';
  
  const images = [];
  [
    user.profilePhotoUrl,
    user.photoUrl2,
    user.photoUrl3,
    user.photoUrl4,
    user.photoUrl5,
    user.photoUrl6
  ].filter(Boolean).forEach(url => {
    if (!images.some(img => img.uri === url)) {
      images.push({ uri: url });
    }
  });

  if (user.photos && user.photos.length > 0) {
    user.photos.forEach(photo => {
      const uri = typeof photo === 'string' ? photo : photo.uri;
      if (uri && !images.some(img => img.uri === uri)) {
        images.push({ uri });
      }
    });
  }

  const isMale = user.gender && user.gender.toLowerCase() === 'male';
  const defaultPlaceholder = isMale ? require('../../../assets/images/no_photo_male.png') : require('../../../assets/images/no_photo.png');

  const hasPhoto = images.length > 0;
  const mainImage = hasPhoto ? images[0] : defaultPlaceholder;
  const avatarImage = hasPhoto ? images[0] : { uri: `https://ui-avatars.com/api/?background=E91E63&color=fff&name=${encodeURIComponent(user.fullName || 'User')}` };
  
  const smallImages = images.length > 1 ? images.slice(1, 4) : [];
  
  const displaySmall = [];
  for (let i = 0; i < 3; i++) {
    if (smallImages[i]) {
      displaySmall.push({ source: smallImages[i], hasPhoto: true });
    } else {
      displaySmall.push({ source: defaultPlaceholder, hasPhoto: false });
    }
  }

  return (
    <View style={[styles.card, Shadows.medium]}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => onPress && onPress(user)}>
        {/* ─── Profile Header ─── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={avatarImage} style={styles.avatar} contentFit="cover" />
            <View style={styles.headerText}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{user.fullName ? user.fullName.split(' ')[0] : 'User'}</Text>
                {(user.isPremium || true) && (
                  <View style={styles.premiumBadge}>
                    <Text style={styles.premiumText}>PREMIUM</Text>
                  </View>
                )}
                {user.isVerified && <CheckCircle2 size={14} color={Colors.primary} style={{ marginLeft: 4 }} />}
              </View>
              <Text style={styles.activeStatus}>Active {Math.floor(Math.random() * 50) + 1} min ago</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={(e) => { e.stopPropagation(); onMenuOptions(user); }} style={styles.iconBtn}>
              <MoreHorizontal size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={(e) => { e.stopPropagation(); onDismiss(user); }} style={styles.iconBtn}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

      {/* ─── Profile Summary ─── */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>{age} yrs • {height}</Text>
        <Text style={styles.summaryText}>{profession}</Text>
        <Text style={styles.summaryText}>{location}</Text>
        <Text style={styles.summaryText}>{religion}</Text>
      </View>

      {/* ─── About Me ─── */}
      <View style={styles.introContainer}>
        <Text style={styles.introText} numberOfLines={2}>
          {user.aboutMe || "Family-oriented, ambitious, and enjoys travelling, music, and meaningful conversations."}
        </Text>
        <TouchableOpacity>
          <Text style={styles.readMore}>Read More</Text>
        </TouchableOpacity>
      </View>

      {/* ─── Photo Gallery ─── */}
      <View style={styles.galleryContainer}>
        <View style={styles.mainImageContainer}>
          <Image source={mainImage} style={styles.mainImage} contentFit="cover" />
          {!hasPhoto && (
            <View style={styles.noPhotoOverlay}>
              <Text style={styles.noPhotoText}>No photo yet</Text>
            </View>
          )}
          <LinearGradient colors={['rgba(76, 175, 80, 0.9)', 'rgba(46, 125, 50, 0.9)']} style={styles.matchBadge}>
            <Text style={styles.matchBadgeText}>{user.matchScore || 92}% Match</Text>
          </LinearGradient>
        </View>
        <View style={styles.smallImagesContainer}>
          {displaySmall.map((item, idx) => (
            <View key={idx} style={[styles.smallImageWrapper, idx !== 0 && { marginTop: 8 }]}>
              <Image source={item.source} style={styles.smallImage} contentFit="cover" />
              {!item.hasPhoto && (
                <View style={styles.smallNoPhotoOverlay}>
                  <Text style={styles.smallNoPhotoText} numberOfLines={2} adjustsFontSizeToFit>No photo</Text>
                </View>
              )}
              {item.hasPhoto && idx === 2 && images.length > 4 && (
                <View style={styles.overlay}>
                  <Text style={styles.overlayText}>+{images.length - 4}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
      </TouchableOpacity>

      {/* ─── Bottom Actions ─── */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleShortlist}>
          <Heart size={24} color={isShortlisted ? '#9e4784ff' : Colors.textSecondary} fill={isShortlisted ? '#e293d1ff' : 'transparent'} />
          <Text style={[styles.actionLabel, isShortlisted && { color: '#9e4784ff' }]}>Shortlist</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.interestBtnContainer} onPress={handleInterest}>
          <LinearGradient 
            colors={interestSent ? ['#4CAF50', '#388E3C'] : ['#7C4DFF', '#5E35B1']} 
            style={styles.interestBtn}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            {interestSent ? <CheckCircle2 size={16} color="#FFF" /> : <UserPlus size={16} color="#FFF" />}
            <Text style={styles.interestBtnText}>{interestSent ? 'Interest Sent' : 'Send Interest'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => onChat(user)}>
          <Send size={22} color={Colors.textSecondary} />
          <Text style={styles.actionLabel}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1D7E1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  headerText: {
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 18,
    color: '#212121',
    fontWeight: '700',
  },
  premiumBadge: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#FFE4E1',
  },
  premiumText: {
    fontSize: 9,
    fontFamily: 'Inter-SemiBold',
    color: '#C9748A',
    fontWeight: '600',
  },
  activeStatus: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#757575',
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconBtn: {
    padding: 4,
    marginLeft: 8,
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  summaryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#212121',
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  introContainer: {
    marginBottom: 16,
  },
  introText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
  readMore: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#C9748A',
    marginTop: 4,
  },
  galleryContainer: {
    flexDirection: 'row',
    height: 280,
    marginBottom: 16,
  },
  mainImageContainer: {
    flex: 2.2,
    marginRight: 8,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  noPhotoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 248, 246, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  noPhotoText: {
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 18,
    color: '#C9748A',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 40,
  },
  smallNoPhotoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 248, 245, 0.1)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 6,
  },
  smallNoPhotoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 8,
    color: '#757575',
    textAlign: 'center',
  },
  matchBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchBadgeText: {
    color: '#FFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    fontWeight: '600',
  },
  smallImagesContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  smallImageWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  smallImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    color: '#FFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F5F5F5',
    paddingTop: 16,
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: '#757575',
    marginTop: 4,
  },
  interestBtnContainer: {
    marginHorizontal: 16,
  },
  interestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  interestBtnText: {
    color: '#FFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
});
