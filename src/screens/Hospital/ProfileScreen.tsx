import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, Alert, Modal } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../utils/colors';
import { Button } from '../../components/Button';
import { storage, UserData } from '../../utils/storage';
import { Ionicons } from '@expo/vector-icons';

interface HospitalProfileScreenProps {
  userData: UserData;
  onLogout: () => void;
  onUpdateUserData: (userData: UserData) => void;
}

export const HospitalProfileScreen: React.FC<HospitalProfileScreenProps> = ({ 
  userData, 
  onLogout, 
  onUpdateUserData 
}) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: userData.name || '',
    email: userData.email || '',
    phone: userData.phone || '',
    address: userData.address || '',
  });
  const [loading, setLoading] = useState(false);

  const updateEditFormData = (key: string, value: string) => {
    setEditFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    
    try {
      const updatedUserData: UserData = {
        ...userData,
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        address: editFormData.address,
      };

      await storage.setUserData(updatedUserData);
      onUpdateUserData(updatedUserData);
      
      setEditModalVisible(false);
      Alert.alert('Success', 'Hospital profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await storage.clearUserData();
            await storage.setAuthStatus(false);
            onLogout();
          },
        },
      ]
    );
  };

  const openEditModal = () => {
    setEditFormData({
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      address: userData.address || '',
    });
    setEditModalVisible(true);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="medical" size={32} color={colors.primary} />
          </View>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.role}>Hospital</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hospital Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="business-outline" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Hospital Name</Text>
                <Text style={styles.infoValue}>{userData.name || 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{userData.email || 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{userData.phone || 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{userData.address || 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="key-outline" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Hospital ID</Text>
                <Text style={styles.infoValue}>#{userData.hospitalId || 'N/A'}</Text>
              </View>
            </View>
          </View>

          <Button
            title="Edit Hospital Info"
            onPress={openEditModal}
            variant="primary"
            icon="create-outline"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hospital Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="people-outline" size={24} color={colors.primary} />
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Doctors</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="calendar-outline" size={24} color={colors.secondary} />
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Total Bookings</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
              <Text style={styles.statNumber}>142</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="star-outline" size={24} color={colors.warning} />
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            icon="log-out-outline"
          />
        </View>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Hospital Info</Text>
            <Button
              title="Cancel"
              onPress={() => setEditModalVisible(false)}
              variant="outline"
              size="small"
            />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Hospital Name</Text>
              <TextInput
                style={styles.input}
                value={editFormData.name}
                onChangeText={(value) => updateEditFormData('name', value)}
                placeholder="Enter hospital name"
                placeholderTextColor={colors.textLight}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={editFormData.email}
                onChangeText={(value) => updateEditFormData('email', value)}
                placeholder="Enter hospital email"
                placeholderTextColor={colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={editFormData.phone}
                onChangeText={(value) => updateEditFormData('phone', value)}
                placeholder="Enter hospital phone number"
                placeholderTextColor={colors.textLight}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editFormData.address}
                onChangeText={(value) => updateEditFormData('address', value)}
                placeholder="Enter hospital address"
                placeholderTextColor={colors.textLight}
                multiline
                numberOfLines={4}
              />
            </View>

            <Button
              title="Save Changes"
              onPress={handleSaveProfile}
              variant="primary"
              loading={loading}
              icon="checkmark-outline"
            />
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.textWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textWhite,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  role: {
    fontSize: fontSize.md,
    color: colors.textWhite + 'CC',
    fontWeight: '500',
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  infoContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    width: '48%',
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    marginVertical: spacing.sm,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalContent: {
    flex: 1,
    padding: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});