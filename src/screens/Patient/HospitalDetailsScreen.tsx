import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../utils/colors';
import { Header } from '../../components/Header';
import { DoctorCard } from '../../components/DoctorCard';
import { Hospital } from '../../data/hospitals';
import { doctors, Doctor } from '../../data/doctors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface HospitalDetailsScreenProps {
  navigation: any;
  route: {
    params: {
      hospital: Hospital;
    };
  };
}

export const HospitalDetailsScreen: React.FC<HospitalDetailsScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { hospital } = route.params;
  const [hospitalDoctors, setHospitalDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    // Filter doctors by hospital ID
    const filteredDoctors = doctors.filter(doctor => doctor.hospitalId === hospital.id);
    setHospitalDoctors(filteredDoctors);
  }, [hospital.id]);

  const handleBookAppointment = (doctor: Doctor) => {
    try {
      console.log('Navigating to BookAppointment with:', { hospital: hospital.name, doctor: doctor.name });
      navigation.navigate('BookAppointment', { hospital, doctor });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        title={hospital.name}
        showBack={true}
        onBackPress={handleBackPress}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {hospital.image ? (
            <Image 
              source={{ uri: hospital.image }} 
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroPlaceholder}
            >
              <View style={styles.heroPatternContainer}>
                <View style={styles.heroCircle1} />
                <View style={styles.heroCircle2} />
                <View style={styles.heroCircle3} />
              </View>
              <Ionicons name="medical" size={80} color="rgba(255,255,255,0.9)" />
            </LinearGradient>
          )}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.heroOverlay}
          >
            <Text style={styles.hospitalName}>{hospital.name}</Text>
            <Text style={styles.specialization}>{hospital.specialization}</Text>
          </LinearGradient>
        </View>

        {/* Quick Info Cards */}
        <View style={styles.quickInfoSection}>
          <LinearGradient
            colors={['#3B82F6', '#60A5FA']}
            style={styles.gradientInfoCard}
          >
            <View style={styles.infoIconContainer}>
              <Ionicons name="location" size={24} color="#fff" />
            </View>
            <Text style={styles.infoCardTitle}>Location</Text>
            <Text style={styles.infoCardText} numberOfLines={2}>{hospital.address}</Text>
          </LinearGradient>
          
          <LinearGradient
            colors={['#a8edea', '#fed6e3']}
            style={styles.gradientInfoCard}
          >
            <View style={styles.infoIconContainer}>
              <Ionicons name="star" size={24} color="#333" />
            </View>
            <Text style={[styles.infoCardTitle, { color: '#555' }]}>Rating</Text>
            <Text style={[styles.infoCardText, { color: '#333' }]}>{hospital.rating}/5.0</Text>
          </LinearGradient>
          
          <LinearGradient
            colors={['#ffecd2', '#fcb69f']}
            style={styles.gradientInfoCard}
          >
            <View style={styles.infoIconContainer}>
              <Ionicons name="people" size={24} color="#333" />
            </View>
            <Text style={[styles.infoCardTitle, { color: '#555' }]}>Rating</Text>
            <Text style={[styles.infoCardText, { color: '#333' }]}>{hospital.visitorsCount?.toLocaleString() || 'N/A'}</Text>
          </LinearGradient>
        </View>

        {hospital.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About Hospital</Text>
            <Text style={styles.description}>{hospital.description}</Text>
          </View>
        )}

        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="medical-outline" size={20} color={colors.primary} style={styles.sectionIcon} />
            Specialized Services
          </Text>
          <View style={styles.servicesGrid}>
            {hospital.specialization.split(', ').map((service, index) => (
              <LinearGradient
                key={index}
                colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)']}
                style={styles.serviceChip}
              >
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text style={styles.serviceText}>{service.trim()}</Text>
              </LinearGradient>
            ))}
          </View>
        </View>

        {/* Facilities Section */}
        <View style={styles.facilitiesSection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="business-outline" size={20} color={colors.primary} style={styles.sectionIcon} />
            Hospital Facilities
          </Text>
          <View style={styles.facilitiesGrid}>
            <View style={styles.facilityItem}>
              <Ionicons name="car" size={20} color={colors.primary} />
              <Text style={styles.facilityText}>Parking</Text>
            </View>
            <View style={styles.facilityItem}>
              <Ionicons name="wifi" size={20} color={colors.primary} />
              <Text style={styles.facilityText}>Free WiFi</Text>
            </View>
            <View style={styles.facilityItem}>
              <Ionicons name="restaurant" size={20} color={colors.primary} />
              <Text style={styles.facilityText}>Cafeteria</Text>
            </View>
            <View style={styles.facilityItem}>
              <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
              <Text style={styles.facilityText}>Emergency</Text>
            </View>
          </View>
        </View>

        <View style={styles.doctorsSection}>
          <View style={styles.doctorsHeader}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="people-outline" size={20} color={colors.primary} style={styles.sectionIcon} />
              Our Medical Team
            </Text>
            <Text style={styles.doctorsCount}>{hospitalDoctors.length} Doctors Available</Text>
          </View>
          
          {hospitalDoctors.length > 0 ? (
            hospitalDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onPress={handleBookAppointment}
                showBookButton={true}
              />
            ))
          ) : (
            <View style={styles.noDoctorsContainer}>
              <Ionicons name="medical-outline" size={48} color={colors.textLight} />
              <Text style={styles.noDoctorsText}>No doctors available</Text>
              <Text style={styles.noDoctorsSubtext}>Please check back later</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  heroSection: {
    position: 'relative',
    height: 320,
    overflow: 'hidden',
  },
  heroPatternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  heroCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.2)',
    top: -50,
    right: -50,
  },
  heroCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.15)',
    bottom: -30,
    left: -30,
  },
  heroCircle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: 100,
    left: 80,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  hospitalName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  specialization: {
    fontSize: fontSize.lg,
    color: '#E2E8F0',
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  content: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: spacing.lg,
    marginTop: -30,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  address: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    lineHeight: 22,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  actionButtonSecondary: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    color: colors.textPrimary,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  descriptionText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  facilityText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  doctorsContainer: {
    gap: spacing.md,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  doctorSpecialty: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  doctorRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingTextSmall: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  contactCard: {
    backgroundColor: '#F0F9FF',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  contactText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    marginLeft: spacing.md,
    fontWeight: '500',
  },
  emergencyBadge: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  emergencyText: {
    color: '#DC2626',
    fontSize: fontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
    elevation: 3,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover' as 'cover',
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 30,
  },

  quickInfoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -40,
    marginHorizontal: 16,
    gap: 12,
    zIndex: 10,
  },
  gradientInfoCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minHeight: 100,
  },
  infoIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  infoCardTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCardText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  descriptionSection: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    margin: spacing.md,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sectionIcon: {
    marginRight: 8,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
  },
  serviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    margin: 4,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  facilitiesSection: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    margin: spacing.md,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  doctorsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  doctorsCount: {
    fontSize: 14,
    color: colors.textTertiary,
    fontWeight: '500',
  },

  description: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  servicesSection: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    margin: spacing.md,
    marginTop: spacing.md,
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
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  servicesList: {
    marginTop: spacing.sm,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  serviceText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    fontWeight: '500',
  },
  doctorsSection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  noDoctorsContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    margin: spacing.md,
  },
  noDoctorsText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textSecondary,
    marginVertical: spacing.md,
  },
  noDoctorsSubtext: {
    fontSize: fontSize.md,
    color: colors.textLight,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});