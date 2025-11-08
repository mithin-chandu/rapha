import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, Alert, Modal } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../utils/colors';
import { Button } from '../../components/Button';
import { storage, UserData } from '../../utils/storage';
import { Ionicons } from '@expo/vector-icons';

interface ProfileScreenProps {
  userData: UserData;
  onLogout: () => void;
  onUpdateUserData: (userData: UserData) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  userData, 
  onLogout, 
  onUpdateUserData 
}) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: userData.name || '',
    email: userData.email || '',
    age: userData.age?.toString() || '',
    gender: userData.gender || '',
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
        age: parseInt(editFormData.age) || undefined,
        gender: editFormData.gender,
        phone: editFormData.phone,
        address: editFormData.address,
      };

      await storage.setUserData(updatedUserData);
      onUpdateUserData(updatedUserData);
      
      setEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      // Clear all user data and auth status
      await storage.clearUserData();
      await storage.setAuthStatus(false);
      
      // Direct logout without any messages
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if clearing data fails, still logout
      onLogout();
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    setEditFormData({
      name: userData.name || '',
      email: userData.email || '',
      age: userData.age?.toString() || '',
      gender: userData.gender || '',
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
            <Text style={styles.avatarText}>
              {userData.name?.charAt(0).toUpperCase() || 'P'}
            </Text>
          </View>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.role}>Patient</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
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
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{userData.age ? `${userData.age} years` : 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="transgender-outline" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>{userData.gender || 'Not provided'}</Text>
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
          </View>

          <Button
            title="Edit Profile"
            onPress={openEditModal}
            variant="primary"
            icon="create-outline"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            icon="log-out-outline"
            loading={loading}
            disabled={loading}
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
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <Button
              title="Cancel"
              onPress={() => setEditModalVisible(false)}
              variant="outline"
              size="sm"
            />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={editFormData.name}
                onChangeText={(value) => updateEditFormData('name', value)}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textLight}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={editFormData.email}
                onChangeText={(value) => updateEditFormData('email', value)}
                placeholder="Enter your email"
                placeholderTextColor={colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  value={editFormData.age}
                  onChangeText={(value) => updateEditFormData('age', value)}
                  placeholder="Age"
                  placeholderTextColor={colors.textLight}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>Gender</Text>
                <TextInput
                  style={styles.input}
                  value={editFormData.gender}
                  onChangeText={(value) => updateEditFormData('gender', value)}
                  placeholder="Gender"
                  placeholderTextColor={colors.textLight}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={editFormData.phone}
                onChangeText={(value) => updateEditFormData('phone', value)}
                placeholder="Enter your phone number"
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
                placeholder="Enter your address"
                placeholderTextColor={colors.textLight}
                multiline
                numberOfLines={3}
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
  avatarText: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.primary,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textWhite,
    marginBottom: spacing.xs,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
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
    height: 80,
    textAlignVertical: 'top',
  },
});