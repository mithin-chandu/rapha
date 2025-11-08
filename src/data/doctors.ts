export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  hospitalId: number;
  experience: string;
  timing: string;
  qualification?: string;
  consultationFee?: number;
  image?: string;
}

export const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Arjun Rao",
    specialization: "Cardiologist",
    hospitalId: 1,
    experience: "10 years",
    timing: "10:00 AM - 4:00 PM",
    qualification: "MBBS, MD Cardiology",
    consultationFee: 800,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Dr. Nisha Menon",
    specialization: "Neurologist",
    hospitalId: 1,
    experience: "8 years",
    timing: "12:00 PM - 6:00 PM",
    qualification: "MBBS, DM Neurology",
    consultationFee: 900,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Dr. Rajesh Kumar",
    specialization: "Orthopedic Surgeon",
    hospitalId: 2,
    experience: "12 years",
    timing: "9:00 AM - 3:00 PM",
    qualification: "MBBS, MS Orthopedics",
    consultationFee: 750,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "Dr. Priya Sharma",
    specialization: "General Physician",
    hospitalId: 2,
    experience: "6 years",
    timing: "11:00 AM - 5:00 PM",
    qualification: "MBBS, MD Internal Medicine",
    consultationFee: 600,
    image: "https://images.unsplash.com/photo-1594824919122-da89af8ca6fc?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 5,
    name: "Dr. Suresh Reddy",
    specialization: "Pediatrician",
    hospitalId: 3,
    experience: "15 years",
    timing: "8:00 AM - 2:00 PM",
    qualification: "MBBS, MD Pediatrics",
    consultationFee: 700,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 6,
    name: "Dr. Kavitha Iyer",
    specialization: "Gynecologist",
    hospitalId: 3,
    experience: "9 years",
    timing: "10:00 AM - 4:00 PM",
    qualification: "MBBS, MD Obstetrics & Gynecology",
    consultationFee: 850,
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 7,
    name: "Dr. Vikram Singh",
    specialization: "Emergency Medicine",
    hospitalId: 4,
    experience: "7 years",
    timing: "24/7 Available",
    qualification: "MBBS, MD Emergency Medicine",
    consultationFee: 1000,
    image: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 8,
    name: "Dr. Ravi Gupta",
    specialization: "General Surgeon",
    hospitalId: 4,
    experience: "11 years",
    timing: "2:00 PM - 8:00 PM",
    qualification: "MBBS, MS General Surgery",
    consultationFee: 900,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face"
  }
];