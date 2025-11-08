export interface PharmacyOrder {
  id: number;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientPhone: string;
  patientAddress: string;
  items: OrderItem[];
  totalAmount: string;
  pharmacyId: number;
  pharmacyName: string;
  status: 'Pending' | 'Accepted' | 'Preparing' | 'Ready for Pickup' | 'Delivered' | 'Cancelled';
  orderDate: string;
  orderTime: string;
  deliveryType: 'Pickup' | 'Home Delivery';
  prescriptionUrl?: string;
  notes?: string;
  estimatedDelivery?: string;
  orderedAt: string;
}

export interface OrderItem {
  medicineId: number;
  medicineName: string;
  quantity: number;
  price: string;
  subtotal: string;
  category: string;
}

export const initialPharmacyOrders: PharmacyOrder[] = [
  {
    id: 1,
    patientName: "Mithin Kumar",
    patientAge: 28,
    patientGender: "Male",
    patientPhone: "9876543210",
    patientAddress: "123 MG Road, Hyderabad",
    items: [
      {
        medicineId: 1,
        medicineName: "Paracetamol 500mg",
        quantity: 2,
        price: "₹25",
        subtotal: "₹50",
        category: "Pain Relief"
      }
    ],
    totalAmount: "₹50",
    pharmacyId: 1,
    pharmacyName: "Rapha Medicals",
    status: "Pending",
    orderDate: "2025-11-01",
    orderTime: "2:30 PM",
    deliveryType: "Home Delivery",
    notes: "Please deliver after 6 PM",
    estimatedDelivery: "2025-11-01 8:00 PM",
    orderedAt: "2025-11-01T14:30:00Z"
  },
  {
    id: 2,
    patientName: "John Smith",
    patientAge: 45,
    patientGender: "Male",
    patientPhone: "9123456789",
    patientAddress: "456 Park Street, Chennai",
    items: [
      {
        medicineId: 2,
        medicineName: "Amoxicillin 250mg",
        quantity: 1,
        price: "₹40",
        subtotal: "₹40",
        category: "Antibiotic"
      }
    ],
    totalAmount: "₹40",
    pharmacyId: 2,
    pharmacyName: "CarePlus Pharmacy",
    status: "Accepted",
    orderDate: "2025-10-31",
    orderTime: "11:15 AM",
    deliveryType: "Pickup",
    prescriptionUrl: "https://example.com/prescription1.pdf",
    notes: "Prescription medicine - verified",
    orderedAt: "2025-10-31T11:15:00Z"
  },
  {
    id: 3,
    patientName: "Priya Patel",
    patientAge: 32,
    patientGender: "Female",
    patientPhone: "9998887776",
    patientAddress: "789 Brigade Road, Bangalore",
    items: [
      {
        medicineId: 3,
        medicineName: "Cetirizine 10mg",
        quantity: 1,
        price: "₹15",
        subtotal: "₹15",
        category: "Antihistamine"
      },
      {
        medicineId: 5,
        medicineName: "Vitamin D3 1000 IU",
        quantity: 1,
        price: "₹60",
        subtotal: "₹60",
        category: "Vitamins"
      }
    ],
    totalAmount: "₹75",
    pharmacyId: 3,
    pharmacyName: "WellCare Drugstore",
    status: "Preparing",
    orderDate: "2025-11-01",
    orderTime: "9:45 AM",
    deliveryType: "Pickup",
    notes: "Allergy medication needed urgently",
    orderedAt: "2025-11-01T09:45:00Z"
  },
  {
    id: 4,
    patientName: "Rajesh Kumar",
    patientAge: 55,
    patientGender: "Male",
    patientPhone: "9876512345",
    patientAddress: "321 Marine Drive, Mumbai",
    items: [
      {
        medicineId: 6,
        medicineName: "Metformin 500mg",
        quantity: 2,
        price: "₹30",
        subtotal: "₹60",
        category: "Diabetes"
      },
      {
        medicineId: 7,
        medicineName: "Amlodipine 5mg",
        quantity: 1,
        price: "₹45",
        subtotal: "₹45",
        category: "Hypertension"
      }
    ],
    totalAmount: "₹105",
    pharmacyId: 4,
    pharmacyName: "HealthFirst Pharmacy",
    status: "Ready for Pickup",
    orderDate: "2025-10-30",
    orderTime: "4:20 PM",
    deliveryType: "Pickup",
    prescriptionUrl: "https://example.com/prescription2.pdf",
    notes: "Regular monthly medication refill",
    orderedAt: "2025-10-30T16:20:00Z"
  },
  {
    id: 5,
    patientName: "Anita Singh",
    patientAge: 38,
    patientGender: "Female",
    patientPhone: "9111222333",
    patientAddress: "654 Sector 15, Gurgaon",
    items: [
      {
        medicineId: 4,
        medicineName: "Omeprazole 20mg",
        quantity: 1,
        price: "₹35",
        subtotal: "₹35",
        category: "Gastric"
      }
    ],
    totalAmount: "₹35",
    pharmacyId: 1,
    pharmacyName: "Rapha Medicals",
    status: "Delivered",
    orderDate: "2025-10-29",
    orderTime: "1:10 PM",
    deliveryType: "Home Delivery",
    prescriptionUrl: "https://example.com/prescription3.pdf",
    notes: "Delivered successfully",
    estimatedDelivery: "2025-10-29 6:00 PM",
    orderedAt: "2025-10-29T13:10:00Z"
  },
  {
    id: 6,
    patientName: "David Wilson",
    patientAge: 42,
    patientGender: "Male",
    patientPhone: "9444555666",
    patientAddress: "987 Civil Lines, Delhi",
    items: [
      {
        medicineId: 8,
        medicineName: "Ibuprofen 400mg",
        quantity: 1,
        price: "₹20",
        subtotal: "₹20",
        category: "Pain Relief"
      },
      {
        medicineId: 9,
        medicineName: "Loratadine 10mg",
        quantity: 1,
        price: "₹18",
        subtotal: "₹18",
        category: "Antihistamine"
      }
    ],
    totalAmount: "₹38",
    pharmacyId: 2,
    pharmacyName: "CarePlus Pharmacy",
    status: "Accepted",
    orderDate: "2025-11-01",
    orderTime: "3:45 PM",
    deliveryType: "Home Delivery",
    notes: "Please call before delivery",
    estimatedDelivery: "2025-11-01 7:00 PM",
    orderedAt: "2025-11-01T15:45:00Z"
  },
  {
    id: 7,
    patientName: "Sarah Johnson",
    patientAge: 29,
    patientGender: "Female",
    patientPhone: "9777888999",
    patientAddress: "246 Lake View, Pune",
    items: [
      {
        medicineId: 10,
        medicineName: "Atorvastatin 20mg",
        quantity: 1,
        price: "₹55",
        subtotal: "₹55",
        category: "Cholesterol"
      }
    ],
    totalAmount: "₹55",
    pharmacyId: 3,
    pharmacyName: "WellCare Drugstore",
    status: "Pending",
    orderDate: "2025-11-01",
    orderTime: "5:30 PM",
    deliveryType: "Pickup",
    prescriptionUrl: "https://example.com/prescription4.pdf",
    notes: "Cholesterol medication - prescription required",
    orderedAt: "2025-11-01T17:30:00Z"
  },
  {
    id: 8,
    patientName: "Ravi Krishnan",
    patientAge: 50,
    patientGender: "Male",
    patientPhone: "9555666777",
    patientAddress: "135 Anna Salai, Chennai",
    items: [
      {
        medicineId: 1,
        medicineName: "Paracetamol 500mg",
        quantity: 3,
        price: "₹25",
        subtotal: "₹75",
        category: "Pain Relief"
      },
      {
        medicineId: 3,
        medicineName: "Cetirizine 10mg",
        quantity: 2,
        price: "₹15",
        subtotal: "₹30",
        category: "Antihistamine"
      }
    ],
    totalAmount: "₹105",
    pharmacyId: 2,
    pharmacyName: "CarePlus Pharmacy",
    status: "Delivered",
    orderDate: "2025-10-28",
    orderTime: "12:00 PM",
    deliveryType: "Home Delivery",
    notes: "Family pack order - delivered on time",
    estimatedDelivery: "2025-10-28 5:00 PM",
    orderedAt: "2025-10-28T12:00:00Z"
  }
];

export const pharmacyOrders = [...initialPharmacyOrders];