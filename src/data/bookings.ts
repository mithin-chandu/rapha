export interface Booking {
  id: number;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorId: number;
  doctorName: string;
  hospitalId: number;
  hospitalName: string;
  date: string;
  time: string;
  symptoms: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed';
  bookedAt: string;
}

export const initialBookings: Booking[] = [
  {
    id: 1,
    patientName: "Mithin Chandu",
    patientAge: 28,
    patientGender: "Male",
    doctorId: 1,
    doctorName: "Dr. Arjun Rao",
    hospitalId: 1,
    hospitalName: "Rapha Multi-Speciality Hospital",
    date: "2025-11-05",
    time: "10:30 AM",
    symptoms: "Chest pain and breathing difficulty",
    status: "Pending",
    bookedAt: "2025-10-31T10:00:00Z"
  },
  {
    id: 2,
    patientName: "Priya Reddy",
    patientAge: 32,
    patientGender: "Female",
    doctorId: 2,
    doctorName: "Dr. Nisha Menon",
    hospitalId: 1,
    hospitalName: "Rapha Multi-Speciality Hospital",
    date: "2025-11-06",
    time: "2:00 PM",
    symptoms: "Frequent headaches and dizziness",
    status: "Accepted",
    bookedAt: "2025-10-30T14:30:00Z"
  },
  {
    id: 3,
    patientName: "Arun Kumar",
    patientAge: 45,
    patientGender: "Male",
    doctorId: 3,
    doctorName: "Dr. Rajesh Kumar",
    hospitalId: 2,
    hospitalName: "Grace Health Care",
    date: "2025-11-04",
    time: "11:00 AM",
    symptoms: "Lower back pain",
    status: "Completed",
    bookedAt: "2025-10-29T09:15:00Z"
  },
  {
    id: 4,
    patientName: "Lakshmi Devi",
    patientAge: 38,
    patientGender: "Female",
    doctorId: 4,
    doctorName: "Dr. Priya Sharma",
    hospitalId: 2,
    hospitalName: "Grace Health Care",
    date: "2025-11-07",
    time: "3:30 PM",
    symptoms: "Fever and body ache",
    status: "Pending",
    bookedAt: "2025-10-31T08:45:00Z"
  }
];