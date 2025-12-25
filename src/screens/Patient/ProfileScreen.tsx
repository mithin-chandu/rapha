import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, Alert, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../utils/colors';
import { Button } from '../../components/Button';
import { storage, UserData } from '../../utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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

      // Use the enhanced storage update method
      await storage.updateUserData(updatedUserData);
      onUpdateUserData(updatedUserData);
      
      setEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
      <LinearGradient
        colors={['#2563eb', '#3b82f6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.backgroundPattern}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />
          <View style={styles.circle3} />
        </View>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['#ffffff', '#f8f9fa']}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>
              {userData.name?.charAt(0).toUpperCase() || 'P'}
            </Text>
          </LinearGradient>
          <Text style={styles.name}>{userData.name}</Text>
          <LinearGradient
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
            style={styles.roleBadge}
          >
            <Text style={styles.role}>Patient</Text>
          </LinearGradient>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <LinearGradient
            colors={['#3b82f6', '#1d4ed8']}
            style={styles.statCard}
          >
            <Ionicons name="calendar-outline" size={24} color="#fff" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Appointments</Text>
          </LinearGradient>
          <LinearGradient
            colors={['#60a5fa', '#3b82f6']}
            style={styles.statCard}
          >
            <Ionicons name="document-text-outline" size={24} color="#fff" />
            <Text style={[styles.statNumber, { color: '#fff' }]}>8</Text>
            <Text style={[styles.statLabel, { color: '#fff' }]}>Reports</Text>
          </LinearGradient>
          <LinearGradient
            colors={['#93c5fd', '#60a5fa']}
            style={styles.statCard}
          >
            <Ionicons name="medical-outline" size={24} color="#fff" />
            <Text style={[styles.statNumber, { color: '#fff' }]}>4</Text>
            <Text style={[styles.statLabel, { color: '#fff' }]}>Prescriptions</Text>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="person" size={20} color={colors.primary} style={styles.sectionIcon} />
            Personal Information
          </Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <LinearGradient
                colors={['#667eea20', '#764ba220']}
                style={styles.iconContainer}
              >
                <Ionicons name="person-outline" size={20} color={colors.primary} />
              </LinearGradient>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{userData.name || 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="mail-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{userData.email || 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{userData.age ? `${userData.age} years` : 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="transgender-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>{userData.gender || 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="call-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{userData.phone || 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="location-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{userData.address || 'Not provided'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="flash" size={20} color={colors.primary} style={styles.sectionIcon} />
            Quick Actions
          </Text>
          
          <View style={styles.actionGrid}>
            <View style={styles.actionButton}>
              <Button
                title="Edit Profile"
                onPress={() => setEditModalVisible(true)}
                variant="primary"
                icon="create-outline"
              />
            </View>
            
            <View style={styles.actionButton}>
              <Button
                title="Medical History"
                onPress={() => {/* Navigate to medical history */}}
                variant="outline"
                icon="document-text-outline"
              />
            </View>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="settings" size={20} color={colors.primary} style={styles.sectionIcon} />
            Account Settings
          </Text>
          
          <View style={styles.settingsCard}>
            <View style={styles.settingButton}>
              <Button
                title="Privacy Settings"
                onPress={() => {/* Navigate to privacy */}}
                variant="ghost"
                icon="shield-outline"
              />
            </View>
            
            <View style={styles.settingButton}>
              <Button
                title="Notifications"
                onPress={() => {/* Navigate to notifications */}}
                variant="ghost"
                icon="notifications-outline"
              />
            </View>
            
            <View style={styles.settingButton}>
              <Button
                title="Security"
                onPress={() => {/* Navigate to security */}}
                variant="ghost"
                icon="lock-closed-outline"
              />
            </View>
            
            <View style={styles.logoutButton}>
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingVertical: spacing.xxl * 2,
    paddingTop: spacing.xxl * 2.5,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.2)',
    top: -50,
    right: -50,
  },
  circle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.15)',
    bottom: -30,
    left: -30,
  },
  circle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: 100,
    left: 50,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.4,
    shadowRadius: 28,
    elevation: 14,
    borderWidth: 6,
    borderColor: '#ffffff',
  },
  roleBadge: {
    paddingHorizontal: spacing.lg + 4,
    paddingVertical: spacing.sm + 2,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  avatarText: {
    fontSize: fontSize.xxl * 1.2,
    fontWeight: '800',
    color: colors.primary,
  },
  name: {
    fontSize: fontSize.xl * 1.2,
    fontWeight: '700',
    color: colors.textWhite,
    marginBottom: spacing.sm,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  role: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
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
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  statCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minHeight: 110,
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: '#fff',
    marginVertical: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionIcon: {
    marginRight: spacing.sm,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
                                                                                                                        infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  settingsCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingButton: {
    marginBottom: spacing.sm,
    justifyContent: 'flex-start',
  },
  logoutButton: {
    marginTop: spacing.md,
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