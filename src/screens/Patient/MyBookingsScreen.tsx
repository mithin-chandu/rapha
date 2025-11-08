import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TextInput, TouchableOpacity, ScrollView, Platform, Dimensions, Animated, Image, Modal } from 'react-native';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../utils/colors';
import { BookingCard } from '../../components/BookingCard';
import { HospitalCard } from '../../components/HospitalCard';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Booking } from '../../data/bookings';
import { Hospital, hospitals } from '../../data/hospitals';
import { Diagnostic, diagnostics, DiagnosticTest, diagnosticTests } from '../../data/diagnostics';
import { Pharmacy, pharmacies, Medicine, medicines } from '../../data/pharmacies';
import { ehrRecords, EHRRecord, getRecentEHRRecords, getUpcomingFollowUps } from '../../data/ehr';
import { storage, UserData } from '../../utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface MyBookingsScreenProps {
  userData: UserData;
  navigation: any;
}

type ActiveTab = 'search' | 'ehr' | 'appointments' | 'categories';
type ProviderType = 'all' | 'hospitals';
type FilterCategory = 'all' | 'cardiology' | 'neurology' | 'orthopedics' | 'pediatrics' | 'dermatology' | 'gastroenterology' | 'radiology' | 'pathology';

export const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({ userData, navigation }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<ProviderType>('all');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  // EHR detail modal state
  const [selectedEHR, setSelectedEHR] = useState<EHRRecord | null>(null);
  const [ehrModalVisible, setEhrModalVisible] = useState(false);
  
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Categories data
  const categories = [
    { key: 'cardiology' as FilterCategory, label: 'Cardiology' },
    { key: 'neurology' as FilterCategory, label: 'Neurology' },
    { key: 'orthopedics' as FilterCategory, label: 'Orthopedics' },
    { key: 'pediatrics' as FilterCategory, label: 'Pediatrics' },
    { key: 'dermatology' as FilterCategory, label: 'Dermatology' },
    { key: 'gastroenterology' as FilterCategory, label: 'Gastroenterology' },
    { key: 'radiology' as FilterCategory, label: 'Radiology' },
    { key: 'pathology' as FilterCategory, label: 'Pathology' },
  ];

  const loadBookings = async () => {
    try {
      const allBookings = await storage.getBookings();
      const patientBookings = allBookings.filter(
        booking => booking.patientName.toLowerCase() === userData.name?.toLowerCase()
      );
      
      const sortedBookings = patientBookings.sort((a, b) => 
        new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()
      );
      
      setBookings(sortedBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [userData.name]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    // Initialize animations
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadBookings();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const openEHRDetail = (record: EHRRecord) => {
    setSelectedEHR(record);
    setEhrModalVisible(true);
  };

  const closeEHRModal = () => {
    setEhrModalVisible(false);
    setSelectedEHR(null);
  };

  // Filter functions
  const getFilteredProviders = () => {
    let allProviders: any[] = [];

    if (selectedProvider === 'all' || selectedProvider === 'hospitals') {
      allProviders = [...allProviders, ...hospitals.map(h => ({ ...h, type: 'hospital' }))];
    }

    // Apply search filter
    if (searchQuery.trim()) {
      allProviders = allProviders.filter(provider =>
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      allProviders = allProviders.filter(provider =>
        provider.specialization?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    return allProviders;
  };

  const getStatusCounts = () => {
    const counts = {
      pending: bookings.filter(b => b.status === 'Pending').length,
      accepted: bookings.filter(b => b.status === 'Accepted').length,
      completed: bookings.filter(b => b.status === 'Completed').length,
      rejected: bookings.filter(b => b.status === 'Rejected').length,
    };
    return counts;
  };

  const handleProviderPress = (provider: any) => {
    if (provider.type === 'hospital') {
      navigation.navigate('HospitalDetails', { hospital: provider });
    } else if (provider.type === 'diagnostic') {
      navigation.navigate('Diagnostics');
    } else if (provider.type === 'pharmacy') {
      navigation.navigate('Pharmacy');
    }
  };

  const filteredProviders = getFilteredProviders();
  const statusCounts = getStatusCounts();

  // Enhanced Tab Navigation Component with animations
  const renderTabNavigation = () => (
    <Animated.View 
      style={[
        styles.tabNavigation,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <LinearGradient
        colors={['#ffffff', '#f8fafc']}
        style={styles.tabGradient}
      >
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'search' && styles.tabItemActive]}
            onPress={() => setActiveTab('search')}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <Ionicons 
                name={activeTab === 'search' ? 'calendar' : 'calendar-outline'} 
                size={20} 
                color={activeTab === 'search' ? '#2563eb' : '#64748b'} 
              />
              <Text style={[styles.tabText, activeTab === 'search' && styles.tabTextActive]}>
                Book Appointment
              </Text>
            </View>
            {activeTab === 'search' && <Animated.View style={styles.tabUnderline} />}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'ehr' && styles.tabItemActive]}
            onPress={() => setActiveTab('ehr')}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <Ionicons 
                name={activeTab === 'ehr' ? 'document-text' : 'document-text-outline'} 
                size={20} 
                color={activeTab === 'ehr' ? '#2563eb' : '#64748b'} 
              />
              <Text style={[styles.tabText, activeTab === 'ehr' && styles.tabTextActive]}>
                EHR
              </Text>
            </View>
            {activeTab === 'ehr' && <Animated.View style={styles.tabUnderline} />}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'appointments' && styles.tabItemActive]}
            onPress={() => setActiveTab('appointments')}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <Ionicons 
                name={activeTab === 'appointments' ? 'list' : 'list-outline'} 
                size={20} 
                color={activeTab === 'appointments' ? '#2563eb' : '#64748b'} 
              />
              <Text style={[styles.tabText, activeTab === 'appointments' && styles.tabTextActive]}>
                My Appointments
              </Text>
            </View>
            {activeTab === 'appointments' && <Animated.View style={styles.tabUnderline} />}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'categories' && styles.tabItemActive]}
            onPress={() => setActiveTab('categories')}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <Ionicons 
                name={activeTab === 'categories' ? 'filter' : 'filter-outline'} 
                size={20} 
                color={activeTab === 'categories' ? '#2563eb' : '#64748b'} 
              />
              <Text style={[styles.tabText, activeTab === 'categories' && styles.tabTextActive]}>
                Categories
              </Text>
            </View>
            {activeTab === 'categories' && <Animated.View style={styles.tabUnderline} />}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  // Enhanced Search Bar Component
  const renderSearchBar = () => (
    <Animated.View 
      style={[
        styles.searchContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      <LinearGradient
        colors={['#ffffff', '#f1f5f9']}
        style={styles.searchGradient}
      >
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchRow}>
            {/* Location Block */}
            <View style={styles.locationBlock}>
              <Ionicons name="location" size={18} color="#3b82f6" />
              <Text style={styles.locationText}>Vijayawada</Text>
            </View>
            
            <View style={styles.searchBar}>
              <View style={styles.searchIconContainer}>
                <Ionicons name="search" size={22} color="#3b82f6" />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Search hospitals in Vijayawada..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#94a3b8"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity 
                  onPress={() => setSearchQuery('')}
                  style={styles.clearButton}
                  activeOpacity={0.7}
                >
                  <View style={styles.clearButtonInner}>
                    <Ionicons name="close" size={16} color="#64748b" />
                  </View>
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.categoriesButton}
              onPress={() => setShowCategoriesModal(true)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#3b82f6', '#2563eb']}
                style={styles.categoriesButtonGradient}
              >
                <Ionicons name="filter-outline" size={18} color="#ffffff" />
                <Text style={styles.categoriesButtonText}>
                  {selectedCategory === 'all' ? 'Filter' : categories.find(c => c.key === selectedCategory)?.label || 'Filter'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.searchShadow} />
        </View>
      </LinearGradient>
    </Animated.View>
  );

  // Filter Chips Component
  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
        <View style={styles.filterRow}>
          {/* Provider Type Filters */}
          {[
            { key: 'all', label: 'All', icon: 'apps' },
            { key: 'hospitals', label: 'Hospitals', icon: 'medical' }
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterChip,
                selectedProvider === filter.key && styles.filterChipActive
              ]}
              onPress={() => setSelectedProvider(filter.key as ProviderType)}
            >
              <Ionicons
                name={filter.icon as any}
                size={16}
                color={selectedProvider === filter.key ? colors.primary : colors.textSecondary}
              />
              <Text style={[
                styles.filterChipText,
                selectedProvider === filter.key && styles.filterChipTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderBookingCard = ({ item }: { item: Booking }) => (
    <BookingCard
      booking={item}
      userRole="patient"
      showActions={false}
    />
  );

  // Compact Provider Card for Grid Layout
  const renderCompactProviderCard = ({ item, index }: { item: any; index?: number }) => (
    <Animated.View
      style={[
        styles.compactCardContainer,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
        }
      ]}
    >
      <TouchableOpacity
        style={styles.compactCard}
        onPress={() => handleProviderPress(item)}
        activeOpacity={0.95}
      >
        <LinearGradient
          colors={
            item.type === 'hospital' 
              ? ['#ffffff', '#f0f9ff']
              : item.type === 'diagnostic'
              ? ['#ffffff', '#fefce8']
              : ['#ffffff', '#ecfdf5']
          }
          style={styles.compactCardGradient}
        >
          {/* Card Image */}
          <View style={styles.compactImageContainer}>
            {item.image ? (
              <Image 
                source={{ uri: item.image }} 
                style={styles.compactImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[
                styles.compactIcon,
                {
                  backgroundColor: item.type === 'hospital' 
                    ? '#dbeafe'
                    : item.type === 'diagnostic'
                    ? '#fef3c7'
                    : '#d1fae5'
                }
              ]}>
                <Ionicons
                  name={
                    item.type === 'hospital' ? 'medical' :
                    item.type === 'diagnostic' ? 'analytics' : 'medkit'
                  }
                  size={20}
                  color={
                    item.type === 'hospital' ? '#2563eb' :
                    item.type === 'diagnostic' ? '#d97706' : '#059669'
                  }
                />
              </View>
            )}
          </View>

          {/* Rating Badge */}
          <View style={styles.compactRating}>
            <Ionicons name="star" size={12} color="#fbbf24" />
            <Text style={styles.compactRatingText}>{item.rating}</Text>
          </View>

          {/* Card Content */}
          <View style={styles.compactContent}>
            <Text style={styles.compactName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.compactSpecialization} numberOfLines={1}>
              {item.specialization}
            </Text>
            <View style={styles.compactLocation}>
              <Ionicons name="location" size={12} color="#64748b" />
              <Text style={styles.compactAddress} numberOfLines={1}>{item.address}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  // Enhanced Provider Card Component (keep for detailed view if needed)
  const renderProviderCard = ({ item, index }: { item: any; index?: number }) => (
    <Animated.View
      style={[
        styles.providerCardContainer,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
        }
      ]}
    >
      <TouchableOpacity
        style={styles.providerCard}
        onPress={() => handleProviderPress(item)}
        activeOpacity={0.95}
      >
        <LinearGradient
          colors={
            item.type === 'hospital' 
              ? ['#ffffff', '#f0f9ff', '#e0f2fe']
              : item.type === 'diagnostic'
              ? ['#ffffff', '#fefce8', '#fef3c7']
              : ['#ffffff', '#ecfdf5', '#d1fae5']
          }
          style={styles.providerCardGradient}
        >
          {/* Card Header */}
          <View style={styles.providerCardHeader}>
            <View style={[
              styles.providerTypeIcon,
              {
                backgroundColor: item.type === 'hospital' 
                  ? '#dbeafe'
                  : item.type === 'diagnostic'
                  ? '#fef3c7'
                  : '#d1fae5'
              }
            ]}>
              <Ionicons
                name={
                  item.type === 'hospital' ? 'medical' :
                  item.type === 'diagnostic' ? 'analytics' : 'medkit'
                }
                size={24}
                color={
                  item.type === 'hospital' ? '#2563eb' :
                  item.type === 'diagnostic' ? '#d97706' : '#059669'
                }
              />
            </View>
            
            <View style={styles.providerBadge}>
              <View style={styles.providerRating}>
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
              <View style={[
                styles.providerTypeBadge,
                {
                  backgroundColor: item.type === 'hospital' 
                    ? '#2563eb'
                    : item.type === 'diagnostic'
                    ? '#d97706'
                    : '#059669'
                }
              ]}>
                <Text style={styles.providerTypeBadgeText}>
                  {item.type === 'hospital' ? 'Hospital' : 
                   item.type === 'diagnostic' ? 'Diagnostic' : 'Pharmacy'}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Card Content */}
          <View style={styles.providerCardContent}>
            <Text style={styles.providerName}>{item.name}</Text>
            <Text style={styles.providerSpecialization}>{item.specialization}</Text>
            
            <View style={styles.providerDetails}>
              <View style={styles.providerLocation}>
                <Ionicons name="location" size={16} color="#64748b" />
                <Text style={styles.providerAddress}>{item.address}</Text>
              </View>
              
              {item.type === 'pharmacy' && item.operatingHours && (
                <View style={styles.operatingHours}>
                  <Ionicons name="time" size={16} color="#64748b" />
                  <Text style={styles.operatingHoursText}>{item.operatingHours}</Text>
                </View>
              )}
              
              {item.contact && (
                <View style={styles.providerContact}>
                  <Ionicons name="call" size={16} color="#64748b" />
                  <Text style={styles.providerContactText}>{item.contact}</Text>
                </View>
              )}
            </View>
            
            {/* Action Button */}
            <View style={styles.providerActions}>
              <LinearGradient
                colors={
                  item.type === 'hospital' 
                    ? ['#3b82f6', '#2563eb']
                    : item.type === 'diagnostic'
                    ? ['#f59e0b', '#d97706']
                    : ['#10b981', '#059669']
                }
                style={styles.actionButtonGradient}
              >
                <Text style={styles.actionButtonText}>
                  {item.type === 'hospital' ? 'Book Appointment' : 
                   item.type === 'diagnostic' ? 'Book Test' : 'Order Medicine'}
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#ffffff" />
              </LinearGradient>
            </View>
          </View>
          
          {/* Card Shadow */}
          <View style={styles.providerCardShadow} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  // Section Header Component
  const renderSectionHeader = (title: string, count: number, onViewAll?: () => void) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {title === 'Top Hospitals' ? 'Top Hospitals' : `${title} (${count})`}
      </Text>
      {onViewAll && count > 0 && (
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name={
          activeTab === 'search' ? 'search-outline' :
          activeTab === 'ehr' ? 'document-text-outline' : 'calendar-outline'
        } 
        size={64} 
        color={colors.textLight} 
      />
      <Text style={styles.emptyTitle}>
        {activeTab === 'search' ? 'No Results Found' :
         activeTab === 'ehr' ? 'No EHR Data' : 'No Bookings Yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'search' ? 'Try adjusting your search or filters' :
         activeTab === 'ehr' ? 'Your electronic health records will appear here' :
         'Book your first appointment to see it here'}
      </Text>
    </View>
  );

  // Enhanced grid layout renderer
  const renderProviderGrid = (providers: any[], title: string, onViewAll: () => void) => {
    if (providers.length === 0) return null;
    
    const displayProviders = providers.slice(0, 6); // Show 6 items (2 rows of 3)
    const rows = [];
    
    for (let i = 0; i < displayProviders.length; i += 3) {
      const rowItems = displayProviders.slice(i, i + 3);
      rows.push(rowItems);
    }

    return (
      <View style={styles.providerSection}>
        {renderSectionHeader(title, providers.length, onViewAll)}
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.providerRow}>
            {row.map((provider, index) => (
              <View key={`${provider.type}-${provider.id}`} style={styles.providerCardWrapper}>
                {renderCompactProviderCard({ item: provider, index: rowIndex * 3 + index })}
              </View>
            ))}
            {/* Fill empty slots in the last row */}
            {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, emptyIndex) => (
              <View key={`empty-${emptyIndex}`} style={styles.providerCardWrapper} />
            ))}
          </View>
        ))}
      </View>
    );
  };

  // Main content renderers
  const renderSearchContent = () => {
    const groupedProviders = {
      hospitals: filteredProviders.filter(p => p.type === 'hospital')
    };

    return (
      <View style={styles.contentContainer}>

        {/* Top Hospitals Section */}
        {(selectedProvider === 'all' || selectedProvider === 'hospitals') && 
          renderProviderGrid(
            groupedProviders.hospitals, 
            `Top Hospitals`, 
            () => setSelectedProvider('hospitals')
          )
        }

        {/* Nearby Hospitals Section */}
        {(selectedProvider === 'all' || selectedProvider === 'hospitals') && 
          renderNearbyHospitals()
        }

        {filteredProviders.length === 0 && renderEmptyState()}
      </View>
    );
  };

  const renderEHRContent = () => {
    const recentRecords = getRecentEHRRecords(3);
    const upcomingFollowUps = getUpcomingFollowUps();

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Completed':
          return colors.success;
        case 'Follow-up Required':
          return colors.warning;
        case 'Active':
          return colors.info;
        default:
          return colors.textTertiary;
      }
    };

    return (
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* EHR Overview Card */}
        <View style={styles.ehrCard}>
          <View style={styles.ehrHeader}>
            <Ionicons name="document-text" size={32} color="#3b82f6" />
            <Text style={styles.ehrTitle}>Electronic Health Records</Text>
          </View>
          <Text style={styles.ehrDescription}>
            Access your complete medical history, test results, and treatment records.
          </Text>

          {/* Quick Stats */}
          <View style={styles.ehrStatsContainer}>
            <View style={styles.ehrStatCard}>
              <Text style={styles.ehrStatNumber}>{ehrRecords.length}</Text>
              <Text style={styles.ehrStatLabel}>Total Records</Text>
            </View>
            <View style={styles.ehrStatCard}>
              <Text style={styles.ehrStatNumber}>{upcomingFollowUps.length}</Text>
              <Text style={styles.ehrStatLabel}>Follow-ups</Text>
            </View>
            <View style={styles.ehrStatCard}>
              <Text style={styles.ehrStatNumber}>
                {ehrRecords.filter(r => r.status === 'Active').length}
              </Text>
              <Text style={styles.ehrStatLabel}>Active</Text>
            </View>
          </View>
        </View>

        {/* Recent Health Summary */}
        {recentRecords.length > 0 && (
          <View style={styles.ehrCard}>
            <Text style={styles.sectionTitle}>Latest Health Summary</Text>
            <View style={styles.healthSummaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryTitle}>Recent Assessment</Text>
                <Text style={styles.summaryDate}>
                  {formatDate(recentRecords[0].appointmentDateTime)}
                </Text>
              </View>
              
              <View style={styles.vitalsSummary}>
                <View style={styles.vitalItem}>
                  <Text style={styles.vitalLabel}>Blood Pressure</Text>
                  <Text style={styles.vitalValue}>
                    {recentRecords[0].patientBasicVitals.bloodPressure.systolic}/
                    {recentRecords[0].patientBasicVitals.bloodPressure.diastolic}
                  </Text>
                  <Text style={[styles.vitalStatus, {
                    color: recentRecords[0].patientBasicVitals.bloodPressure.systolic <= 120 ? 
                           colors.success : colors.warning
                  }]}>
                    {recentRecords[0].patientBasicVitals.bloodPressure.systolic <= 120 ? 
                     'Normal' : 'High'}
                  </Text>
                </View>
                
                <View style={styles.vitalItem}>
                  <Text style={styles.vitalLabel}>Blood Sugar</Text>
                  <Text style={styles.vitalValue}>
                    {recentRecords[0].patientBasicVitals.sugarReading} mg/dL
                  </Text>
                  <Text style={[styles.vitalStatus, {
                    color: recentRecords[0].patientBasicVitals.sugarReading <= 140 ? 
                           colors.success : colors.warning
                  }]}>
                    {recentRecords[0].patientBasicVitals.sugarReading <= 140 ? 'Normal' : 'High'}
                  </Text>
                </View>
                
                <View style={styles.vitalItem}>
                  <Text style={styles.vitalLabel}>Weight</Text>
                  <Text style={styles.vitalValue}>
                    {recentRecords[0].patientBasicVitals.weight} kg
                  </Text>
                  <Text style={styles.vitalStatus}>Stable</Text>
                </View>
              </View>

              <View style={styles.conditionInfo}>
                <Text style={styles.conditionLabel}>Latest Condition:</Text>
                <Text style={styles.conditionText} numberOfLines={2}>
                  {recentRecords[0].healthIssue}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Recent Medical Records */}
        <View style={styles.ehrCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Medical Records</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {recentRecords.length > 0 ? (
            recentRecords.map((record) => (
              <TouchableOpacity key={record.id} style={styles.ehrRecordCard} onPress={() => openEHRDetail(record)}>
                <View style={styles.recordHeader}>
                  <View style={styles.recordTitleContainer}>
                    <Text style={styles.recordRaphaId}>{record.raphaId}</Text>
                    <View style={[styles.recordStatusBadge, { 
                      backgroundColor: getStatusColor(record.status) + '20' 
                    }]}>
                      <Text style={[styles.recordStatusText, { 
                        color: getStatusColor(record.status) 
                      }]}>
                        {record.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.recordDate}>
                    {formatDate(record.appointmentDateTime)}
                  </Text>
                </View>

                <Text style={styles.recordPatient}>{record.patientFullName}</Text>
                <Text style={styles.recordIssue} numberOfLines={2}>
                  {record.healthIssue}
                </Text>

                <View style={styles.recordFooter}>
                  <View style={styles.recordVitals}>
                    <Text style={styles.recordVitalText}>
                      BP: {record.patientBasicVitals.bloodPressure.systolic}/
                      {record.patientBasicVitals.bloodPressure.diastolic}
                    </Text>
                    <Text style={styles.recordVitalText}>
                      Sugar: {record.patientBasicVitals.sugarReading}
                    </Text>
                  </View>
                  <View style={styles.recordMeta}>
                    <Text style={styles.recordDoctor}>Dr. {record.doctorName.replace('Dr. ', '')}</Text>
                    <Text style={styles.recordMedCount}>
                      {record.medicinesPrescription.length} prescription(s)
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noRecordsContainer}>
              <Ionicons name="document-text-outline" size={48} color={colors.textLight} />
              <Text style={styles.noRecordsText}>No medical records found</Text>
            </View>
          )}
        </View>

        {/* Upcoming Follow-ups */}
        {upcomingFollowUps.length > 0 && (
          <View style={styles.ehrCard}>
            <Text style={styles.sectionTitle}>Upcoming Follow-ups</Text>
            {upcomingFollowUps.slice(0, 3).map((followUp, index) => (
              <View key={index} style={styles.followUpCard}>
                <View style={styles.followUpHeader}>
                  <Text style={styles.followUpPatient}>{followUp.patientName}</Text>
                  <View style={[styles.priorityBadge, {
                    backgroundColor: followUp.priority === 'High' ? colors.errorLight :
                                   followUp.priority === 'Medium' ? colors.warningLight :
                                   colors.successLight
                  }]}>
                    <Text style={[styles.priorityText, {
                      color: followUp.priority === 'High' ? colors.error :
                             followUp.priority === 'Medium' ? colors.warning :
                             colors.success
                    }]}>
                      {followUp.priority}
                    </Text>
                  </View>
                </View>
                <Text style={styles.followUpPurpose}>{followUp.purpose}</Text>
                <Text style={styles.followUpDate}>
                  {new Date(followUp.followUpDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Health Categories */}
        <View style={styles.ehrCard}>
          <Text style={styles.sectionTitle}>Health Categories</Text>
          <View style={styles.ehrCategoriesGrid}>
            {[
              { icon: '🩺', name: 'Medical History', available: true },
              { icon: '🧪', name: 'Test Results', available: true },
              { icon: '💊', name: 'Prescriptions', available: true },
              { icon: '💉', name: 'Vaccinations', available: true },
              { icon: '🫀', name: 'Vitals', available: true },
              { icon: '📋', name: 'Reports', available: true },
            ].map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryCard}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
                {category.available && (
                  <View style={styles.availableBadge}>
                    <Ionicons name="checkmark" size={12} color={colors.textWhite} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderAppointmentsContent = () => (
    <View style={styles.appointmentsContainer}>
      <View style={styles.appointmentsHeader}>
        <Text style={styles.appointmentsTitle}>My Appointments</Text>
        <Text style={styles.appointmentsSubtitle}>Track your healthcare appointments</Text>
        
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
            <Text style={[styles.statNumber, { color: '#d97706' }]}>
              {statusCounts.pending}
            </Text>
            <Text style={styles.statLabel}>PENDING</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#dcfce7' }]}>
            <Text style={[styles.statNumber, { color: '#16a34a' }]}>
              {statusCounts.accepted}
            </Text>
            <Text style={styles.statLabel}>ACCEPTED</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#dbeafe' }]}>
            <Text style={[styles.statNumber, { color: '#2563eb' }]}>
              {statusCounts.completed}
            </Text>
            <Text style={styles.statLabel}>COMPLETED</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#fee2e2' }]}>
            <Text style={[styles.statNumber, { color: '#dc2626' }]}>
              {statusCounts.rejected}
            </Text>
            <Text style={styles.statLabel}>REJECTED</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.appointmentsList}>
        {bookings.length === 0 ? (
          renderEmptyState()
        ) : (
          bookings.map((booking) => (
            <View key={booking.id.toString()}>
              {renderBookingCard({ item: booking })}
            </View>
          ))
        )}
      </View>
    </View>
  );

  const renderCategoriesContent = () => (
    <View style={styles.contentContainer}>
      <View style={styles.categoriesCard}>
        <View style={styles.categoriesHeader}>
          <Ionicons name="filter" size={32} color="#3b82f6" />
          <Text style={styles.categoriesTitle}>Medical Categories</Text>
        </View>
        <Text style={styles.categoriesDescription}>
          Browse hospitals by medical specialties and categories.
        </Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryCard,
                selectedCategory === category.key && styles.categoryCardActive
              ]}
              onPress={() => {
                setSelectedCategory(category.key);
                setActiveTab('search'); // Switch back to search tab after selection
              }}
            >
              <Ionicons 
                name="medical" 
                size={24} 
                color={selectedCategory === category.key ? '#2563eb' : '#64748b'} 
              />
              <Text style={[
                styles.categoryCardText,
                selectedCategory === category.key && styles.categoryCardTextActive
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderNearbyHospitals = () => {
    const nearbyHospitals = hospitals.slice(1, 9); // Show 8 hospitals like in home screen
    
    return (
      <View style={styles.nearbySection}>
        <View style={styles.nearbySectionHeader}>
          <Text style={styles.nearbySectionTitle}>Nearby Hospitals</Text>
          <Text style={styles.nearbySectionSubtitle}>
            Book appointments with hospitals near you
          </Text>
        </View>

        <View style={styles.nearbyHospitalsContainer}>
          <View style={styles.nearbyHospitalsList}>
            {Array.from({ 
              length: Math.ceil(nearbyHospitals.length / 4) 
            }, (_, rowIndex) => (
              <View key={rowIndex} style={styles.nearbyHospitalsRow}>
                {nearbyHospitals.slice(rowIndex * 4, (rowIndex + 1) * 4).map((hospital) => (
                  <View key={hospital.id} style={styles.nearbyHospitalCard}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('BookAppointment', { hospital })}
                      style={styles.nearbyHospitalTouchable}
                      activeOpacity={0.8}
                    >
                      <View style={styles.nearbyHospitalGradient}>
                        <View style={styles.nearbyHospitalImageContainer}>
                          <Image
                            source={{ uri: hospital.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&fit=crop&crop=center' }}
                            style={styles.nearbyHospitalImage}
                          />
                          <View style={styles.nearbyRatingBadge}>
                            <Ionicons name="star" size={12} color="#FFC107" />
                            <Text style={styles.nearbyRatingText}>{hospital.rating}</Text>
                          </View>
                          <View style={styles.nearbyDistanceBadge}>
                            <Ionicons name="location" size={10} color="#fff" />
                            <Text style={styles.nearbyDistanceText}>
                              {(Math.random() * 5 + 0.5).toFixed(1)} km
                            </Text>
                          </View>
                        </View>

                        <View style={styles.nearbyHospitalContent}>
                          <View style={styles.nearbyHospitalInfo}>
                            <Text style={styles.nearbyHospitalName} numberOfLines={2}>
                              {hospital.name}
                            </Text>
                            <Text style={styles.nearbyHospitalSpecialization} numberOfLines={1}>
                              {hospital.specialization}
                            </Text>
                            
                            <View style={styles.nearbyHospitalLocationRow}>
                              <Ionicons name="location-outline" size={12} color="#64748b" />
                              <Text style={styles.nearbyHospitalLocation} numberOfLines={1}>
                                {hospital.address}
                              </Text>
                            </View>

                            {hospital.visitorsCount && (
                              <View style={styles.nearbyHospitalVisitorsRow}>
                                <Ionicons name="people-outline" size={12} color="#3b82f6" />
                                <Text style={styles.nearbyHospitalVisitorsText}>
                                  {hospital.visitorsCount >= 1000 
                                    ? `${(hospital.visitorsCount / 1000).toFixed(1)}K` 
                                    : hospital.visitorsCount} visitors
                                </Text>
                              </View>
                            )}

                            <View style={styles.nearbyHospitalFeatures}>
                              <View style={styles.nearbyFeatureTag}>
                                <Ionicons name="time-outline" size={10} color="#059669" />
                                <Text style={styles.nearbyFeatureText}>24/7</Text>
                              </View>
                            </View>
                          </View>

                          <View style={styles.nearbyTravelTimeContainer}>
                            <View style={styles.nearbyTravelTimeInfo}>
                              <Ionicons name="time-outline" size={16} color="#3b82f6" />
                              <Text style={styles.nearbyTravelTimeText}>
                                {Math.floor(Math.random() * 20) + 5} min
                              </Text>
                            </View>
                            <TouchableOpacity 
                              style={styles.nearbyDirectionsButton}
                              onPress={() => navigation.navigate('BookAppointment', { hospital })}
                            >
                              <Ionicons name="navigate-outline" size={14} color="#3b82f6" />
                              <Text style={styles.nearbyDirectionsText}>Book</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  if (loading && activeTab === 'appointments') {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="hourglass-outline" size={48} color={colors.primary} />
        <Text style={styles.loadingText}>Loading appointments...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={true}
      contentContainerStyle={styles.scrollContainer}
    >
      {/* Tab Navigation */}
      {renderTabNavigation()}
      
      {/* Search Bar and Filters - Show only for search tab */}
      {activeTab === 'search' && (
        <>
          {renderSearchBar()}
          {renderFilters()}
        </>
      )}
      
      {/* Content based on active tab */}
      {activeTab === 'search' && renderSearchContent()}
      {activeTab === 'ehr' && renderEHRContent()}
      {activeTab === 'appointments' && renderAppointmentsContent()}
      {activeTab === 'categories' && renderCategoriesContent()}
      
      {/* Categories Dropdown */}
      {showCategoriesModal && (
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoriesModal(false)}
        >
          <View style={styles.dropdownContainer}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Select Category</Text>
              <TouchableOpacity 
                onPress={() => setShowCategoriesModal(false)}
                style={styles.dropdownCloseButton}
              >
                <Ionicons name="close" size={18} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.dropdownContent} 
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {/* All Categories Option */}
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  selectedCategory === 'all' && styles.dropdownItemSelected
                ]}
                onPress={() => {
                  setSelectedCategory('all');
                  setShowCategoriesModal(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.dropdownItemText,
                  selectedCategory === 'all' && styles.dropdownItemTextSelected
                ]}>All Categories</Text>
              </TouchableOpacity>
              
              {/* Separator */}
              <View style={styles.dropdownSeparator} />
              
              {categories.map((category, index) => {
                const isSelected = selectedCategory === category.key;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dropdownItem,
                      isSelected && styles.dropdownItemSelected
                    ]}
                    onPress={() => {
                      setSelectedCategory(category.key);
                      setShowCategoriesModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      isSelected && styles.dropdownItemTextSelected
                    ]}>{category.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      )}

      {/* EHR Detail Modal */}
      <Modal
        visible={ehrModalVisible}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={closeEHRModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>EHR Details</Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeEHRModal}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {selectedEHR ? (
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Patient Information</Text>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Rapha ID:</Text>
                  <Text style={styles.modalValue}>{selectedEHR.raphaId}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Patient Name:</Text>
                  <Text style={styles.modalValue}>{selectedEHR.patientFullName}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Appointment:</Text>
                  <Text style={styles.modalValue}>{new Date(selectedEHR.appointmentDateTime).toLocaleString()}</Text>
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Vitals</Text>
                <Text style={styles.modalValue}>BP: {selectedEHR.patientBasicVitals.bloodPressure.systolic}/{selectedEHR.patientBasicVitals.bloodPressure.diastolic} mmHg</Text>
                <Text style={styles.modalValue}>Sugar: {selectedEHR.patientBasicVitals.sugarReading} mg/dL</Text>
                <Text style={styles.modalValue}>Weight: {selectedEHR.patientBasicVitals.weight} kg</Text>
                {selectedEHR.patientBasicVitals.height && (
                  <Text style={styles.modalValue}>Height: {selectedEHR.patientBasicVitals.height} cm</Text>
                )}
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Health Issue</Text>
                <Text style={styles.modalText}>{selectedEHR.healthIssue}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Doctor's Resolution</Text>
                <Text style={styles.modalText}>{selectedEHR.doctorResolution}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Prescribed Medications</Text>
                {selectedEHR.medicinesPrescription.map((med) => (
                  <View key={med.id} style={styles.medicationItem}>
                    <Text style={styles.medicationName}>{med.medicineName}</Text>
                    <Text style={styles.medicationDosage}>{med.dosage} — {med.frequency}</Text>
                    <Text style={styles.medicationInstructions}>{med.instructions}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Diagnostic Reports</Text>
                {selectedEHR.diagnosticReports.map((rep) => (
                  <View key={rep.id} style={styles.diagnosticItem}>
                    <Text style={styles.diagnosticName}>{rep.testName} — <Text style={styles.diagnosticStatus}>{rep.status}</Text></Text>
                    <Text style={styles.diagnosticResults}>{rep.results}</Text>
                    {rep.normalRange && <Text style={styles.diagnosticRange}>Normal: {rep.normalRange}</Text>}
                    <Text style={styles.diagnosticDate}>Date: {rep.reportDate}</Text>
                  </View>
                ))}
              </View>

              {selectedEHR.surgeryDescription && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Surgery</Text>
                  <Text style={styles.modalText}>{selectedEHR.surgeryDescription.surgeryType}</Text>
                  <Text style={styles.modalText}>{selectedEHR.surgeryDescription.description}</Text>
                </View>
              )}

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Final Remarks</Text>
                <Text style={styles.modalText}>{selectedEHR.finalRemarks}</Text>
              </View>

              <View style={[styles.modalSection, { marginBottom: 40 }]}>
                <Text style={styles.modalSectionTitle}>Attending Physician</Text>
                <Text style={styles.modalValue}>{selectedEHR.doctorName}</Text>
                <Text style={styles.modalText}>Record Created: {new Date(selectedEHR.createdAt).toLocaleString()}</Text>
              </View>

            </ScrollView>
          ) : (
            <View style={styles.noRecordsContainer}>
              <Text style={styles.noRecordsText}>No EHR selected</Text>
            </View>
          )}
        </View>
      </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Enhanced Tab Navigation
  tabNavigation: {
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  tabGradient: {
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  tabItemActive: {
    backgroundColor: 'transparent',
  },
  tabContent: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: -8,
    left: '20%',
    right: '20%',
    height: 3,
    backgroundColor: '#2563eb',
    borderRadius: 2,
  },
  
  // Premium Search Bar
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  searchGradient: {
    borderRadius: 16,
    padding: 2,
  },
  searchBarWrapper: {
    position: 'relative',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  searchIconContainer: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  clearButton: {
    marginLeft: 8,
  },
  clearButtonInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchShadow: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 14,
    zIndex: -1,
  },
  
  // Categories Button
  categoriesButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  categoriesButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    gap: 8,
  },
  categoriesButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  
  // Enhanced Filters
  filtersContainer: {
    backgroundColor: 'transparent',
    paddingBottom: 16,
  },
  filtersScroll: {
    paddingHorizontal: 20,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  filterChipActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.15,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  filterChipTextActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
  
  // Content Areas
  contentContainer: {
    paddingHorizontal: 20,
  },
  
  // Grid Layout Styles
  providerSection: {
    marginBottom: 24,
  },
  providerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  providerCardWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    marginVertical: 16,
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statItem: {
    alignItems: 'center',
  },
  
  // Compact Provider Cards for Grid
  compactCardContainer: {
    marginBottom: 8,
  },
  compactCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  compactCardGradient: {
    padding: 12,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  compactImageContainer: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  compactImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  compactIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  compactRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  compactRatingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400e',
  },
  compactContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  compactName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 16,
    marginBottom: 4,
  },
  compactSpecialization: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '600',
    marginBottom: 6,
  },
  compactLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactAddress: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
    flex: 1,
  },
  compactAction: {
    marginTop: 8,
  },
  compactActionGradient: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  compactActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },

  // Premium Provider Cards (detailed view)
  providerCardContainer: {
    marginBottom: 16,
  },
  providerCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  providerCardGradient: {
    padding: 20,
    position: 'relative',
  },
  providerCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  providerTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  providerBadge: {
    alignItems: 'flex-end',
    gap: 8,
  },
  providerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400e',
  },
  providerTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  providerTypeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Card Content
  providerCardContent: {
    gap: 12,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 24,
  },
  providerSpecialization: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  providerDetails: {
    gap: 8,
  },
  providerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  providerAddress: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    flex: 1,
  },
  operatingHours: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  operatingHoursText: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '600',
  },
  providerContact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  providerContactText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  
  // Action Button
  providerActions: {
    marginTop: 16,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  
  // Card Shadow Effect
  providerCardShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(59, 130, 246, 0.02)',
    borderRadius: 20,
    zIndex: -1,
  },
  
  // Section Headers (merged with EHR / enhanced section styles below to avoid duplicate keys)
  
  // Enhanced EHR Content
  ehrCard: {
    margin: 16,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  ehrHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ehrTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 16,
  },
  ehrDescription: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    fontWeight: '500',
  },
  ehrFeatures: {
    marginBottom: 24,
  },
  ehrFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  ehrFeatureText: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '600',
  },
  ehrButton: {
    marginTop: 16,
  },
  ehrButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  ehrButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
  },

  // New EHR Components Styles
  ehrStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  ehrStatCard: {
    flex: 1,
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  ehrStatNumber: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold' as const,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  ehrStatLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  viewAllText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '500' as const,
  },
  healthSummaryCard: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.sm,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  summaryDate: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  vitalsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  vitalItem: {
    alignItems: 'center',
    flex: 1,
  },
  vitalLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  vitalValue: {
    fontSize: fontSize.lg,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  vitalStatus: {
    fontSize: fontSize.xs,
    fontWeight: '500' as const,
  },
  conditionInfo: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  conditionLabel: {
    fontSize: fontSize.sm,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  conditionText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  ehrRecordCard: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  recordHeader: {
    marginBottom: spacing.md,
  },
  recordTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  recordRaphaId: {
    fontSize: fontSize.lg,
    fontWeight: '600' as const,
    color: colors.primary,
    flex: 1,
  },
  recordStatusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  recordStatusText: {
    fontSize: fontSize.xs,
    fontWeight: '500' as const,
  },
  recordDate: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  recordPatient: {
    fontSize: fontSize.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  recordIssue: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  recordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  recordVitals: {
    flex: 1,
  },
  recordVitalText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  recordMeta: {
    alignItems: 'flex-end',
  },
  recordDoctor: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  recordMedCount: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '500' as const,
  },
  noRecordsContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
  },
  noRecordsText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  followUpCard: {
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  followUpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  followUpPatient: {
    fontSize: fontSize.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  priorityText: {
    fontSize: fontSize.xs,
    fontWeight: '500' as const,
  },
  followUpPurpose: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  followUpDate: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  ehrCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  ehrCategoryCard: {
    width: (Dimensions.get('window').width - spacing.xl * 2 - spacing.md * 3) / 3,
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    position: 'relative',
    ...shadows.sm,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  categoryName: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  availableBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Enhanced Appointments Content
  appointmentsContainer: {},
  appointmentsList: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  appointmentsHeader: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  appointmentsTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 8,
  },
  appointmentsSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    flex: 1,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Enhanced Empty States
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#475569',
    marginVertical: 20,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  loadingText: {
    fontSize: 18,
    color: '#64748b',
    marginTop: 20,
    fontWeight: '600',
  },
  
  // Dropdown Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 120,
    paddingRight: 20,
    zIndex: 1000,
  },
  dropdownContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    minWidth: 250,
    maxWidth: 300,
    maxHeight: 400,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: 0.3,
  },
  dropdownCloseButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownContent: {
    maxHeight: 320,
    paddingVertical: 8,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  dropdownItemTextSelected: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  dropdownSeparator: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 4,
    marginHorizontal: 12,
  },
  
  // Categories Content Styles
  categoriesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  categoriesHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  categoriesTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 12,
  },
  categoriesDescription: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryCardActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  categoryCardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  categoryCardTextActive: {
    color: '#2563eb',
  },
  
  // Nearby Hospitals Styles
  nearbySection: {
    marginTop: 24,
  },
  nearbySectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  nearbySectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  nearbySectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  nearbyHospitalsContainer: {
    paddingHorizontal: 12,
  },
  nearbyHospitalsList: {
    gap: 12,
  },
  nearbyHospitalsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nearbyHospitalCard: {
    flex: 1,
    minWidth: 0,
  },
  nearbyHospitalTouchable: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  nearbyHospitalGradient: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  nearbyHospitalImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  nearbyHospitalImage: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  nearbyRatingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  nearbyRatingText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1e293b',
  },
  nearbyDistanceBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  nearbyDistanceText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  nearbyHospitalContent: {
    gap: 12,
  },
  nearbyHospitalInfo: {
    gap: 6,
  },
  nearbyHospitalName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 18,
  },
  nearbyHospitalSpecialization: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
  },
  nearbyHospitalLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nearbyHospitalLocation: {
    fontSize: 11,
    color: '#64748b',
    flex: 1,
  },
  nearbyHospitalVisitorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nearbyHospitalVisitorsText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  nearbyHospitalFeatures: {
    flexDirection: 'row',
    gap: 6,
  },
  nearbyFeatureTag: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  nearbyFeatureText: {
    fontSize: 9,
    color: '#059669',
    fontWeight: '600',
  },
  nearbyTravelTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  nearbyTravelTimeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nearbyTravelTimeText: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '600',
  },
  nearbyDirectionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  nearbyDirectionsText: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '600',
  },

  // EHR Detail Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  modalTitle: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold' as const,
    color: colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    fontWeight: 'bold' as const,
  },
  modalContent: {
    flex: 1,
    padding: spacing.xl,
  },
  modalSection: {
    marginBottom: spacing.xxl,
  },
  modalSectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  modalRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    marginBottom: spacing.sm,
    gap: Platform.OS === 'web' ? spacing.md : spacing.xs,
  },
  modalLabel: {
    fontSize: fontSize.md,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    ...(Platform.OS === 'web' && { minWidth: 120 }),
  },
  modalValue: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: '400' as const,
  },
  modalText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  medicationItem: {
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  medicationName: {
    fontSize: fontSize.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  medicationDosage: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '500' as const,
    marginBottom: spacing.xs,
  },
  medicationInstructions: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  diagnosticItem: {
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  diagnosticName: {
    fontSize: fontSize.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  diagnosticStatus: {
    fontSize: fontSize.md,
    fontWeight: '500' as const,
    color: colors.warning,
  },
  diagnosticResults: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  diagnosticRange: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  diagnosticDate: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
});