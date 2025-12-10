import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TextInput, TouchableOpacity, ScrollView, Platform, Dimensions, Animated, Image, Modal, Alert } from 'react-native';
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
import * as Location from 'expo-location';

interface MyBookingsScreenProps {
  userData: UserData;
  navigation: any;
}

type ActiveTab = 'search' | 'ehr' | 'appointments' | 'categories';
type FilterCategory = 'all' | 'cardiology' | 'neurology' | 'orthopedics' | 'pediatrics' | 'dermatology' | 'gastroenterology' | 'radiology' | 'pathology';
type ProviderType = 'all' | 'topRated' | 'lowToHigh' | 'highToLow' | 'rating' | 'arogyaSree' | 'insurance' | 'visitors';


export const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({ userData, navigation }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<ProviderType>('all');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));

  const [cancelledAppointments, setCancelledAppointments] = useState<number[]>([]);
  // EHR detail modal state
  const [selectedEHR, setSelectedEHR] = useState<EHRRecord | null>(null);
  const [ehrModalVisible, setEhrModalVisible] = useState(false);
  // EHR records state
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [displayedRecordsCount, setDisplayedRecordsCount] = useState(3);
  
  // Utility function to ensure doctor name is displayed correctly
  const formatDoctorName = (name: string) => {
    // If name already starts with "Dr.", return as is
    // Otherwise, add "Dr." prefix
    return name.startsWith('Dr.') ? name : `Dr. ${name}`;
  };
  
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Professional Categories data with enhanced icons and colors
  const categories = [
    { 
      key: 'cardiology' as FilterCategory, 
      label: 'Cardiology', 
      icon: 'heart', 
      color: '#dc2626', 
      bgColor: '#fef2f2',
      gradient: ['#fee2e2', '#fecaca'],
      description: 'Heart & Cardiovascular'
    },
    { 
      key: 'neurology' as FilterCategory, 
      label: 'Neurology', 
      icon: 'pulse', 
      color: '#7c3aed', 
      bgColor: '#f5f3ff',
      gradient: ['#ede9fe', '#ddd6fe'],
      description: 'Brain & Nervous System'
    },
    { 
      key: 'orthopedics' as FilterCategory, 
      label: 'Orthopedics', 
      icon: 'fitness', 
      color: '#059669', 
      bgColor: '#ecfdf5',
      gradient: ['#d1fae5', '#a7f3d0'],
      description: 'Bones & Joints'
    },
    { 
      key: 'pediatrics' as FilterCategory, 
      label: 'Pediatrics', 
      icon: 'happy', 
      color: '#f59e0b', 
      bgColor: '#fffbeb',
      gradient: ['#fef3c7', '#fde68a'],
      description: 'Children\'s Healthcare'
    },
    { 
      key: 'dermatology' as FilterCategory, 
      label: 'Dermatology', 
      icon: 'sunny', 
      color: '#ea580c', 
      bgColor: '#fff7ed',
      gradient: ['#fed7aa', '#fdba74'],
      description: 'Skin & Beauty'
    },
    { 
      key: 'gastroenterology' as FilterCategory, 
      label: 'Gastroenterology', 
      icon: 'nutrition', 
      color: '#0891b2', 
      bgColor: '#ecfeff',
      gradient: ['#cffafe', '#a5f3fc'],
      description: 'Digestive System'
    },
    { 
      key: 'radiology' as FilterCategory, 
      label: 'Radiology', 
      icon: 'scan', 
      color: '#2563eb', 
      bgColor: '#eff6ff',
      gradient: ['#dbeafe', '#bfdbfe'],
      description: 'Medical Imaging'
    },
    { 
      key: 'pathology' as FilterCategory, 
      label: 'Pathology', 
      icon: 'flask', 
      color: '#9333ea', 
      bgColor: '#faf5ff',
      gradient: ['#f3e8ff', '#e9d5ff'],
      description: 'Lab Tests & Analysis'
    },
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
      
      // Update cancelled appointments list
      const cancelledIds = sortedBookings
        .filter(booking => booking.status === 'Cancelled')
        .map(booking => booking.id);
      setCancelledAppointments(cancelledIds);
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

  // Cancel appointment function
  const cancelAppointment = async (bookingId: number) => {
    try {
      // Update booking status to 'Cancelled'
      const allBookings = await storage.getBookings();
      const updatedBookings = allBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'Cancelled' as const }
          : booking
      );
      
      // Save updated bookings
      await storage.saveBookings(updatedBookings);
      
      // Add to cancelled appointments list for UI updates
      setCancelledAppointments(prev => [...prev, bookingId]);
      
      // Reload bookings to reflect changes
      await loadBookings();
    } catch (error) {
      console.error('Error canceling appointment:', error);
    }
  };

  // Clear cancelled appointments function
  const clearCancelledAppointments = async () => {
    try {
      // Get all bookings and filter out cancelled ones
      const allBookings = await storage.getBookings();
      const activeBookings = allBookings.filter(booking => booking.status !== 'Cancelled');
      
      // Save filtered bookings
      await storage.saveBookings(activeBookings);
      
      // Clear cancelled appointments list
      setCancelledAppointments([]);
      
      // Reload bookings to reflect changes
      await loadBookings();
    } catch (error) {
      console.error('Error clearing cancelled appointments:', error);
    }
  };

  // Filter functions
  const getFilteredProviders = () => {
    let allProviders: any[] = [];

    // Always include hospitals, then apply filters
    const hospitalsWithType = hospitals.map(h => ({ ...h, type: 'hospital' }));
    allProviders = [...hospitalsWithType];
    
    // Apply filtering based on selected provider type
    if (selectedProvider === 'topRated') {
      // Sort by rating (highest first)
      allProviders = allProviders.sort((a, b) => b.rating - a.rating);
    } else if (selectedProvider === 'lowToHigh') {
      // Sort by OP Fee (Low to High) - using a mock OP fee based on rating
      allProviders = allProviders.sort((a, b) => {
        const feeA = Math.round(a.rating * 200); // Mock OP fee calculation
        const feeB = Math.round(b.rating * 200);
        return feeA - feeB;
      });
    } else if (selectedProvider === 'highToLow') {
      // Sort by OP Fee (High to Low)
      allProviders = allProviders.sort((a, b) => {
        const feeA = Math.round(a.rating * 200); // Mock OP fee calculation
        const feeB = Math.round(b.rating * 200);
        return feeB - feeA;
      });
    } else if (selectedProvider === 'rating') {
      // Sort by rating (highest first)
      allProviders = allProviders.sort((a, b) => b.rating - a.rating);
    } else if (selectedProvider === 'arogyaSree') {
      // Filter for government scheme hospitals (mock implementation)
      allProviders = allProviders.filter(h => 
        h.name.toLowerCase().includes('government') || 
        h.name.toLowerCase().includes('govt') ||
        h.specialization.toLowerCase().includes('general medicine') ||
        h.rating >= 4.0 // Assume high-rated hospitals accept govt schemes
      );
    } else if (selectedProvider === 'insurance') {
      // Filter for insurance claim hospitals (mock implementation)
      allProviders = allProviders.filter(h => 
        h.rating >= 3.8 || // Assume higher-rated hospitals accept insurance
        h.rating >= 4.5 // Highly rated hospitals likely accept insurance
      );
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
      cancelled: bookings.filter(b => b.status === 'Cancelled').length,
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
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'categories' && styles.tabItemActive]}
            onPress={() => setActiveTab('categories')}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <Ionicons 
                name={activeTab === 'categories' ? 'layers' : 'layers-outline'} 
                size={20} 
                color={activeTab === 'categories' ? '#2563eb' : '#64748b'} 
              />
              <Text style={[styles.tabText, activeTab === 'categories' && styles.tabTextActive]}>
                Categories
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'ehr' && styles.tabItemActive]}
            onPress={() => {
              setActiveTab('ehr');
              // Reset EHR display state when switching to EHR tab
              if (activeTab !== 'ehr') {
                setShowAllRecords(false);
                setDisplayedRecordsCount(3);
              }
            }}
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
          </TouchableOpacity>

        </View>
      </LinearGradient>
    </Animated.View>
  );

  // Filter Chips Component
  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
        <View style={styles.filterRow}>
          {/* New Filter Options */}
          {[
            { key: 'all', label: 'All Hospitals', icon: 'apps' },
            { key: 'topRated', label: 'Rating', icon: 'star' },
            { key: 'lowToHigh', label: 'Low→High [OP Fee]', icon: 'arrow-up' },
            { key: 'highToLow', label: 'High→Low [OP Fee]', icon: 'arrow-down' },
            { key: 'rating', label: 'Rating', icon: 'star' },
            { key: 'arogyaSree', label: 'Arogya Sree [Govt Scheme]', icon: 'shield-checkmark' },
            { key: 'insurance', label: 'Insurance Claim Hospitals', icon: 'card' }
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
        {...(Platform.OS === 'web' && {
          onMouseEnter: (e: any) => {
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.25), 0 0 0 2px rgba(59, 130, 246, 0.15)';
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
            e.currentTarget.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            e.currentTarget.style.borderRadius = '16px';
          },
          onMouseLeave: (e: any) => {
            e.currentTarget.style.boxShadow = '';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
          },
        })}
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
          <View style={[
            styles.compactRating,
            {
              backgroundColor: item.rating >= 4.5 ? '#10b981' : 
                             item.rating >= 4.0 ? '#f59e0b' : 
                             item.rating >= 3.5 ? '#ef4444' : '#6b7280'
            }
          ]}>
            <Ionicons name="star" size={12} color="#ffffff" />
            <Text style={[styles.compactRatingText, { color: '#ffffff' }]}>{item.rating}</Text>
          </View>

          {/* Card Content */}
          <View style={styles.compactContent}>
            <View style={styles.compactNameRow}>
              <Text style={styles.compactName} numberOfLines={2}>{item.name}</Text>
            </View>
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
        {title}
      </Text>
      {onViewAll && count > 0 && (
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyState = () => {
    const getEmptyStateText = () => {
      switch (selectedProvider) {
        case 'topRated':
          return {
            title: 'No Top Rated Hospitals Found',
            subtitle: 'Try adjusting your search or other filters'
          };
        case 'rating':
          return {
            title: 'No Highly Rated Hospitals Found',
            subtitle: 'Try adjusting your search criteria'
          };
        case 'arogyaSree':
          return {
            title: 'No Arogya Sree Hospitals Found',
            subtitle: 'Government scheme hospitals will appear here'
          };
        case 'insurance':
          return {
            title: 'No Insurance Claim Hospitals Found',
            subtitle: 'Insurance accepting hospitals will appear here'
          };
        default:
          return {
            title: activeTab === 'search' ? 'No Results Found' :
                   activeTab === 'ehr' ? 'No EHR Data' : 'No Bookings Yet',
            subtitle: activeTab === 'search' ? 'Try adjusting your search or filters' :
                     activeTab === 'ehr' ? 'Your electronic health records will appear here' :
                     'Book your first appointment to see it here'
          };
      }
    };

    const emptyText = getEmptyStateText();
    
    return (
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
          {emptyText.title}
        </Text>
        <Text style={styles.emptySubtitle}>
          {emptyText.subtitle}
        </Text>
      </View>
    );
  };

  // Enhanced grid layout renderer
  const renderProviderGrid = (providers: any[], title: string, onViewAll: () => void) => {
    if (providers.length === 0) return null;
    
    const displayProviders = providers.slice(0, 8); // Show 8 items (2 rows of 4)
    const rows = [];
    
    for (let i = 0; i < displayProviders.length; i += 4) {
      const rowItems = displayProviders.slice(i, i + 4);
      rows.push(rowItems);
    }

    return (
      <View style={styles.providerSection}>
        {renderSectionHeader(title, providers.length, onViewAll)}
        {/* Filters below the heading */}
        {renderFilters()}
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.providerRow}>
            {row.map((provider, index) => (
              <View key={`${provider.type}-${provider.id}`} style={styles.providerCardWrapper}>
                {renderCompactProviderCard({ item: provider, index: rowIndex * 4 + index })}
              </View>
            ))}
            {/* Fill empty slots in the last row */}
            {row.length < 4 && Array.from({ length: 4 - row.length }).map((_, emptyIndex) => (
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

    // Featured hospitals - Premium hospitals with excellent services (4.7+ rating)
    const featuredHospitals = hospitals
      .filter(h => h.rating >= 4.7 && h.address.toLowerCase().includes('vijayawada'))
      .map(h => ({ ...h, type: 'hospital' }))
      .slice(0, 4); // Show only top 4 featured hospitals

    // Top-rated hospitals - Highest rated hospitals (4.5+ rating)
    const topRatedHospitals = hospitals
      .filter(h => h.rating >= 4.5 && h.rating < 4.7 && h.address.toLowerCase().includes('vijayawada'))
      .map(h => ({ ...h, type: 'hospital' }))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5); // Show top 5

    const getSectionTitle = () => {
      switch (selectedProvider) {
        case 'topRated':
          return 'Top Rated Hospitals';
        case 'rating':
          return 'Hospitals by Rating';
        case 'lowToHigh':
          return 'Hospitals by OP Fee (Low to High)';
        case 'highToLow':
          return 'Hospitals by OP Fee (High to Low)';
        case 'arogyaSree':
          return 'Arogya Sree Hospitals';
        case 'insurance':
          return 'Insurance Claim Hospitals';
        default:
          return 'All Hospitals';
      }
    };

    return (
      <View style={styles.contentContainer}>

        {/* Featured Hospitals Section */}
        {featuredHospitals.length > 0 && renderFeaturedHospitalsSection(featuredHospitals)}

        {/* Top Hospitals Section */}
        {topRatedHospitals.length > 0 && renderTopHospitalsSection(topRatedHospitals)}

        {/* Nearby Hospitals Section */}
        {renderNearbyHospitals()}

        {/* All Hospitals Section */}
        {renderProviderGrid(
          groupedProviders.hospitals, 
          getSectionTitle(), 
          () => setSelectedProvider('all')
        )}

        {filteredProviders.length === 0 && renderEmptyState()}
      </View>
    );
  };

  const renderEHRContent = () => {
    const recentRecords = getRecentEHRRecords(showAllRecords ? ehrRecords.length : displayedRecordsCount);
    const upcomingFollowUps = getUpcomingFollowUps();

    const handleViewAll = () => {
      if (showAllRecords) {
        // Show less - go back to showing limited records
        setShowAllRecords(false);
        setDisplayedRecordsCount(3);
      } else {
        // Show all records
        setShowAllRecords(true);
        setDisplayedRecordsCount(ehrRecords.length);
      }
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Normal':
          return '#16a34a';
        case 'Abnormal':
          return '#f59e0b';
        case 'Critical':
          return '#dc2626';
        case 'Pending':
          return '#6b7280';
        default:
          return '#6b7280';
      }
    };

    const getVitalStatus = (type: string, value: number) => {
      switch (type) {
        case 'bp':
          return value <= 120 ? { status: 'Normal', color: '#16a34a' } : { status: 'High', color: '#dc2626' };
        case 'sugar':
          return value <= 140 ? { status: 'Normal', color: '#16a34a' } : { status: 'High', color: '#dc2626' };
        default:
          return { status: 'Stable', color: '#6b7280' };
      }
    };

    return (
      <ScrollView style={styles.ehrContainer} showsVerticalScrollIndicator={true} bounces={true}>
        
        {/* Enhanced Header with Gradient */}
        <LinearGradient
          colors={['#1e40af', '#3b82f6', '#60a5fa']}
          style={styles.ehrHeaderGradient}
        >
          <View style={styles.ehrHeaderContent}>
            <View style={styles.ehrHeaderTop}>
              <View style={styles.ehrHeaderLeft}>
                <View style={styles.ehrHeaderIcon}>
                  <Ionicons name="document-text" size={32} color="#ffffff" />
                </View>
                <View style={styles.ehrHeaderInfo}>
                  <Text style={styles.ehrMainTitle}>Health Records</Text>
                  <Text style={styles.ehrHeaderSubtitle}>
                    Your comprehensive medical history
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.ehrHeaderAction}>
                <Ionicons name="download-outline" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Quick Overview Stats */}
            <View style={styles.ehrQuickStats}>
              <View style={styles.ehrQuickStatItem}>
                <View style={styles.ehrQuickStatIcon}>
                  <Ionicons name="folder-open-outline" size={20} color="#7c3aed" />
                </View>
                <Text style={styles.ehrQuickStatNumber}>{ehrRecords.length}</Text>
                <Text style={styles.ehrQuickStatLabel}>Total Records</Text>
              </View>
              
              <View style={styles.ehrQuickStatItem}>
                <View style={styles.ehrQuickStatIcon}>
                  <Ionicons name="calendar-outline" size={20} color="#f59e0b" />
                </View>
                <Text style={styles.ehrQuickStatNumber}>{upcomingFollowUps.length}</Text>
                <Text style={styles.ehrQuickStatLabel}>Follow-ups</Text>
              </View>
              
              <View style={styles.ehrQuickStatItem}>
                <View style={styles.ehrQuickStatIcon}>
                  <Ionicons name="pulse-outline" size={20} color="#10b981" />
                </View>
                <Text style={styles.ehrQuickStatNumber}>
                  {ehrRecords.filter(r => r.status === 'Active').length}
                </Text>
                <Text style={styles.ehrQuickStatLabel}>Active</Text>
              </View>
              
              <View style={styles.ehrQuickStatItem}>
                <View style={styles.ehrQuickStatIcon}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#0891b2" />
                </View>
                <Text style={styles.ehrQuickStatNumber}>
                  {ehrRecords.filter(r => r.diagnosticReports.some(d => d.status === 'Normal')).length}
                </Text>
                <Text style={styles.ehrQuickStatLabel}>Normal</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Main Content Area */}
        <View style={styles.ehrMainContent}>
          
          {/* Health Summary Dashboard */}
          {recentRecords.length > 0 && (
            <View style={styles.ehrSection}>
              <View style={styles.ehrSectionHeader}>
                <View style={styles.ehrSectionHeaderLeft}>
                  <View style={styles.ehrSectionIcon}>
                    <Ionicons name="analytics-outline" size={20} color="#7c3aed" />
                  </View>
                  <Text style={styles.ehrSectionTitle}>Health Summary</Text>
                </View>
                <View style={styles.ehrHealthStatus}>
                  <View style={styles.ehrHealthIndicator} />
                  <Text style={styles.ehrHealthStatusText}>Good</Text>
                </View>
              </View>

              <View style={styles.ehrHealthDashboard}>
                {/* Latest Assessment Card */}
                <View style={styles.ehrAssessmentCard}>
                  <View style={styles.ehrAssessmentHeader}>
                    <View style={styles.ehrAssessmentLeft}>
                      <Text style={styles.ehrAssessmentTitle}>Latest Assessment</Text>
                      <Text style={styles.ehrAssessmentDate}>
                        {formatDate(recentRecords[0].appointmentDateTime)}
                      </Text>
                    </View>
                    <View style={styles.ehrAssessmentDoctor}>
                      <Ionicons name="person-circle-outline" size={20} color="#6b7280" />
                      <Text style={styles.ehrAssessmentDoctorName}>{formatDoctorName(recentRecords[0].doctorName)}</Text>
                    </View>
                  </View>

                  <View style={styles.ehrAssessmentContent}>
                    <Text style={styles.ehrAssessmentCondition}>{recentRecords[0].healthIssue}</Text>
                    <Text style={styles.ehrAssessmentResolution} numberOfLines={2}>
                      {recentRecords[0].doctorResolution}
                    </Text>
                  </View>
                </View>

                {/* Vitals Grid */}
                <View style={styles.ehrVitalsSection}>
                  <Text style={styles.ehrVitalsTitle}>Current Vitals</Text>
                  <View style={styles.ehrVitalsGrid}>
                    <View style={styles.ehrVitalCard}>
                      <View style={styles.ehrVitalHeader}>
                        <View style={[styles.ehrVitalIcon, { backgroundColor: '#fee2e2' }]}>
                          <Ionicons name="heart" size={18} color="#dc2626" />
                        </View>
                        <Text style={styles.ehrVitalLabel}>Blood Pressure</Text>
                      </View>
                      <Text style={styles.ehrVitalValue}>
                        {recentRecords[0].patientBasicVitals.bloodPressure.systolic}/
                        {recentRecords[0].patientBasicVitals.bloodPressure.diastolic}
                      </Text>
                      <Text style={styles.ehrVitalUnit}>mmHg</Text>
                      <View style={[
                        styles.ehrVitalStatusBadge,
                        { backgroundColor: getVitalStatus('bp', recentRecords[0].patientBasicVitals.bloodPressure.systolic).color + '20' }
                      ]}>
                        <Text style={[
                          styles.ehrVitalStatusText,
                          { color: getVitalStatus('bp', recentRecords[0].patientBasicVitals.bloodPressure.systolic).color }
                        ]}>
                          {getVitalStatus('bp', recentRecords[0].patientBasicVitals.bloodPressure.systolic).status}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.ehrVitalCard}>
                      <View style={styles.ehrVitalHeader}>
                        <View style={[styles.ehrVitalIcon, { backgroundColor: '#fef3c7' }]}>
                          <Ionicons name="water" size={18} color="#f59e0b" />
                        </View>
                        <Text style={styles.ehrVitalLabel}>Blood Sugar</Text>
                      </View>
                      <Text style={styles.ehrVitalValue}>
                        {recentRecords[0].patientBasicVitals.sugarReading}
                      </Text>
                      <Text style={styles.ehrVitalUnit}>mg/dL</Text>
                      <View style={[
                        styles.ehrVitalStatusBadge,
                        { backgroundColor: getVitalStatus('sugar', recentRecords[0].patientBasicVitals.sugarReading).color + '20' }
                      ]}>
                        <Text style={[
                          styles.ehrVitalStatusText,
                          { color: getVitalStatus('sugar', recentRecords[0].patientBasicVitals.sugarReading).color }
                        ]}>
                          {getVitalStatus('sugar', recentRecords[0].patientBasicVitals.sugarReading).status}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.ehrVitalCard}>
                      <View style={styles.ehrVitalHeader}>
                        <View style={[styles.ehrVitalIcon, { backgroundColor: '#dcfce7' }]}>
                          <Ionicons name="fitness" size={18} color="#16a34a" />
                        </View>
                        <Text style={styles.ehrVitalLabel}>Weight</Text>
                      </View>
                      <Text style={styles.ehrVitalValue}>
                        {recentRecords[0].patientBasicVitals.weight}
                      </Text>
                      <Text style={styles.ehrVitalUnit}>kg</Text>
                      <View style={[styles.ehrVitalStatusBadge, { backgroundColor: '#6b728020' }]}>
                        <Text style={[styles.ehrVitalStatusText, { color: '#6b7280' }]}>
                          Stable
                        </Text>
                      </View>
                    </View>

                    {recentRecords[0].patientBasicVitals.height && (
                      <View style={styles.ehrVitalCard}>
                        <View style={styles.ehrVitalHeader}>
                          <View style={[styles.ehrVitalIcon, { backgroundColor: '#e0f2fe' }]}>
                            <Ionicons name="resize" size={18} color="#0891b2" />
                          </View>
                          <Text style={styles.ehrVitalLabel}>Height</Text>
                        </View>
                        <Text style={styles.ehrVitalValue}>
                          {recentRecords[0].patientBasicVitals.height}
                        </Text>
                        <Text style={styles.ehrVitalUnit}>cm</Text>
                        <View style={[styles.ehrVitalStatusBadge, { backgroundColor: '#6b728020' }]}>
                          <Text style={[styles.ehrVitalStatusText, { color: '#6b7280' }]}>
                            Normal
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Medical Records Section */}
          <View style={styles.ehrSection}>
            <View style={styles.ehrSectionHeader}>
              <View style={styles.ehrSectionHeaderLeft}>
                <View style={[styles.ehrSectionIcon, { backgroundColor: '#dbeafe' }]}>
                  <Ionicons name="document-text-outline" size={20} color="#3b82f6" />
                </View>
                <Text style={styles.ehrSectionTitle}>
                  Medical Records ({showAllRecords ? ehrRecords.length : `${Math.min(displayedRecordsCount, ehrRecords.length)} of ${ehrRecords.length}`})
                </Text>
              </View>
              <TouchableOpacity style={styles.ehrViewAllButton} onPress={handleViewAll}>
                <Text style={styles.ehrViewAllText}>
                  {showAllRecords ? 'Show Less' : 'View All'}
                </Text>
                <Ionicons 
                  name={showAllRecords ? 'chevron-up' : 'chevron-forward'} 
                  size={16} 
                  color="#3b82f6" 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.ehrRecordsContainer}>
              {recentRecords.length > 0 ? (
                recentRecords.map((record) => (
                  <TouchableOpacity 
                    key={record.id} 
                    style={styles.ehrRecordCard} 
                    onPress={() => openEHRDetail(record)}
                    activeOpacity={0.95}
                  >
                    <View style={styles.ehrRecordHeader}>
                      <View style={styles.ehrRecordLeft}>
                        <Text style={styles.ehrRecordId}>{record.raphaId}</Text>
                        <Text style={styles.ehrRecordDate}>
                          {formatDate(record.appointmentDateTime)}
                        </Text>
                      </View>
                      <View style={[
                        styles.ehrRecordStatusBadge,
                        { backgroundColor: getStatusColor(record.status) + '20' }
                      ]}>
                        <View style={[
                          styles.ehrRecordStatusIndicator,
                          { backgroundColor: getStatusColor(record.status) }
                        ]} />
                        <Text style={[
                          styles.ehrRecordStatusText,
                          { color: getStatusColor(record.status) }
                        ]}>
                          {record.status}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.ehrRecordContent}>
                      <View style={styles.ehrRecordDoctor}>
                        <Ionicons name="person-circle-outline" size={16} color="#6b7280" />
                        <Text style={styles.ehrRecordDoctorName}>{formatDoctorName(record.doctorName)}</Text>
                      </View>
                      
                      <Text style={styles.ehrRecordCondition} numberOfLines={1}>
                        {record.healthIssue}
                      </Text>
                      
                      <View style={styles.ehrRecordMeta}>
                        <View style={styles.ehrRecordMetaItem}>
                          <Ionicons name="medical-outline" size={12} color="#9ca3af" />
                          <Text style={styles.ehrRecordMetaText}>
                            {record.medicinesPrescription.length} Medicines
                          </Text>
                        </View>
                        
                        <View style={styles.ehrRecordMetaItem}>
                          <Ionicons name="document-outline" size={12} color="#9ca3af" />
                          <Text style={styles.ehrRecordMetaText}>
                            {record.diagnosticReports.length} Tests
                          </Text>
                        </View>
                      </View>
                    </View>
                    
                    <View style={styles.ehrRecordAction}>
                      <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.ehrEmptyRecords}>
                  <View style={styles.ehrEmptyIcon}>
                    <Ionicons name="document-text-outline" size={48} color="#d1d5db" />
                  </View>
                  <Text style={styles.ehrEmptyTitle}>No Medical Records</Text>
                  <Text style={styles.ehrEmptySubtitle}>
                    Your medical records will appear here after appointments
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Upcoming Follow-ups */}
          {upcomingFollowUps.length > 0 && (
            <View style={styles.ehrSection}>
              <View style={styles.ehrSectionHeader}>
                <View style={styles.ehrSectionHeaderLeft}>
                  <View style={[styles.ehrSectionIcon, { backgroundColor: '#fef3c7' }]}>
                    <Ionicons name="calendar-outline" size={20} color="#f59e0b" />
                  </View>
                  <Text style={styles.ehrSectionTitle}>Upcoming Follow-ups</Text>
                </View>
                <View style={styles.ehrFollowUpCount}>
                  <Text style={styles.ehrFollowUpCountText}>{upcomingFollowUps.length}</Text>
                </View>
              </View>
              
              <View style={styles.ehrFollowUpsList}>
                {upcomingFollowUps.slice(0, 3).map((followUp, index) => (
                  <View key={index} style={styles.ehrFollowUpCard}>
                    <View style={styles.ehrFollowUpHeader}>
                      <View style={styles.ehrFollowUpLeft}>
                        <Text style={styles.ehrFollowUpPurpose}>{followUp.purpose}</Text>
                        <Text style={styles.ehrFollowUpDate}>
                          {new Date(followUp.followUpDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                      
                      <View style={[
                        styles.ehrFollowUpPriority,
                        {
                          backgroundColor: followUp.priority === 'High' ? '#fee2e2' :
                                         followUp.priority === 'Medium' ? '#fef3c7' : '#dcfce7'
                        }
                      ]}>
                        <Text style={[
                          styles.ehrFollowUpPriorityText,
                          {
                            color: followUp.priority === 'High' ? '#dc2626' :
                                   followUp.priority === 'Medium' ? '#f59e0b' : '#16a34a'
                          }
                        ]}>
                          {followUp.priority}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.ehrFollowUpActions}>
                      <TouchableOpacity style={styles.ehrFollowUpActionButton}>
                        <Ionicons name="calendar-outline" size={14} color="#6b7280" />
                        <Text style={styles.ehrFollowUpActionText}>Reschedule</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity style={[styles.ehrFollowUpActionButton, styles.ehrFollowUpPrimaryButton]}>
                        <Ionicons name="checkmark-outline" size={14} color="#3b82f6" />
                        <Text style={[styles.ehrFollowUpActionText, styles.ehrFollowUpPrimaryText]}>Confirm</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Health Categories Grid */}
          <View style={[styles.ehrSection, { marginBottom: 40 }]}>
            <View style={styles.ehrSectionHeader}>
              <View style={styles.ehrSectionHeaderLeft}>
                <View style={[styles.ehrSectionIcon, { backgroundColor: '#f3f4f6' }]}>
                  <Ionicons name="grid-outline" size={20} color="#4b5563" />
                </View>
                <Text style={styles.ehrSectionTitle}>Health Categories</Text>
              </View>
            </View>
            
            <View style={styles.ehrCategoriesGrid}>
              {[
                { icon: 'heart-outline', name: 'Cardiology', count: 3, color: '#dc2626', bgColor: '#fee2e2' },
                { icon: 'medical-outline', name: 'General', count: 5, color: '#3b82f6', bgColor: '#dbeafe' },
                { icon: 'flask-outline', name: 'Lab Tests', count: 8, color: '#059669', bgColor: '#d1fae5' },
                { icon: 'eye-outline', name: 'Radiology', count: 2, color: '#7c3aed', bgColor: '#ede9fe' },
                { icon: 'fitness-outline', name: 'Physical', count: 4, color: '#f59e0b', bgColor: '#fef3c7' },
                { icon: 'bandage-outline', name: 'Surgery', count: 1, color: '#dc2626', bgColor: '#fee2e2' },
              ].map((category, index) => (
                <TouchableOpacity key={index} style={styles.ehrCategoryCard}>
                  <View style={[styles.ehrCategoryIcon, { backgroundColor: category.bgColor }]}>
                    <Ionicons name={category.icon as any} size={20} color={category.color} />
                  </View>
                  <Text style={styles.ehrCategoryName}>{category.name}</Text>
                  <Text style={styles.ehrCategoryCount}>{category.count} records</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
        </View>
      </ScrollView>
    );
  };

  const renderAppointmentsContent = () => {
    const upcomingBookings = bookings.filter(b => b.status === 'Accepted' || b.status === 'Pending');
    const completedBookings = bookings.filter(b => b.status === 'Completed');
    const recentBookings = bookings.slice(0, 3);

    return (
      <ScrollView 
        style={styles.appointmentsContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Enhanced Header with Gradient */}
        <LinearGradient
          colors={['#1e40af', '#3b82f6', '#60a5fa']}
          style={styles.appointmentsHeaderGradient}
        >
          <View style={styles.appointmentsHeaderContent}>
            <View style={styles.appointmentsHeaderTop}>
              <View style={styles.appointmentsHeaderLeft}>
                <Text style={styles.appointmentsMainTitle}>My Appointments</Text>
                <Text style={styles.appointmentsHeaderSubtitle}>
                  Manage your healthcare journey
                </Text>
              </View>
              <View style={styles.appointmentsHeaderIcon}>
                <Ionicons name="calendar" size={32} color="#ffffff" />
              </View>
            </View>

            {/* Quick Stats Overview */}
            <View style={styles.quickStatsContainer}>
              <View style={styles.quickStatItem}>
                <View style={styles.quickStatIconContainer}>
                  <Ionicons name="time-outline" size={20} color="#fbbf24" />
                </View>
                <Text style={styles.quickStatNumber}>{statusCounts.pending}</Text>
                <Text style={styles.quickStatLabel}>Pending</Text>
              </View>
              
              <View style={styles.quickStatItem}>
                <View style={styles.quickStatIconContainer}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
                </View>
                <Text style={styles.quickStatNumber}>{statusCounts.accepted}</Text>
                <Text style={styles.quickStatLabel}>Accepted</Text>
              </View>
              
              <View style={styles.quickStatItem}>
                <View style={styles.quickStatIconContainer}>
                  <Ionicons name="medal-outline" size={20} color="#3b82f6" />
                </View>
                <Text style={styles.quickStatNumber}>{statusCounts.completed}</Text>
                <Text style={styles.quickStatLabel}>Completed</Text>
              </View>
              
              <View style={styles.quickStatItem}>
                <View style={styles.quickStatIconContainer}>
                  <Ionicons name="ban-outline" size={20} color="#6b7280" />
                </View>
                <Text style={styles.quickStatNumber}>{statusCounts.cancelled}</Text>
                <Text style={styles.quickStatLabel}>Cancelled</Text>
              </View>
            </View>

            {/* Clear Cancelled Appointments Button */}
            {statusCounts.cancelled > 0 && (
              <View style={styles.clearButtonContainer}>
                <TouchableOpacity 
                  style={styles.clearCancelledButton}
                  onPress={clearCancelledAppointments}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  <Text style={styles.clearCancelledText}>
                    Clear {statusCounts.cancelled} Cancelled Appointment{statusCounts.cancelled > 1 ? 's' : ''}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* Main Content Area */}
        <View style={styles.appointmentsMainContent}>
          
          {/* Upcoming Appointments Section */}
          {upcomingBookings.length > 0 && (
            <View style={styles.appointmentSection}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionHeaderLeft}>
                  <View style={styles.sectionIconContainer}>
                    <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
                  </View>
                  <Text style={styles.appointmentSectionTitle}>Upcoming Appointments</Text>
                </View>
                <View style={styles.sectionBadge}>
                  <Text style={styles.sectionBadgeText}>{upcomingBookings.length}</Text>
                </View>
              </View>
              
              <View style={styles.appointmentCards}>
                {upcomingBookings.slice(0, 3).map((booking) => (
                  <View key={booking.id} style={styles.enhancedAppointmentCard}>
                    <View style={styles.appointmentCardHeader}>
                      <View style={styles.hospitalInfo}>
                        <Text style={styles.hospitalName}>{booking.hospitalName}</Text>
                        <Text style={styles.doctorName}>{formatDoctorName(booking.doctorName)}</Text>
                      </View>
                      <View style={[
                        styles.statusBadgeEnhanced,
                        {
                          backgroundColor: booking.status === 'Accepted' ? '#dcfce7' : 
                                         booking.status === 'Cancelled' ? '#f3f4f6' :
                                         booking.status === 'Completed' ? '#f0fdf4' : '#fef3c7'
                        }
                      ]}>
                        <View style={[
                          styles.statusIndicator,
                          {
                            backgroundColor: booking.status === 'Accepted' ? '#16a34a' : 
                                           booking.status === 'Cancelled' ? '#6b7280' :
                                           booking.status === 'Completed' ? '#22c55e' : '#f59e0b'
                          }
                        ]} />
                        <Text style={[
                          styles.statusTextEnhanced,
                          {
                            color: booking.status === 'Accepted' ? '#16a34a' : 
                                 booking.status === 'Cancelled' ? '#6b7280' :
                                 booking.status === 'Completed' ? '#22c55e' : '#f59e0b'
                          }
                        ]}>
                          {booking.status}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.appointmentDetails}>
                      <View style={styles.appointmentDetailItem}>
                        <View style={styles.detailIconContainer}>
                          <Ionicons name="calendar" size={16} color="#6b7280" />
                        </View>
                        <Text style={styles.detailText}>{booking.date}</Text>
                      </View>
                      
                      <View style={styles.appointmentDetailItem}>
                        <View style={styles.detailIconContainer}>
                          <Ionicons name="time" size={16} color="#6b7280" />
                        </View>
                        <Text style={styles.detailText}>{booking.time}</Text>
                      </View>
                      
                      <View style={styles.appointmentDetailItem}>
                        <View style={styles.detailIconContainer}>
                          <Ionicons name="medical" size={16} color="#6b7280" />
                        </View>
                        <Text style={styles.detailText}>{booking.symptoms}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.appointmentCardFooter}>
                      <TouchableOpacity style={styles.actionButtonSecondary}>
                        <Ionicons name="call-outline" size={16} color="#3b82f6" />
                        <Text style={styles.actionButtonSecondaryText}>Contact</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.actionButtonPrimary, { backgroundColor: booking.status === 'Cancelled' ? '#6b7280' : '#ef4444' }]}
                        onPress={() => booking.status !== 'Cancelled' && cancelAppointment(booking.id)}
                        disabled={booking.status === 'Cancelled'}
                      >
                        <Ionicons 
                          name={booking.status === 'Cancelled' ? "checkmark-outline" : "close-outline"} 
                          size={16} 
                          color="#ffffff" 
                        />
                        <Text style={styles.actionButtonPrimaryText}>
                          {booking.status === 'Cancelled' ? 'Cancelled' : 'Cancel'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Recent History Section */}
          {completedBookings.length > 0 && (
            <View style={styles.appointmentSection}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionHeaderLeft}>
                  <View style={[styles.sectionIconContainer, { backgroundColor: '#dcfce7' }]}>
                    <Ionicons name="checkmark-done-outline" size={20} color="#16a34a" />
                  </View>
                  <Text style={styles.appointmentSectionTitle}>Recent Visits</Text>
                </View>
                <TouchableOpacity style={styles.appointmentViewAllButton}>
                  <Text style={styles.appointmentViewAllText}>View All</Text>
                  <Ionicons name="chevron-forward" size={16} color="#3b82f6" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.historyCards}>
                {completedBookings.slice(0, 2).map((booking) => (
                  <View key={booking.id} style={styles.historyCard}>
                    <View style={styles.historyCardLeft}>
                      <View style={styles.historyIconContainer}>
                        <Ionicons name="medical" size={20} color="#16a34a" />
                      </View>
                      <View style={styles.historyInfo}>
                        <Text style={styles.historyHospital}>{booking.hospitalName}</Text>
                        <Text style={styles.historyDoctor}>{formatDoctorName(booking.doctorName)}</Text>
                        <Text style={styles.historyDate}>{booking.date} • {booking.time}</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity style={styles.historyActionButton}>
                      <Ionicons name="document-text-outline" size={16} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.appointmentSection}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderLeft}>
                <View style={[styles.sectionIconContainer, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="flash-outline" size={20} color="#f59e0b" />
                </View>
                <Text style={styles.appointmentSectionTitle}>Quick Actions</Text>
              </View>
            </View>
            
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionCard}>
                <View style={[styles.quickActionIcon, { backgroundColor: '#dbeafe' }]}>
                  <Ionicons name="add-circle-outline" size={24} color="#3b82f6" />
                </View>
                <Text style={styles.quickActionTitle}>Book New</Text>
                <Text style={styles.quickActionSubtitle}>Schedule appointment</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionCard}>
                <View style={[styles.quickActionIcon, { backgroundColor: '#dcfce7' }]}>
                  <Ionicons name="repeat-outline" size={24} color="#16a34a" />
                </View>
                <Text style={styles.quickActionTitle}>Reschedule</Text>
                <Text style={styles.quickActionSubtitle}>Change timing</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionCard}>
                <View style={[styles.quickActionIcon, { backgroundColor: '#fce7f3' }]}>
                  <Ionicons name="medical-outline" size={24} color="#ec4899" />
                </View>
                <Text style={styles.quickActionTitle}>Prescriptions</Text>
                <Text style={styles.quickActionSubtitle}>View medicines</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionCard}>
                <View style={[styles.quickActionIcon, { backgroundColor: '#e0f2fe' }]}>
                  <Ionicons name="document-text-outline" size={24} color="#0891b2" />
                </View>
                <Text style={styles.quickActionTitle}>Reports</Text>
                <Text style={styles.quickActionSubtitle}>Lab results</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* All Appointments List */}
          {bookings.length > 0 && (
            <View style={[styles.appointmentSection, { marginBottom: 40 }]}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionHeaderLeft}>
                  <View style={[styles.sectionIconContainer, { backgroundColor: '#f3f4f6' }]}>
                    <Ionicons name="list-outline" size={20} color="#4b5563" />
                  </View>
                  <Text style={styles.appointmentSectionTitle}>All Appointments</Text>
                </View>
                <View style={styles.totalCountBadge}>
                  <Text style={styles.totalCountText}>{bookings.length}</Text>
                </View>
              </View>
              
              <View style={styles.allAppointmentsList}>
                {bookings.map((booking) => (
                  <View key={booking.id.toString()}>
                    {renderBookingCard({ item: booking })}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Empty State */}
          {bookings.length === 0 && (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIcon}>
                <Ionicons name="calendar-outline" size={80} color="#d1d5db" />
              </View>
              <Text style={styles.emptyStateTitle}>No Appointments Yet</Text>
              <Text style={styles.emptyStateSubtitle}>
                Book your first appointment to start tracking your healthcare journey
              </Text>
              <TouchableOpacity style={styles.emptyStateButton}>
                <Ionicons name="add-outline" size={20} color="#ffffff" />
                <Text style={styles.emptyStateButtonText}>Book Appointment</Text>
              </TouchableOpacity>
            </View>
          )}
          
        </View>
      </ScrollView>
    );
  };



  // Featured Hospitals Section Renderer
  const renderFeaturedHospitalsSection = (featuredHospitals: any[]) => {
    return (
      <View style={styles.topHospitalsSection}>
        <View style={styles.topHospitalsSectionHeader}>
          <View style={styles.topHospitalsHeaderLeft}>
            <View style={styles.topHospitalsIconContainer}>
              <LinearGradient
                colors={['#8b5cf6', '#7c3aed', '#6d28d9']}
                style={styles.topHospitalsIcon}
              >
                <Ionicons name="sparkles" size={20} color="#ffffff" />
              </LinearGradient>
            </View>
            <View style={styles.topHospitalsTitleContainer}>
              <Text style={styles.topHospitalsSectionTitle}>Featured Hospitals</Text>
              <Text style={styles.topHospitalsSectionSubtitle}>
                Premium healthcare providers with excellent services
              </Text>
            </View>
          </View>
          <View style={[styles.topHospitalsRatingBadge, { backgroundColor: '#f3e8ff' }]}>
            <Ionicons name="star" size={12} color="#8b5cf6" />
            <Text style={[styles.topHospitalsRatingText, { color: '#6d28d9' }]}>4.7+</Text>
          </View>
        </View>

        <View style={styles.topHospitalsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topHospitalsScrollContent}
            style={styles.topHospitalsScroll}
          >
            {featuredHospitals.map((hospital, index) => (
              <View key={hospital.id} style={styles.topHospitalCard}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('HospitalDetails', { hospital })}
                  style={styles.topHospitalTouchable}
                  activeOpacity={0.9}
                  {...(Platform.OS === 'web' && {
                    onMouseEnter: (e: any) => {
                      e.currentTarget.parentElement.style.transform = 'translateY(-6px) scale(1.02)';
                      e.currentTarget.parentElement.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                      e.currentTarget.parentElement.style.borderRadius = '20px';
                    },
                    onMouseLeave: (e: any) => {
                      e.currentTarget.parentElement.style.transform = 'translateY(0) scale(1)';
                    },
                  })}
                >
                  <View style={styles.topHospitalGradient}>
                    {/* Featured Badge */}
                    <View style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: '#8b5cf6',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 8,
                      zIndex: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                    }}>
                      <Ionicons name="sparkles" size={10} color="#ffffff" />
                      <Text style={{ fontSize: 10, fontWeight: '700', color: '#ffffff' }}>FEATURED</Text>
                    </View>

                    {/* Hospital Image */}
                    <View style={styles.topHospitalImageContainer}>
                      <Image
                        source={{ uri: hospital.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&fit=crop&crop=center' }}
                        style={styles.topHospitalImage}
                      />
                      <View style={[styles.topHospitalRating, { backgroundColor: '#8b5cf6' }]}>
                        <Ionicons name="star" size={14} color="#ffffff" />
                        <Text style={[styles.topHospitalRatingValue, { color: '#ffffff' }]}>{hospital.rating}</Text>
                      </View>
                    </View>

                    {/* Hospital Content */}
                    <View style={styles.topHospitalContent}>
                      <Text style={styles.topHospitalName} numberOfLines={2}>
                        {hospital.name}
                      </Text>
                      <Text style={styles.topHospitalSpecialization} numberOfLines={1}>
                        {hospital.specialization}
                      </Text>
                      
                      <View style={styles.topHospitalLocationRow}>
                        <Ionicons name="location-outline" size={12} color="#64748b" />
                        <Text style={styles.topHospitalLocation} numberOfLines={1}>
                          {hospital.address.split(',')[0]}
                        </Text>
                      </View>

                      {hospital.visitorsCount && (
                        <View style={styles.topHospitalVisitorsRow}>
                          <Ionicons name="people-outline" size={12} color="#8b5cf6" />
                          <Text style={styles.topHospitalVisitorsText}>
                            {hospital.visitorsCount >= 1000 
                              ? `${(hospital.visitorsCount / 1000).toFixed(1)}K` 
                              : hospital.visitorsCount} visitors
                          </Text>
                        </View>
                      )}

                      {/* Features */}
                      <View style={styles.topHospitalFeatures}>
                        <View style={styles.topHospitalFeatureTag}>
                          <Ionicons name="time-outline" size={10} color="#10b981" />
                          <Text style={styles.topHospitalFeatureText}>24/7</Text>
                        </View>
                        <View style={styles.topHospitalFeatureTag}>
                          <Ionicons name="shield-checkmark-outline" size={10} color="#8b5cf6" />
                          <Text style={styles.topHospitalFeatureText}>Premium</Text>
                        </View>
                      </View>

                      <View style={styles.nearbyTravelTimeContainer}>
                        <View style={styles.nearbyTravelTimeInfo}>
                          <Ionicons name="time-outline" size={16} color="#8b5cf6" />
                          <Text style={styles.nearbyTravelTimeText}>
                            {Math.floor(Math.random() * 20) + 5} min
                          </Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.nearbyDirectionsButton}
                          onPress={() => navigation.navigate('BookAppointment', { hospital })}
                        >
                          <Ionicons name="navigate-outline" size={14} color="#8b5cf6" />
                          <Text style={styles.nearbyDirectionsText}>Directions</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  // Top Hospitals Section Renderer
  const renderTopHospitalsSection = (topHospitals: any[]) => {
    return (
      <View style={styles.topHospitalsSection}>
        <View style={styles.topHospitalsSectionHeader}>
          <View style={styles.topHospitalsHeaderLeft}>
            <View style={styles.topHospitalsIconContainer}>
              <LinearGradient
                colors={['#fbbf24', '#f59e0b', '#d97706']}
                style={styles.topHospitalsIcon}
              >
                <Ionicons name="star" size={20} color="#ffffff" />
              </LinearGradient>
            </View>
            <View style={styles.topHospitalsTitleContainer}>
              <Text style={styles.topHospitalsSectionTitle}>Top Hospitals</Text>
              <Text style={styles.topHospitalsSectionSubtitle}>
                Highly rated hospitals in Vijayawada
              </Text>
            </View>
          </View>
          <View style={styles.topHospitalsRatingBadge}>
            <Ionicons name="star" size={12} color="#fbbf24" />
            <Text style={styles.topHospitalsRatingText}>4.5+</Text>
          </View>
        </View>

        <View style={styles.topHospitalsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topHospitalsScrollContent}
            style={styles.topHospitalsScroll}
          >
            {topHospitals.map((hospital, index) => (
              <View key={hospital.id} style={styles.topHospitalCard}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('HospitalDetails', { hospital })}
                  style={styles.topHospitalTouchable}
                  activeOpacity={0.9}
                  {...(Platform.OS === 'web' && {
                    onMouseEnter: (e: any) => {
                      e.currentTarget.parentElement.style.transform = 'translateY(-6px) scale(1.02)';
                      e.currentTarget.parentElement.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                      e.currentTarget.parentElement.style.borderRadius = '20px';
                    },
                    onMouseLeave: (e: any) => {
                      e.currentTarget.parentElement.style.transform = 'translateY(0) scale(1)';
                    },
                  })}
                >
                  <View style={styles.topHospitalGradient}>


                    {/* Hospital Image */}
                    <View style={styles.topHospitalImageContainer}>
                      <Image
                        source={{ uri: hospital.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&fit=crop&crop=center' }}
                        style={styles.topHospitalImage}
                      />
                      <View style={styles.topHospitalRating}>
                        <Ionicons name="star" size={14} color="#fbbf24" />
                        <Text style={styles.topHospitalRatingValue}>{hospital.rating}</Text>
                      </View>
                    </View>

                    {/* Hospital Content */}
                    <View style={styles.topHospitalContent}>
                      <Text style={styles.topHospitalName} numberOfLines={2}>
                        {hospital.name}
                      </Text>
                      <Text style={styles.topHospitalSpecialization} numberOfLines={1}>
                        {hospital.specialization}
                      </Text>
                      
                      <View style={styles.topHospitalLocationRow}>
                        <Ionicons name="location-outline" size={12} color="#64748b" />
                        <Text style={styles.topHospitalLocation} numberOfLines={1}>
                          {hospital.address.split(',')[0]}
                        </Text>
                      </View>

                      {hospital.rating && (
                        <View style={styles.topHospitalVisitorsRow}>
                          <Ionicons name="star" size={12} color="#f59e0b" />
                          <Text style={styles.topHospitalVisitorsText}>
                            {hospital.rating} rating
                          </Text>
                        </View>
                      )}

                      {/* Features */}
                      <View style={styles.topHospitalFeatures}>
                        <View style={styles.topHospitalFeatureTag}>
                          <Ionicons name="time-outline" size={10} color="#10b981" />
                          <Text style={styles.topHospitalFeatureText}>24/7</Text>
                        </View>
                        <View style={styles.topHospitalFeatureTag}>
                          <Ionicons name="shield-checkmark-outline" size={10} color="#3b82f6" />
                          <Text style={styles.topHospitalFeatureText}>Verified</Text>
                        </View>
                      </View>

                      <View style={styles.nearbyTravelTimeContainer}>
                        <View style={styles.nearbyTravelTimeInfo}>
                          <Ionicons name="time-outline" size={16} color="#fbbf24" />
                          <Text style={styles.nearbyTravelTimeText}>
                            {Math.floor(Math.random() * 20) + 5} min
                          </Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.nearbyDirectionsButton}
                          onPress={() => navigation.navigate('BookAppointment', { hospital })}
                        >
                          <Ionicons name="navigate-outline" size={14} color="#fbbf24" />
                          <Text style={styles.nearbyDirectionsText}>Directions</Text>
                        </TouchableOpacity>
                      </View>

                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderNearbyHospitals = () => {
    const nearbyHospitals = hospitals.slice(0, 16); // Show 16 hospitals (4 rows of 4)
    
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
                      {...(Platform.OS === 'web' && {
                        onMouseEnter: (e: any) => {
                          e.currentTarget.parentElement.style.transform = 'translateY(-4px) scale(1.02)';
                          e.currentTarget.parentElement.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                          e.currentTarget.parentElement.style.borderRadius = '16px';
                        },
                        onMouseLeave: (e: any) => {
                          e.currentTarget.parentElement.style.transform = 'translateY(0) scale(1)';
                        },
                      })}
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

                            {hospital.rating && (
                              <View style={styles.nearbyHospitalVisitorsRow}>
                                <Ionicons name="star" size={12} color="#f59e0b" />
                                <Text style={styles.nearbyHospitalVisitorsText}>
                                  {hospital.rating} rating
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
                              <Text style={styles.nearbyDirectionsText}>Directions</Text>
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

  const renderCategoriesContent = () => {
    // Responsive columns based on screen width for optimal display
    const columns = screenDimensions.width > 800 ? 4 : screenDimensions.width > 600 ? 3 : 2;
    const totalCategories = categories.length;
    
    return (
      <ScrollView 
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Enhanced Header Section */}
        <LinearGradient
          colors={['#1e40af', '#3b82f6', '#60a5fa']}
          style={styles.categoriesHeaderGradient}
        >
          <View style={styles.categoriesHeaderContent}>
            <View style={styles.categoriesHeaderTop}>
              <View style={styles.categoriesHeaderLeft}>
                <View style={styles.categoriesMainIconContainer}>
                  <LinearGradient
                    colors={['#3b82f6', '#2563eb']}
                    style={styles.categoriesMainIcon}
                  >
                    <Ionicons name="medical" size={32} color="#ffffff" />
                  </LinearGradient>
                </View>
                <View style={styles.categoriesHeaderTextContainer}>
                  <Text style={styles.categoriesMainTitle}>Medical Specialties</Text>
                  <Text style={styles.categoriesHeaderSubtitle}>
                    Expert care across {totalCategories} medical specialties
                  </Text>
                </View>
              </View>
              <View style={styles.categoriesHeaderBadge}>
                <Text style={styles.categoriesHeaderBadgeText}>{totalCategories}</Text>
              </View>
            </View>
            
            <Text style={styles.categoriesDescription}>
              Discover specialized healthcare services. Select a category to find expert doctors and hospitals in that specialty.
            </Text>
          </View>
        </LinearGradient>

        {/* Enhanced Categories Grid */}
        <View style={styles.categoriesMainContent}>
          <View style={styles.categoriesStatsRow}>
            <View style={styles.categoriesStatItem}>
              <View style={styles.categoriesStatIcon}>
                <Ionicons name="people" size={16} color="#3b82f6" />
              </View>
              <Text style={styles.categoriesStatText}>500+ Doctors</Text>
            </View>
            <View style={styles.categoriesStatItem}>
              <View style={styles.categoriesStatIcon}>
                <Ionicons name="medical" size={16} color="#059669" />
              </View>
              <Text style={styles.categoriesStatText}>24/7 Available</Text>
            </View>
            <View style={styles.categoriesStatItem}>
              <View style={styles.categoriesStatIcon}>
                <Ionicons name="shield-checkmark" size={16} color="#dc2626" />
              </View>
              <Text style={styles.categoriesStatText}>Verified Experts</Text>
            </View>
          </View>

          <View style={styles.enhancedCategoriesGrid}>
            {categories.map((category, index) => {
              const isSelected = selectedCategory === category.key;
              const isEvenIndex = index % 2 === 0;
              
              return (
                <Animated.View
                  key={category.key}
                  style={[
                    styles.enhancedCategoryCard,
                    isEvenIndex ? styles.categoryCardLeft : styles.categoryCardRight,
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedCategory(category.key);
                      setActiveTab('search');
                    }}
                    style={[
                      styles.enhancedCategoryTouchable,
                      isSelected && styles.enhancedCategoryTouchableActive
                    ]}
                    {...(Platform.OS === 'web' && {
                      onMouseEnter: (e: any) => {
                        e.currentTarget.style.boxShadow = `0 12px 32px ${(category as any).color}40, 0 0 0 2px ${(category as any).color}30`;
                        e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
                        e.currentTarget.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                        e.currentTarget.style.borderRadius = '20px';
                      },
                      onMouseLeave: (e: any) => {
                        e.currentTarget.style.boxShadow = '';
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      },
                    })}
                  >
                    <LinearGradient
                      colors={isSelected ? ['#3b82f6', '#2563eb'] : (category as any).gradient}
                      style={[
                        styles.enhancedCategoryGradient,
                        isSelected && styles.enhancedCategoryGradientActive
                      ]}
                    >
                      {/* Selection Indicator */}
                      {isSelected && (
                        <View style={styles.categorySelectionIndicator}>
                          <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                        </View>
                      )}

                      {/* Category Icon */}
                      <View style={[
                        styles.enhancedCategoryIconContainer,
                        { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : (category as any).bgColor }
                      ]}>
                        <Ionicons 
                          name={(category as any).icon as any} 
                          size={28} 
                          color={isSelected ? '#ffffff' : (category as any).color} 
                        />
                      </View>

                      {/* Category Content */}
                      <View style={styles.enhancedCategoryContent}>
                        <Text style={[
                          styles.enhancedCategoryTitle,
                          isSelected && styles.enhancedCategoryTitleActive
                        ]} numberOfLines={1}>
                          {category.label}
                        </Text>
                        
                        <Text style={[
                          styles.enhancedCategoryDescription,
                          isSelected && styles.enhancedCategoryDescriptionActive
                        ]} numberOfLines={2}>
                          {(category as any).description}
                        </Text>
                      </View>

                      {/* Doctor Count Badge */}
                      <View style={[
                        styles.enhancedCategoryBadge,
                        { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : (category as any).color }
                      ]}>
                        <Ionicons 
                          name="people" 
                          size={12} 
                          color="#ffffff" 
                        />
                        <Text style={[
                          styles.enhancedCategoryBadgeText,
                          { color: '#ffffff' }
                        ]}>
                          {Math.floor(Math.random() * 20) + 10}
                        </Text>
                      </View>

                      {/* Hover Effect Overlay */}
                      <View style={styles.categoryHoverOverlay} />
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {/* Bottom Action Section */}
          <View style={styles.categoriesBottomSection}>
            <TouchableOpacity 
              style={styles.categoriesViewAllButton}
              onPress={() => {
                setSelectedCategory('all');
                setActiveTab('search');
              }}
            >
              <LinearGradient
                colors={['#3b82f6', '#2563eb']}
                style={styles.categoriesViewAllGradient}
              >
                <Ionicons name="apps" size={20} color="#ffffff" />
                <Text style={styles.categoriesViewAllText}>View All Hospitals</Text>
                <Ionicons name="arrow-forward" size={16} color="#ffffff" />
              </LinearGradient>
            </TouchableOpacity>
            
            <Text style={styles.categoriesBottomNote}>
              Can't find your specialty? Browse all hospitals for comprehensive care.
            </Text>
          </View>
        </View>
      </ScrollView>
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
      
      {/* Filters - Show only for search tab */}
      {activeTab === 'search' && (
        <>
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

      {/* Enhanced Professional EHR Detail Modal */}
      <Modal
        visible={ehrModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeEHRModal}
      >
        <View style={styles.ehrModalContainer}>
          {/* Enhanced Header with Gradient */}
          <LinearGradient
            colors={['#3b82f6', '#2563eb', '#1d4ed8']}
            style={styles.ehrModalHeader}
          >
            {/* Top Row with Back Button and Action Buttons */}
            <View style={styles.ehrModalTopRow}>
              <TouchableOpacity 
                style={styles.ehrBackButton} 
                onPress={closeEHRModal}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </TouchableOpacity>
              
              <View style={styles.ehrHeaderActions}>
                <TouchableOpacity style={styles.ehrActionButton} activeOpacity={0.8}>
                  <Ionicons name="download-outline" size={20} color="#ffffff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.ehrActionButton} activeOpacity={0.8}>
                  <Ionicons name="share-outline" size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Title and Patient Info */}
            <View style={styles.ehrTitleSection}>
              <Text style={styles.ehrModalTitle}>Medical Record</Text>
              <Text style={styles.ehrPatientName}>
                Samuel Rick
              </Text>
            </View>
            
            {/* Patient Summary Card */}
            {selectedEHR && (
              <View style={styles.ehrPatientSummary}>
                <View style={styles.ehrSummaryRow}>
                  <View style={styles.ehrSummaryItem}>
                    <Ionicons name="person-outline" size={16} color="#93c5fd" />
                    <Text style={styles.ehrSummaryLabel}>ID: {selectedEHR.raphaId}</Text>
                  </View>
                  <View style={styles.ehrSummaryItem}>
                    <Ionicons name="calendar-outline" size={16} color="#93c5fd" />
                    <Text style={styles.ehrSummaryLabel}>
                      {new Date(selectedEHR.appointmentDateTime).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </LinearGradient>

          {selectedEHR ? (
            <ScrollView 
              style={styles.ehrModalContent} 
              showsVerticalScrollIndicator={false}
              bounces={true}
            >
              {/* Vitals Dashboard */}
              <View style={styles.ehrVitalsCard}>
                <View style={styles.ehrCardHeader}>
                  <View style={styles.ehrCardHeaderLeft}>
                    <View style={styles.ehrIconContainer}>
                      <Ionicons name="heart-outline" size={20} color="#ef4444" />
                    </View>
                    <Text style={styles.ehrCardTitle}>Vital Signs</Text>
                  </View>
                  <View style={styles.ehrStatusBadge}>
                    <Text style={styles.ehrStatusText}>Normal</Text>
                  </View>
                </View>
                
                <View style={styles.ehrVitalsGrid}>
                  <View style={styles.ehrVitalCard}>
                    <View style={styles.ehrVitalHeader}>
                      <View style={styles.ehrVitalIcon}>
                        <Ionicons name="pulse-outline" size={24} color="#ef4444" />
                      </View>
                    </View>
                    <Text style={styles.ehrVitalValue}>
                      {selectedEHR.patientBasicVitals.bloodPressure.systolic}/
                      {selectedEHR.patientBasicVitals.bloodPressure.diastolic}
                    </Text>
                    <Text style={styles.ehrVitalUnit}>mmHg</Text>
                    <Text style={styles.ehrVitalLabel}>Blood Pressure</Text>
                  </View>
                  
                  <View style={styles.ehrVitalCard}>
                    <View style={styles.ehrVitalHeader}>
                      <View style={styles.ehrVitalIcon}>
                        <Ionicons name="water-outline" size={24} color="#f59e0b" />
                      </View>
                    </View>
                    <Text style={styles.ehrVitalValue}>{selectedEHR.patientBasicVitals.sugarReading}</Text>
                    <Text style={styles.ehrVitalUnit}>mg/dL</Text>
                    <Text style={styles.ehrVitalLabel}>Blood Sugar</Text>
                  </View>
                  
                  <View style={styles.ehrVitalCard}>
                    <View style={styles.ehrVitalHeader}>
                      <View style={styles.ehrVitalIcon}>
                        <Ionicons name="fitness-outline" size={24} color="#10b981" />
                      </View>
                    </View>
                    <Text style={styles.ehrVitalValue}>{selectedEHR.patientBasicVitals.weight}</Text>
                    <Text style={styles.ehrVitalUnit}>kg</Text>
                    <Text style={styles.ehrVitalLabel}>Weight</Text>
                  </View>
                  
                  {selectedEHR.patientBasicVitals.height && (
                    <View style={styles.ehrVitalCard}>
                      <View style={styles.ehrVitalHeader}>
                        <View style={styles.ehrVitalIcon}>
                          <Ionicons name="resize-outline" size={24} color="#8b5cf6" />
                        </View>
                      </View>
                      <Text style={styles.ehrVitalValue}>{selectedEHR.patientBasicVitals.height}</Text>
                      <Text style={styles.ehrVitalUnit}>cm</Text>
                      <Text style={styles.ehrVitalLabel}>Height</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Health Issue Card */}
              <View style={styles.ehrCard}>
                <View style={styles.ehrCardHeader}>
                  <View style={styles.ehrCardHeaderLeft}>
                    <View style={[styles.ehrIconContainer, { backgroundColor: '#fef3c7' }]}>
                      <Ionicons name="medical-outline" size={20} color="#f59e0b" />
                    </View>
                    <Text style={styles.ehrCardTitle}>Chief Complaint</Text>
                  </View>
                </View>
                <View style={styles.ehrCardContent}>
                  <Text style={styles.ehrCardText}>{selectedEHR.healthIssue}</Text>
                </View>
              </View>

              {/* Doctor's Assessment */}
              <View style={styles.ehrCard}>
                <View style={styles.ehrCardHeader}>
                  <View style={styles.ehrCardHeaderLeft}>
                    <View style={[styles.ehrIconContainer, { backgroundColor: '#dcfce7' }]}>
                      <Ionicons name="checkmark-circle-outline" size={20} color="#16a34a" />
                    </View>
                    <Text style={styles.ehrCardTitle}>Clinical Assessment</Text>
                  </View>
                </View>
                <View style={styles.ehrCardContent}>
                  <Text style={styles.ehrCardText}>{selectedEHR.doctorResolution}</Text>
                </View>
              </View>

              {/* Medications */}
              <View style={styles.ehrCard}>
                <View style={styles.ehrCardHeader}>
                  <View style={styles.ehrCardHeaderLeft}>
                    <View style={[styles.ehrIconContainer, { backgroundColor: '#fce7f3' }]}>
                      <Ionicons name="medical-outline" size={20} color="#ec4899" />
                    </View>
                    <Text style={styles.ehrCardTitle}>Prescribed Medications</Text>
                  </View>
                  <View style={styles.ehrMedCountBadge}>
                    <Text style={styles.ehrMedCountText}>{selectedEHR.medicinesPrescription.length}</Text>
                  </View>
                </View>
                
                <View style={styles.ehrCardContent}>
                  {selectedEHR.medicinesPrescription.map((med, index) => (
                    <View key={med.id} style={styles.ehrMedicationCard}>
                      <View style={styles.ehrMedHeader}>
                        <View style={styles.ehrMedIcon}>
                          <Ionicons name="medical" size={16} color="#ec4899" />
                        </View>
                        <View style={styles.ehrMedInfo}>
                          <Text style={styles.ehrMedName}>{med.medicineName}</Text>
                          <Text style={styles.ehrMedDosage}>{med.dosage} • {med.frequency}</Text>
                        </View>
                      </View>
                      <View style={styles.ehrMedInstructions}>
                        <Text style={styles.ehrMedInstructionText}>{med.instructions}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Diagnostic Reports */}
              <View style={styles.ehrCard}>
                <View style={styles.ehrCardHeader}>
                  <View style={styles.ehrCardHeaderLeft}>
                    <View style={[styles.ehrIconContainer, { backgroundColor: '#e0f2fe' }]}>
                      <Ionicons name="document-text-outline" size={20} color="#0891b2" />
                    </View>
                    <Text style={styles.ehrCardTitle}>Laboratory Results</Text>
                  </View>
                  <View style={styles.ehrTestCountBadge}>
                    <Text style={styles.ehrTestCountText}>{selectedEHR.diagnosticReports.length}</Text>
                  </View>
                </View>
                
                <View style={styles.ehrCardContent}>
                  {selectedEHR.diagnosticReports.map((report) => (
                    <View key={report.id} style={styles.ehrDiagnosticCard}>
                      <View style={styles.ehrDiagHeader}>
                        <View style={styles.ehrDiagLeft}>
                          <Text style={styles.ehrDiagName}>{report.testName}</Text>
                          <Text style={styles.ehrDiagDate}>{report.reportDate}</Text>
                        </View>
                        <View style={[
                          styles.ehrDiagStatus,
                          { backgroundColor: report.status === 'Normal' ? '#dcfce7' : 
                                              report.status === 'Abnormal' ? '#fef3c7' : 
                                              report.status === 'Critical' ? '#fee2e2' : '#f1f5f9' }
                        ]}>
                          <Text style={[
                            styles.ehrDiagStatusText,
                            { color: report.status === 'Normal' ? '#16a34a' : 
                                     report.status === 'Abnormal' ? '#f59e0b' :
                                     report.status === 'Critical' ? '#dc2626' : '#6b7280' }
                          ]}>
                            {report.status}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.ehrDiagContent}>
                        <Text style={styles.ehrDiagResults}>{report.results}</Text>
                        {report.normalRange && (
                          <View style={styles.ehrDiagRange}>
                            <Ionicons name="information-circle-outline" size={14} color="#6b7280" />
                            <Text style={styles.ehrDiagRangeText}>Normal Range: {report.normalRange}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Surgery Information */}
              {selectedEHR.surgeryDescription && (
                <View style={styles.ehrCard}>
                  <View style={styles.ehrCardHeader}>
                    <View style={styles.ehrCardHeaderLeft}>
                      <View style={[styles.ehrIconContainer, { backgroundColor: '#fef2f2' }]}>
                        <Ionicons name="cut-outline" size={20} color="#dc2626" />
                      </View>
                      <Text style={styles.ehrCardTitle}>Surgical Procedure</Text>
                    </View>
                  </View>
                  <View style={styles.ehrCardContent}>
                    <View style={styles.ehrSurgeryInfo}>
                      <Text style={styles.ehrSurgeryType}>{selectedEHR.surgeryDescription.surgeryType}</Text>
                      <Text style={styles.ehrSurgeryDesc}>{selectedEHR.surgeryDescription.description}</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Final Remarks */}
              <View style={styles.ehrCard}>
                <View style={styles.ehrCardHeader}>
                  <View style={styles.ehrCardHeaderLeft}>
                    <View style={[styles.ehrIconContainer, { backgroundColor: '#f3f4f6' }]}>
                      <Ionicons name="clipboard-outline" size={20} color="#4b5563" />
                    </View>
                    <Text style={styles.ehrCardTitle}>Clinical Notes</Text>
                  </View>
                </View>
                <View style={styles.ehrCardContent}>
                  <Text style={styles.ehrCardText}>{selectedEHR.finalRemarks}</Text>
                </View>
              </View>

              {/* Physician Information */}
              <View style={[styles.ehrCard, { marginBottom: 40 }]}>
                <View style={styles.ehrCardHeader}>
                  <View style={styles.ehrCardHeaderLeft}>
                    <View style={[styles.ehrIconContainer, { backgroundColor: '#ede9fe' }]}>
                      <Ionicons name="person-circle-outline" size={20} color="#7c3aed" />
                    </View>
                    <Text style={styles.ehrCardTitle}>Attending Physician</Text>
                  </View>
                </View>
                <View style={styles.ehrCardContent}>
                  <View style={styles.ehrPhysicianInfo}>
                    <Text style={styles.ehrPhysicianName}>{formatDoctorName(selectedEHR.doctorName)}</Text>
                    <View style={styles.ehrRecordMeta}>
                      <Ionicons name="time-outline" size={14} color="#6b7280" />
                      <Text style={styles.ehrRecordDate}>
                        Record Created: {new Date(selectedEHR.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

            </ScrollView>
          ) : (
            <View style={styles.ehrNoDataContainer}>
              <View style={styles.ehrNoDataIcon}>
                <Ionicons name="document-text-outline" size={64} color="#d1d5db" />
              </View>
              <Text style={styles.ehrNoDataTitle}>No Record Selected</Text>
              <Text style={styles.ehrNoDataSubtitle}>Please select a medical record to view details</Text>
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
    ...(Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)),
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
    shadowColor: '#64748b',
    shadowOpacity: 0.08,
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
    borderRadius: 32,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
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
  },
  compactCardGradient: {
    padding: 12,
    minHeight: 240,
    justifyContent: 'space-between',
  },
  compactImageContainer: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  compactImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
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
  compactNameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  compactName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 16,
    flex: 1,
    marginRight: 6,
  },
  topRatedBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  topRatedBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  compactSpecialization: {
    fontSize: 11,
    color: '#000000',
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
    color: '#000000',
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
      marginBottom: 16,
      backgroundColor: '#ffffff',
      borderRadius: 20,
      padding: 24,
      shadowColor: '#1e293b',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
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
    borderRadius: 20,
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
  
  // Enhanced Professional Appointments Tab Styles
  appointmentsContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  // Header Section
  appointmentsHeaderGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 30,
    borderRadius: 24,
    margin: 16,
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    overflow: 'hidden',
  },
  appointmentsHeaderContent: {
    paddingHorizontal: 20,
  },
  appointmentsHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  appointmentsHeaderLeft: {
    flex: 1,
  },
  appointmentsMainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  appointmentsHeaderSubtitle: {
    fontSize: 16,
    color: '#bfdbfe',
    fontWeight: '500',
  },
  appointmentsHeaderIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Quick Stats
  quickStatsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickStatNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#bfdbfe',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  
  // Main Content
  appointmentsMainContent: {
    flex: 1,
    paddingTop: 20,
  },
  
  // Section Styles
  appointmentSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appointmentSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  sectionBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  sectionBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  
  // Enhanced Appointment Cards
  appointmentCards: {
    gap: 16,
  },
  enhancedAppointmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  appointmentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  hospitalInfo: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  statusBadgeEnhanced: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusTextEnhanced: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  
  // Appointment Details
  appointmentDetails: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  appointmentDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  
  // Card Footer Actions
  appointmentCardFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  actionButtonSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  actionButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    gap: 6,
  },
  actionButtonPrimaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  
  // History Cards
  historyCards: {
    gap: 12,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  historyCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyHospital: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  historyDoctor: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  historyActionButton: {
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 150 : 80,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  
  // View All Button (Appointments)
  appointmentViewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  appointmentViewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  
  // Count Badges
  totalCountBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  totalCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  
  // All Appointments List
  allAppointmentsList: {
    gap: 12,
  },
  
  // Enhanced Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  emptyStateIcon: {
    marginBottom: 24,
    opacity: 0.6,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },

  // Enhanced Professional EHR Tab Styles
  ehrContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  // EHR Header Section
  ehrHeaderGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 30,
    borderRadius: 24,
    margin: 16,
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    overflow: 'hidden',
  },
  ehrHeaderContent: {
    paddingHorizontal: 20,
  },
  ehrHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  ehrHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ehrHeaderIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  ehrHeaderInfo: {
    flex: 1,
  },
  ehrMainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  ehrHeaderSubtitle: {
    fontSize: 16,
    color: '#c4b5fd',
    fontWeight: '500',
  },
  ehrHeaderAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Quick Stats
  ehrQuickStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 16,
    gap: 8,
  },
  ehrQuickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  ehrQuickStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  ehrQuickStatNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  ehrQuickStatLabel: {
    fontSize: 12,
    color: '#c4b5fd',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  
  // Main Content
  ehrMainContent: {
    flex: 1,
    paddingTop: 20,
  },
  
  // Section Styles
  ehrSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  ehrSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ehrSectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ehrSectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ehrSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  
  // Health Status Indicator
  ehrHealthStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ehrHealthIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16a34a',
  },
  ehrHealthStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
  },
  
  // Health Dashboard
  ehrHealthDashboard: {
    gap: 16,
  },
  ehrAssessmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  ehrAssessmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  ehrAssessmentLeft: {
    flex: 1,
  },
  ehrAssessmentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  ehrAssessmentDate: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  ehrAssessmentDoctor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ehrAssessmentDoctorName: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  ehrAssessmentContent: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  ehrAssessmentCondition: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  ehrAssessmentResolution: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  
  // Vitals Section
  ehrVitalsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  ehrVitalsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  ehrVitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  ehrVitalCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 120 : 80,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  ehrVitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ehrVitalIcon: {
    width: 24,
    height: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  ehrVitalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  ehrVitalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  ehrVitalUnit: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  ehrVitalStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  ehrVitalStatusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  
  // View All Button
  ehrViewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ehrViewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  
  // Records Container
  ehrRecordsContainer: {
    gap: 12,
  },
  ehrRecordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ehrRecordLeft: {
    flex: 1,
  },
  ehrRecordId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  ehrRecordDate: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  ehrRecordStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  ehrRecordStatusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  ehrRecordStatusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  ehrRecordContent: {
    flex: 1,
    marginRight: 12,
  },
  ehrRecordDoctor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  ehrRecordDoctorName: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  ehrRecordCondition: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  ehrRecordMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  ehrRecordMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ehrRecordMetaText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  ehrRecordAction: {
    padding: 4,
  },
  
  // Empty Records
  ehrEmptyRecords: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  ehrEmptyIcon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  ehrEmptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  ehrEmptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Follow-ups Section
  ehrFollowUpCount: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ehrFollowUpCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f59e0b',
  },
  ehrFollowUpsList: {
    gap: 12,
  },
  ehrFollowUpCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  ehrFollowUpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ehrFollowUpLeft: {
    flex: 1,
  },
  ehrFollowUpPurpose: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  ehrFollowUpDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  ehrFollowUpPriority: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ehrFollowUpPriorityText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  ehrFollowUpActions: {
    flexDirection: 'row',
    gap: 8,
  },
  ehrFollowUpActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 4,
  },
  ehrFollowUpPrimaryButton: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bfdbfe',
  },
  ehrFollowUpActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  ehrFollowUpPrimaryText: {
    color: '#3b82f6',
  },
  
  // Categories Grid
  ehrCategoriesGridModal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  ehrCategoryCardModal: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 120 : 100,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  ehrCategoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  ehrCategoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  ehrCategoryCount: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },

  // Legacy styles (keeping for backward compatibility)
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
  categoryIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryCountBadge: {
    marginTop: 8,
    backgroundColor: 'transparent',
  },
  categoryCountText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
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
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  nearbyHospitalImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  nearbyHospitalImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#e5e7eb',
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
    color: '#000000',
    lineHeight: 18,
  },
  nearbyHospitalSpecialization: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
  },
  nearbyHospitalLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nearbyHospitalLocation: {
    fontSize: 11,
    color: '#6b7280',
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

  // Enhanced Professional EHR Modal Styles
  ehrModalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  // Header Styles
  ehrModalHeader: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
  },
  
  // New Top Row Layout
  ehrModalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  
  // Title Section (centered)
  ehrTitleSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  ehrBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ehrModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  ehrPatientName: {
    fontSize: 16,
    color: '#93c5fd',
    fontWeight: '500',
    textAlign: 'center',
  },
  ehrHeaderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  ehrActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Patient Summary
  ehrPatientSummary: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
  },
  ehrSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ehrSummaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ehrSummaryLabel: {
    fontSize: 14,
    color: '#dbeafe',
    fontWeight: '500',
  },
  
  // Content Area
  ehrModalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  
  // Card Styles
  ehrVitalsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  ehrCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  ehrCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ehrIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ehrCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  ehrStatusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ehrStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },
  ehrCardContent: {
    padding: 20,
  },
  ehrCardText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  
  
  
  // Medication Styles
  ehrMedCountBadge: {
    backgroundColor: '#fce7f3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ehrMedCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ec4899',
  },
  ehrMedicationCard: {
    backgroundColor: '#fefbf7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ec4899',
  },
  ehrMedHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ehrMedIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fce7f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ehrMedInfo: {
    flex: 1,
  },
  ehrMedName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  ehrMedDosage: {
    fontSize: 14,
    color: '#ec4899',
    fontWeight: '500',
  },
  ehrMedInstructions: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f3e8ff',
  },
  ehrMedInstructionText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  
  // Diagnostic Report Styles
  ehrTestCountBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ehrTestCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0891b2',
  },
  ehrDiagnosticCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0891b2',
  },
  ehrDiagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ehrDiagLeft: {
    flex: 1,
  },
  ehrDiagName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  ehrDiagDate: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  ehrDiagStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  ehrDiagStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ehrDiagContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
  },
  ehrDiagResults: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  ehrDiagRange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ehrDiagRangeText: {
    fontSize: 12,
    color: '#6b7280',
  },
  
  // Surgery Styles
  ehrSurgeryInfo: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  ehrSurgeryType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 8,
  },
  ehrSurgeryDesc: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  
  // Physician Info
  ehrPhysicianInfo: {
    backgroundColor: '#faf5ff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#7c3aed',
  },
  ehrPhysicianName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7c3aed',
    marginBottom: 8,
  },
  
  // Empty State
  ehrNoDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  ehrNoDataIcon: {
    marginBottom: 24,
  },
  ehrNoDataTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  ehrNoDataSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Legacy Modal Styles (keeping for compatibility)
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
  
  // Clear Cancelled Appointments Styles
  clearButtonContainer: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  clearCancelledButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  clearCancelledText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
    letterSpacing: 0.3,
  },

  // Top Hospitals Section Styles
  topHospitalsSection: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  topHospitalsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  topHospitalsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  topHospitalsIconContainer: {
    marginRight: 12,
  },
  topHospitalsIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  topHospitalsTitleContainer: {
    flex: 1,
  },
  topHospitalsSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  topHospitalsSectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  topHospitalsRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  topHospitalsRatingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d97706',
  },
  topHospitalsContainer: {
    marginTop: 8,
  },
  topHospitalsScroll: {
    flexGrow: 0,
  },
  topHospitalsScrollContent: {
    paddingRight: 24,
  },
  topHospitalCard: {
    width: 280,
    marginRight: 16,
  },
  topHospitalTouchable: {
    width: '100%',
    height: 320,
  },
  topHospitalGradient: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  topHospitalPremiumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  premiumBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 3,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  topHospitalImageContainer: {
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  topHospitalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topHospitalRating: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  topHospitalRatingValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  topHospitalContent: {
    flex: 1,
  },
  topHospitalName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
    lineHeight: 20,
  },
  topHospitalSpecialization: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '600',
    marginBottom: 8,
  },
  topHospitalLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  topHospitalLocation: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  topHospitalVisitorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 4,
  },
  topHospitalVisitorsText: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '600',
  },
  topHospitalFeatures: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  topHospitalFeatureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  topHospitalFeatureText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  topHospitalBookButton: {
    marginTop: 'auto',
  },
  topHospitalBookGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  topHospitalBookText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },

  // Categories Content Styles - Missing Styles
  categoriesHeaderGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    borderRadius: 24,
    margin: 16,
    overflow: 'hidden',
  },
  categoriesHeaderContent: {
    paddingHorizontal: 20,
  },
  categoriesHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  categoriesHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoriesMainIconContainer: {
    marginRight: 16,
  },
  categoriesMainIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesHeaderTextContainer: {
    flex: 1,
  },
  categoriesMainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 4,
  },
  categoriesHeaderSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  categoriesHeaderBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 40,
    alignItems: 'center',
  },
  categoriesHeaderBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3b82f6',
  },
  categoriesMainContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoriesStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  categoriesStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoriesStatIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesStatText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  enhancedCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 32,
    paddingHorizontal: 8,
    minHeight: 400,
  },
  enhancedCategoryCard: {
    width: Platform.OS === 'web' 
      ? '46%' 
      : (Dimensions.get('window').width - 80) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 12,
  },
  categoryCardLeft: {
    alignSelf: 'flex-start',
    marginRight: 8,
    marginTop: 0,
  },
  categoryCardRight: {
    alignSelf: 'flex-end',
    marginLeft: 8,
    marginTop: -6,
  },
  enhancedCategoryTouchable: {
    width: '100%',
    minHeight: 200,
  },
  enhancedCategoryTouchableActive: {
    transform: [{ scale: 0.98 }],
  },
  enhancedCategoryGradient: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  enhancedCategoryGradientActive: {
    backgroundColor: '#f0f9ff',
  },
  categorySelectionIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enhancedCategoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  enhancedCategoryContent: {
    flex: 1,
  },
  enhancedCategoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  enhancedCategoryTitleActive: {
    color: '#3b82f6',
  },
  enhancedCategoryDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  enhancedCategoryDescriptionActive: {
    color: '#4b5563',
  },
  enhancedCategoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 'auto',
  },
  enhancedCategoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
  },
  categoryHoverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    opacity: 0,
  },
  categoriesBottomSection: {
    paddingTop: 24,
    alignItems: 'center',
  },
  categoriesViewAllButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  categoriesViewAllGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  categoriesViewAllText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  categoriesBottomNote: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});