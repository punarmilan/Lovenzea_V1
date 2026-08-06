import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { User, EyeOff, Flag, ShieldAlert, Share2, X } from 'lucide-react-native';
import { Colors } from '../../constants/Theme';

const { height } = Dimensions.get('window');

export default function ProfileOptionsBottomSheet({ visible, onClose, user, onAction }) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.bottomSheet} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title}>Options for {user?.fullName?.split(' ')[0]}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color="#757575" />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsList}>
            <TouchableOpacity style={styles.optionItem} onPress={() => onAction('view_profile')}>
              <View style={[styles.iconWrapper, { backgroundColor: '#F3E5F5' }]}>
                <User size={20} color="#9C27B0" />
              </View>
              <Text style={styles.optionText}>View Full Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} onPress={() => onAction('hide')}>
              <View style={[styles.iconWrapper, { backgroundColor: '#FFF3E0' }]}>
                <EyeOff size={20} color="#FF9800" />
              </View>
              <Text style={styles.optionText}>Hide This Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} onPress={() => onAction('report')}>
              <View style={[styles.iconWrapper, { backgroundColor: '#FFEBEE' }]}>
                <Flag size={20} color="#F44336" />
              </View>
              <Text style={styles.optionText}>Report Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} onPress={() => onAction('block')}>
              <View style={[styles.iconWrapper, { backgroundColor: '#ECEFF1' }]}>
                <ShieldAlert size={20} color="#607D8B" />
              </View>
              <Text style={styles.optionText}>Block Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} onPress={() => onAction('share')}>
              <View style={[styles.iconWrapper, { backgroundColor: '#E8F5E9' }]}>
                <Share2 size={20} color="#4CAF50" />
              </View>
              <Text style={styles.optionText}>Share Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: height * 0.45,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 20,
    color: '#212121',
  },
  closeBtn: {
    padding: 4,
  },
  optionsList: {
    flex: 1,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#212121',
  },
});
