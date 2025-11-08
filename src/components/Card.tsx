import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, shadows } from '../utils/colors';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
  gradientColors?: [string, string];
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  margin = 'none',
  radius = 'lg',
  shadow = 'md',
  style,
  gradientColors = [colors.primary, colors.primaryLight],
  onPress,
}) => {
  const getCardStyle = () => {
    const baseStyle: any[] = [styles.card];

    // Padding
    switch (padding) {
      case 'none':
        break;
      case 'sm':
        baseStyle.push(styles.paddingSm);
        break;
      case 'md':
        baseStyle.push(styles.paddingMd);
        break;
      case 'lg':
        baseStyle.push(styles.paddingLg);
        break;
      case 'xl':
        baseStyle.push(styles.paddingXl);
        break;
    }

    // Margin
    switch (margin) {
      case 'none':
        break;
      case 'sm':
        baseStyle.push(styles.marginSm);
        break;
      case 'md':
        baseStyle.push(styles.marginMd);
        break;
      case 'lg':
        baseStyle.push(styles.marginLg);
        break;
      case 'xl':
        baseStyle.push(styles.marginXl);
        break;
    }

    // Border radius
    switch (radius) {
      case 'none':
        baseStyle.push({ borderRadius: borderRadius.none });
        break;
      case 'sm':
        baseStyle.push({ borderRadius: borderRadius.sm });
        break;
      case 'md':
        baseStyle.push({ borderRadius: borderRadius.md });
        break;
      case 'lg':
        baseStyle.push({ borderRadius: borderRadius.lg });
        break;
      case 'xl':
        baseStyle.push({ borderRadius: borderRadius.xl });
        break;
      case 'full':
        baseStyle.push({ borderRadius: borderRadius.full });
        break;
    }

    // Shadow
    switch (shadow) {
      case 'none':
        break;
      case 'sm':
        baseStyle.push(shadows.sm);
        break;
      case 'md':
        baseStyle.push(shadows.md);
        break;
      case 'lg':
        baseStyle.push(shadows.lg);
        break;
      case 'xl':
        baseStyle.push(shadows.xl);
        break;
    }

    // Variant styles
    switch (variant) {
      case 'default':
        baseStyle.push(styles.defaultCard);
        break;
      case 'elevated':
        baseStyle.push(styles.elevatedCard);
        break;
      case 'outlined':
        baseStyle.push(styles.outlinedCard);
        break;
      case 'glass':
        baseStyle.push(styles.glassCard);
        break;
    }

    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const webProps = Platform.OS === 'web' ? { 'data-card': 'true' } : {};

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={getCardStyle()}
        {...webProps}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={getCardStyle()} {...webProps}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // Base card styles
  },
  
  // Padding variants
  paddingSm: {
    padding: spacing.sm,
  },
  paddingMd: {
    padding: spacing.lg,
  },
  paddingLg: {
    padding: spacing.xl,
  },
  paddingXl: {
    padding: spacing.xxl,
  },
  
  // Margin variants
  marginSm: {
    margin: spacing.sm,
  },
  marginMd: {
    margin: spacing.md,
  },
  marginLg: {
    margin: spacing.lg,
  },
  marginXl: {
    margin: spacing.xl,
  },
  
  // Card variants
  defaultCard: {
    backgroundColor: colors.card,
  },
  elevatedCard: {
    backgroundColor: colors.cardElevated,
    ...shadows.lg,
  },
  outlinedCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  glassCard: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
});