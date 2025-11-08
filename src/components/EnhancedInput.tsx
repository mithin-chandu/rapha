import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Animated, 
  TouchableOpacity,
  TextInputProps 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, shadows } from '../utils/colors';

interface EnhancedInputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'outlined' | 'filled' | 'underlined';
  size?: 'sm' | 'md' | 'lg';
  helperText?: string;
  required?: boolean;
  showRequiredAsterisk?: boolean;
  onIconPress?: () => void;
  clearable?: boolean;
  onClear?: () => void;
}

export const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  error,
  icon,
  iconPosition = 'left',
  variant = 'outlined',
  size = 'md',
  helperText,
  required = false,
  showRequiredAsterisk = true,
  onIconPress,
  clearable = false,
  onClear,
  value = '',
  onFocus,
  onBlur,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isPasswordField = props.secureTextEntry;
  const hasValue = value && value.length > 0;
  const shouldFloatLabel = isFocused || hasValue;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(labelAnim, {
        toValue: shouldFloatLabel ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderAnim, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [shouldFloatLabel, isFocused]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClear = () => {
    onClear?.();
  };

  const getContainerStyle = () => {
    const baseStyle: any[] = [styles.container];
    
    switch (size) {
      case 'sm':
        baseStyle.push(styles.smallContainer);
        break;
      case 'md':
        baseStyle.push(styles.mediumContainer);
        break;
      case 'lg':
        baseStyle.push(styles.largeContainer);
        break;
    }

    return baseStyle;
  };

  const getInputContainerStyle = () => {
    const baseStyle: any[] = [styles.inputContainer];
    
    switch (variant) {
      case 'default':
        baseStyle.push(styles.defaultInput);
        break;
      case 'outlined':
        baseStyle.push(styles.outlinedInput);
        break;
      case 'filled':
        baseStyle.push(styles.filledInput);
        break;
      case 'underlined':
        baseStyle.push(styles.underlinedInput);
        break;
    }

    if (isFocused) {
      baseStyle.push(styles.focusedInput);
    }

    if (error) {
      baseStyle.push(styles.errorInput);
    }

    return baseStyle;
  };

  const getInputStyle = () => {
    const baseStyle: any[] = [styles.input];
    
    switch (size) {
      case 'sm':
        baseStyle.push(styles.smallInput);
        break;
      case 'md':
        baseStyle.push(styles.mediumInput);
        break;
      case 'lg':
        baseStyle.push(styles.largeInput);
        break;
    }

    return baseStyle;
  };

  const getLabelStyle = () => {
    const translateY = labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -24],
    });

    const scale = labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.85],
    });

    const color = labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.textSecondary, isFocused ? colors.primary : colors.textTertiary],
    });

    return [
      styles.label,
      {
        transform: [{ translateY }, { scale }],
        color,
      },
      size === 'lg' && styles.largeLabelSize,
    ];
  };

  const getBorderColor = () => {
    return borderAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.border, error ? colors.error : colors.primary],
    });
  };

  const renderIcon = (position: 'left' | 'right') => {
    if (position === 'right') {
      if (isPasswordField) {
        return (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconButton}>
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        );
      }
      
      if (clearable && hasValue) {
        return (
          <TouchableOpacity onPress={handleClear} style={styles.iconButton}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        );
      }
    }

    if (icon && iconPosition === position) {
      return (
        <TouchableOpacity
          onPress={onIconPress}
          style={styles.iconButton}
          disabled={!onIconPress}
        >
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <Animated.View style={[getContainerStyle(), { transform: [{ scale: scaleAnim }] }]}>
      <Animated.View style={[getInputContainerStyle(), variant === 'outlined' && { borderColor: getBorderColor() }]}>
        {renderIcon('left')}
        
        <View style={styles.inputWrapper}>
          <Animated.Text style={getLabelStyle()}>
            {label}
            {required && showRequiredAsterisk && (
              <Text style={styles.asterisk}> *</Text>
            )}
          </Animated.Text>
          
          <TextInput
            {...props}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={getInputStyle()}
            placeholderTextColor={colors.textLight}
            secureTextEntry={isPasswordField && !showPassword}
          />
        </View>
        
        {renderIcon('right')}
      </Animated.View>
      
      {(error || helperText) && (
        <View style={styles.messageContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={14} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <Text style={styles.helperText}>{helperText}</Text>
          )}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  smallContainer: {
    marginBottom: spacing.md,
  },
  mediumContainer: {
    marginBottom: spacing.lg,
  },
  largeContainer: {
    marginBottom: spacing.xl,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  
  // Variant styles
  defaultInput: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  outlinedInput: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  filledInput: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  underlinedInput: {
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  
  focusedInput: {
    ...shadows.md,
  },
  errorInput: {
    borderColor: colors.error,
  },
  
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  
  input: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  smallInput: {
    fontSize: fontSize.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  mediumInput: {
    fontSize: fontSize.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  largeInput: {
    fontSize: fontSize.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  
  label: {
    position: 'absolute',
    left: 0,
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  largeLabelSize: {
    fontSize: fontSize.lg,
  },
  
  asterisk: {
    color: colors.error,
  },
  
  iconButton: {
    padding: spacing.sm,
  },
  
  messageContainer: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  helperText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});