import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../src/constants/Theme';
import { ChevronLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import MatchFeedCard from '../../src/components/discovery/MatchFeedCard';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function SeeLaterScreen() {
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadSeeLaterMatches();
    }, [])
  );

  const loadSeeLaterMatches = async () => {
    try {
      const data = await AsyncStorage.getItem('SEE_LATER_MATCHES');
      if (data) {
        setProfiles(JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to load see later matches', e);
    }
  };

  const removeMatch = async (userId) => {
    try {
      const updated = profiles.filter(p => p.id !== userId);
      setProfiles(updated);
      await AsyncStorage.setItem('SEE_LATER_MATCHES', JSON.stringify(updated));
      Toast.show({ type: 'success', text1: 'Removed from See Later' });
    } catch (e) {
      console.error('Failed to remove', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ─── Header ─── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>See Later</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ─── List ─── */}
      {profiles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No profiles saved for later yet.</Text>
        </View>
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <MatchFeedCard 
                user={item}
                onPress={(u) => router.push({ pathname: '/user-details', params: { userId: u.id } })}
                onDismiss={(u) => removeMatch(u.id)}
                onMenuOptions={(u) => {}}
                onChat={(u) => router.push(`/chat/${u.id}`)}
              />
              <Text style={styles.hintText}>Tap 'X' on the card to remove from this list</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'PlayfairDisplay-SemiBold',
    color: Colors.text,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  cardWrapper: {
    marginBottom: 10,
  },
  hintText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: -5,
    marginBottom: 10,
  }
});
