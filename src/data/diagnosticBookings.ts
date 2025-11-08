export interface DiagnosticBooking {
  id: number;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientPhone: string;
  testName: string;
  testId: number;
  diagnosticId: number;
  diagnosticName: string;
  date: string;
  time: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed' | 'Sample Collected' | 'Results Ready';
  price: string;
  bookedAt: string;
  notes?: string;
  results?: string;
  reportUrl?: string;
}

export const initialDiagnosticBookings: DiagnosticBooking[] = [
  {
    id: 1,
    patientName: "Mithin Kumar",
    patientAge: 28,
    patientGender: "Male",
    patientPhone: "9876543210",
    testName: "Complete Blood Count (CBC)",
    testId: 1,
    diagnosticId: 1,
    diagnosticName: "Rapha Diagnostics",
    date: "2025-11-02",
    time: "10:00 AM",
    status: "Pending",
    price: "₹400",
    bookedAt: "2025-10-30T14:30:00Z",
    notes: "Patient has been feeling weak lately"
  },
  {
    id: 2,
    patientName: "Rahul Sharma",
    patientAge: 35,
    patientGender: "Male",
    patientPhone: "9123456789",
    testName: "Chest X-Ray",
    testId: 2,
    diagnosticId: 1,
    diagnosticName: "Rapha Diagnostics",
    date: "2025-11-01",
    time: "2:00 PM",
    status: "Accepted",
    price: "₹800",
    bookedAt: "2025-10-29T16:45:00Z",
    notes: "Persistent cough for 2 weeks"
  },
  {
    id: 3,
    patientName: "Priya Patel",
    patientAge: 29,
    patientGender: "Female",
    patientPhone: "9998887776",
    testName: "Lipid Profile",
    testId: 4,
    diagnosticId: 2,
    diagnosticName: "Grace Labs",
    date: "2025-10-31",
    time: "9:00 AM",
    status: "Sample Collected",
    price: "₹900",
    bookedAt: "2025-10-28T10:20:00Z",
    notes: "Family history of heart disease"
  },
  {
    id: 4,
    patientName: "Anita Singh",
    patientAge: 42,
    patientGender: "Female",
    patientPhone: "9876512345",
    testName: "Thyroid Function Test",
    testId: 6,
    diagnosticId: 1,
    diagnosticName: "Rapha Diagnostics",
    date: "2025-10-30",
    time: "11:30 AM",
    status: "Completed",
    price: "₹700",
    bookedAt: "2025-10-27T09:15:00Z",
    notes: "Symptoms of hypothyroidism",
    results: "TSH: 8.5 mIU/L (Elevated), T3: 2.1 ng/dL (Normal), T4: 6.8 μg/dL (Low)"
  },
  {
    id: 5,
    patientName: "David Wilson",
    patientAge: 55,
    patientGender: "Male",
    patientPhone: "9111222333",
    testName: "ECG (Electrocardiogram)",
    testId: 3,
    diagnosticId: 3,
    diagnosticName: "Hope Diagnostic Center",
    date: "2025-11-03",
    time: "3:30 PM",
    status: "Pending",
    price: "₹600",
    bookedAt: "2025-10-31T11:00:00Z",
    notes: "Chest pain and irregular heartbeat"
  },
  {
    id: 6,
    patientName: "Sarah Johnson",
    patientAge: 33,
    patientGender: "Female",
    patientPhone: "9444555666",
    testName: "Ultrasound Abdomen",
    testId: 5,
    diagnosticId: 2,
    diagnosticName: "Grace Labs",
    date: "2025-11-01",
    time: "4:00 PM",
    status: "Results Ready",
    price: "₹1200",
    bookedAt: "2025-10-29T13:45:00Z",
    notes: "Abdominal pain and bloating",
    results: "Normal liver, spleen, and kidneys. No abnormalities detected."
  },
  {
    id: 7,
    patientName: "Ravi Krishnan",
    patientAge: 60,
    patientGender: "Male",
    patientPhone: "9777888999",
    testName: "Blood Sugar (Fasting)",
    testId: 8,
    diagnosticId: 4,
    diagnosticName: "Mercy Medical Labs",
    date: "2025-11-02",
    time: "8:00 AM",
    status: "Accepted",
    price: "₹300",
    bookedAt: "2025-10-30T17:30:00Z",
    notes: "Diabetes screening - family history"
  },
  {
    id: 8,
    patientName: "Lisa Chen",
    patientAge: 26,
    patientGender: "Female",
    patientPhone: "9555666777",
    testName: "MRI Scan",
    testId: 7,
    diagnosticId: 3,
    diagnosticName: "Hope Diagnostic Center",
    date: "2025-11-04",
    time: "11:00 AM",
    status: "Pending",
    price: "₹5000",
    bookedAt: "2025-10-31T08:20:00Z",
    notes: "Suspected herniated disc - lower back pain"
  }
];

export const diagnosticBookings = [...initialDiagnosticBookings];