import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, fontSize } from '../../utils/colors';
import { storage, UserData } from '../../utils/storage';
import { Booking } from '../../data/bookings';
import { Button } from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';

interface DashboardScreenProps {
  navigation: any;
  userData: UserData;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation, userData }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const allBookings = await storage.getBookings();
      // Filter bookings for the current hospital
      const hospitalBookings = allBookings.filter(
        booking => booking.hospitalId === userData.hospitalId
      );
      setBookings(hospitalBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [userData.hospitalId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const getStats = () => {
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
    const acceptedBookings = bookings.filter(b => b.status === 'Accepted').length;
    const completedBookings = bookings.filter(b => b.status === 'Completed').length;

    return { totalBookings, pendingBookings, acceptedBookings, completedBookings };
  };

  const stats = getStats();

  const handleViewAllAppointments = () => {
    console.log('Navigating to Appointments screen');
    navigation.navigate('HospitalAppointments');
  };

  const handleManageDoctors = () => {
    console.log('Navigating to Doctors screen');
    navigation.navigate('HospitalDoctors');
  };

  const getRecentBookings = () => {
    return bookings
      .sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime())
      .slice(0, 3);
  };

  const recentBookings = getRecentBookings();

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="hourglass-outline" size={48} color={colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[colors.primary, colors.secondary, colors.primary + 'E0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.welcomeSection}
      >
        <View style={styles.welcomeOverlay}>
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeIcon}>
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                style={styles.iconBackground}
              >
                <Ionicons name="business" size={32} color={colors.textWhite} />
              </LinearGradient>
            </View>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.hospitalName}>{userData.name}</Text>
            <Text style={styles.welcomeSubtext}>
              Dashboard Overview • {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <View style={styles.decorativeElements}>
            <View style={[styles.decorativeCircle, styles.circle1]} />
            <View style={[styles.decorativeCircle, styles.circle2]} />
            <View style={[styles.decorativeCircle, styles.circle3]} />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <LinearGradient
            colors={[colors.primary + '15', colors.primary + '05']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <View style={styles.statIconContainer}>
              <LinearGradient
                colors={[colors.primary, colors.primary + 'CC']}
                style={styles.statIconBackground}
              >
                <Ionicons name="calendar" size={24} color={colors.textWhite} />
              </LinearGradient>
            </View>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {stats.totalBookings}
            </Text>
            <Text style={styles.statLabel}>Total Bookings</Text>
            <View style={styles.statTrend}>
              <Ionicons name="trending-up" size={14} color={colors.accepted} />
              <Text style={styles.statTrendText}>+12% this week</Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={[colors.pending + '15', colors.pending + '05']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <View style={styles.statIconContainer}>
              <LinearGradient
                colors={[colors.pending, colors.pending + 'CC']}
                style={styles.statIconBackground}
              >
                <Ionicons name="time" size={24} color={colors.textWhite} />
              </LinearGradient>
            </View>
            <Text style={[styles.statNumber, { color: colors.pending }]}>
              {stats.pendingBookings}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
            <View style={styles.statTrend}>
              <Ionicons name="alert-circle" size={14} color={colors.pending} />
              <Text style={styles.statTrendText}>Needs attention</Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={[colors.accepted + '15', colors.accepted + '05']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <View style={styles.statIconContainer}>
              <LinearGradient
                colors={[colors.accepted, colors.accepted + 'CC']}
                style={styles.statIconBackground}
              >
                <Ionicons name="checkmark-circle" size={24} color={colors.textWhite} />
              </LinearGradient>
            </View>
            <Text style={[styles.statNumber, { color: colors.accepted }]}>
              {stats.acceptedBookings}
            </Text>
            <Text style={styles.statLabel}>Accepted</Text>
            <View style={styles.statTrend}>
              <Ionicons name="trending-up" size={14} color={colors.accepted} />
              <Text style={styles.statTrendText}>Active today</Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={[colors.completed + '15', colors.completed + '05']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <View style={styles.statIconContainer}>
              <LinearGradient
                colors={[colors.completed, colors.completed + 'CC']}
                style={styles.statIconBackground}
              >
                <Ionicons name="checkmark-done-circle" size={24} color={colors.textWhite} />
              </LinearGradient>
            </View>
            <Text style={[styles.statNumber, { color: colors.completed }]}>
              {stats.completedBookings}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
            <View style={styles.statTrend}>
              <Ionicons name="trophy" size={14} color={colors.completed} />
              <Text style={styles.statTrendText}>Success rate: 98%</Text>
            </View>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionButtons}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Button
              title="📅 View All Appointments"
              onPress={handleViewAllAppointments}
              variant="gradient"
              icon="calendar"
              fullWidth
              size="lg"
            />
          </LinearGradient>
          
          <LinearGradient
            colors={[colors.accepted, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Button
              title="👨‍⚕️ Manage Doctors"
              onPress={handleManageDoctors}
              variant="gradient"
              icon="people"
              fullWidth
              size="lg"
            />
          </LinearGradient>
        </View>
      </View>

      {recentBookings.length > 0 && (
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Appointments</Text>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: borderRadius.lg }}
            >
              <Button
                title="View All"
                onPress={handleViewAllAppointments}
                variant="gradient"
                size="sm"
                icon="arrow-forward"
              />
            </LinearGradient>
          </View>

          {recentBookings.map((booking, index) => (
            <LinearGradient
              key={booking.id}
              colors={[colors.card, colors.backgroundSecondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.bookingCard, { 
                transform: [{ translateY: index * -2 }],
                opacity: 1 - (index * 0.1)
              }]}
            >
              <View style={styles.bookingHeader}>
                <View style={styles.patientInfo}>
                  <Text style={styles.patientName}>👤 {booking.patientName}</Text>
                  <Text style={styles.doctorName}>🩺 Dr. {booking.doctorName}</Text>
                </View>
                <LinearGradient
                  colors={[getStatusColor(booking.status) + '30', getStatusColor(booking.status) + '10']}
                  style={styles.statusBadge}
                >
                  <Text style={[
                    styles.statusText, 
                    { color: getStatusColor(booking.status) }
                  ]}>
                    {booking.status}
                  </Text>
                </LinearGradient>
              </View>
              
              <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: colors.primary + '20',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Ionicons name="calendar" size={16} color={colors.primary} />
                  </View>
                  <Text style={styles.detailText}>
                    {new Date(booking.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })} at {booking.time}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: colors.secondary + '20',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Ionicons name="person" size={16} color={colors.secondary} />
                  </View>
                  <Text style={styles.detailText}>
                    {booking.patientAge} years • {booking.patientGender}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          ))}
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

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

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Enhanced Welcome Section
  welcomeSection: {
    minHeight: 200,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    overflow: 'hidden',
    position: 'relative',
  },
  welcomeOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },
  welcomeContent: {
    alignItems: 'center',
    zIndex: 3,
  },
  welcomeIcon: {
    marginBottom: spacing.lg,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  welcomeText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textWhite + 'E0',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  hospitalName: {
    fontSize: fontSize.xxl + 4,
    fontWeight: '800',
    color: colors.textWhite,
    marginBottom: spacing.sm,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeSubtext: {
    fontSize: fontSize.md,
    color: colors.textWhite + 'CC',
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '500',
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 120,
    height: 120,
    top: -60,
    right: -40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  circle2: {
    width: 80,
    height: 80,
    bottom: -30,
    left: -20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  circle3: {
    width: 60,
    height: 60,
    top: 40,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  // Enhanced Stats Section
  statsSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    marginTop: -spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  statCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'flex-start',
    width: screenWidth < 768 ? '48%' : '23%',
    minHeight: 140,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statIconContainer: {
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  statIconBackground: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statNumber: {
    fontSize: fontSize.xxxl,
    fontWeight: '900',
    marginBottom: spacing.xs,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  statTrendText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  
  // Enhanced Actions Section
  actionsSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  actionButtons: {
    gap: spacing.lg,
  },
  gradientButton: {
    borderRadius: borderRadius.xl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  
  // Enhanced Recent Section
  recentSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  bookingCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
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
  doctorName: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '600',
  },
  statusBadge: {
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
  },
  bookingDetails: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
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
  loadingText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginTop: spacing.lg,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: spacing.xxxl,
  },
});