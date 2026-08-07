import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { Colors, Spacing, Typography, Shadows } from '../../../src/constants/Theme';
import { useRouter } from 'expo-router';
import api from '../../../src/services/api';
import { useAuth } from '../../../src/context/AuthContext';
import Toast from 'react-native-toast-message';
import { normalizePhotoUrl, getFallbackAvatar } from '../../../src/utils/imageUrl';

export default function Messages() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchChats(), fetchMatches()]);
    setLoading(false);
  };

  const fetchChats = async () => {
    try {
      const response = await api.get('/chat/conversations');
      setChats(response.data || []);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not fetch conversations',
      });
    }
  };

  const fetchMatches = async () => {
    try {
      const [sentRes, receivedRes] = await Promise.all([
        api.get('/connections/sent?status=ACCEPTED'),
        api.get('/connections/received?status=ACCEPTED')
      ]);
      
      const list = [];
      const seenIds = new Set();
      
      (sentRes.data || []).forEach(item => {
        const profile = item.receiverProfile || {};
        const actualUserId =
          item.receiverId ||
          profile.userId ||
          profile.id;

        if (actualUserId && !seenIds.has(actualUserId)) {
          seenIds.add(actualUserId);
          list.push({
            id: actualUserId,
            name: profile.fullName || 'User',
            photo:
              profile.profilePhotoUrl ||
              profile.profilePhoto ||
              '',
            conversationId: item.conversationId || '',
          });
        }
      });
      
      (receivedRes.data || []).forEach(item => {
        const profile = item.senderProfile || {};
        const actualUserId =
          item.senderId ||
          profile.userId ||
          profile.id;

        if (actualUserId && !seenIds.has(actualUserId)) {
          seenIds.add(actualUserId);
          list.push({
            id: actualUserId,
            name: profile.fullName || 'User',
            photo:
              profile.profilePhotoUrl ||
              profile.profilePhoto ||
              '',
            conversationId: item.conversationId || '',
          });
        }
      });
      
      setMatches(list);
    } catch (error) {
      console.error('Failed to fetch accepted matches:', error);
    }
  };

  const openConversation = (item) => {
    const targetUserId =
      item?.otherUserId ||
      item?.userId ||
      item?.receiverId ||
      item?.senderId;

    const conversationId =
      item?.conversationId ||
      item?.id ||
      '';

    if (!targetUserId) {
      console.error('Cannot open chat. Missing target user ID:', item);
      Toast.show({
        type: 'error',
        text1: 'Unable to open chat',
        text2: 'User information is missing',
      });
      return;
    }

    const photo =
      item?.otherProfilePhotoUrl ||
      item?.otherProfilePhoto ||
      item?.profilePhotoUrl ||
      item?.profilePhoto ||
      '';

    const normalizedUrl = normalizePhotoUrl(photo) || '';
    const otherUserName = item?.otherUserName || item?.name || 'User';

    console.log('Opening chat:', {
      targetUserId,
      conversationId,
      name: otherUserName,
      route: '/chat/[id]',
    });

    router.push({
      pathname: '/chat/[id]',
      params: {
        id: String(targetUserId),
        conversationId: String(conversationId),
        name: otherUserName,
        photo: normalizedUrl,
      },
    });
  };

  const openMatchChat = (match) => {
    if (!match?.id) {
      console.error('Cannot open match chat. Missing user ID:', match);
      Toast.show({
        type: 'error',
        text1: 'Unable to open chat',
        text2: 'Match information is missing',
      });
      return;
    }

    const targetUserId = match.id;
    const conversationId = match.conversationId || '';
    const otherUserName = match.name || 'User';

    console.log('Opening chat:', {
      targetUserId,
      conversationId,
      name: otherUserName,
      route: '/chat/[id]',
    });

    router.push({
      pathname: '/chat/[id]',
      params: {
        id: String(targetUserId),
        conversationId: String(conversationId),
        name: otherUserName,
        photo: normalizePhotoUrl(match.photo) || '',
      },
    });
  };

  const renderChatItem = ({ item }) => {
    const photo = item.otherProfilePhotoUrl || item.otherProfilePhoto || item.profilePhoto;
    const normalizedUrl = normalizePhotoUrl(photo);
    const timeStr = item.lastActive ? new Date(item.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent';

    return (
      <TouchableOpacity 
        style={styles.chatCard}
        onPress={() => openConversation(item)}
      >
        <Image 
          source={{ uri: getFallbackAvatar({ name: item.otherUserName, profilePhoto: photo }) }} 
          style={styles.avatar} 
          onError={(e) => console.log('Image failed:', getFallbackAvatar({ name: item.otherUserName, profilePhoto: photo }), e.nativeEvent)}
        />
        <View style={styles.chatInfo}>
          <View style={styles.chatTop}>
            <Text style={styles.name}>{item.otherUserName}</Text>
            <Text style={styles.time}>{timeStr}</Text>
          </View>
          <View style={styles.chatBottom}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage || 'Start a conversation'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchChats(), fetchMatches()]);
    setRefreshing(false);
  };

  const renderHeader = () => {
    if (matches.length === 0) return null;
    return (
      <View style={styles.matchesSection}>
        <Text style={styles.sectionTitle}>New Matches</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.matchesScroll}>
          {matches.map(match => {
            const normalizedUrl = normalizePhotoUrl(match.photo);
            return (
              <TouchableOpacity
                key={match.id}
                style={styles.matchItem}
                onPress={() => openMatchChat(match)}
              >
                <Image
                  source={{ uri: getFallbackAvatar({ name: match.name, profilePhoto: match.photo }) }}
                  style={styles.matchAvatar}
                  onError={(e) => console.log('Image failed:', getFallbackAvatar({ name: match.name, profilePhoto: match.photo }), e.nativeEvent)}
                />
                <Text style={styles.matchName} numberOfLines={1}>
                  {match.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={styles.headerDivider} />
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item, index) =>
          String(
            item?.conversationId ||
            item?.id ||
            item?.otherUserId ||
            `conversation-${index}`
          )
        }
        renderItem={renderChatItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet. Start a conversation!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContent: {
    paddingTop: Spacing.s,
  },
  chatCard: {
    flexDirection: 'row',
    padding: Spacing.m,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.surface,
  },
  chatInfo: {
    flex: 1,
    marginLeft: Spacing.m,
  },
  chatTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    ...Typography.body,
    fontWeight: '700',
  },
  time: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  chatBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
  },
  unreadMessage: {
    color: Colors.text,
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.s,
  },
  unreadText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  matchesSection: {
    paddingVertical: Spacing.s,
    backgroundColor: Colors.white,
  },
  sectionTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.text,
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.s,
  },
  matchesScroll: {
    paddingHorizontal: Spacing.s,
    paddingBottom: Spacing.s,
  },
  matchItem: {
    alignItems: 'center',
    width: 75,
    marginHorizontal: Spacing.xs,
  },
  matchAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.surface,
    marginBottom: 4,
  },
  matchName: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  headerDivider: {
    height: 1,
    backgroundColor: Colors.surface,
    marginTop: Spacing.s,
    marginHorizontal: Spacing.m,
  },
});
