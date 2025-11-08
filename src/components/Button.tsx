import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, shadows, fontWeight } from '../utils/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'gradient' | 'glass';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  rounded?: boolean;
  shadow?: boolean;
  haptic?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  rounded = false,
  shadow = true,
  haptic = true,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = () => {
    const baseStyle: any[] = [styles.button];
    
    // Size styles
    switch (size) {
      case 'xs':
        baseStyle.push(styles.xsButton);
        break;
      case 'sm':
        baseStyle.push(styles.smButton);
        break;
      case 'md':
        baseStyle.push(styles.mdButton);
        break;
      case 'lg':
        baseStyle.push(styles.lgButton);
        break;
      case 'xl':
        baseStyle.push(styles.xlButton);
        break;
    }

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryButton);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryButton);
        break;
      case 'outline':
        baseStyle.push(styles.outlineButton);
        break;
      case 'danger':
        baseStyle.push(styles.dangerButton);
        break;
      case 'ghost':
        baseStyle.push(styles.ghostButton);
        break;
      case 'glass':
        baseStyle.push(styles.glassButton);
        break;
    }

    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }

    if (rounded) {
      baseStyle.push(styles.rounded);
    }

    if (shadow && !disabled) {
      baseStyle.push(styles.shadow);
    }

    if (disabled) {
      baseStyle.push(styles.disabledButton);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle: any[] = [styles.buttonText];

    // Size text styles
    switch (size) {
      case 'xs':
        baseStyle.push(styles.xsText);
        break;
      case 'sm':
        baseStyle.push(styles.smText);
        break;
      case 'md':
        baseStyle.push(styles.mdText);
        break;
      case 'lg':
        baseStyle.push(styles.lgText);
        break;
      case 'xl':
        baseStyle.push(styles.xlText);
        break;
    }

    // Variant text styles
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
      case 'gradient':
        baseStyle.push(styles.whiteText);
        break;
      case 'outline':
      case 'ghost':
        baseStyle.push(styles.primaryText);
        break;
      case 'glass':
        baseStyle.push(styles.darkText);
        break;
    }

    if (disabled) {
      baseStyle.push(styles.disabledText);
    }

    return baseStyle;
  };

  const getIconSize = () => {
    switch (size) {
      case 'xs': return 12;
      case 'sm': return 14;
      case 'md': return 16;
      case 'lg': return 18;
      case 'xl': return 20;
      default: return 16;
    }
  };

  const getIconColor = () => {
    if (disabled) return colors.textLight;
    
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
      case 'gradient':
        return colors.textWhite;
      case 'outline':
      case 'ghost':
        return colors.primary;
      case 'glass':
        return colors.textPrimary;
      default:
        return colors.textWhite;
    }
  };

  const renderContent = () => (
    <View style={styles.buttonContent}>
      {icon && iconPosition === 'left' && (
        <Ionicons
          name={icon}
          size={getIconSize()}
          color={getIconColor()}
          style={[styles.buttonIcon, styles.iconLeft]}
        />
      )}
      <Text style={getTextStyle()}>
        {loading ? 'Loading...' : title}
      </Text>
      {icon && iconPosition === 'right' && (
        <Ionicons
          name={icon}
          size={getIconSize()}
          color={getIconColor()}
          style={[styles.buttonIcon, styles.iconRight]}
        />
      )}
      {loading && (
        <View style={styles.loadingIndicator}>
          <Ionicons
            name="hourglass"
            size={getIconSize()}
            color={getIconColor()}
          />
        </View>
      )}
    </View>
  );

  const handlePress = () => {
    try {
      if (!disabled && !loading && onPress) {
        onPress();
      }
    } catch (error) {
      console.error('Button press error:', error);
    }
  };

  if (variant === 'gradient') {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={disabled ? [colors.disabled, colors.disabled] : [colors.primary, colors.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={getButtonStyle()}
          >
            {renderContent()}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={getButtonStyle()}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {renderContent()}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    // Base icon style
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  loadingIndicator: {
    marginLeft: spacing.sm,
  },
  
  // Size variants
  xsButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    minHeight: 28,
  },
  smButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    minHeight: 36,
  },
  mdButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minHeight: 44,
  },
  lgButton: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    minHeight: 52,
  },
  xlButton: {
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.xl,
    minHeight: 60,
  },
  
  // Color variants
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dangerButton: {
    backgroundColor: colors.error,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  glassButton: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  
  // Modifiers
  fullWidth: {
    width: '100%',
  },
  rounded: {
    borderRadius: borderRadius.full,
  },
  shadow: {
    ...shadows.md,
  },
  disabledButton: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },
  
  // Text styles
  buttonText: {
    textAlign: 'center',
    fontWeight: '600',
  },
  xsText: {
    fontSize: fontSize.xs,
  },
  smText: {
    fontSize: fontSize.sm,
  },
  mdText: {
    fontSize: fontSize.md,
  },
  lgText: {
    fontSize: fontSize.lg,
  },
  xlText: {
    fontSize: fontSize.xl,
  },
  whiteText: {
    color: colors.textWhite,
  },
  primaryText: {
    color: colors.primary,
  },
  darkText: {
    color: colors.textPrimary,
  },
  disabledText: {
    color: colors.textLight,
  },
});