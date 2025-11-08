import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, fontSize } from '../../utils/colors';
import { storage, UserData } from '../../utils/storage';
import { Button } from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';

interface ProfileScreenProps {
  navigation: any;
  userData: UserData;
  onLogout: () => void;
  onUpdateUserData: (userData: UserData) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  navigation,
  userData, 
  onLogout, 
  onUpdateUserData 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email || '');
  const [phone, setPhone] = useState(userData.phone || '');
  const [address, setAddress] = useState(userData.address || '');
  const [specialization, setSpecialization] = useState(userData.specialization || '');
  const [contact, setContact] = useState(userData.contact || '');

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Diagnostic center name is required');
      return;
    }

    try {
      const updatedUserData: UserData = {
        ...userData,
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        specialization: specialization.trim() || undefined,
        contact: contact.trim() || undefined,
      };

      await storage.setUserData(updatedUserData);
      onUpdateUserData(updatedUserData);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setName(userData.name);
    setEmail(userData.email || '');
    setPhone(userData.phone || '');
    setAddress(userData.address || '');
    setSpecialization(userData.specialization || '');
    setContact(userData.contact || '');
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await storage.setAuthStatus(false);
      await storage.clearUserData();
      onLogout();
    } catch (error) {
      console.error('Error during logout:', error);
      onLogout(); // Still logout even if clearing data fails
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <LinearGradient
        colors={['#DC2626', '#F59E0B', '#EF4444']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerSection}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
        </TouchableOpacity>

        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
              style={styles.avatar}
            >
              <Ionicons name="flask" size={40} color={colors.textWhite} />
            </LinearGradient>
          </View>
          <Text style={styles.profileName}>{userData.name}</Text>
          <Text style={styles.profileRole}>Diagnostic Center</Text>
          <View style={styles.profileBadge}>
            <Ionicons name="checkmark-circle" size={16} color={colors.accepted} />
            <Text style={styles.badgeText}>Verified Center</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.contentSection}>
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#DC2626' + '20', '#DC2626' + '10']}
              style={styles.statCardGradient}
            >
              <Ionicons name="flask" size={24} color="#DC2626" />
              <Text style={styles.statNumber}>8+</Text>
              <Text style={styles.statLabel}>Tests Available</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={[colors.accepted + '20', colors.accepted + '10']}
              style={styles.statCardGradient}
            >
              <Ionicons name="people" size={24} color={colors.accepted} />
              <Text style={styles.statNumber}>150+</Text>
              <Text style={styles.statLabel}>Patients Served</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={[colors.warning + '20', colors.warning + '10']}
              style={styles.statCardGradient}
            >
              <Ionicons name="star" size={24} color={colors.warning} />
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Profile Information */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Diagnostic Center Information</Text>
            {!isEditing ? (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="pencil" size={18} color={colors.primary} />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.infoCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Center Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter center name"
                  placeholderTextColor={colors.textLight}
                />
              ) : (
                <Text style={styles.infoText}>{userData.name}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Specialization</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={specialization}
                  onChangeText={setSpecialization}
                  placeholder="e.g., Radiology, Pathology"
                  placeholderTextColor={colors.textLight}
                />
              ) : (
                <Text style={styles.infoText}>
                  {userData.specialization || 'Not specified'}
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contact Number</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={contact}
                  onChangeText={setContact}
                  placeholder="Enter contact number"
                  placeholderTextColor={colors.textLight}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoText}>
                  {userData.contact || 'Not provided'}
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email address"
                  placeholderTextColor={colors.textLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={styles.infoText}>
                  {userData.email || 'Not provided'}
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter center address"
                  placeholderTextColor={colors.textLight}
                  multiline
                  numberOfLines={3}
                />
              ) : (
                <Text style={styles.infoText}>
                  {userData.address || 'Not provided'}
                </Text>
              )}
            </View>

            {isEditing && (
              <View style={styles.actionButtons}>
                <View style={{ width: '45%' }}>
                  <Button
                    title="Cancel"
                    onPress={handleCancel}
                    variant="outline"
                  />
                </View>
                <LinearGradient
                  colors={['#DC2626', '#F59E0B']}
                  style={[styles.saveButtonGradient, { width: '45%' }]}
                >
                  <Button
                    title="Save Changes"
                    onPress={handleSave}
                    variant="gradient"
                  />
                </LinearGradient>
              </View>
            )}
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Ionicons name="notifications" size={20} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingSubtitle}>Manage notification preferences</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Ionicons name="shield-checkmark" size={20} color={colors.accepted} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Privacy & Security</Text>
                <Text style={styles.settingSubtitle}>Manage your privacy settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Ionicons name="help-circle" size={20} color={colors.info} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Help & Support</Text>
                <Text style={styles.settingSubtitle}>Get help and contact support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <LinearGradient
            colors={[colors.error + '20', colors.error + '10']}
            style={styles.logoutCard}
          >
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out" size={24} color={colors.error} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.bottomSpacer} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileName: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.textWhite,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  profileRole: {
    fontSize: fontSize.md,
    color: colors.textWhite + 'CC',
    marginBottom: spacing.lg,
    fontWeight: '500',
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: fontSize.sm,
    color: colors.textWhite,
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
  },
  statCardGradient: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  editButtonText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundSecondary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  infoText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  saveButtonGradient: {
    borderRadius: borderRadius.lg,
  },
  settingsSection: {
    marginBottom: spacing.xl,
  },
  settingsCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  settingSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  settingDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.xl,
  },
  logoutSection: {
    marginBottom: spacing.xl,
  },
  logoutCard: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  logoutText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.error,
    marginLeft: spacing.md,
  },
  bottomSpacer: {
    height: spacing.xxxl,
  },
});