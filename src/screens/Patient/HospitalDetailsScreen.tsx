import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../utils/colors';
import { Header } from '../../components/Header';
import { DoctorCard } from '../../components/DoctorCard';
import { Hospital } from '../../data/hospitals';
import { doctors, Doctor } from '../../data/doctors';
import { Ionicons } from '@expo/vector-icons';

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
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hospitalHeader}>
          <View style={styles.hospitalImageContainer}>
            {hospital.image ? (
              <Image 
                source={{ uri: hospital.image }} 
                style={styles.hospitalImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.hospitalIcon}>
                <Ionicons name="medical" size={32} color={colors.primary} />
              </View>
            )}
          </View>
          
          <View style={styles.hospitalInfo}>
            <Text style={styles.hospitalName}>{hospital.name}</Text>
            <Text style={styles.specialization}>{hospital.specialization}</Text>
            
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.address}>{hospital.address}</Text>
            </View>
            
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={colors.warning} />
              <Text style={styles.rating}>{hospital.rating} Rating</Text>
            </View>
          </View>
        </View>

        {hospital.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About Hospital</Text>
            <Text style={styles.description}>{hospital.description}</Text>
          </View>
        )}

        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.servicesList}>
            {hospital.specialization.split(', ').map((service, index) => (
              <View key={index} style={styles.serviceItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={styles.serviceText}>{service.trim()}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.doctorsSection}>
          <Text style={styles.sectionTitle}>Available Doctors ({hospitalDoctors.length})</Text>
          
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
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  hospitalHeader: {
    backgroundColor: colors.card,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hospitalImageContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginRight: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hospitalImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.lg,
  },
  hospitalIcon: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  hospitalInfo: {
    flex: 1,
  },
  hospitalName: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  specialization: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  address: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  descriptionSection: {
    backgroundColor: colors.card,
    margin: spacing.md,
    marginTop: 0,
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
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  servicesSection: {
    backgroundColor: colors.card,
    margin: spacing.md,
    marginTop: 0,
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