export interface Diagnostic {
  id: number;
  name: string;
  specialization: string;
  address: string;
  rating: number;
  contact?: string;
  description?: string;
  image?: string;
}

export interface DiagnosticTest {
  id: number;
  name: string;
  category: string;
  price: string;
  duration: string;
  description: string;
  requirements?: string;
  image?: string;
}

export const diagnostics: Diagnostic[] = [
  {
    id: 1,
    name: "Rapha Diagnostics",
    specialization: "Radiology, Pathology",
    address: "Hyderabad, Telangana",
    rating: 4.7,
    contact: "9876543210",
    description: "Advanced diagnostic center with state-of-the-art equipment for accurate medical testing and imaging services.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 2,
    name: "Grace Labs",
    specialization: "Blood Tests, Scans",
    address: "Chennai, Tamil Nadu",
    rating: 4.5,
    contact: "9123456789",
    description: "Comprehensive laboratory services with quick turnaround times and precise test results.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 3,
    name: "Hope Diagnostic Center",
    specialization: "Cardiology, Neurology Tests",
    address: "Bangalore, Karnataka",
    rating: 4.8,
    contact: "9998887776",
    description: "Specialized in cardiac and neurological diagnostic procedures with expert technicians.",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 4,
    name: "Mercy Medical Labs",
    specialization: "General Pathology, Microbiology",
    address: "Mumbai, Maharashtra",
    rating: 4.6,
    contact: "9876512345",
    description: "Full-service laboratory with expertise in pathology and microbiological testing.",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=200&fit=crop&crop=center"
  }
];

export const diagnosticTests: DiagnosticTest[] = [
  {
    id: 1,
    name: "Complete Blood Count (CBC)",
    category: "Pathology",
    price: "₹400",
    duration: "30 mins",
    description: "Comprehensive blood analysis to check for various disorders",
    requirements: "12-hour fasting required",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 2,
    name: "Chest X-Ray",
    category: "Radiology",
    price: "₹800",
    duration: "15 mins",
    description: "Imaging test to examine chest, lungs, and heart",
    requirements: "Remove metal objects",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 3,
    name: "ECG (Electrocardiogram)",
    category: "Cardiology",
    price: "₹600",
    duration: "20 mins",
    description: "Test to check heart rhythm and electrical activity",
    requirements: "No special preparation needed",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 4,
    name: "Lipid Profile",
    category: "Pathology",
    price: "₹900",
    duration: "45 mins",
    description: "Blood test to check cholesterol and triglyceride levels",
    requirements: "12-hour fasting required",
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 5,
    name: "Ultrasound Abdomen",
    category: "Radiology",
    price: "₹1200",
    duration: "30 mins",
    description: "Imaging test to examine abdominal organs",
    requirements: "8-hour fasting, full bladder",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 6,
    name: "Thyroid Function Test",
    category: "Pathology",
    price: "₹700",
    duration: "30 mins",
    description: "Blood test to check thyroid hormone levels",
    requirements: "No special preparation needed",
    image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 7,
    name: "MRI Scan",
    category: "Radiology",
    price: "₹5000",
    duration: "60 mins",
    description: "Detailed imaging using magnetic resonance",
    requirements: "Remove all metal objects, inform about implants",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 8,
    name: "Blood Sugar (Fasting)",
    category: "Pathology",
    price: "₹300",
    duration: "15 mins",
    description: "Test to check blood glucose levels",
    requirements: "12-hour fasting required",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 9,
    name: "CT Scan Brain",
    category: "Radiology",
    price: "₹3500",
    duration: "45 mins",
    description: "Detailed brain imaging using computed tomography",
    requirements: "Remove metal objects, contrast may be used",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 10,
    name: "Liver Function Test",
    category: "Pathology",
    price: "₹800",
    duration: "30 mins",
    description: "Blood test to check liver health and function",
    requirements: "12-hour fasting recommended",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 11,
    name: "Kidney Function Test",
    category: "Pathology",
    price: "₹650",
    duration: "30 mins",
    description: "Blood and urine tests to assess kidney function",
    requirements: "No special preparation needed",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 12,
    name: "Bone Density Scan",
    category: "Radiology",
    price: "₹2200",
    duration: "30 mins",
    description: "DEXA scan to measure bone mineral density",
    requirements: "Avoid calcium supplements 24 hours before",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 13,
    name: "Echocardiogram",
    category: "Cardiology",
    price: "₹2500",
    duration: "45 mins",
    description: "Ultrasound of the heart to check structure and function",
    requirements: "No special preparation needed",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 14,
    name: "HbA1c Test",
    category: "Pathology",
    price: "₹500",
    duration: "20 mins",
    description: "Blood test for 3-month average blood sugar levels",
    requirements: "No fasting required",
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 15,
    name: "Mammography",
    category: "Radiology",
    price: "₹1800",
    duration: "30 mins",
    description: "X-ray examination of the breast",
    requirements: "Schedule after menstrual period",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 16,
    name: "Stress Test",
    category: "Cardiology",
    price: "₹3000",
    duration: "90 mins",
    description: "Exercise stress test to evaluate heart function",
    requirements: "Wear comfortable clothing and shoes",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 17,
    name: "Colonoscopy",
    category: "Gastroenterology",
    price: "₹4500",
    duration: "60 mins",
    description: "Examination of the large intestine using a flexible tube",
    requirements: "Bowel preparation required 24 hours before",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 18,
    name: "PSA Test",
    category: "Pathology",
    price: "₹600",
    duration: "20 mins",
    description: "Prostate-specific antigen test for prostate health",
    requirements: "No ejaculation 48 hours before test",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 19,
    name: "Vitamin B12 Test",
    category: "Pathology",
    price: "₹450",
    duration: "25 mins",
    description: "Blood test to check vitamin B12 levels",
    requirements: "No special preparation needed",
    image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 20,
    name: "Pulmonary Function Test",
    category: "Respiratory",
    price: "₹1500",
    duration: "45 mins",
    description: "Tests to measure lung capacity and function",
    requirements: "Avoid bronchodilators before test",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=200&fit=crop&crop=center"
  }
];