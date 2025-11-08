import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, borderRadius, fontSize } from '../../utils/colors';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Hospital } from '../../data/hospitals';
import { Doctor } from '../../data/doctors';
import { Booking } from '../../data/bookings';
import { storage, UserData } from '../../utils/storage';
import { Ionicons } from '@expo/vector-icons';

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

      Alert.alert(
        'Booking Confirmed!', 
        `Your appointment with Dr. ${doctor.name} has been scheduled for ${formatDate(selectedDate)} at ${formatTime(selectedTime)}. You will receive a confirmation soon.`,
        [
          {
            text: 'View My Bookings',
            onPress: () => {
              try {
                navigation.navigate('MyBookings');
              } catch (error) {
                console.error('Navigation to MyBookings failed:', error);
                navigation.goBack();
              }
            }
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
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
});