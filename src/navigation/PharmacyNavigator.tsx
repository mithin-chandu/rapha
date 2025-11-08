import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import { UserData } from '../utils/storage';

// Pharmacy Screens
import { PharmacyDashboardScreen } from '../screens/Pharmacy/PharmacyDashboardScreen';
import { PharmacyScreen } from '../screens/ComingSoon/PharmacyScreen'; // Temporary placeholder

const Tab = createBottomTabNavigator();

interface PharmacyNavigatorProps {
  userData: UserData;
  onLogout: () => void;
  onUpdateUserData: (userData: UserData) => void;
}

export const PharmacyNavigator: React.FC<PharmacyNavigatorProps> = ({
  userData,
  onLogout,
  onUpdateUserData,
}) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'PharmacyDashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'PharmacyInventory') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'PharmacyOrders') {
            iconName = focused ? 'bag' : 'bag-outline';
          } else if (route.name === 'PharmacyProfile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#7C3AED',
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.borderLight,
          paddingTop: 8,
          paddingBottom: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      })}
    >
      <Tab.Screen
        name="PharmacyDashboard"
        options={{ title: 'Dashboard' }}
      >
        {({ navigation }) => (
          <PharmacyDashboardScreen
            navigation={navigation}
            userData={userData}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="PharmacyInventory"
        options={{ title: 'Inventory' }}
      >
        {() => (
          <PharmacyScreen />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="PharmacyOrders"
        options={{ title: 'Orders' }}
      >
        {() => (
          <PharmacyScreen />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="PharmacyProfile"
        options={{ title: 'Profile' }}
      >
        {() => (
          <PharmacyScreen />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};