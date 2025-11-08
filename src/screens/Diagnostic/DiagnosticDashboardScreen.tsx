import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Dimensions, Platform, TouchableOpacity, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../utils/colors';
import { storage, UserData } from '../../utils/storage';
import { DiagnosticBooking } from '../../data/diagnosticBookings';
import { diagnosticTests } from '../../data/diagnostics';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';

interface DiagnosticDashboardScreenProps {
  navigation: any;
  userData: UserData;
}

// Quick Action Card Component
const QuickActionCard: React.FC<{
  title: string;
  subtitle: string;
  icon: string;
  gradient: string[];
  iconBg: string;
  onPress: () => void;
  delay: number;
  pulseAnim: Animated.Value;
}> = ({ title, subtitle, icon, gradient, iconBg, onPress, delay, pulseAnim }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

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
      styles.quickActionCard,
      {
        transform: [
          { scale: scaleAnim },
          { 
            scale: pulseAnim.interpolate({
              inputRange: [1, 1.03],
              outputRange: [1, 1.01],
            })
          }
        ],
      }
    ]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={styles.quickActionTouchable}
      >
        <LinearGradient
          colors={gradient as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.quickActionGradient}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: iconBg }]}>
            <Ionicons name={icon as any} size={24} color="#ffffff" />
          </View>
          
          <Text style={styles.quickActionTitle}>{title}</Text>
          <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
          
          {/* Shimmer effect */}
          <Animated.View style={[
            styles.actionShimmer,
            {
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.03],
                outputRange: [0.2, 0.4],
              }),
            }
          ]} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const DiagnosticDashboardScreen: React.FC<DiagnosticDashboardScreenProps> = ({ navigation, userData }) => {
  const [bookings, setBookings] = useState<DiagnosticBooking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    loadBookings();
  }, [userData.diagnosticId]);

  useEffect(() => {
    // Enhanced animations on mount
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
    ]).start();

    // Continuous pulse animation
    const createPulseAnimation = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
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
    
    // Shimmer animation
    const createShimmerAnimation = () => {
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => createShimmerAnimation());
    };

    createPulseAnimation();
    createShimmerAnimation();

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  const loadBookings = async () => {
    try {
      const allBookings = await storage.getDiagnosticBookings();
      // Filter bookings for the current diagnostic center
      const diagnosticBookings = allBookings.filter(
        booking => booking.diagnosticId === userData.diagnosticId
      );
      setBookings(diagnosticBookings);
    } catch (error) {
      console.error('Error loading diagnostic bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const getStats = () => {
    const totalTests = diagnosticTests.length;
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
    const completedBookings = bookings.filter(b => b.status === 'Completed' || b.status === 'Results Ready').length;

    return { totalTests, totalBookings, pendingBookings, completedBookings };
  };

  const stats = getStats();

  const handleQuickAction = (action: string) => {
    try {
      console.log('Quick action pressed:', action);
      switch (action) {
        case 'tests':
          navigation.navigate('DiagnosticTests');
          break;
        case 'bookings':
          navigation.navigate('DiagnosticBookings');
          break;
        case 'profile':
          navigation.navigate('DiagnosticProfile');
          break;
        default:
          console.warn('Unknown quick action:', action);
      }
    } catch (error) {
      console.error('Navigation error in quick action:', error);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getHealthTip = () => {
    const tips = [
      'Ensure proper sample collection for accurate test results',
      'Maintain equipment calibration for precise diagnostics',
      'Follow safety protocols during specimen handling',
      'Keep patient records updated and secure',
      'Provide clear instructions to patients before tests',
    ];
    const today = new Date().getDate();
    return tips[today % tips.length];
  };

  const getRecentBookings = () => {
    return bookings
      .sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime())
      .slice(0, 3);
  };

  const recentBookings = getRecentBookings();

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="flask-outline" size={48} color="#DC2626" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  // Responsive breakpoints
  const isSmallScreen = screenDimensions.width < 768;
  const isMediumScreen = screenDimensions.width >= 768 && screenDimensions.width < 1024;

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
            .diagnostic-scroll::-webkit-scrollbar {
              display: none;
            }
            .diagnostic-scroll {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `
        }} />
      )}

      {/* Floating particles background */}
      <View style={styles.particlesContainer}>
        {[...Array(4)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                left: `${20 + Math.random() * 60}%`,
                top: `${10 + Math.random() * 80}%`,
                transform: [{
                  scale: pulseAnim.interpolate({
                    inputRange: [1, 1.03],
                    outputRange: [0.8, 1.2],
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
            paddingHorizontal: isSmallScreen ? 16 : isMediumScreen ? 24 : 32,
          }
        ]}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#DC2626"
            colors={["#DC2626"]}
          />
        }
        showsVerticalScrollIndicator={Platform.OS !== 'web'}
        bounces={Platform.OS === 'ios'}
        {...(Platform.OS === 'web' && { className: 'diagnostic-scroll' })}
      >
        {/* Hero Section */}
        <Animated.View 
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#DC2626', '#F59E0B', '#EF4444']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            {/* Shimmer overlay */}
            <Animated.View style={[
              styles.shimmerOverlay,
              {
                opacity: shimmerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.1, 0.3],
                }),
              }
            ]} />
            
            {/* Header with Logo and Profile */}
            <View style={styles.headerRow}>
              {/* Logo */}
              <TouchableOpacity style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Ionicons name="flask" size={24} color="#DC2626" />
                </View>
              </TouchableOpacity>
              
              {/* Profile Button */}
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={() => navigation.navigate('DiagnosticProfile')}
              >
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileInitials}>
                    {userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </Text>
                </View>
                <Text style={styles.profileName} numberOfLines={1}>
                  {userData.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.heroContent}>
              <View style={styles.greetingSection}>
                <Text style={styles.greetingText}>{getGreeting()}</Text>
                <Text style={styles.userName}>{userData.name.split(' ')[0]} 🧪</Text>
                <Text style={styles.heroSubtext}>
                  Providing accurate diagnostics for better healthcare outcomes
                </Text>
              </View>
              
              <View style={styles.quickStats}>
                <View style={styles.quickStatItem}>
                  <Ionicons name="flask" size={20} color={colors.textWhite} />
                  <Text style={styles.quickStatText}>Active Lab</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          style={[
            styles.quickActionsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {[
              {
                key: 'tests',
                title: 'Manage Tests',
                subtitle: 'View & add tests',
                icon: 'flask',
                gradient: ['#DC2626', '#F59E0B', '#EF4444'],
                iconBg: 'rgba(220, 38, 38, 0.1)',
              },
              {
                key: 'bookings',
                title: 'Test Bookings',
                subtitle: 'Manage appointments',
                icon: 'calendar',
                gradient: ['#F59E0B', '#D97706', '#B45309'],
                iconBg: 'rgba(245, 158, 11, 0.1)',
              },
            ].map((action, index) => {
              const { key: actionKey, ...actionProps } = action;
              return (
                <QuickActionCard
                  key={actionKey}
                  {...actionProps}
                  onPress={() => handleQuickAction(actionKey)}
                  delay={index * 100}
                  pulseAnim={pulseAnim}
                />
              );
            })}
          </View>
        </Animated.View>

        {/* Health Tip Card */}
        <Animated.View 
          style={[
            styles.healthTipSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Card variant="glass" padding="lg" style={styles.healthTipCard}>
            <View style={styles.healthTipHeader}>
              <Ionicons name="bulb" size={24} color={colors.warning} />
              <Text style={styles.healthTipTitle}>Daily Lab Tip</Text>
            </View>
            <Text style={styles.healthTipText}>{getHealthTip()}</Text>
          </Card>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View 
          style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.statsGrid}>
            <Card variant="elevated" padding="lg" style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="flask" size={28} color="#DC2626" />
              </View>
              <Text style={[styles.statNumber, { color: '#DC2626' }]}>{stats.totalTests}</Text>
              <Text style={styles.statLabel}>Available Tests</Text>
            </Card>
            
            <Card variant="elevated" padding="lg" style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="calendar" size={28} color={colors.secondary} />
              </View>
              <Text style={[styles.statNumber, { color: colors.secondary }]}>{stats.totalBookings}</Text>
              <Text style={styles.statLabel}>Total Bookings</Text>
            </Card>
          </View>
        </Animated.View>

        {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <Animated.View 
            style={[
              styles.recentSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Test Bookings</Text>
              <Button
                title="View All"
                onPress={() => handleQuickAction('bookings')}
                variant="primary"
                size="sm"
                icon="arrow-forward"
              />
            </View>

            {recentBookings.map((booking, index) => (
              <Card key={booking.id} variant="elevated" padding="lg" style={StyleSheet.flatten([styles.bookingCard, { 
                transform: [{ translateY: index * -2 }],
                opacity: 1 - (index * 0.1)
              }])}>
                <View style={styles.bookingHeader}>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>👤 {booking.patientName}</Text>
                    <Text style={styles.testName}>🧪 {booking.testName}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                      {booking.status}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.bookingDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={16} color="#DC2626" />
                    <Text style={styles.detailText}>
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })} at {booking.time}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="cash" size={16} color={colors.secondary} />
                    <Text style={styles.detailText}>
                      {booking.price} • {booking.patientAge} years • {booking.patientGender}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </Animated.View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const getStatusColor = (status: DiagnosticBooking['status']) => {
  switch (status) {
    case 'Pending':
      return colors.pending;
    case 'Accepted':
      return colors.accepted;
    case 'Rejected':
      return colors.rejected;
    case 'Completed':
    case 'Results Ready':
      return colors.completed;
    case 'Sample Collected':
      return colors.info;
    default:
      return colors.textSecondary;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    ...(Platform.OS === 'web' && {
      minHeight: '100vh',
      overflowX: 'hidden',
    } as any),
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginTop: spacing.lg,
    fontWeight: '600',
  },
  
  // Hero Section
  heroSection: {
    marginBottom: spacing.xl,
    ...(Platform.OS === 'web' && {
      marginBottom: spacing.lg,
    }),
  },
  heroGradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.massive,
    paddingTop: spacing.lg,
    borderBottomLeftRadius: borderRadius.xxxl,
    borderBottomRightRadius: borderRadius.xxxl,
    ...(Platform.OS === 'web' && {
      paddingHorizontal: Math.max(spacing.lg, 20),
      paddingVertical: spacing.xl,
      paddingTop: spacing.md,
      borderBottomLeftRadius: Math.min(borderRadius.xxxl, 24),
      borderBottomRightRadius: Math.min(borderRadius.xxxl, 24),
    } as any),
  },
  
  // Header Row with Logo and Profile
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
    ...(Platform.OS === 'web' && {
      marginBottom: spacing.lg,
      paddingHorizontal: 0,
    }),
  },
  
  // Logo Styles
  logoContainer: {
    padding: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    ...(Platform.OS === 'web' && ({
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    } as any)),
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Profile Button Styles
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    maxWidth: 200,
    ...(Platform.OS === 'web' && ({
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    } as any)),
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  profileInitials: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textWhite,
  },
  profileName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textWhite,
    flex: 1,
  },
  
  heroContent: {
    alignItems: 'center',
  },
  greetingSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  greetingText: {
    fontSize: fontSize.md,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  userName: {
    fontSize: fontSize.huge,
    fontWeight: '800',
    color: colors.textWhite,
    marginBottom: spacing.md,
  },
  heroSubtext: {
    fontSize: fontSize.lg,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: fontSize.lg * 1.4,
    paddingHorizontal: spacing.lg,
  },
  quickStats: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  quickStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
  },
  quickStatText: {
    fontSize: fontSize.sm,
    color: colors.textWhite,
    fontWeight: '600',
  },
  
  // Particles
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: spacing.massive,
  },
  
  // Shimmer Overlay
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  // Quick Actions
  quickActionsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    ...(Platform.OS === 'web' && ({
      paddingHorizontal: Math.max(spacing.lg, 20),
      maxWidth: 1200,
      alignSelf: 'center',
      width: '100%',
    } as any)),
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.md,
    ...(Platform.OS === 'web' && ({
      justifyContent: 'center',
    } as any)),
  },
  quickActionCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
    ...(Platform.OS === 'web' && ({
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minWidth: 200,
      maxWidth: 250,
    } as any)),
  },
  quickActionTouchable: {
    width: '100%',
  },
  quickActionGradient: {
    padding: spacing.lg,
    alignItems: 'center',
    position: 'relative',
    minHeight: 120,
    justifyContent: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  quickActionTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textWhite,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: fontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  actionShimmer: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ skewX: '-20deg' }],
  },
  
  // Health Tip
  healthTipSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    ...(Platform.OS === 'web' && ({
      paddingHorizontal: Math.max(spacing.lg, 20),
      maxWidth: 1200,
      alignSelf: 'center',
      width: '100%',
    } as any)),
  },
  healthTipCard: {
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  healthTipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  healthTipTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: spacing.md,
  },
  healthTipText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: fontSize.md * 1.5,
  },
  
  // Stats Section
  statsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    ...(Platform.OS === 'web' && ({
      paddingHorizontal: Math.max(spacing.lg, 20),
      maxWidth: 1200,
      alignSelf: 'center',
      width: '100%',
    } as any)),
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  statIcon: {
    marginBottom: spacing.md,
  },
  statNumber: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Recent Section
  recentSection: {
    marginBottom: spacing.xl,
    ...(Platform.OS === 'web' && ({
      maxWidth: 1200,
      alignSelf: 'center',
      width: '100%',
    } as any)),
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...(Platform.OS === 'web' && ({
      paddingHorizontal: Math.max(spacing.lg, 20),
    } as any)),
  },
  sectionTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  bookingCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...(Platform.OS === 'web' && ({
      marginHorizontal: Math.max(spacing.lg, 20),
    } as any)),
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  testName: {
    fontSize: fontSize.md,
    color: '#DC2626',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  bookingDetails: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  detailText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginLeft: spacing.md,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: spacing.xxxl,
  },
});