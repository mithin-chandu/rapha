import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../utils/colors';

interface ImageCarouselProps {
  images: any[];
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  height?: number;
  showIndicator?: boolean;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  initialIndex = 0,
  onIndexChange,
  height = 200,
  showIndicator = true,
  resizeMode = 'cover',
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showNavButtons, setShowNavButtons] = useState(false);

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
  const getNextValidIndex = (currentIdx: number): number => {
    let nextIndex = currentIdx === images.length - 1 ? 0 : currentIdx + 1;
    let attempts = 0;
    const maxAttempts = images.length;
    
    while (attempts < maxAttempts && isPngImage(images[nextIndex])) {
      nextIndex = nextIndex === images.length - 1 ? 0 : nextIndex + 1;
      attempts++;
    }
    
    return nextIndex;
  };

  // Get previous valid index, skipping PNG images
  const getPreviousValidIndex = (currentIdx: number): number => {
    let prevIndex = currentIdx === 0 ? images.length - 1 : currentIdx - 1;
    let attempts = 0;
    const maxAttempts = images.length;
    
    while (attempts < maxAttempts && isPngImage(images[prevIndex])) {
      prevIndex = prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      attempts++;
    }
    
    return prevIndex;
  };

  if (!images || images.length === 0) {
    return (
      <View style={[styles.imagePlaceholder, { height }]}>
        <Ionicons name="image" size={40} color={colors.textSecondary} />
        <Text style={styles.placeholderText}>No images available</Text>
      </View>
    );
  }

  const handlePrevious = () => {
    const newIndex = getPreviousValidIndex(currentIndex);
    setCurrentIndex(newIndex);
    onIndexChange?.(newIndex);
  };

  const handleNext = () => {
    const newIndex = getNextValidIndex(currentIndex);
    setCurrentIndex(newIndex);
    onIndexChange?.(newIndex);
  };

  return (
    <View style={[styles.container, { height }]}>
      <Image
        source={images[currentIndex]}
        style={[styles.image, { height }]}
        resizeMode={resizeMode}
      />

      {images.length > 1 && (
        <>
          <TouchableOpacity
            style={[styles.navButton, styles.prevButton]}
            onPress={handlePrevious}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={colors.textWhite} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={handleNext}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-forward" size={24} color={colors.textWhite} />
          </TouchableOpacity>
        </>
      )}

      {showIndicator && images.length > 1 && (
        <View style={styles.indicatorContainer}>
          <View style={styles.indicatorBackground}>
            <Text style={styles.indicatorText}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: colors.backgroundSecondary,
  },
  image: {
    width: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: 14,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -24 }],
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  prevButton: {
    left: spacing.md,
  },
  nextButton: {
    right: spacing.md,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    zIndex: 10,
  },
  indicatorBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  indicatorText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: '600',
  },
});
