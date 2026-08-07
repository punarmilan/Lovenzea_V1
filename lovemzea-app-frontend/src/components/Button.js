import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography, Shadows } from '../constants/Theme';

const Button = ({ title, onPress, type = 'primary', loading = false, style, textStyle }) => {
  const isPrimary = type === 'primary';

  const content = loading ? (
    <ActivityIndicator color={isPrimary ? Colors.white : Colors.primary} />
  ) : (
    <Text
      style={[
        styles.text,
        isPrimary ? styles.textPrimary : styles.textSecondary,
        textStyle,
      ]}
    >
      {title}
    </Text>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
      style={[styles.container, Shadows.medium, style]}
    >
      {isPrimary ? (
        <LinearGradient
          colors={Colors.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={[styles.button, styles.secondary]}>
          {content}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: Spacing.s,
    borderRadius: 20,
  },
  button: {
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
    width: '100%',
  },
  secondary: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.primaryLight,
  },
  text: {
    ...Typography.body,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textPrimary: {
    color: Colors.white,
  },
  textSecondary: {
    color: Colors.primaryDark,
  },
});

export default Button;
