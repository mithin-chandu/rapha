import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize } from '../utils/colors';
import { Doctor } from '../data/doctors';

interface DoctorCardProps {
  doctor: Doctor;
  onPress?: (doctor: Doctor) => void;
  showBookButton?: boolean;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ 
  doctor, 
  onPress, 
  showBookButton = true 
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.doctorIcon}>
          <Ionicons name="person" size={24} color={colors.primary} />
        </View>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>Dr. {doctor.name}</Text>
          <Text style={styles.specialization}>{doctor.specialization}</Text>
          {doctor.qualification && (
            <Text style={styles.qualification}>{doctor.qualification}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{doctor.timing}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="school-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{doctor.experience} experience</Text>
        </View>
        
        {doctor.consultationFee && (
          <View style={styles.infoRow}>
            <Ionicons name="card-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>₹{doctor.consultationFee} consultation</Text>
          </View>
        )}
      </View>
      
      {showBookButton && onPress && (
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => onPress(doctor)}
          activeOpacity={0.7}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
          <Ionicons name="calendar-outline" size={16} color={colors.textWhite} />
        </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  doctorIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  specialization: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  qualification: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  cardContent: {
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textWhite,
    marginRight: spacing.sm,
  },
});