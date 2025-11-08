export const colors = {
  // Primary colors - Modern medical blue with gradients
  primary: '#0066FF',
  primaryLight: '#3385FF',
  primaryDark: '#0052CC',
  primaryGradient: ['#0066FF', '#00AAFF'],
  primaryGradientReverse: ['#00AAFF', '#0066FF'],
  
  // Secondary colors - Healing green
  secondary: '#00C896',
  secondaryLight: '#33D4A8',
  secondaryDark: '#00A078',
  secondaryGradient: ['#00C896', '#00E5A0'],
  
  // Accent colors
  accent: '#FF6B6B',
  accentLight: '#FF8E8E',
  accentGradient: ['#FF6B6B', '#FF8E8E'],
  
  // Background colors with depth
  background: '#FFFFFF',
  backgroundSecondary: '#F8FAFC',
  backgroundTertiary: '#F1F5F9',
  backgroundGray: '#E2E8F0',
  backgroundDark: '#1A202C',
  backgroundGradient: ['#F8FAFC', '#FFFFFF'],
  
  // Glass morphism
  glass: 'rgba(255, 255, 255, 0.25)',
  glassDark: 'rgba(255, 255, 255, 0.1)',
  glassBlur: 'rgba(255, 255, 255, 0.8)',
  
  // Text colors with improved hierarchy
  textPrimary: '#1A202C',
  textSecondary: '#4A5568',
  textTertiary: '#718096',
  textLight: '#A0AEC0',
  textWhite: '#FFFFFF',
  textMuted: '#E2E8F0',
  
  // Status colors with gradients
  success: '#00C896',
  successLight: '#C6F6D5',
  successGradient: ['#00C896', '#38B2AC'],
  
  warning: '#F6AD55',
  warningLight: '#FED7AA',
  warningGradient: ['#F6AD55', '#ED8936'],
  
  error: '#F56565',
  errorLight: '#FED7D7',
  errorGradient: ['#F56565', '#E53E3E'],
  
  info: '#63B3ED',
  infoLight: '#BEE3F8',
  infoGradient: ['#63B3ED', '#4299E1'],
  
  // Medical status colors
  pending: '#F6AD55',
  accepted: '#00C896',
  rejected: '#F56565',
  completed: '#805AD5',
  emergency: '#E53E3E',
  
  // Border colors with sophistication
  border: '#E2E8F0',
  borderLight: '#EDF2F7',
  borderMedium: '#CBD5E0',
  borderDark: '#A0AEC0',
  borderFocus: '#0066FF',
  
  // Shadow colors for depth
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  shadowMedium: 'rgba(0, 0, 0, 0.15)',
  shadowDark: 'rgba(0, 0, 0, 0.25)',
  shadowColored: 'rgba(0, 102, 255, 0.15)',
  shadowSuccess: 'rgba(0, 200, 150, 0.15)',
  shadowError: 'rgba(245, 101, 101, 0.15)',
  
  // Card colors with elevation
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  cardHover: '#F8FAFC',
  cardPressed: '#F1F5F9',
  cardShadow: 'rgba(0, 0, 0, 0.08)',
  
  // Interactive colors
  hover: 'rgba(0, 102, 255, 0.08)',
  pressed: 'rgba(0, 102, 255, 0.12)',
  focus: 'rgba(0, 102, 255, 0.24)',
  disabled: '#A0AEC0',
  disabledBackground: '#F7FAFC',
  
  // Brand colors
  brand: '#0066FF',
  brandLight: '#E6F3FF',
  brandDark: '#003D99',
  
  // Health-specific colors
  heartRate: '#E53E3E',
  bloodPressure: '#3182CE',
  temperature: '#F6AD55',
  oxygen: '#00C896',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
  giant: 64,
};

export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  full: 1000,
};

export const fontSize = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  huge: 28,
  massive: 32,
  giant: 40,
};

export const fontWeight = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

export const lineHeight = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
};

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },  
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  xl: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  colored: {
    shadowColor: colors.shadowColored,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const animations = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};