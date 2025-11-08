import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../utils/colors';
import { ehrRecords, EHRRecord, getRecentEHRRecords, getUpcomingFollowUps } from '../../data/ehr';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

interface EHRCardProps {
  record: EHRRecord;
  onPress: () => void;
}

const EHRCard: React.FC<EHRCardProps> = ({ record, onPress }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return colors.success;
      case 'Follow-up Required':
        return colors.warning;
      case 'Active':
        return colors.info;
      default:
        return colors.textTertiary;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity style={styles.ehrCard} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.raphaId}>{record.raphaId}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(record.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(record.status) }]}>
              {record.status}
            </Text>
          </View>
        </View>
        <Text style={styles.appointmentDate}>{formatDate(record.appointmentDateTime)}</Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.patientName}>{record.patientFullName}</Text>
        <Text style={styles.healthIssue} numberOfLines={2}>
          {record.healthIssue}
        </Text>
        
        <View style={styles.vitalsContainer}>
          <View style={styles.vitalItem}>
            <Text style={styles.vitalLabel}>BP</Text>
            <Text style={styles.vitalValue}>
              {record.patientBasicVitals.bloodPressure.systolic}/{record.patientBasicVitals.bloodPressure.diastolic}
            </Text>
          </View>
          <View style={styles.vitalItem}>
            <Text style={styles.vitalLabel}>Sugar</Text>
            <Text style={styles.vitalValue}>{record.patientBasicVitals.sugarReading}</Text>
          </View>
          <View style={styles.vitalItem}>
            <Text style={styles.vitalLabel}>Weight</Text>
            <Text style={styles.vitalValue}>{record.patientBasicVitals.weight}kg</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.doctorName}>Dr. {record.doctorName.replace('Dr. ', '')}</Text>
          <Text style={styles.medicationCount}>
            {record.medicinesPrescription.length} prescription(s)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const EHRScreen: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<EHRRecord | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const recentRecords = getRecentEHRRecords(5);
  const upcomingFollowUps = getUpcomingFollowUps();

  // Debug logging
  console.log('EHR Records:', ehrRecords.length);
  console.log('Recent Records:', recentRecords.length);
  console.log('Upcoming Follow-ups:', upcomingFollowUps.length);

  const openEHRDetail = (record: EHRRecord) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecord(null);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>📋</Text>
        </View>
        <Text style={styles.headerTitle}>Electronic Health Records</Text>
        <Text style={styles.headerSubtitle}>
          Your complete medical history, test results, and treatment records
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{ehrRecords.length}</Text>
          <Text style={styles.statLabel}>Total Records</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{upcomingFollowUps.length}</Text>
          <Text style={styles.statLabel}>Follow-ups</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {ehrRecords.filter(r => r.status === 'Active').length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
      </View>

      {/* Health Summary Report */}
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Latest Health Summary</Text>
        {recentRecords.length > 0 && (
          <View style={styles.healthSummaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Recent Assessment</Text>
              <Text style={styles.summaryDate}>
                {new Date(recentRecords[0].appointmentDateTime).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.vitalsSummary}>
              <View style={styles.summaryVital}>
                <Text style={styles.summaryVitalLabel}>Blood Pressure</Text>
                <Text style={styles.summaryVitalValue}>
                  {recentRecords[0].patientBasicVitals.bloodPressure.systolic}/
                  {recentRecords[0].patientBasicVitals.bloodPressure.diastolic}
                </Text>
                <Text style={[styles.summaryVitalStatus, {
                  color: recentRecords[0].patientBasicVitals.bloodPressure.systolic <= 120 && 
                        recentRecords[0].patientBasicVitals.bloodPressure.diastolic <= 80 
                        ? colors.success : colors.warning
                }]}>
                  {recentRecords[0].patientBasicVitals.bloodPressure.systolic <= 120 && 
                   recentRecords[0].patientBasicVitals.bloodPressure.diastolic <= 80 ? 'Normal' : 'High'}
                </Text>
              </View>
              
              <View style={styles.summaryVital}>
                <Text style={styles.summaryVitalLabel}>Blood Sugar</Text>
                <Text style={styles.summaryVitalValue}>
                  {recentRecords[0].patientBasicVitals.sugarReading} mg/dL
                </Text>
                <Text style={[styles.summaryVitalStatus, {
                  color: recentRecords[0].patientBasicVitals.sugarReading <= 140 ? colors.success : colors.warning
                }]}>
                  {recentRecords[0].patientBasicVitals.sugarReading <= 140 ? 'Normal' : 'High'}
                </Text>
              </View>
              
              <View style={styles.summaryVital}>
                <Text style={styles.summaryVitalLabel}>Weight</Text>
                <Text style={styles.summaryVitalValue}>
                  {recentRecords[0].patientBasicVitals.weight} kg
                </Text>
                <Text style={styles.summaryVitalStatus}>Stable</Text>
              </View>
            </View>

            <View style={styles.summaryCondition}>
              <Text style={styles.conditionLabel}>Latest Condition:</Text>
              <Text style={styles.conditionText}>{recentRecords[0].healthIssue}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Recent Test Results */}
      <View style={styles.reportsContainer}>
        <Text style={styles.sectionTitle}>Recent Test Results</Text>
        {recentRecords.slice(0, 2).map((record) => (
          <View key={record.id} style={styles.reportCard}>
            <Text style={styles.reportTitle}>Medical Report - {new Date(record.appointmentDateTime).toLocaleDateString()}</Text>
            <View style={styles.reportTests}>
              {record.diagnosticReports.slice(0, 3).map((test) => (
                <View key={test.id} style={styles.testResultItem}>
                  <View style={styles.testHeader}>
                    <Text style={styles.testName}>{test.testName}</Text>
                    <View style={[styles.testStatusBadge, {
                      backgroundColor: test.status === 'Normal' ? colors.successLight :
                                     test.status === 'Abnormal' ? colors.warningLight :
                                     test.status === 'Critical' ? colors.errorLight :
                                     colors.infoLight
                    }]}>
                      <Text style={[styles.testStatusText, {
                        color: test.status === 'Normal' ? colors.success :
                               test.status === 'Abnormal' ? colors.warning :
                               test.status === 'Critical' ? colors.error :
                               colors.info
                      }]}>
                        {test.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.testResult}>{test.results}</Text>
                  {test.normalRange && (
                    <Text style={styles.testRange}>Normal: {test.normalRange}</Text>
                  )}
                </View>
              ))}
            </View>
            <TouchableOpacity 
              style={styles.viewFullButton}
              onPress={() => openEHRDetail(record)}
            >
              <Text style={styles.viewFullButtonText}>View Full Report</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Recent EHR Records */}
      <View style={styles.recordsContainer}>
        <Text style={styles.sectionTitle}>Recent Medical Records</Text>
        {recentRecords.length > 0 ? (
          recentRecords.map((record) => (
            <EHRCard
              key={record.id}
              record={record}
              onPress={() => openEHRDetail(record)}
            />
          ))
        ) : (
          <View style={styles.noRecordsContainer}>
            <Text style={styles.noRecordsText}>No medical records found</Text>
          </View>
        )}
      </View>

      {/* Health Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Health Categories</Text>
        <View style={styles.categoriesGrid}>
          <TouchableOpacity style={styles.categoryItem}>
            <Text style={styles.categoryIcon}>🩺</Text>
            <Text style={styles.categoryText}>Medical History</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>✓</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.categoryItem}>
            <Text style={styles.categoryIcon}>🧪</Text>
            <Text style={styles.categoryText}>Test Results</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>✓</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.categoryItem}>
            <Text style={styles.categoryIcon}>💊</Text>
            <Text style={styles.categoryText}>Prescriptions</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>✓</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.categoryItem}>
            <Text style={styles.categoryIcon}>💉</Text>
            <Text style={styles.categoryText}>Vaccination Records</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>✓</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upcoming Follow-ups */}
      {upcomingFollowUps.length > 0 && (
        <View style={styles.followUpsContainer}>
          <Text style={styles.sectionTitle}>Upcoming Follow-ups</Text>
          {upcomingFollowUps.slice(0, 3).map((followUp, index) => (
            <View key={index} style={styles.followUpCard}>
              <View style={styles.followUpHeader}>
                <Text style={styles.followUpPatient}>{followUp.patientName}</Text>
                <View style={[styles.priorityBadge, {
                  backgroundColor: followUp.priority === 'High' ? colors.errorLight :
                                 followUp.priority === 'Medium' ? colors.warningLight :
                                 colors.successLight
                }]}>
                  <Text style={[styles.priorityText, {
                    color: followUp.priority === 'High' ? colors.error :
                           followUp.priority === 'Medium' ? colors.warning :
                           colors.success
                  }]}>
                    {followUp.priority}
                  </Text>
                </View>
              </View>
              <Text style={styles.followUpPurpose}>{followUp.purpose}</Text>
              <Text style={styles.followUpDate}>
                {new Date(followUp.followUpDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* EHR Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>EHR Details</Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {selectedRecord && (
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Patient Information */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Patient Information</Text>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Rapha ID:</Text>
                  <Text style={styles.modalValue}>{selectedRecord.raphaId}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Patient Name:</Text>
                  <Text style={styles.modalValue}>{selectedRecord.patientFullName}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Appointment:</Text>
                  <Text style={styles.modalValue}>
                    {new Date(selectedRecord.appointmentDateTime).toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Vital Signs */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Vital Signs</Text>
                <View style={styles.vitalsGrid}>
                  <View style={styles.vitalCard}>
                    <Text style={styles.vitalCardTitle}>Blood Pressure</Text>
                    <Text style={styles.vitalCardValue}>
                      {selectedRecord.patientBasicVitals.bloodPressure.systolic}/
                      {selectedRecord.patientBasicVitals.bloodPressure.diastolic} mmHg
                    </Text>
                  </View>
                  <View style={styles.vitalCard}>
                    <Text style={styles.vitalCardTitle}>Sugar Level</Text>
                    <Text style={styles.vitalCardValue}>
                      {selectedRecord.patientBasicVitals.sugarReading} mg/dL
                    </Text>
                  </View>
                  <View style={styles.vitalCard}>
                    <Text style={styles.vitalCardTitle}>Weight</Text>
                    <Text style={styles.vitalCardValue}>
                      {selectedRecord.patientBasicVitals.weight} kg
                    </Text>
                  </View>
                  {selectedRecord.patientBasicVitals.height && (
                    <View style={styles.vitalCard}>
                      <Text style={styles.vitalCardTitle}>Height</Text>
                      <Text style={styles.vitalCardValue}>
                        {selectedRecord.patientBasicVitals.height} cm
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Health Issue & Resolution */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Health Issue</Text>
                <Text style={styles.modalText}>{selectedRecord.healthIssue}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Doctor's Resolution</Text>
                <Text style={styles.modalText}>{selectedRecord.doctorResolution}</Text>
              </View>

              {/* Medications */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Prescribed Medications</Text>
                {selectedRecord.medicinesPrescription.map((med, index) => (
                  <View key={med.id} style={styles.medicationCard}>
                    <Text style={styles.medicationName}>{med.medicineName}</Text>
                    <Text style={styles.medicationDosage}>{med.dosage} - {med.frequency}</Text>
                    <Text style={styles.medicationInstructions}>{med.instructions}</Text>
                    <Text style={styles.medicationDuration}>Duration: {med.duration}</Text>
                  </View>
                ))}
              </View>

              {/* Diagnostic Reports */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Diagnostic Reports</Text>
                {selectedRecord.diagnosticReports.map((report) => (
                  <View key={report.id} style={styles.diagnosticCard}>
                    <View style={styles.diagnosticHeader}>
                      <Text style={styles.diagnosticName}>{report.testName}</Text>
                      <View style={[styles.diagnosticStatus, {
                        backgroundColor: report.status === 'Normal' ? colors.successLight :
                                       report.status === 'Abnormal' ? colors.warningLight :
                                       report.status === 'Critical' ? colors.errorLight :
                                       colors.infoLight
                      }]}>
                        <Text style={[styles.diagnosticStatusText, {
                          color: report.status === 'Normal' ? colors.success :
                                 report.status === 'Abnormal' ? colors.warning :
                                 report.status === 'Critical' ? colors.error :
                                 colors.info
                        }]}>
                          {report.status}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.diagnosticResults}>{report.results}</Text>
                    {report.normalRange && (
                      <Text style={styles.diagnosticRange}>Normal Range: {report.normalRange}</Text>
                    )}
                    <Text style={styles.diagnosticDate}>Date: {report.reportDate}</Text>
                  </View>
                ))}
                <Text style={styles.doctorRemarks}>
                  <Text style={styles.doctorRemarksLabel}>Doctor's Remarks: </Text>
                  {selectedRecord.doctorRemarkOnDiagnostics}
                </Text>
              </View>

              {/* Surgery Details (if any) */}
              {selectedRecord.surgeryDescription && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Surgery Information</Text>
                  <View style={styles.surgeryCard}>
                    <Text style={styles.surgeryType}>{selectedRecord.surgeryDescription.surgeryType}</Text>
                    <Text style={styles.surgeryDescription}>{selectedRecord.surgeryDescription.description}</Text>
                    <Text style={styles.surgeryReason}>
                      <Text style={styles.surgeryReasonLabel}>Reason: </Text>
                      {selectedRecord.surgeryDescription.reasonForSurgery}
                    </Text>
                    {selectedRecord.surgeryDescription.postOpStatus && (
                      <Text style={styles.surgeryStatus}>
                        <Text style={styles.surgeryStatusLabel}>Post-Op Status: </Text>
                        {selectedRecord.surgeryDescription.postOpStatus}
                      </Text>
                    )}
                  </View>
                </View>
              )}

              {/* Final Remarks */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Final Remarks</Text>
                <Text style={styles.finalRemarks}>{selectedRecord.finalRemarks}</Text>
              </View>

              {/* Doctor Information */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Attending Physician</Text>
                <Text style={styles.attendingDoctor}>{selectedRecord.doctorName}</Text>
                <Text style={styles.recordDate}>
                  Record Created: {new Date(selectedRecord.createdAt).toLocaleString()}
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    backgroundColor: colors.background,
    padding: spacing.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerIconText: {
    fontSize: 30,
  },
  headerTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold' as const,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  statNumber: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold' as const,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  summaryContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  healthSummaryCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  summaryDate: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  vitalsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  summaryVital: {
    alignItems: 'center',
    flex: 1,
  },
  summaryVitalLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  summaryVitalValue: {
    fontSize: fontSize.lg,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  summaryVitalStatus: {
    fontSize: fontSize.xs,
    fontWeight: '500' as const,
  },
  summaryCondition: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  conditionLabel: {
    fontSize: fontSize.sm,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  conditionText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  reportsContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  reportCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  reportTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  reportTests: {
    marginBottom: spacing.lg,
  },
  testResultItem: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  testName: {
    fontSize: fontSize.md,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    flex: 1,
  },
  testStatusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  testStatusText: {
    fontSize: fontSize.xs,
    fontWeight: '500' as const,
  },
  testResult: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  testRange: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  viewFullButton: {
    backgroundColor: colors.primaryLight + '20',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  viewFullButtonText: {
    fontSize: fontSize.md,
    fontWeight: '500' as const,
    color: colors.primary,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryItem: {
    width: (width - spacing.xl * 2 - spacing.md) / 2,
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    position: 'relative',
    ...shadows.sm,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  categoryText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  categoryBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadgeText: {
    color: colors.textWhite,
    fontSize: fontSize.xs,
    fontWeight: 'bold' as const,
  },
  followUpsContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  followUpCard: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  followUpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  followUpPatient: {
    fontSize: fontSize.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  priorityText: {
    fontSize: fontSize.xs,
    fontWeight: '500' as const,
  },
  followUpPurpose: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  followUpDate: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  recordsContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  ehrCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardHeader: {
    marginBottom: spacing.md,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  raphaId: {
    fontSize: fontSize.lg,
    fontWeight: '600' as const,
    color: colors.primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '500' as const,
  },
  appointmentDate: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  cardContent: {
    gap: spacing.sm,
  },
  patientName: {
    fontSize: fontSize.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  healthIssue: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  vitalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  vitalItem: {
    alignItems: 'center',
    flex: 1,
  },
  vitalLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  vitalValue: {
    fontSize: fontSize.md,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  doctorName: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
  medicationCount: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '500' as const,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold' as const,
    color: colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
  modalContent: {
    flex: 1,
    padding: spacing.xl,
  },
  modalSection: {
    marginBottom: spacing.xxl,
  },
  modalSectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  modalRow: {
    flexDirection: isWeb ? 'row' : 'column',
    marginBottom: spacing.sm,
    gap: isWeb ? spacing.md : spacing.xs,
  },
  modalLabel: {
    fontSize: fontSize.md,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    ...(isWeb && { minWidth: 120 }),
  },
  modalValue: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  modalText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  vitalCard: {
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    flex: isWeb ? 0 : 1,
    minWidth: isWeb ? 160 : undefined,
    alignItems: 'center',
  },
  vitalCardTitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  vitalCardValue: {
    fontSize: fontSize.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  medicationCard: {
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  medicationName: {
    fontSize: fontSize.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  medicationDosage: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '500' as const,
    marginBottom: spacing.xs,
  },
  medicationInstructions: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  medicationDuration: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  diagnosticCard: {
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  diagnosticHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  diagnosticName: {
    fontSize: fontSize.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    flex: 1,
  },
  diagnosticStatus: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  diagnosticStatusText: {
    fontSize: fontSize.xs,
    fontWeight: '500' as const,
  },
  diagnosticResults: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  diagnosticRange: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  diagnosticDate: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  doctorRemarks: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.md,
  },
  doctorRemarksLabel: {
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  surgeryCard: {
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
  },
  surgeryType: {
    fontSize: fontSize.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  surgeryDescription: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  surgeryReason: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  surgeryReasonLabel: {
    fontWeight: '500' as const,
    color: colors.textPrimary,
  },
  surgeryStatus: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  surgeryStatusLabel: {
    fontWeight: '500' as const,
    color: colors.textPrimary,
  },
  finalRemarks: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
    padding: spacing.lg,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.md,
  },
  attendingDoctor: {
    fontSize: fontSize.lg,
    fontWeight: '600' as const,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  recordDate: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  noRecordsContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
  },
  noRecordsText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default EHRScreen;