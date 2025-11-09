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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../utils/colors';
import { ehrRecords, EHRRecord, getRecentEHRRecords, getUpcomingFollowUps } from '../../data/ehr';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDoctorName = (doctorName: string) => {
    // Remove duplicate "Dr." prefix if it exists
    const cleanedName = doctorName.replace(/^Dr\.\s*Dr\.\s*/, 'Dr. ');
    return cleanedName.startsWith('Dr.') ? cleanedName : `Dr. ${cleanedName}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return '#16a34a';
      case 'Follow-up Required':
        return '#f59e0b';
      case 'Active':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getVitalStatus = (type: string, value: number) => {
    switch (type) {
      case 'bp':
        return value <= 120 ? { status: 'Normal', color: '#16a34a' } : { status: 'High', color: '#dc2626' };
      case 'sugar':
        return value <= 140 ? { status: 'Normal', color: '#16a34a' } : { status: 'High', color: '#dc2626' };
      default:
        return { status: 'Stable', color: '#6b7280' };
    }
  };

  return (
    <ScrollView style={styles.ehrContainer} showsVerticalScrollIndicator={false} bounces={true}>
      
      {/* Enhanced Header with Gradient */}
      <LinearGradient
        colors={['#7c3aed', '#8b5cf6', '#a855f7']}
        style={styles.ehrHeaderGradient}
      >
        <View style={styles.ehrHeaderContent}>
          <View style={styles.ehrHeaderTop}>
            <View style={styles.ehrHeaderLeft}>
              <View style={styles.ehrHeaderIcon}>
                <Ionicons name="document-text" size={32} color="#ffffff" />
              </View>
              <View style={styles.ehrHeaderInfo}>
                <Text style={styles.ehrMainTitle}>Health Records</Text>
                <Text style={styles.ehrHeaderSubtitle}>
                  Your comprehensive medical history
                </Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.ehrHeaderAction}>
              <Ionicons name="download-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Quick Overview Stats */}
          <View style={styles.ehrQuickStats}>
            <View style={styles.ehrQuickStatItem}>
              <View style={styles.ehrQuickStatIcon}>
                <Ionicons name="folder-open-outline" size={20} color="#7c3aed" />
              </View>
              <Text style={styles.ehrQuickStatNumber}>{ehrRecords.length}</Text>
              <Text style={styles.ehrQuickStatLabel}>Total Records</Text>
            </View>
            
            <View style={styles.ehrQuickStatItem}>
              <View style={styles.ehrQuickStatIcon}>
                <Ionicons name="calendar-outline" size={20} color="#f59e0b" />
              </View>
              <Text style={styles.ehrQuickStatNumber}>{upcomingFollowUps.length}</Text>
              <Text style={styles.ehrQuickStatLabel}>Follow-ups</Text>
            </View>
            
            <View style={styles.ehrQuickStatItem}>
              <View style={styles.ehrQuickStatIcon}>
                <Ionicons name="pulse-outline" size={20} color="#10b981" />
              </View>
              <Text style={styles.ehrQuickStatNumber}>
                {ehrRecords.filter(r => r.status === 'Active').length}
              </Text>
              <Text style={styles.ehrQuickStatLabel}>Active</Text>
            </View>
            
            <View style={styles.ehrQuickStatItem}>
              <View style={styles.ehrQuickStatIcon}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#0891b2" />
              </View>
              <Text style={styles.ehrQuickStatNumber}>
                {ehrRecords.filter(r => r.diagnosticReports.some(d => d.status === 'Normal')).length}
              </Text>
              <Text style={styles.ehrQuickStatLabel}>Normal</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Main Content Area */}
      <View style={styles.ehrMainContent}>
        
        {/* Health Summary Dashboard */}
        {recentRecords.length > 0 && (
          <View style={styles.ehrSection}>
            <View style={styles.ehrSectionHeader}>
              <View style={styles.ehrSectionHeaderLeft}>
                <View style={styles.ehrSectionIcon}>
                  <Ionicons name="analytics-outline" size={20} color="#7c3aed" />
                </View>
                <Text style={styles.ehrSectionTitle}>Health Summary</Text>
              </View>
              <View style={styles.ehrHealthStatus}>
                <View style={styles.ehrHealthIndicator} />
                <Text style={styles.ehrHealthStatusText}>Good</Text>
              </View>
            </View>

            <View style={styles.ehrHealthDashboard}>
              {/* Latest Assessment Card */}
              <View style={styles.ehrAssessmentCard}>
                <View style={styles.ehrAssessmentHeader}>
                  <View style={styles.ehrAssessmentLeft}>
                    <Text style={styles.ehrAssessmentTitle}>Latest Assessment</Text>
                    <Text style={styles.ehrAssessmentDate}>
                      {formatDate(recentRecords[0].appointmentDateTime)}
                    </Text>
                  </View>
                  <View style={styles.ehrAssessmentDoctor}>
                    <Ionicons name="person-circle-outline" size={20} color="#6b7280" />
                    <Text style={styles.ehrAssessmentDoctorName}>{formatDoctorName(recentRecords[0].doctorName)}</Text>
                  </View>
                </View>

                <View style={styles.ehrAssessmentContent}>
                  <Text style={styles.ehrAssessmentCondition}>{recentRecords[0].healthIssue}</Text>
                  <Text style={styles.ehrAssessmentResolution} numberOfLines={2}>
                    {recentRecords[0].doctorResolution}
                  </Text>
                </View>
              </View>

              {/* Vitals Grid */}
              <View style={styles.ehrVitalsSection}>
                <Text style={styles.ehrVitalsTitle}>Current Vitals</Text>
                <View style={styles.ehrVitalsGrid}>
                  <View style={styles.ehrVitalCard}>
                    <View style={styles.ehrVitalHeader}>
                      <View style={[styles.ehrVitalIcon, { backgroundColor: '#fee2e2' }]}>
                        <Ionicons name="heart" size={18} color="#dc2626" />
                      </View>
                      <Text style={styles.ehrVitalLabel}>Blood Pressure</Text>
                    </View>
                    <Text style={styles.ehrVitalValue}>
                      {recentRecords[0].patientBasicVitals.bloodPressure.systolic}/
                      {recentRecords[0].patientBasicVitals.bloodPressure.diastolic}
                    </Text>
                    <Text style={styles.ehrVitalUnit}>mmHg</Text>
                    <View style={[
                      styles.ehrVitalStatusBadge,
                      { backgroundColor: getVitalStatus('bp', recentRecords[0].patientBasicVitals.bloodPressure.systolic).color + '20' }
                    ]}>
                      <Text style={[
                        styles.ehrVitalStatusText,
                        { color: getVitalStatus('bp', recentRecords[0].patientBasicVitals.bloodPressure.systolic).color }
                      ]}>
                        {getVitalStatus('bp', recentRecords[0].patientBasicVitals.bloodPressure.systolic).status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.ehrVitalCard}>
                    <View style={styles.ehrVitalHeader}>
                      <View style={[styles.ehrVitalIcon, { backgroundColor: '#fef3c7' }]}>
                        <Ionicons name="water" size={18} color="#f59e0b" />
                      </View>
                      <Text style={styles.ehrVitalLabel}>Blood Sugar</Text>
                    </View>
                    <Text style={styles.ehrVitalValue}>
                      {recentRecords[0].patientBasicVitals.sugarReading}
                    </Text>
                    <Text style={styles.ehrVitalUnit}>mg/dL</Text>
                    <View style={[
                      styles.ehrVitalStatusBadge,
                      { backgroundColor: getVitalStatus('sugar', recentRecords[0].patientBasicVitals.sugarReading).color + '20' }
                    ]}>
                      <Text style={[
                        styles.ehrVitalStatusText,
                        { color: getVitalStatus('sugar', recentRecords[0].patientBasicVitals.sugarReading).color }
                      ]}>
                        {getVitalStatus('sugar', recentRecords[0].patientBasicVitals.sugarReading).status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.ehrVitalCard}>
                    <View style={styles.ehrVitalHeader}>
                      <View style={[styles.ehrVitalIcon, { backgroundColor: '#dcfce7' }]}>
                        <Ionicons name="fitness" size={18} color="#16a34a" />
                      </View>
                      <Text style={styles.ehrVitalLabel}>Weight</Text>
                    </View>
                    <Text style={styles.ehrVitalValue}>
                      {recentRecords[0].patientBasicVitals.weight}
                    </Text>
                    <Text style={styles.ehrVitalUnit}>kg</Text>
                    <View style={[styles.ehrVitalStatusBadge, { backgroundColor: '#6b728020' }]}>
                      <Text style={[styles.ehrVitalStatusText, { color: '#6b7280' }]}>
                        Stable
                      </Text>
                    </View>
                  </View>

                  {recentRecords[0].patientBasicVitals.height && (
                    <View style={styles.ehrVitalCard}>
                      <View style={styles.ehrVitalHeader}>
                        <View style={[styles.ehrVitalIcon, { backgroundColor: '#e0f2fe' }]}>
                          <Ionicons name="resize" size={18} color="#0891b2" />
                        </View>
                        <Text style={styles.ehrVitalLabel}>Height</Text>
                      </View>
                      <Text style={styles.ehrVitalValue}>
                        {recentRecords[0].patientBasicVitals.height}
                      </Text>
                      <Text style={styles.ehrVitalUnit}>cm</Text>
                      <View style={[styles.ehrVitalStatusBadge, { backgroundColor: '#6b728020' }]}>
                        <Text style={[styles.ehrVitalStatusText, { color: '#6b7280' }]}>
                          Normal
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Medical Records Section */}
        <View style={styles.ehrSection}>
          <View style={styles.ehrSectionHeader}>
            <View style={styles.ehrSectionHeaderLeft}>
              <View style={[styles.ehrSectionIcon, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="document-text-outline" size={20} color="#3b82f6" />
              </View>
              <Text style={styles.ehrSectionTitle}>Medical Records</Text>
            </View>
            <TouchableOpacity style={styles.ehrViewAllButton}>
              <Text style={styles.ehrViewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          <View style={styles.ehrRecordsContainer}>
            {recentRecords.length > 0 ? (
              recentRecords.map((record) => (
                <TouchableOpacity 
                  key={record.id} 
                  style={styles.ehrRecordCard} 
                  onPress={() => openEHRDetail(record)}
                  activeOpacity={0.95}
                >
                  <View style={styles.ehrRecordHeader}>
                    <View style={styles.ehrRecordLeft}>
                      <Text style={styles.ehrRecordId}>{record.raphaId}</Text>
                      <Text style={styles.ehrRecordDate}>
                        {formatDate(record.appointmentDateTime)}
                      </Text>
                    </View>
                    <View style={[
                      styles.ehrRecordStatusBadge,
                      { backgroundColor: getStatusColor(record.status) + '20' }
                    ]}>
                      <View style={[
                        styles.ehrRecordStatusIndicator,
                        { backgroundColor: getStatusColor(record.status) }
                      ]} />
                      <Text style={[
                        styles.ehrRecordStatusText,
                        { color: getStatusColor(record.status) }
                      ]}>
                        {record.status === 'Follow-up Required' ? 'FOLLOW-UP REQUIRED' : record.status}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.ehrRecordContent}>
                    <View style={styles.ehrRecordDoctor}>
                      <Ionicons name="person-circle-outline" size={16} color="#6b7280" />
                      <Text style={styles.ehrRecordDoctorName}>{formatDoctorName(record.doctorName)}</Text>
                    </View>
                    
                    <Text style={styles.ehrRecordCondition} numberOfLines={1}>
                      {record.healthIssue}
                    </Text>
                    
                    <View style={styles.ehrRecordMeta}>
                      <View style={styles.ehrRecordMetaItem}>
                        <Ionicons name="medical-outline" size={12} color="#9ca3af" />
                        <Text style={styles.ehrRecordMetaText}>
                          {record.medicinesPrescription.length} Medicines
                        </Text>
                      </View>
                      
                      <View style={styles.ehrRecordMetaItem}>
                        <Ionicons name="document-outline" size={12} color="#9ca3af" />
                        <Text style={styles.ehrRecordMetaText}>
                          {record.diagnosticReports.length} Tests
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.ehrRecordAction}>
                    <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.ehrEmptyRecords}>
                <View style={styles.ehrEmptyIcon}>
                  <Ionicons name="document-text-outline" size={48} color="#d1d5db" />
                </View>
                <Text style={styles.ehrEmptyTitle}>No Medical Records</Text>
                <Text style={styles.ehrEmptySubtitle}>
                  Your medical records will appear here after appointments
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Upcoming Follow-ups */}
        {upcomingFollowUps.length > 0 && (
          <View style={styles.ehrSection}>
            <View style={styles.ehrSectionHeader}>
              <View style={styles.ehrSectionHeaderLeft}>
                <View style={[styles.ehrSectionIcon, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="calendar-outline" size={20} color="#f59e0b" />
                </View>
                <Text style={styles.ehrSectionTitle}>Upcoming Follow-ups</Text>
              </View>
              <View style={styles.ehrFollowUpCount}>
                <Text style={styles.ehrFollowUpCountText}>{upcomingFollowUps.length}</Text>
              </View>
            </View>
            
            <View style={styles.ehrFollowUpsList}>
              {upcomingFollowUps.slice(0, 3).map((followUp, index) => (
                <View key={index} style={styles.ehrFollowUpCard}>
                  <View style={styles.ehrFollowUpHeader}>
                    <View style={styles.ehrFollowUpLeft}>
                      <Text style={styles.ehrFollowUpPurpose}>{followUp.purpose}</Text>
                      <Text style={styles.ehrFollowUpDate}>
                        {new Date(followUp.followUpDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                    
                    <View style={[
                      styles.ehrFollowUpPriority,
                      {
                        backgroundColor: followUp.priority === 'High' ? '#fee2e2' :
                                       followUp.priority === 'Medium' ? '#fef3c7' : '#dcfce7'
                      }
                    ]}>
                      <Text style={[
                        styles.ehrFollowUpPriorityText,
                        {
                          color: followUp.priority === 'High' ? '#dc2626' :
                                 followUp.priority === 'Medium' ? '#f59e0b' : '#16a34a'
                        }
                      ]}>
                        {followUp.priority}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.ehrFollowUpActions}>
                    <TouchableOpacity style={styles.ehrFollowUpActionButton}>
                      <Ionicons name="calendar-outline" size={14} color="#6b7280" />
                      <Text style={styles.ehrFollowUpActionText}>Reschedule</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={[styles.ehrFollowUpActionButton, styles.ehrFollowUpPrimaryButton]}>
                      <Ionicons name="checkmark-outline" size={14} color="#3b82f6" />
                      <Text style={[styles.ehrFollowUpActionText, styles.ehrFollowUpPrimaryText]}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Health Categories Grid */}
        <View style={[styles.ehrSection, { marginBottom: 40 }]}>
          <View style={styles.ehrSectionHeader}>
            <View style={styles.ehrSectionHeaderLeft}>
              <View style={[styles.ehrSectionIcon, { backgroundColor: '#f3f4f6' }]}>
                <Ionicons name="grid-outline" size={20} color="#4b5563" />
              </View>
              <Text style={styles.ehrSectionTitle}>Health Categories</Text>
            </View>
          </View>
          
          <View style={styles.ehrCategoriesGrid}>
            {[
              { icon: 'heart-outline', name: 'Cardiology', count: 3, color: '#dc2626', bgColor: '#fee2e2' },
              { icon: 'medical-outline', name: 'General', count: 5, color: '#3b82f6', bgColor: '#dbeafe' },
              { icon: 'flask-outline', name: 'Lab Tests', count: 8, color: '#059669', bgColor: '#d1fae5' },
              { icon: 'eye-outline', name: 'Radiology', count: 2, color: '#7c3aed', bgColor: '#ede9fe' },
              { icon: 'fitness-outline', name: 'Physical', count: 4, color: '#f59e0b', bgColor: '#fef3c7' },
              { icon: 'bandage-outline', name: 'Surgery', count: 1, color: '#dc2626', bgColor: '#fee2e2' },
            ].map((category, index) => (
              <TouchableOpacity key={index} style={styles.ehrCategoryCard}>
                <View style={[styles.ehrCategoryIcon, { backgroundColor: category.bgColor }]}>
                  <Ionicons name={category.icon as any} size={20} color={category.color} />
                </View>
                <Text style={styles.ehrCategoryName}>{category.name}</Text>
                <Text style={styles.ehrCategoryCount}>{category.count} records</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
      </View>

      {/* Enhanced Professional EHR Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeModal}
      >
        <View style={styles.ehrModalContainer}>
          {/* Enhanced Header with Gradient */}
          <LinearGradient
            colors={['#3b82f6', '#2563eb', '#1d4ed8']}
            style={styles.ehrModalHeader}
          >
            <View style={styles.ehrHeaderContentModal}>
              <View style={styles.ehrHeaderLeftModal}>
                <TouchableOpacity 
                  style={styles.ehrBackButton} 
                  onPress={closeModal}
                  activeOpacity={0.8}
                >
                  <Ionicons name="arrow-back" size={24} color="#ffffff" />
                </TouchableOpacity>
                <View style={styles.ehrHeaderInfoModal}>
                  <Text style={styles.ehrModalTitle}>Medical Record</Text>
                  <Text style={styles.ehrPatientName}>
                    {selectedRecord?.patientFullName || 'Patient'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.ehrHeaderActions}>
                <TouchableOpacity style={styles.ehrActionButton} activeOpacity={0.8}>
                  <Ionicons name="download-outline" size={20} color="#ffffff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.ehrActionButton} activeOpacity={0.8}>
                  <Ionicons name="share-outline" size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Patient Summary Card */}
            {selectedRecord && (
              <View style={styles.ehrPatientSummary}>
                <View style={styles.ehrSummaryRow}>
                  <View style={styles.ehrSummaryItem}>
                    <Ionicons name="person-outline" size={16} color="#93c5fd" />
                    <Text style={styles.ehrSummaryLabel}>ID: {selectedRecord.raphaId}</Text>
                  </View>
                  <View style={styles.ehrSummaryItem}>
                    <Ionicons name="calendar-outline" size={16} color="#93c5fd" />
                    <Text style={styles.ehrSummaryLabel}>
                      {new Date(selectedRecord.appointmentDateTime).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </LinearGradient>

          {selectedRecord ? (
            <ScrollView 
              style={styles.ehrModalContent} 
              showsVerticalScrollIndicator={false}
              bounces={true}
            >
              {/* Vitals Dashboard */}
              <View style={styles.ehrVitalsCard}>
                <View style={styles.ehrCardHeader}>
                  <View style={styles.ehrCardHeaderLeft}>
                    <View style={styles.ehrIconContainer}>
                      <Ionicons name="heart-outline" size={20} color="#ef4444" />
                    </View>
                    <Text style={styles.ehrCardTitle}>Vital Signs</Text>
                  </View>
                  <View style={styles.ehrStatusBadge}>
                    <Text style={styles.ehrStatusText}>Normal</Text>
                  </View>
                </View>
                
                <View style={styles.ehrCardContent}>
                  <View style={styles.ehrVitalsGrid}>
                    <View style={styles.ehrVitalCard}>
                      <View style={styles.ehrVitalHeader}>
                        <View style={styles.ehrVitalIcon}>
                          <Ionicons name="pulse-outline" size={24} color="#ef4444" />
                        </View>
                      </View>
                      <Text style={styles.ehrVitalValue}>
                        {selectedRecord.patientBasicVitals.bloodPressure.systolic}/
                        {selectedRecord.patientBasicVitals.bloodPressure.diastolic}
                      </Text>
                      <Text style={styles.ehrVitalUnit}>mmHg</Text>
                      <Text style={styles.ehrVitalLabel}>Blood Pressure</Text>
                    </View>
                    
                    <View style={styles.ehrVitalCard}>
                      <View style={styles.ehrVitalHeader}>
                        <View style={styles.ehrVitalIcon}>
                          <Ionicons name="water-outline" size={24} color="#f59e0b" />
                        </View>
                      </View>
                      <Text style={styles.ehrVitalValue}>{selectedRecord.patientBasicVitals.sugarReading}</Text>
                      <Text style={styles.ehrVitalUnit}>mg/dL</Text>
                      <Text style={styles.ehrVitalLabel}>Blood Sugar</Text>
                    </View>
                    
                    <View style={styles.ehrVitalCard}>
                      <View style={styles.ehrVitalHeader}>
                        <View style={styles.ehrVitalIcon}>
                          <Ionicons name="fitness-outline" size={24} color="#10b981" />
                        </View>
                      </View>
                      <Text style={styles.ehrVitalValue}>{selectedRecord.patientBasicVitals.weight}</Text>
                      <Text style={styles.ehrVitalUnit}>kg</Text>
                      <Text style={styles.ehrVitalLabel}>Weight</Text>
                    </View>
                    
                    {selectedRecord.patientBasicVitals.height && (
                      <View style={styles.ehrVitalCard}>
                        <View style={styles.ehrVitalHeader}>
                          <View style={styles.ehrVitalIcon}>
                            <Ionicons name="resize-outline" size={24} color="#8b5cf6" />
                          </View>
                        </View>
                        <Text style={styles.ehrVitalValue}>{selectedRecord.patientBasicVitals.height}</Text>
                        <Text style={styles.ehrVitalUnit}>cm</Text>
                        <Text style={styles.ehrVitalLabel}>Height</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Health Issue Card */}
              <View style={styles.ehrCard}>
                <View style={styles.ehrCardHeader}>
                  <View style={styles.ehrCardHeaderLeft}>
                    <View style={[styles.ehrIconContainer, { backgroundColor: '#fef3c7' }]}>
                      <Ionicons name="medical-outline" size={20} color="#f59e0b" />
                    </View>
                    <Text style={styles.ehrCardTitle}>Chief Complaint</Text>
                  </View>
                </View>
                <View style={styles.ehrCardContent}>
                  <Text style={styles.ehrCardText}>{selectedRecord.healthIssue}</Text>
                </View>
              </View>

              {/* Doctor's Assessment */}
              <View style={styles.ehrCard}>
                <View style={styles.ehrCardHeader}>
                  <View style={styles.ehrCardHeaderLeft}>
                    <View style={[styles.ehrIconContainer, { backgroundColor: '#dcfce7' }]}>
                      <Ionicons name="checkmark-circle-outline" size={20} color="#16a34a" />
                    </View>
                    <Text style={styles.ehrCardTitle}>Clinical Assessment</Text>
                  </View>
                </View>
                <View style={styles.ehrCardContent}>
                  <Text style={styles.ehrCardText}>{selectedRecord.doctorResolution}</Text>
                </View>
              </View>

              {/* Medications */}
              <View style={styles.ehrCard}>
                <View style={styles.ehrCardHeader}>
                  <View style={styles.ehrCardHeaderLeft}>
                    <View style={[styles.ehrIconContainer, { backgroundColor: '#fce7f3' }]}>
                      <Ionicons name="medical-outline" size={20} color="#ec4899" />
                    </View>
                    <Text style={styles.ehrCardTitle}>Prescribed Medications</Text>
                  </View>
                  <View style={styles.ehrMedCountBadge}>
                    <Text style={styles.ehrMedCountText}>{selectedRecord.medicinesPrescription.length}</Text>
                  </View>
                </View>
                
                <View style={styles.ehrCardContent}>
                  {selectedRecord.medicinesPrescription.map((med, index) => (
                    <View key={med.id} style={styles.ehrMedicationCard}>
                      <View style={styles.ehrMedHeader}>
                        <View style={styles.ehrMedIcon}>
                          <Ionicons name="medical" size={16} color="#ec4899" />
                        </View>
                        <View style={styles.ehrMedInfo}>
                          <Text style={styles.ehrMedName}>{med.medicineName}</Text>
                          <Text style={styles.ehrMedDosage}>{med.dosage} • {med.frequency}</Text>
                        </View>
                      </View>
                      <View style={styles.ehrMedInstructions}>
                        <Text style={styles.ehrMedInstructionText}>{med.instructions}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Diagnostic Reports */}
              <View style={styles.ehrCard}>
                <View style={styles.ehrCardHeader}>
                  <View style={styles.ehrCardHeaderLeft}>
                    <View style={[styles.ehrIconContainer, { backgroundColor: '#e0f2fe' }]}>
                      <Ionicons name="document-text-outline" size={20} color="#0891b2" />
                    </View>
                    <Text style={styles.ehrCardTitle}>Laboratory Results</Text>
                  </View>
                  <View style={styles.ehrTestCountBadge}>
                    <Text style={styles.ehrTestCountText}>{selectedRecord.diagnosticReports.length}</Text>
                  </View>
                </View>
                
                <View style={styles.ehrCardContent}>
                  {selectedRecord.diagnosticReports.map((report) => (
                    <View key={report.id} style={styles.ehrDiagnosticCard}>
                      <View style={styles.ehrDiagHeader}>
                        <View style={styles.ehrDiagLeft}>
                          <Text style={styles.ehrDiagName}>{report.testName}</Text>
                          <Text style={styles.ehrDiagDate}>{report.reportDate}</Text>
                        </View>
                        <View style={[
                          styles.ehrDiagStatus,
                          { backgroundColor: report.status === 'Normal' ? '#dcfce7' : 
                                              report.status === 'Abnormal' ? '#fef3c7' : 
                                              report.status === 'Critical' ? '#fee2e2' : '#f1f5f9' }
                        ]}>
                          <Text style={[
                            styles.ehrDiagStatusText,
                            { color: report.status === 'Normal' ? '#16a34a' : 
                                     report.status === 'Abnormal' ? '#f59e0b' :
                                     report.status === 'Critical' ? '#dc2626' : '#6b7280' }
                          ]}>
                            {report.status}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.ehrDiagContent}>
                        <Text style={styles.ehrDiagResults}>{report.results}</Text>
                        {report.normalRange && (
                          <View style={styles.ehrDiagRange}>
                            <Ionicons name="information-circle-outline" size={14} color="#6b7280" />
                            <Text style={styles.ehrDiagRangeText}>Normal Range: {report.normalRange}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Surgery Information */}
              {selectedRecord.surgeryDescription && (
                <View style={styles.ehrCard}>
                  <View style={styles.ehrCardHeader}>
                    <View style={styles.ehrCardHeaderLeft}>
                      <View style={[styles.ehrIconContainer, { backgroundColor: '#fef2f2' }]}>
                        <Ionicons name="cut-outline" size={20} color="#dc2626" />
                      </View>
                      <Text style={styles.ehrCardTitle}>Surgical Procedure</Text>
                    </View>
                  </View>
                  <View style={styles.ehrCardContent}>
                    <View style={styles.ehrSurgeryInfo}>
                      <Text style={styles.ehrSurgeryType}>{selectedRecord.surgeryDescription.surgeryType}</Text>
                      <Text style={styles.ehrSurgeryDesc}>{selectedRecord.surgeryDescription.description}</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Final Remarks */}
              <View style={styles.ehrCard}>
                <View style={styles.ehrCardHeader}>
                  <View style={styles.ehrCardHeaderLeft}>
                    <View style={[styles.ehrIconContainer, { backgroundColor: '#f3f4f6' }]}>
                      <Ionicons name="clipboard-outline" size={20} color="#4b5563" />
                    </View>
                    <Text style={styles.ehrCardTitle}>Clinical Notes</Text>
                  </View>
                </View>
                <View style={styles.ehrCardContent}>
                  <Text style={styles.ehrCardText}>{selectedRecord.finalRemarks}</Text>
                </View>
              </View>

              {/* Physician Information */}
              <View style={[styles.ehrCard, { marginBottom: 40 }]}>
                <View style={styles.ehrCardHeader}>
                  <View style={styles.ehrCardHeaderLeft}>
                    <View style={[styles.ehrIconContainer, { backgroundColor: '#ede9fe' }]}>
                      <Ionicons name="person-circle-outline" size={20} color="#7c3aed" />
                    </View>
                    <Text style={styles.ehrCardTitle}>Attending Physician</Text>
                  </View>
                </View>
                <View style={styles.ehrCardContent}>
                  <View style={styles.ehrPhysicianInfo}>
                    <Text style={styles.ehrPhysicianName}>{formatDoctorName(selectedRecord.doctorName)}</Text>
                    <View style={styles.ehrRecordMeta}>
                      <Ionicons name="time-outline" size={14} color="#6b7280" />
                      <Text style={styles.ehrRecordDate}>
                        Record Created: {new Date(selectedRecord.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

            </ScrollView>
          ) : (
            <View style={styles.ehrNoDataContainer}>
              <View style={styles.ehrNoDataIcon}>
                <Ionicons name="document-text-outline" size={64} color="#d1d5db" />
              </View>
              <Text style={styles.ehrNoDataTitle}>No Record Selected</Text>
              <Text style={styles.ehrNoDataSubtitle}>Please select a medical record to view details</Text>
            </View>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Enhanced Professional EHR Styles
  ehrContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  // EHR Header Section
  ehrHeaderGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 30,
  },
  ehrHeaderContent: {
    paddingHorizontal: 20,
  },
  ehrHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  ehrHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ehrHeaderIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  ehrHeaderInfo: {
    flex: 1,
  },
  ehrMainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  ehrHeaderSubtitle: {
    fontSize: 16,
    color: '#c4b5fd',
    fontWeight: '500',
  },
  ehrHeaderAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Quick Stats
  ehrQuickStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  ehrQuickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  ehrQuickStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  ehrQuickStatNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  ehrQuickStatLabel: {
    fontSize: 12,
    color: '#c4b5fd',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  
  // Main Content
  ehrMainContent: {
    flex: 1,
    paddingTop: 20,
  },
  
  // Section Styles
  ehrSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  ehrSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ehrSectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ehrSectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ehrSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  
  // Health Status Indicator
  ehrHealthStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ehrHealthIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16a34a',
  },
  ehrHealthStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
  },
  
  // Health Dashboard
  ehrHealthDashboard: {
    gap: 16,
  },
  ehrAssessmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  ehrAssessmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  ehrAssessmentLeft: {
    flex: 1,
  },
  ehrAssessmentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  ehrAssessmentDate: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  ehrAssessmentDoctor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ehrAssessmentDoctorName: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  ehrAssessmentContent: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  ehrAssessmentCondition: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  ehrAssessmentResolution: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  
  // Vitals Section
  ehrVitalsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  ehrVitalsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  ehrVitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  ehrVitalCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 120 : 80,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  ehrVitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ehrVitalIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  ehrVitalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  ehrVitalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  ehrVitalUnit: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  ehrVitalStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  ehrVitalStatusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  
  // View All Button
  ehrViewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ehrViewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  
  // Records Container
  ehrRecordsContainer: {
    gap: 12,
  },
  ehrRecordCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  ehrRecordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  ehrRecordLeft: {
    flex: 1,
  },
  ehrRecordId: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 4,
  },
  ehrRecordDate: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  ehrRecordStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  ehrRecordStatusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  ehrRecordStatusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ehrRecordContent: {
    marginBottom: 16,
  },
  ehrRecordDoctor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  ehrRecordDoctorName: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  ehrRecordCondition: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    lineHeight: 22,
  },
  ehrRecordMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  ehrRecordMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ehrRecordMetaText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
  },
  ehrRecordAction: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    padding: 4,
  },
  
  // Empty Records
  ehrEmptyRecords: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  ehrEmptyIcon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  ehrEmptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  ehrEmptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Follow-ups Section
  ehrFollowUpCount: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ehrFollowUpCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f59e0b',
  },
  ehrFollowUpsList: {
    gap: 12,
  },
  ehrFollowUpCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  ehrFollowUpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ehrFollowUpLeft: {
    flex: 1,
  },
  ehrFollowUpPurpose: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  ehrFollowUpDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  ehrFollowUpPriority: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ehrFollowUpPriorityText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  ehrFollowUpActions: {
    flexDirection: 'row',
    gap: 8,
  },
  ehrFollowUpActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 4,
  },
  ehrFollowUpPrimaryButton: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bfdbfe',
  },
  ehrFollowUpActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  ehrFollowUpPrimaryText: {
    color: '#3b82f6',
  },
  
  // Categories Grid
  ehrCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  ehrCategoryCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 120 : 100,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  ehrCategoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  ehrCategoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  ehrCategoryCount: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },

  // Enhanced Professional EHR Modal Styles
  ehrModalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  // Header Styles
  ehrModalHeader: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
  },
  ehrHeaderContentModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  ehrHeaderLeftModal: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ehrBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  ehrHeaderInfoModal: {
    flex: 1,
  },
  ehrModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  ehrPatientName: {
    fontSize: 16,
    color: '#93c5fd',
    fontWeight: '500',
  },
  ehrHeaderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  ehrActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Patient Summary
  ehrPatientSummary: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
  },
  ehrSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ehrSummaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ehrSummaryLabel: {
    fontSize: 14,
    color: '#dbeafe',
    fontWeight: '500',
  },
  
  // Content Area
  ehrModalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  
  // Card Styles
  ehrCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  ehrVitalsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  ehrCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  ehrCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ehrIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ehrCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  ehrStatusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ehrStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },
  ehrCardContent: {
    padding: 20,
  },
  ehrCardText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  
  // Vitals Grid in Modal
  ehrVitalCardModal: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 120 : 80,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    margin: 4,
  },
  ehrVitalHeaderModal: {
    alignItems: 'center',
    marginBottom: 12,
  },
  ehrVitalIconModal: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  ehrVitalValueModal: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  ehrVitalUnitModal: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
    textAlign: 'center',
  },
  ehrVitalLabelModal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  
  // Medication Styles
  ehrMedCountBadge: {
    backgroundColor: '#fce7f3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ehrMedCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ec4899',
  },
  ehrMedicationCard: {
    backgroundColor: '#fefbf7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ec4899',
  },
  ehrMedHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ehrMedIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fce7f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ehrMedInfo: {
    flex: 1,
  },
  ehrMedName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  ehrMedDosage: {
    fontSize: 14,
    color: '#ec4899',
    fontWeight: '500',
  },
  ehrMedInstructions: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f3e8ff',
  },
  ehrMedInstructionText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  
  // Diagnostic Report Styles
  ehrTestCountBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ehrTestCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0891b2',
  },
  ehrDiagnosticCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0891b2',
  },
  ehrDiagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ehrDiagLeft: {
    flex: 1,
  },
  ehrDiagName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  ehrDiagDate: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  ehrDiagStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  ehrDiagStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ehrDiagContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
  },
  ehrDiagResults: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  ehrDiagRange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ehrDiagRangeText: {
    fontSize: 12,
    color: '#6b7280',
  },
  
  // Surgery Styles
  ehrSurgeryInfo: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  ehrSurgeryType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 8,
  },
  ehrSurgeryDesc: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  
  // Physician Info
  ehrPhysicianInfo: {
    backgroundColor: '#faf5ff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#7c3aed',
  },
  ehrPhysicianName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7c3aed',
    marginBottom: 8,
  },
  
  // Empty State
  ehrNoDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  ehrNoDataIcon: {
    marginBottom: 24,
  },
  ehrNoDataTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  ehrNoDataSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Legacy Modal Styles (keeping for compatibility)
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
});

export default EHRScreen;