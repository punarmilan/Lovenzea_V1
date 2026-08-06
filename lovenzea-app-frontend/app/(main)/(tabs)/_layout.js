import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Heart, MessageSquare, User, Crown, ChevronLeft, MoreHorizontal } from 'lucide-react-native';
import { Colors } from '../../../src/constants/Theme';
import { TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import CustomTabBar from '../../../src/components/navigation/CustomTabBar';

export default function TabsLayout() {
  const navigation = useNavigation();

  return (
    <Tabs 
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textSecondary,
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity 
          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.dispatch(DrawerActions.toggleDrawer())}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#C9748A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2, borderWidth: 1, borderColor: 'rgba(242, 82, 104, 0.05)', marginLeft: 16 }}
        >
          <ChevronLeft size={24} color={Colors.primary} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#C9748A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2, borderWidth: 1, borderColor: 'rgba(242, 82, 104, 0.05)', marginRight: 16 }}
        >
          <MoreHorizontal size={24} color={Colors.primary} />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'left',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: Colors.text,
        fontSize: 18,
      },
      headerStyle: {
        backgroundColor: '#FFF8FA',
        elevation: 2,
        shadowColor: '#C9748A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(242, 82, 104, 0.05)',
      },
      tabBarStyle: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        backgroundColor: Colors.white,
      }
    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Discovery',
          headerShown: false,
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          headerShown: false,
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="premium"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
      
      {/* Hidden from tabs but available in the stack */}
      <Tabs.Screen
        name="edit-profile"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="user-details"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="special-services"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="sent-interests"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
