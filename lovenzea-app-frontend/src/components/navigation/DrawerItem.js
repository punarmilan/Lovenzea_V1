import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Typography } from '../../constants/Theme';

const DrawerItem = ({ label, icon: Icon, onPress, active, color }) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.container,
        active && styles.activeContainer
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Icon 
          size={22} 
          color={active ? '#C9748A' : (color || Colors.textSecondary)} 
          strokeWidth={active ? 2.5 : 2}
        />
      </View>
      <Text style={[
        styles.label,
        active && styles.activeLabel,
        { color: active ? '#C9748A' : (color || Colors.text) }
      ]}>
        {label}
      </Text>
      {active && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.m - 2,
    paddingHorizontal: Spacing.m,
    marginHorizontal: Spacing.m,
    marginVertical: 4,
    borderRadius: 14,
  },
  activeContainer: {
    backgroundColor: '#FFF0F3', // Light pink glow background
    borderWidth: 1,
    borderColor: '#FEE5EC',
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.s + 4,
  },
  label: {
    ...Typography.body,
    fontWeight: '600',
    fontSize: 15,
  },
  activeLabel: {
    fontWeight: '700',
    color: '#C9748A',
  },
  activeIndicator: {
    position: 'absolute',
    right: 16,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C9748A',
  }
});

export default DrawerItem;
