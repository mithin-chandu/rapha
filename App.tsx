import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, StyleSheet } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { WebEnhancements } from './src/components/WebEnhancements';
import { storage, UserData } from './src/utils/storage';
import { initialBookings } from './src/data/bookings';
import { doctors } from './src/data/doctors';
import { initialDiagnosticBookings } from './src/data/diagnosticBookings';
import { diagnosticTests } from './src/data/diagnostics';
import { initialPharmacyOrders } from './src/data/pharmacyOrders';
import { medicines } from './src/data/pharmacies';
import { colors } from './src/utils/colors';

export default function App() {
  useEffect(() => {
    // Initialize app data on first launch
    initializeAppData();
  }, []);

  const initializeAppData = async () => {
    try {
      // Initialize Samuel's dummy profile first
      const samuelProfile = {
        name: 'Samuel Rick',
        role: 'patient' as const,
        email: 'samuelrick1219@gmail.com',
        age: 21,
        gender: 'male',
        phone: '70134 02809',
        address: 'vijawada'
      };

      // Set the user data and auth status
      await storage.setUserData(samuelProfile);
      await storage.setAuthStatus(true);

      // Check if this is the first launch
      const existingBookings = await storage.getBookings();
      const existingDoctors = await storage.getDoctors();
      
      // Initialize bookings if none exist
      if (existingBookings.length === 0) {
        await storage.saveBookings(initialBookings);
      }
      
      // Initialize doctors if none exist
      if (existingDoctors.length === 0) {
        await storage.saveDoctors(doctors);
      }

      // Initialize diagnostic data
      const existingDiagnosticBookings = await storage.getDiagnosticBookings();
      const existingDiagnosticTests = await storage.getDiagnosticTests();
      
      if (existingDiagnosticBookings.length === 0) {
        await storage.saveDiagnosticBookings(initialDiagnosticBookings);
      }
      
      if (existingDiagnosticTests.length === 0) {
        await storage.saveDiagnosticTests(diagnosticTests);
      }

      // Initialize pharmacy data
      const existingPharmacyOrders = await storage.getPharmacyOrders();
      const existingMedicines = await storage.getMedicines();
      
      if (existingPharmacyOrders.length === 0) {
        await storage.savePharmacyOrders(initialPharmacyOrders);
      }
      
      if (existingMedicines.length === 0) {
        await storage.saveMedicines(medicines);
      }
    } catch (error) {
      console.error('Error initializing app data:', error);
    }
  };

  return (
    <WebEnhancements>
      <View style={Platform.OS === 'web' ? styles.webContainer : styles.container}>
        <StatusBar style="dark" />
        <AppNavigator />
      </View>
    </WebEnhancements>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webContainer: {
    flex: 1,
    backgroundColor: colors.background,
    ...(Platform.OS === 'web' && {
      minHeight: '100vh' as any,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif' as any,
    }),
  },
});
