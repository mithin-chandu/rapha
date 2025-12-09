import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, StyleSheet } from 'react-native';
import { storage, UserData } from '../utils/storage';
import { colors } from '../utils/colors';

// Components
import { WebHeader } from '../components/WebHeader';

// Patient Screens
import { HomeScreen } from '../screens/Patient/HomeScreen';
import { MyBookingsScreen } from '../screens/Patient/MyBookingsScreen';
import { ProfileScreen as PatientProfileScreen } from '../screens/Patient/ProfileScreen';
import { AllMedicinesScreen } from '../screens/Patient/AllMedicinesScreen';
import { AllDiagnosticsScreen } from '../screens/Patient/AllDiagnosticsScreen';

// Hospital Screens
import { DashboardScreen } from '../screens/Hospital/DashboardScreen';
import { AppointmentsScreen } from '../screens/Hospital/AppointmentsScreen';
import { DoctorsScreen } from '../screens/Hospital/DoctorsScreen';
import { HospitalProfileScreen } from '../screens/Hospital/ProfileScreen';

// Auth Screens
import { RoleSelectScreen } from '../screens/Auth/RoleSelectScreen';
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { RegisterScreen } from '../screens/Auth/RegisterScreen';

// Patient Screens (for stack navigation)
import { HospitalDetailsScreen } from '../screens/Patient/HospitalDetailsScreen';
import { BookAppointmentScreen } from '../screens/Patient/BookAppointmentScreen';

// Coming Soon Screens
import { DiagnosticsScreen } from '../screens/ComingSoon/DiagnosticsScreen';
import { PharmacyScreen } from '../screens/ComingSoon/PharmacyScreen';

// EHR Screen
import EHRScreen from '../screens/Patient/EHRScreen';

// Diagnostic Navigator
import { DiagnosticNavigator } from './DiagnosticNavigator';

// Pharmacy Navigator
import { PharmacyNavigator } from './PharmacyNavigator';

const Stack = createStackNavigator();

type AuthScreens = 'RoleSelect' | 'Login' | 'Register';

