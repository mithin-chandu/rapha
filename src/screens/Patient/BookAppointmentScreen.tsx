import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  StyleSheet, 
  Alert, 
  Platform, 
  Modal, 
  Animated, 
  Dimensions,
  KeyboardAvoidingView,
  StatusBar
} from 'react-native';
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
import { TouchableOpacity, Pressable } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
    name: '',
    age: '',
    gender: '',
    symptoms: '',
    phone: '',
    emergencyContact: '',
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [tempDate, setTempDate] = useState(new Date());
  const [tempTime, setTempTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  const genderOptions = [
    { label: 'Male', value: 'Male', icon: 'man-outline' },
    { label: 'Female', value: 'Female', icon: 'woman-outline' },
    { label: 'Other', value: 'Other', icon: 'people-outline' },
  ];

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[key]) {
      setFieldErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'name':
        return value.length < 2 ? 'Name must be at least 2 characters' : '';
      case 'age':
        const age = parseInt(value);
        return isNaN(age) || age < 1 || age > 120 ? 'Please enter a valid age' : '';
      case 'phone':
        return value.length > 0 && value.length < 10 ? 'Please enter a valid phone number' : '';
      case 'symptoms':
        return value.length < 10 ? 'Please provide more detailed symptoms' : '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    Object.keys(formData).forEach(key => {
      if (key !== 'emergencyContact') { // Optional field
        const error = validateField(key, formData[key as keyof typeof formData]);
        if (error) errors[key] = error;
      }
    });

    if (!formData.name) errors.name = 'Name is required';
    if (!formData.age) errors.age = 'Age is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.symptoms) errors.symptoms = 'Symptoms are required';
    if (!selectedDate) errors.date = 'Please select appointment date';
    if (!selectedTime) errors.time = 'Please select appointment time';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (date && event.type !== 'dismissed') {
      setTempDate(date);
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    if (time && event.type !== 'dismissed') {
      setTempTime(time);
    }
  };

  const confirmDateSelection = () => {
    setSelectedDate(tempDate);
    setShowDatePicker(false);
  };

  const confirmTimeSelection = () => {
    setSelectedTime(tempTime);
    setShowTimePicker(false);
  };

  const cancelDateSelection = () => {
    setTempDate(selectedDate || new Date());
    setShowDatePicker(false);
  };

  const cancelTimeSelection = () => {
    setTempTime(selectedTime || new Date());
    setShowTimePicker(false);
  };

  const openDatePicker = () => {
    setTempDate(selectedDate || new Date());
    setShowDatePicker(true);
  };

  const openTimePicker = () => {
    setTempTime(selectedTime || new Date());
    setShowTimePicker(true);
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

  // Generate available time slots based on doctor's timing
  const generateTimeSlots = () => {
    const timing = doctor.timing;
    if (timing === '24/7 Available') {
      // Generate 24-hour slots with 2-hour intervals
      const slots = [];
      for (let hour = 0; hour < 24; hour += 2) {
        const time = new Date();
        time.setHours(hour, 0, 0, 0);
        slots.push(time);
      }
      return slots;
    }

    // Parse timing like "10:00 AM - 4:00 PM"
    const [startStr, endStr] = timing.split(' - ');
    const startTime = parseTime(startStr);
    const endTime = parseTime(endStr);
    
    const slots = [];
    const current = new Date(startTime);
    
    while (current < endTime) {
      slots.push(new Date(current));
      current.setMinutes(current.getMinutes() + 30); // 30-minute slots
    }
    
    return slots;
  };

  const parseTime = (timeStr: string) => {
    const [time, period] = timeStr.trim().split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;
    
    date.setHours(hour24, minutes || 0, 0, 0);
    return date;
  };

  // Calendar helper functions
  const navigateMonth = (direction: number) => {
    const newDate = new Date(tempDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setTempDate(newDate);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const renderCalendarDays = () => {
    const days = getDaysInMonth(tempDate);
    const today = new Date();
    
    return days.map((day, index) => {
      const isCurrentMonth = day.getMonth() === tempDate.getMonth();
      const isSelected = selectedDate && isSameDay(day, tempDate);
      const isToday = isSameDay(day, today);
      const isDisabled = isDateDisabled(day);
      
      return (
        <TouchableOpacity
          key={index}
          style={[
            styles.calendarDay,
            !isCurrentMonth && styles.calendarDayInactive,
            isSelected && styles.calendarDaySelected,
            isToday && styles.calendarDayToday,
            isDisabled && styles.calendarDayDisabled,
          ]}
          onPress={() => {
            if (!isDisabled) {
              const newDate = new Date(day);
              setTempDate(newDate);
            }
          }}
          disabled={isDisabled}
        >
          <Text style={[
            styles.calendarDayText,
            !isCurrentMonth && styles.calendarDayTextInactive,
            isSelected && styles.calendarDayTextSelected,
            isToday && styles.calendarDayTextToday,
            isDisabled && styles.calendarDayTextDisabled,
          ]}>
            {day.getDate()}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  const handleSubmit = async () => {
    if (!validateForm() || !selectedDate || !selectedTime) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly');
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
    const requiredFields = ['name', 'age', 'gender', 'symptoms'];
    const allRequiredFieldsFilled = requiredFields.every(field => 
      formData[field as keyof typeof formData]?.trim() !== ''
    );
    const hasNoErrors = Object.keys(fieldErrors).length === 0;
    const dateTimeSelected = selectedDate && selectedTime;
    return allRequiredFieldsFilled && hasNoErrors && dateTimeSelected;
  };

  const handleGenderSelect = (gender: string) => {
    updateFormData('gender', gender);
    setShowGenderPicker(false);
  };

  const renderGenderPicker = () => (
    <Modal
      visible={showGenderPicker}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowGenderPicker(false)}
    >
      <Pressable 
        style={styles.pickerOverlay}
        onPress={() => setShowGenderPicker(false)}
      >
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Gender</Text>
            <TouchableOpacity 
              onPress={() => setShowGenderPicker(false)}
              style={styles.pickerCloseButton}
            >
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          {genderOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.pickerOption,
                formData.gender === option.value && styles.pickerOptionSelected
              ]}
              onPress={() => handleGenderSelect(option.value)}
            >
              <Ionicons 
                name={option.icon as any} 
                size={24} 
                color={formData.gender === option.value ? colors.primary : colors.textSecondary} 
              />
              <Text style={[
                styles.pickerOptionText,
                formData.gender === option.value && styles.pickerOptionTextSelected
              ]}>
                {option.label}
              </Text>
              {formData.gender === option.value && (
                <Ionicons name="checkmark" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <View style={styles.container} accessibilityLabel="Book Appointment Screen">
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <Header
        title="Book Appointment"
        showBack={true}
        onBackPress={handleBackPress}
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            {/* Enhanced Doctor Info Card */}
            <LinearGradient
              colors={['#ffffff', '#f8fafc']}
              style={styles.appointmentHeader}
            >
              <View style={styles.doctorInfoContainer}>
                <View style={styles.doctorAvatarContainer}>
                  <LinearGradient
                    colors={[colors.primary, colors.primaryLight]}
                    style={styles.doctorAvatar}
                  >
                    <Ionicons name="person" size={32} color="#ffffff" />
                  </LinearGradient>
                  <View style={styles.verificationBadge}>
                    <Ionicons name="checkmark" size={12} color="#ffffff" />
                  </View>
                </View>
                
                <View style={styles.doctorDetails}>
                  <View style={styles.doctorNameRow}>
                    <Text style={styles.doctorName}>Dr. {doctor.name}</Text>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#fbbf24" />
                      <Text style={styles.rating}>4.8</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.specialization}>{doctor.specialization}</Text>
                  <View style={styles.hospitalRow}>
                    <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.hospitalName}>{hospital.name}</Text>
                  </View>
                  
                  <View style={styles.doctorStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>500+</Text>
                      <Text style={styles.statLabel}>Patients</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>8</Text>
                      <Text style={styles.statLabel}>Years Exp</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              {doctor.consultationFee && (
                <View style={styles.feeCard}>
                  <LinearGradient
                    colors={[colors.primary, colors.primaryLight]}
                    style={styles.feeGradient}
                  >
                    <View style={styles.feeContent}>
                      <Ionicons name="card-outline" size={20} color="#ffffff" />
                      <View style={styles.feeText}>
                        <Text style={styles.feeLabel}>Consultation Fee</Text>
                        <Text style={styles.feeAmount}>₹{doctor.consultationFee}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              )}
            </LinearGradient>

            {/* Enhanced Form */}
            <View style={styles.form}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="person-outline" size={20} color={colors.primary} /> Patient Information
              </Text>
              
              {/* Full Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name *</Text>
                <View style={[styles.inputWrapper, fieldErrors.name && styles.inputError]}>
                  <Ionicons name="person-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(value) => updateFormData('name', value)}
                    placeholder="Enter patient name"
                    placeholderTextColor={colors.textLight}
                    accessible={true}
                    accessibilityLabel="Patient full name input"
                    accessibilityHint="Enter the full name of the patient"
                    autoCapitalize="words"
                    autoComplete="name"
                  />
                </View>
                {fieldErrors.name && <Text style={styles.errorText}>{fieldErrors.name}</Text>}
              </View>

              {/* Age and Gender Row */}
              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Age *</Text>
                  <View style={[styles.inputWrapper, fieldErrors.age && styles.inputError]}>
                    <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={formData.age}
                      onChangeText={(value) => updateFormData('age', value)}
                      placeholder="Age"
                      placeholderTextColor={colors.textLight}
                      keyboardType="numeric"
                      maxLength={3}
                      accessible={true}
                      accessibilityLabel="Patient age input"
                      accessibilityHint="Enter the age of the patient in years"
                    />
                  </View>
                  {fieldErrors.age && <Text style={styles.errorText}>{fieldErrors.age}</Text>}
                </View>
                
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Gender *</Text>
                  <TouchableOpacity 
                    style={[styles.inputWrapper, styles.selectInput, fieldErrors.gender && styles.inputError]}
                    onPress={() => setShowGenderPicker(true)}
                    accessible={true}
                    accessibilityLabel="Gender selection button"
                    accessibilityHint="Tap to select patient gender"
                    accessibilityRole="button"
                  >
                    <Ionicons 
                      name={
                        formData.gender === 'Male' ? 'man-outline' :
                        formData.gender === 'Female' ? 'woman-outline' : 'people-outline'
                      } 
                      size={18} 
                      color={colors.textSecondary} 
                      style={styles.inputIcon} 
                    />
                    <Text style={[
                      styles.input, 
                      styles.selectText,
                      !formData.gender && styles.placeholderText
                    ]}>
                      {formData.gender || 'Select Gender'}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                  {fieldErrors.gender && <Text style={styles.errorText}>{fieldErrors.gender}</Text>}
                </View>
              </View>

              {/* Phone Number Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={[styles.inputWrapper, fieldErrors.phone && styles.inputError]}>
                  <Ionicons name="call-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={formData.phone}
                    onChangeText={(value) => updateFormData('phone', value)}
                    placeholder="Enter phone number"
                    placeholderTextColor={colors.textLight}
                    keyboardType="phone-pad"
                    maxLength={15}
                  />
                </View>
                {fieldErrors.phone && <Text style={styles.errorText}>{fieldErrors.phone}</Text>}
              </View>

              <Text style={styles.sectionTitle}>
                <Ionicons name="calendar-outline" size={20} color={colors.primary} /> Appointment Details
              </Text>
              
              {/* Date and Time Row */}
              <View style={styles.dateTimeContainer}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Select Date *</Text>
                  <TouchableOpacity 
                    style={[styles.dateTimeButton, fieldErrors.date && styles.inputError]}
                    onPress={openDatePicker}
                    activeOpacity={0.7}
                  >
                    <View style={styles.dateTimeWrapper}>
                      <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                      <Text style={[styles.dateTimeText, !selectedDate && styles.placeholderText]}>
                        {selectedDate ? formatDate(selectedDate) : 'Select Date'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {fieldErrors.date && <Text style={styles.errorText}>{fieldErrors.date}</Text>}
                </View>
                
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Select Time *</Text>
                  <TouchableOpacity 
                    style={[styles.dateTimeButton, fieldErrors.time && styles.inputError]}
                    onPress={openTimePicker}
                    activeOpacity={0.7}
                  >
                    <View style={styles.dateTimeWrapper}>
                      <Ionicons name="time-outline" size={20} color={colors.primary} />
                      <Text style={[styles.dateTimeText, !selectedTime && styles.placeholderText]}>
                        {selectedTime ? formatTime(selectedTime) : 'Select Time'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {fieldErrors.time && <Text style={styles.errorText}>{fieldErrors.time}</Text>}
                </View>
              </View>

              {/* Symptoms Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Symptoms / Reason for Visit *</Text>
                <View style={[styles.inputWrapper, styles.textAreaWrapper, fieldErrors.symptoms && styles.inputError]}>
                  <Ionicons name="medical-outline" size={18} color={colors.textSecondary} style={styles.inputIconTop} />
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.symptoms}
                    onChangeText={(value) => updateFormData('symptoms', value)}
                    placeholder="Describe your symptoms or reason for consultation in detail"
                    placeholderTextColor={colors.textLight}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    accessible={true}
                    accessibilityLabel="Symptoms description input"
                    accessibilityHint="Describe your symptoms or reason for the medical consultation"
                  />
                </View>
                {fieldErrors.symptoms && <Text style={styles.errorText}>{fieldErrors.symptoms}</Text>}
              </View>

              {/* Timing Info */}
              <View style={styles.timingCard}>
                <LinearGradient
                  colors={[colors.secondaryLight + '20', colors.secondary + '20']}
                  style={styles.timingGradient}
                >
                  <View style={styles.timingHeader}>
                    <Ionicons name="time-outline" size={20} color={colors.secondary} />
                    <Text style={styles.timingTitle}>Available Hours</Text>
                  </View>
                  <Text style={styles.timingText}>
                    Dr. {doctor.name} is available from {doctor.timing}
                  </Text>
                </LinearGradient>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !isFormValid() && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={!isFormValid() || loading}
                accessible={true}
                accessibilityLabel={loading ? "Booking appointment" : "Book appointment button"}
                accessibilityHint="Tap to submit your appointment booking request"
                accessibilityRole="button"
              >
                <LinearGradient
                  colors={
                    !isFormValid() 
                      ? [colors.textLight, colors.backgroundGray]
                      : [colors.primary, colors.primaryLight]
                  }
                  style={styles.submitGradient}
                >
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <Animated.View
                        style={{
                          transform: [{
                            rotate: fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0deg', '360deg']
                            })
                          }]
                        }}
                      >
                        <Ionicons name="sync" size={20} color="#ffffff" />
                      </Animated.View>
                      <Text style={styles.submitText}>Booking...</Text>
                    </View>
                  ) : (
                    <View style={styles.submitContent}>
                      <Ionicons name="calendar-outline" size={20} color="#ffffff" />
                      <Text style={styles.submitText}>Book Appointment</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.pickerOverlay}>
          <View style={styles.datePickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Date</Text>
              <TouchableOpacity 
                onPress={cancelDateSelection}
                style={styles.pickerCloseButton}
              >
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            {/* Custom Calendar Component */}
            <View style={styles.calendarContainer}>
              {/* Calendar Header with Month/Year Navigation */}
              <View style={styles.calendarHeader}>
                <TouchableOpacity 
                  onPress={() => navigateMonth(-1)}
                  style={styles.monthNavButton}
                >
                  <Ionicons name="chevron-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                
                <Text style={styles.monthYearText}>
                  {tempDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Text>
                
                <TouchableOpacity 
                  onPress={() => navigateMonth(1)}
                  style={styles.monthNavButton}
                >
                  <Ionicons name="chevron-forward" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Days of Week Header */}
              <View style={styles.weekDaysHeader}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <Text key={day} style={styles.weekDayText}>
                    {day}
                  </Text>
                ))}
              </View>

              {/* Calendar Grid */}
              <View style={styles.calendarGrid}>
                {renderCalendarDays()}
              </View>
            </View>
            
            <View style={styles.pickerActions}>
              <TouchableOpacity 
                style={styles.pickerCancelButton}
                onPress={cancelDateSelection}
              >
                <Text style={styles.pickerCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.pickerConfirmButton}
                onPress={confirmDateSelection}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryLight]}
                  style={styles.pickerConfirmGradient}
                >
                  <Text style={styles.pickerConfirmText}>Confirm</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.pickerOverlay}>
          <View style={styles.timePickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Time</Text>
              <TouchableOpacity 
                onPress={cancelTimeSelection}
                style={styles.pickerCloseButton}
              >
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            {/* Doctor's Available Hours Info */}
            <View style={styles.timingInfo}>
              <Ionicons name="time-outline" size={16} color={colors.secondary} />
              <Text style={styles.timingInfoText}>
                Available: {doctor.timing}
              </Text>
            </View>

            {/* Available Time Slots */}
            <ScrollView style={styles.timeSlotsScrollContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.timeSlotsGrid}>
                {generateTimeSlots().map((slot, index) => {
                  const isSelected = tempTime && 
                    slot.getHours() === tempTime.getHours() && 
                    slot.getMinutes() === tempTime.getMinutes();
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timeSlotButton,
                        isSelected && styles.timeSlotButtonSelected
                      ]}
                      onPress={() => setTempTime(new Date(slot))}
                    >
                      <Text style={[
                        styles.timeSlotButtonText,
                        isSelected && styles.timeSlotButtonTextSelected
                      ]}>
                        {formatTime(slot)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>            <View style={styles.pickerActions}>
              <TouchableOpacity 
                style={styles.pickerCancelButton}
                onPress={cancelTimeSelection}
              >
                <Text style={styles.pickerCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.pickerConfirmButton}
                onPress={confirmTimeSelection}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryLight]}
                  style={styles.pickerConfirmGradient}
                >
                  <Text style={styles.pickerConfirmText}>Confirm</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Gender Picker Modal */}
      {renderGenderPicker()}

      {/* Enhanced Booking Confirmation Modal */}
      <Modal
        visible={showConfirmationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseConfirmation}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContainer,
              {
                transform: [{
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  })
                }],
                opacity: fadeAnim,
              }
            ]}
          >
            {/* Success Header */}
            <LinearGradient
              colors={[colors.secondary, colors.secondaryDark]}
              style={styles.modalHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleCloseConfirmation}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={24} color="rgba(255,255,255,0.9)" />
              </TouchableOpacity>

              <Animated.View 
                style={[
                  styles.successIconContainer,
                  {
                    transform: [{
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      })
                    }]
                  }
                ]}
              >
                <View style={styles.successIconBackground}>
                  <Ionicons name="checkmark" size={40} color={colors.secondary} />
                </View>
              </Animated.View>
              
              <Text style={styles.modalTitle}>Appointment Confirmed!</Text>
              <Text style={styles.modalSubtitle}>
                Your booking request has been submitted successfully
              </Text>
            </LinearGradient>

            <ScrollView style={styles.modalScrollContent} showsVerticalScrollIndicator={false}>
              {confirmedBooking && (
                <View style={styles.modalContent}>
                  {/* Booking Reference */}
                  <View style={styles.referenceSection}>
                    <View style={styles.referenceCard}>
                      <LinearGradient
                        colors={[colors.primaryLight + '20', colors.primary + '10']}
                        style={styles.referenceGradient}
                      >
                        <View style={styles.referenceHeader}>
                          <Ionicons name="receipt-outline" size={24} color={colors.primary} />
                          <Text style={styles.referenceTitle}>Booking Reference</Text>
                        </View>
                        <Text style={styles.referenceId}>#APT{confirmedBooking.id}</Text>
                      </LinearGradient>
                    </View>
                  </View>

                  {/* Patient Information Card */}
                  <View style={styles.infoCard}>
                    <View style={styles.cardHeader}>
                      <View style={styles.cardHeaderIcon}>
                        <Ionicons name="person-outline" size={20} color={colors.primary} />
                      </View>
                      <Text style={styles.cardTitle}>Patient Details</Text>
                    </View>
                    <View style={styles.cardContent}>
                      <View style={styles.infoGrid}>
                        <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Name</Text>
                          <Text style={styles.infoValue}>{confirmedBooking.patientName}</Text>
                        </View>
                        <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Age</Text>
                          <Text style={styles.infoValue}>{confirmedBooking.patientAge} years</Text>
                        </View>
                        <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Gender</Text>
                          <Text style={styles.infoValue}>{confirmedBooking.patientGender}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Appointment Information Card */}
                  <View style={styles.infoCard}>
                    <View style={styles.cardHeader}>
                      <View style={[styles.cardHeaderIcon, { backgroundColor: colors.secondary + '20' }]}>
                        <Ionicons name="calendar-outline" size={20} color={colors.secondary} />
                      </View>
                      <Text style={styles.cardTitle}>Appointment Details</Text>
                    </View>
                    <View style={styles.cardContent}>
                      <View style={styles.appointmentDetails}>
                        <View style={styles.doctorSummary}>
                          <View style={styles.doctorAvatarSmall}>
                            <Ionicons name="person" size={20} color="#ffffff" />
                          </View>
                          <View style={styles.doctorInfoSmall}>
                            <Text style={styles.doctorNameSmall}>Dr. {confirmedBooking.doctorName}</Text>
                            <Text style={styles.hospitalNameSmall}>{confirmedBooking.hospitalName}</Text>
                          </View>
                        </View>
                        
                        <View style={styles.appointmentMeta}>
                          <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                              <Ionicons name="calendar" size={16} color={colors.secondary} />
                              <Text style={styles.metaText}>{confirmedBooking.date ? formatDate(new Date(confirmedBooking.date)) : 'Date TBD'}</Text>
                            </View>
                            <View style={styles.metaItem}>
                              <Ionicons name="time" size={16} color={colors.secondary} />
                              <Text style={styles.metaText}>{confirmedBooking.time}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Status Card */}
                  <View style={styles.statusCard}>
                    <LinearGradient
                      colors={[colors.warningLight + '30', colors.warning + '20']}
                      style={styles.statusGradient}
                    >
                      <View style={styles.statusHeader}>
                        <View style={styles.statusIcon}>
                          <Ionicons name="hourglass-outline" size={20} color={colors.warning} />
                        </View>
                        <Text style={styles.statusTitle}>Pending Confirmation</Text>
                      </View>
                      <Text style={styles.statusDescription}>
                        The hospital will contact you within 2-4 hours to confirm your appointment time.
                      </Text>
                    </LinearGradient>
                  </View>

                  {/* Next Steps */}
                  <View style={styles.nextStepsCard}>
                    <Text style={styles.nextStepsTitle}>What happens next?</Text>
                    <View style={styles.stepsList}>
                      {[
                        { icon: 'call-outline', text: 'Hospital will call to confirm', time: '2-4 hours' },
                        { icon: 'calendar-outline', text: 'Attend your appointment', time: confirmedBooking.date ? formatDate(new Date(confirmedBooking.date)) : 'Date TBD' },
                        { icon: 'card-outline', text: 'Make payment at clinic', time: `₹${doctor.consultationFee || 500}` },
                      ].map((step, index) => (
                        <View key={index} style={styles.stepItem}>
                          <View style={styles.stepIconContainer}>
                            <Ionicons name={step.icon as any} size={16} color={colors.primary} />
                          </View>
                          <View style={styles.stepContent}>
                            <Text style={styles.stepText}>{step.text}</Text>
                            <Text style={styles.stepTime}>{step.time}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.secondaryActionButton}
                onPress={handleCloseConfirmation}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryActionText}>Done</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.primaryActionButton}
                onPress={handleViewBookings}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryLight]}
                  style={styles.primaryActionGradient}
                >
                  <Ionicons name="list-outline" size={18} color="#ffffff" />
                  <Text style={styles.primaryActionText}>View Bookings</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
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
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: spacing.xl + 20,
  },
  
  // Progress Bar Styles
  progressContainer: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '30',
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.backgroundGray,
    borderRadius: 2,
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressTextComplete: {
    color: colors.secondary,
    fontWeight: '700',
  },

  // Enhanced Appointment Header
  appointmentHeader: {
    margin: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  doctorInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  doctorAvatarContainer: {
    position: 'relative',
    marginRight: spacing.lg,
  },
  doctorAvatar: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  verificationBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  doctorName: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  rating: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.warning,
    marginLeft: spacing.xs,
  },
  specialization: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  hospitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  hospitalName: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  doctorStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  feeCard: {
    marginTop: spacing.md,
  },
  feeGradient: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  feeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeText: {
    marginLeft: spacing.md,
  },
  feeLabel: {
    fontSize: fontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  feeAmount: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: '#ffffff',
  },

  // Form Styles
  form: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  inputIconTop: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    padding: 0,
  },
  selectInput: {
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  placeholderText: {
    color: colors.textLight,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    marginTop: 0,
  },
  errorText: {
    fontSize: fontSize.xs,
    color: colors.error,
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
    fontWeight: '500',
  },

  // Date/Time Picker Styles
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeButton: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateTimeText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },

  // Timing Card
  timingCard: {
    marginBottom: spacing.xl,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  timingGradient: {
    padding: spacing.lg,
  },
  timingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  timingTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.secondary,
    marginLeft: spacing.sm,
  },
  timingText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: fontSize.sm * 1.4,
  },

  // Submit Button
  submitButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    marginTop: spacing.md,
  },
  submitButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  submitGradient: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  submitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: spacing.sm,
  },

  // Gender Picker Modal
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  pickerContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    width: '80%',
    maxWidth: 320,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pickerCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '30',
  },
  pickerOptionSelected: {
    backgroundColor: colors.primaryLight + '10',
  },
  pickerOptionText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: '500',
    marginLeft: spacing.md,
    flex: 1,
  },
  pickerOptionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },

  // Date/Time Picker Modal Styles
  datePickerContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    width: '85%',
    maxWidth: 360,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  timePickerContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    width: '85%',
    maxWidth: 360,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  
  // Time Slots Styles
  timingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: colors.secondaryLight + '20',
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  timingInfoText: {
    fontSize: fontSize.sm,
    color: colors.secondary,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  timeSlotsScrollContainer: {
    maxHeight: 300,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  timeSlotButton: {
    width: '30%',
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSlotButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeSlotButtonText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  timeSlotButtonTextSelected: {
    color: colors.background,
    fontWeight: '600',
  },
  dateTimePickerStyle: {
    backgroundColor: colors.background,
    marginVertical: spacing.lg,
  },

  // Calendar Styles
  calendarContainer: {
    backgroundColor: colors.background,
    marginVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.md,
  },
  monthNavButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.backgroundSecondary,
  },
  monthYearText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    paddingVertical: spacing.sm,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.sm,
    marginVertical: 2,
  },
  calendarDayInactive: {
    opacity: 0.3,
  },
  calendarDaySelected: {
    backgroundColor: colors.primary,
  },
  calendarDayToday: {
    backgroundColor: colors.primaryLight,
  },
  calendarDayDisabled: {
    opacity: 0.2,
  },
  calendarDayText: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  calendarDayTextInactive: {
    color: colors.textSecondary,
  },
  calendarDayTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  calendarDayTextToday: {
    color: colors.primary,
    fontWeight: '700',
  },
  calendarDayTextDisabled: {
    color: colors.textLight,
  },
  pickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border + '40',
    gap: spacing.md,
  },
  pickerCancelButton: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerCancelText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  pickerConfirmButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  pickerConfirmGradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  pickerConfirmText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: '#ffffff',
  },

  // Update date time button styles
  dateTimeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // Enhanced Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    width: '95%',
    maxWidth: 400,
    maxHeight: screenHeight * 0.85,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl + 8,
    paddingHorizontal: spacing.xl,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  successIconContainer: {
    marginBottom: spacing.lg,
  },
  successIconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.secondary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: fontSize.xl + 2,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: fontSize.md,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  modalScrollContent: {
    maxHeight: screenHeight * 0.5,
  },
  modalContent: {
    padding: spacing.lg,
  },

  // Reference Section
  referenceSection: {
    marginBottom: spacing.lg,
  },
  referenceCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  referenceGradient: {
    padding: spacing.lg,
  },
  referenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  referenceTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  referenceId: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    letterSpacing: 1,
  },

  // Info Cards
  infoCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '40',
  },
  cardHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardContent: {
    padding: spacing.lg,
  },
  infoGrid: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },

  // Appointment Details
  appointmentDetails: {
    gap: spacing.lg,
  },
  doctorSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  doctorAvatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  doctorInfoSmall: {
    flex: 1,
  },
  doctorNameSmall: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  hospitalNameSmall: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  appointmentMeta: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },

  // Status Card
  statusCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  statusGradient: {
    padding: spacing.lg,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  statusTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.warning,
  },
  statusDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * 1.5,
    fontWeight: '500',
  },

  // Next Steps Card
  nextStepsCard: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  nextStepsTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  stepsList: {
    gap: spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  stepTime: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Modal Actions
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border + '40',
    backgroundColor: colors.backgroundSecondary,
  },
  secondaryActionButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryActionText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  primaryActionButton: {
    flex: 1.5,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  primaryActionText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: '#ffffff',
  },

  // Quick Time Selection Styles
  quickTimeSelection: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  quickTimeTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  quickTimeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: spacing.sm,
  },
  quickTimeButton: {
    backgroundColor: colors.backgroundTertiary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickTimeButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.textPrimary,
    textAlign: 'center',
  },
});