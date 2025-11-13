import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Animated, Platform, Dimensions, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../utils/colors';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { pharmacies, medicines, Medicine } from '../../data/pharmacies';
import { storage } from '../../utils/storage';

interface PharmacyScreenProps {
  onBackPress?: () => void;
  navigation?: any;
}

const MedicineCard: React.FC<{ medicine: Medicine; index: number }> = ({ medicine, index }) => {
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
      case 'pain relief': return colors.error;
      case 'antibiotic': return colors.primary;
      case 'vitamins': return colors.warning;
      case 'diabetes': return colors.secondary;
      case 'hypertension': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'pain relief': return 'bandage-outline';
      case 'antibiotic': return 'shield-outline';
      case 'vitamins': return 'nutrition-outline';
      case 'diabetes': return 'fitness-outline';
      case 'hypertension': return 'heart-outline';
      default: return 'medical-outline';
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock > 100) return { status: 'In Stock', color: colors.success };
    if (stock > 50) return { status: 'Limited', color: colors.warning };
    if (stock > 0) return { status: 'Low Stock', color: colors.error };
    return { status: 'Out of Stock', color: colors.textSecondary };
  };

  const stockInfo = getStockStatus(medicine.stock);

  return (
    <Animated.View style={[
      styles.medicineCard,
      {
        transform: [{ scale: scaleAnim }],
      }
    ]}>
      <TouchableOpacity style={styles.medicineCardTouchable} activeOpacity={0.8}>
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.medicineCardGradient}
        >
          {medicine.image && (
            <Image 
              source={{ uri: medicine.image }} 
              style={styles.medicineImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.medicineCardHeader}>
            <View style={[styles.medicineCategoryBadge, { backgroundColor: getCategoryColor(medicine.category) + '20' }]}>
              <Ionicons name={getCategoryIcon(medicine.category) as any} size={16} color={getCategoryColor(medicine.category)} />
              <Text style={[styles.medicineCategoryText, { color: getCategoryColor(medicine.category) }]}>
                {medicine.category}
              </Text>
            </View>
            {medicine.prescription && (
              <View style={styles.prescriptionBadge}>
                <Ionicons name="document-text" size={12} color={colors.error} />
                <Text style={styles.prescriptionText}>Rx</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.medicineName}>{medicine.name}</Text>
          <Text style={styles.medicineDescription} numberOfLines={2}>{medicine.description}</Text>
          
          <View style={styles.medicineDetailsRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.medicinePrice}>{medicine.price}</Text>
              <Text style={styles.dosageText}>{medicine.dosage}</Text>
            </View>
            <View style={styles.stockContainer}>
              <View style={[styles.stockIndicator, { backgroundColor: stockInfo.color }]} />
              <Text style={[styles.stockText, { color: stockInfo.color }]}>
                {stockInfo.status}
              </Text>
            </View>
          </View>

          <View style={styles.medicineFooter}>
            <Text style={styles.manufacturerText}>{medicine.manufacturer}</Text>
            <Text style={styles.expiryText}>Exp: {medicine.expiryDate}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const PharmacyScreen: React.FC<PharmacyScreenProps> = ({ onBackPress, navigation }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'medicines'>('overview');
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

  const handleAccessPharmacyPortal = () => {
    if (navigation) {
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
      {...(Platform.OS === 'web' && { className: 'pharmacy-scroll' })}
    >
      {/* Web-specific styles */}
      {Platform.OS === 'web' && (
        <style dangerouslySetInnerHTML={{
          __html: `
            .pharmacy-scroll::-webkit-scrollbar {
              display: none;
            }
            .pharmacy-scroll {
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
          colors={['#10b981', '#059669', '#047857']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroIconContainer}>
              <Ionicons name="medical" size={60} color="#ffffff" />
            </View>
            <Text style={styles.heroTitle}>Pharmacy</Text>
            <Text style={styles.heroSubtitle}>Your Health, Delivered</Text>
            <Text style={styles.heroDescription}>
              Order medicines online with trusted pharmacy partners
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'overview', label: 'Overview', icon: 'grid-outline' },
          { key: 'medicines', label: 'Medicines', icon: 'medical-outline' }
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
              color={activeTab === tab.key ? colors.secondary : colors.textSecondary} 
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
                <Ionicons name="construct-outline" size={32} color={colors.secondary} />
              </View>
              <View style={styles.bannerText}>
                <Text style={styles.bannerTitle}>Coming Soon!</Text>
                <Text style={styles.bannerSubtitle}>
                  Your digital pharmacy is almost ready
                </Text>
              </View>
            </View>
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>Development Progress</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '75%' }]} />
              </View>
              <Text style={styles.progressText}>75% Complete</Text>
            </View>
          </Card>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            <Text style={styles.sectionTitle}>What's Coming</Text>
            <View style={styles.featuresList}>
              {[
                { icon: 'basket-outline', title: 'Online Ordering', desc: 'Order medicines from home' },
                { icon: 'document-text-outline', title: 'Upload Prescriptions', desc: 'Easy prescription uploads' },
                { icon: 'car-outline', title: 'Home Delivery', desc: 'Free delivery to your door' },
                { icon: 'alarm-outline', title: 'Medicine Reminders', desc: 'Never miss a dose' },
                { icon: 'location-outline', title: 'Find Pharmacies', desc: 'Locate nearby stores' },
                { icon: 'shield-checkmark-outline', title: 'Genuine Medicines', desc: 'Verified authentic drugs' }
              ].map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name={feature.icon as any} size={24} color={colors.secondary} />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Service Statistics</Text>
            <View style={styles.statsGrid}>
              <Card variant="elevated" padding="lg" style={styles.statCard}>
                <Ionicons name="storefront" size={32} color={colors.secondary} />
                <Text style={styles.statNumber}>50+</Text>
                <Text style={styles.statLabel}>Partner Pharmacies</Text>
              </Card>
              <Card variant="elevated" padding="lg" style={styles.statCard}>
                <Ionicons name="medical" size={32} color={colors.primary} />
                <Text style={styles.statNumber}>5000+</Text>
                <Text style={styles.statLabel}>Medicines Available</Text>
              </Card>
              <Card variant="elevated" padding="lg" style={styles.statCard}>
                <Ionicons name="car" size={32} color={colors.success} />
                <Text style={styles.statNumber}>24/7</Text>
                <Text style={styles.statLabel}>Delivery Service</Text>
              </Card>
            </View>
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to serve you!</Text>
            <Text style={styles.ctaDescription}>
              Access the pharmacy portal to manage your inventory and orders
            </Text>
            <Button
              title="🏥 Access Pharmacy Portal"
              onPress={handleAccessPharmacyPortal}
              variant="primary"
              icon="business"
            />
          </View>
        </Animated.View>
      )}

      {activeTab === 'medicines' && (
        <Animated.View style={[
          styles.tabContent,
          { opacity: fadeAnim }
        ]}>
          <Text style={styles.sectionTitle}>Medicine Catalog Preview</Text>
          <Text style={styles.sectionSubtitle}>
            Browse our comprehensive medicine collection
          </Text>
          
          <View style={styles.medicinesGrid}>
            {medicines.map((item, index) => (
              <MedicineCard key={item.id} medicine={item} index={index} />
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
    backgroundColor: colors.secondary + '20',
  },
  tabLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: colors.secondary,
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
    backgroundColor: colors.secondary + '20',
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
    backgroundColor: colors.secondary,
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
    backgroundColor: colors.secondary + '20',
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

  // Stats Container
  statsContainer: {
    marginBottom: spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    ...(Platform.OS === 'web' && {
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    }),
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
    ...(Platform.OS === 'web' && {
      minWidth: 180,
      maxWidth: 220,
    }),
  },
  statNumber: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
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
  
  // Medicine Cards
  medicinesGrid: {
    paddingTop: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  medicineCard: {
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
  medicineCardTouchable: {
    width: '100%',
  },
  medicineCardGradient: {
    padding: spacing.lg,
  },
  medicineImage: {
    width: '100%',
    height: 120,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
  },
  medicineCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  medicineCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
  },
  medicineCategoryText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  prescriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  prescriptionText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.error,
  },
  medicineName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  medicineDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * 1.4,
    marginBottom: spacing.md,
  },
  medicineDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  priceContainer: {
    flex: 1,
  },
  medicinePrice: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.success,
    marginBottom: spacing.xs,
  },
  dosageText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stockText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  medicineFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  manufacturerText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  expiryText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  

});