import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Animated, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, fontSize } from '../../utils/colors';

interface RoleSelectScreenProps {
  onSelectRole: (role: 'patient' | 'hospital' | 'diagnostic' | 'pharmacy') => void;
}

export const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({ onSelectRole }) => {
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [selectedRole, setSelectedRole] = useState<'patient' | 'hospital' | 'diagnostic' | 'pharmacy' | null>(null);
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation
    const createPulseAnimation = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => createPulseAnimation());
    };
    createPulseAnimation();
  }, []);

  const handleRoleSelect = (role: 'patient' | 'hospital' | 'diagnostic' | 'pharmacy') => {
    setSelectedRole(role);
    // Add haptic feedback if available
    
    // Animate selection and then navigate
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => onSelectRole(role), 300);
    });
  };

  // Responsive breakpoints
  const isSmallScreen = screenDimensions.width < 768;
  const isMediumScreen = screenDimensions.width >= 768 && screenDimensions.width < 1024;

  // Custom Role Card Component
  const RoleCard = ({ 
    role, 
    title, 
    subtitle, 
    icon, 
    gradient, 
    iconBg,
    onPress 
  }: {
    role: 'patient' | 'hospital' | 'diagnostic' | 'pharmacy';
    title: string;
    subtitle: string;
    icon: string;
    gradient: readonly [string, string, ...string[]];
    iconBg: string;
    onPress: () => void;
  }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const isSelected = selectedRole === role;

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

    return (
      <Animated.View style={[
        styles.roleCard,
        { transform: [{ scale: scaleAnim }] },
        isSelected && styles.selectedCard
      ]}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          style={styles.roleCardTouchable}
        >
          <LinearGradient
            colors={gradient as unknown as readonly [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.roleCardGradient}
          >
            <View style={styles.roleCardContent}>
              <View style={[styles.roleIconContainer, { backgroundColor: iconBg }]}>
                <Text style={styles.roleIcon}>{icon}</Text>
              </View>
              
              <View style={styles.roleTextContainer}>
                <Text style={styles.roleTitle}>{title}</Text>
                <Text style={styles.roleSubtitle}>{subtitle}</Text>
              </View>
              
              <View style={styles.roleArrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </View>
            
            {/* Shimmer effect */}
            <Animated.View style={[
              styles.shimmer,
              {
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.05],
                  outputRange: [0.3, 0.6],
                }),
              }
            ]} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[
      styles.container,
      Platform.OS === 'web' && ({
        minHeight: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
      } as any)
    ]}>
      {/* Web-specific style injection */}
      {Platform.OS === 'web' && (
        <style dangerouslySetInnerHTML={{
          __html: `
            body, html, #root {
              margin: 0 !important;
              padding: 0 !important;
              height: 100vh !important;
              overflow: hidden !important;
            }
            .role-scroll::-webkit-scrollbar {
              display: none;
            }
            .role-scroll {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `
        }} />
      )}

      {/* Background Gradient */}
      <LinearGradient
        colors={['#1e3a8a', '#3b82f6', '#60a5fa', '#e0f2fe']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />
      
      {/* Floating particles background */}
      <View style={styles.particlesContainer}>
        {[...Array(6)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: [{
                  scale: pulseAnim.interpolate({
                    inputRange: [1, 1.05],
                    outputRange: [0.5, 1],
                  })
                }],
                opacity: 0.1,
              }
            ]}
          />
        ))}
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingHorizontal: isSmallScreen ? 20 : isMediumScreen ? 40 : 60,
            minHeight: Platform.OS === 'web' ? ('100vh' as any) : screenDimensions.height,
          }
        ]}
        showsVerticalScrollIndicator={Platform.OS !== 'web'}
        bounces={Platform.OS === 'ios'}
        {...(Platform.OS === 'web' && { className: 'role-scroll' })}
      >
        {/* Logo Section */}
        <Animated.View 
          style={[
            styles.logoSection,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: logoScaleAnim }
              ],
            }
          ]}
        >
          <Animated.View style={[
            styles.logoContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}>
            <LinearGradient
              colors={['#ffffff', '#f8f9ff']}
              style={styles.logoCircle}
            >
              <Image 
                source={require('../../../assets/image.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </LinearGradient>
          </Animated.View>
          
          <Text style={styles.appName}>RAPHA</Text>
          <Text style={styles.tagline}>Next-Gen Healthcare Platform</Text>
        </Animated.View>
        
        {/* Content Section */}
        <Animated.View 
          style={[
            styles.contentSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.title}>Welcome to the Future</Text>
          <Text style={styles.subtitle}>
            Choose your path to revolutionize healthcare experience
          </Text>
          
          {/* Role Cards */}
          <View style={styles.roleCardsContainer}>
            <RoleCard
              role="patient"
              title="Continue as Patient"
              subtitle="Access personalized healthcare services"
              icon="👤"
              gradient={['#4F46E5', '#7C3AED', '#EC4899'] as const}
              iconBg="rgba(255, 255, 255, 0.2)"
              onPress={() => handleRoleSelect('patient')}
            />
            
            <RoleCard
              role="hospital"
              title="Continue as Hospital"
              subtitle="Manage healthcare operations efficiently"
              icon="🏥"
              gradient={['#059669', '#0891B2', '#7C3AED'] as const}
              iconBg="rgba(255, 255, 255, 0.2)"
              onPress={() => handleRoleSelect('hospital')}
            />

            <RoleCard
              role="diagnostic"
              title="Continue as Diagnostic Center"
              subtitle="Manage diagnostic tests and bookings"
              icon="🧪"
              gradient={['#DC2626', '#F59E0B', '#EF4444'] as const}
              iconBg="rgba(255, 255, 255, 0.2)"
              onPress={() => handleRoleSelect('diagnostic')}
            />
            
            <RoleCard
              role="pharmacy"
              title="Continue as Pharmacy"
              subtitle="Manage medicines and orders"
              icon="💊"
              gradient={['#7C3AED', '#06B6D4', '#8B5CF6'] as const}
              iconBg="rgba(255, 255, 255, 0.2)"
              onPress={() => handleRoleSelect('pharmacy')}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  logoImage: {
    width: 90,
    height: 90,
  },
  appName: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(30, 64, 175, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
    textAlign: 'center',
  },
  contentSection: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(30, 64, 175, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
    paddingHorizontal: 20,
    fontWeight: '500',
  },
  roleCardsContainer: {
    width: '100%',
    gap: 20,
    marginBottom: 40,
  },
  roleCard: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectedCard: {
    transform: [{ scale: 1.02 }],
  },
  roleCardTouchable: {
    width: '100%',
  },
  roleCardGradient: {
    position: 'relative',
    overflow: 'hidden',
  },
  roleCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    position: 'relative',
    zIndex: 2,
  },
  roleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  roleIcon: {
    fontSize: 28,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(30, 64, 175, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  roleSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    fontWeight: '500',
  },
  roleArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  arrowText: {
    fontSize: 20,
    color: '#1e40af',
    fontWeight: 'bold',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ skewX: '-20deg' }],
  },
});