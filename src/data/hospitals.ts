export interface Hospital {
  id: number;
  name: string;
  specialization: string;
  address: string;
  rating: number;
  image?: string;
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
    description: "Premier cancer care and cardiac treatment center with international standards.",
    visitorsCount: 15600
  },
  {
    id: 6,
    name: "Krishna Institute of Medical Sciences (KIMS)",
    specialization: "Neurosurgery, Transplant",
    address: "Minister Road, Secunderabad, Vijayawada, Andhra Pradesh",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop&crop=center",
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
    description: "Affordable cardiac surgery and comprehensive pediatric care services.",
    visitorsCount: 13400
  },
  {
    id: 12,
    name: "Rainbow Children's Hospital Vijayawada",
    specialization: "Liver Transplant, Nephrology",
    address: "Auto Nagar, Vijayawada, Andhra Pradesh",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400&h=200&fit=crop&crop=center",
    description: "Leading liver transplant center with advanced kidney care facilities.",
    visitorsCount: 9600
  },
  {
    id: 13,
    name: "Andhra Hospitals",
    specialization: "Pediatric Care, NICU",
    address: "Patamatalanka, Vijayawada, Andhra Pradesh",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1581595220975-119360b7906d?w=400&h=200&fit=crop&crop=center",
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
    description: "Advanced liver transplant and gastroenterology services with expert care.",
    visitorsCount: 7500
  },
  {
    id: 15,
    name: "Continental Hospitals Vijayawada",
    specialization: "Emergency Care, Maternity",
    address: "Labbipet, Vijayawada, Andhra Pradesh",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop&crop=center",
    description: "Comprehensive emergency services and specialized maternity care.",
    visitorsCount: 6900
  },
  {
    id: 16,
    name: "Bhavani Hospital",
    specialization: "General Medicine, Surgery",
    address: "Eluru Road, Vijayawada, Andhra Pradesh",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&crop=center",
    description: "Established hospital providing general medical and surgical services.",
    visitorsCount: 5800
  },
  {
    id: 17,
    name: "Care Hospital Vijayawada",
    specialization: "Cardiac Speciality, Interventional",
    address: "Health City, Vijayawada, Andhra Pradesh",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=200&fit=crop&crop=center",
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
    description: "Comprehensive cancer care and advanced gastroenterology treatments.",
    visitorsCount: 11700
  }
];