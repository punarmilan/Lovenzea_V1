import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { Colors } from '../../src/constants/Theme';
import CustomDrawer from '../../src/components/navigation/CustomDrawer';
import { Menu } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export default function MainLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false, // Hide drawer header by default, child navigators will handle it
        drawerType: 'slide',
        drawerPosition: 'right',
        drawerStyle: {
          width: '80%',
          backgroundColor: Colors.white,
        },
        overlayColor: 'rgba(0,0,0,0.5)',
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'Main App',
        }}
      />
    </Drawer>
  );
}
