import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../utils/colors';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: any;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  style,
  animate = true,
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (animate) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [animate, animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          opacity: animate ? opacity : 0.3,
        },
        style,
      ]}
    />
  );
};

// Hospital Card Skeleton
export const HospitalCardSkeleton: React.FC = () => {
  return (
    <View style={styles.hospitalCardSkeleton}>
      <View style={styles.cardHeader}>
        <Skeleton width={48} height={48} style={styles.iconSkeleton} />
        <View style={styles.headerInfo}>
          <Skeleton width="60%" height={16} style={{ marginBottom: spacing.xs }} />
          <Skeleton width="40%" height={12} />
        </View>
        <Skeleton width={40} height={20} style={styles.ratingSkeleton} />
      </View>
      
      <View style={styles.cardContent}>
        <Skeleton width="80%" height={20} style={{ marginBottom: spacing.sm }} />
        <Skeleton width="60%" height={14} style={{ marginBottom: spacing.sm }} />
        <Skeleton width="90%" height={12} style={{ marginBottom: spacing.xs }} />
        <Skeleton width="70%" height={12} />
      </View>
      
      <View style={styles.cardFooter}>
        <Skeleton width="30%" height={32} />
        <Skeleton width="25%" height={32} />
      </View>
    </View>
  );
};

// Stats Card Skeleton
export const StatsCardSkeleton: React.FC = () => {
  return (
    <View style={styles.statsCardSkeleton}>
      <Skeleton width={28} height={28} style={styles.statIconSkeleton} />
      <Skeleton width="60%" height={24} style={{ marginVertical: spacing.sm }} />
      <Skeleton width="80%" height={12} />
    </View>
  );
};

// Home Screen Skeleton
export const HomeScreenSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Hero Section Skeleton */}
      <View style={styles.heroSkeleton}>
        <LinearGradient
          colors={[colors.border, colors.borderLight]}
          style={styles.heroGradient}
        >
          <View style={styles.heroContent}>
            <Skeleton width="50%" height={16} style={{ marginBottom: spacing.sm }} />
            <Skeleton width="70%" height={28} style={{ marginBottom: spacing.md }} />
            <Skeleton width="85%" height={14} />
          </View>
        </LinearGradient>
      </View>

      {/* Quick Actions Skeleton */}
      <View style={styles.quickActionsSkeleton}>
        <Skeleton width="40%" height={20} style={{ marginBottom: spacing.md }} />
        <View style={styles.quickActionsGrid}>
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.quickActionSkeleton}>
              <Skeleton width={48} height={48} style={styles.quickActionIconSkeleton} />
              <Skeleton width="80%" height={14} style={{ marginTop: spacing.md }} />
              <Skeleton width="60%" height={10} style={{ marginTop: spacing.xs }} />
            </View>
          ))}
        </View>
      </View>

      {/* Stats Skeleton */}
      <View style={styles.statsSkeleton}>
        <View style={styles.statsGrid}>
          {[1, 2, 3].map((item) => (
            <StatsCardSkeleton key={item} />
          ))}
        </View>
      </View>

      {/* Hospitals List Skeleton */}
      <View style={styles.hospitalsListSkeleton}>
        <Skeleton width="50%" height={20} style={{ marginBottom: spacing.md }} />
        {[1, 2, 3].map((item) => (
          <HospitalCardSkeleton key={item} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
  },
  
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  
  // Hero Skeleton
  heroSkeleton: {
    marginBottom: spacing.xl,
  },
  heroGradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.massive,
    paddingTop: spacing.giant + 20,
    borderBottomLeftRadius: borderRadius.xxxl,
    borderBottomRightRadius: borderRadius.xxxl,
  },
  heroContent: {
    alignItems: 'center',
  },
  
  // Quick Actions Skeleton
  quickActionsSkeleton: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickActionSkeleton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  quickActionIconSkeleton: {
    borderRadius: borderRadius.lg,
  },
  
  // Stats Skeleton
  statsSkeleton: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statsCardSkeleton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  statIconSkeleton: {
    borderRadius: borderRadius.sm,
  },
  
  // Hospital Card Skeleton
  hospitalsListSkeleton: {
    paddingHorizontal: spacing.lg,
  },
  hospitalCardSkeleton: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconSkeleton: {
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  ratingSkeleton: {
    borderRadius: borderRadius.full,
  },
  cardContent: {
    marginBottom: spacing.lg,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});