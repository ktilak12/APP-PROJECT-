import { Idea, User, Challenge } from '../types';

export const defaultIdeaAuthors: Record<string, User> = {
  rahul: {
    id: 'usr_rahul_author',
    name: 'Rahul Sharma',
    username: 'rahul_ml',
    email: 'rahul.sharma.ml@gmail.com',
    googleId: 'google_2091829481920394',
    authProvider: 'google',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    role: 'Senior ML Engineer',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'FastAPI', 'Computer Vision'],
    interests: ['AI & ML', 'Healthcare', 'Agriculture'],
    reputation: 3120,
    bio: 'ML researcher focusing on computer vision and remote sensing.',
    location: 'Delhi, India',
    github: 'github.com/rahulml',
    ideasCount: 5,
  },
  priya: {
    id: 'usr_priya_author',
    name: 'Priya Patel',
    username: 'priyadesign',
    email: 'priya.patel.design@gmail.com',
    googleId: 'google_3920194829104820',
    authProvider: 'google',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    role: 'Product Designer',
    skills: ['UI/UX', 'Figma', 'React', 'Design Systems', 'User Research'],
    interests: ['EdTech', 'FinTech', 'SaaS'],
    reputation: 1890,
    bio: 'Crafting pixel-perfect human-centered interfaces for high-growth tech platforms.',
    location: 'Mumbai, India',
    github: 'github.com/priyadesign',
    ideasCount: 2,
  },
  arjun: {
    id: 'usr_arjun_author',
    name: 'Arjun Reddy',
    username: 'arjun_hardware',
    email: 'arjun.reddy.iot@gmail.com',
    googleId: 'google_4810293847102938',
    authProvider: 'google',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    role: 'IoT & Embedded Systems Lead',
    skills: ['IoT', 'C++', 'Raspberry Pi', 'Arduino', 'Sensor Networks', 'PCB Design'],
    interests: ['Environment', 'Smart Cities', 'Agriculture'],
    reputation: 2750,
    bio: 'Hardware tinkerer bridging physical sensors with cloud APIs.',
    location: 'Hyderabad, India',
    ideasCount: 4,
  }
};

export const currentUser: User | null = null;
export const mockUsers: User[] = [];

export const mockChallenges: Challenge[] = [
  {
    id: 'ch_climate_2026',
    title: 'Climate Tech & Sustainable Futures Challenge',
    organizer: 'GreenEarth Foundation & AWS',
    organizerLogo: '🌍',
    prizePool: '₹2,50,000 + Cloud Credits',
    deadline: '2026-09-30',
    participantsCount: 348,
    submissionsCount: 127,
    categories: ['Environment', 'Energy', 'Agriculture'],
    bannerUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
    description: 'Build impactful hardware, IoT, or AI solutions addressing groundwater depletion, clean energy storage, or precision carbon tracking.',
    rules: [
      'Must include a working prototype or simulation demonstration',
      'Open source license required for core submission code',
      'Team size: 1 - 4 members'
    ]
  },
  {
    id: 'ch_genai_2026',
    title: 'Generative AI for India Innovation Sprint',
    organizer: 'Google Cloud & AI Alliance',
    organizerLogo: '⚡',
    prizePool: '₹5,00,000 + Venture Fast-Track',
    deadline: '2026-10-15',
    participantsCount: 612,
    submissionsCount: 245,
    categories: ['AI & ML', 'Education', 'Healthcare', 'FinTech'],
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    description: 'Empower vernacular education, rural health diagnostics, or automated micro-finance underwriting using multimodal LLMs.',
    rules: [
      'Must leverage Google Gemini API or open-weights models',
      'Working demo link or mobile app build required',
      'Judging criteria: Novelty, Technical Execution, Societal Impact'
    ]
  }
];

