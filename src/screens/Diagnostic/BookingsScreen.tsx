import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, fontSize } from '../../utils/colors';
import { storage, UserData } from '../../utils/storage';
import { DiagnosticBooking, initialDiagnosticBookings } from '../../data/diagnosticBookings';
import { Button } from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';

interface BookingsScreenProps {
  navigation: any;
  userData: UserData;
}

export const BookingsScreen: React.FC<BookingsScreenProps> = ({ navigation, userData }) => {
  const [bookings, setBookings] = useState<DiagnosticBooking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Pending' | 'Accepted' | 'Completed'>('All');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const savedBookings = await storage.getDiagnosticBookings();
      if (savedBookings.length === 0) {
        // Initialize with default bookings
        await storage.saveDiagnosticBookings(initialDiagnosticBookings);
        const diagnosticBookings = initialDiagnosticBookings.filter(
          booking => booking.diagnosticId === userData.diagnosticId
        );
        setBookings(diagnosticBookings);
      } else {
        const diagnosticBookings = savedBookings.filter(
          booking => booking.diagnosticId === userData.diagnosticId
        );
        setBookings(diagnosticBookings);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const handleStatusChange = async (bookingId: number, newStatus: DiagnosticBooking['status']) => {
    try {
      const allBookings = await storage.getDiagnosticBookings();
      const updatedBookings = allBookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      );
      
      await storage.saveDiagnosticBookings(updatedBookings);
      
      const diagnosticBookings = updatedBookings.filter(
        booking => booking.diagnosticId === userData.diagnosticId
      );
      setBookings(diagnosticBookings);
      
      Alert.alert('Success', `Booking ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      Alert.alert('Error', 'Failed to update booking status');
    }
  };

  const getStatusColor = (status: DiagnosticBooking['status']) => {
    switch (status) {
      case 'Pending':
        return colors.pending;
      case 'Accepted':
        return colors.accepted;
      case 'Rejected':
        return colors.rejected;
      case 'Completed':
      case 'Results Ready':
        return colors.completed;
      case 'Sample Collected':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: DiagnosticBooking['status']) => {
    switch (status) {
      case 'Pending':
        return 'time';
      case 'Accepted':
        return 'checkmark-circle';
      case 'Rejected':
        return 'close-circle';
      case 'Completed':
        return 'checkmark-done-circle';
      case 'Results Ready':
        return 'document-text';
      case 'Sample Collected':
        return 'flask';
      default:
        return 'help-circle';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Completed') {
      return booking.status === 'Completed' || booking.status === 'Results Ready';
    }
    return booking.status === selectedFilter;
  });

  const getStats = () => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'Pending').length;
    const accepted = bookings.filter(b => b.status === 'Accepted' || b.status === 'Sample Collected').length;
    const completed = bookings.filter(b => b.status === 'Completed' || b.status === 'Results Ready').length;

    return { total, pending, accepted, completed };
  };

  const stats = getStats();

  const renderBookingItem = ({ item }: { item: DiagnosticBooking }) => (
    <LinearGradient
      colors={[colors.card, colors.backgroundSecondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.bookingCard}
    >
      <View style={styles.bookingHeader}>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>👤 {item.patientName}</Text>
          <Text style={styles.testName}>🧪 {item.testName}</Text>
        </View>
        <LinearGradient
          colors={[getStatusColor(item.status) + '30', getStatusColor(item.status) + '10']}
          style={styles.statusBadge}
        >
          <Ionicons name={getStatusIcon(item.status)} size={16} color={getStatusColor(item.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </LinearGradient>
      </View>

      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color={colors.primary} />
          <Text style={styles.detailText}>
            {new Date(item.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })} at {item.time}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="call" size={16} color={colors.secondary} />
          <Text style={styles.detailText}>{item.patientPhone}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="cash" size={16} color={colors.warning} />
          <Text style={styles.detailText}>
            {item.price} • {item.patientAge} years • {item.patientGender}
          </Text>
        </View>

        {item.notes && (
          <View style={styles.notesContainer}>
            <Ionicons name="document-text" size={16} color={colors.info} />
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}

        {item.results && (
          <View style={styles.resultsContainer}>
            <Ionicons name="clipboard" size={16} color={colors.completed} />
            <Text style={styles.resultsText}>{item.results}</Text>
          </View>
        )}
      </View>

      {item.status === 'Pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.rejected + '20' }]}
            onPress={() => handleStatusChange(item.id, 'Rejected')}
          >
            <Ionicons name="close" size={18} color={colors.rejected} />
            <Text style={[styles.actionButtonText, { color: colors.rejected }]}>Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.accepted + '20' }]}
            onPress={() => handleStatusChange(item.id, 'Accepted')}
          >
            <Ionicons name="checkmark" size={18} color={colors.accepted} />
            <Text style={[styles.actionButtonText, { color: colors.accepted }]}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.status === 'Accepted' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.info + '20', flex: 1 }]}
            onPress={() => handleStatusChange(item.id, 'Sample Collected')}
          >
            <Ionicons name="flask" size={18} color={colors.info} />
            <Text style={[styles.actionButtonText, { color: colors.info }]}>Sample Collected</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.status === 'Sample Collected' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.completed + '20', flex: 1 }]}
            onPress={() => handleStatusChange(item.id, 'Results Ready')}
          >
            <Ionicons name="document-text" size={18} color={colors.completed} />
            <Text style={[styles.actionButtonText, { color: colors.completed }]}>Results Ready</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.status === 'Results Ready' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.completed + '20', flex: 1 }]}
            onPress={() => handleStatusChange(item.id, 'Completed')}
          >
            <Ionicons name="checkmark-done" size={18} color={colors.completed} />
            <Text style={[styles.actionButtonText, { color: colors.completed }]}>Mark Completed</Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );

  const FilterChip = ({ title, isSelected, onPress }: { title: string; isSelected: boolean; onPress: () => void }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        isSelected && {
          backgroundColor: '#DC2626',
          borderColor: '#DC2626',
        }
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterChipText,
          isSelected && { color: colors.textWhite }
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <LinearGradient
        colors={['#DC2626', '#F59E0B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerSection}
      >
        <Text style={styles.headerTitle}>Test Bookings</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.accepted}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <FilterChip
          title="All"
          isSelected={selectedFilter === 'All'}
          onPress={() => setSelectedFilter('All')}
        />
        <FilterChip
          title="Pending"
          isSelected={selectedFilter === 'Pending'}
          onPress={() => setSelectedFilter('Pending')}
        />
        <FilterChip
          title="Accepted"
          isSelected={selectedFilter === 'Accepted'}
          onPress={() => setSelectedFilter('Accepted')}
        />
        <FilterChip
          title="Completed"
          isSelected={selectedFilter === 'Completed'}
          onPress={() => setSelectedFilter('Completed')}
        />
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBookingItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyText}>No bookings found</Text>
            <Text style={styles.emptySubtext}>
              {selectedFilter === 'All' 
                ? 'Test bookings will appear here'
                : `No ${selectedFilter.toLowerCase()} bookings`
              }
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.textWhite,
    marginBottom: spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textWhite,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textWhite + 'CC',
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: spacing.md,
  },
  filterSection: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    backgroundColor: colors.backgroundSecondary,
  },
  filterChipText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  bookingCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  testName: {
    fontSize: fontSize.md,
    color: '#DC2626',
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    marginLeft: spacing.xs,
  },
  bookingDetails: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  detailText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginLeft: spacing.md,
    fontWeight: '500',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.info + '10',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.info,
  },
  notesText: {
    fontSize: fontSize.sm,
    color: colors.info,
    marginLeft: spacing.sm,
    flex: 1,
    fontWeight: '500',
  },
  resultsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.completed + '10',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.completed,
  },
  resultsText: {
    fontSize: fontSize.sm,
    color: colors.completed,
    marginLeft: spacing.sm,
    flex: 1,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  actionButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
  emptySubtext: {
    fontSize: fontSize.md,
    color: colors.textLight,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});