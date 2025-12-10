export interface Pharmacy {
  id: number;
  name: string;
  address: string;
  contact: string;
  rating: number;
  description?: string;
  license?: string;
  operatingHours?: string;
  image?: string;
}

export interface Medicine {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: number;
  description?: string;
  manufacturer?: string;
  expiryDate?: string;
  prescription?: boolean;
  dosage?: string;
  image?: string;
}

export const pharmacies: Pharmacy[] = [
  {
    id: 1,
    name: "Rapha Medicals",
    address: "Hyderabad, Telangana",
    contact: "9876543210",
    rating: 4.8,
    description: "Trusted pharmacy with a wide range of medicines and healthcare products.",
    license: "DL-HYD-2024-001",
    operatingHours: "8:00 AM - 10:00 PM",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 2,
    name: "CarePlus Pharmacy",
    address: "Chennai, Tamil Nadu",
    contact: "9123456789",
    rating: 4.6,
    description: "24/7 pharmacy service with home delivery and online ordering.",
    license: "DL-CHN-2024-002",
    operatingHours: "24 Hours",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 3,
    name: "WellCare Drugstore",
    address: "Bangalore, Karnataka",
    contact: "9998887776",
    rating: 4.7,
    description: "Modern pharmacy with expert pharmacists and quality medicines.",
    license: "DL-BLR-2024-003",
    operatingHours: "7:00 AM - 11:00 PM",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031133c?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 4,
    name: "HealthFirst Pharmacy",
    address: "Mumbai, Maharashtra",
    contact: "9876512345",
    rating: 4.5,
    description: "Community pharmacy focused on patient care and medication counseling.",
    license: "DL-MUM-2024-004",
    operatingHours: "8:00 AM - 9:00 PM",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=200&fit=crop&crop=center"
  }
];

// Specific medicine images for each medicine type
const getMedicineImage = (id: number, category: string): string => {
  const medicineImages: { [key: number]: string } = {
    1: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&h=200&fit=crop&crop=center", // Paracetamol tablets
    2: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&h=200&fit=crop&crop=center", // Amoxicillin capsules
    3: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=200&fit=crop&crop=center", // Cetirizine tablets
    4: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop&crop=center", // Omeprazole capsules
    5: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&h=200&fit=crop&crop=center", // Vitamin D3 tablets
    6: "https://images.unsplash.com/photo-1563213126-a4273aed2016?w=400&h=200&fit=crop&crop=center", // Metformin tablets
    7: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=200&fit=crop&crop=center", // Amlodipine tablets
    8: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=200&fit=crop&crop=center", // Ibuprofen tablets
    9: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&crop=center", // Loratadine tablets
    10: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&h=200&fit=crop&crop=center", // Atorvastatin tablets
    11: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=200&fit=crop&crop=center", // Aspirin tablets
    12: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&h=200&fit=crop&crop=center", // Losartan tablets
    13: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=200&fit=crop&crop=center", // Calcium tablets
    14: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=200&fit=crop&crop=center", // Azithromycin tablets
    15: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=200&fit=crop&crop=center", // Salbutamol inhaler
    16: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&h=200&fit=crop&crop=center", // Multivitamin tablets
    17: "https://images.unsplash.com/photo-1585435557343-3b092031133c?w=400&h=200&fit=crop&crop=center", // Diclofenac gel
    18: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&crop=center", // Insulin injection
    19: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&h=200&fit=crop&crop=center", // Probiotic capsules
    20: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&h=200&fit=crop&crop=center"  // Antihistamine syrup
  };
  
  return medicineImages[id] || "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&h=200&fit=crop&crop=center";
};

