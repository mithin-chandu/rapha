import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Alert, Modal, TextInput } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../utils/colors';
import { DoctorCard } from '../../components/DoctorCard';
import { Button } from '../../components/Button';
import { doctors as initialDoctors, Doctor } from '../../data/doctors';
import { storage, UserData } from '../../utils/storage';
import { Ionicons } from '@expo/vector-icons';

interface DoctorsScreenProps {
  userData: UserData;
  navigation: any;
}

export const DoctorsScreen: React.FC<DoctorsScreenProps> = ({ userData, navigation }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newDoctorData, setNewDoctorData] = useState({
    name: '',
    specialization: '',
    experience: '',
    timing: '',
    qualification: '',
    consultationFee: '',
  });

  const loadDoctors = async () => {
    try {
      const savedDoctors = await storage.getDoctors();
      if (savedDoctors.length > 0) {
        // Filter doctors for current hospital
        const hospitalDoctors = savedDoctors.filter(
          doctor => doctor.hospitalId === userData.hospitalId
        );
        setDoctors(hospitalDoctors);
      } else {
        // Use initial data and save it
        await storage.saveDoctors(initialDoctors);
        const hospitalDoctors = initialDoctors.filter(
          doctor => doctor.hospitalId === userData.hospitalId
        );
        setDoctors(hospitalDoctors);
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, [userData.hospitalId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDoctors();
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDoctors();
    setRefreshing(false);
  };

  const updateNewDoctorData = (key: string, value: string) => {
    setNewDoctorData(prev => ({ ...prev, [key]: value }));
  };

  const handleAddDoctor = async () => {
    if (!newDoctorData.name || !newDoctorData.specialization || !newDoctorData.experience || !newDoctorData.timing) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const allDoctors = await storage.getDoctors();
      const newDoctor: Doctor = {
        id: Date.now(),
        name: newDoctorData.name,
        specialization: newDoctorData.specialization,
        hospitalId: userData.hospitalId || 1,
        experience: newDoctorData.experience,
        timing: newDoctorData.timing,
        qualification: newDoctorData.qualification,
        consultationFee: newDoctorData.consultationFee ? parseInt(newDoctorData.consultationFee) : undefined,
      };

      const updatedDoctors = [...allDoctors, newDoctor];
      await storage.saveDoctors(updatedDoctors);
      
      setAddModalVisible(false);
      setNewDoctorData({
        name: '',
        specialization: '',
        experience: '',
        timing: '',
        qualification: '',
        consultationFee: '',
      });
      
      await loadDoctors();
      Alert.alert('Success', 'Doctor added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add doctor. Please try again.');
    }
  };

  const handleDeleteDoctor = (doctorId: number) => {
    Alert.alert(
      'Delete Doctor',
      'Are you sure you want to remove this doctor?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const allDoctors = await storage.getDoctors();
              const updatedDoctors = allDoctors.filter(doctor => doctor.id !== doctorId);
              await storage.saveDoctors(updatedDoctors);
              await loadDoctors();
              Alert.alert('Success', 'Doctor removed successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove doctor. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderDoctorCard = ({ item }: { item: Doctor }) => (
    <View style={styles.doctorCardContainer}>
      <DoctorCard
        doctor={item}
        showBookButton={false}
      />
      <Button
        title="Remove"
        onPress={() => handleDeleteDoctor(item.id)}
        variant="danger"
        size="sm"
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="people-outline" size={64} color={colors.textLight} />
      <Text style={styles.emptyTitle}>No Doctors Added</Text>
      <Text style={styles.emptySubtitle}>
        Add doctors to your hospital to start accepting appointments
      </Text>
      <Button
        title="Add First Doctor"
        onPress={() => setAddModalVisible(true)}
        variant="primary"
        icon="person-add-outline"
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.welcomeText}>Our Doctors</Text>
      <Text style={styles.subtitleText}>
        Manage your hospital's medical team
      </Text>
      
      {doctors.length > 0 && (
        <Button
          title="Add New Doctor"
          onPress={() => setAddModalVisible(true)}
          variant="primary"
          icon="person-add-outline"
        />
      )}
      
      {doctors.length > 0 && (
        <Text style={styles.doctorsCount}>
          {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} in your team
        </Text>
      )}
    </View>
  );

  const isFormValid = () => {
    return newDoctorData.name && newDoctorData.specialization && 
           newDoctorData.experience && newDoctorData.timing;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="hourglass-outline" size={48} color={colors.primary} />
        <Text style={styles.loadingText}>Loading doctors...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={doctors}
        renderItem={renderDoctorCard}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={doctors.length === 0 ? styles.emptyContainer : undefined}
      />

      {/* Add Doctor Modal */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Doctor</Text>
            <Button
              title="Cancel"
              onPress={() => setAddModalVisible(false)}
              variant="outline"
              size="sm"
            />
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Doctor Name *</Text>
              <TextInput
                style={styles.input}
                value={newDoctorData.name}
                onChangeText={(value) => updateNewDoctorData('name', value)}
                placeholder="Enter doctor's full name"
                placeholderTextColor={colors.textLight}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Specialization *</Text>
              <TextInput
                style={styles.input}
                value={newDoctorData.specialization}
                onChangeText={(value) => updateNewDoctorData('specialization', value)}
                placeholder="e.g., Cardiologist, Pediatrician"
                placeholderTextColor={colors.textLight}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Qualification</Text>
              <TextInput
                style={styles.input}
                value={newDoctorData.qualification}
                onChangeText={(value) => updateNewDoctorData('qualification', value)}
                placeholder="e.g., MBBS, MD Cardiology"
                placeholderTextColor={colors.textLight}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>Experience *</Text>
                <TextInput
                  style={styles.input}
                  value={newDoctorData.experience}
                  onChangeText={(value) => updateNewDoctorData('experience', value)}
                  placeholder="e.g., 5 years"
                  placeholderTextColor={colors.textLight}
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>Consultation Fee</Text>
                <TextInput
                  style={styles.input}
                  value={newDoctorData.consultationFee}
                  onChangeText={(value) => updateNewDoctorData('consultationFee', value)}
                  placeholder="Amount in ₹"
                  placeholderTextColor={colors.textLight}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Available Timing *</Text>
              <TextInput
                style={styles.input}
                value={newDoctorData.timing}
                onChangeText={(value) => updateNewDoctorData('timing', value)}
                placeholder="e.g., 10:00 AM - 4:00 PM"
                placeholderTextColor={colors.textLight}
              />
            </View>

            <Button
              title="Add Doctor"
              onPress={handleAddDoctor}
              variant="primary"
              disabled={!isFormValid()}
              icon="person-add-outline"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  welcomeText: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitleText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  doctorsCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: spacing.lg,
  },
  doctorCardContainer: {
    marginBottom: spacing.md,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textSecondary,
    marginVertical: spacing.lg,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  loadingText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginTop: spacing.lg,
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
});