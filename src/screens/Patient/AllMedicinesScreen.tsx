import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Animated, Platform, Dimensions, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../utils/colors';
import { Card } from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { medicines, Medicine } from '../../data/pharmacies';

interface AllMedicinesScreenProps {
  navigation: any;
}

const MedicineCard: React.FC<{ medicine: Medicine; index: number }> = ({ medicine, index }) => {
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
    medicines: [
      { id: 1, discount: 25 }, // Paracetamol 500mg
      { id: 3, discount: 15 }, // Cetirizine 10mg
      { id: 5, discount: 30 }, // Vitamin D3 1000 IU
      { id: 8, discount: 20 }, // Ibuprofen 400mg
      { id: 16, discount: 35 }, // Multivitamin Tablets
      { id: 11, discount: 10 }, // Aspirin 75mg
    ]
  };

  const getDiscount = (id: number) => {
    return discounts.medicines.find(item => item.id === id)?.discount || 0;
  };

  const calculateDiscountedPrice = (originalPrice: string, discountPercent: number) => {
    const price = parseInt(originalPrice.replace('₹', '').replace(',', ''));
    const discountedPrice = price - (price * discountPercent / 100);
    return `₹${Math.round(discountedPrice)}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'pain relief': return colors.error;
      case 'antibiotic': return colors.primary;
      case 'vitamins': return colors.warning;
      case 'diabetes': return colors.secondary;
      case 'hypertension': return colors.success;
      case 'antihistamine': return colors.info;
      case 'gastric': return colors.warning;
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
      case 'antihistamine': return 'leaf-outline';
      case 'gastric': return 'cafe-outline';
      default: return 'medical-outline';
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock > 100) return { status: 'In Stock', color: colors.success };
    if (stock > 50) return { status: 'Limited', color: colors.warning };
    if (stock > 0) return { status: 'Low Stock', color: colors.error };
    return { status: 'Out of Stock', color: colors.textSecondary };
  };

  const discount = getDiscount(medicine.id);
  const hasDiscount = discount > 0;
  const discountedPrice = hasDiscount ? calculateDiscountedPrice(medicine.price, discount) : medicine.price;
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
            <View style={styles.medicineImageContainer}>
              <Image 
                source={{ uri: medicine.image }} 
                style={styles.medicineImage}
                resizeMode="cover"
              />
              {hasDiscount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{discount}% OFF</Text>
                </View>
              )}
            </View>
          )}
          
          <View style={styles.medicineCardHeader}>
            <View style={[styles.medicineCategoryBadge, { backgroundColor: getCategoryColor(medicine.category) + '20' }]}>
              <Ionicons name={getCategoryIcon(medicine.category) as any} size={14} color={getCategoryColor(medicine.category)} />
              <Text style={[styles.medicineCategoryText, { color: getCategoryColor(medicine.category) }]}>
                {medicine.category}
              </Text>
            </View>
          </View>
          
          <Text style={styles.medicineName} numberOfLines={2}>{medicine.name}</Text>
          
          <View style={styles.medicineDetailsRow}>
            <View style={styles.priceContainer}>
              {hasDiscount ? (
                <View style={styles.discountedPriceRow}>
                  <Text style={styles.originalPrice}>{medicine.price}</Text>
                  <Text style={styles.discountedPrice}>{discountedPrice}</Text>
                </View>
              ) : (
                <Text style={styles.medicinePrice}>{medicine.price}</Text>
              )}
              <Text style={styles.dosageText}>{medicine.dosage}</Text>
            </View>
          </View>

          <View style={styles.medicineFooter}>
            <TouchableOpacity style={styles.addToCartButton}>
              <Ionicons name="cart-outline" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const AllMedicinesScreen: React.FC<AllMedicinesScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>(medicines);
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const categories = ['all', ...Array.from(new Set(medicines.map(medicine => medicine.category.toLowerCase())))];

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
    let filtered = medicines;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(medicine => 
        medicine.category.toLowerCase() === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(medicine =>
        medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (medicine.manufacturer ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMedicines(filtered);
  }, [searchQuery, selectedCategory]);

  const numColumns = screenDimensions.width < 768 ? 1 : screenDimensions.width < 1024 ? 2 : 3;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#10b981', '#059669', '#047857']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>All Medicines</Text>
              <Text style={styles.headerSubtitle}>{filteredMedicines.length} medicines available</Text>
            </View>
            <TouchableOpacity style={styles.cartButton}>
              <Ionicons name="cart-outline" size={24} color="#ffffff" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>0</Text>
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
              placeholder="Search medicines, categories, manufacturers..."
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

      {/* Medicines Grid */}
      <Animated.View 
        style={[
          styles.medicinesContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {filteredMedicines.length > 0 ? (
          <FlatList
            data={filteredMedicines}
            renderItem={({ item, index }) => <MedicineCard medicine={item} index={index} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={numColumns}
            key={numColumns}
            contentContainerStyle={styles.medicinesGrid}
            showsVerticalScrollIndicator={true}
            ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="medical-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No medicines found</Text>
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
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
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
  cartBadgeText: {
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
    backgroundColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },

  // Medicines
  medicinesContainer: {
    flex: 1,
  },
  medicinesGrid: {
    padding: spacing.lg,
    paddingBottom: spacing.massive,
  },
  medicineCard: {
    flex: 1,
    margin: spacing.xs,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
    maxWidth: Platform.OS === 'web' ? 350 : undefined,
  },
  medicineCardTouchable: {
    width: '100%',
  },
  medicineCardGradient: {
    padding: spacing.md,
  },
  medicineImageContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  medicineImage: {
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
  medicineCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  medicineCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  medicineCategoryText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  prescriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '20',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
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
    lineHeight: fontSize.md * 1.2,
  },
  medicineDetailsRow: {
    marginBottom: spacing.sm,
  },
  priceContainer: {
    flex: 1,
  },
  discountedPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
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
  medicinePrice: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: '#000000',
    marginBottom: spacing.xs,
  },
  dosageText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  medicineFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
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
  addToCartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
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