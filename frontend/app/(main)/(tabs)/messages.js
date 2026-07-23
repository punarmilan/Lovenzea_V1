import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { Colors, Spacing, Typography, Shadows } from '../../../src/constants/Theme';
import { useRouter } from 'expo-router';
import api from '../../../src/services/api';
import { useAuth } from '../../../src/context/AuthContext';
import Toast from 'react-native-toast-message';

export default function Messages() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/chats');
      setChats(response.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not fetch conversations',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderChatItem = ({ item }) => {
    const otherUser = item.participants.find(p => p._id !== currentUser?._id);
    if (!otherUser) return null;

    return (
      <TouchableOpacity 
        style={styles.chatCard}
        onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item._id, name: otherUser.name, photo: otherUser.profilePhoto || '' } })}
      >
        <Image 
          source={{ uri: otherUser.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name)}&background=E91E63&color=fff` }} 
          style={styles.avatar} 
        />
        <View style={styles.chatInfo}>
          <View style={styles.chatTop}>
            <Text style={styles.name}>{otherUser.name}</Text>
            <Text style={styles.time}>{item.updatedAt ? new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</Text>
          </View>
          <View style={styles.chatBottom}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage?.text || 'Start a conversation'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
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
        keyExtractor={(item) => item._id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchChats(); }} />
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
});
