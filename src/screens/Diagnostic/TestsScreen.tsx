import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, fontSize } from '../../utils/colors';
import { storage, UserData } from '../../utils/storage';
import { DiagnosticTest, diagnosticTests as initialTests } from '../../data/diagnostics';
import { Button } from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';

interface TestsScreenProps {
  navigation: any;
  userData: UserData;
}

export const TestsScreen: React.FC<TestsScreenProps> = ({ navigation, userData }) => {
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTest, setEditingTest] = useState<DiagnosticTest | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [testName, setTestName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      const savedTests = await storage.getDiagnosticTests();
      if (savedTests.length === 0) {
        // Initialize with default tests
        await storage.saveDiagnosticTests(initialTests);
        setTests(initialTests);
      } else {
        setTests(savedTests);
      }
    } catch (error) {
      console.error('Error loading tests:', error);
      setTests(initialTests);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTests();
    setRefreshing(false);
  };

  const handleAddTest = () => {
    resetForm();
    setEditingTest(null);
    setModalVisible(true);
  };

  const handleEditTest = (test: DiagnosticTest) => {
    setEditingTest(test);
    setTestName(test.name);
    setCategory(test.category);
    setPrice(test.price);
    setDuration(test.duration);
    setDescription(test.description || '');
    setRequirements(test.requirements || '');
    setModalVisible(true);
  };

  const handleDeleteTest = (testId: number) => {
    Alert.alert(
      'Delete Test',
      'Are you sure you want to delete this test?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteTest(testId)
        }
      ]
    );
  };

  const deleteTest = async (testId: number) => {
    try {
      const updatedTests = tests.filter(test => test.id !== testId);
      setTests(updatedTests);
      await storage.saveDiagnosticTests(updatedTests);
    } catch (error) {
      console.error('Error deleting test:', error);
      Alert.alert('Error', 'Failed to delete test');
    }
  };

  const handleSaveTest = async () => {
    if (!testName.trim() || !category.trim() || !price.trim() || !duration.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const testData: DiagnosticTest = {
        id: editingTest ? editingTest.id : Date.now(),
        name: testName.trim(),
        category: category.trim(),
        price: price.trim(),
        duration: duration.trim(),
        description: description.trim() || undefined,
        requirements: requirements.trim() || undefined,
      };

      let updatedTests: DiagnosticTest[];
      if (editingTest) {
        updatedTests = tests.map(test => test.id === editingTest.id ? testData : test);
      } else {
        updatedTests = [...tests, testData];
      }

      setTests(updatedTests);
      await storage.saveDiagnosticTests(updatedTests);
      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error('Error saving test:', error);
      Alert.alert('Error', 'Failed to save test');
    }
  };

  const resetForm = () => {
    setTestName('');
    setCategory('');
    setPrice('');
    setDescription('');
    setRequirements('');
    setDuration('');
  };

  const filteredTests = tests.filter(test =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategories = () => {
    const categories = [...new Set(tests.map(test => test.category))];
    return categories;
  };

  const categories = getCategories();

  const renderTestItem = ({ item }: { item: DiagnosticTest }) => (
    <LinearGradient
      colors={[colors.card, colors.backgroundSecondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.testCard}
    >
      <View style={styles.testHeader}>
        <View style={styles.testInfo}>
          <Text style={styles.testName}>{item.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
        <View style={styles.testActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditTest(item)}
          >
            <Ionicons name="pencil" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { marginLeft: spacing.sm }]}
            onPress={() => handleDeleteTest(item.id)}
          >
            <Ionicons name="trash" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.testDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="cash" size={16} color={colors.secondary} />
          <Text style={styles.detailText}>{item.price}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color={colors.info} />
          <Text style={styles.detailText}>{item.duration}</Text>
        </View>
      </View>

      {item.description && (
        <Text style={styles.testDescription}>{item.description}</Text>
      )}

      {item.requirements && (
        <View style={styles.requirementsContainer}>
          <Ionicons name="information-circle" size={16} color={colors.warning} />
          <Text style={styles.requirementsText}>{item.requirements}</Text>
        </View>
      )}
    </LinearGradient>
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
        <Text style={styles.headerTitle}>Available Tests</Text>
        <Text style={styles.headerSubtitle}>{tests.length} tests available</Text>
      </LinearGradient>

      {/* Search and Filter */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tests..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        
        <LinearGradient
          colors={['#DC2626', '#F59E0B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.addButtonGradient}
        >
          <Button
            title="Add Test"
            onPress={handleAddTest}
            variant="gradient"
            icon="add"
            size="sm"
          />
        </LinearGradient>
      </View>

      {/* Categories Overview */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories ({categories.length})</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.categoryChip}>
              <Text style={styles.categoryChipText}>{item}</Text>
              <Text style={styles.categoryCount}>
                {tests.filter(test => test.category === item).length}
              </Text>
            </View>
          )}
        />
      </View>

      {/* Tests List */}
      <FlatList
        data={filteredTests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTestItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="flask-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyText}>No tests found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try a different search term' : 'Add your first diagnostic test'}
            </Text>
            {!searchQuery && (
              <View style={{ marginTop: spacing.lg }}>
                <Button
                  title="Add Test"
                  onPress={handleAddTest}
                  variant="primary"
                  icon="add"
                />
              </View>
            )}
          </View>
        }
      />

      {/* Add/Edit Test Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#DC2626', '#F59E0B']}
            style={styles.modalHeader}
          >
            <Text style={styles.modalTitle}>
              {editingTest ? 'Edit Test' : 'Add New Test'}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={colors.textWhite} />
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Test Name *</Text>
              <TextInput
                style={styles.textInput}
                value={testName}
                onChangeText={setTestName}
                placeholder="Enter test name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category *</Text>
              <TextInput
                style={styles.textInput}
                value={category}
                onChangeText={setCategory}
                placeholder="e.g., Pathology, Radiology"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { width: '48%' }]}>
                <Text style={styles.inputLabel}>Price *</Text>
                <TextInput
                  style={styles.textInput}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="₹500"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={[styles.inputGroup, { width: '48%' }]}>
                <Text style={styles.inputLabel}>Duration *</Text>
                <TextInput
                  style={styles.textInput}
                  value={duration}
                  onChangeText={setDuration}
                  placeholder="30 mins"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Brief description of the test"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Requirements</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={requirements}
                onChangeText={setRequirements}
                placeholder="e.g., 12-hour fasting required"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.modalActions}>
              <View style={{ width: '45%' }}>
                <Button
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                  variant="outline"
                />
              </View>
              <LinearGradient
                colors={['#DC2626', '#F59E0B']}
                style={[styles.saveButtonGradient, { width: '45%' }]}
              >
                <Button
                  title={editingTest ? 'Update' : 'Add Test'}
                  onPress={handleSaveTest}
                  variant="gradient"
                />
              </LinearGradient>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    color: colors.textWhite + 'CC',
    fontWeight: '500',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: spacing.md,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  addButtonGradient: {
    borderRadius: borderRadius.lg,
  },
  categoriesSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  categoryChip: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  categoryChipText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: '600',
    marginRight: spacing.xs,
  },
  categoryCount: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    minWidth: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  testCard: {
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
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  testInfo: {
    flex: 1,
  },
  testName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  categoryBadge: {
    backgroundColor: '#DC2626' + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: fontSize.xs,
    color: '#DC2626',
    fontWeight: '600',
  },
  testActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  testDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  testDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  requirementsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.warning + '10',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  requirementsText: {
    fontSize: fontSize.sm,
    color: colors.warning,
    marginLeft: spacing.xs,
    flex: 1,
    fontWeight: '500',
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
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    paddingTop: spacing.xxxl,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textWhite,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundSecondary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  saveButtonGradient: {
    borderRadius: borderRadius.lg,
  },
});