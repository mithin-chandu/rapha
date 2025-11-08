import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Dimensions } from 'react-native';
import { colors, fontSize } from '../utils/colors';
import { UserData } from '../utils/storage';

// Hospital Screens
import { DashboardScreen } from '../screens/Hospital/DashboardScreen';
import { AppointmentsScreen } from '../screens/Hospital/AppointmentsScreen';
import { DoctorsScreen } from '../screens/Hospital/DoctorsScreen';
import { HospitalProfileScreen } from '../screens/Hospital/ProfileScreen';

const Tab = createBottomTabNavigator();

interface HospitalNavigatorProps {
  userData: UserData;
  onLogout: () => void;
  onUpdateUserData: (userData: UserData) => void;
}

export const HospitalNavigator: React.FC<HospitalNavigatorProps> = ({
  userData,
  onLogout,
  onUpdateUserData,
}) => {
  const [screenData, setScreenData] = React.useState(Dimensions.get('window'));

  // Get responsive styles based on screen size
  const getResponsiveTabBarStyle = () => {
    const { width, height } = screenData;
    const isSmallScreen = width < 768;
    const isMediumScreen = width >= 768 && width < 1024;
    const isLargeScreen = width >= 1024;

    if (Platform.OS === 'web') {
      const baseStyle = {
        backgroundColor: colors.background,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 12,
        position: 'relative' as const,
        borderRadius: isLargeScreen ? 16 : 12,
        marginHorizontal: isLargeScreen ? 20 : isMediumScreen ? 10 : 0,
        marginBottom: isLargeScreen ? 20 : isMediumScreen ? 10 : 0,
        backdropFilter: 'blur(12px)',
        background: `linear-gradient(135deg, ${colors.background}f5, ${colors.background}e5)`,
      };

      if (isSmallScreen) {
        return {
          ...baseStyle,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          paddingHorizontal: 6,
          marginHorizontal: 0,
          marginBottom: 0,
          borderRadius: 0,
        };
      } else if (isMediumScreen) {
        return {
          ...baseStyle,
          height: 78,
          paddingBottom: 12,
          paddingTop: 12,
          paddingHorizontal: 16,
          maxWidth: 650,
          alignSelf: 'center' as const,
        };
      } else {
        return {
          ...baseStyle,
          height: 88,
          paddingBottom: 18,
          paddingTop: 18,
          paddingHorizontal: 28,
          maxWidth: 900,
          alignSelf: 'center' as const,
        };
      }
    }

    // Mobile styles
    return {
      backgroundColor: colors.background,
      borderTopColor: colors.border,
      height: 60,
      paddingBottom: 8,
      paddingTop: 8,
    };
  };

  const getResponsiveLabelStyle = () => {
    const { width } = screenData;
    const isSmallScreen = width < 768;
    const isMediumScreen = width >= 768 && width < 1024;
    
    if (Platform.OS === 'web') {
      if (isSmallScreen) {
        return {
          fontSize: 10,
          fontWeight: '600' as const,
          marginTop: 2,
        };
      } else if (isMediumScreen) {
        return {
          fontSize: 12,
          fontWeight: '700' as const,
          marginTop: 4,
          letterSpacing: 0.5,
        };
      } else {
        return {
          fontSize: 13,
          fontWeight: '700' as const,
          marginTop: 6,
          letterSpacing: 0.8,
        };
      }
    }

    return {
      fontSize: fontSize.xs,
      fontWeight: '600' as const,
    };
  };

  const getResponsiveIconStyle = () => {
    const { width } = screenData;
    const isSmallScreen = width < 768;
    const isMediumScreen = width >= 768 && width < 1024;
    
    if (Platform.OS === 'web') {
      if (isSmallScreen) {
        return {
          marginBottom: 1,
        };
      } else if (isMediumScreen) {
        return {
          marginBottom: 2,
        };
      } else {
        return {
          marginBottom: 4,
        };
      }
    }

    return {
      marginBottom: 0,
    };
  };

  const getResponsiveIconSize = () => {
    const { width } = screenData;
    if (Platform.OS === 'web') {
      if (width < 768) return 20;
      if (width < 1024) return 24;
      return 26;
    }
    return 24;
  };

  // Listen for screen size changes
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleResize = () => {
        setScreenData(Dimensions.get('window'));
      };

      const subscription = Dimensions.addEventListener('change', handleResize);
      return () => subscription?.remove();
    }
  }, []);

  // Add web-specific styles
  useEffect(() => {
    if (Platform.OS === 'web') {
      const addWebStyles = () => {
        const existingStyle = document.getElementById('hospital-navigator-styles');
        if (existingStyle) existingStyle.remove();

        const styleElement = document.createElement('style');
        styleElement.id = 'hospital-navigator-styles';
        styleElement.textContent = `
          /* Hospital Navigation Responsive Styles */
          .hospital-tab-bar [role="tablist"] {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }

          .hospital-tab-bar [role="tab"] {
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
            position: relative !important;
            overflow: visible !important;
          }

          .hospital-tab-bar [role="tab"]:hover {
            background-color: rgba(139, 92, 246, 0.08) !important;
            transform: translateY(-2px) !important;
          }

          .hospital-tab-bar [role="tab"]:active {
            transform: translateY(0) !important;
          }

          /* Hospital active tab indicator with secondary color */
          .hospital-tab-bar [role="tab"][aria-selected="true"]::before {
            content: '';
            position: absolute;
            top: -2px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 3px;
            background: linear-gradient(90deg, #8b5cf6, #3b82f6);
            border-radius: 0 0 4px 4px;
            animation: hospitalSlideIn 0.3s ease-out;
          }

          @keyframes hospitalSlideIn {
            from {
              width: 0;
              opacity: 0;
            }
            to {
              width: 40px;
              opacity: 1;
            }
          }

          /* Hospital responsive breakpoints */
          @media (max-width: 767px) {
            .hospital-tab-bar [role="tablist"] {
              border-radius: 0 !important;
              margin: 0 !important;
              box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1) !important;
            }
            
            .hospital-tab-bar [role="tab"] {
              min-width: 75px !important;
              padding: 8px 3px !important;
            }
          }

          @media (min-width: 768px) and (max-width: 1023px) {
            .hospital-tab-bar [role="tablist"] {
              box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.12) !important;
              border-radius: 12px 12px 0 0 !important;
            }
            
            .hospital-tab-bar [role="tab"] {
              min-width: 110px !important;
              padding: 12px 14px !important;
            }

            .hospital-tab-bar [role="tab"]:hover {
              background-color: rgba(139, 92, 246, 0.1) !important;
              transform: translateY(-3px) !important;
            }
          }

          @media (min-width: 1024px) {
            .hospital-tab-bar [role="tablist"] {
              box-shadow: 0 -6px 30px rgba(0, 0, 0, 0.15) !important;
              border-radius: 16px 16px 0 0 !important;
              backdrop-filter: blur(20px) !important;
            }
            
            .hospital-tab-bar [role="tab"] {
              min-width: 130px !important;
              padding: 18px 22px !important;
            }

            .hospital-tab-bar [role="tab"]:hover {
              background-color: rgba(139, 92, 246, 0.12) !important;
              transform: translateY(-4px) !important;
              box-shadow: 0 4px 16px rgba(139, 92, 246, 0.2) !important;
            }

            .hospital-tab-bar [role="tab"][aria-selected="true"]::before {
              width: 50px;
              height: 4px;
            }
          }

          /* Enhanced focus states for hospital tabs */
          .hospital-tab-bar [role="tab"]:focus-visible {
            outline: 2px solid #8b5cf6 !important;
            outline-offset: 2px !important;
            border-radius: 8px !important;
          }

          /* Hospital tab content alignment */
          .hospital-tab-bar [role="tab"] > div {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 3px !important;
          }

          /* Hospital smooth icon transitions */
          .hospital-tab-bar [role="tab"] svg {
            transition: transform 0.2s ease !important;
          }

          .hospital-tab-bar [role="tab"]:hover svg {
            transform: scale(1.1) !important;
          }

          .hospital-tab-bar [role="tab"][aria-selected="true"] svg {
            transform: scale(1.15) !important;
          }
        `;
        document.head.appendChild(styleElement);
      };

      setTimeout(addWebStyles, 100);
      return () => {
        const styleElement = document.getElementById('hospital-navigator-styles');
        if (styleElement) styleElement.remove();
      };
    }
  }, [screenData]);

  // Add hospital-specific class to container
  useEffect(() => {
    if (Platform.OS === 'web') {
      const addHospitalClass = () => {
        const container = document.querySelector('[role="navigation"]');
        if (container) {
          container.classList.add('hospital-tab-bar');
        }
      };
      
      setTimeout(addHospitalClass, 200);
    }
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Doctors') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'HospitalProfile') {
            iconName = focused ? 'business' : 'business-outline';
          } else {
            iconName = 'ellipse-outline';
          }

          const size = getResponsiveIconSize();
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.secondary, // Use secondary color for hospital
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: getResponsiveTabBarStyle(),
        tabBarLabelStyle: getResponsiveLabelStyle(),
        tabBarIconStyle: getResponsiveIconStyle(),
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          fontSize: fontSize.lg,
          fontWeight: '700',
          color: colors.textPrimary,
        },
        headerTintColor: colors.textPrimary,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        options={{
          title: 'Dashboard',
          headerShown: false,
        }}
      >
        {(props) => <DashboardScreen {...props} userData={userData} />}
      </Tab.Screen>
      
      <Tab.Screen
        name="Appointments"
        options={{
          title: 'Appointments',
          headerShown: false,
        }}
      >
        {(props) => <AppointmentsScreen {...props} userData={userData} />}
      </Tab.Screen>
      
      <Tab.Screen
        name="Doctors"
        options={{
          title: 'Doctors',
          headerShown: false,
        }}
      >
        {(props) => <DoctorsScreen {...props} userData={userData} />}
      </Tab.Screen>
      
      <Tab.Screen
        name="HospitalProfile"
        options={{
          title: 'Profile',
          headerShown: false,
        }}
      >
        {(props) => (
          <HospitalProfileScreen
            {...props}
            userData={userData}
            onLogout={onLogout}
            onUpdateUserData={onUpdateUserData}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};