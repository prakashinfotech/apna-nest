// ── lib/constants.ts ─────────────────────────────────────────────────────────

export const PROPERTY_TYPES = [
  { id: 1, code: 'apartment',   label: 'Apartment' },
  { id: 2, code: 'independent', label: 'Independent House / Villa' },
  { id: 3, code: 'plot',        label: 'Plot / Land' },
  { id: 4, code: 'pg',          label: 'PG / Hostel' },
  { id: 5, code: 'commercial',  label: 'Commercial' },
  { id: 6, code: 'studio',      label: 'Studio' },
  { id: 7, code: 'builder_floor', label: 'Builder Floor' },
]

export const LISTING_INTENTS = [
  { id: 1, code: 'buy',  label: 'Buy'  },
  { id: 2, code: 'rent', label: 'Rent' },
  { id: 3, code: 'pg',   label: 'PG'   },
]

export const FURNISHING_STATUSES = [
  { id: 1, code: 'unfurnished', label: 'Unfurnished'     },
  { id: 2, code: 'semi',        label: 'Semi Furnished'  },
  { id: 3, code: 'fully',       label: 'Fully Furnished' },
]

export const POSSESSION_STATUSES = [
  { id: 1, code: 'ready',       label: 'Ready to Move'     },
  { id: 2, code: 'under_const', label: 'Under Construction' },
  { id: 3, code: 'new_launch',  label: 'New Launch'         },
]

export const CITIES = [
  'Ahmedabad', 'Mumbai', 'Bangalore', 'Pune', 'Delhi',
  'Hyderabad', 'Chennai', 'Kolkata', 'Jaipur', 'Gurgaon',
  'Noida', 'Surat', 'Lucknow', 'Kochi',
]

export const AMENITIES_LIST = [
  'Swimming Pool', 'Gymnasium', 'Clubhouse', 'Power Backup', 'Lift',
  '24x7 Security', 'Garden', 'Kids Play Area', 'Tennis Court',
  'Smart Home', 'Modular Kitchen', 'Servant Quarter', 'Home Theater',
  'WiFi', 'Air Conditioner', 'Intercom', 'CCTV', 'Vastu Compliant',
  'Pet Friendly', 'Senior Citizen Friendly', 'EV Charging',
  'Rainwater Harvesting', 'Solar Panels', 'Jogging Track', 'Basketball Court',
]

