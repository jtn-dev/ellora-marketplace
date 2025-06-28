export interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'ALGO' | 'USDC';
  category: string;
  deliveryTime: string;
  rating: number;
  totalOrders: number;
  freelancer: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    completedJobs: number;
  };
  image: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  gigCount: number;
}

export const mockCategories: Category[] = [
  { id: '1', name: 'Web Development', icon: '💻', gigCount: 1250 },
  { id: '2', name: 'Graphic Design', icon: '🎨', gigCount: 890 },
  { id: '3', name: 'Writing & Translation', icon: '✍️', gigCount: 650 },
  { id: '4', name: 'Digital Marketing', icon: '📈', gigCount: 780 },
  { id: '5', name: 'Video & Animation', icon: '🎬', gigCount: 420 },
  { id: '6', name: 'Music & Audio', icon: '🎵', gigCount: 350 },
  { id: '7', name: 'Programming', icon: '⚡', gigCount: 920 },
  { id: '8', name: 'Business', icon: '💼', gigCount: 540 },
];

export const mockGigs: Gig[] = [
  {
    id: '1',
    title: 'I will create a modern React.js website with Tailwind CSS',
    description: 'Professional web development service with responsive design, modern UI/UX, and clean code. Perfect for businesses looking to establish their online presence.',
    price: 150,
    currency: 'ALGO',
    category: 'Web Development',
    deliveryTime: '3 days',
    rating: 4.9,
    totalOrders: 145,
    freelancer: {
      id: 'f1',
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 4.9,
      completedJobs: 312,
    },
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400',
    tags: ['React', 'Tailwind', 'Responsive', 'Modern'],
  },
  {
    id: '2',
    title: 'I will design stunning UI/UX for your mobile app',
    description: 'Create beautiful and intuitive mobile app designs with modern aesthetics and user-centered approach. Includes wireframes, prototypes, and design systems.',
    price: 75,
    currency: 'USDC',
    category: 'Graphic Design',
    deliveryTime: '2 days',
    rating: 4.8,
    totalOrders: 89,
    freelancer: {
      id: 'f2',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c4?w=150',
      rating: 4.8,
      completedJobs: 156,
    },
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    tags: ['UI/UX', 'Mobile', 'Figma', 'Prototype'],
  },
  {
    id: '3',
    title: 'I will write engaging content for your blockchain project',
    description: 'Professional crypto and blockchain content writing. Technical papers, marketing copy, and educational content that drives engagement and builds trust.',
    price: 45,
    currency: 'ALGO',
    category: 'Writing & Translation',
    deliveryTime: '1 day',
    rating: 4.7,
    totalOrders: 67,
    freelancer: {
      id: 'f3',
      name: 'Mike Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      rating: 4.7,
      completedJobs: 198,
    },
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
    tags: ['Blockchain', 'Crypto', 'Technical Writing', 'Marketing'],
  },
  {
    id: '4',
    title: 'I will develop smart contracts for Algorand blockchain',
    description: 'Expert PyTEAL development for Algorand smart contracts. Escrow systems, DeFi protocols, and custom dApp functionality with security best practices.',
    price: 300,
    currency: 'ALGO',
    category: 'Programming',
    deliveryTime: '5 days',
    rating: 5.0,
    totalOrders: 23,
    freelancer: {
      id: 'f4',
      name: 'Dr. Emily Watson',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      rating: 5.0,
      completedJobs: 45,
    },
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
    tags: ['Algorand', 'PyTEAL', 'Smart Contracts', 'DeFi'],
  },
  {
    id: '5',
    title: 'I will create animated explainer videos for your DeFi project',
    description: 'High-quality animated videos that explain complex DeFi concepts in simple terms. Perfect for marketing, education, and user onboarding.',
    price: 120,
    currency: 'USDC',
    category: 'Video & Animation',
    deliveryTime: '4 days',
    rating: 4.6,
    totalOrders: 34,
    freelancer: {
      id: 'f5',
      name: 'James Park',
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150',
      rating: 4.6,
      completedJobs: 87,
    },
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
    tags: ['Animation', 'DeFi', 'Explainer', 'Video'],
  },
  {
    id: '6',
    title: 'I will audit your smart contract for security vulnerabilities',
    description: 'Comprehensive security audit for blockchain smart contracts. Detailed report with vulnerabilities, recommendations, and best practice guidelines.',
    price: 500,
    currency: 'ALGO',
    category: 'Programming',
    deliveryTime: '7 days',
    rating: 4.9,
    totalOrders: 18,
    freelancer: {
      id: 'f6',
      name: 'Lisa Zhang',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      rating: 4.9,
      completedJobs: 52,
    },
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400',
    tags: ['Security', 'Audit', 'Smart Contracts', 'Blockchain'],
  },
];

export const mockStats = {
  totalGigs: 4856,
  activeFreelancers: 1243,
  completedOrders: 8936,
  averageRating: 4.8,
};

export const mockUserProfile = {
  id: 'u1',
  name: 'John Doe',
  email: 'john@example.com',
  userType: 'client' as const,
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  bio: 'Passionate entrepreneur building the next generation of DeFi applications.',
  skills: ['Project Management', 'DeFi', 'Blockchain Strategy'],
  rating: 4.7,
  completedJobs: 12,
  joinedDate: new Date('2024-01-15'),
}; 