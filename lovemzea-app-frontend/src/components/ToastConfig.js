import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react-native';
import { Colors, Shadows, Spacing } from '../constants/Theme';

export const toastConfig = {
  success: (props) => (
    <View style={[styles.toastContainer, styles.successToast]}>
      <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
        <CheckCircle2 size={24} color="#4CAF50" />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.text1}>{props.text1}</Text>
        {props.text2 ? <Text style={styles.text2}>{props.text2}</Text> : null}
      </View>
      <View style={[styles.accentBar, { backgroundColor: '#4CAF50' }]} />
    </View>
  ),
  error: (props) => (
    <View style={[styles.toastContainer, styles.errorToast]}>
      <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
        <XCircle size={24} color="#F44336" />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.text1}>{props.text1}</Text>
        {props.text2 ? <Text style={styles.text2}>{props.text2}</Text> : null}
      </View>
      <View style={[styles.accentBar, { backgroundColor: '#F44336' }]} />
    </View>
  ),
  info: (props) => (
    <View style={[styles.toastContainer, styles.infoToast]}>
      <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
        <Info size={24} color="#2196F3" />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.text1}>{props.text1}</Text>
        {props.text2 ? <Text style={styles.text2}>{props.text2}</Text> : null}
      </View>
      <View style={[styles.accentBar, { backgroundColor: '#2196F3' }]} />
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    height: 'auto',
    minHeight: 70,
    width: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...Shadows.medium,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text1: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  text2: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 18,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
  },
  successToast: {},
  errorToast: {},
  infoToast: {},
});
