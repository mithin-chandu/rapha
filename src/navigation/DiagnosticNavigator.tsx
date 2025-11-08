import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { UserData } from '../utils/storage';

// Diagnostic Screens
import { DiagnosticDashboardScreen } from '../screens/Diagnostic/DiagnosticDashboardScreen';
import { TestsScreen } from '../screens/Diagnostic/TestsScreen';
import { BookingsScreen } from '../screens/Diagnostic/BookingsScreen';
import { ProfileScreen } from '../screens/Diagnostic/ProfileScreen';

const Stack = createStackNavigator();

interface DiagnosticNavigatorProps {
  userData: UserData;
  onLogout: () => void;
  onUpdateUserData: (userData: UserData) => void;
}

export const DiagnosticNavigator: React.FC<DiagnosticNavigatorProps> = ({
  userData,
  onLogout,
  onUpdateUserData,
}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DiagnosticDashboard">
        {({ navigation }) => (
          <DiagnosticDashboardScreen
            navigation={navigation}
            userData={userData}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="DiagnosticTests">
        {({ navigation }) => (
          <TestsScreen
            navigation={navigation}
            userData={userData}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="DiagnosticBookings">
        {({ navigation }) => (
          <BookingsScreen
            navigation={navigation}
            userData={userData}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="DiagnosticProfile">
        {({ navigation }) => (
          <ProfileScreen
            navigation={navigation}
            userData={userData}
            onLogout={onLogout}
            onUpdateUserData={onUpdateUserData}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};