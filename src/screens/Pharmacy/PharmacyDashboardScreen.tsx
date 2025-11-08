import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, fontSize } from '../../utils/colors';
import { storage, UserData } from '../../utils/storage';
import { PharmacyOrder } from '../../data/pharmacyOrders';
import { medicines } from '../../data/pharmacies';
import { Button } from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';

interface PharmacyDashboardScreenProps {
  navigation: any;
  userData: UserData;
}

export const PharmacyDashboardScreen: React.FC<PharmacyDashboardScreenProps> = ({ navigation, userData }) => {
  const [orders, setOrders] = useState<PharmacyOrder[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const allOrders = await storage.getPharmacyOrders();
      // Filter orders for the current pharmacy
      const pharmacyOrders = allOrders.filter(
        order => order.pharmacyId === userData.pharmacyId
      );
      setOrders(pharmacyOrders);
    } catch (error) {
      console.error('Error loading pharmacy orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [userData.pharmacyId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStats = () => {
    const totalMedicines = medicines.length;
    const totalOrders = orders.length;
    const activeOrders = orders.filter(o => o.status === 'Accepted' || o.status === 'Preparing').length;
    const completedOrders = orders.filter(o => o.status === 'Delivered').length;

    return { totalMedicines, totalOrders, activeOrders, completedOrders };
  };

  const stats = getStats();

  const handleViewOrders = () => {
    navigation.navigate('PharmacyOrders');
  };

  const handleManageInventory = () => {
    navigation.navigate('PharmacyInventory');
  };

  const getRecentOrders = () => {
    return orders
      .sort((a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime())
      .slice(0, 3);
  };

  const recentOrders = getRecentOrders();

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="medical-outline" size={48} color={colors.primary} />
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
        colors={['#7C3AED', '#06B6D4', '#8B5CF6']}
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
                <Ionicons name="medical" size={32} color={colors.textWhite} />
              </LinearGradient>
            </View>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.pharmacyName}>{userData.name}</Text>
            <Text style={styles.welcomeSubtext}>
              Pharmacy Dashboard • {new Date().toLocaleDateString('en-US', { 
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
            colors={['#7C3AED' + '15', '#7C3AED' + '05']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <View style={styles.statIconContainer}>
              <LinearGradient
                colors={['#7C3AED', '#7C3AED' + 'CC']}
                style={styles.statIconBackground}
              >
                <Ionicons name="medical" size={24} color={colors.textWhite} />
              </LinearGradient>
            </View>
            <Text style={[styles.statNumber, { color: '#7C3AED' }]}>
              {stats.totalMedicines}
            </Text>
            <Text style={styles.statLabel}>Medicines</Text>
            <View style={styles.statTrend}>
              <Ionicons name="trending-up" size={14} color={colors.accepted} />
              <Text style={styles.statTrendText}>Well stocked</Text>
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
              {stats.activeOrders}
            </Text>
            <Text style={styles.statLabel}>Active Orders</Text>
            <View style={styles.statTrend}>
              <Ionicons name="alert-circle" size={14} color={colors.pending} />
              <Text style={styles.statTrendText}>Needs attention</Text>
            </View>
          </LinearGradient>

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
                <Ionicons name="bag" size={24} color={colors.textWhite} />
              </LinearGradient>
            </View>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {stats.totalOrders}
            </Text>
            <Text style={styles.statLabel}>Total Orders</Text>
            <View style={styles.statTrend}>
              <Ionicons name="trending-up" size={14} color={colors.accepted} />
              <Text style={styles.statTrendText}>+20% this week</Text>
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
                <Ionicons name="checkmark-done-circle" size={24} color={colors.textWhite} />
              </LinearGradient>
            </View>
            <Text style={[styles.statNumber, { color: colors.accepted }]}>
              {stats.completedOrders}
            </Text>
            <Text style={styles.statLabel}>Delivered</Text>
            <View style={styles.statTrend}>
              <Ionicons name="trophy" size={14} color={colors.completed} />
              <Text style={styles.statTrendText}>Success rate: 97%</Text>
            </View>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionButtons}>
          <LinearGradient
            colors={['#7C3AED', '#06B6D4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Button
              title="💊 View Orders"
              onPress={handleViewOrders}
              variant="gradient"
              icon="bag"
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
              title="📦 Manage Inventory"
              onPress={handleManageInventory}
              variant="gradient"
              icon="cube"
              fullWidth
              size="lg"
            />
          </LinearGradient>
        </View>
      </View>

      {recentOrders.length > 0 && (
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <LinearGradient
              colors={['#7C3AED', '#06B6D4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: borderRadius.lg }}
            >
              <Button
                title="View All"
                onPress={handleViewOrders}
                variant="gradient"
                size="sm"
                icon="arrow-forward"
              />
            </LinearGradient>
          </View>

          {recentOrders.map((order, index) => (
            <LinearGradient
              key={order.id}
              colors={[colors.card, colors.backgroundSecondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.orderCard, { 
                transform: [{ translateY: index * -2 }],
                opacity: 1 - (index * 0.1)
              }]}
            >
              <View style={styles.orderHeader}>
                <View style={styles.patientInfo}>
                  <Text style={styles.patientName}>👤 {order.patientName}</Text>
                  <Text style={styles.orderItems}>
                    💊 {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </Text>
                </View>
                <LinearGradient
                  colors={[getStatusColor(order.status) + '30', getStatusColor(order.status) + '10']}
                  style={styles.statusBadge}
                >
                  <Text style={[
                    styles.statusText, 
                    { color: getStatusColor(order.status) }
                  ]}>
                    {order.status}
                  </Text>
                </LinearGradient>
              </View>
              
              <View style={styles.orderDetails}>
                <View style={styles.detailRow}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#7C3AED' + '20',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Ionicons name="calendar" size={16} color="#7C3AED" />
                  </View>
                  <Text style={styles.detailText}>
                    {new Date(order.orderDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })} at {order.orderTime}
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
                    <Ionicons name="cash" size={16} color={colors.secondary} />
                  </View>
                  <Text style={styles.detailText}>
                    {order.totalAmount} • {order.deliveryType}
                  </Text>
                </View>

                <View style={styles.itemsList}>
                  {order.items.slice(0, 2).map((item, itemIndex) => (
                    <Text key={itemIndex} style={styles.itemText}>
                      • {item.medicineName} x{item.quantity}
                    </Text>
                  ))}
                  {order.items.length > 2 && (
                    <Text style={styles.moreItemsText}>
                      +{order.items.length - 2} more items
                    </Text>
                  )}
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

const getStatusColor = (status: PharmacyOrder['status']) => {
  switch (status) {
    case 'Pending':
      return colors.pending;
    case 'Accepted':
    case 'Preparing':
      return colors.accepted;
    case 'Ready for Pickup':
      return colors.info;
    case 'Delivered':
      return colors.completed;
    case 'Cancelled':
      return colors.rejected;
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
  pharmacyName: {
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
    shadowColor: '#7C3AED',
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
  orderCard: {
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
  orderHeader: {
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
  orderItems: {
    fontSize: fontSize.md,
    color: '#7C3AED',
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
  orderDetails: {
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
  itemsList: {
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
  },
  itemText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  moreItemsText: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    fontStyle: 'italic',
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