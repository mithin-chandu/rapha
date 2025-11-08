import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, shadows } from '../utils/colors';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'transparent' | 'large';
  backgroundColor?: string;
  textColor?: string;
  showStatusBar?: boolean;
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  elevation?: boolean;
  centerTitle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  rightElement,
  variant = 'default',
  backgroundColor,
  textColor,
  showStatusBar = true,
  statusBarStyle = 'dark-content',
  elevation = true,
  centerTitle = false,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleBackPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,  
        useNativeDriver: true,
      }),
    ]).start();
    onBackPress?.();
  };

  const getHeaderStyle = () => {
    const baseStyle: any[] = [styles.header];

    switch (variant) {
      case 'default':
        baseStyle.push(styles.defaultHeader);
        break;
      case 'transparent':
        baseStyle.push(styles.transparentHeader);
        break;
      case 'large':
        baseStyle.push(styles.largeHeader);
        break;
    }

    if (elevation) {
      baseStyle.push(shadows.sm);
    }

    if (backgroundColor) {
      baseStyle.push({ backgroundColor });
    }

    return baseStyle;
  };

  const getTextColor = () => {
    if (textColor) return textColor;
    
    switch (variant) {
      case 'gradient':
        return colors.textWhite;
      case 'transparent':
        return colors.textPrimary;
      default:
        return colors.textPrimary;
    }
  };

  const getTitleStyle = () => {
    const baseStyle: any[] = [styles.title];
    
    if (variant === 'large') {
      baseStyle.push(styles.largeTitle);
    }

    baseStyle.push({ color: getTextColor() });
    
    if (centerTitle) {
      baseStyle.push(styles.centeredTitle);
    }

    return baseStyle;
  };

  const getSubtitleStyle = () => {
    const baseStyle: any[] = [styles.subtitle];
    
    if (variant === 'large') {
      baseStyle.push(styles.largeSubtitle);
    }

    const subtitleColor = variant === 'gradient' 
      ? colors.textWhite + 'CC' 
      : colors.textSecondary;
    
    baseStyle.push({ color: subtitleColor });
    
    return baseStyle;
  };

  const renderContent = () => (
    <>
      {showStatusBar && (
        <StatusBar
          barStyle={variant === 'gradient' ? 'light-content' : statusBarStyle}
          backgroundColor={variant === 'gradient' ? colors.primary : colors.background}
        />
      )}
      
      <View style={styles.contentContainer}>
        <View style={styles.leftSection}>
          {showBack && (
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
                activeOpacity={0.8}
              >
                <View style={styles.backButtonContent}>
                  <Ionicons 
                    name="chevron-back" 
                    size={24} 
                    color={getTextColor()} 
                  />
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
          
          <View style={[styles.titleContainer, centerTitle && styles.centeredTitleContainer]}>
            <Text style={getTitleStyle()} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text style={getSubtitleStyle()} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        
        {rightElement && (
          <View style={styles.rightSection}>
            {rightElement}
          </View>
        )}
      </View>
    </>
  );

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={getHeaderStyle()}
      >
        {renderContent()}
      </LinearGradient>
    );
  }

  return (
    <View style={getHeaderStyle()}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
  },
  
  // Header variants
  defaultHeader: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  transparentHeader: {
    backgroundColor: 'transparent',
  },
  largeHeader: {
    backgroundColor: colors.background,
    paddingBottom: spacing.xl,
  },
  
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: 56,
  },
  
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  backButton: {
    marginRight: spacing.md,
    marginLeft: -spacing.sm,
  },
  backButtonContent: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  titleContainer: {
    flex: 1,
  },
  centeredTitleContainer: {
    alignItems: 'center',
  },
  
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    lineHeight: fontSize.xl * 1.2,
  },
  largeTitle: {
    fontSize: fontSize.huge,
    fontWeight: '800',
    lineHeight: fontSize.huge * 1.1,
  },
  centeredTitle: {
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
    lineHeight: fontSize.sm * 1.3,
  },
  largeSubtitle: {
    fontSize: fontSize.md,
    marginTop: spacing.sm,
  },
  
  rightSection: {
    marginLeft: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
});