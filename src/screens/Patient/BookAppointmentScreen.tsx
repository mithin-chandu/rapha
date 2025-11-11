import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, Alert, Platform, Modal, Animated } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, borderRadius, fontSize } from '../../utils/colors';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Hospital } from '../../data/hospitals';
import { Doctor } from '../../data/doctors';
import { Booking } from '../../data/bookings';
import { storage, UserData } from '../../utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';

interface BookAppointmentScreenProps {
  navigation: any;
  route: {
    params: {
      hospital: Hospital;
      doctor: Doctor;
    };
  };
  userData: UserData;
}

export const BookAppointmentScreen: React.FC<BookAppointmentScreenProps> = ({ 
  navigation, 
  route,
  userData
}) => {
  const { hospital, doctor } = route.params;
  const [formData, setFormData] = useState({
    name: userData.name || '',
    age: userData.age?.toString() || '',
    gender: userData.gender || '',
    symptoms: '',
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time) {
      setSelectedTime(time);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.age || !formData.gender || !formData.symptoms) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      console.log('Booking appointment for:', {
        doctor: doctor.name,
        hospital: hospital.name,
        date: selectedDate.toISOString().split('T')[0],
        time: formatTime(selectedTime)
      });

      // Get existing bookings
      const existingBookings = await storage.getBookings();
      
      // Create new booking
      const newBooking: Booking = {
        id: Date.now(),
        patientName: formData.name,
        patientAge: parseInt(formData.age),
        patientGender: formData.gender,
        doctorId: doctor.id,
        doctorName: doctor.name,
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        date: selectedDate.toISOString().split('T')[0],
        time: formatTime(selectedTime),
        symptoms: formData.symptoms,
        status: 'Pending',
        bookedAt: new Date().toISOString(),
      };

      // Save updated bookings list
      await storage.saveBookings([...existingBookings, newBooking]);
      console.log('Booking saved successfully');

      // Show custom confirmation modal instead of Alert
      setConfirmedBooking(newBooking);
      setShowConfirmationModal(true);
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmationModal(false);
    setConfirmedBooking(null);
    navigation.goBack();
  };

  const handleViewBookings = () => {
    setShowConfirmationModal(false);
    setConfirmedBooking(null);
    try {
      navigation.navigate('MyBookings');
    } catch (error) {
      console.error('Navigation to MyBookings failed:', error);
      navigation.goBack();
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const isFormValid = () => {
    return formData.name && formData.age && formData.gender && formData.symptoms;
  };

  return (
    <View style={styles.container}>
      <Header
        title="Book Appointment"
        showBack={true}
        onBackPress={handleBackPress}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.appointmentHeader}>
          <View style={styles.doctorInfo}>
            <View style={styles.doctorIcon}>
              <Ionicons name="person" size={24} color={colors.primary} />
            </View>
            <View style={styles.doctorDetails}>
              <Text style={styles.doctorName}>Dr. {doctor.name}</Text>
              <Text style={styles.specialization}>{doctor.specialization}</Text>
              <Text style={styles.hospitalName}>{hospital.name}</Text>
            </View>
          </View>
          
          {doctor.consultationFee && (
            <View style={styles.feeContainer}>
              <Text style={styles.feeLabel}>Consultation Fee</Text>
              <Text style={styles.feeAmount}>₹{doctor.consultationFee}</Text>
            </View>
          )}
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              placeholder="Enter patient name"
              placeholderTextColor={colors.textLight}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Age *</Text>
              <TextInput
                style={styles.input}
                value={formData.age}
                onChangeText={(value) => updateFormData('age', value)}
                placeholder="Age"
                placeholderTextColor={colors.textLight}
                keyboardType="numeric"
              />
            </View>
            
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Gender *</Text>
              <TextInput
                style={styles.input}
                value={formData.gender}
                onChangeText={(value) => updateFormData('gender', value)}
                placeholder="Male/Female/Other"
                placeholderTextColor={colors.textLight}
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Appointment Details</Text>
          
          <View style={styles.dateTimeContainer}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Select Date *</Text>
              <Button
                title={formatDate(selectedDate)}
                onPress={() => setShowDatePicker(true)}
                variant="outline"
                icon="calendar-outline"
              />
            </View>
            
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Select Time *</Text>
              <Button
                title={formatTime(selectedTime)}
                onPress={() => setShowTimePicker(true)}
                variant="outline"
                icon="time-outline"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Symptoms / Reason for Visit *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.symptoms}
              onChangeText={(value) => updateFormData('symptoms', value)}
              placeholder="Describe your symptoms or reason for consultation"
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.timingInfo}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.timingText}>
              Doctor is available from {doctor.timing}
            </Text>
          </View>

          <Button
            title="Book Appointment"
            onPress={handleSubmit}
            variant="primary"
            size="lg"
            loading={loading}
            disabled={!isFormValid()}
            icon="calendar-outline"
          />
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* Booking Confirmation Modal */}
      <Modal
        visible={showConfirmationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseConfirmation}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.modalHeader}
            >
              {/* Close Button */}
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleCloseConfirmation}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>

              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={60} color="#ffffff" />
              </View>
              <Text style={styles.modalTitle}>Appointment Booked!</Text>
              <Text style={styles.modalSubtitle}>Your appointment has been confirmed</Text>
            </LinearGradient>

            <View style={styles.modalContent}>
              {confirmedBooking && (
                <>
                  {/* Patient Info */}
                  <View style={styles.infoSection}>
                    <View style={styles.infoHeader}>
                      <Ionicons name="person-outline" size={20} color="#059669" />
                      <Text style={styles.infoTitle}>Patient Information</Text>
                    </View>
                    <View style={styles.infoGrid}>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Name:</Text>
                        <Text style={styles.infoValue}>{confirmedBooking.patientName}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Age:</Text>
                        <Text style={styles.infoValue}>{confirmedBooking.patientAge} years</Text>
                      </View>
                    </View>
                  </View>

                  {/* Doctor & Hospital Info */}
                  <View style={styles.infoSection}>
                    <View style={styles.infoHeader}>
                      <Ionicons name="medical-outline" size={20} color="#3b82f6" />
                      <Text style={styles.infoTitle}>Appointment Details</Text>
                    </View>
                    <View style={styles.infoGrid}>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Doctor:</Text>
                        <Text style={styles.infoValue}>Dr. {confirmedBooking.doctorName}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Hospital:</Text>
                        <Text style={styles.infoValue}>{confirmedBooking.hospitalName}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Date:</Text>
                        <Text style={styles.infoValue}>{formatDate(new Date(confirmedBooking.date))}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Time:</Text>
                        <Text style={styles.infoValue}>{confirmedBooking.time}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Symptoms:</Text>
                        <Text style={styles.infoValue}>{confirmedBooking.symptoms}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Status Info */}
                  <View style={styles.statusContainer}>
                    <View style={styles.statusBadge}>
                      <Ionicons name="time-outline" size={16} color="#f59e0b" />
                      <Text style={styles.statusText}>Pending Confirmation</Text>
                    </View>
                    <Text style={styles.statusNote}>
                      You will receive a confirmation from the hospital soon.
                    </Text>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.modalActions}>
                    <TouchableOpacity 
                      style={styles.secondaryButton}
                      onPress={handleCloseConfirmation}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.secondaryButtonText}>Done</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.primaryButton}
                      onPress={handleViewBookings}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#3b82f6', '#2563eb']}
                        style={styles.primaryButtonGradient}
                      >
                        <Ionicons name="calendar-outline" size={16} color="#ffffff" />
                        <Text style={styles.primaryButtonText}>View My Bookings</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
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
  content: {
    flex: 1,
  },
  appointmentHeader: {
    backgroundColor: colors.card,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  doctorIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  specialization: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  hospitalName: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  feeContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  feeLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  feeAmount: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primary,
  },
  form: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    marginTop: spacing.md,
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
    height: 100,
    textAlignVertical: 'top',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  timingText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    maxWidth: 420,
    width: '95%',
    maxHeight: '85%',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 24,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  successIcon: {
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  modalContent: {
    padding: 20,
    maxHeight: 400,
  },
  infoSection: {
    marginBottom: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginLeft: 10,
  },
  infoGrid: {
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    flex: 1.5,
    textAlign: 'right',
  },
  statusContainer: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f59e0b',
    marginLeft: 5,
  },
  statusNote: {
    fontSize: 13,
    color: '#92400e',
    textAlign: 'center',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
  },
  primaryButton: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 6,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});