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
    address: "NH-5, Tadepalli, Vijayawada, Andhra Pradesh",
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
    address: "Governorpet, Vijayawada, Andhra Pradesh",
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
    address: "Suryaraopet, Vijayawada, Andhra Pradesh",
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
    address: "Benz Circle, Vijayawada, Andhra Pradesh",
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
    address: "PWD Colony, Vijayawada, Andhra Pradesh",
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
    address: "Minister Road, Secunderabad, Vijayawada, Andhra Pradesh",
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
    address: "Benz Circle, Vijayawada, Andhra Pradesh",
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
    address: "Madhuranagar, Vijayawada, Andhra Pradesh",
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
    address: "Hospital Road, Vijayawada, Andhra Pradesh",
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
    address: "Ring Road, Vijayawada, Andhra Pradesh",
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
    address: "Kanuru, Vijayawada, Andhra Pradesh",
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
    address: "Auto Nagar, Vijayawada, Andhra Pradesh",
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
    address: "Patamatalanka, Vijayawada, Andhra Pradesh",
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
    address: "Gandhinagar, Vijayawada, Andhra Pradesh",
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
    address: "Labbipet, Vijayawada, Andhra Pradesh",
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
    address: "Eluru Road, Vijayawada, Andhra Pradesh",
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
    address: "Health City, Vijayawada, Andhra Pradesh",
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
    address: "One Town, Vijayawada, Andhra Pradesh",
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
    address: "Amaravathi Road, Vijayawada, Andhra Pradesh",
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
    address: "Kanuru, Vijayawada, Andhra Pradesh",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H19.webp'),
      require('../../assets/InteriorImages/I19.jpg'),
      require('../../assets/InteriorRoomsImages/IR19.jpg'),
      require('../../assets/OperationTheatreImages/O19.avif'),
      require('../../assets/ParkingAreaImages/P19.webp')
    ],
    description: "Comprehensive cancer care and advanced gastroenterology treatments.",
    visitorsCount: 11700
  },
  {
    id: 21,
    name: "Shanthi Multi Specialty Hospital",
    specialization: "Orthopedics, Traumatology",
    address: "MVP Colony, Vijayawada, Andhra Pradesh",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H20.jpg'),
      require('../../assets/InteriorImages/I1.jpg'),
      require('../../assets/InteriorRoomsImages/IR1.jpeg'),
      require('../../assets/OperationTheatreImages/O1.webp'),
      require('../../assets/ParkingAreaImages/P1.jpg')
    ],
    description: "Expert orthopedic and trauma care with rehabilitation facilities.",
    visitorsCount: 9400
  },
  {
    id: 22,
    name: "Sai Diagnostics Center Vijayawada",
    specialization: "Radiology, Pathology",
    address: "Patamata, Vijayawada, Andhra Pradesh",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H1.jpg'),
      require('../../assets/InteriorImages/I2.webp'),
      require('../../assets/InteriorRoomsImages/IR2.jpg'),
      require('../../assets/OperationTheatreImages/O2.jpg'),
      require('../../assets/ParkingAreaImages/P2.jpg')
    ],
    description: "Advanced diagnostic imaging and laboratory services with expert radiologists.",
    visitorsCount: 6500
  },
  {
    id: 23,
    name: "Ashoka Multi Specialty",
    specialization: "Neurology, Orthopedics",
    address: "Kaja Darwaja, Vijayawada, Andhra Pradesh",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H2.jpg'),
      require('../../assets/InteriorImages/I3.webp'),
      require('../../assets/InteriorRoomsImages/IR3.jpg'),
      require('../../assets/OperationTheatreImages/O3.jpg'),
      require('../../assets/ParkingAreaImages/P3.webp')
    ],
    description: "Specialized neurosurgery and orthopedic treatments with modern equipment.",
    visitorsCount: 7900
  },
  {
    id: 24,
    name: "Vaidya Wellness Center",
    specialization: "Ayurveda, Yoga Therapy",
    address: "Suryapeta, Vijayawada, Andhra Pradesh",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H3.jpg'),
      require('../../assets/InteriorImages/I4.jpg'),
      require('../../assets/InteriorRoomsImages/IR4.jpg'),
      require('../../assets/OperationTheatreImages/O4.jpg'),
      require('../../assets/ParkingAreaImages/P4.jpg')
    ],
    description: "Traditional Ayurvedic treatments combined with modern wellness therapies.",
    visitorsCount: 5200
  },
  {
    id: 25,
    name: "Aarya Hospital Vijayawada",
    specialization: "Maternity, Gynecology",
    address: "Chandralok, Vijayawada, Andhra Pradesh",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H4.jpeg'),
      require('../../assets/InteriorImages/I5.jpg'),
      require('../../assets/InteriorRoomsImages/IR5.jpg'),
      require('../../assets/OperationTheatreImages/O5.jpg'),
      require('../../assets/ParkingAreaImages/P5.webp')
    ],
    description: "Specialized women healthcare with state-of-the-art maternity facilities.",
    visitorsCount: 10200
  },
  {
    id: 26,
    name: "Precision Dental Care",
    specialization: "Dentistry, Orthodontics",
    address: "Near Rajiv Chowk, Vijayawada, Andhra Pradesh",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H5.jpg'),
      require('../../assets/InteriorImages/I6.jpg'),
      require('../../assets/InteriorRoomsImages/IR6.webp'),
      require('../../assets/OperationTheatreImages/O6.jpg'),
      require('../../assets/ParkingAreaImages/P6.jpg')
    ],
    description: "Advanced dental treatments with painless procedures and orthodontic care.",
    visitorsCount: 4800
  },
  {
    id: 27,
    name: "Med Care Hospital",
    specialization: "Internal Medicine, Pulmonology",
    address: "Moghalrajpuram, Vijayawada, Andhra Pradesh",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H6.jpg'),
      require('../../assets/InteriorImages/I7.webp'),
      require('../../assets/InteriorRoomsImages/IR7.webp'),
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
    address: "Prakasam Nagar, Vijayawada, Andhra Pradesh",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H7.jpg'),
      require('../../assets/InteriorImages/I8.webp'),
      require('../../assets/InteriorRoomsImages/IR8.jpg'),
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
    address: "Dowanpet, Vijayawada, Andhra Pradesh",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H8.jpeg'),
      require('../../assets/InteriorImages/I9.jpg'),
      require('../../assets/InteriorRoomsImages/IR9.jpg'),
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
    address: "Gajuwaka, Vijayawada, Andhra Pradesh",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H9.webp'),
      require('../../assets/InteriorImages/I10.jpg'),
      require('../../assets/InteriorRoomsImages/IR10.webp'),
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
    address: "Eenadu Junction, Vijayawada, Andhra Pradesh",
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
    address: "Papi Hills, Vijayawada, Andhra Pradesh",
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
    address: "Arundelpet, Vijayawada, Andhra Pradesh",
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
    address: "Beside Stadium, Vijayawada, Andhra Pradesh",
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
    address: "Muralipatnam, Vijayawada, Andhra Pradesh",
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
    address: "Vijaya Nagar, Vijayawada, Andhra Pradesh",
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
    address: "Kala Nagar, Vijayawada, Andhra Pradesh",
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
    address: "Palm Beach Road, Vijayawada, Andhra Pradesh",
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
    address: "Indira Nagar, Vijayawada, Andhra Pradesh",
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
    address: "Opp LIC Office, Vijayawada, Andhra Pradesh",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=200&fit=crop&crop=center",
    images: [
      require('../../assets/HospitalImages/H19.webp'),
      require('../../assets/InteriorImages/I1.jpg'),
      require('../../assets/InteriorRoomsImages/IR1.jpeg'),
      require('../../assets/OperationTheatreImages/O1.webp'),
      require('../../assets/ParkingAreaImages/P1.jpg')
    ],
    description: "24/7 emergency services with critical care and trauma management.",
    visitorsCount: 10500
  }
];