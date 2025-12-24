export interface Hospital {
  id: number;
  name: string;
  specialization: string;
  address: string;
  rating: number;
  image?: string;
  images?: any[]; // Array of 5 images from different categories
  description?: string;
  visitorsCount?: number;
}

export const hospitals: Hospital[] = [
  {
    id: 1,
    name: "Manipal Hospital Vijayawada",
    specialization: "Cardiology, Neurology",
    address: "Door No: 115-A, NH-5, Tadepalli, Vijayawada, Andhra Pradesh 520007",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H1.jpg'),
      require('../../assets/InteriorImages/I1.jpg'),
      require('../../assets/InteriorRoomsImages/IR1.jpeg'),
      require('../../assets/OperationTheatreImages/O1.webp'),
      require('../../assets/ParkingAreaImages/P1.jpg')
    ],
    description: "Leading healthcare provider with state-of-the-art facilities and experienced medical professionals.",
    visitorsCount: 12500
  },
  {
    id: 2,
    name: "Ramesh Hospitals",
    specialization: "Orthopedics, General Medicine",
    address: "Door No: 42-B, Governorpet, Vijayawada, Andhra Pradesh 520002",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H2.jpg'),
      require('../../assets/InteriorImages/I2.webp'),
      require('../../assets/InteriorRoomsImages/IR2.jpg'),
      require('../../assets/OperationTheatreImages/O2.jpg'),
      require('../../assets/ParkingAreaImages/P2.jpg')
    ],
    description: "Comprehensive healthcare services with focus on orthopedic care and general medicine.",
    visitorsCount: 8900
  },
  {
    id: 3,
    name: "Andhra Hospital",
    specialization: "Pediatrics, Gynecology",
    address: "Door No: 75-C, Suryaraopet, Vijayawada, Andhra Pradesh 520001",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H3.jpg'),
      require('../../assets/InteriorImages/I3.webp'),
      require('../../assets/InteriorRoomsImages/IR3.jpg'),
      require('../../assets/OperationTheatreImages/O3.jpg'),
      require('../../assets/ParkingAreaImages/P3.webp')
    ],
    description: "Specialized care for women and children with modern medical equipment.",
    visitorsCount: 11200
  },
  {
    id: 4,
    name: "Vijaya Hospital",
    specialization: "Emergency Care, Surgery",
    address: "Door No: 28-D, Benz Circle, Vijayawada, Andhra Pradesh 520003",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H4.jpeg'),
      require('../../assets/InteriorImages/I4.jpg'),
      require('../../assets/InteriorRoomsImages/IR4.jpg'),
      require('../../assets/OperationTheatreImages/O4.jpg'),
      require('../../assets/ParkingAreaImages/P4.jpg')
    ],
    description: "24/7 emergency services with expert surgical team and critical care units.",
    visitorsCount: 9800
  },
  {
    id: 5,
    name: "Apollo Hospitals Vijayawada",
    specialization: "Oncology, Cardiology",
    address: "Door No: 156-E, PWD Colony, Vijayawada, Andhra Pradesh 520010",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H5.jpg'),
      require('../../assets/InteriorImages/I5.jpg'),
      require('../../assets/InteriorRoomsImages/IR5.jpg'),
      require('../../assets/OperationTheatreImages/O5.jpg'),
      require('../../assets/ParkingAreaImages/P5.webp')
    ],
    description: "Premier cancer care and cardiac treatment center with international standards.",
    visitorsCount: 15600
  },
  {
    id: 6,
    name: "Krishna Institute of Medical Sciences (KIMS)",
    specialization: "Neurosurgery, Transplant",
    address: "Door No: 234-A, Minister Road, Secunderabad, Vijayawada, Andhra Pradesh 520009",
    rating: 4.7,
    image:  "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H6.jpg'),
      require('../../assets/InteriorImages/I6.jpg'),
      require('../../assets/InteriorRoomsImages/IR6.webp'),
      require('../../assets/OperationTheatreImages/O6.jpg'),
      require('../../assets/ParkingAreaImages/P6.jpg')
    ],
    description: "Advanced neurosurgical procedures and organ transplant services.",
    visitorsCount: 10400
  },
  {
    id: 7,
    name: "Medicover Hospitals Vijayawada",
    specialization: "Gastroenterology, Urology",
    address: "Door No: 89-B, Benz Circle, Vijayawada, Andhra Pradesh 520008",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H7.jpg'),
      require('../../assets/InteriorImages/I7.webp'),
      require('../../assets/InteriorRoomsImages/IR7.webp'),
      require('../../assets/OperationTheatreImages/O7.jpg'),
      require('../../assets/ParkingAreaImages/P7.jpg')
    ],
    description: "Specialized digestive and urological care with minimally invasive procedures.",
    visitorsCount: 7800
  },
  {
    id: 8,
    name: "Max Cure Hospitals",
    specialization: "Dermatology, Plastic Surgery",
    address: "Door No: 456-C, Madhuranagar, Vijayawada, Andhra Pradesh 520012",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H8.jpeg'),
      require('../../assets/InteriorImages/I8.webp'),
      require('../../assets/InteriorRoomsImages/IR8.jpg'),
      require('../../assets/OperationTheatreImages/O8.jpg'),
      require('../../assets/ParkingAreaImages/P8.jpeg')
    ],
    description: "Cosmetic and reconstructive surgery with dermatological expertise.",
    visitorsCount: 6700
  },
  {
    id: 9,
    name: "Government General Hospital Vijayawada",
    specialization: "Research, Multi-Specialty",
    address: "Door No: 567-D, Hospital Road, Vijayawada, Andhra Pradesh 520002",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H9.webp'),
      require('../../assets/InteriorImages/I9.jpg'),
      require('../../assets/InteriorRoomsImages/IR9.jpg'),
      require('../../assets/OperationTheatreImages/O9.webp'),
      require('../../assets/ParkingAreaImages/P9.jpg')
    ],
    description: "Premier medical institute with cutting-edge research and treatment facilities.",
    visitorsCount: 18500
  },
  {
    id: 10,
    name: "Sterling Hospital",
    specialization: "Robotic Surgery, ICU",
    address: "Door No: 678-E, Ring Road, Vijayawada, Andhra Pradesh 520004",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H10.jpg'),
      require('../../assets/InteriorImages/I10.jpg'),
      require('../../assets/InteriorRoomsImages/IR10.webp'),
      require('../../assets/OperationTheatreImages/O10.webp'),
      require('../../assets/ParkingAreaImages/P10.jpg')
    ],
    description: "State-of-the-art robotic surgical procedures and intensive care units.",
    visitorsCount: 14200
  },
  {
    id: 11,
    name: "Narayana Multispeciality Hospital",
    specialization: "Cardiac Surgery, Pediatrics",
    address: "Door No: 123-F, Kanuru, Vijayawada, Andhra Pradesh 520007",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H11.jpg'),
      require('../../assets/InteriorImages/I11.jpg'),
      require('../../assets/InteriorRoomsImages/IR11.jpg'),
      require('../../assets/OperationTheatreImages/O11.jpg'),
      require('../../assets/ParkingAreaImages/P11.jpg')
    ],
    description: "Affordable cardiac surgery and comprehensive pediatric care services.",
    visitorsCount: 13400
  },
  {
    id: 12,
    name: "Rainbow Children's Hospital Vijayawada",
    specialization: "Liver Transplant, Nephrology",
    address: "Door No: 234-G, Auto Nagar, Vijayawada, Andhra Pradesh 520006",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H12.jpg'),
      require('../../assets/InteriorImages/I12.webp'),
      require('../../assets/InteriorRoomsImages/IR12.webp'),
      require('../../assets/OperationTheatreImages/O12.jpg'),
      require('../../assets/ParkingAreaImages/P12.webp')
    ],
    description: "Leading liver transplant center with advanced kidney care facilities.",
    visitorsCount: 9600
  },
  {
    id: 13,
    name: "Andhra Hospitals",
    specialization: "Pediatric Care, NICU",
    address: "Door No: 345-H, Patamatalanka, Vijayawada, Andhra Pradesh 520011",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H13.webp'),
      require('../../assets/InteriorImages/I13.jpg'),
      require('../../assets/InteriorRoomsImages/IR13.jpeg'),
      require('../../assets/OperationTheatreImages/O13.jpg'),
      require('../../assets/ParkingAreaImages/P13.jpg')
    ],
    description: "Specialized pediatric care with advanced neonatal intensive care unit.",
    visitorsCount: 8300
  },
  {
    id: 14,
    name: "Sai Balaji Multi Specialty Hospital",
    specialization: "Liver Transplant, Gastroenterology",
    address: "Door No: 456-I, Gandhinagar, Vijayawada, Andhra Pradesh 520003",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H14.jpeg'),
      require('../../assets/InteriorImages/I14.jpeg'),
      require('../../assets/InteriorRoomsImages/IR14.jpg'),
      require('../../assets/OperationTheatreImages/O14.jpg'),
      require('../../assets/ParkingAreaImages/P14.jpeg')
    ],
    description: "Advanced liver transplant and gastroenterology services with expert care.",
    visitorsCount: 7500
  },
  {
    id: 15,
    name: "Continental Hospitals Vijayawada",
    specialization: "Emergency Care, Maternity",
    address: "Door No: 567-J, Labbipet, Vijayawada, Andhra Pradesh 520010",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H15.jpg'),
      require('../../assets/InteriorImages/I15.jpg'),
      require('../../assets/InteriorRoomsImages/IR15.jpg'),
      require('../../assets/OperationTheatreImages/O15.jpg'),
      require('../../assets/ParkingAreaImages/P15.jpg')
    ],
    description: "Comprehensive emergency services and specialized maternity care.",
    visitorsCount: 6900
  },
  {
    id: 16,
    name: "Bhavani Hospital",
    specialization: "General Medicine, Surgery",
    address: "Door No: 678-K, Eluru Road, Vijayawada, Andhra Pradesh 520001",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H16.jpeg'),
      require('../../assets/InteriorImages/I16.jpg'),
      require('../../assets/InteriorRoomsImages/IR16.jpg'),
      require('../../assets/OperationTheatreImages/O16.webp'),
      require('../../assets/ParkingAreaImages/P16.jpg')
    ],
    description: "Established hospital providing general medical and surgical services.",
    visitorsCount: 5800
  },
  {
    id: 17,
    name: "Care Hospital Vijayawada",
    specialization: "Cardiac Speciality, Interventional",
    address: "Door No: 789-L, Health City, Vijayawada, Andhra Pradesh 520014",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H17.webp'),
      require('../../assets/InteriorImages/I17.jpg'),
      require('../../assets/InteriorRoomsImages/IR17.jpg'),
      require('../../assets/OperationTheatreImages/O17.jpg'),
      require('../../assets/ParkingAreaImages/P17.jpg')
    ],
    description: "Premier cardiac care institute with interventional cardiology expertise.",
    visitorsCount: 12800
  },
  {
    id: 18,
    name: "VJ's Children's Hospital",
    specialization: "Cancer Care, Radiology",
    address: "Door No: 234-M, One Town, Vijayawada, Andhra Pradesh 520013",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H18.jpg'),
      require('../../assets/InteriorImages/I18.jpg'),
      require('../../assets/InteriorRoomsImages/IR18.jpg'),
      require('../../assets/OperationTheatreImages/O18.jpg'),
      require('../../assets/ParkingAreaImages/P18.webp')
    ],
    description: "Advanced cancer treatment and diagnostic radiology services.",
    visitorsCount: 8700
  },
  {
    id: 19,
    name: "Amaravathi Hospital",
    specialization: "Nephrology, Urology",
    address: "Door No: 345-N, Amaravathi Road, Vijayawada, Andhra Pradesh 520015",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H19.webp'),
      require('../../assets/InteriorImages/I19.jpg'),
      require('../../assets/InteriorRoomsImages/IR19.jpg'),
      require('../../assets/OperationTheatreImages/O19.avif'),
      require('../../assets/ParkingAreaImages/P19.webp')
    ],
    description: "Specialized kidney and urological care with dialysis facilities.",
    visitorsCount: 7200
  },
  {
    id: 20,
    name: "Lotus Hospital Vijayawada",
    specialization: "Oncology, Gastroenterology",
    address: "Door No: 456-O, Kanuru, Vijayawada, Andhra Pradesh 520016",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H12.jpg'),
      require('../../assets/InteriorImages/I12.webp'),
      require('../../assets/InteriorRoomsImages/IR12.webp'),
      require('../../assets/OperationTheatreImages/O12.jpg'),
      require('../../assets/ParkingAreaImages/P12.webp')
    ],
    description: "Comprehensive cancer care and advanced gastroenterology treatments.",
    visitorsCount: 11700
  },
  {
    id: 21,
    name: "Shanthi Multi Specialty Hospital",
    specialization: "Orthopedics, Traumatology",
    address: "Door No: 678-L, MVP Colony, Vijayawada, Andhra Pradesh 520005",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H21.jpeg'),
      require('../../assets/InteriorImages/I21.jpg'),
      require('../../assets/InteriorRoomsImages/IR21.jpg'),
      require('../../assets/OperationTheatreImages/O21.jpeg'),
      require('../../assets/ParkingAreaImages/P21.jpg')
    ],
    description: "Expert orthopedic and trauma care with rehabilitation facilities.",
    visitorsCount: 9400
  },
  {
    id: 22,
    name: "Sai Diagnostics Center Vijayawada",
    specialization: "Radiology, Pathology",
    address: "Door No: 789-M, Patamata, Vijayawada, Andhra Pradesh 520011",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H22.jpg'),
      require('../../assets/InteriorImages/I22.jpeg'),
      require('../../assets/InteriorRoomsImages/IR22.jpg'),
      require('../../assets/OperationTheatreImages/O22.jpg'),
      require('../../assets/ParkingAreaImages/P22.avif')
    ],
    description: "Advanced diagnostic imaging and laboratory services with expert radiologists.",
    visitorsCount: 6500
  },
  {
    id: 23,
    name: "Ashoka Multi Specialty",
    specialization: "Neurology, Orthopedics",
    address: "Door No: 234-N, Kaja Darwaja, Vijayawada, Andhra Pradesh 520003",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H23.jpg'),
      require('../../assets/InteriorImages/I23.jpg'),
      require('../../assets/InteriorRoomsImages/IR23.webp'),
      require('../../assets/OperationTheatreImages/O23.jpg'),
      require('../../assets/ParkingAreaImages/P23.jpg')
    ],
    description: "Specialized neurosurgery and orthopedic treatments with modern equipment.",
    visitorsCount: 7900
  },
  {
    id: 24,
    name: "Vaidya Wellness Center",
    specialization: "Ayurveda, Yoga Therapy",
    address: "Door No: 345-O, Suryapeta, Vijayawada, Andhra Pradesh 520008",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H24.jpg'),
      require('../../assets/InteriorImages/I24.webp'),
      require('../../assets/InteriorRoomsImages/IR24.jpg'),
      require('../../assets/OperationTheatreImages/O24.jpg'),
      require('../../assets/ParkingAreaImages/P24.jpg')
    ],
    description: "Traditional Ayurvedic treatments combined with modern wellness therapies.",
    visitorsCount: 5200
  },
  {
    id: 25,
    name: "Aarya Hospital Vijayawada",
    specialization: "Maternity, Gynecology",
    address: "Door No: 456-P, Chandralok, Vijayawada, Andhra Pradesh 520006",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H25.jpg'),
      require('../../assets/InteriorImages/I25.webp'),
      require('../../assets/InteriorRoomsImages/IR25.jpg'),
      require('../../assets/OperationTheatreImages/O25.webp'),
      require('../../assets/ParkingAreaImages/P25.webp')
    ],
    description: "Specialized women healthcare with state-of-the-art maternity facilities.",
    visitorsCount: 10200
  },
  {
    id: 26,
    name: "Precision Dental Care",
    specialization: "Dentistry, Orthodontics",
    address: "Door No: 567-Q, Near Rajiv Chowk, Vijayawada, Andhra Pradesh 520002",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H26.jpg'),
      require('../../assets/InteriorImages/I1.jpg'),
      require('../../assets/InteriorRoomsImages/IR26.jpg'),
      require('../../assets/OperationTheatreImages/O26.jpg'),
      require('../../assets/ParkingAreaImages/P26.jpg')
    ],
    description: "Advanced dental treatments with painless procedures and orthodontic care.",
    visitorsCount: 4800
  },
  {
    id: 27,
    name: "Med Care Hospital",
    specialization: "Internal Medicine, Pulmonology",
    address: "Door No: 678-R, Moghalrajpuram, Vijayawada, Andhra Pradesh 520012",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H27.jpg'),
      require('../../assets/InteriorImages/I7.webp'),
      require('../../assets/InteriorRoomsImages/IR27.avif'),
      require('../../assets/OperationTheatreImages/O7.jpg'),
      require('../../assets/ParkingAreaImages/P7.jpg')
    ],
    description: "Comprehensive internal medicine with respiratory and lung specialist care.",
    visitorsCount: 6800
  },
  {
    id: 28,
    name: "Vitality Wellness Clinic",
    specialization: "Homeopathy, Physiotherapy",
    address: "Door No: 789-S, Prakasam Nagar, Vijayawada, Andhra Pradesh 520009",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H28.jpg'),
      require('../../assets/InteriorImages/I8.webp'),
      require('../../assets/InteriorRoomsImages/IR28.jpg'),
      require('../../assets/OperationTheatreImages/O8.jpg'),
      require('../../assets/ParkingAreaImages/P8.jpeg')
    ],
    description: "Holistic healing through homeopathic and physiotherapeutic treatments.",
    visitorsCount: 4500
  },
  {
    id: 29,
    name: "Spark Eye Care Center",
    specialization: "Ophthalmology, Eye Surgery",
    address: "Door No: 234-T, Dowanpet, Vijayawada, Andhra Pradesh 520007",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H29.avif'),
      require('../../assets/InteriorImages/I9.jpg'),
      require('../../assets/InteriorRoomsImages/IR29.jpg'),
      require('../../assets/OperationTheatreImages/O9.webp'),
      require('../../assets/ParkingAreaImages/P9.jpg')
    ],
    description: "Comprehensive eye care with laser surgery and corrective procedures.",
    visitorsCount: 7100
  },
  {
    id: 30,
    name: "Herbal Healing Hospital",
    specialization: "Naturopathy, Unani",
    address: "Door No: 345-U, Gajuwaka, Vijayawada, Andhra Pradesh 520013",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H30.jpg'),
      require('../../assets/InteriorImages/I10.jpg'),
      require('../../assets/InteriorRoomsImages/IR30.jpeg'),
      require('../../assets/OperationTheatreImages/O10.webp'),
      require('../../assets/ParkingAreaImages/P10.jpg')
    ],
    description: "Alternative medicine with natural healing and herbal treatments.",
    visitorsCount: 5600
  },
  {
    id: 31,
    name: "Heart Plus Hospital",
    specialization: "Cardiology, Cardiac Surgery",
    address: "Door No: 456-V, Eenadu Junction, Vijayawada, Andhra Pradesh 520011",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H10.jpg'),
      require('../../assets/InteriorImages/I11.jpg'),
      require('../../assets/InteriorRoomsImages/IR11.jpg'),
      require('../../assets/OperationTheatreImages/O11.jpg'),
      require('../../assets/ParkingAreaImages/P11.jpg')
    ],
    description: "Expert cardiac care with minimally invasive surgical procedures.",
    visitorsCount: 13100
  },
  {
    id: 32,
    name: "Smile Dental Clinic",
    specialization: "Prosthodontics, Implants",
    address: "Door No: 567-W, Papi Hills, Vijayawada, Andhra Pradesh 520010",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H11.jpg'),
      require('../../assets/InteriorImages/I12.webp'),
      require('../../assets/InteriorRoomsImages/IR12.webp'),
      require('../../assets/OperationTheatreImages/O12.jpg'),
      require('../../assets/ParkingAreaImages/P12.webp')
    ],
    description: "Advanced dental implant and prosthetic solutions for beautiful smiles.",
    visitorsCount: 5300
  },
  {
    id: 33,
    name: "Brain & Spine Institute",
    specialization: "Neurosurgery, Spine Surgery",
    address: "Door No: 678-X, Arundelpet, Vijayawada, Andhra Pradesh 520014",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H12.jpg'),
      require('../../assets/InteriorImages/I13.jpg'),
      require('../../assets/InteriorRoomsImages/IR13.jpeg'),
      require('../../assets/OperationTheatreImages/O13.jpg'),
      require('../../assets/ParkingAreaImages/P13.jpg')
    ],
    description: "Specialized neurosurgery and spine care with advanced surgical techniques.",
    visitorsCount: 8900
  },
  {
    id: 34,
    name: "Skin & Hair Clinic",
    specialization: "Dermatology, Trichology",
    address: "Door No: 789-Y, Beside Stadium, Vijayawada, Andhra Pradesh 520004",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H13.webp'),
      require('../../assets/InteriorImages/I14.jpeg'),
      require('../../assets/InteriorRoomsImages/IR14.jpg'),
      require('../../assets/OperationTheatreImages/O14.jpg'),
      require('../../assets/ParkingAreaImages/P14.jpeg')
    ],
    description: "Comprehensive skin and hair treatments with cosmetic procedures.",
    visitorsCount: 6200
  },
  {
    id: 35,
    name: "Diabetes Care Center",
    specialization: "Endocrinology, Diabetes",
    address: "Door No: 234-Z, Muralipatnam, Vijayawada, Andhra Pradesh 520015",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H14.jpeg'),
      require('../../assets/InteriorImages/I15.jpg'),
      require('../../assets/InteriorRoomsImages/IR15.jpg'),
      require('../../assets/OperationTheatreImages/O15.jpg'),
      require('../../assets/ParkingAreaImages/P15.jpg')
    ],
    description: "Specialized diabetes management and endocrine disorder treatments.",
    visitorsCount: 7700
  },
  {
    id: 36,
    name: "Wellness Plus Medical Center",
    specialization: "Family Medicine, Prevention",
    address: "Door No: 345-AA, Vijaya Nagar, Vijayawada, Andhra Pradesh 520012",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H15.jpg'),
      require('../../assets/InteriorImages/I16.jpg'),
      require('../../assets/InteriorRoomsImages/IR16.jpg'),
      require('../../assets/OperationTheatreImages/O16.webp'),
      require('../../assets/ParkingAreaImages/P16.jpg')
    ],
    description: "Family healthcare with preventive medicine and wellness programs.",
    visitorsCount: 6300
  },
  {
    id: 37,
    name: "Joint Care Hospital",
    specialization: "Rheumatology, Joint Care",
    address: "Door No: 456-AB, Kala Nagar, Vijayawada, Andhra Pradesh 520003",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H16.jpeg'),
      require('../../assets/InteriorImages/I17.jpg'),
      require('../../assets/InteriorRoomsImages/IR17.jpg'),
      require('../../assets/OperationTheatreImages/O17.jpg'),
      require('../../assets/ParkingAreaImages/P17.jpg')
    ],
    description: "Rheumatology and joint health with targeted therapeutic treatments.",
    visitorsCount: 6800
  },
  {
    id: 38,
    name: "Comprehensive Health Labs",
    specialization: "Laboratory, Diagnostics",
    address: "Door No: 567-AC, Palm Beach Road, Vijayawada, Andhra Pradesh 520011",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H17.webp'),
      require('../../assets/InteriorImages/I18.jpg'),
      require('../../assets/InteriorRoomsImages/IR18.jpg'),
      require('../../assets/OperationTheatreImages/O18.jpg'),
      require('../../assets/ParkingAreaImages/P18.webp')
    ],
    description: "Full-service diagnostic laboratory with advanced testing capabilities.",
    visitorsCount: 5900
  },
  {
    id: 39,
    name: "ENT Specialty Clinic",
    specialization: "Otolaryngology, ENT Surgery",
    address: "Door No: 678-AD, Indira Nagar, Vijayawada, Andhra Pradesh 520009",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H18.jpg'),
      require('../../assets/InteriorImages/I19.jpg'),
      require('../../assets/InteriorRoomsImages/IR19.jpg'),
      require('../../assets/OperationTheatreImages/O19.avif'),
      require('../../assets/ParkingAreaImages/P19.webp')
    ],
    description: "Specialized ear, nose, and throat care with endoscopic procedures.",
    visitorsCount: 6500
  },
  {
    id: 40,
    name: "Acute Care Medical Hospital",
    specialization: "Emergency, Critical Care",
    address: "Door No: 789-AE, Opp LIC Office, Vijayawada, Andhra Pradesh 520001",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H41.jpg'),
      require('../../assets/InteriorImages/I1.jpg'),
      require('../../assets/InteriorRoomsImages/IR1.jpeg'),
      require('../../assets/OperationTheatreImages/O1.webp'),
      require('../../assets/ParkingAreaImages/P1.jpg')
    ],
    description: "24/7 emergency services with critical care and trauma management.",
    visitorsCount: 10500
  }
];