export const mockIdeas: Idea[] = [
  {
    id: 'idea_aquasense',
    title: 'AquaSense: IoT Water Quality & Leakage AI Sentinel',
    tagline: 'Autonomous IoT sensor nodes predicting pipe bursts & contamination in municipal grids.',
    problem: 'Over 30% of treated municipal water is lost due to undetected underground pipe micro-fractures, and water contamination outbreaks often take 48+ hours to detect via manual laboratory samples.',
    solution: 'Deploying solar-powered acoustic & spectroscopic sensor probes that continuously stream hydraulic acoustics and spectral turbidity data to an edge-ML model predicting pipe failure 72 hours in advance.',
    category: 'Environment',
    tags: ['IoT', 'WaterTech', 'EdgeAI', 'SmartCities', 'Sustainability'],
    stage: 'Prototype',
    stageProgress: 60,
    upvotes: 142,
    userUpvoted: false,
    interestsCount: 48,
    userInterested: false,
    potentialsCount: 39,
    author: defaultIdeaAuthors.arjun,
    createdAt: '2026-08-20T10:30:00.000Z',
    views: 1240,
    requiredSkills: ['Embedded C++', 'TinyML', 'React Dashboard', 'PostgreSQL'],
    techStack: ['ESP32', 'FreeRTOS', 'TensorFlow Lite', 'FastAPI', 'React', 'TimescaleDB'],
    githubUrl: 'github.com/arjunreddy/aquasense-core',
    demoUrl: 'https://aquasense-demo.vercel.app',
    aiEvaluation: {
      overallScore: 88,
      problemClarity: 92,
      innovationScore: 85,
      feasibilityScore: 89,
      marketPotential: 86,
      socialImpact: 95,
      technicalDifficulty: 78,
      strengths: [
        'Massive addressable municipal & smart city market with clear ROI on non-revenue water loss.',
        'High social impact for drinking water safety and conservation.',
        'Combination of hardware acoustic sensing and edge intelligence creates defensible IP.'
      ],
      risks: [
        'Hardware deployment and municipal government sales cycles can be long.',
        'Sensor bio-fouling in harsh water conditions requires robust calibration.'
      ],
      suggestions: [
        'Partner with industrial water treatment plants for faster pilot validation before municipal rollouts.',
        'Integrate LoRaWAN connectivity for long-range underground transmission.'
      ]
    },
    feedbackList: [
      {
        id: 'fb_1',
        userId: 'usr_rahul_author',
        userName: 'Rahul Sharma',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
        problemClarity: 5,
        innovation: 4,
        feasibility: 4,
        marketPotential: 5,
        socialImpact: 5,
        technicalDifficulty: 4,
        comment: 'Brilliant concept! The acoustic waveform analysis for cavitation detection is proven in oil & gas, great to see it applied to municipal water. Would love to collaborate on the ML classifier.',
        createdAt: '2026-08-22T14:15:00.000Z'
      }
    ],
    comments: [
      {
        id: 'c_1',
        userId: 'usr_priya_author',
        userName: 'Priya Patel',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
        content: 'Is there a companion mobile dashboard for field maintenance technicians to inspect alerts in real-time?',
        createdAt: '2026-08-23T09:12:00.000Z',
        likes: 4
      }
    ],
    team: [
      {
        userId: 'usr_arjun_author',
        name: 'Arjun Reddy',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
        role: 'Founder & Hardware Systems Lead',
        status: 'Founder',
        joinedAt: '2026-08-20'
      }
    ],
    tasks: [
      {
        id: 't_1',
        title: 'Calibrate Acoustic Sensor Probe PCB',
        description: 'Test signal-to-noise ratio in pressurized 2-inch PVC test bench.',
        status: 'done',
        assignee: 'Arjun Reddy',
        priority: 'high',
        createdAt: '2026-08-24'
      },
      {
        id: 't_2',
        title: 'Build Edge Impulse TinyML Classifier',
        description: 'Train 3-class model: Normal Flow, Minor Micro-fissure, Critical Rupture.',
        status: 'in_progress',
        assignee: 'Arjun Reddy',
        priority: 'high',
        createdAt: '2026-08-26'
      },
      {
        id: 't_3',
        title: 'Design Field Technician Mobile UI',
        description: 'Create map-based pipe telemetry view in React Native / PWA.',
        status: 'todo',
        priority: 'medium',
        createdAt: '2026-08-28'
      }
    ]
  },
  {
    id: 'idea_agrivision',
    title: 'AgriVision: Vernacular Drone Multispectral Crop Health',
    tagline: 'Empowering smallholder farmers with affordable drone analytics in regional languages.',
    problem: 'Over 85% of smallholder farmers suffer 20-40% yield loss from pest infestations because existing satellite imagery resolution is too low and enterprise drone software is unaffordable and in English.',
    solution: 'A low-cost drone attachment paired with a smartphone app delivering vernacular voice alerts (Hindi, Tamil, Telugu) and precise fertilizer spray maps directly to farmers WhatsApp.',
    category: 'Agriculture',
    tags: ['AgriTech', 'ComputerVision', 'VernacularAI', 'Drones', 'India'],
    stage: 'Validation',
    stageProgress: 40,
    upvotes: 118,
    userUpvoted: false,
    interestsCount: 32,
    potentialsCount: 26,
    author: defaultIdeaAuthors.rahul,
    createdAt: '2026-08-24T12:00:00.000Z',
    views: 980,
    requiredSkills: ['Computer Vision', 'PyTorch', 'FastAPI', 'Mobile Dev', 'Agronomy'],
    techStack: ['YOLOv10', 'PyTorch', 'Python', 'Flutter', 'WhatsApp Business API'],
    aiEvaluation: {
      overallScore: 84,
      problemClarity: 90,
      innovationScore: 82,
      feasibilityScore: 84,
      marketPotential: 88,
      socialImpact: 94,
      technicalDifficulty: 75,
      strengths: [
        'Huge grassroots impact addressing farmer distress and food security.',
        'WhatsApp + voice delivery removes digital literacy barrier.',
        'High potential for government agri-subsidies and micro-finance partnerships.'
      ],
      risks: [
        'Drone regulatory restrictions in certain zones.',
        'Seasonal revenue cyclicality depending on harvest periods.'
      ],
      suggestions: [
        'Provide Drone-as-a-Service (DaaS) through local rural youth village hubs (Kisan Kendras).'
      ]
    },
    feedbackList: [],
    comments: [],
    team: [
      {
        userId: 'usr_rahul_author',
        name: 'Rahul Sharma',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
        role: 'Founder & Vision AI Lead',
        status: 'Founder',
        joinedAt: '2026-08-24'
      }
    ],
    tasks: []
  },
  {
    id: 'idea_edumind',
    title: 'EduMind: Personalized Socratic AI Tutor for K-12',
    tagline: 'Neuro-adaptive interactive tutoring teaching first principles through dialogic questioning.',
    problem: 'Rote memorization and one-size-fits-all classroom lectures leave 60% of students with fundamental conceptual gaps in STEM, creating compounding learning deficits.',
    solution: 'A conversational AI tutor that guides students using the Socratic method, never directly giving answers but asking step-by-step diagnostic questions tailored to individual cognitive pace.',
    category: 'Education',
    tags: ['EdTech', 'LLM', 'SocraticTeaching', 'STEM', 'AI'],
    stage: 'MVP',
    stageProgress: 75,
    upvotes: 205,
    userUpvoted: false,
    interestsCount: 67,
    potentialsCount: 52,
    author: defaultIdeaAuthors.priya,
    createdAt: '2026-08-15T08:00:00.000Z',
    views: 1890,
    requiredSkills: ['Next.js', 'LLM Fine-Tuning', 'Speech-to-Text', 'Child Psychology'],
    techStack: ['Gemini 1.5 Pro', 'Next.js', 'Web Audio API', 'Tailwind', 'Supabase'],
    githubUrl: 'github.com/priyadesign/edumind-app',
    demoUrl: 'https://edumind-ai.vercel.app',
    aiEvaluation: {
      overallScore: 91,
      problemClarity: 95,
      innovationScore: 92,
      feasibilityScore: 90,
      marketPotential: 89,
      socialImpact: 93,
      technicalDifficulty: 70,
      strengths: [
        'Socratic approach has proven pedagogical superiority over direct answer engines.',
        'High retention and subscription willingness from parents.',
        'Scalable software margins with multimodal LLMs.'
      ],
      risks: [
        'Crowded EdTech market with generic homework solvers.',
        'Need for hallucination guardrails on specialized curriculum topics.'
      ],
      suggestions: [
        'Build school district teacher analytics to monitor real-time classroom comprehension gaps.'
      ]
    },
    feedbackList: [],
    comments: [],
    team: [
      {
        userId: 'usr_priya_author',
        name: 'Priya Patel',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
        role: 'Product Lead',
        status: 'Founder',
        joinedAt: '2026-08-15'
      }
    ],
    tasks: []
  }
];
