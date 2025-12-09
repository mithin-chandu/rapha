import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Animated, Platform, Dimensions, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../utils/colors';
import { Card } from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { diagnosticTests, DiagnosticTest } from '../../data/diagnostics';

interface AllDiagnosticsScreenProps {
  navigation: any;
}

const DiagnosticTestCard: React.FC<{ test: DiagnosticTest; index: number }> = ({ test, index }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 50,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  // Demo discount data - same as in HomeScreen
  const discounts = {
    diagnostics: [
      { id: 1, discount: 20 }, // Complete Blood Count
      { id: 2, discount: 25 }, // Chest X-Ray
      { id: 4, discount: 15 }, // Lipid Profile
      { id: 6, discount: 30 }, // Thyroid Function Test
      { id: 10, discount: 25 }, // Liver Function Test
      { id: 14, discount: 40 }, // HbA1c Test
    ]
  };

  const getDiscount = (id: number) => {
    return discounts.diagnostics.find(item => item.id === id)?.discount || 0;
  };

  const calculateDiscountedPrice = (originalPrice: string, discountPercent: number) => {
    const price = parseInt(originalPrice.replace('₹', '').replace(',', ''));
    const discountedPrice = price - (price * discountPercent / 100);
    return `₹${Math.round(discountedPrice)}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'pathology': return colors.primary;
      case 'radiology': return colors.secondary;
      case 'cardiology': return colors.error;
      case 'endocrinology': return colors.warning;
      case 'gastroenterology': return colors.success;
      case 'neurology': return colors.info;
      default: return colors.textSecondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'pathology': return 'water-outline';
      case 'radiology': return 'scan-outline';
      case 'cardiology': return 'heart-outline';
      case 'endocrinology': return 'fitness-outline';
      case 'gastroenterology': return 'cafe-outline';
      case 'neurology': return 'brain-outline';
      default: return 'medical-outline';
    }
  };

  const discount = getDiscount(test.id);
  const hasDiscount = discount > 0;
  const discountedPrice = hasDiscount ? calculateDiscountedPrice(test.price, discount) : test.price;

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
            <View style={styles.testImageContainer}>
              <Image 
                source={{ uri: test.image }} 
                style={styles.testImage}
                resizeMode="cover"
              />
              {hasDiscount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{discount}% OFF</Text>
                </View>
              )}
            </View>
          )}
          
          <View style={styles.testCardHeader}>
            <View style={[styles.testCategoryBadge, { backgroundColor: getCategoryColor(test.category) + '20' }]}>
              <Ionicons name={getCategoryIcon(test.category) as any} size={14} color={getCategoryColor(test.category)} />
              <Text style={[styles.testCategoryText, { color: getCategoryColor(test.category) }]}>
                {test.category}
              </Text>
            </View>
          </View>
          
          <Text style={styles.testName} numberOfLines={2}>{test.name}</Text>
          <Text style={styles.testDescription} numberOfLines={2}>{test.description}</Text>
          
          <View style={styles.testDetailsRow}>
            <View style={styles.priceContainer}>
              {hasDiscount ? (
                <View style={styles.discountedPriceRow}>
                  <Text style={styles.originalPrice}>{test.price}</Text>
                  <Text style={styles.discountedPrice}>{discountedPrice}</Text>
                </View>
              ) : (
                <Text style={styles.testPrice}>{test.price}</Text>
              )}
            </View>
          </View>

          <View style={styles.testFooter}>
            <View style={styles.testDetail}>
              <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.testDetailText}>{test.duration}</Text>
            </View>
            <TouchableOpacity style={styles.bookTestButton}>
              <Ionicons name="calendar-outline" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {test.requirements && (
            <View style={styles.requirementsSection}>
              <View style={styles.requirementsHeader}>
                <Ionicons name="information-circle-outline" size={14} color={colors.warning} />
                <Text style={styles.requirementsLabel}>Requirements:</Text>
              </View>
              <Text style={styles.requirementsText} numberOfLines={2}>
                {test.requirements}
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const AllDiagnosticsScreen: React.FC<AllDiagnosticsScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredTests, setFilteredTests] = useState<DiagnosticTest[]>(diagnosticTests);
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const categories = ['all', ...Array.from(new Set(diagnosticTests.map(test => test.category.toLowerCase())))];

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

  useEffect(() => {
    let filtered = diagnosticTests;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(test => 
        test.category.toLowerCase() === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(test =>
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (test.requirements && test.requirements.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredTests(filtered);
  }, [searchQuery, selectedCategory]);

  const numColumns = screenDimensions.width < 768 ? 1 : screenDimensions.width < 1024 ? 2 : 3;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#f59e0b', '#d97706', '#b45309']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>All Diagnostic Tests</Text>
              <Text style={styles.headerSubtitle}>{filteredTests.length} tests available</Text>
            </View>
            <TouchableOpacity style={styles.bookingsButton}>
              <Ionicons name="calendar-outline" size={24} color="#ffffff" />
              <View style={styles.bookingsBadge}>
                <Text style={styles.bookingsBadgeText}>0</Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Search and Filter Section */}
      <Animated.View 
        style={[
          styles.searchFilterSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tests, categories, requirements..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive
              ]}>
                {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Tests Grid */}
      <Animated.View 
        style={[
          styles.testsContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {filteredTests.length > 0 ? (
          <FlatList
            data={filteredTests}
            renderItem={({ item, index }) => <DiagnosticTestCard test={item} index={index} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={numColumns}
            key={numColumns}
            contentContainerStyle={styles.testsGrid}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="flask-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No tests found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  headerGradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  bookingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bookingsBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingsBadgeText: {
    fontSize: fontSize.xs,
    color: '#ffffff',
    fontWeight: '700',
  },

  // Search and Filter
  searchFilterSection: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchContainer: {
    marginBottom: spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryScrollContent: {
    paddingRight: spacing.lg,
  },
  categoryButton: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  categoryButtonActive: {
    backgroundColor: colors.warning,
  },
  categoryButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },

  // Tests
  testsContainer: {
    flex: 1,
  },
  testsGrid: {
    padding: spacing.lg,
    paddingBottom: spacing.massive,
  },
  testCard: {
    flex: 1,
    margin: spacing.xs,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
    maxWidth: Platform.OS === 'web' ? 350 : undefined,
  },
  testCardTouchable: {
    width: '100%',
  },
  testCardGradient: {
    padding: spacing.md,
  },
  testImageContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  testImage: {
    width: '100%',
    height: 120,
    borderRadius: borderRadius.md,
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  discountText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: '#ffffff',
  },
  testCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  testCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  testCategoryText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  testName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: fontSize.md * 1.2,
  },
  testDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * 1.3,
    marginBottom: spacing.md,
  },
  testDetailsRow: {
    marginBottom: spacing.sm,
  },
  priceContainer: {
    flex: 1,
  },
  discountedPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  originalPrice: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: '#000000',
  },
  testPrice: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: '#000000',
  },
  testFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginBottom: spacing.sm,
  },
  testDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  testDetailText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  bookTestButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.warning + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requirementsSection: {
    backgroundColor: colors.warning + '10',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  requirementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  requirementsLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.warning,
  },
  requirementsText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: fontSize.xs * 1.3,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.massive,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: fontSize.md * 1.4,
  },
});