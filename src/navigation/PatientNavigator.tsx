import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Dimensions } from 'react-native';
import { colors, fontSize } from '../utils/colors';
import { UserData } from '../utils/storage';

// Patient Screens
import { HomeScreen } from '../screens/Patient/HomeScreen';
import { MyBookingsScreen } from '../screens/Patient/MyBookingsScreen';
import { ProfileScreen } from '../screens/Patient/ProfileScreen';
import { AllMedicinesScreen } from '../screens/Patient/AllMedicinesScreen';
import { AllDiagnosticsScreen } from '../screens/Patient/AllDiagnosticsScreen';

// Additional Screens
import { PharmacyScreen } from '../screens/ComingSoon/PharmacyScreen';
import { DiagnosticsScreen } from '../screens/ComingSoon/DiagnosticsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

interface PatientNavigatorProps {
  userData: UserData;
  onLogout: () => void;
  onUpdateUserData: (userData: UserData) => void;
}

// Tab Navigator Component
const PatientTabs: React.FC<PatientNavigatorProps> = ({
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
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
        position: 'relative' as const,
        borderRadius: isLargeScreen ? 16 : 12,
        marginHorizontal: isLargeScreen ? 20 : isMediumScreen ? 10 : 0,
        marginBottom: isLargeScreen ? 20 : isMediumScreen ? 10 : 0,
        backdropFilter: 'blur(10px)',
        background: `linear-gradient(135deg, ${colors.background}f0, ${colors.background}e0)`,
      };

      if (isSmallScreen) {
        return {
          ...baseStyle,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          paddingHorizontal: 8,
          marginHorizontal: 0,
          marginBottom: 0,
          borderRadius: 0,
        };
      } else if (isMediumScreen) {
        return {
          ...baseStyle,
          height: 75,
          paddingBottom: 12,
          paddingTop: 12,
          paddingHorizontal: 16,
          maxWidth: 600,
          alignSelf: 'center' as const,
        };
      } else {
        return {
          ...baseStyle,
          height: 85,
          paddingBottom: 16,
          paddingTop: 16,
          paddingHorizontal: 24,
          maxWidth: 800,
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
          fontSize: 11,
          fontWeight: '600' as const,
          marginTop: 2,
        };
      } else if (isMediumScreen) {
        return {
          fontSize: 13,
          fontWeight: '700' as const,
          marginTop: 4,
          letterSpacing: 0.5,
        };
      } else {
        return {
          fontSize: 14,
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
      if (width < 768) return 22;
      if (width < 1024) return 26;
      return 28;
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
        const existingStyle = document.getElementById('patient-navigator-styles');
        if (existingStyle) existingStyle.remove();

        const styleElement = document.createElement('style');
        styleElement.id = 'patient-navigator-styles';
        styleElement.textContent = `
          /* Responsive Tab Navigation */
          [role="tablist"] {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }

          [role="tab"] {
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
            position: relative !important;
            overflow: visible !important;
          }

          [role="tab"]:hover {
            background-color: rgba(59, 130, 246, 0.08) !important;
            transform: translateY(-2px) !important;
          }

          [role="tab"]:active {
            transform: translateY(0) !important;
          }

          /* Active tab indicator */
          [role="tab"][aria-selected="true"]::before {
            content: '';
            position: absolute;
            top: -2px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            border-radius: 0 0 4px 4px;
            animation: slideIn 0.3s ease-out;
          }

          @keyframes slideIn {
            from {
              width: 0;
              opacity: 0;
            }
            to {
              width: 40px;
              opacity: 1;
            }
          }

          /* Responsive breakpoints */
          @media (max-width: 767px) {
            [role="tablist"] {
              border-radius: 0 !important;
              margin: 0 !important;
              box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1) !important;
            }
            
            [role="tab"] {
              min-width: 80px !important;
              padding: 8px 4px !important;
            }
          }

          @media (min-width: 768px) and (max-width: 1023px) {
            [role="tablist"] {
              box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.12) !important;
              border-radius: 12px 12px 0 0 !important;
            }
            
            [role="tab"] {
              min-width: 120px !important;
              padding: 12px 16px !important;
            }

            [role="tab"]:hover {
              background-color: rgba(59, 130, 246, 0.1) !important;
              transform: translateY(-3px) !important;
            }
          }

          @media (min-width: 1024px) {
            [role="tablist"] {
              box-shadow: 0 -6px 30px rgba(0, 0, 0, 0.15) !important;
              border-radius: 16px 16px 0 0 !important;
              backdrop-filter: blur(20px) !important;
            }
            
            [role="tab"] {
              min-width: 140px !important;
              padding: 16px 20px !important;
            }

            [role="tab"]:hover {
              background-color: rgba(59, 130, 246, 0.12) !important;
              transform: translateY(-4px) !important;
              box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2) !important;
            }

            [role="tab"][aria-selected="true"]::before {
              width: 50px;
              height: 4px;
            }
          }

          /* Enhanced focus states */
          [role="tab"]:focus-visible {
            outline: 2px solid #3b82f6 !important;
            outline-offset: 2px !important;
            border-radius: 8px !important;
          }

          /* Tab content alignment */
          [role="tab"] > div {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 4px !important;
          }

          /* Smooth icon transitions */
          [role="tab"] svg {
            transition: transform 0.2s ease !important;
          }

          [role="tab"]:hover svg {
            transform: scale(1.1) !important;
          }

          [role="tab"][aria-selected="true"] svg {
            transform: scale(1.15) !important;
          }
        `;
        document.head.appendChild(styleElement);
      };

      setTimeout(addWebStyles, 100);
      return () => {
        const styleElement = document.getElementById('patient-navigator-styles');
        if (styleElement) styleElement.remove();
      };
    }
  }, [screenData]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MyBookings') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse-outline';
          }

          const size = getResponsiveIconSize();
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
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
        name="Home"
        options={{
          title: 'Home',
          headerShown: false,
        }}
      >
        {(props) => <HomeScreen {...props} userData={userData} onUpdateUserData={onUpdateUserData} />}
      </Tab.Screen>
      
      <Tab.Screen
        name="MyBookings"
        options={{
          title: 'My Bookings',
          headerShown: false,
        }}
      >
        {(props) => <MyBookingsScreen {...props} userData={userData} />}
      </Tab.Screen>
      
      <Tab.Screen
        name="Profile"
        options={{
          title: 'Profile',
          headerShown: false,
        }}
      >
        {(props) => (
          <ProfileScreen
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

export const PatientNavigator: React.FC<PatientNavigatorProps> = (props) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PatientTabs">
        {() => <PatientTabs {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="PharmacyScreen"
        component={PharmacyScreen}
        options={{ headerShown: true, title: 'Pharmacy' }}
      />
      <Stack.Screen
        name="DiagnosticsScreen"
        component={DiagnosticsScreen}
        options={{ headerShown: true, title: 'Diagnostics' }}
      />
      <Stack.Screen
        name="AllMedicines"
        component={AllMedicinesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AllDiagnostics"
        component={AllDiagnosticsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};