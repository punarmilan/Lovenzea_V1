import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ImageBackground, Modal, Alert, ActionSheetIOS } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Shadows } from '../../src/constants/Theme';
import { Send, ChevronLeft, Check, CheckCheck, MoreVertical, Trash2 } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import 'text-encoding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SOCKJS_URL } from '../../src/services/api';
import api from '../../src/services/api';
import { normalizePhotoUrl, getFallbackAvatar } from '../../src/utils/imageUrl';

export default function ChatRoom() {
  const params = useLocalSearchParams();
  console.log('Chat route params:', params);

  const targetUserId = params.userId || params.id;
  const conversationId = params.conversationId || '';
  const name = params.name || 'User';
  const photo = params.photo || '';

  const getParamValue = (value) => Array.isArray(value) ? value[0] : value;
  const resolvedUserId = getParamValue(targetUserId);
  const resolvedConversationId = getParamValue(conversationId);

  const { user } = useAuth();
  const myId = user?.id || user?._id;
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [premiumErrorMsg, setPremiumErrorMsg] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const stompClient = useRef(null);
  const flatListRef = useRef(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchMessages();
    setupSocket();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  const fetchMessages = async () => {
    try {
      if (!resolvedUserId) return;
      const response = await api.get(`/chat/history/${resolvedUserId}`);
      let msgs = response.data.content || response.data || [];
      // Sort messages descending for inverted FlatList (newest first)
      const sorted = msgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMessages(sorted);
      
      // Mark conversation as read
      await api.patch(`/chat/read/all/${resolvedUserId}`);
    } catch (error) {
      console.error('Fetch messages error:', error);
    }
  };

  const setupSocket = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const client = new Client({
        webSocketFactory: () => new SockJS(SOCKJS_URL),
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onConnect = function (frame) {
        console.log('Connected to STOMP');
        client.subscribe('/user/queue/messages', (message) => {
          if (message.body) {
            const msg = JSON.parse(message.body);
            if (msg.error) {
              console.error('Chat error:', msg.error);
              setPremiumErrorMsg(msg.error);
              setShowPremiumPopup(true);
              // Remove the optimistically added message
              setMessages((prev) => prev.filter(m => !(m.content === msg.content && m.senderId === myId && !m.read && m.tempId)));
              return;
            }
            
            // If the message is part of this conversation
            if (msg.senderId?.toString() === resolvedUserId?.toString() || msg.senderId?.toString() === myId?.toString()) {
              setMessages((prev) => {
                // If this is a message we sent, remove the optimistic temp message
                if (msg.senderId?.toString() === myId?.toString()) {
                  const optIndex = prev.findIndex(m => m.tempId && m.content === msg.content);
                  if (optIndex !== -1) {
                    const newMsgs = [...prev];
                    newMsgs[optIndex] = msg; // Replace optimistic message with real message
                    return newMsgs;
                  }
                }
                
                // If it's a new incoming message or we couldn't match the optimistic one, add it
                if (prev.some(m => m.id === msg.id)) {
                  return prev; // Already exists
                }
                return [msg, ...prev];
              });
              
              // If it's from the other person, mark it read
              if (msg.senderId?.toString() !== myId?.toString()) {
                api.patch(`/chat/read/${msg.id}`).catch(console.error);
              }
            }
          }
        });
      };

      client.onStompError = function (frame) {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      };

      client.activate();
      stompClient.current = client;
    } catch (e) {
      console.error('STOMP Setup Error:', e);
    }
  };

  const handleTyping = (text) => {
    setInput(text);
  };

  const sendMessage = () => {
    if (!input.trim() || !resolvedUserId) return;

    if (stompClient.current && stompClient.current.connected) {
      const messageObj = {
        recipientId: parseInt(resolvedUserId),
        content: input,
      };

      // Optimistic UI update
      const tempId = Date.now();
      const tempMsg = {
        id: tempId,
        tempId: tempId,
        senderId: myId,
        recipientId: resolvedUserId,
        content: input,
        createdAt: new Date().toISOString(),
        read: false
      };
      setMessages((prev) => [tempMsg, ...prev]);

      stompClient.current.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(messageObj),
      });

      setInput('');
    } else {
      console.warn("STOMP Client is not connected");
    }
  };

  const handleDeleteConversation = () => {
    Alert.alert(
      'Delete Conversation',
      'This will permanently delete all messages in this chat. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/chat/conversation/${resolvedUserId}`);
              setMessages([]);
              setShowOptions(false);
              router.back();
            } catch (err) {
              console.error('Delete conversation error:', err);
              Alert.alert('Error', 'Could not delete conversation. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteMessage = (messageId) => {
    Alert.alert(
      'Delete Message',
      'Delete this message for both you and the other person?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/chat/message/${messageId}`);
              setMessages(prev => prev.filter(m => m.id !== messageId));
            } catch (err) {
              console.error('Delete message error:', err);
              Alert.alert('Error', 'Could not delete message.');
            }
          },
        },
      ]
    );
  };

  const renderMessage = ({ item, index }) => {
    const isMe = item.senderId?.toString() === myId?.toString();
    const prevMessage = messages[index - 1];
    const isConsecutive = prevMessage && prevMessage.senderId?.toString() === item.senderId?.toString();

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onLongPress={() => {
          if (item.id) handleDeleteMessage(item.id);
        }}
        delayLongPress={400}
      >
        <View style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowTheir]}>
          <View style={[
            styles.messageBubble, 
            isMe ? styles.myMessage : styles.theirMessage,
            !isConsecutive && isMe ? styles.myMessageTail : null,
            !isConsecutive && !isMe ? styles.theirMessageTail : null
          ]}>
            <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
              {item.content}
            </Text>
            <View style={styles.messageFooter}>
              <Text style={[styles.timeText, isMe ? styles.myTime : styles.theirTime]}>
                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              {isMe && (
                <View style={styles.readReceipt}>
                  {item.read ? (
                    <CheckCheck size={14} color="#C9748A" />
                  ) : (
                    <Check size={14} color="rgba(255,255,255,0.7)" />
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const avatarUri = getFallbackAvatar({ name, profilePhoto: photo });

  const screenContent = (
    <ImageBackground 
      source={{ uri: 'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png' }} 
      style={styles.bgImage}
      resizeMode="cover"
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Image 
            source={{ uri: avatarUri }} 
            style={styles.headerAvatar} 
            onError={(e) => console.log('Image failed:', avatarUri, e.nativeEvent)} 
          />
          <View>
            <Text style={styles.headerTitle}>{name}</Text>
            <Text style={[styles.headerStatus, isOnline ? styles.onlineColor : styles.offlineColor]}>
              {isTyping ? 'Typing...' : (isOnline ? 'Online' : 'Offline')}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.optionsBtn} onPress={() => setShowOptions(true)}>
          <MoreVertical size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        inverted
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Message"
            placeholderTextColor="#999"
            value={input}
            onChangeText={handleTyping}
            multiline
          />
        </View>
        <TouchableOpacity 
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]} 
          onPress={sendMessage}
          disabled={!input.trim()}
        >
          <Send size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#FFF6F5' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        {screenContent}
      </SafeAreaView>

      {/* Options Menu Modal */}
      <Modal
        visible={showOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity 
          style={styles.optionsOverlay} 
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.optionsMenu}>
            <Text style={styles.optionsTitle}>Chat Options</Text>
            <TouchableOpacity style={styles.optionsItem} onPress={handleDeleteConversation}>
              <Trash2 size={18} color="#E53935" />
              <Text style={[styles.optionsItemText, { color: '#E53935' }]}>Delete Conversation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionsItem, { borderTopWidth: 1, borderTopColor: '#F0F0F0' }]} onPress={() => setShowOptions(false)}>
              <Text style={[styles.optionsItemText, { color: '#666', textAlign: 'center', flex: 1 }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Premium Upgrade Modal */}
      <Modal
        visible={showPremiumPopup}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5610/5610944.png' }} 
                style={styles.modalIcon} 
              />
            </View>
            <Text style={styles.modalTitle}>Upgrade Required</Text>
            <Text style={styles.modalText}>{premiumErrorMsg}</Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalBtnLater} 
                onPress={() => setShowPremiumPopup(false)}
              >
                <Text style={styles.modalBtnLaterText}>Later</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalBtnUpgrade} 
                onPress={() => {
                  setShowPremiumPopup(false);
                  router.push('/premium');
                }}
              >
                <Text style={styles.modalBtnUpgradeText}>Go to Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6F5', 
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.s,
    backgroundColor: Colors.white,
    ...Shadows.light,
    zIndex: 10,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
    flex: 1,
    marginLeft: Spacing.s,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.border,
  },
  headerTitle: {
    ...Typography.h3,
    fontSize: 16,
    color: Colors.text,
  },
  headerStatus: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  onlineColor: {
    color: Colors.success,
  },
  offlineColor: {
    color: Colors.textSecondary,
  },
  backBtn: {
    padding: Spacing.s,
  },
  optionsBtn: {
    padding: Spacing.s,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  optionsMenu: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 32,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  optionsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  optionsItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  messageList: {
    paddingHorizontal: Spacing.m,
    paddingBottom: Spacing.m,
    paddingTop: Spacing.xl,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowTheir: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 2,
  },
  myMessage: {
    backgroundColor: '#C9748A', // Modern dark green WhatsApp bubble
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  myMessageTail: {
    borderTopRightRadius: 0,
  },
  theirMessage: {
    backgroundColor: Colors.white,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  theirMessageTail: {
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 2,
  },
  myMessageText: {
    color: Colors.white,
  },
  theirMessageText: {
    color: Colors.text,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 2,
  },
  timeText: {
    fontSize: 10,
  },
  myTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  theirTime: {
    color: '#999',
  },
  readReceipt: {
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.s,
    paddingTop: Spacing.s,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 24,
    marginRight: Spacing.s,
    minHeight: 48,
    maxHeight: 120,
    justifyContent: 'center',
    paddingHorizontal: 16,
    ...Shadows.medium,
  },
  input: {
    fontSize: 16,
    color: Colors.text,
    paddingTop: 12,
    paddingBottom: 12,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
  },
  sendBtnDisabled: {
    backgroundColor: '#88797D',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    ...Shadows.medium,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF0F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIcon: {
    width: 32,
    height: 32,
    tintColor: '#C9748A',
  },
  modalTitle: {
    ...Typography.h2,
    fontSize: 20,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtnLater: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnLaterText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  modalBtnUpgrade: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#C9748A',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.light,
  },
  modalBtnUpgradeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});
