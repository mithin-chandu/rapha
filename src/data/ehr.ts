// Electronic Health Records (EHR) Data
// Based on Rapha EHR Template with 13 key components

export interface PatientVitals {
  sugarReading: number; // mg/dL
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  weight: number; // kg
  height?: number; // cm
  temperature?: number; // °F
  heartRate?: number; // bpm
}

export interface MedicinePrescription {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface DiagnosticReport {
  id: string;
  testName: string;
  reportDate: string;
  results: string;
  normalRange?: string;
  status: 'Normal' | 'Abnormal' | 'Critical' | 'Pending';
  attachmentUrl?: string;
}

export interface SurgeryDetails {
  id: string;
  surgeryType: string;
  description: string;
  reasonForSurgery: string;
  scheduledDate?: string;
  completedDate?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  postOpStatus?: string;
  complications?: string;
}

export interface FollowUpDetails {
  id: string;
  nextAppointmentDate: string;
  purpose: string;
  instructions: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export interface EHRRecord {
  id: string; // Unique Rapha Digital ID
  raphaId: string; // Rapha ID as per algorithm
  appointmentDateTime: string;
  patientFullName: string; // As per ABHA Health ID
  patientBasicVitals: PatientVitals;
  healthIssue: string;
  doctorResolution: string;
  medicinesPrescription: MedicinePrescription[];
  diagnosticReports: DiagnosticReport[];
  doctorRemarkOnDiagnostics: string;
  surgeryDescription?: SurgeryDetails;
  followUpDetails: FollowUpDetails[];
  finalRemarks: string; // By doctor
  doctorId: string;
  doctorName: string;
  createdAt: string;
  updatedAt: string;
  status: 'Active' | 'Completed' | 'Follow-up Required';
}

// Demo EHR Records
export const ehrRecords: EHRRecord[] = [
  {
    id: "ehr_001",
    raphaId: "RAPHA_2024_001_MC",
    appointmentDateTime: "2024-11-08T10:00:00Z",
    patientFullName: "Mithin Chandu",
    patientBasicVitals: {
      sugarReading: 95,
      bloodPressure: {
        systolic: 120,
        diastolic: 80
      },
      weight: 70,
      height: 175,
      temperature: 98.6,
      heartRate: 72
    },
    healthIssue: "Persistent headaches and mild hypertension symptoms",
    doctorResolution: "Prescribed medication for blood pressure management and recommended lifestyle changes including regular exercise and reduced sodium intake.",
    medicinesPrescription: [
      {
        id: "med_001",
        medicineName: "Amlodipine",
        dosage: "5mg",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take with food in the morning"
      },
      {
        id: "med_002",
        medicineName: "Paracetamol",
        dosage: "500mg",
        frequency: "As needed",
        duration: "5 days",
        instructions: "For headache relief, maximum 3 tablets per day"
      }
    ],
    diagnosticReports: [
      {
        id: "diag_001",
        testName: "Blood Pressure Monitoring",
        reportDate: "2024-11-08",
        results: "140/90 mmHg",
        normalRange: "120/80 mmHg",
        status: "Abnormal"
      },
      {
        id: "diag_002",
        testName: "Complete Blood Count",
        reportDate: "2024-11-08",
        results: "All parameters within normal limits",
        normalRange: "Standard CBC ranges",
        status: "Normal"
      }
    ],
    doctorRemarkOnDiagnostics: "Blood pressure is slightly elevated. CBC results are normal. Recommend continuous monitoring and medication adherence.",
    followUpDetails: [
      {
        id: "follow_001",
        nextAppointmentDate: "2024-11-22T10:00:00Z",
        purpose: "Blood pressure follow-up and medication review",
        instructions: "Continue prescribed medication and maintain blood pressure log",
        priority: "Medium"
      }
    ],
    finalRemarks: "Patient shows mild hypertension. Started on Amlodipine with good tolerance. Advised lifestyle modifications. Follow-up in 2 weeks to assess treatment response.",
    doctorId: "doc_001",
    doctorName: "Dr. Sarah Johnson",
    createdAt: "2024-11-08T10:30:00Z",
    updatedAt: "2024-11-08T10:30:00Z",
    status: "Follow-up Required"
  },
  {
    id: "ehr_002",
    raphaId: "RAPHA_2024_002_AS",
    appointmentDateTime: "2024-11-07T14:30:00Z",
    patientFullName: "Anita Sharma",
    patientBasicVitals: {
      sugarReading: 180,
      bloodPressure: {
        systolic: 130,
        diastolic: 85
      },
      weight: 65,
      height: 160,
      temperature: 98.4,
      heartRate: 78
    },
    healthIssue: "Type 2 Diabetes management and routine checkup",
    doctorResolution: "Adjusted diabetes medication dosage and provided dietary counseling. Recommended regular glucose monitoring and exercise routine.",
    medicinesPrescription: [
      {
        id: "med_003",
        medicineName: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "90 days",
        instructions: "Take with meals, morning and evening"
      },
      {
        id: "med_004",
        medicineName: "Glimepiride",
        dosage: "2mg",
        frequency: "Once daily",
        duration: "90 days",
        instructions: "Take before breakfast"
      }
    ],
    diagnosticReports: [
      {
        id: "diag_003",
        testName: "HbA1c",
        reportDate: "2024-11-07",
        results: "8.2%",
        normalRange: "< 7%",
        status: "Abnormal"
      },
      {
        id: "diag_004",
        testName: "Fasting Blood Glucose",
        reportDate: "2024-11-07",
        results: "165 mg/dL",
        normalRange: "70-100 mg/dL",
        status: "Abnormal"
      },
      {
        id: "diag_005",
        testName: "Lipid Profile",
        reportDate: "2024-11-07",
        results: "Total Cholesterol: 220 mg/dL, LDL: 140 mg/dL, HDL: 45 mg/dL",
        normalRange: "Total < 200, LDL < 100, HDL > 50",
        status: "Abnormal"
      }
    ],
    doctorRemarkOnDiagnostics: "HbA1c indicates suboptimal diabetes control. Lipid levels are elevated. Increased medication dosage and strict dietary adherence recommended.",
    followUpDetails: [
      {
        id: "follow_002",
        nextAppointmentDate: "2024-12-07T14:30:00Z",
        purpose: "Diabetes management review and HbA1c recheck",
        instructions: "Monitor blood glucose daily, follow prescribed diet, and maintain exercise routine",
        priority: "High"
      },
      {
        id: "follow_003",
        nextAppointmentDate: "2024-11-21T09:00:00Z",
        purpose: "Nutritionist consultation",
        instructions: "Attend dietary counseling session",
        priority: "Medium"
      }
    ],
    finalRemarks: "Diabetes control needs improvement. Adjusted medication regimen and emphasized importance of lifestyle modifications. Patient counseled on complications prevention.",
    doctorId: "doc_002",
    doctorName: "Dr. Rajesh Patel",
    createdAt: "2024-11-07T15:00:00Z",
    updatedAt: "2024-11-07T15:00:00Z",
    status: "Follow-up Required"
  },
  {
    id: "ehr_003",
    raphaId: "RAPHA_2024_003_RK",
    appointmentDateTime: "2024-11-06T11:15:00Z",
    patientFullName: "Rohit Kumar",
    patientBasicVitals: {
      sugarReading: 88,
      bloodPressure: {
        systolic: 118,
        diastolic: 75
      },
      weight: 78,
      height: 180,
      temperature: 99.2,
      heartRate: 85
    },
    healthIssue: "Acute appendicitis requiring surgical intervention",
    doctorResolution: "Emergency laparoscopic appendectomy performed successfully. Post-operative care and recovery monitoring initiated.",
    medicinesPrescription: [
      {
        id: "med_005",
        medicineName: "Ceftriaxone",
        dosage: "1g",
        frequency: "Twice daily",
        duration: "7 days",
        instructions: "IV administration, continue until infection markers normalize"
      },
      {
        id: "med_006",
        medicineName: "Tramadol",
        dosage: "50mg",
        frequency: "Every 6 hours",
        duration: "5 days",
        instructions: "For post-operative pain management"
      },
      {
        id: "med_007",
        medicineName: "Omeprazole",
        dosage: "20mg",
        frequency: "Once daily",
        duration: "14 days",
        instructions: "Take on empty stomach in the morning"
      }
    ],
    diagnosticReports: [
      {
        id: "diag_006",
        testName: "CT Scan Abdomen",
        reportDate: "2024-11-06",
        results: "Acute appendicitis with mild inflammation, no perforation detected",
        status: "Abnormal"
      },
      {
        id: "diag_007",
        testName: "White Blood Cell Count",
        reportDate: "2024-11-06",
        results: "15,000 cells/μL",
        normalRange: "4,000-11,000 cells/μL",
        status: "Abnormal"
      },
      {
        id: "diag_008",
        testName: "Post-Op X-Ray",
        reportDate: "2024-11-06",
        results: "No signs of complications, surgical site appears normal",
        status: "Normal"
      }
    ],
    doctorRemarkOnDiagnostics: "Pre-operative CT confirmed acute appendicitis. Post-operative imaging shows successful procedure with no immediate complications.",
    surgeryDescription: {
      id: "surg_001",
      surgeryType: "Laparoscopic Appendectomy",
      description: "Minimally invasive removal of inflamed appendix using laparoscopic technique",
      reasonForSurgery: "Acute appendicitis with risk of perforation and complications if left untreated",
      scheduledDate: "2024-11-06T13:00:00Z",
      completedDate: "2024-11-06T14:30:00Z",
      status: "Completed",
      postOpStatus: "Successful recovery, patient stable, minimal post-operative pain",
      complications: "None observed"
    },
    followUpDetails: [
      {
        id: "follow_004",
        nextAppointmentDate: "2024-11-13T10:00:00Z",
        purpose: "Post-operative wound check and suture removal",
        instructions: "Keep surgical site clean and dry, avoid heavy lifting",
        priority: "High"
      },
      {
        id: "follow_005",
        nextAppointmentDate: "2024-11-20T10:00:00Z",
        purpose: "Final post-operative assessment",
        instructions: "Resume normal activities gradually",
        priority: "Medium"
      }
    ],
    finalRemarks: "Successful laparoscopic appendectomy with excellent post-operative recovery. Patient educated on wound care and activity restrictions. Full recovery expected within 2-3 weeks.",
    doctorId: "doc_003",
    doctorName: "Dr. Michael Chen",
    createdAt: "2024-11-06T15:00:00Z",
    updatedAt: "2024-11-06T15:00:00Z",
    status: "Follow-up Required"
  },
  {
    id: "ehr_004",
    raphaId: "RAPHA_2024_004_PS",
    appointmentDateTime: "2024-11-05T09:00:00Z",
    patientFullName: "Priya Singh",
    patientBasicVitals: {
      sugarReading: 92,
      bloodPressure: {
        systolic: 110,
        diastolic: 70
      },
      weight: 58,
      height: 165,
      temperature: 98.6,
      heartRate: 68
    },
    healthIssue: "Annual health checkup and preventive care consultation",
    doctorResolution: "Complete health assessment shows excellent overall health. Recommended routine preventive measures and lifestyle maintenance.",
    medicinesPrescription: [
      {
        id: "med_008",
        medicineName: "Multivitamin",
        dosage: "1 tablet",
        frequency: "Once daily",
        duration: "365 days",
        instructions: "Take with breakfast for optimal absorption"
      },
      {
        id: "med_009",
        medicineName: "Calcium + Vitamin D3",
        dosage: "500mg + 250 IU",
        frequency: "Once daily",
        duration: "365 days",
        instructions: "Take with dinner"
      }
    ],
    diagnosticReports: [
      {
        id: "diag_009",
        testName: "Complete Blood Count",
        reportDate: "2024-11-05",
        results: "All parameters within normal limits",
        status: "Normal"
      },
      {
        id: "diag_010",
        testName: "Lipid Profile",
        reportDate: "2024-11-05",
        results: "Total Cholesterol: 160 mg/dL, LDL: 85 mg/dL, HDL: 65 mg/dL",
        normalRange: "Total < 200, LDL < 100, HDL > 50",
        status: "Normal"
      },
      {
        id: "diag_011",
        testName: "Thyroid Function Test",
        reportDate: "2024-11-05",
        results: "TSH: 2.5 mIU/L, T3: 145 ng/dL, T4: 8.2 μg/dL",
        normalRange: "TSH: 0.5-5.0, T3: 80-180, T4: 4.5-12.0",
        status: "Normal"
      }
    ],
    doctorRemarkOnDiagnostics: "All laboratory results are within normal ranges. Excellent metabolic and cardiovascular health indicators.",
    followUpDetails: [
      {
        id: "follow_006",
        nextAppointmentDate: "2025-11-05T09:00:00Z",
        purpose: "Annual health checkup",
        instructions: "Continue healthy lifestyle practices, regular exercise, and balanced diet",
        priority: "Low"
      }
    ],
    finalRemarks: "Excellent health status with all parameters normal. Commended patient on maintaining healthy lifestyle. Continue current health practices and return for annual checkup.",
    doctorId: "doc_001",
    doctorName: "Dr. Sarah Johnson",
    createdAt: "2024-11-05T10:00:00Z",
    updatedAt: "2024-11-05T10:00:00Z",
    status: "Completed"
  },
  {
    id: "ehr_005",
    raphaId: "RAPHA_2024_005_VG",
    appointmentDateTime: "2024-11-04T16:00:00Z",
    patientFullName: "Vikram Gupta",
    patientBasicVitals: {
      sugarReading: 105,
      bloodPressure: {
        systolic: 145,
        diastolic: 95
      },
      weight: 85,
      height: 175,
      temperature: 98.8,
      heartRate: 88
    },
    healthIssue: "Chronic knee pain and mobility issues, suspected osteoarthritis",
    doctorResolution: "Diagnosed with moderate osteoarthritis. Initiated pain management protocol and physiotherapy referral. Considering joint injection if conservative treatment fails.",
    medicinesPrescription: [
      {
        id: "med_010",
        medicineName: "Ibuprofen",
        dosage: "400mg",
        frequency: "Three times daily",
        duration: "21 days",
        instructions: "Take with food to prevent gastric irritation"
      },
      {
        id: "med_011",
        medicineName: "Glucosamine Sulfate",
        dosage: "1500mg",
        frequency: "Once daily",
        duration: "90 days",
        instructions: "Take with meals"
      },
      {
        id: "med_012",
        medicineName: "Topical Diclofenac Gel",
        dosage: "Apply thin layer",
        frequency: "Twice daily",
        duration: "30 days",
        instructions: "Apply to affected knee area, wash hands after application"
      }
    ],
    diagnosticReports: [
      {
        id: "diag_012",
        testName: "X-Ray Knee (Both Knees)",
        reportDate: "2024-11-04",
        results: "Moderate joint space narrowing and osteophyte formation in both knees, consistent with osteoarthritis",
        status: "Abnormal"
      },
      {
        id: "diag_013",
        testName: "ESR & CRP",
        reportDate: "2024-11-04",
        results: "ESR: 25 mm/hr, CRP: 2.1 mg/L",
        normalRange: "ESR: < 20 mm/hr, CRP: < 3.0 mg/L",
        status: "Normal"
      }
    ],
    doctorRemarkOnDiagnostics: "X-ray confirms moderate bilateral knee osteoarthritis. Inflammatory markers are within normal limits, ruling out inflammatory arthritis.",
    followUpDetails: [
      {
        id: "follow_007",
        nextAppointmentDate: "2024-11-18T16:00:00Z",
        purpose: "Pain management review and physiotherapy assessment",
        instructions: "Start physiotherapy sessions, continue medications as prescribed",
        priority: "Medium"
      },
      {
        id: "follow_008",
        nextAppointmentDate: "2024-12-04T16:00:00Z",
        purpose: "Consider intra-articular injection if conservative treatment inadequate",
        instructions: "Monitor pain levels and functional improvement",
        priority: "Medium"
      }
    ],
    finalRemarks: "Moderate osteoarthritis confirmed. Started comprehensive conservative management including NSAIDs, supplements, and physiotherapy. Patient counseled on weight management and exercise modifications.",
    doctorId: "doc_004",
    doctorName: "Dr. Lisa Williams",
    createdAt: "2024-11-04T17:00:00Z",
    updatedAt: "2024-11-04T17:00:00Z",
    status: "Follow-up Required"
  }
];

// Utility functions for EHR management
export const getEHRById = (id: string): EHRRecord | undefined => {
  return ehrRecords.find(record => record.id === id);
};

export const getEHRByRaphaId = (raphaId: string): EHRRecord | undefined => {
  return ehrRecords.find(record => record.raphaId === raphaId);
};

export const getEHRByPatientName = (patientName: string): EHRRecord[] => {
  return ehrRecords.filter(record => 
    record.patientFullName.toLowerCase().includes(patientName.toLowerCase())
  );
};

export const getEHRByStatus = (status: EHRRecord['status']): EHRRecord[] => {
  return ehrRecords.filter(record => record.status === status);
};

export const getRecentEHRRecords = (limit: number = 10): EHRRecord[] => {
  return ehrRecords
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const getUpcomingFollowUps = (): Array<{
  ehrId: string;
  patientName: string;
  followUpDate: string;
  purpose: string;
  priority: string;
}> => {
  const followUps: Array<{
    ehrId: string;
    patientName: string;
    followUpDate: string;
    purpose: string;
    priority: string;
  }> = [];

  ehrRecords.forEach(record => {
    record.followUpDetails.forEach(followUp => {
      const followUpDate = new Date(followUp.nextAppointmentDate);
      const now = new Date();
      
      if (followUpDate > now) {
        followUps.push({
          ehrId: record.id,
          patientName: record.patientFullName,
          followUpDate: followUp.nextAppointmentDate,
          purpose: followUp.purpose,
          priority: followUp.priority
        });
      }
    });
  });

  return followUps.sort((a, b) => 
    new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime()
  );
};

// Patient summary for quick overview
export const getPatientSummary = (ehrId: string) => {
  const record = getEHRById(ehrId);
  if (!record) return null;

  return {
    patientName: record.patientFullName,
    raphaId: record.raphaId,
    lastVisit: record.appointmentDateTime,
    currentIssue: record.healthIssue,
    status: record.status,
    vitalsSummary: {
      bloodPressure: `${record.patientBasicVitals.bloodPressure.systolic}/${record.patientBasicVitals.bloodPressure.diastolic}`,
      sugarLevel: record.patientBasicVitals.sugarReading,
      weight: record.patientBasicVitals.weight
    },
    medicationsCount: record.medicinesPrescription.length,
    followUpsCount: record.followUpDetails.length,
    doctorName: record.doctorName
  };
};