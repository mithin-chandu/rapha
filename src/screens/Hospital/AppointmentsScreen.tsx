import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Alert } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../utils/colors';
import { BookingCard } from '../../components/BookingCard';
import { Booking } from '../../data/bookings';
import { storage, UserData } from '../../utils/storage';
import { Ionicons } from '@expo/vector-icons';

interface AppointmentsScreenProps {
  userData: UserData;
  navigation: any;
}

export const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({ userData, navigation }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');

  const loadBookings = async () => {
    try {
      const allBookings = await storage.getBookings();
      // Filter bookings for the current hospital
      const hospitalBookings = allBookings.filter(
        booking => booking.hospitalId === userData.hospitalId
      );
      
      // Sort by booking date (newest first)
      const sortedBookings = hospitalBookings.sort((a, b) => 
        new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()
      );
      
      setBookings(sortedBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [userData.hospitalId]);

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

  const handleStatusChange = async (bookingId: number, newStatus: Booking['status']) => {
    try {
      const allBookings = await storage.getBookings();
      const updatedBookings = allBookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      );
      
      await storage.saveBookings(updatedBookings);
      await loadBookings();
      
      const statusMessages = {
        'Accepted': 'Booking accepted successfully!',
        'Rejected': 'Booking rejected.',
        'Completed': 'Booking marked as completed!',
        'Pending': 'Booking status updated.'
      };
      
      Alert.alert('Success', statusMessages[newStatus]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update booking status. Please try again.');
    }
  };

  const getFilteredBookings = () => {
    if (filter === 'all') return bookings;
    return bookings.filter(booking => 
      booking.status.toLowerCase() === filter.toLowerCase()
    );
  };

  const filteredBookings = getFilteredBookings();

  const getStatusCounts = () => {
    const counts = {
      all: bookings.length,
      pending: bookings.filter(b => b.status === 'Pending').length,
      accepted: bookings.filter(b => b.status === 'Accepted').length,
      completed: bookings.filter(b => b.status === 'Completed').length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  const renderBookingCard = ({ item }: { item: Booking }) => (
    <BookingCard
      booking={item}
      onStatusChange={handleStatusChange}
      showActions={true}
      userRole="hospital"
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={64} color={colors.textLight} />
      <Text style={styles.emptyTitle}>No Appointments</Text>
      <Text style={styles.emptySubtitle}>
        {filter === 'all' 
          ? 'No appointments booked yet'
          : `No ${filter} appointments found`
        }
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.welcomeText}>Appointments</Text>
      <Text style={styles.subtitleText}>
        Manage your hospital appointments
      </Text>
      
      <View style={styles.filterContainer}>
        <FilterButton
          title={`All (${statusCounts.all})`}
          active={filter === 'all'}
          onPress={() => setFilter('all')}
        />
        <FilterButton
          title={`Pending (${statusCounts.pending})`}
          active={filter === 'pending'}
          onPress={() => setFilter('pending')}
        />
        <FilterButton
          title={`Accepted (${statusCounts.accepted})`}
          active={filter === 'accepted'}
          onPress={() => setFilter('accepted')}
        />
        <FilterButton
          title={`Completed (${statusCounts.completed})`}
          active={filter === 'completed'}
          onPress={() => setFilter('completed')}
        />
      </View>
      
      {filteredBookings.length > 0 && (
        <Text style={styles.resultsText}>
          {filteredBookings.length} appointment{filteredBookings.length !== 1 ? 's' : ''} found
        </Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="hourglass-outline" size={48} color={colors.primary} />
        <Text style={styles.loadingText}>Loading appointments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredBookings}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={filteredBookings.length === 0 ? styles.emptyContainer : undefined}
      />
    </View>
  );
};

interface FilterButtonProps {
  title: string;
  active: boolean;
  onPress: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ title, active, onPress }) => (
  <Text
    style={[styles.filterButton, active && styles.activeFilterButton]}
    onPress={onPress}
  >
    {title}
  </Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  welcomeText: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitleText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  filterButton: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
    color: colors.textWhite,
  },
  resultsText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textSecondary,
    marginVertical: spacing.lg,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
});