export const AppNavigator: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Always authenticated
  const [userData, setUserData] = useState<UserData | null>(null);
  const [authScreen, setAuthScreen] = useState<AuthScreens>('RoleSelect');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'hospital' | 'diagnostic' | 'pharmacy' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeSamuelProfile();
  }, []);

  const initializeSamuelProfile = async () => {
    try {
      // Create Samuel's dummy profile data based on the image
      const samuelProfile: UserData = {
        name: 'Samuel Rick',
        role: 'patient',
        email: ' ',
        age: 20,
        gender: 'male',
        phone: ' ',
        address: 'india'
      };

      // Set the user data without authentication checks
      await storage.setUserData(samuelProfile);
      await storage.setAuthStatus(true);
      
      setUserData(samuelProfile);
      setIsAuthenticated(true);
      console.log('Samuel profile initialized:', samuelProfile);
    } catch (error) {
      console.error('Error initializing Samuel profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role: 'patient' | 'hospital' | 'diagnostic' | 'pharmacy') => {
    setSelectedRole(role);
    setAuthScreen('Login');
  };

  const handleLogin = async (user: UserData) => {
    try {
      console.log('handleLogin called with:', user);
      await storage.setUserData(user);
      await storage.setAuthStatus(true);
      
      // Also save as a profile for future logins if email exists
      if (user.email) {
        await storage.saveUserProfile(user.email, user);
      }
      
      console.log('Storage operations completed');
      setUserData(user);
      setIsAuthenticated(true);
      console.log('State updated, user should be authenticated');
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const handleRegister = async (user: UserData) => {
    try {
      console.log('handleRegister called with:', user);
      await storage.setUserData(user);
      await storage.setAuthStatus(true);
      
      // Also save as a profile for future logins if email exists
      if (user.email) {
        await storage.saveUserProfile(user.email, user);
      }
      
      setUserData(user);
      setIsAuthenticated(true);
      console.log('Registration completed successfully');
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear user data from storage
      await storage.clearUserData();
    } catch (error) {
      console.error('Error clearing user data during logout:', error);
    }
    
    setIsAuthenticated(false);
    setUserData(null);
    setSelectedRole(null);
    setAuthScreen('RoleSelect');
  };

  const handleUpdateUserData = async (updatedUserData: UserData) => {
    try {
      await storage.updateUserData(updatedUserData);
      setUserData(updatedUserData);
      console.log('User data updated successfully:', updatedUserData);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleBackToRoleSelect = () => {
    setSelectedRole(null);
    setAuthScreen('RoleSelect');
  };

  const handleSwitchToRegister = () => {
    setAuthScreen('Register');
  };

  const handleSwitchToLogin = () => {
    setAuthScreen('Login');
  };

  if (loading) {
    return null; // You can add a loading screen here
  }

  // Always show authenticated content since we're bypassing auth
  if (!userData) {
    return null;
  }

  const NavigationContent = () => (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {userData.role === 'diagnostic' ? (
          <Stack.Screen name="DiagnosticMain">
            {() => (
              <DiagnosticNavigator
                userData={userData}
                onLogout={handleLogout}
                onUpdateUserData={handleUpdateUserData}
              />
            )}
          </Stack.Screen>
        ) : userData.role === 'pharmacy' ? (
          <Stack.Screen name="PharmacyMain">
            {() => (
              <PharmacyNavigator
                userData={userData}
                onLogout={handleLogout}
                onUpdateUserData={handleUpdateUserData}
              />
            )}
          </Stack.Screen>
        ) : userData.role === 'patient' ? (
          <>
            {/* Patient Screens */}
            <Stack.Screen name="PatientHome">
              {({ navigation }: any) => (
                <View style={styles.screenContainer}>
                  <HomeScreen 
                    navigation={navigation} 
                    userData={userData}
                    onUpdateUserData={handleUpdateUserData}
                  />
                </View>
              )}
            </Stack.Screen>

            <Stack.Screen name="MyBookings">
              {({ navigation }: any) => (
                <View style={styles.screenContainer}>
                  <WebHeader
                    title="Book Appointment"
                    userData={userData}
                    onLogout={handleLogout}
                    onUpdateUserData={handleUpdateUserData}
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                    navigation={navigation}
                  />
                  <MyBookingsScreen 
                    navigation={navigation} 
                    userData={userData}
                  />
                </View>
              )}
            </Stack.Screen>

            <Stack.Screen name="PatientProfile">
              {({ navigation }: any) => (
                <View style={styles.screenContainer}>
                  <WebHeader
                    title="Profile"
                    userData={userData}
                    onLogout={handleLogout}
                    onUpdateUserData={handleUpdateUserData}
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                    showProfile={false}
                    navigation={navigation}
                  />
                  <PatientProfileScreen 
                    userData={userData}
                    onLogout={handleLogout}
                    onUpdateUserData={handleUpdateUserData}
                  />
                </View>
              )}
            </Stack.Screen>
            
            <Stack.Screen name="HospitalDetails">
              {({ navigation, route }: any) => (
                <View style={styles.screenContainer}>
                  <WebHeader
                    title="Hospital Details"
                    userData={userData}
                    onLogout={handleLogout}
                    onUpdateUserData={handleUpdateUserData}
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                  />
                  <HospitalDetailsScreen navigation={navigation} route={route} />
                </View>
              )}
            </Stack.Screen>
            
            <Stack.Screen name="BookAppointment">
              {({ navigation, route }: any) => (
                <View style={styles.screenContainer}>
                  <WebHeader
                    title="Book Appointment"
                    userData={userData}
                    onLogout={handleLogout}
                    onUpdateUserData={handleUpdateUserData}
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                  />
                  <BookAppointmentScreen 
                    navigation={navigation} 
                    route={route}
                    userData={userData} 
                  />
                </View>
              )}
            </Stack.Screen>
            
            <Stack.Screen name="EHR">
              {({ navigation }: any) => (
                <View style={styles.screenContainer}>
                  <WebHeader
                    title="Electronic Health Records"
                    userData={userData}
                    onLogout={handleLogout}
                    onUpdateUserData={handleUpdateUserData}
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                  />
                  <EHRScreen />
                </View>
              )}
            </Stack.Screen>

            <Stack.Screen name="AllMedicines">
              {({ navigation }: any) => (
                <AllMedicinesScreen navigation={navigation} />
              )}
            </Stack.Screen>

            <Stack.Screen name="AllDiagnostics">
              {({ navigation }: any) => (
                <AllDiagnosticsScreen navigation={navigation} />
              )}
            </Stack.Screen>
          </>
        ) : (
          <>
            {/* Hospital Screens */}
            <Stack.Screen name="HospitalDashboard">
              {({ navigation }: any) => (
                <View style={styles.screenContainer}>
                  <WebHeader
                    title="Dashboard"
                    userData={userData}
                    onLogout={handleLogout}
                    onUpdateUserData={handleUpdateUserData}
                    navigation={navigation}
                  />
                  <DashboardScreen 
                    navigation={navigation} 
                    userData={userData}
                  />
                </View>
              )}
            </Stack.Screen>

            <Stack.Screen name="HospitalAppointments">
              {({ navigation }: any) => (
                <View style={styles.screenContainer}>
                  <WebHeader
                    title="Appointments"
                    userData={userData}
                    onLogout={handleLogout}
                    onUpdateUserData={handleUpdateUserData}
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                    navigation={navigation}
                  />
                  <AppointmentsScreen 
                    navigation={navigation} 
                    userData={userData}
                  />
                </View>
              )}
            </Stack.Screen>

            <Stack.Screen name="HospitalDoctors">
              {({ navigation }: any) => (
                <View style={styles.screenContainer}>
                  <WebHeader
                    title="Doctors"
                    userData={userData}
                    onLogout={handleLogout}
                    onUpdateUserData={handleUpdateUserData}
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                    navigation={navigation}
                  />
                  <DoctorsScreen 
                    navigation={navigation} 
                    userData={userData}
                  />
                </View>
              )}
            </Stack.Screen>

            <Stack.Screen name="HospitalProfile">
              {({ navigation }: any) => (
                <View style={styles.screenContainer}>
                  <WebHeader
                    title="Profile"
                    userData={userData}
                    onLogout={handleLogout}
                    onUpdateUserData={handleUpdateUserData}
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                    showProfile={false}
                    navigation={navigation}
                  />
                  <HospitalProfileScreen 
                    userData={userData}
                    onLogout={handleLogout}
                    onUpdateUserData={handleUpdateUserData}
                  />
                </View>
              )}
            </Stack.Screen>
          </>
        )}
        
        {/* Coming Soon Screens */}
        <Stack.Screen name="Diagnostics">
          {({ navigation }: any) => (
            <View style={styles.screenContainer}>
              <WebHeader
                title="Diagnostics"
                userData={userData}
                onLogout={handleLogout}
                onUpdateUserData={handleUpdateUserData}
                showBackButton
                onBackPress={() => navigation.goBack()}
              />
              <DiagnosticsScreen navigation={navigation} onLogout={handleLogout} />
            </View>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Pharmacy">
          {({ navigation }: any) => (
            <View style={styles.screenContainer}>
              <WebHeader
                title="Pharmacy"
                userData={userData}
                onLogout={handleLogout}
                onUpdateUserData={handleUpdateUserData}
                showBackButton
                onBackPress={() => navigation.goBack()}
              />
              <PharmacyScreen navigation={navigation} />
            </View>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={webStyles.container}>
        <NavigationContent />
      </View>
    );
  }

  return <NavigationContent />;
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
    margin: 0,
    padding: 0,
  },
});

const webStyles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: Platform.OS === 'web' ? 1200 : undefined,
    alignSelf: 'center',
    width: '100%',
    margin: 0,
    padding: 0,
    ...(Platform.OS === 'web' && {
      minHeight: '100vh' as any,
    }),
  },
});