export const medicines: Medicine[] = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    price: "₹25",
    stock: 120,
    description: "Effective pain reliever and fever reducer",
    manufacturer: "Sun Pharma",
    expiryDate: "Dec 2026",
    prescription: false,
    dosage: "1-2 tablets every 6-8 hours",
    image: getMedicineImage(1, 'Pain Relief')
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    category: "Antibiotic",
    price: "₹40",
    stock: 80,
    description: "Broad-spectrum antibiotic for bacterial infections",
    manufacturer: "Cipla",
    expiryDate: "Mar 2026",
    prescription: true,
    dosage: "1 capsule 3 times daily",
    image: getMedicineImage(2, 'Antibiotic')
  },
  {
    id: 3,
    name: "Cetirizine 10mg",
    category: "Antihistamine",
    price: "₹15",
    stock: 200,
    description: "Antihistamine for allergy relief",
    manufacturer: "Dr. Reddy's",
    expiryDate: "Aug 2026",
    prescription: false,
    dosage: "1 tablet once daily",
    image: getMedicineImage(3, 'Antihistamine')
  },
  {
    id: 4,
    name: "Omeprazole 20mg",
    category: "Gastric",
    price: "₹35",
    stock: 95,
    description: "Proton pump inhibitor for acid reflux",
    manufacturer: "Lupin",
    expiryDate: "Jan 2027",
    prescription: true,
    dosage: "1 capsule before breakfast",
    image: getMedicineImage(1, 'Gastric')
  },
  {
    id: 5,
    name: "Vitamin D3 1000 IU",
    category: "Vitamins",
    price: "₹60",
    stock: 150,
    description: "Essential vitamin for bone health",
    manufacturer: "Abbott",
    expiryDate: "Oct 2026",
    prescription: false,
    dosage: "1 tablet daily with food",
    image: getMedicineImage(5, 'Vitamins')
  },
  {
    id: 6,
    name: "Metformin 500mg",
    category: "Diabetes",
    price: "₹30",
    stock: 75,
    description: "Diabetes medication to control blood sugar",
    manufacturer: "Glenmark",
    expiryDate: "Jun 2026",
    prescription: true,
    dosage: "1 tablet twice daily with meals",
    image: getMedicineImage(6, 'Diabetes')
  },
  {
    id: 7,
    name: "Amlodipine 5mg",
    category: "Hypertension",
    price: "₹45",
    stock: 110,
    description: "Calcium channel blocker for high blood pressure",
    manufacturer: "Torrent",
    expiryDate: "Sep 2026",
    prescription: true,
    dosage: "1 tablet once daily",
    image: getMedicineImage(7, 'Hypertension')
  },
  {
    id: 8,
    name: "Ibuprofen 400mg",
    category: "Pain Relief",
    price: "₹20",
    stock: 180,
    description: "Anti-inflammatory pain reliever",
    manufacturer: "Mankind",
    expiryDate: "May 2026",
    prescription: false,
    dosage: "1 tablet 3 times daily after meals",
    image: getMedicineImage(8, 'Pain Relief')
  },
  {
    id: 9,
    name: "Loratadine 10mg",
    category: "Antihistamine",
    price: "₹18",
    stock: 160,
    description: "Non-drowsy antihistamine for allergies",
    manufacturer: "Zydus",
    expiryDate: "Nov 2026",
    prescription: false,
    dosage: "1 tablet once daily",
    image: getMedicineImage(7, 'Antihistamine')
  },
  {
    id: 10,
    name: "Atorvastatin 20mg",
    category: "Cholesterol",
    price: "₹55",
    stock: 65,
    description: "Statin medication to lower cholesterol",
    manufacturer: "Ranbaxy",
    expiryDate: "Feb 2027",
    prescription: true,
    dosage: "1 tablet once daily at bedtime",
    image: getMedicineImage(10, 'Cholesterol')
  },
  {
    id: 11,
    name: "Aspirin 75mg",
    category: "Pain Relief",
    price: "₹12",
    stock: 220,
    description: "Low-dose aspirin for cardiovascular protection",
    manufacturer: "Bayer",
    expiryDate: "Jul 2026",
    prescription: false,
    dosage: "1 tablet once daily with food",
    image: getMedicineImage(11, 'Pain Relief')
  },
  {
    id: 12,
    name: "Losartan 50mg",
    category: "Hypertension",
    price: "₹38",
    stock: 85,
    description: "ARB medication for high blood pressure",
    manufacturer: "Teva",
    expiryDate: "Apr 2026",
    prescription: true,
    dosage: "1 tablet once daily",
    image: getMedicineImage(12, 'Hypertension')
  },
  {
    id: 13,
    name: "Calcium Carbonate 500mg",
    category: "Vitamins",
    price: "₹22",
    stock: 190,
    description: "Calcium supplement for bone health",
    manufacturer: "USV",
    expiryDate: "Dec 2026",
    prescription: false,
    dosage: "1-2 tablets daily with meals",
    image: getMedicineImage(2, 'Vitamins')
  },
  {
    id: 14,
    name: "Azithromycin 250mg",
    category: "Antibiotic",
    price: "₹65",
    stock: 45,
    description: "Macrolide antibiotic for respiratory infections",
    manufacturer: "Pfizer",
    expiryDate: "Jan 2026",
    prescription: true,
    dosage: "1 tablet once daily for 3 days",
    image: getMedicineImage(1, 'Antibiotic')
  },
  {
    id: 15,
    name: "Salbutamol Inhaler",
    category: "Respiratory",
    price: "₹120",
    stock: 60,
    description: "Bronchodilator for asthma and COPD",
    manufacturer: "GSK",
    expiryDate: "Sep 2026",
    prescription: true,
    dosage: "2 puffs as needed",
    image: getMedicineImage(15, 'Respiratory')
  },
  {
    id: 16,
    name: "Multivitamin Tablets",
    category: "Vitamins",
    price: "₹45",
    stock: 140,
    description: "Complete multivitamin and mineral supplement",
    manufacturer: "Centrum",
    expiryDate: "Nov 2026",
    prescription: false,
    dosage: "1 tablet daily with breakfast",
    image: getMedicineImage(16, 'Vitamins')
  },
  {
    id: 17,
    name: "Diclofenac Gel",
    category: "Pain Relief",
    price: "₹35",
    stock: 90,
    description: "Topical anti-inflammatory gel for joint pain",
    manufacturer: "Voltaren",
    expiryDate: "Aug 2026",
    prescription: false,
    dosage: "Apply 3-4 times daily to affected area",
    image: getMedicineImage(15, 'Pain Relief')
  },
  {
    id: 18,
    name: "Insulin Glargine",
    category: "Diabetes",
    price: "₹450",
    stock: 25,
    description: "Long-acting insulin for diabetes management",
    manufacturer: "Sanofi",
    expiryDate: "May 2026",
    prescription: true,
    dosage: "As prescribed by doctor",
    image: getMedicineImage(18, 'Diabetes')
  },
  {
    id: 19,
    name: "Probiotic Capsules",
    category: "Digestive",
    price: "₹280",
    stock: 70,
    description: "Probiotic supplement for digestive health",
    manufacturer: "Yakult",
    expiryDate: "Oct 2026",
    prescription: false,
    dosage: "1 capsule daily with water",
    image: getMedicineImage(19, 'Digestive')
  },
  {
    id: 20,
    name: "Antihistamine Syrup",
    category: "Antihistamine",
    price: "₹85",
    stock: 105,
    description: "Liquid antihistamine for children and adults",
    manufacturer: "Himalaya",
    expiryDate: "Mar 2027",
    prescription: false,
    dosage: "5-10ml twice daily or as directed",
    image: getMedicineImage(20, 'Antihistamine')
  },
  {
    id: 21,
    name: "Clopidogrel 75mg",
    category: "Cardiovascular",
    price: "₹48",
    stock: 95,
    description: "Antiplatelet medication to prevent blood clots",
    manufacturer: "Sun Pharma",
    expiryDate: "Jul 2026",
    prescription: true,
    dosage: "1 tablet once daily",
    image: getMedicineImage(1, 'Cardiovascular')
  },
  {
    id: 22,
    name: "Gabapentin 300mg",
    category: "Neuropathic Pain",
    price: "₹65",
    stock: 70,
    description: "Medication for nerve pain and seizures",
    manufacturer: "Cipla",
    expiryDate: "Dec 2026",
    prescription: true,
    dosage: "1 capsule 3 times daily",
    image: getMedicineImage(2, 'Neuropathic Pain')
  },
  {
    id: 23,
    name: "Ranitidine 150mg",
    category: "Gastric",
    price: "₹28",
    stock: 130,
    description: "H2 blocker for heartburn and ulcers",
    manufacturer: "Dr. Reddy's",
    expiryDate: "Sep 2026",
    prescription: false,
    dosage: "1 tablet twice daily",
    image: getMedicineImage(3, 'Gastric')
  },
  {
    id: 24,
    name: "Levothyroxine 100mcg",
    category: "Thyroid",
    price: "₹42",
    stock: 88,
    description: "Thyroid hormone replacement medication",
    manufacturer: "Abbott",
    expiryDate: "Nov 2026",
    prescription: true,
    dosage: "1 tablet once daily before breakfast",
    image: getMedicineImage(5, 'Thyroid')
  },
  {
    id: 25,
    name: "Montelukast 10mg",
    category: "Respiratory",
    price: "₹52",
    stock: 115,
    description: "Leukotriene receptor antagonist for asthma",
    manufacturer: "Lupin",
    expiryDate: "Aug 2026",
    prescription: true,
    dosage: "1 tablet once daily at bedtime",
    image: getMedicineImage(15, 'Respiratory')
  },
  {
    id: 26,
    name: "Pantoprazole 40mg",
    category: "Gastric",
    price: "₹38",
    stock: 102,
    description: "Proton pump inhibitor for gastric ulcers",
    manufacturer: "Torrent",
    expiryDate: "Jun 2027",
    prescription: true,
    dosage: "1 tablet once daily before meals",
    image: getMedicineImage(1, 'Gastric')
  }
];