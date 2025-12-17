import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Platform, Linking, Alert, Dimensions } from 'react-native';
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

const { width: screenWidth } = Dimensions.get('window');

export const HospitalDetailsScreen: React.FC<HospitalDetailsScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { hospital } = route.params;
  const [hospitalDoctors, setHospitalDoctors] = useState<Doctor[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0);

  useEffect(() => {
    // Filter doctors by hospital ID
    const filteredDoctors = doctors.filter(doctor => doctor.hospitalId === hospital.id);
    setHospitalDoctors(filteredDoctors);
  }, [hospital.id]);

  const handleBookAppointment = (doctor: Doctor) => {
    try {
      navigation.navigate('BookAppointment', { hospital, doctor });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleNextImage = () => {
    if (hospital.images && hospital.images.length > 0) {
      let nextIndex = (currentImageIndex + 1) % hospital.images.length;
      // Skip PNG images
      while (nextIndex !== currentImageIndex && isPngImage(hospital.images[nextIndex])) {
        nextIndex = (nextIndex + 1) % hospital.images.length;
      }
      setCurrentImageIndex(nextIndex);
    }
  };

  const handlePrevImage = () => {
    if (hospital.images && hospital.images.length > 0) {
      let prevIndex = currentImageIndex === 0 ? hospital.images.length - 1 : currentImageIndex - 1;
      // Skip PNG images
      const startIndex = prevIndex;
      while (isPngImage(hospital.images[prevIndex]) && prevIndex !== startIndex) {
        prevIndex = prevIndex === 0 ? hospital.images.length - 1 : prevIndex - 1;
      }
      setCurrentImageIndex(prevIndex);
    }
  };

  const isPngImage = (imageSource: any): boolean => {
    if (typeof imageSource === 'string') {
      return imageSource.toLowerCase().endsWith('.png');
    }
    if (imageSource && typeof imageSource === 'object') {
      const uri = imageSource.uri || '';
      return uri.toLowerCase().includes('.png');
    }
    return false;
  };

  const handleDirections = () => {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(hospital.address)}`;
    Linking.openURL(url).catch(err => Alert.alert('Error', 'Could not open maps'));
  };

  const handleCall = () => {
    Linking.openURL(`tel:+919876543210`).catch(err => Alert.alert('Error', 'Could not make call'));
  };

  return (
    <View style={styles.container}>
      <Header
        title={hospital.name}
        showBack={true}
        onBackPress={handleBackPress}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* TWO COLUMN LAYOUT: Details on Left, Images on Right */}
        <View style={styles.mainWrapper}>
          
          {/* LEFT COLUMN: DETAILS */}
          <ScrollView style={styles.leftColumn} showsVerticalScrollIndicator={false}>
            
            {/* SECTION 1: Hospital Info (Name, Specialization, Address, Buttons) */}
            <View style={styles.infoSection}>
              <View style={styles.hospitalHeader}>
                <View>
                  <Text style={styles.hospitalTitle}>{hospital.name}</Text>
                  <Text style={styles.specialization}>{hospital.specialization}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={18} color="#FFC107" />
                  <Text style={styles.ratingText}>{hospital.rating}</Text>
                </View>
              </View>

              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={18} color={colors.primary} />
                <Text style={styles.addressText} numberOfLines={3}>{hospital.address}</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity 
                  style={styles.directionButton}
                  onPress={handleDirections}
                >
                  <Ionicons name="navigate" size={20} color="#fff" />
                  <Text style={styles.directionButtonText}>Directions</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.callButton}
                  onPress={handleCall}
                >
                  <Ionicons name="call" size={20} color={colors.primary} />
                  <Text style={styles.callButtonText}>Call</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* SECTION 2: Consultation Timing & Fee Section */}
            <View style={styles.consultationSection}>
              <View style={styles.consultationTimingRow}>
                <View style={styles.consultationTimeCard}>
                  <Text style={styles.consultationTime}>9:00 - 10:00 AM</Text>
                  <Text style={styles.consultationLabel}>Timing</Text>
                </View>
                <View style={styles.consultationFeeCard}>
                  <Text style={styles.consultationCostLabel}>Consultation Fee</Text>
                  <Text style={styles.consultationCost}>₹999</Text>
                </View>
              </View>
              <View style={styles.consultationMoreRow}>
                <View style={styles.consultationMoreCard}>
                  <Text style={styles.consultationTime}>4:00 - 12:00 PM</Text>
                  <Text style={styles.hospitalName}>CALT Hospital</Text>
                </View>
                <View style={styles.consultationFeeCard}>
                  <Text style={styles.consultationCostLabel}>Consultation Fee</Text>
                  <Text style={styles.consultationCost}>₹750</Text>
                </View>
              </View>
            </View>

            {/* SECTION 3: About Our Hospital */}
            {hospital.description && (
              <View style={styles.aboutSection}>
                <Text style={styles.sectionTitle}>About Our Hospital</Text>
                <Text style={styles.aboutText}>{hospital.description}</Text>
                <TouchableOpacity style={styles.viewMoreButton}>
                  <Text style={styles.viewMoreText}>View more for big 5 chain hospitals</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}

            {/* SECTION 4: Hospital Departments */}
            <View style={styles.departmentsSection}>
              <Text style={styles.sectionTitle}>Hospital Departments</Text>
              
              <View style={styles.departmentsList}>
                {hospital.specialization.split(',').map((dept, index) => (
                  <View key={index} style={styles.departmentItem}>
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.departmentIcon}
                    >
                      <Ionicons name="medical-outline" size={18} color="#fff" />
                    </LinearGradient>
                    <Text style={styles.departmentName}>{dept.trim()}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* SECTION 5: Our Doctors */}
            <View style={styles.doctorsSection}>
              <Text style={styles.sectionTitle}>Our Doctors</Text>
              
              {hospitalDoctors.length > 0 ? (
                <View style={styles.doctorsList}>
                  {hospitalDoctors.map((doctor, doctorIndex) => (
                    <View key={doctor.id} style={styles.doctorCardWrapper}>
                      <View style={styles.doctorCardContent}>
                        {/* Doctor Photo */}
                        <View style={styles.doctorPhoto}>
                          <Ionicons name="person-circle" size={80} color={colors.primary} />
                        </View>

                        {/* Doctor Info */}
                        <View style={styles.doctorInfoSection}>
                          <Text style={styles.doctorName}>{doctor.name}</Text>
                          <Text style={styles.doctorSpecialty}>{doctor.specialization}</Text>
                          
                          <View style={styles.doctorExperienceRow}>
                            <Ionicons name="briefcase-outline" size={14} color={colors.primary} />
                            <Text style={styles.doctorExperienceText}>
                              {doctor.experience}
                            </Text>
                          </View>

                          <View style={styles.consultationRow}>
                            <Text style={styles.consultationLabelSmall}>Consultation Fee:</Text>
                            <Text style={styles.consultationFeeSmall}>₹{doctor.consultationFee}</Text>
                          </View>
                        </View>

                        {/* Book Button */}
                        <TouchableOpacity 
                          style={styles.bookButton}
                          onPress={() => handleBookAppointment(doctor)}
                        >
                          <Text style={styles.bookButtonText}>Book</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Next Doctor Details Link */}
                      <TouchableOpacity style={styles.nextDoctorLink}>
                        <Text style={styles.nextDoctorLinkText}>Next Doctor Details</Text>
                        <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.noDoctorsContainer}>
                  <Ionicons name="medical-outline" size={48} color={colors.textLight} />
                  <Text style={styles.noDoctorsText}>No doctors available</Text>
                </View>
              )}
            </View>

            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* RIGHT COLUMN: IMAGES */}
          {hospital.images && hospital.images.length > 0 && (
            <View style={styles.rightColumn}>
              {/* Main Image Carousel */}
              <View style={styles.imageCarouselContainer}>
                <Image
                  source={hospital.images[currentImageIndex]}
                  style={styles.mainImage}
                  resizeMode="cover"
                />
                
                {/* Image Counter Badge */}
                <View style={styles.imageBadge}>
                  <Text style={styles.imageBadgeText}>
                    {currentImageIndex + 1} / {hospital.images.length}
                  </Text>
                </View>

                {/* Navigation Arrows */}
                {hospital.images.length > 1 && (
                  <>
                    <TouchableOpacity
                      style={[styles.navArrow, styles.navArrowLeft]}
                      onPress={handlePrevImage}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="chevron-back" size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.navArrow, styles.navArrowRight]}
                      onPress={handleNextImage}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="chevron-forward" size={28} color="#fff" />
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {/* Image Dots Indicator */}
              {hospital.images.length > 1 && (
                <View style={styles.dotsContainer}>
                  {hospital.images.map((_, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dot,
                        index === currentImageIndex && styles.dotActive
                      ]}
                      onPress={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </View>
              )}

              {/* Thumbnail Gallery */}
              <View style={styles.thumbnailGallerySection}>
                <Text style={styles.galleryTitle}>Image Gallery</Text>
                <View style={styles.thumbnailContainer}>
                  {hospital.images.slice(0, 3).map((image, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.thumbnailWrapper}
                      onPress={() => setCurrentImageIndex(index)}
                    >
                      <Image
                        source={image}
                        style={styles.thumbnail}
                        resizeMode="cover"
                      />
                      <Text style={styles.thumbnailLabel}>Image {index + 1}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },

  // ===== TWO COLUMN LAYOUT =====
  mainWrapper: {
    flexDirection: 'row',
    flex: 1,
  },
  leftColumn: {
    flex: 1.2,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  rightColumn: {
    flex: 0.8,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
    backgroundColor: '#fafafa',
    justifyContent: 'flex-start',
  },
  // ===== IMAGE CAROUSEL (RIGHT COLUMN) =====
  imageCarouselContainer: {
    position: 'relative',
    height: 320,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginBottom: 20,
    minHeight: 320,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  imageBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  navArrow: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -24 }],
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  navArrowLeft: {
    left: 16,
  },
  navArrowRight: {
    right: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },

  // ===== SECTION 1: HOSPITAL INFO =====
  infoSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  hospitalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  hospitalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 4,
  },
  specialization: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  addressText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
    lineHeight: 20,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  directionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
  },
  directionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  callButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  // ===== SECTION 2: CONSULTATION TIMING =====
  consultationSection: {
    backgroundColor: '#fff',
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  consultationTimingRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  consultationTimeCard: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  consultationTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  consultationLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  consultationFeeCard: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  consultationCostLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  consultationCost: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  consultationMoreRow: {
    flexDirection: 'row',
    gap: 12,
  },
  consultationMoreCard: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  hospitalName: {
    fontSize: 12,
    color: '#1f2937',
    fontWeight: '500',
    marginTop: 4,
  },

  // ===== SECTION 3: IMAGE GALLERY THUMBNAILS =====
  thumbnailGallerySection: {
    backgroundColor: '#fff',
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  galleryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  thumbnailWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  thumbnailLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },

  // ===== COMMON SECTION TITLE =====
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },

  // ===== SECTION 4: ABOUT HOSPITAL =====
  aboutSection: {
    backgroundColor: '#fff',
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  aboutText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 22,
    marginBottom: 16,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  viewMoreText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    flex: 1,
  },

  // ===== SECTION 5: DEPARTMENTS =====
  departmentsSection: {
    backgroundColor: '#fff',
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  departmentsList: {
    gap: 12,
  },
  departmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    gap: 12,
  },
  departmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  departmentName: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    flex: 1,
  },

  // ===== SECTION 6: DOCTORS =====
  doctorsSection: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginBottom: 0,
  },
  doctorsList: {
    gap: 16,
  },
  doctorCardWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  doctorCardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
    gap: 16,
  },
  doctorPhoto: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  doctorInfoSection: {
    flex: 1,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 8,
  },
  doctorExperienceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  doctorExperienceText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  consultationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  consultationLabelSmall: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  consultationFeeSmall: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  nextDoctorLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  nextDoctorLinkText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    flex: 1,
  },

  // No Doctors
  noDoctorsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 40,
    alignItems: 'center',
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  noDoctorsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginVertical: 12,
  },

  bottomSpacer: {
    height: 30,
  },
});