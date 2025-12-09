import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Animated, TouchableOpacity, Image, Platform, Dimensions, FlatList, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../utils/colors';
import { HospitalCard } from '../../components/HospitalCard';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { hospitals, Hospital } from '../../data/hospitals';
import { diagnosticTests } from '../../data/diagnostics';
import { medicines } from '../../data/pharmacies';
import { storage, UserData } from '../../utils/storage';

interface HomeScreenProps {
  navigation: any;
  userData: UserData;
  onUpdateUserData: (userData: UserData) => void;
}

// Enhanced Hospital Card Component
const EnhancedHospitalCard: React.FC<{
  hospital: Hospital;
  onPress: (hospital: Hospital) => void;
}> = ({ hospital, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
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
    <Animated.View 
      style={[
        styles.enhancedHospitalCard,
        {
          transform: [{ scale: scaleAnim }],
        }
      ]}
      {...(Platform.OS === 'web' && { className: 'hospital-card-snap' })}
    >
      <TouchableOpacity
        onPress={() => onPress(hospital)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={styles.enhancedHospitalTouchable}
        {...(Platform.OS === 'web' && {
          onMouseEnter: (e: any) => {
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.3), 0 0 0 2px rgba(59, 130, 246, 0.1)';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.transition = 'all 0.3s ease';
            e.currentTarget.style.borderRadius = '16px';
          },
          onMouseLeave: (e: any) => {
            e.currentTarget.style.boxShadow = '';
            e.currentTarget.style.transform = 'translateY(0)';
          },
        })}
      >
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.enhancedHospitalGradient}
        >
          {/* Hospital Image */}
          <View style={styles.hospitalImageContainer}>
            <Image
              source={{ uri: hospital.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&fit=crop&crop=center' }}
              style={styles.hospitalImage}
              defaultSource={require('../../../assets/image.png')}
            />
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#FFC107" />
              <Text style={styles.ratingText}>{hospital.rating}</Text>
            </View>
          </View>

          {/* Hospital Info */}
          <View style={styles.hospitalInfo}>
            <Text style={styles.hospitalName} numberOfLines={1}>{hospital.name}</Text>
            <Text style={styles.hospitalSpecialization} numberOfLines={1}>{hospital.specialization}</Text>
            <View style={styles.hospitalLocationRow}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.hospitalLocation} numberOfLines={1}>{hospital.address}</Text>
            </View>
            {hospital.visitorsCount && (
              <View style={styles.hospitalVisitorsRow}>
                <Ionicons name="people-outline" size={14} color={colors.primary} />
                <Text style={styles.hospitalVisitorsText}>
                  {hospital.visitorsCount >= 1000 
                    ? `${(hospital.visitorsCount / 1000).toFixed(1)}K` 
                    : hospital.visitorsCount} visitors
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

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

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, userData, onUpdateUserData }) => {
  const [hospitalsList, setHospitalsList] = useState<Hospital[]>(hospitals);
  const [refreshing, setRefreshing] = useState(false);
  const [featuredHospital, setFeaturedHospital] = useState<Hospital>(hospitals[0]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
  const [currentHospitalIndex, setCurrentHospitalIndex] = useState(0);
  const [showAllHospitals, setShowAllHospitals] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Your Location');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Demo discount data
  const discounts = {
    medicines: [
      { id: 1, discount: 25 }, // Paracetamol 500mg
      { id: 3, discount: 15 }, // Cetirizine 10mg
      { id: 5, discount: 30 }, // Vitamin D3 1000 IU
      { id: 8, discount: 20 }, // Ibuprofen 400mg
      { id: 16, discount: 35 }, // Multivitamin Tablets
      { id: 11, discount: 10 }, // Aspirin 75mg
    ],
    diagnostics: [
      { id: 1, discount: 20 }, // Complete Blood Count
      { id: 2, discount: 25 }, // Chest X-Ray
      { id: 4, discount: 15 }, // Lipid Profile
      { id: 6, discount: 30 }, // Thyroid Function Test
      { id: 10, discount: 25 }, // Liver Function Test
      { id: 14, discount: 40 }, // HbA1c Test
    ]
  };

  // Helper function to get discount for an item
  const getDiscount = (id: number, type: 'medicines' | 'diagnostics') => {
    return discounts[type].find(item => item.id === id)?.discount || 0;
  };

  // Helper function to calculate discounted price
  const calculateDiscountedPrice = (originalPrice: string, discountPercent: number) => {
    const price = parseInt(originalPrice.replace('₹', '').replace(',', ''));
    const discountedPrice = price - (price * discountPercent / 100);
    return `₹${Math.round(discountedPrice)}`;
  };
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const hospitalScrollRef = useRef<FlatList>(null);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

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

    // Commented out auto-scroll to allow manual scrolling
    // const hospitalScrollInterval = setInterval(() => {
    //   setCurrentHospitalIndex(prevIndex => {
    //     const nextIndex = (prevIndex + 1) % hospitals.length;
    //     if (hospitalScrollRef.current) {
    //       hospitalScrollRef.current.scrollToIndex({
    //         index: nextIndex,
    //         animated: true,
    //       });
    //     }
    //     return nextIndex;
    //   });
    // }, 2000);

    return () => {
      clearInterval(timeInterval);
      // clearInterval(hospitalScrollInterval);
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh with actual data update
    setTimeout(() => {
      setHospitalsList([...hospitals]);
      setRefreshing(false);
    }, 1000);
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setShowLocationDropdown(false);
    
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please enable location permissions to use this feature.',
          [{ text: 'OK' }]
        );
        setIsLoadingLocation(false);
        return;
      }

      // Get current position with high accuracy
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      // Reverse geocode to get address
      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (addresses && addresses.length > 0) {
          const address = addresses[0];
          
          // Build a readable location string with priority order
          const locationParts = [];
          
          // Add neighborhood/sublocality if available
          if (address.name && address.name !== address.city) {
            locationParts.push(address.name);
          } else if (address.district) {
            locationParts.push(address.district);
          } else if (address.subregion) {
            locationParts.push(address.subregion);
          }
          
          // Add city
          if (address.city) {
            locationParts.push(address.city);
          }
          
          // If we have no parts yet, try region/state
          if (locationParts.length === 0 && address.region) {
            locationParts.push(address.region);
          }
          
          // Create final location string
          const locationString = locationParts.length > 0 
            ? locationParts.slice(0, 2).join(', ')
            : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          
          setCurrentLocation(locationString);
        } else {
          setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      } catch (geocodeError) {
        console.error('Geocoding error:', geocodeError);
        setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleHospitalPress = (hospital: Hospital) => {
    try {
      console.log('Hospital pressed:', hospital.name);
      navigation.navigate('HospitalDetails', { hospital });
    } catch (error) {
      console.error('Navigation error to hospital details:', error);
    }
  };

  const handleQuickAction = (action: string) => {
    try {
      console.log('Quick action pressed:', action);
      switch (action) {
        case 'pharmacy':
          navigation.navigate('Pharmacy');
          break;
        case 'diagnostics':
          navigation.navigate('Diagnostics');
          break;
        case 'bookings':
          navigation.navigate('MyBookings');
          break;
        case 'ehr':
          navigation.navigate('EHR');
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
      'Stay hydrated - drink at least 8 glasses of water daily',
      'Take a 10-minute walk after meals to aid digestion',
      'Get 7-8 hours of quality sleep for better health',
      'Eat colorful fruits and vegetables for essential nutrients',
      'Practice deep breathing for 5 minutes to reduce stress',
    ];
    const today = new Date().getDate();
    return tips[today % tips.length];
  };

  const calculateTravelTime = (hospitalId: number) => {
    // Simulate travel time calculation based on distance and traffic
    // In a real app, this would use maps API or GPS data
    const baseTime = 5 + (hospitalId % 8) * 3; // Base time between 5-26 minutes
    const trafficMultiplier = 1 + (Math.random() * 0.5); // Traffic factor 1.0-1.5x
    const totalTime = Math.round(baseTime * trafficMultiplier);
    return totalTime;
  };

  // Responsive breakpoints
  const isSmallScreen = screenDimensions.width < 768;
  const isMediumScreen = screenDimensions.width >= 768 && screenDimensions.width < 1024;

  return (
    <View style={[
      {
        flex: 1,
        backgroundColor: '#f8fafc',
      }
    ]}>
      {/* Web-specific style injection */}
      {Platform.OS === 'web' && (
        <style dangerouslySetInnerHTML={{
          __html: `
            body, html, #root {
              margin: 0 !important;
              padding: 0 !important;
              height: 100vh !important;
              width: 100vw !important;
              overflow: hidden !important;
              background-color: #f8fafc !important;
            }
            .home-scroll::-webkit-scrollbar {
              display: none;
            }
            .home-scroll {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .featured-hospitals-scroll {
              overflow-x: auto !important;
              overflow-y: hidden !important;
              -webkit-overflow-scrolling: touch !important;
              scroll-snap-type: x mandatory !important;
            }
            .featured-hospitals-scroll::-webkit-scrollbar {
              display: none;
            }
            .hospital-card-snap {
              scroll-snap-align: start !important;
              flex-shrink: 0 !important;
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
        style={{ flex: 1, margin: 0, padding: 0 }}
        contentContainerStyle={[
          {
            flexGrow: 1,
            paddingBottom: 80,
            paddingTop: 0,
            marginTop: 0,
          }
        ]}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#3b82f6"
            colors={["#3b82f6"]}
          />
        }
        showsVerticalScrollIndicator={Platform.OS !== 'web'}
        bounces={Platform.OS === 'ios'}
        {...(Platform.OS === 'web' && { className: 'home-scroll' })}
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
            colors={['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingHorizontal: 0,
              paddingVertical: 0,
              paddingTop: 16,
              paddingBottom: 40,
              marginHorizontal: 16,
              marginTop: 16,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              overflow: 'hidden',
            }}
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
          {/* Professional Header Layout */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 32,
            paddingTop: 0,
            paddingHorizontal: 24,
            marginTop: 0,
          }}>
            {/* Enhanced Logo and Brand */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              flex: 1,
            }}>
              <View style={{
                width: 60,
                height: 60,
                backgroundColor: '#ffffff',
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
                borderWidth: 0,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 8,
                elevation: 8,
              }}>
                <Image 
                  source={require('../../../assets/image.png')} 
                  style={{ width: 59, height: 59 }} 
                  resizeMode="contain" 
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 39,
                  fontWeight: '600',
                  color: '#ffffff',
                  letterSpacing: 0,
                  textShadowColor: 'rgba(0, 0, 0, 0.5)',
                  textShadowOffset: { width: 0, height: 3 },
                  textShadowRadius: 6,
                  lineHeight: 40,
                }}>
                  Rapha
                </Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: '#ffffff',
                  letterSpacing: 0,
                  marginTop: 4,
                  textShadowColor: 'rgba(0, 0, 0, 0.3)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 3,
                }}>
                 
                </Text>
              </View>
            </View>
            
            {/* Right-aligned Profile Section */}
            <View style={{
              alignItems: 'flex-end',
              marginTop: 8,
            }}>
              {/* Profile Button */}
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 25,
                  maxWidth: 200,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  shadowColor: 'rgba(0, 0, 0, 0.2)',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 1,
                  shadowRadius: 4,
                  elevation: 4,
                }}
                onPress={() => navigation.navigate('PatientProfile')}
              >
                <View style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                }}>
                  <Ionicons name="person" size={20} color="#ffffff" />
                </View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#ffffff',
                  flex: 1,
                }} numberOfLines={1}>
                  {userData.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions inside Hero */}
          <Animated.View 
            style={[
              {
                paddingHorizontal: 24,
                marginTop: 32,
                maxWidth: 1200,
                alignSelf: 'center',
                width: '100%',
              },
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Centered Text Messages */}
            <View style={{
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <Text style={{
                fontSize: 36,
                fontWeight: '700',
                color: '#ffffff',
                letterSpacing: 0.3,
                textAlign: 'center',
                marginBottom: 8,
                textShadowColor: 'rgba(0, 0, 0, 0.4)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
              }}>
                Discover hospitals & complete healthcare
              </Text>
              <Text style={{
                fontSize: 36,
                fontWeight: '700',
                color: '#ffffff',
                letterSpacing: 0.3,
                textAlign: 'center',
                textShadowColor: 'rgba(0, 0, 0, 0.4)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
              }}>
                Book appointments in minutes Rapha!
              </Text>
              <Text style={{
                fontSize: 36,
                fontWeight: '700',
                color: '#ffffff',
                letterSpacing: 0.5,
                textAlign: 'center',
                marginTop: 12,
                textShadowColor: 'rgba(0, 0, 0, 0.5)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 5,
              }}>
                
              </Text>
            </View>

            {/* Location and Search Bar */}
            <View style={{
              alignItems: 'center',
              marginBottom: 24,
              paddingHorizontal: 20,
            }}>
              {/* Location and Search in Same Row */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                maxWidth: 800,
                gap: 16,
                position: 'relative',
              }}>
                {/* Location - Clickable */}
                <View style={{ position: 'relative' }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    }}
                    onPress={() => setShowLocationDropdown(!showLocationDropdown)}
                  >
                    <Ionicons name="location" size={20} color="#ffffff" />
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#ffffff',
                      marginLeft: 8,
                      marginRight: 4,
                      textShadowColor: 'rgba(0, 0, 0, 0.3)',
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 3,
                    }} numberOfLines={1}>
                      {isLoadingLocation ? 'Loading...' : currentLocation}
                    </Text>
                    <Ionicons 
                      name={showLocationDropdown ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color="#ffffff" 
                    />
                  </TouchableOpacity>

                  {/* Location Dropdown */}
                  {showLocationDropdown && (
                    <View style={{
                      position: 'absolute',
                      top: 50,
                      left: 0,
                      backgroundColor: '#ffffff',
                      borderRadius: 12,
                      shadowColor: 'rgba(0, 0, 0, 0.3)',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 1,
                      shadowRadius: 8,
                      elevation: 8,
                      minWidth: 220,
                      zIndex: 1000,
                    }}>
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: 16,
                          paddingVertical: 14,
                          borderBottomWidth: 1,
                          borderBottomColor: '#f0f0f0',
                        }}
                        onPress={getCurrentLocation}
                      >
                        <Ionicons name="navigate" size={20} color="#3b82f6" />
                        <Text style={{
                          fontSize: 15,
                          fontWeight: '500',
                          color: '#333',
                          marginLeft: 12,
                        }}>
                          Use my current location
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Search Bar */}
                <View style={{
                  flex: 1,
                  backgroundColor: '#ffffff',
                  borderRadius: 25,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 14,
                  shadowColor: 'rgba(0, 0, 0, 0.3)',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 1,
                  shadowRadius: 8,
                  elevation: 8,
                  ...(Platform.OS === 'web' && {
                    border: 'none',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                  } as any),
                }}>
                  <Ionicons name="search" size={22} color="#666" />
                  <TextInput
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      fontSize: 16,
                      color: '#333',
                      fontWeight: '500',
                      ...(Platform.OS === 'web' && {
                        outline: 'none',
                        border: 'none',
                        boxShadow: 'none',
                        borderWidth: 0,
                      } as any),
                    }}
                    placeholder="Search for hospitals, doctors, services..."
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
            </View>

            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 16,
              marginTop: 20,
              justifyContent: 'center',
            }}>
              {[
                {
                  key: 'bookings',
                  title: 'Book Appointment',
                  subtitle: 'Schedule at ease',
                  icon: 'calendar',
                  iconColor: '#3b82f6',
                  shadowColor: '#3b82f6',
                },
                {
                  key: 'ehr',
                  title: 'EHR',
                  subtitle: 'View health records',
                  icon: 'document-text',
                  iconColor: '#8b5cf6',
                  shadowColor: '#8b5cf6',
                },
                {
                  key: 'pharmacy',
                  title: 'Pharmacy',
                  subtitle: 'Order medicines online',
                  icon: 'medical-outline',
                  iconColor: '#10b981',
                  shadowColor: '#10b981',
                },
                {
                  key: 'diagnostics',
                  title: 'Diagnostics',
                  subtitle: 'Book lab tests & reports',
                  icon: 'analytics',
                  iconColor: '#f59e0b',
                  shadowColor: '#f59e0b',
                },
              ].map((action, index) => (
                <Animated.View key={action.key} style={[
                  {
                    flex: 1,
                    minWidth: 200,
                    maxWidth: 280,
                    borderRadius: 20,
                    overflow: 'hidden',
                    shadowColor: action.shadowColor,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.15,
                    shadowRadius: 20,
                    elevation: 8,
                    backgroundColor: '#ffffff',
                  },
                  {
                    transform: [{
                      scale: pulseAnim.interpolate({
                        inputRange: [1, 1.03],
                        outputRange: [1, 1.01],
                      })
                    }],
                  }
                ]}>
                  <TouchableOpacity
                    onPress={() => handleQuickAction(action.key)}
                    style={{
                      width: '100%',
                    }}
                    activeOpacity={0.85}
                    {...(Platform.OS === 'web' && {
                      onMouseEnter: (e: any) => {
                        e.currentTarget.parentElement.style.boxShadow = `0 12px 40px ${action.shadowColor}40, 0 0 0 2px ${action.shadowColor}20`;
                        e.currentTarget.parentElement.style.transform = 'translateY(-6px) scale(1.02)';
                        e.currentTarget.parentElement.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                        e.currentTarget.parentElement.style.borderRadius = '20px';
                      },
                      onMouseLeave: (e: any) => {
                        e.currentTarget.parentElement.style.boxShadow = `0 8px 20px ${action.shadowColor}15`;
                        e.currentTarget.parentElement.style.transform = 'translateY(0) scale(1)';
                      },
                    })}
                  >
                    <View
                      style={{
                        padding: 24,
                        alignItems: 'center',
                        position: 'relative',
                        minHeight: 140,
                        justifyContent: 'center',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      {/* Background Pattern */}
                      <View style={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: `${action.iconColor}15`,
                      }} />
                      <View style={{
                        position: 'absolute',
                        bottom: -30,
                        left: -30,
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: `${action.iconColor}10`,
                      }} />
                      
                      {/* Icon Container */}
                      <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 20,
                        backgroundColor: `${action.iconColor}20`,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 16,
                        borderWidth: 1,
                        borderColor: `${action.iconColor}30`,
                      }}>
                        <Ionicons 
                          name={action.icon as any} 
                          size={28} 
                          color={action.iconColor} 
                        />
                      </View>
                      
                      <Text style={{
                        fontSize: 18,
                        fontWeight: '700',
                        color: '#1f2937',
                        marginBottom: 6,
                        textAlign: 'center',
                      }}>
                        {action.title}
                      </Text>
                      
                      <Text style={{
                        fontSize: 14,
                        color: '#6b7280',
                        textAlign: 'center',
                        fontWeight: '500',
                        lineHeight: 20,
                      }}>
                        {action.subtitle}
                      </Text>
                      
                      {/* Shimmer effect */}
                      <Animated.View style={[
                        {
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          backgroundColor: `${action.iconColor}10`,
                          transform: [{ skewX: '-20deg' }],
                        },
                        {
                          opacity: pulseAnim.interpolate({
                            inputRange: [1, 1.03],
                            outputRange: [0.1, 0.3],
                          }),
                        }
                      ]} />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        </LinearGradient>
      </Animated.View>
      {/* Enhanced Health Tip Card */}
      <Animated.View 
        style={[
          {
            paddingHorizontal: 24,
            marginBottom: 32,
            marginTop: 32,
            maxWidth: 1200,
            alignSelf: 'center',
            width: '100%',
          },
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={{
          backgroundColor: '#ffffff',
          borderRadius: 20,
          padding: 24,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 8,
          borderWidth: 1,
          borderColor: '#f1f5f9',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background Decoration */}
          <View style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: '#fef3c7',
            opacity: 0.3,
          }} />
          <View style={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#ddd6fe',
            opacity: 0.2,
          }} />
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
            zIndex: 1,
          }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              backgroundColor: '#fef3c7',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
              shadowColor: '#f59e0b',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            }}>
              <Ionicons name="bulb" size={24} color="#f59e0b" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 20,
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: 2,
              }}>
                Health tip recommendation
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#6b7280',
                fontWeight: '500',
              }}>
                Your wellness reminder for today
              </Text>
            </View>
          </View>
          
          <Text style={{
            fontSize: 16,
            color: '#374151',
            lineHeight: 24,
            fontWeight: '500',
            zIndex: 1,
          }}>
            {getHealthTip()}
          </Text>
        </View>
      </Animated.View>

      {/* Enhanced Featured Hospitals */}
      <Animated.View 
        style={[
          {
            marginBottom: 32,
          },
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={{
          paddingHorizontal: 24,
          marginBottom: 20,
          maxWidth: 1200,
          alignSelf: 'center',
          width: '100%',
        }}>
          <Text style={{
            fontSize: 28,
            fontWeight: '800',
            color: '#1f2937',
            marginBottom: 8,
            letterSpacing: 0.5,
          }}>
            Featured Hospitals
          </Text>
          <Text style={{
            fontSize: 16,
            color: '#6b7280',
            fontWeight: '500',
            lineHeight: 24,
          }}>
            Top-rated healthcare providers near you
          </Text>
        </View>
        
        <View style={{
          backgroundColor: '#ffffff',
          margin: 24,
          padding: 24,
          borderRadius: 20,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 8,
          maxWidth: 1200,
          alignSelf: 'center',
          width: '100%',
          borderWidth: 1,
          borderColor: '#f1f5f9',
        }}>
          <View style={[
            {
              height: 260,
              overflow: 'visible',
            },
            Platform.OS === 'web' ? ({ overflowX: 'auto', overflowY: 'hidden' } as any) : {},
          ]}>
            <FlatList
              ref={hospitalScrollRef}
              data={hospitals}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled={false}
              snapToInterval={280}
              snapToAlignment="start"
              decelerationRate="fast"
              scrollEnabled={true}
              bounces={true}
              alwaysBounceHorizontal={true}
              contentInsetAdjustmentBehavior="never"
              renderItem={({ item }) => (
                <View style={{
                  width: 280,
                  height: 240,
                  marginHorizontal: 8,
                  marginRight: 16,
                  borderRadius: 16,
                  overflow: 'hidden',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 12,
                  elevation: 6,
                  backgroundColor: '#ffffff',
                }}>
                  <TouchableOpacity
                    onPress={() => handleHospitalPress(item)}
                    style={{ width: '100%', height: '100%' }}
                    activeOpacity={0.9}
                    {...(Platform.OS === 'web' && {
                      onMouseEnter: (e: any) => {
                        e.currentTarget.parentElement.style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.3), 0 0 0 2px rgba(59, 130, 246, 0.15)';
                        e.currentTarget.parentElement.style.transform = 'translateY(-6px) scale(1.02)';
                        e.currentTarget.parentElement.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                        e.currentTarget.parentElement.style.borderRadius = '16px';
                      },
                      onMouseLeave: (e: any) => {
                        e.currentTarget.parentElement.style.boxShadow = '';
                        e.currentTarget.parentElement.style.transform = 'translateY(0) scale(1)';
                      },
                    })}
                  >
                    <LinearGradient
                      colors={['#ffffff', '#f8fafc']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ width: '100%', height: '100%' }}
                    >
                      {/* Hospital Image */}
                      <View style={{
                        height: 120,
                        position: 'relative',
                        backgroundColor: '#f1f5f9',
                        borderWidth: 2,
                        borderColor: '#e5e7eb',
                        borderRadius: 12,
                        overflow: 'hidden',
                      }}>
                        <Image
                          source={{ uri: item.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&fit=crop&crop=center' }}
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'cover',
                          }}
                          defaultSource={require('../../../assets/image.png')}
                        />
                        {/* Rating Badge */}
                        <View style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 8,
                          gap: 4,
                          shadowColor: '#000000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 4,
                          elevation: 3,
                        }}>
                          <Ionicons name="star" size={12} color="#FFC107" />
                          <Text style={{
                            fontSize: 12,
                            fontWeight: '600',
                            color: '#1f2937',
                          }}>
                            {item.rating}
                          </Text>
                        </View>
                      </View>

                      {/* Hospital Info */}
                      <View style={{
                        padding: 16,
                        paddingBottom: 12,
                        flex: 1,
                      }}>
                        <Text style={{
                          fontSize: 16,
                          fontWeight: '700',
                          color: '#000000',
                          marginBottom: 4,
                        }} numberOfLines={1}>
                          {item.name}
                        </Text>
                        
                        <Text style={{
                          fontSize: 14,
                          color: '#4b5563',
                          marginBottom: 8,
                          fontWeight: '600',
                        }} numberOfLines={1}>
                          {item.specialization}
                        </Text>
                        
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4,
                          marginBottom: 6,
                        }}>
                          <Ionicons name="location-outline" size={14} color="#4b5563" />
                          <Text style={{
                            fontSize: 12,
                            color: '#4b5563',
                            flex: 1,
                          }} numberOfLines={1}>
                            {item.address}
                          </Text>
                        </View>
                        
                        {item.visitorsCount && (
                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                            marginBottom: 8,
                          }}>
                            <Ionicons name="people-outline" size={14} color="#6b7280" />
                            <Text style={{
                              fontSize: 12,
                              color: '#6b7280',
                              fontWeight: '500',
                            }}>
                              {item.visitorsCount >= 1000 
                                ? `${(item.visitorsCount / 1000).toFixed(1)}K` 
                                : item.visitorsCount} visitors
                            </Text>
                          </View>
                        )}
                        
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{
                paddingHorizontal: 8,
                paddingRight: 32,
              }}
              style={{ flexGrow: 0, height: 240 }}
              onScroll={(event) => {
                const contentOffset = event.nativeEvent.contentOffset.x;
                const index = Math.round(contentOffset / 280);
                setCurrentHospitalIndex(Math.max(0, Math.min(index, hospitals.length - 1)));
              }}
              scrollEventThrottle={16}
              onScrollToIndexFailed={(info) => {
                console.log('Scroll to index failed:', info);
              }}
            />
          </View>
        </View>
      </Animated.View>

      {/* Enhanced Quick Stats */}
      <Animated.View 
        style={[
          {
            paddingHorizontal: 24,
            marginBottom: 32,
            maxWidth: 1200,
            alignSelf: 'center',
            width: '100%',
          },
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          gap: 12,
          marginTop: 16,
          paddingHorizontal: 4,
        }}>
          {[
            {
              icon: 'business',
              number: '50+',
              label: 'HOSPITALS',
              gradient: ['#ffffff', '#ffffff'] as [string, string],
              iconGradient: ['#ffffff', '#ffffff'] as [string, string],
              iconColor: '#3B82F6',
              shadowColor: '#d1d5db',
            },
            {
              icon: 'people',
              number: '200+',
              label: 'DOCTORS',
              gradient: ['#ffffff', '#ffffff'] as [string, string],
              iconGradient: ['#ffffff', '#ffffff'] as [string, string],
              iconColor: '#000000',
              shadowColor: '#d1d5db',
            },
          ].map((stat, index) => (
            <Animated.View 
              key={index} 
              style={{
                flex: 1,
                maxWidth: '48%',
                transform: [{ scale: pulseAnim }],
              }}
            >
              <LinearGradient
                colors={stat.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 20,
                  padding: 20,
                  alignItems: 'center',
                  minHeight: 160,
                  width: '100%',
                  justifyContent: 'center',
                  shadowColor: stat.shadowColor,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 12,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Decorative Elements */}
                <View style={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }} />
                <View style={{
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                }} />
                
                {/* Icon Container with Gradient */}
                <LinearGradient
                  colors={stat.iconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                >
                  <Ionicons name={stat.icon as any} size={32} color={(stat as any).iconColor || "#000000"} />
                </LinearGradient>
                
                <Text style={{
                  fontSize: 36,
                  fontWeight: '900',
                  color: '#000000',
                  marginBottom: 6,
                }}>
                  {stat.number}
                </Text>
                
                <Text style={{
                  fontSize: 16,
                  color: '#000000',
                  textAlign: 'center',
                  fontWeight: '700',
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                }}>
                  {stat.label}
                </Text>
              </LinearGradient>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* Popular Medicines */}
      <Animated.View 
        style={[
          styles.medicinesSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Medicines</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllMedicines')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {medicines.slice(0, 6).map((medicine, index) => {
            const discount = getDiscount(medicine.id, 'medicines');
            const hasDiscount = discount > 0;
            const discountedPrice = hasDiscount ? calculateDiscountedPrice(medicine.price, discount) : medicine.price;
            
            return (
              <Card key={medicine.id} variant="elevated" padding="md" style={styles.medicinePreviewCard}>
                {medicine.image && (
                  <Image 
                    source={{ uri: medicine.image }} 
                    style={styles.medicinePreviewImage}
                    resizeMode="cover"
                  />
                )}
                {hasDiscount && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{discount}% OFF</Text>
                  </View>
                )}
                <View style={styles.medicinePreviewContent}>
                  <Text style={styles.medicinePreviewName} numberOfLines={2}>{medicine.name}</Text>
                  <Text style={styles.medicinePreviewCategory}>{medicine.category}</Text>
                  
                  <View style={styles.priceContainer}>
                    {hasDiscount ? (
                      <View style={styles.discountedPriceRow}>
                        <Text style={styles.originalPrice}>{medicine.price}</Text>
                        <Text style={styles.discountedPrice}>{discountedPrice}</Text>
                      </View>
                    ) : (
                      <Text style={styles.medicinePreviewPrice}>{medicine.price}</Text>
                    )}
                  </View>
                </View>
              </Card>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* Popular Diagnostic Tests */}
      <Animated.View 
        style={[
          styles.diagnosticsSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Diagnostic Tests</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllDiagnostics')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {diagnosticTests.slice(0, 6).map((test, index) => {
            const discount = getDiscount(test.id, 'diagnostics');
            const hasDiscount = discount > 0;
            const discountedPrice = hasDiscount ? calculateDiscountedPrice(test.price, discount) : test.price;
            
            return (
              <Card key={test.id} variant="elevated" padding="md" style={styles.testPreviewCard}>
                {test.image && (
                  <Image 
                    source={{ uri: test.image }} 
                    style={styles.testPreviewImage}
                    resizeMode="cover"
                  />
                )}
                {hasDiscount && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{discount}% OFF</Text>
                  </View>
                )}
                <View style={styles.testPreviewContent}>
                  <Text style={styles.testPreviewName} numberOfLines={2}>{test.name}</Text>
                  <Text style={styles.testPreviewCategory}>{test.category}</Text>
                  
                  <View style={styles.priceContainer}>
                    {hasDiscount ? (
                      <View style={styles.discountedPriceRow}>
                        <Text style={styles.originalPrice}>{test.price}</Text>
                        <Text style={styles.discountedPrice}>{discountedPrice}</Text>
                      </View>
                    ) : (
                      <Text style={styles.testPreviewPrice}>{test.price}</Text>
                    )}
                  </View>
                  
                  <View style={styles.testPreviewMeta}>
                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.testPreviewDuration}>{test.duration}</Text>
                  </View>
                </View>
              </Card>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* Enhanced Professional Footer */}
      <Animated.View 
        style={[
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.footer}>
          <LinearGradient
            colors={['#1e40af', '#3b82f6', '#60a5fa']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.footerGradient}
          >
            {/* Decorative background elements */}
            <View style={styles.footerDecorations}>
              <View style={[styles.footerDecoration, { top: 20, left: '10%', backgroundColor: 'rgba(59, 130, 246, 0.1)' }]} />
              <View style={[styles.footerDecoration, { top: 60, right: '15%', backgroundColor: 'rgba(16, 185, 129, 0.1)' }]} />
              <View style={[styles.footerDecoration, { bottom: 30, left: '70%', backgroundColor: 'rgba(168, 85, 247, 0.1)' }]} />
            </View>

            <View style={styles.footerContent}>
              {/* Inspiring Quote Section */}
              <View style={styles.footerQuoteSection}>
                <View style={styles.quoteContainer}>
                  <Text style={styles.inspiringQuote}>
                    "Made with care for healthier communities"
                  </Text>
                </View>
                <Text style={styles.quoteSubtext}>
                  Empowering lives through compassionate healthcare
                </Text>
              </View>

              {/* Main Footer Content */}
              <View style={styles.footerMainContent}>
                {/* Footer Logo and Brand */}
                <View style={styles.footerBrand}>
                  <View style={styles.footerLogoContainer}>
                    <Image 
                      source={require('../../../assets/image.png')} 
                      style={styles.footerLogo}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.footerBrandText}>
                    <Text style={styles.footerTitle}>Rapha</Text>
                    <Text style={styles.footerSubtitle}>Healthcare Excellence</Text>
                    <Text style={styles.footerMission}>
                      Transforming healthcare with technology and compassion
                    </Text>
                  </View>
                </View>

                {/* Footer Navigation */}
                <View style={styles.footerNav}>
                  <View style={styles.footerColumn}>
                    <Text style={styles.footerColumnTitle}>Services</Text>
                    <TouchableOpacity style={styles.footerNavLink}>
                      <Text style={styles.footerNavText}>Hospital Booking</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerNavLink}>
                      <Text style={styles.footerNavText}>Online Pharmacy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerNavLink}>
                      <Text style={styles.footerNavText}>Lab Tests</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.footerColumn}>
                    <Text style={styles.footerColumnTitle}>Support</Text>
                    <TouchableOpacity style={styles.footerNavLink}>
                      <Text style={styles.footerNavText}>Help Center</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerNavLink}>
                      <Text style={styles.footerNavText}>Contact Us</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerNavLink}>
                      <Text style={styles.footerNavText}>Emergency</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.footerColumn}>
                    <Text style={styles.footerColumnTitle}>Legal</Text>
                    <TouchableOpacity style={styles.footerNavLink}>
                      <Text style={styles.footerNavText}>Privacy Policy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerNavLink}>
                      <Text style={styles.footerNavText}>Terms of Service</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerNavLink}>
                      <Text style={styles.footerNavText}>Medical Disclaimer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Footer Bottom with Enhanced Copyright */}
              <View style={styles.footerBottom}>
                <View style={styles.footerDivider} />
                
                <View style={styles.footerBottomContent}>
                  <View style={styles.copyrightSection}>
                    <Text style={styles.footerCopyright}>
                      © 2025 Rapha Healthcare. All rights reserved.
                    </Text>
                    <Text style={styles.footerTagline}>
                      Connecting patients with quality healthcare providers
                    </Text>
                  </View>
                </View>

                {/* Final Inspiring Message */}
                <View style={styles.finalMessage}>
                  <Text style={styles.finalMessageText}>
                    "Every step towards better health is a victory worth celebrating" ✨
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </Animated.View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  </View>
  );
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
  
  // Hero Section
  heroSection: {
    marginBottom: spacing.sm,
    marginTop: 0,
    paddingTop: 0,
    ...(Platform.OS === 'web' && {
      marginBottom: spacing.sm,
      marginTop: 0,
      paddingTop: 0,
    }),
  },
  heroGradient: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    paddingTop: spacing.sm,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    ...(Platform.OS === 'web' && {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      paddingTop: spacing.sm,
      borderBottomLeftRadius: borderRadius.lg,
      borderBottomRightRadius: borderRadius.lg,
    } as any),
  },
  
  // Header Row with Profile
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
    ...(Platform.OS === 'web' && {
      paddingHorizontal: 0,
    }),
  },
  
  // Header spacer for balance
  headerSpacer: {
    flex: 1,
  },
  
  // Centered Header Title Styles
  centeredHeaderContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  
  headerLogoImage: {
    width: 55,
    height: 55,
    ...(Platform.OS === 'web' && ({
      maxWidth: 64,
      maxHeight: 64,
    } as any)),
  },
  
  headerTitle: {
    fontSize: fontSize.massive,
    fontWeight: '900',
    color: colors.textWhite,
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    ...(Platform.OS === 'web' && ({
      fontSize: Math.min(fontSize.massive * 1.2, 48),
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    } as any)),
  },
  
  // Profile Section Styles
  profileSection: {
    alignItems: 'flex-end',
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
    marginBottom: spacing.sm,
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
    alignItems: 'flex-end',
  },
  greetingText: {
    fontSize: fontSize.md,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: spacing.xs,
    textAlign: 'right',
  },
  userName: {
    fontSize: fontSize.huge,
    fontWeight: '800',
    color: colors.textWhite,
    textAlign: 'right',
  },
  heroSubtext: {
    fontSize: fontSize.lg,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: fontSize.lg * 1.4,
    paddingHorizontal: spacing.md,
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
  
  // Quick Actions
  quickActionsSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...(Platform.OS === 'web' && ({
      paddingHorizontal: spacing.md,
      maxWidth: 1200,
      alignSelf: 'center',
      width: '100%',
    } as any)),
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
    ...(Platform.OS === 'web' && ({
      justifyContent: 'center',
    } as any)),
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
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
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
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...(Platform.OS === 'web' && ({
      paddingHorizontal: spacing.md,
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
  
  // Enhanced Featured Section
  enhancedFeaturedSection: {
    marginBottom: spacing.md,
  },
  
  featuredHospitalsContainer: {
    backgroundColor: colors.background,
    margin: spacing.lg,
    padding: spacing.lg,
    ...shadows.sm,
    ...(Platform.OS === 'web' && ({
      maxWidth: 1200,
      alignSelf: 'center',
      width: 'calc(100% - 32px)',
    } as any)),
  },
  
  flatListWrapper: {
    height: 240,
    overflow: 'visible',
    ...(Platform.OS === 'web' && ({
      overflowX: 'auto',
      overflowY: 'hidden',
    } as any)),
  },
  
  hospitalsFlatList: {
    flexGrow: 0,
    height: 240,
  },
  
  hospitalsFlatListContent: {
    paddingHorizontal: spacing.sm,
    paddingRight: spacing.xl,
  },
  
  enhancedHospitalCard: {
    width: 260,
    height: 220,
    marginHorizontal: spacing.sm,
    marginRight: spacing.md,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#60a5fa', // Light blue border for individual cards
    ...shadows.sm,
    ...(Platform.OS === 'web' && ({
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minWidth: 260,
      flexShrink: 0,
    } as any)),
  },
  
  enhancedHospitalTouchable: {
    width: '100%',
  },
  
  enhancedHospitalGradient: {
    width: '100%',
  },
  
  hospitalImageContainer: {
    height: 110,
    position: 'relative',
    backgroundColor: colors.backgroundSecondary,
  },
  
  hospitalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  ratingBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    ...shadows.sm,
  },
  
  ratingText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  
  hospitalInfo: {
    padding: spacing.md,
    paddingBottom: spacing.xs,
    flex: 1,
  },
  
  hospitalName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  
  hospitalSpecialization: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  
  hospitalLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  
  hospitalLocation: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  
  hospitalVisitorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  
  hospitalVisitorsText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  
  hospitalActionContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
  },
  
  hospitalActionButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...(Platform.OS === 'web' && ({
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    } as any)),
  },
  
  hospitalActionText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textWhite,
  },
  
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cbd5e1', // Light gray for inactive dots
  },
  
  paginationDotActive: {
    backgroundColor: '#3b82f6', // Blue for active dot
    width: 20,
  },
  
  // Stats Section
  statsSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...(Platform.OS === 'web' && ({
      paddingHorizontal: spacing.md,
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
  
  // Diagnostics Section
  diagnosticsSection: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  
  // Medicines Section  
  medicinesSection: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  
  // Horizontal Scroll
  horizontalScroll: {
    paddingLeft: spacing.sm,
    paddingRight: spacing.lg,
  },

  
  // Medicine Preview Cards
  medicinePreviewCard: {
    width: 180,
    marginRight: spacing.md,
    marginBottom: spacing.sm,
    position: 'relative',
    borderWidth: 0,
  },
  medicinePreviewImage: {
    width: '100%',
    height: 90,
    borderRadius: 16,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  medicinePreviewContent: {
    flex: 1,
  },
  medicinePreviewName: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: '#000000',
    marginBottom: spacing.xs,
    lineHeight: fontSize.sm * 1.2,
  },
  medicinePreviewCategory: {
    fontSize: fontSize.xs,
    color: '#4b5563',
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  medicinePreviewPrice: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: '#000000',
    marginBottom: spacing.xs,
  },
  medicinePreviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  medicinePreviewStock: {
    fontSize: fontSize.xs,
    color: '#6b7280',
    flex: 1,
  },
  prescriptionBadge: {
    fontSize: fontSize.xs,
    color: colors.error,
    fontWeight: '600',
    backgroundColor: colors.error + '20',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },

  // Test Preview Cards
  testPreviewCard: {
    width: 180,
    marginRight: spacing.md,
    marginBottom: spacing.sm,
    position: 'relative',
    borderWidth: 0,
  },
  testPreviewImage: {
    width: '100%',
    height: 90,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  testPreviewContent: {
    flex: 1,
  },
  testPreviewName: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: '#000000',
    marginBottom: spacing.xs,
    lineHeight: fontSize.sm * 1.2,
  },
  testPreviewCategory: {
    fontSize: fontSize.xs,
    color: '#4b5563',
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  testPreviewPrice: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: '#000000',
    marginBottom: spacing.xs,
  },
  testPreviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  testPreviewDuration: {
    fontSize: fontSize.xs,
    color: '#6b7280',
  },

  // Discount Styles
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff4444',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  priceContainer: {
    marginBottom: spacing.xs,
  },
  discountedPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalPrice: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: '#6b7280',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  discountedPrice: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: '#000000',
  },
  
  // Hospitals Section
  hospitalsSection: {
    marginBottom: spacing.xl,
    ...(Platform.OS === 'web' && ({
      maxWidth: 1200,
      alignSelf: 'center',
      width: '100%',
    } as any)),
  },
  sectionHeader: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    ...(Platform.OS === 'web' && ({
      paddingHorizontal: spacing.md,
    } as any)),
  },
  sectionTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: fontSize.md * 1.4,
  },
  
  // Enhanced Nearby Hospitals Container
  nearbyHospitalsContainer: {
    backgroundColor: colors.background,
    margin: spacing.lg,
    padding: spacing.lg,
    ...shadows.sm,
    ...(Platform.OS === 'web' && ({
      maxWidth: 1200,
      alignSelf: 'center',
      width: 'calc(100% - 32px)',
    } as any)),
  },
  
  hospitalsList: {
    gap: spacing.md,
  },
  
  // Row container for 4 cards
  hospitalsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    ...(Platform.OS === 'web' && ({
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    } as any)),
  },
  
  // Nearby Hospital Card Styles
  nearbyHospitalCard: {
    flex: 1,
    minWidth: '22%', // Approximately 1/4 of the container width
    maxWidth: '24%', // Ensure 4 cards fit per row
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...(Platform.OS === 'web' && ({
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minWidth: 200,
      maxWidth: 280,
    } as any)),
  },
  
  nearbyHospitalTouchable: {
    width: '100%',
  },
  
  nearbyHospitalGradient: {
    flexDirection: 'column',
    padding: spacing.sm,
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  
  nearbyHospitalImageContainer: {
    width: '100%',
    height: 140,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  
  nearbyHospitalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  nearbyRatingBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 2,
    ...shadows.sm,
  },
  
  nearbyRatingText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  
  nearbyDistanceBadge: {
    position: 'absolute',
    bottom: spacing.xs,
    left: spacing.xs,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 2,
  },
  
  nearbyDistanceText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: '#fff',
  },
  
  nearbyHospitalContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  
  nearbyHospitalInfo: {
    flex: 1,
    marginBottom: spacing.sm,
  },
  
  nearbyHospitalName: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: '#000000',
    marginBottom: spacing.xs,
    lineHeight: fontSize.sm * 1.2,
  },
  
  nearbyHospitalSpecialization: {
    fontSize: fontSize.xs,
    color: '#4b5563',
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  
  nearbyHospitalLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: spacing.xs,
  },
  
  nearbyHospitalLocation: {
    fontSize: fontSize.xs,
    color: '#4b5563',
    flex: 1,
  },
  
  nearbyHospitalVisitorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: spacing.xs,
  },
  
  nearbyHospitalVisitorsText: {
    fontSize: fontSize.xs,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  nearbyHospitalFeatures: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  
  nearbyFeatureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 2,
  },
  
  nearbyFeatureText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6b7280',
  },
  
  travelTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  
  travelTimeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
  },
  
  travelTimeText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.primary,
  },
  
  travelTimeLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    gap: 2,
    ...(Platform.OS === 'web' && ({
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    } as any)),
  },
  
  directionsText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.primary,
  },
  
  // View All Button Styles
  viewAllContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
  },
  
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
    ...shadows.sm,
    ...(Platform.OS === 'web' && ({
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    } as any)),
  },
  
  viewAllText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary,
  },
  
  bottomSpacer: {
    height: spacing.massive,
  },
  
  // Enhanced Professional Footer Styles
  footer: {
    marginTop: 32,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  footerGradient: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  footerDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  footerDecoration: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.3,
  },
  footerContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    zIndex: 1,
  },
  
  // Quote Section
  footerQuoteSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingVertical: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  inspiringQuote: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  quoteSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  
  // Main Content
  footerMainContent: {
    marginBottom: 32,
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
    justifyContent: 'flex-start',
  },
  footerLogoContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  footerLogo: {
    width: 48,
    height: 48,
  },
  footerBrandText: {
    alignItems: 'flex-start',
    flex: 1,
  },
  footerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  footerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginBottom: 8,
  },
  footerMission: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    lineHeight: 20,
    maxWidth: 300,
  },
  
  // Navigation
  footerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 24,
    marginBottom: 32,
  },
  footerColumn: {
    flex: 1,
    minWidth: 120,
  },
  footerColumnTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  footerNavLink: {
    paddingVertical: 8,
  },
  footerNavText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    lineHeight: 20,
  },
  
  // Footer Bottom
  footerBottom: {
    alignItems: 'center',
  },
  footerDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 24,
  },
  footerBottomContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  copyrightSection: {
    alignItems: 'flex-start',
  },
  footerCopyright: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginBottom: 4,
  },
  footerTagline: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    lineHeight: 18,
  },
  
  // Final Message
  finalMessage: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  finalMessageText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '600',
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
});