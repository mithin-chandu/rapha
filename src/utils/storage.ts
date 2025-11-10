import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserData {
  name: string;
  role: 'patient' | 'hospital' | 'diagnostic' | 'pharmacy';
  email?: string;
  age?: number;
  gender?: string;
  phone?: string;
  address?: string;
  hospitalId?: number;
  diagnosticId?: number;
  pharmacyId?: number;
  specialization?: string;
  contact?: string;
}

export const storage = {
  // User data management
  async setUserData(userData: UserData): Promise<void> {
    try {
      console.log('Saving user data:', userData);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('User data saved successfully');
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  },

  async getUserData(): Promise<UserData | null> {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const result = userData ? JSON.parse(userData) : null;
      console.log('Retrieved user data:', result);
      return result;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  async clearUserData(): Promise<void> {
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('isAuthenticated');
      console.log('User data and auth status cleared');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  },

  // Enhanced user management for multiple users (for future use)
  async saveUserProfile(email: string, userData: UserData): Promise<void> {
    try {
      const key = `user_${email.toLowerCase()}`;
      await AsyncStorage.setItem(key, JSON.stringify(userData));
      console.log('User profile saved for:', email);
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  },

  async getUserProfile(email: string): Promise<UserData | null> {
    try {
      const key = `user_${email.toLowerCase()}`;
      const userData = await AsyncStorage.getItem(key);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  async updateUserData(updatedUserData: UserData): Promise<void> {
    try {
      console.log('Updating user data:', updatedUserData);
      await this.setUserData(updatedUserData);
      
      // Also save as a profile for future logins
      if (updatedUserData.email) {
        await this.saveUserProfile(updatedUserData.email, updatedUserData);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  },

  // Bookings management
  async saveBookings(bookings: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem('bookings', JSON.stringify(bookings));
    } catch (error) {
      console.error('Error saving bookings:', error);
    }
  },

  async getBookings(): Promise<any[]> {
    try {
      const bookings = await AsyncStorage.getItem('bookings');
      return bookings ? JSON.parse(bookings) : [];
    } catch (error) {
      console.error('Error getting bookings:', error);
      return [];
    }
  },

  // Doctors management (for hospitals)
  async saveDoctors(doctors: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem('doctors', JSON.stringify(doctors));
    } catch (error) {
      console.error('Error saving doctors:', error);
    }
  },

  async getDoctors(): Promise<any[]> {
    try {
      const doctors = await AsyncStorage.getItem('doctors');
      return doctors ? JSON.parse(doctors) : [];
    } catch (error) {
      console.error('Error getting doctors:', error);
      return [];
    }
  },

  // Authentication status
  async setAuthStatus(isAuthenticated: boolean): Promise<void> {
    try {
      console.log('Setting auth status:', isAuthenticated);
      await AsyncStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
      console.log('Auth status saved successfully');
    } catch (error) {
      console.error('Error saving auth status:', error);
      throw error;
    }
  },

  async getAuthStatus(): Promise<boolean> {
    try {
      const authStatus = await AsyncStorage.getItem('isAuthenticated');
      const result = authStatus ? JSON.parse(authStatus) : false;
      console.log('Retrieved auth status:', result);
      return result;
    } catch (error) {
      console.error('Error getting auth status:', error);
      return false;
    }
  },

  // Diagnostic bookings management
  async saveDiagnosticBookings(bookings: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem('diagnosticBookings', JSON.stringify(bookings));
    } catch (error) {
      console.error('Error saving diagnostic bookings:', error);
    }
  },

  async getDiagnosticBookings(): Promise<any[]> {
    try {
      const bookings = await AsyncStorage.getItem('diagnosticBookings');
      return bookings ? JSON.parse(bookings) : [];
    } catch (error) {
      console.error('Error getting diagnostic bookings:', error);
      return [];
    }
  },

  // Diagnostic tests management
  async saveDiagnosticTests(tests: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem('diagnosticTests', JSON.stringify(tests));
    } catch (error) {
      console.error('Error saving diagnostic tests:', error);
    }
  },

  async getDiagnosticTests(): Promise<any[]> {
    try {
      const tests = await AsyncStorage.getItem('diagnosticTests');
      return tests ? JSON.parse(tests) : [];
    } catch (error) {
      console.error('Error getting diagnostic tests:', error);
      return [];
    }
  },

  // Pharmacy orders management
  async savePharmacyOrders(orders: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem('pharmacyOrders', JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving pharmacy orders:', error);
    }
  },

  async getPharmacyOrders(): Promise<any[]> {
    try {
      const orders = await AsyncStorage.getItem('pharmacyOrders');
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Error getting pharmacy orders:', error);
      return [];
    }
  },

  // Medicines management
  async saveMedicines(medicines: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem('medicines', JSON.stringify(medicines));
    } catch (error) {
      console.error('Error saving medicines:', error);
    }
  },

  async getMedicines(): Promise<any[]> {
    try {
      const medicines = await AsyncStorage.getItem('medicines');
      return medicines ? JSON.parse(medicines) : [];
    } catch (error) {
      console.error('Error getting medicines:', error);
      return [];
    }
  },

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }
};