import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import { UserData } from '../utils/storage';
import * as Location from 'expo-location';

interface WebHeaderProps {
  title: string;
  userData: UserData;
  onLogout: () => void;
  onUpdateUserData: (userData: UserData) => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showProfile?: boolean;
  navigation?: any;
}

export const WebHeader: React.FC<WebHeaderProps> = ({
  title,
  userData,
  onLogout,
  onUpdateUserData,
  showBackButton = false,
  onBackPress,
  showProfile = true,
  navigation,
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Vijayawada');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setShowLocationDropdown(false);
    
    try {
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
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const { latitude, longitude } = location.coords;
      
      try {
        const [geocode] = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        
        if (geocode) {
          const locationName = geocode.city || geocode.subregion || geocode.region || 'Current Location';
          setCurrentLocation(locationName);
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getResponsiveStyles = () => {
    if (Platform.OS !== 'web') return {};
    
    const width = (global as any).window?.innerWidth || 1200;
    
    return {
      container: {
        height: width < 768 ? 50 : 60,
        paddingHorizontal: width < 768 ? 16 : width < 1024 ? 24 : 32,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
      },
      title: {
        fontSize: width < 768 ? 18 : width < 1024 ? 20 : 22,
      },
      profile: {
        width: width < 768 ? 40 : 45,
        height: width < 768 ? 40 : 45,
      },
      profileText: {
        fontSize: width < 768 ? 14 : 16,
      },
    };
  };

  const responsiveStyles = getResponsiveStyles();

  const baseStyles = {
    container: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
      paddingVertical: 0,
      paddingHorizontal: 20,
      paddingTop: 0,
      paddingBottom: 0,
      marginTop: 0,
      zIndex: 100,
      ...(Platform.OS === 'web' && {
        position: 'sticky' as any,
        top: 0,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        ...responsiveStyles.container,
      }),
    },
    leftSection: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      flex: 1,
    },
    backButton: {
      padding: 8,
      marginRight: 12,
      borderRadius: 8,
      backgroundColor: colors.backgroundSecondary,
      ...(Platform.OS === 'web' && {
        cursor: 'pointer' as any,
        transition: 'all 0.2s ease',
      }),
    },

    title: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.textPrimary,
      ...(Platform.OS === 'web' && responsiveStyles.title),
    },
    rightSection: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 12,
    },
    locationButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.primary + '15',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.primary + '30',
      gap: 6,
      position: 'relative' as const,
      ...(Platform.OS === 'web' && {
        cursor: 'pointer' as any,
      }),
    },
    locationText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.primary,
      maxWidth: 100,
    },
    locationDropdown: {
      position: 'absolute' as const,
      top: 45,
      right: 0,
      backgroundColor: colors.background,
      borderRadius: 12,
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 8,
      minWidth: 220,
      zIndex: 1000,
      ...(Platform.OS === 'web' && {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
      }),
    },
    locationDropdownItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
      ...(Platform.OS === 'web' && {
        cursor: 'pointer' as any,
      }),
    },
    locationDropdownText: {
      fontSize: 15,
      fontWeight: '500' as const,
      color: colors.textPrimary,
      marginLeft: 12,
    },
    searchBar: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 8,
      minWidth: 300,
      maxWidth: 400,
      gap: 10,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: '500' as const,
      ...(Platform.OS === 'web' && {
        outline: 'none' as any,
        border: 'none',
      }),
    },
    helpButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.backgroundSecondary,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderWidth: 1,
      borderColor: colors.borderLight,
      ...(Platform.OS === 'web' && {
        cursor: 'pointer' as any,
        transition: 'all 0.2s ease',
      }),
    },
    profileButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      padding: 8,
      borderRadius: 25,
      backgroundColor: colors.backgroundSecondary,
      ...(Platform.OS === 'web' && {
        cursor: 'pointer' as any,
        transition: 'all 0.2s ease',
      }),
    },
    profileAvatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginRight: 8,
      overflow: 'hidden' as const,
      ...(Platform.OS === 'web' && responsiveStyles.profile),
    },
    profileText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.textWhite,
      ...(Platform.OS === 'web' && responsiveStyles.profileText),
    },
    profileName: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.textPrimary,
      marginRight: 8,
      ...(Platform.OS === 'web' && {
        opacity: (global as any).window?.innerWidth < 768 ? 0 : 1,
      }),
    },
    // Modal styles - Redesigned
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'flex-start' as const,
      alignItems: 'flex-end' as const,
      paddingTop: Platform.OS === 'web' ? 10 : 10,
      paddingRight: Platform.OS === 'web' ? 20 : 16,
      ...(Platform.OS === 'web' && {
        position: 'fixed' as any,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
      }),
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: 0,
      minWidth: Platform.OS === 'web' ? 320 : 300,
      maxWidth: Platform.OS === 'web' ? 380 : 350,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 15,
      ...(Platform.OS === 'web' && {
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${colors.borderLight}`,
      }),
    },
    modalHeader: {
      padding: 24,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    modalHeaderContent: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    modalAvatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginRight: 16,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    modalAvatarGradient: {
      width: 70,
      height: 70,
      borderRadius: 35,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    modalAvatarText: {
      fontSize: 28,
      fontWeight: '800' as const,
      color: colors.textWhite,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    modalUserInfo: {
      flex: 1,
    },
    modalUserName: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.textPrimary,
      marginBottom: 6,
      letterSpacing: 0.3,
    },
    modalUserRole: {
      fontSize: 14,
      color: colors.textSecondary,
      textTransform: 'capitalize' as const,
      fontWeight: '500' as const,
      backgroundColor: colors.backgroundSecondary,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start' as const,
    },
    modalActions: {
      padding: 16,
      paddingTop: 8,
    },
    modalButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      padding: 18,
      marginBottom: 12,
      borderRadius: 16,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.borderLight,
      ...(Platform.OS === 'web' && {
        cursor: 'pointer' as any,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }),
    },
    modalButtonIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginRight: 16,
      backgroundColor: colors.backgroundSecondary,
    },
    modalButtonText: {
      flex: 1,
    },
    modalButtonTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.textPrimary,
      marginBottom: 2,
    },
    modalButtonSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '400' as const,
    },
    editProfileButton: {
      borderColor: colors.primary + '30',
      backgroundColor: colors.primary + '08',
    },
    editProfileIcon: {
      backgroundColor: colors.primary + '20',
    },
    logoutButton: {
      borderColor: colors.error + '30',
      backgroundColor: colors.error + '08',
      marginBottom: 0,
    },
    logoutIcon: {
      backgroundColor: colors.error + '20',
    },
    logoutButtonTitle: {
      color: colors.error,
    },
    modalFooter: {
      padding: 16,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
    closeButton: {
      alignSelf: 'center' as const,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
      backgroundColor: 'transparent',
      ...(Platform.OS === 'web' && {
        cursor: 'pointer' as any,
        transition: 'all 0.2s ease',
      }),
    },
    closeButtonText: {
      fontSize: 15,
      fontWeight: '600' as const,
      color: colors.textSecondary,
    },
  };

  return (
    <>
      <View style={baseStyles.container}>
        <View style={baseStyles.leftSection}>
          {showBackButton && onBackPress && (
            <TouchableOpacity
              style={baseStyles.backButton}
              onPress={onBackPress}
              {...(Platform.OS === 'web' && {
                onMouseEnter: (e: any) => {
                  e.target.style.backgroundColor = colors.hover;
                },
                onMouseLeave: (e: any) => {
                  e.target.style.backgroundColor = colors.backgroundSecondary;
                },
              })}
            >
              <Ionicons name="arrow-back" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {showProfile && (
          <View style={baseStyles.rightSection}>
            {/* Location Picker */}
            <View style={{ position: 'relative', zIndex: 1000 }}>
              <TouchableOpacity
                style={baseStyles.locationButton}
                onPress={() => setShowLocationDropdown(!showLocationDropdown)}
                {...(Platform.OS === 'web' && {
                  onMouseEnter: (e: any) => {
                    e.currentTarget.style.backgroundColor = colors.primary + '25';
                  },
                  onMouseLeave: (e: any) => {
                    e.currentTarget.style.backgroundColor = colors.primary + '15';
                  },
                })}
              >
                <Ionicons name="location" size={18} color={colors.primary} />
                <Text style={baseStyles.locationText} numberOfLines={1}>
                  {isLoadingLocation ? 'Loading...' : currentLocation}
                </Text>
                <Ionicons 
                  name={showLocationDropdown ? "chevron-up" : "chevron-down"} 
                  size={14} 
                  color={colors.primary} 
                />
              </TouchableOpacity>

              {/* Location Dropdown */}
              {showLocationDropdown && (
                <View style={baseStyles.locationDropdown}>
                  <TouchableOpacity
                    style={baseStyles.locationDropdownItem}
                    onPress={getCurrentLocation}
                    {...(Platform.OS === 'web' && {
                      onMouseEnter: (e: any) => {
                        e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                      },
                      onMouseLeave: (e: any) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      },
                    })}
                  >
                    <Ionicons name="navigate" size={20} color={colors.primary} />
                    <Text style={baseStyles.locationDropdownText}>
                      Use my current location
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Search Bar */}
            <View style={baseStyles.searchBar}>
              <Ionicons name="search" size={18} color={colors.textSecondary} />
              <TextInput
                style={baseStyles.searchInput}
                placeholder="Search hospitals, doctors..."
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Help Button */}
            <TouchableOpacity
              style={baseStyles.helpButton}
              onPress={() => Alert.alert('Help', 'How can we assist you today?')}
              {...(Platform.OS === 'web' && {
                onMouseEnter: (e: any) => {
                  e.currentTarget.style.backgroundColor = colors.hover;
                },
                onMouseLeave: (e: any) => {
                  e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                },
              })}
            >
              <Ionicons name="help-circle-outline" size={22} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Profile Button */}
            <TouchableOpacity
              style={baseStyles.profileButton}
              onPress={() => setShowProfileModal(true)}
              {...(Platform.OS === 'web' && {
                onMouseEnter: (e: any) => {
                  e.target.style.backgroundColor = colors.hover;
                  e.target.style.transform = 'scale(1.02)';
                },
                onMouseLeave: (e: any) => {
                  e.target.style.backgroundColor = colors.backgroundSecondary;
                  e.target.style.transform = 'scale(1)';
                },
              })}
            >
              <View style={baseStyles.profileAvatar}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryLight]}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 21,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="person" size={24} color={colors.textWhite} />
                </LinearGradient>
              </View>
              <Text style={baseStyles.profileName}>{userData.name}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal
        visible={showProfileModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <TouchableOpacity
          style={baseStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowProfileModal(false)}
        >
          <TouchableOpacity
            style={baseStyles.modalContent as any}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View style={baseStyles.modalHeader}>
              <View style={baseStyles.modalHeaderContent}>
                <View style={baseStyles.modalAvatar}>
                  <LinearGradient
                    colors={[colors.primary, colors.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={baseStyles.modalAvatarGradient}
                  >
                    <Text style={baseStyles.modalAvatarText}>
                      {getInitials(userData.name)}
                    </Text>
                  </LinearGradient>
                </View>
                <View style={baseStyles.modalUserInfo}>
                  <Text style={baseStyles.modalUserName}>{userData.name}</Text>
                  <Text style={baseStyles.modalUserRole}>
                    {userData.role} Account
                  </Text>
                </View>
              </View>
            </View>

            <View style={baseStyles.modalActions}>
              <TouchableOpacity
                style={[baseStyles.modalButton, baseStyles.editProfileButton]}
                onPress={() => {
                  setShowProfileModal(false);
                  const profileScreenName = userData.role === 'hospital' ? 'HospitalProfile' : 'PatientProfile';
                  if (navigation) {
                    navigation.navigate(profileScreenName);
                  }
                }}
                {...(Platform.OS === 'web' && {
                  onMouseEnter: (e: any) => {
                    e.currentTarget.style.backgroundColor = colors.primary + '15';
                    e.currentTarget.style.borderColor = colors.primary + '50';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  },
                  onMouseLeave: (e: any) => {
                    e.currentTarget.style.backgroundColor = colors.primary + '08';
                    e.currentTarget.style.borderColor = colors.primary + '30';
                    e.currentTarget.style.transform = 'translateY(0px)';
                  },
                })}
              >
                <View style={[baseStyles.modalButtonIcon, baseStyles.editProfileIcon]}>
                  <Ionicons name="person-outline" size={20} color={colors.primary} />
                </View>
                <View style={baseStyles.modalButtonText}>
                  <Text style={baseStyles.modalButtonTitle}>Edit Profile</Text>
                  <Text style={baseStyles.modalButtonSubtitle}>Update your information and settings</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[baseStyles.modalButton, baseStyles.logoutButton]}
                onPress={() => {
                  setShowProfileModal(false);
                  onLogout();
                }}
                {...(Platform.OS === 'web' && {
                  onMouseEnter: (e: any) => {
                    e.currentTarget.style.backgroundColor = colors.error + '15';
                    e.currentTarget.style.borderColor = colors.error + '50';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  },
                  onMouseLeave: (e: any) => {
                    e.currentTarget.style.backgroundColor = colors.error + '08';
                    e.currentTarget.style.borderColor = colors.error + '30';
                    e.currentTarget.style.transform = 'translateY(0px)';
                  },
                })}
              >
                <View style={[baseStyles.modalButtonIcon, baseStyles.logoutIcon]}>
                  <Ionicons name="log-out-outline" size={20} color={colors.error} />
                </View>
                <View style={baseStyles.modalButtonText}>
                  <Text style={[baseStyles.modalButtonTitle, baseStyles.logoutButtonTitle]}>Sign Out</Text>
                  <Text style={baseStyles.modalButtonSubtitle}>Sign out of your account</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={baseStyles.modalFooter}>
              <TouchableOpacity
                style={baseStyles.closeButton}
                onPress={() => setShowProfileModal(false)}
                {...(Platform.OS === 'web' && {
                  onMouseEnter: (e: any) => {
                    e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                  },
                  onMouseLeave: (e: any) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  },
                })}
              >
                <Text style={baseStyles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};
