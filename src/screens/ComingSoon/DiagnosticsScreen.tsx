import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Animated, Platform, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../utils/colors';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { diagnostics, diagnosticTests, DiagnosticTest } from '../../data/diagnostics';
import { storage } from '../../utils/storage';

interface DiagnosticsScreenProps {
  onBackPress?: () => void;
  navigation?: any;
  onLogout?: () => void;
}

const TestCard: React.FC<{ test: DiagnosticTest; index: number }> = ({ test, index }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 100,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'pathology': return colors.primary;
      case 'radiology': return colors.secondary;
      case 'cardiology': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'pathology': return 'water-outline';
      case 'radiology': return 'scan-outline';
      case 'cardiology': return 'heart-outline';
      default: return 'medical-outline';
    }
  };

  return (
    <Animated.View style={[
      styles.testCard,
      {
        transform: [{ scale: scaleAnim }],
      }
    ]}>
      <TouchableOpacity style={styles.testCardTouchable} activeOpacity={0.8}>
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.testCardGradient}
        >
          {test.image && (
            <Image 
              source={{ uri: test.image }} 
              style={styles.testImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.testCardHeader}>
            <View style={[styles.testCategoryBadge, { backgroundColor: getCategoryColor(test.category) + '20' }]}>
              <Ionicons name={getCategoryIcon(test.category) as any} size={16} color={getCategoryColor(test.category)} />
              <Text style={[styles.testCategoryText, { color: getCategoryColor(test.category) }]}>
                {test.category}
              </Text>
            </View>
            <Text style={styles.testPrice}>{test.price}</Text>
          </View>
          
          <Text style={styles.testName}>{test.name}</Text>
          <Text style={styles.testDescription} numberOfLines={2}>{test.description}</Text>
          
          <View style={styles.testDetailsRow}>
            <View style={styles.testDetail}>
              <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.testDetailText}>{test.duration}</Text>
            </View>
            {test.requirements && (
              <View style={styles.testDetail}>
                <Ionicons name="information-circle-outline" size={14} color={colors.warning} />
                <Text style={styles.testDetailText} numberOfLines={1}>
                  {test.requirements.length > 15 ? test.requirements.substring(0, 15) + '...' : test.requirements}
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const DiagnosticsScreen: React.FC<DiagnosticsScreenProps> = ({ onBackPress, navigation, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'centers'>('overview');
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleAccessDiagnosticPortal = () => {
    // Navigate to role selection
    if (onLogout) {
      onLogout();
    } else if (navigation) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'RoleSelect' }],
      });
    }
  };



  const isSmallScreen = screenDimensions.width < 768;
  const numColumns = isSmallScreen ? 1 : screenDimensions.width < 1024 ? 2 : 3;

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={Platform.OS !== 'web'}
      {...(Platform.OS === 'web' && { className: 'diagnostics-scroll' })}
    >
      {/* Web-specific styles */}
      {Platform.OS === 'web' && (
        <style dangerouslySetInnerHTML={{
          __html: `
            .diagnostics-scroll::-webkit-scrollbar {
              display: none;
            }
            .diagnostics-scroll {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `
        }} />
      )}

      {/* Back Button Only */}
      {onBackPress && (
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      )}

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
          colors={['#f59e0b', '#d97706', '#b45309']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroIconContainer}>
              <Ionicons name="analytics" size={60} color="#ffffff" />
            </View>
            <Text style={styles.heroTitle}>Diagnostics</Text>
            <Text style={styles.heroSubtitle}>Advanced Medical Testing</Text>
            <Text style={styles.heroDescription}>
              Comprehensive diagnostic services with state-of-the-art equipment
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'overview', label: 'Overview', icon: 'grid-outline' },
          { key: 'tests', label: 'Tests', icon: 'flask-outline' },
          { key: 'centers', label: 'Centers', icon: 'business-outline' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabButton,
              activeTab === tab.key && styles.tabButtonActive
            ]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Ionicons 
              name={tab.icon as any} 
              size={20} 
              color={activeTab === tab.key ? colors.primary : colors.textSecondary} 
            />
            <Text style={[
              styles.tabLabel,
              activeTab === tab.key && styles.tabLabelActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.contentContainer}>
      {activeTab === 'overview' && (
        <Animated.View style={[
          styles.tabContent,
          { opacity: fadeAnim }
        ]}>
          {/* Coming Soon Banner */}
          <Card variant="elevated" padding="lg" style={styles.comingSoonBanner}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerIcon}>
                <Ionicons name="construct-outline" size={32} color={colors.warning} />
              </View>
              <View style={styles.bannerText}>
                <Text style={styles.bannerTitle}>Coming Soon!</Text>
                <Text style={styles.bannerSubtitle}>
                  We're building something amazing for you
                </Text>
              </View>
            </View>
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>Development Progress</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '85%' }]} />
              </View>
              <Text style={styles.progressText}>85% Complete</Text>
            </View>
          </Card>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            <Text style={styles.sectionTitle}>What's Coming</Text>
            <View style={styles.featuresList}>
              {[
                { icon: 'calendar-outline', title: 'Book Lab Tests', desc: 'Schedule tests online' },
                { icon: 'scan-outline', title: 'Radiology Services', desc: 'X-rays, MRI, CT scans' },
                { icon: 'document-text-outline', title: 'Digital Reports', desc: 'Instant result access' },
                { icon: 'location-outline', title: 'Home Collection', desc: 'Sample pickup service' },
                { icon: 'notifications-outline', title: 'Result Alerts', desc: 'Get notified instantly' },
                { icon: 'shield-checkmark-outline', title: 'Secure Storage', desc: 'Safe report archiving' }
              ].map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name={feature.icon as any} size={24} color={colors.primary} />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to get started?</Text>
            <Text style={styles.ctaDescription}>
              Access the diagnostic center portal to manage your services
            </Text>
            <Button
              title="🏥 Access Diagnostic Portal"
              onPress={handleAccessDiagnosticPortal}
              variant="primary"
              icon="business"
            />
          </View>
        </Animated.View>
      )}

      {activeTab === 'tests' && (
        <Animated.View style={[
          styles.tabContent,
          { opacity: fadeAnim }
        ]}>
          <Text style={styles.sectionTitle}>Available Tests Preview</Text>
          <Text style={styles.sectionSubtitle}>
            Get a glimpse of the tests we'll offer
          </Text>
          
          <View style={styles.testsGrid}>
            {diagnosticTests.map((item, index) => (
              <TestCard key={item.id} test={item} index={index} />
            ))}
          </View>
        </Animated.View>
      )}

      {activeTab === 'centers' && (
        <Animated.View style={[
          styles.tabContent,
          { opacity: fadeAnim }
        ]}>
          <Text style={styles.sectionTitle}>Partner Diagnostic Centers</Text>
          <Text style={styles.sectionSubtitle}>
            Quality centers we're partnering with
          </Text>
          
          <View style={styles.centersGrid}>
            {diagnostics.map((center, index) => (
              <Card key={center.id} variant="elevated" padding="lg" style={styles.centerCard}>
                <View style={styles.centerHeader}>
                  <View style={styles.centerIcon}>
                    <Ionicons name="business" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.centerRating}>
                    <Ionicons name="star" size={16} color="#FFC107" />
                    <Text style={styles.ratingText}>{center.rating}</Text>
                  </View>
                </View>
                
                <Text style={styles.centerName}>{center.name}</Text>
                <Text style={styles.centerSpecialization}>{center.specialization}</Text>
                <Text style={styles.centerAddress}>{center.address}</Text>
                
                {center.description && (
                  <Text style={styles.centerDescription} numberOfLines={2}>
                    {center.description}
                  </Text>
                )}
                
                <View style={styles.centerContact}>
                  <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.contactText}>{center.contact}</Text>
                </View>
              </Card>
            ))}
          </View>
        </Animated.View>
      )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: spacing.massive,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
  },

  // Back Button Container
  backButtonContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    ...shadows.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Hero Section
  heroSection: {
    marginBottom: spacing.lg,
  },
  heroGradient: {
    paddingVertical: spacing.massive,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  heroTitle: {
    fontSize: fontSize.massive,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: fontSize.md,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: fontSize.md * 1.4,
  },
  
  // Tab Navigation
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    ...shadows.sm,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  tabButtonActive: {
    backgroundColor: colors.primary + '20',
  },
  tabLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: colors.primary,
  },

  
  // Tab Content
  tabContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: fontSize.md * 1.4,
  },
  
  // Coming Soon Banner
  comingSoonBanner: {
    marginBottom: spacing.xl,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  bannerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.warning + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  bannerSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  progressContainer: {
    marginTop: spacing.md,
  },
  progressLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.warning,
    borderRadius: borderRadius.sm,
  },
  progressText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'right',
  },
  
  // Features
  featuresContainer: {
    marginBottom: spacing.xl,
  },
  featuresList: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  
  // CTA Section
  ctaSection: {
    backgroundColor: colors.background,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  ctaTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: fontSize.md * 1.4,
  },
  
  // Test Cards
  testsGrid: {
    paddingTop: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  testCard: {
    flex: 1,
    margin: spacing.sm,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
    ...(Platform.OS === 'web' && {
      minWidth: 280,
      maxWidth: 350,
    }),
  },
  testCardTouchable: {
    width: '100%',
  },
  testCardGradient: {
    padding: spacing.lg,
  },
  testImage: {
    width: '100%',
    height: 120,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
  },
  testCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  testCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
  },
  testCategoryText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  testPrice: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.success,
  },
  testName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  testDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * 1.4,
    marginBottom: spacing.md,
  },
  testDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  testDetailText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  
  // Center Cards
  centersGrid: {
    gap: spacing.md,
  },
  centerCard: {
    marginBottom: spacing.md,
  },
  centerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  centerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  centerName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  centerSpecialization: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  centerAddress: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  centerDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * 1.4,
    marginBottom: spacing.md,
  },
  centerContact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  contactText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});