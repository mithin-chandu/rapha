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

  const getStarRating = (experience: string) => {
    const years = parseInt(experience);
    if (years < 3) return 2;
    if (years < 6) return 3;
    if (years < 10) return 4;
    return 5;
  };

  const getNumericRating = (experience: string) => {
    const years = parseInt(experience);
    if (years < 3) return 2.0;
    if (years < 6) return 3.5;
    if (years < 10) return 4.2;
    return 4.8;
  };

  return (
    <View style={styles.container}>
      <Header
        title={hospital.name}
        showBack={true}
        onBackPress={handleBackPress}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* TWO COLUMN LAYOUT: Details on Left, Images on Right (only for intro sections) */}
        <View style={styles.mainWrapper}>
          
          {/* LEFT COLUMN: DETAILS (pre-departments) */}
          <ScrollView style={styles.leftColumn} showsVerticalScrollIndicator={false}>
            
            {/* SECTION 1: Hospital Info (Name, Specialization, Address, Buttons) */}
            <View style={styles.infoSection}>
              <View style={styles.hospitalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hospitalTitle}>{hospital.name}</Text>
                  <View style={styles.specializationWithRating}>
                    <Text style={styles.specialization}>{hospital.specialization}</Text>
                    <View style={styles.starRatingContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name={star <= Math.round(hospital.rating) ? "star" : "star-outline"}
                          size={14}
                          color="#FFC107"
                        />
                      ))}
                      <Text style={styles.ratingNumber}>({hospital.rating})</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={18} color={colors.primary} />
                <Text style={styles.addressText} numberOfLines={3}>{hospital.address}</Text>
              </View>
            </View>

            {/* SECTION 1.5: Location Journey Indicator */}
            <View style={styles.journeySection}>
              <View style={styles.journeyRowWithButton}>
                <View style={styles.journeyStart}>
                  <View style={styles.journeyDot} />
                  <Text style={styles.journeyLabel}>Your Location</Text>
                </View>
                <View style={styles.journeyLine}>
                  <View style={styles.journeyDottedLine} />
                  <Text style={styles.journeyTime}>12 mins</Text>
                </View>
                <View style={styles.journeyEnd}>
                  <Ionicons name="location" size={24} color={colors.primary} />
                  <Text style={styles.journeyLabel}>{hospital.name}</Text>
                </View>
                
                {/* Directions Card Button */}
                <TouchableOpacity 
                  style={styles.directionsCardButton}
                  onPress={handleDirections}
                >
                  <Ionicons name="navigate" size={18} color={colors.primary} />
                  <Text style={styles.directionsCardText}>Directions</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* SECTION 2: Consultation Timing & Fee Section */}
            <View style={styles.consultationSection}>
              <View style={styles.consultationTimingRow}>
                <View style={styles.consultationTimeCard}>
                  <Text style={[styles.consultationLabel, { fontWeight: 'bold', color: '#000' }]}>Timing</Text>
                  <View style={{ flex: 1 }} />
                  <Text style={styles.consultationTime}>9:00 - 10:00 AM</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.consultationCallCard}
                  onPress={handleCall}
                >
                  <Ionicons name="call" size={24} color={colors.primary} />
                  <Text style={styles.consultationCallText}>Call</Text>
                </TouchableOpacity>
                
                <View style={styles.consultationFeeCard}>
                  <Text style={[styles.consultationCostLabel, { fontWeight: 'bold', color: '#000' }]}>Consultation Fee</Text>
                  <Text style={[styles.consultationCost, { fontWeight: 'bold', color: '#6b7280' }]}>₹999</Text>
                </View>
              </View>
            </View>
            {/* SECTION 3: Hospital Amenities */}
            <View style={styles.amenitiesSection}>
              <View style={styles.amenitiesGrid}>
                {/* Timing */}
                <View style={styles.amenityItem}>
                  <View style={styles.amenityIconBox}>
                    <Ionicons name="time-outline" size={18} color={colors.primary} />
                  </View>
                  <Text style={styles.amenityName}>Opening Hours</Text>
                 
                </View>

                {/* Parking */}
                <View style={styles.amenityItem}>
                  <View style={styles.amenityIconBox}>
                    <Ionicons name="car-outline" size={18} color={colors.primary} />
                  </View>
                  <Text style={styles.amenityName}>Parking</Text>
                  
                </View>

                {/* Accessibility */}
                <View style={styles.amenityItem}>
                  <View style={styles.amenityIconBox}>
                    <Text style={styles.amenityEmoji}>♿</Text>
                  </View>
                  <Text style={styles.amenityName}>wheelchair</Text>
                  
                </View>

                {/* Specialties */}
                <View style={styles.amenityItem}>
                  <View style={styles.amenityIconBox}>
                    <Ionicons name="medical" size={18} color={colors.primary} />
                  </View>
                  <Text style={styles.amenityCount}>
                    {Array.from(new Set(hospitalDoctors.map(d => d.specialization))).length}
                  </Text>
                  <Text style={styles.amenityName}>Specialties</Text>
                  
                </View>
              </View>
            </View>
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

                {/* Image Dots Indicator - Inside Carousel */}
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
              </View>

              {/* Thumbnail Gallery (all images, scrollable) */}
              <View style={styles.thumbnailGallerySection}>
                <Text style={styles.imageGalleryTitle}>Image Gallery</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.thumbnailScrollContent}
                >
                  {hospital.images.map((image, index) => (
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
                      {/* Removed label Text - previously showed "Image 1", "Image 2" etc */}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}
        </View>

        {/* POST-DEPARTMENTS: full-width sections */}
        <View style={styles.fullWidthContent}>
          {/* SECTION 3: About Our Hospital - Full Width */}
          {hospital.description && (
            <View style={styles.aboutSection}>
              <Text style={styles.sectionTitle}>About Our Hospital</Text>
              <Text style={styles.aboutText}>{hospital.description}</Text>
            </View>
          )}

          {/* SECTION 4: Hospital Departments - Main Card with Department-wise Doctors */}
          <View style={styles.departmentsMainCard}>
            <Text style={styles.sectionTitle}>Hospital Departments</Text>
            <Text style={styles.departmentSubtitle}>Our Doctors</Text>

            {/* Department-wise Doctors */}
            {hospitalDoctors.length > 0 ? (
              <View style={styles.departmentWiseDoctorsList}>
                {/* Group doctors by specialization/department */}
                {Array.from(
                  new Set(hospitalDoctors.map(d => d.specialization))
                ).map((department, deptIndex) => {
                  const deptDoctors = hospitalDoctors.filter(d => d.specialization === department);
                  
                  return (
                    <View key={deptIndex} style={styles.departmentGroup}>
                      {/* Department Header with Doctor Count */}
                      <View style={styles.departmentGroupHeader}>
                        <View style={[styles.departmentGroupIcon, { backgroundColor: '#E0E7FF' }]}>
                          <Ionicons name="medical-outline" size={18} color="#4F46E5" />
                        </View>
                        <Text style={styles.departmentGroupTitle}>{department}</Text>
                      </View>

                      {/* Doctors in this department */}
                      {deptDoctors.map((doctor, doctorIndex) => (
                        <View key={doctor.id} style={styles.doctorItemContainer}>
                          {/* Top Row: Photo + Details + Book Button */}
                          <View style={styles.doctorTopRow}>
                            {/* Doctor Photo */}
                            <View style={styles.doctorPhoto}>
                              <Ionicons name="person-circle" size={60} color={colors.primary} />
                            </View>

                            {/* Doctor Details (Name, Specialty, Qualification, Experience) */}
                            <View style={styles.doctorDetailsColumn}>
                              <View style={styles.doctorNameRow}>
                                <Text style={styles.doctorName}>{doctor.name}</Text>
                                {parseInt(doctor.experience) >= 10 && (
                                  <Text style={styles.srTag}>(sr)</Text>
                                )}
                              </View>
                              <Text style={styles.doctorSpecialty}>{doctor.specialization}</Text>
                              {doctor.qualification && (
                                <Text style={styles.doctorQualification}>{doctor.qualification}</Text>
                              )}
                              <View style={styles.doctorExperienceRow}>
                                <Text style={styles.doctorExperienceLabel}>Experience:</Text>
                                <Text style={styles.doctorExperienceText}>{doctor.experience}</Text>
                              </View>
                            </View>

                            {/* Book Button */}
                            <TouchableOpacity 
                              style={styles.doctorCardBookButton}
                              onPress={() => handleBookAppointment(doctor)}
                            >
                              <Text style={styles.doctorCardBookButtonText}>Book</Text>
                            </TouchableOpacity>
                          </View>

                          {/* Bottom Row: Centered Rating + Consultation Fee */}
                          <View style={styles.doctorBottomRow}>
                            <View style={styles.doctorRatingCard}>
                              <Text style={styles.doctorRatingCardLabel}>Doctor's Rating</Text>
                              <View style={styles.doctorRatingStarsContainer}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Ionicons
                                    key={star}
                                    name={star <= getStarRating(doctor.experience) ? "star" : "star-outline"}
                                    size={11}
                                    color="#FFC107"
                                  />
                                ))}
                              </View>
                              <Text style={styles.doctorRatingValue}>({getNumericRating(doctor.experience)})</Text>
                            </View>
                            <View style={styles.doctorRatingCard}>
                              <Text style={styles.doctorConsultationFeeCardLabel}>Consultation Fee</Text>
                              <Text style={styles.doctorConsultationFeeAmount}>₹{doctor.consultationFee}</Text>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.noDoctorsContainer}>
                <Ionicons name="medical-outline" size={48} color={colors.textLight} />
                <Text style={styles.noDoctorsText}>No doctors available</Text>
              </View>
            )}
          </View>

          <View style={styles.bottomSpacer} />
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
  },
  leftColumn: {
    flex: 1.2,
    paddingHorizontal: 12,
    paddingVertical: 0,
  },
  rightColumn: {
    flex: 0.8,
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
    backgroundColor: '#fafafa',
    justifyContent: 'flex-start',
  },
  fullWidthContent: {
    paddingHorizontal: 12,
    paddingVertical: 0,
    flex: 1,
  },
  // ===== IMAGE CAROUSEL (RIGHT COLUMN) =====
  imageCarouselContainer: {
    position: 'relative',
    height: 320,
    borderRadius: 24,
    overflow: 'visible',
    backgroundColor: '#f1f5f9',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginBottom: 0,
    minHeight: 320,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
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
    position: 'absolute',
    bottom: 16,
    left: '50%',
    transform: [{ translateX: -60 }],
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    zIndex: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  dotActive: {
    width: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },

  // ===== SECTION 1: HOSPITAL INFO =====
  infoSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 16,
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 8,
    borderRadius: 18,
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
    marginBottom: 18,
  },
  hospitalTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  specialization: {
    fontSize: 15,
    color: '#4b5563',
    fontWeight: '600',
  },
  specializationWithRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  starRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingNumber: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
    marginLeft: 4,
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

  // ===== SECTION 1.5: JOURNEY INDICATOR =====
  journeySection: {
    backgroundColor: '#fff',
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  journeyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  journeyRowWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
  },
  journeyStart: {
    alignItems: 'center',
    gap: 6,
  },
  journeyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b82f6',
  },
  journeyLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: 80,
  },
  journeyLine: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  journeyDottedLine: {
    width: '100%',
    height: 2,
    borderStyle: 'dotted' as const,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  journeyTime: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3b82f6',
  },
  journeyEnd: {
    alignItems: 'center',
    gap: 6,
  },

  journeyDirectionsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  journeyDirectionsText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  directionsCardButton: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: colors.primary,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  directionsCardText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  // ===== SECTION 2: CONSULTATION TIMING =====
  consultationSection: {
    backgroundColor: '#fff',
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  consultationTimingRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0,
    justifyContent: 'space-between',
  },
  consultationTimeCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  consultationCallCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    flexDirection: 'column',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  consultationCallText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
  },
  consultationTime: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6b7280',
    marginBottom: 6,
  },
  consultationLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
  },
  consultationFeeCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  consultationCostLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 6,
  },
  consultationCost: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6b7280',
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
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
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
    marginBottom: 14,
  },
  imageGalleryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  thumbnailScrollContent: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 4,
  },
  thumbnailWrapper: {
    width: 150,
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: 140,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
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
    color: '#000000',
    marginBottom: 16,
  },

  departmentSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 12,
  },

  // ===== SECTION 4: ABOUT HOSPITAL =====
  aboutSection: {
    backgroundColor: '#fff',
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 8,
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

  // ===== SECTION 4: DEPARTMENTS =====
  departmentsMainCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 8,
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

  // ===== SECTION 5: DOCTORS - Department Grouping =====
  departmentSeparator: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  departmentWiseDoctorsList: {
    gap: 4,
  },
  doctorItemContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  doctorTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  doctorDetailsColumn: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  doctorBottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 0,
  },
  departmentDoctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 4,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  departmentGroup: {
    marginBottom: 8,
  },
  departmentGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 4,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  departmentGroupIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  departmentGroupTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
  },
  doctorCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
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
    justifyContent: 'space-between',
  },
  doctorPhoto: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  doctorInfoSection: {
    flex: 1,
  },
  doctorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 0,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  srTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1f2937',
  },
  doctorSpecialty: {
    fontSize: 13,
    color: '#1f2937',
    fontWeight: '500',
    marginBottom: 0,
  },
  doctorRatingCardSection: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 0,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  doctorCardWithInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
    justifyContent: 'flex-start',
    width: '100%',
  },
  doctorInfoLeft: {
    flex: 1,
  },
  doctorRatingCard: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 6,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    width: 'auto',
    minWidth: 100,
    flexShrink: 0,
  },
  doctorRatingCardLabel: {
    fontSize: 9,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 2,
  },
  doctorRatingStarsContainer: {
    flexDirection: 'row',
    gap: 0.5,
    marginBottom: 2,
  },
  doctorRatingValue: {
    fontSize: 11,
    color: '#1f2937',
    fontWeight: '700',
  },
  doctorConsultationFeeCardLabel: {
    fontSize: 9,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 1,
  },
  doctorConsultationFeeAmount: {
    fontSize: 12,
    color: '#1f2937',
    fontWeight: '700',
  },
  specialtyWithStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 4,
  },
  doctorInlineStarRating: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
  },
  ratingCountText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginLeft: 4,
  },
  doctorQualification: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 0,
  },
  doctorExperienceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 0,
  },
  doctorExperienceLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  doctorExperienceText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  consultationRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  consultationLabelSmall: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  consultationFeeSmall: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '700',
  },
  doctorConsultationFeeCard: {
    backgroundColor: '#f8f9fa',
    marginHorizontal: 0,
    marginBottom: 16,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  consultationFeeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  doctorConsultationFeeLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
  },
  consultationBookButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  consultationBookButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  doctorStarRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
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

  amenitiesSection: {
    backgroundColor: '#fff',
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  amenityItem: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  amenityIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  amenityEmoji: {
    fontSize: 28,
  },
  amenityName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 2,
  },
  amenitySubtext: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9ca3af',
    textAlign: 'center',
  },
  amenityCount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  amenitiesHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },

  bottomSpacer: {
    height: 0,
  },
  consultationFeeSeparator: {
    fontSize: 12,
    color: '#9ca3af',
    marginHorizontal: 4,
  },
  consultationFeeInline: {
    fontSize: 13,
    color: '#1f2937',
    fontWeight: '700',
  },
  doctorCardBookButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorCardBookButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  doctorBookButtonContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
});