export const LOCALITIES = [
  { id: 'l1', cityId: 'c1', name: 'Bopal', city: 'Ahmedabad', slug: 'bopal-ahmedabad', avgPrice: 6500, properties: 120, growth: '+8%', description: 'Bopal is a fast-growing residential hub.', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', avgRent: 25000, highlights: ['Good schools', 'Connectivity'] },
  { id: 'l2', cityId: 'c1', name: 'Prahlad Nagar', city: 'Ahmedabad', slug: 'prahlad-nagar-ahmedabad', avgPrice: 7500, properties: 90, growth: '+5%', description: 'Prahlad Nagar is a premium locality.', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', avgRent: 35000, highlights: ['Premium', 'Corporate offices'] },
  { id: 'l3', cityId: 'c2', name: 'Whitefield', city: 'Bangalore', slug: 'whitefield-bangalore', avgPrice: 8500, properties: 200, growth: '+10%', description: 'IT hub of Bangalore.', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', avgRent: 40000, highlights: ['IT Parks', 'Malls'] },
  { id: 'l4', cityId: 'c2', name: 'Koramangala', city: 'Bangalore', slug: 'koramangala-bangalore', avgPrice: 12000, properties: 150, growth: '+6%', description: 'Startup hub of India.', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', avgRent: 60000, highlights: ['Nightlife', 'Startups'] },
  { id: 'l5', cityId: 'c3', name: 'Hinjewadi', city: 'Pune', slug: 'hinjewadi-pune', avgPrice: 7000, properties: 180, growth: '+7%', description: 'Major IT park area in Pune.', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', avgRent: 30000, highlights: ['IT Hub', 'Affordable'] },
  { id: 'l6', cityId: 'c3', name: 'Baner', city: 'Pune', slug: 'baner-pune', avgPrice: 8000, properties: 130, growth: '+9%', description: 'Upscale residential neighborhood.', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', avgRent: 35000, highlights: ['Premium', 'Good connectivity'] },
]

export function getLocalityBySlug(slug: string) {
  return LOCALITIES.find((l) => l.slug === slug)
}



export const NEWS_ARTICLES = [
  {
    id: '1',
    slug: 'real-estate-trends-2024',
    title: 'Top Real Estate Trends to Watch in 2024',
    category: 'Market Trends',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    date: 'May 10, 2024',
    readTime: '5 min read',
    author: 'Dwarkesh V.',
    excerpt: 'The real estate market is shifting. Discover the key trends defining 2024.',
    content: [
      'Sustainability is becoming a top priority for home buyers.',
      'Tier-2 cities are seeing unprecedented growth in property value.',
      'Integration of AI in property search is simplifying the buying process.'
    ]
  },
  {
    id: '2',
    slug: 'home-buying-guide',
    title: 'A Step-by-Step Guide for First-Time Home Buyers',
    category: 'Buying Guide',
    image: 'https://images.unsplash.com/photo-1582408921715-18e7806365c1?w=800&q=80',
    date: 'May 08, 2024',
    readTime: '8 min read',
    author: 'Dwarkesh V.',
    excerpt: 'Navigating your first home purchase? This guide covers everything you need to know.',
    content: [
      'Start with a clear budget and get pre-approved for a loan.',
      'Location is key—research the neighborhood growth potential.',
      'Never skip the property inspection phase.'
    ]
  },
  {
    id: '3',
    slug: 'legal-documents-checklist',
    title: 'Essential Legal Documents Checklist for Property Purchase',
    category: 'Legal',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
    date: 'May 05, 2024',
    readTime: '6 min read',
    author: 'Dwarkesh V.',
    excerpt: 'Ensure a smooth transaction by verifying these essential legal documents.',
    content: [
      'Check the Title Deed for clear ownership.',
      'Verify the Occupancy Certificate (OC) from local authorities.',
      'Ensure the Encumbrance Certificate (EC) is up to date.'
    ]
  },
  {
    id: '4',
    slug: 'smart-home-tech',
    title: 'How Smart Home Technology is Changing Modern Living',
    category: 'Modern Living',
    image: 'https://images.unsplash.com/photo-1558002038-103792e07a70?w=800&q=80',
    date: 'May 01, 2024',
    readTime: '4 min read',
    author: 'Dwarkesh V.',
    excerpt: 'Smart homes are no longer futuristic. See how they enhance daily life today.',
    content: [
      'Integrated security systems offer peace of mind.',
      'Smart thermostats significantly reduce energy consumption.',
      'Voice-controlled lighting and entertainment systems are now mainstream.'
    ]
  }
]

export function getArticleBySlug(slug: string) {
  return NEWS_ARTICLES.find((a) => a.slug === slug)
}

export const PROJECTS = [
  {
    id: 'p1',
    name: 'Goyal Orchid Greens',
    builder: 'Goyal & Co.',
    locality: 'Bopal',
    city: 'Ahmedabad',
    status: 'Under Construction',
    configurations: '2, 3 BHK',
    possession: 'Dec 2025',
    priceRange: '₹65 L - 95 L',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    reraId: 'PR/GJ/AHMEDABAD/AUDA/RAA00001',
  },
  {
    id: 'p2',
    name: 'Godrej Eternity',
    builder: 'Godrej Properties',
    locality: 'Whitefield',
    city: 'Bangalore',
    status: 'Ready to Move',
    configurations: '3, 4 BHK',
    possession: 'Immediate',
    priceRange: '₹1.2 Cr - 2.5 Cr',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    reraId: 'PR/KA/BANGALORE/CITY/RAA00002',
  },
  {
    id: 'p3',
    name: 'Lodha World One',
    builder: 'Lodha Group',
    locality: 'Lower Parel',
    city: 'Mumbai',
    status: 'Ready to Move',
    configurations: '4, 5 BHK',
    possession: 'Immediate',
    priceRange: '₹5 Cr - 15 Cr',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    reraId: 'PR/MH/MUMBAI/CITY/RAA00003',
  }
]

export const AGENTS = [
  {
    id: 'a1',
    name: 'Rajesh Mehta',
    agency: 'Mehta Realty Solutions',
    rating: 4.8,
    reviews: 120,
    experience: 12,
    dealsClosed: 450,
    isVerified: true,
    phone: '+91 98765 43210',
    email: 'rajesh@example.com',
    specialties: ['Luxury Villas', 'Resale'],
    localities: ['Bopal', 'Prahlad Nagar'],
  },
  {
    id: 'a2',
    name: 'Priya Sharma',
    agency: 'Bangalore Estates',
    rating: 4.9,
    reviews: 85,
    experience: 8,
    dealsClosed: 300,
    isVerified: true,
    phone: '+91 91234 56789',
    email: 'priya@example.com',
    specialties: ['Apartments', 'Rental'],
    localities: ['Whitefield', 'Koramangala'],
  },
  {
    id: 'a3',
    name: 'Amit Patel',
    agency: 'Elite Homes Pune',
    rating: 4.7,
    reviews: 150,
    experience: 15,
    dealsClosed: 600,
    isVerified: true,
    phone: '+91 90000 11111',
    email: 'amit@example.com',
    specialties: ['Commercial', 'Plots'],
    localities: ['Hinjewadi', 'Baner'],
  }
]

export const DEVELOPERS = [

  { id: 'd1', name: 'Goyal & Co.', logoInitials: 'G', rating: 4.8, projectsCount: 45, established: '1970' },
  { id: 'd2', name: 'Godrej Properties', logoInitials: 'G', rating: 4.7, projectsCount: 120, established: '1990' },
  { id: 'd3', name: 'Lodha Group', logoInitials: 'L', rating: 4.9, projectsCount: 85, established: '1980' },
  { id: 'd4', name: 'DLF Limited', logoInitials: 'D', rating: 4.6, projectsCount: 60, established: '1946' },
  { id: 'd5', name: 'Prestige Group', logoInitials: 'P', rating: 4.8, projectsCount: 110, established: '1986' },
  { id: 'd6', name: 'Sobha Limited', logoInitials: 'S', rating: 4.7, projectsCount: 40, established: '1995' },

]
