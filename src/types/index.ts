export type IdeaStage = 
  | 'Idea' 
  | 'Validation' 
  | 'Team Formation' 
  | 'Prototype' 
  | 'MVP' 
  | 'Beta' 
  | 'Launched';

export type Category = 
  | 'AI & ML' 
  | 'Environment' 
  | 'Healthcare' 
  | 'Education' 
  | 'FinTech' 
  | 'SaaS' 
  | 'Agriculture' 
  | 'Cybersecurity' 
  | 'Energy' 
  | 'Smart Cities';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  googleId: string;
  avatar: string;
  role: string;
  skills: string[];
  interests: string[];
  reputation: number;
  bio: string;
  location: string;
  college?: string;
  github?: string;
  linkedin?: string;
  ideasCount: number;
  authProvider?: 'google' | 'email';
}

export interface StructuredFeedback {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  problemClarity: number;
  innovation: number;
  feasibility: number;
  marketPotential: number;
  socialImpact: number;
  technicalDifficulty: number;
  comment: string;
  createdAt: string;
}

export interface AIEvaluation {
  overallScore: number; // 0-100
  problemClarity: number;
  innovationScore: number;
  feasibilityScore: number;
  marketPotential: number;
  socialImpact: number;
  technicalDifficulty: number;
  strengths: string[];
  risks: string[];
  suggestions: string[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  userLiked?: boolean;
}

export interface TeamMember {
  userId: string;
  name: string;
  avatar: string;
  role: string;
  status: 'Founder' | 'Member' | 'Pending';
  joinedAt: string;
}

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  assignee?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface Idea {
  id: string;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  category: Category;
  tags: string[];
  stage: IdeaStage;
  stageProgress: number; // 0 - 100%
  upvotes: number;
  userUpvoted?: boolean;
  interestsCount: number;
  userInterested?: boolean;
  potentialsCount: number;
  userPotential?: boolean;
  author: User;
  createdAt: string;
  views: number;
  requiredSkills: string[];
  techStack: string[];
  aiEvaluation: AIEvaluation;
  feedbackList: StructuredFeedback[];
  comments: Comment[];
  team: TeamMember[];
  tasks: KanbanTask[];
  challengeId?: string;
  challengeTitle?: string;
  videoUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
}

export interface Challenge {
  id: string;
  title: string;
  organizer: string;
  organizerLogo: string;
  prizePool: string;
  deadline: string;
  participantsCount: number;
  submissionsCount: number;
  categories: Category[];
  bannerUrl: string;
  description: string;
  rules: string[];
}
