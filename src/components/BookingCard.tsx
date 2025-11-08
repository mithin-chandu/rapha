import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize } from '../utils/colors';
import { Booking } from '../data/bookings';

interface BookingCardProps {
  booking: Booking;
  onStatusChange?: (bookingId: number, status: Booking['status']) => void;
  showActions?: boolean;
  userRole?: 'patient' | 'hospital';
}

export const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  onStatusChange, 
  showActions = false,
  userRole = 'patient'
}) => {
  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'Pending':
        return colors.pending;
      case 'Accepted':
        return colors.accepted;
      case 'Rejected':
        return colors.rejected;
      case 'Completed':
        return colors.completed;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'Pending':
        return 'time-outline';
      case 'Accepted':
        return 'checkmark-circle-outline';
      case 'Rejected':
        return 'close-circle-outline';
      case 'Completed':
        return 'checkmark-done-circle-outline';
      default:
        return 'time-outline';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>
            {userRole === 'hospital' ? booking.patientName : booking.hospitalName}
          </Text>
          <Text style={styles.doctorName}>Dr. {booking.doctorName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
          <Ionicons 
            name={getStatusIcon(booking.status) as any} 
            size={14} 
            color={getStatusColor(booking.status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
            {booking.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{formatDate(booking.date)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{booking.time}</Text>
        </View>
        
        {userRole === 'hospital' && (
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>{booking.patientAge} years, {booking.patientGender}</Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Ionicons name="document-text-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText} numberOfLines={2}>{booking.symptoms}</Text>
        </View>
      </View>
      
      {showActions && onStatusChange && booking.status === 'Pending' && userRole === 'hospital' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => onStatusChange(booking.id, 'Accepted')}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark" size={16} color={colors.textWhite} />
            <Text style={styles.actionButtonText}>Accept</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => onStatusChange(booking.id, 'Rejected')}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={16} color={colors.textWhite} />
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {showActions && onStatusChange && booking.status === 'Accepted' && userRole === 'hospital' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => onStatusChange(booking.id, 'Completed')}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark-done" size={16} color={colors.textWhite} />
            <Text style={styles.actionButtonText}>Mark Completed</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
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
  doctorName: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  cardContent: {
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  acceptButton: {
    backgroundColor: colors.success,
  },
  rejectButton: {
    backgroundColor: colors.error,
  },
  completeButton: {
    backgroundColor: colors.completed,
  },
  actionButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textWhite,
    marginLeft: spacing.xs,
  },
});