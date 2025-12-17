import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, shadows, fontWeight } from '../utils/colors';
import { Hospital } from '../data/hospitals';
import { Card } from './Card';
import { Button } from './Button';

interface HospitalCardProps {
  hospital: Hospital;
  onPress: (hospital: Hospital) => void;
  variant?: 'default' | 'compact' | 'featured';
  showBookButton?: boolean;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({
  hospital,
  onPress,
  variant = 'default',
  showBookButton = true,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [showNavButtons, setShowNavButtons] = React.useState(false);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    onPress(hospital);
  };

  // Helper function to check if an image is a .png file (to be excluded)
  const isPngImage = (imageSource: any): boolean => {
    if (typeof imageSource === 'string') {
      return imageSource.toLowerCase().endsWith('.png');
    }
    // For require() statements, check the uri property if available
    if (imageSource && typeof imageSource === 'object') {
      const uri = imageSource.uri || '';
      return uri.toLowerCase().includes('.png');
    }
    return false;
  };

  // Get next valid index, skipping PNG images
  const getNextValidIndex = (currentIndex: number, images: any[]): number => {
    let nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    let attempts = 0;
    const maxAttempts = images.length;
    
    while (attempts < maxAttempts && isPngImage(images[nextIndex])) {
      nextIndex = nextIndex === images.length - 1 ? 0 : nextIndex + 1;
      attempts++;
    }
    
    return nextIndex;
  };

  // Get previous valid index, skipping PNG images
  const getPreviousValidIndex = (currentIndex: number, images: any[]): number => {
    let prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    let attempts = 0;
    const maxAttempts = images.length;
    
    while (attempts < maxAttempts && isPngImage(images[prevIndex])) {
      prevIndex = prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      attempts++;
    }
    
    return prevIndex;
  };

  const handleNextImage = () => {
    if (hospital.images && hospital.images.length > 0) {
      setCurrentImageIndex((prev) => {
        const validCurrent = prev >= 0 && prev < hospital.images!.length ? prev : 0;
        return getNextValidIndex(validCurrent, hospital.images!);
      });
    }
  };

  const handlePrevImage = () => {
    if (hospital.images && hospital.images.length > 0) {
      setCurrentImageIndex((prev) => {
        const validCurrent = prev >= 0 && prev < hospital.images!.length ? prev : 0;
        return getPreviousValidIndex(validCurrent, hospital.images!);
      });
    }
  };

  const renderImageCarousel = () => {
    if (!hospital.images || hospital.images.length === 0) {
      return (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image" size={40} color={colors.textSecondary} />
        </View>
      );
    }

    // Show nav buttons by default on web, on demand on mobile
    const shouldShowButtons = Platform.OS === 'web' || showNavButtons;

    // Ensure current image is not a PNG, otherwise find first non-PNG
    let displayIndex = currentImageIndex;
    let attempts = 0;
    const maxAttempts = hospital.images.length;
    while (attempts < maxAttempts && displayIndex < hospital.images.length && isPngImage(hospital.images[displayIndex])) {
      displayIndex = (displayIndex + 1) % hospital.images.length;
      attempts++;
    }

    return (
      <View style={styles.imageContainer}>
        <Image
          source={hospital.images[displayIndex]}
          style={styles.carouselImage}
          resizeMode="cover"
        />
        
        {hospital.images.length > 1 && (
          <>
            {shouldShowButtons && (
              <>
                <TouchableOpacity
                  style={[styles.navButton, styles.prevButton]}
                  onPress={handlePrevImage}
                >
                  <Ionicons name="chevron-back" size={24} color={colors.textWhite} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.navButton, styles.nextButton]}
                  onPress={handleNextImage}
                >
                  <Ionicons name="chevron-forward" size={24} color={colors.textWhite} />
                </TouchableOpacity>
              </>
            )}
            
            <View style={styles.imageIndicator}>
              <Text style={styles.imageIndicatorText}>
                {displayIndex + 1} / {hospital.images.length}
              </Text>
            </View>
          </>
        )}
      </View>
    );
  };

  const getAvailabilityStatus = () => {
    const now = new Date().getHours();
    const isOpen = now >= 8 && now <= 22; // Assuming 8 AM to 10 PM
    return {
      isOpen,
      text: isOpen ? 'Open Now' : 'Closed',
      color: isOpen ? colors.success : colors.error,
    };
  };

  const availability = getAvailabilityStatus();

  if (variant === 'featured') {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <Card variant="elevated" padding="none" shadow="lg" style={styles.featuredCard}>
            {/* Image Carousel */}
            {renderImageCarousel()}

            <View style={styles.featuredContent}>
              <View style={styles.headerRow}>
                <View style={styles.hospitalIconLarge}>
                  <Ionicons name="medical" size={28} color={colors.primary} />
                </View>
                <View style={styles.headerInfo}>
                  <Text style={styles.featuredHospitalName} numberOfLines={2}>
                    {hospital.name}
                  </Text>
                  <Text style={styles.featuredSpecialization} numberOfLines={1}>
                    {hospital.specialization}
                  </Text>
                </View>
              </View>

              <View style={styles.locationRow}>
                <Ionicons name="location" size={16} color={colors.textSecondary} />
                <Text style={styles.featuredAddress} numberOfLines={1}>
                  {hospital.address}
                </Text>
              </View>

              {hospital.description && (
                <Text style={styles.featuredDescription} numberOfLines={2}>
                  {hospital.description}
                </Text>
              )}

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Ionicons name="people" size={16} color={colors.primary} />
                  <Text style={styles.statText}>50+ Doctors</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="time" size={16} color={colors.primary} />
                  <Text style={styles.statText}>24/7 Emergency</Text>
                </View>
              </View>

              {showBookButton && (
                <View style={styles.actionRow}>
                  <Button
                    title="Book Appointment"
                    onPress={handlePress}
                    variant="gradient"
                    size="md"
                    icon="calendar"
                    fullWidth
                  />
                </View>
              )}
            </View>
          </Card>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (variant === 'compact') {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <Card variant="default" padding="md" shadow="sm" style={styles.compactCard}>
            <View style={styles.compactRow}>
              <View style={styles.hospitalIconMedium}>
                <Ionicons name="medical" size={20} color={colors.primary} />
              </View>
              <View style={styles.compactInfo}>
                <Text style={styles.compactName} numberOfLines={1}>
                  {hospital.name}
                </Text>
                <Text style={styles.compactSpecialization} numberOfLines={1}>
                  {hospital.specialization}
                </Text>
              </View>
              <View style={styles.compactActions}>
                <View style={styles.compactRating}>
                  <Ionicons name="star" size={12} color={colors.warning} />
                  <Text style={styles.compactRatingText}>{hospital.rating}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // Default variant
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Card variant="elevated" padding="none" shadow="md" style={styles.defaultCard}>
          {/* Image Carousel */}
          {renderImageCarousel()}
          
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.hospitalIcon}>
                <Ionicons name="medical" size={24} color={colors.primary} />
              </View>
              <View style={styles.headerBadges}>
                <View style={styles.availabilityIndicator}>
                  <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
                  <Text style={styles.statusText}>Open</Text>
                </View>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color={colors.warning} />
                  <Text style={styles.rating}>{hospital.rating}</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.hospitalName}>{hospital.name}</Text>
            <Text style={styles.specialization}>{hospital.specialization}</Text>
            
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.address}>{hospital.address}</Text>
            </View>
            
            {hospital.description && (
              <Text style={styles.description} numberOfLines={2}>
                {hospital.description}
              </Text>
            )}

            <View style={styles.facilitiesContainer}>
              <View style={styles.facilityItem}>
                <Ionicons name="car" size={14} color={colors.success} />
                <Text style={styles.facilityText}>Parking</Text>
              </View>
              <View style={styles.facilityItem}>
                <Ionicons name="wifi" size={14} color={colors.success} />
                <Text style={styles.facilityText}>Free WiFi</Text>
              </View>
              <View style={styles.facilityItem}>
                <Ionicons name="card" size={14} color={colors.success} />
                <Text style={styles.facilityText}>Card Payment</Text>
              </View>
            </View>
          </View>
          
          {showBookButton && (
            <View style={styles.cardFooter}>
              <Button
                title="View Details"
                onPress={handlePress}
                variant="outline"
                size="sm"
                icon="chevron-forward"
                iconPosition="right"
              />
              <Button
                title="Book Now"
                onPress={handlePress}
                variant="primary"
                size="sm"
                icon="calendar"
              />
            </View>
          )}
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Featured variant styles
  featuredCard: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    overflow: 'hidden',
  },
  heroSection: {
    height: 120,
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  availabilityText: {
    fontSize: fontSize.xs,
    color: colors.textWhite,
    fontWeight: '600',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  ratingText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: spacing.xs,
  },
  featuredContent: {
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  hospitalIconLarge: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  featuredHospitalName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    flexWrap: 'wrap',
  },
  featuredSpecialization: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featuredAddress: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    flex: 1,
  },
  featuredDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  actionRow: {
    // Button takes full width by default
  },

  // Compact variant styles
  compactCard: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hospitalIconMedium: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  compactInfo: {
    flex: 1,
  },
  compactName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  compactSpecialization: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  compactActions: {
    alignItems: 'flex-end',
  },
  compactRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  compactRatingText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: spacing.xs,
  },

  // Default variant styles
  defaultCard: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  hospitalIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadges: {
    alignItems: 'flex-end',
  },
  availabilityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
  },
  statusText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  rating: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: spacing.xs,
  },
  cardContent: {
    marginBottom: spacing.lg,
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
    marginBottom: spacing.md,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  address: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    flex: 1,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  facilityText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.lg,
  },

  // Image Carousel styles
  imagePlaceholder: {
    height: 300,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    overflow: 'hidden',
    backgroundColor: colors.backgroundSecondary,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  prevButton: {
    left: spacing.md,
    marginTop: -22,
  },
  nextButton: {
    right: spacing.md,
    marginTop: -22,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  imageIndicatorText: {
    fontSize: fontSize.xs,
    color: colors.textWhite,
    fontWeight: '600',
  },
});