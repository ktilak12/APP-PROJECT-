import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Idea, User, Challenge, Category, IdeaStage, StructuredFeedback, Comment, KanbanTask, TeamMember } from '../types';
import { mockIdeas, mockChallenges } from '../data/mockData';
import confetti from 'canvas-confetti';

export type ViewMode = 'explore' | 'pitch' | 'matchmaker' | 'challenges' | 'workspace' | 'analytics' | 'profile' | 'entry';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'upvote' | 'team' | 'ai' | 'challenge' | 'comment';
  linkId?: string;
}

export interface GoogleJwtPayload {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  email_verified?: boolean;
}

export interface GoogleLoginParams {
  email: string;
  name: string;
  googleId?: string;
  avatar?: string;
  role?: string;
  college?: string;
  skills?: string[];
  bio?: string;
}

interface UserVoteMap {
  [userId: string]: {
    upvotedIdeaIds: string[];
    interestedIdeaIds: string[];
    potentialIdeaIds: string[];
  };
}

interface AppContextType {
  ideas: Idea[];
  challenges: Challenge[];
  accounts: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  selectedIdea: Idea | null;
  setSelectedIdea: (idea: Idea | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: Category | 'All';
  setSelectedCategory: (cat: Category | 'All') => void;
  selectedStage: IdeaStage | 'All';
  setSelectedStage: (stage: IdeaStage | 'All') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationsRead: () => void;

  // Auth Controls
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'choose' | 'add_google';
  setAuthModalMode: (mode: 'choose' | 'add_google') => void;
  loginWithGoogleCredential: (credential: string) => void;
  loginWithGoogle: (params: GoogleLoginParams) => void;
  switchAccount: (userId: string) => void;
  logout: () => void;
  removeAccount: (userId: string) => void;
  updateUserProfile: (data: Partial<User>) => void;

  // Actions
  handleUpvote: (ideaId: string) => void;
  handleToggleInterest: (ideaId: string) => void;
  handleTogglePotential: (ideaId: string) => void;
  addNewIdea: (newIdea: Omit<Idea, 'id' | 'createdAt' | 'views' | 'upvotes' | 'interestsCount' | 'potentialsCount' | 'author' | 'feedbackList' | 'comments' | 'team' | 'tasks'>) => void;
  deleteIdea: (ideaId: string) => void;
  addFeedbackToIdea: (ideaId: string, feedback: Omit<StructuredFeedback, 'id' | 'userId' | 'userName' | 'userAvatar' | 'createdAt'>) => void;
  addCommentToIdea: (ideaId: string, content: string) => void;
  deleteCommentFromIdea: (ideaId: string, commentId: string) => void;
  applyToTeam: (ideaId: string, role: string) => void;
  approveTeamMember: (ideaId: string, userId: string) => void;
  updateTaskStatus: (ideaId: string, taskId: string, newStatus: KanbanTask['status']) => void;
  addKanbanTask: (ideaId: string, taskTitle: string, description: string, assignee: string, priority: KanbanTask['priority']) => void;
  deleteKanbanTask: (ideaId: string, taskId: string) => void;
  submitPitchToChallenge: (ideaId: string, challengeId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rawIdeas, setRawIdeas] = useState<Idea[]>(() => {
    const saved = localStorage.getItem('ideapitch_ideas');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return mockIdeas;
      }
    }
    return mockIdeas;
  });

  const [accounts, setAccounts] = useState<User[]>(() => {
    const saved = localStorage.getItem('ideapitch_accounts');
    if (saved) {
      try {
        const parsed: User[] = JSON.parse(saved);
        return parsed.filter(u => u.id !== 'usr_abhi_author' && u.name !== 'Abhi Kumar');
      } catch {
        return [];
      }
    }
    return [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUserId = localStorage.getItem('ideapitch_current_user_id');
    const savedAccounts = localStorage.getItem('ideapitch_accounts');
    if (savedUserId && savedUserId !== 'usr_abhi_author' && savedAccounts) {
      try {
        const userList: User[] = JSON.parse(savedAccounts);
        const found = userList.find(u => u.id === savedUserId && u.id !== 'usr_abhi_author' && u.name !== 'Abhi Kumar');
        if (found) return found;
      } catch {
        return null;
      }
    }
    return null;
  });

  // User-specific vote mappings to ensure independent votes per Google ID
  const [userVotes, setUserVotes] = useState<UserVoteMap>(() => {
    const saved = localStorage.getItem('ideapitch_user_votes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  const [challenges] = useState<Challenge[]>(mockChallenges);
  const [activeView, _setActiveView] = useState<ViewMode>('entry');
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'choose' | 'add_google'>('choose');

  const setActiveView = (view: ViewMode) => {
    if (!currentUser && view !== 'entry') {
      setAuthModalMode('choose');
      setAuthModalOpen(true);
      return;
    }
    _setActiveView(view);
  };

  const effectiveActiveView: ViewMode = currentUser ? activeView : 'entry';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedStage, setSelectedStage] = useState<IdeaStage | 'All'>('All');

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      title: 'Welcome to IdeaPitch Hub',
      message: 'Sign in with your Google Account to pitch ideas, join discussions and match with collaborators.',
      time: 'Just now',
      read: false,
      type: 'ai'
    },
    {
      id: 'notif_2',
      title: 'Hackathon Registration Open',
      message: 'Generative AI for India prize pool upgraded to ₹5,00,000.',
      time: '2h ago',
      read: false,
      type: 'challenge'
    }
  ]);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('ideapitch_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('ideapitch_ideas', JSON.stringify(rawIdeas));
  }, [rawIdeas]);

  useEffect(() => {
    localStorage.setItem('ideapitch_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('ideapitch_user_votes', JSON.stringify(userVotes));
  }, [userVotes]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ideapitch_current_user_id', currentUser.id);
    } else {
      localStorage.removeItem('ideapitch_current_user_id');
    }
  }, [currentUser]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ideapitch_theme', theme);
  }, [theme]);

  // Dynamically compute ideas with currentUser interaction states
  const ideas: Idea[] = useMemo(() => {
    const currentUserId = currentUser?.id;
    const votes = currentUserId ? userVotes[currentUserId] : undefined;
    const upvotedIds = new Set(votes?.upvotedIdeaIds || []);
    const interestedIds = new Set(votes?.interestedIdeaIds || []);
    const potentialIds = new Set(votes?.potentialIdeaIds || []);

    return rawIdeas.map(idea => ({
      ...idea,
      userUpvoted: upvotedIds.has(idea.id),
      userInterested: interestedIds.has(idea.id),
      userPotential: potentialIds.has(idea.id)
    }));
  }, [rawIdeas, currentUser?.id, userVotes]);

  const selectedIdea: Idea | null = useMemo(() => {
    if (!selectedIdeaId) return null;
    return ideas.find(i => i.id === selectedIdeaId) || null;
  }, [ideas, selectedIdeaId]);

  const setSelectedIdea = (idea: Idea | null) => {
    if (!currentUser && idea) {
      setAuthModalMode('choose');
      setAuthModalOpen(true);
      return;
    }
    setSelectedIdeaId(idea ? idea.id : null);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Real Google Sign-in credential handler
  const loginWithGoogleCredential = (credential: string) => {
    try {
      const decoded = jwtDecode<GoogleJwtPayload>(credential);
      if (!decoded || !decoded.email) {
        throw new Error('Invalid Google credential payload');
      }

      const googleId = decoded.sub;
      const existingAccount = accounts.find(
        a => a.googleId === googleId || a.email.toLowerCase() === decoded.email.toLowerCase()
      );

      if (existingAccount) {
        const updated = {
          ...existingAccount,
          googleId,
          name: decoded.name || existingAccount.name,
          avatar: decoded.picture || existingAccount.avatar,
          authProvider: 'google' as const
        };
        setAccounts(prev => prev.map(a => a.id === updated.id ? updated : a));
        setCurrentUser(updated);
        setAuthModalOpen(false);
        setActiveView('explore');
        confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
        return;
      }

      const newGoogleUser: User = {
        id: `google_${googleId}`,
        name: decoded.name || decoded.email.split('@')[0],
        username: decoded.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, ''),
        email: decoded.email,
        googleId,
        authProvider: 'google',
        avatar: decoded.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        role: 'Tech Innovator & Builder',
        skills: ['Full-Stack', 'AI/ML', 'Cloud'],
        interests: ['AI & ML', 'SaaS', 'FinTech'],
        reputation: 1000,
        bio: `Verified Google Developer (${decoded.email}). Ready to pitch innovation and build startup prototypes.`,
        location: 'Global',
        college: 'Innovation Hub',
        ideasCount: 0
      };

      setAccounts(prev => [newGoogleUser, ...prev]);
      setCurrentUser(newGoogleUser);
      setAuthModalOpen(false);
      setActiveView('explore');
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      console.error('Failed to parse Google OAuth credential:', err);
      alert('Unable to process Google Login credential. Please try again.');
    }
  };

  // Google Multi-Account Handlers
  const loginWithGoogle = (params: GoogleLoginParams) => {
    const existing = accounts.find(a => a.email.toLowerCase() === params.email.toLowerCase());
    
    if (existing) {
      setCurrentUser(existing);
      setAuthModalOpen(false);
      setActiveView('explore');
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      return;
    }

    const defaultAvatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80',
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=250&q=80'
    ];
    const chosenAvatar = params.avatar || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
    const generatedGoogleId = params.googleId || `108${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    const newUser: User = {
      id: `usr_${generatedGoogleId}`,
      name: params.name || params.email.split('@')[0],
      username: params.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, ''),
      email: params.email,
      googleId: generatedGoogleId,
      authProvider: 'google',
      avatar: chosenAvatar,
      role: params.role || 'Tech Innovator & Builder',
      skills: params.skills && params.skills.length ? params.skills : ['Full-Stack', 'AI / ML', 'Product Design'],
      interests: ['AI & ML', 'SaaS', 'Environment'],
      reputation: 1000,
      bio: params.bio || `Passionate innovator signed in via Google (${params.email}). Ready to collaborate & pitch.`,
      location: 'India',
      college: params.college || 'Tech Innovator',
      ideasCount: 0
    };

    setAccounts(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setAuthModalOpen(false);
    setActiveView('explore');
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const switchAccount = (userId: string) => {
    const target = accounts.find(a => a.id === userId);
    if (target) {
      setCurrentUser(target);
      setAuthModalOpen(false);
      setActiveView('explore');
      confetti({ particleCount: 50, spread: 40, origin: { y: 0.5 } });
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('entry');
  };

  const removeAccount = (userId: string) => {
    setAccounts(prev => {
      const filtered = prev.filter(a => a.id !== userId);
      if (currentUser?.id === userId) {
        if (filtered.length > 0) {
          setCurrentUser(filtered[0]);
          setActiveView('explore');
        } else {
          setCurrentUser(null);
          setActiveView('entry');
        }
      }
      return filtered;
    });
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setAccounts(prev => prev.map(a => a.id === updated.id ? updated : a));
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
  };

  // Upvote / Interaction Handlers with user ID isolation
  const handleUpvote = (ideaId: string) => {
    if (!currentUser) {
      setAuthModalMode('choose');
      setAuthModalOpen(true);
      return;
    }

    const userId = currentUser.id;
    const userVoteObj = userVotes[userId] || { upvotedIdeaIds: [], interestedIdeaIds: [], potentialIdeaIds: [] };
    const isCurrentlyUpvoted = userVoteObj.upvotedIdeaIds.includes(ideaId);

    const updatedUpvotes = isCurrentlyUpvoted
      ? userVoteObj.upvotedIdeaIds.filter(id => id !== ideaId)
      : [...userVoteObj.upvotedIdeaIds, ideaId];

    setUserVotes(prev => ({
      ...prev,
      [userId]: {
        ...userVoteObj,
        upvotedIdeaIds: updatedUpvotes
      }
    }));

    setRawIdeas(prev =>
      prev.map(item => {
        if (item.id === ideaId) {
          return {
            ...item,
            upvotes: isCurrentlyUpvoted ? Math.max(0, item.upvotes - 1) : item.upvotes + 1
          };
        }
        return item;
      })
    );
  };

  const handleToggleInterest = (ideaId: string) => {
    if (!currentUser) {
      setAuthModalMode('choose');
      setAuthModalOpen(true);
      return;
    }

    const userId = currentUser.id;
    const userVoteObj = userVotes[userId] || { upvotedIdeaIds: [], interestedIdeaIds: [], potentialIdeaIds: [] };
    const isInterested = userVoteObj.interestedIdeaIds.includes(ideaId);

    const updatedInterested = isInterested
      ? userVoteObj.interestedIdeaIds.filter(id => id !== ideaId)
      : [...userVoteObj.interestedIdeaIds, ideaId];

    setUserVotes(prev => ({
      ...prev,
      [userId]: {
        ...userVoteObj,
        interestedIdeaIds: updatedInterested
      }
    }));

    setRawIdeas(prev =>
      prev.map(item => {
        if (item.id === ideaId) {
          return {
            ...item,
            interestsCount: isInterested ? Math.max(0, item.interestsCount - 1) : item.interestsCount + 1
          };
        }
        return item;
      })
    );
  };

  const handleTogglePotential = (ideaId: string) => {
    if (!currentUser) {
      setAuthModalMode('choose');
      setAuthModalOpen(true);
      return;
    }

    const userId = currentUser.id;
    const userVoteObj = userVotes[userId] || { upvotedIdeaIds: [], interestedIdeaIds: [], potentialIdeaIds: [] };
    const isPotential = userVoteObj.potentialIdeaIds.includes(ideaId);

    const updatedPotential = isPotential
      ? userVoteObj.potentialIdeaIds.filter(id => id !== ideaId)
      : [...userVoteObj.potentialIdeaIds, ideaId];

    setUserVotes(prev => ({
      ...prev,
      [userId]: {
        ...userVoteObj,
        potentialIdeaIds: updatedPotential
      }
    }));

    setRawIdeas(prev =>
      prev.map(item => {
        if (item.id === ideaId) {
          return {
            ...item,
            potentialsCount: isPotential ? Math.max(0, item.potentialsCount - 1) : item.potentialsCount + 1
          };
        }
        return item;
      })
    );
  };

  const addNewIdea = (newPitch: Omit<Idea, 'id' | 'createdAt' | 'views' | 'upvotes' | 'interestsCount' | 'potentialsCount' | 'author' | 'feedbackList' | 'comments' | 'team' | 'tasks'>) => {
    if (!currentUser) {
      setAuthModalMode('choose');
      setAuthModalOpen(true);
      return;
    }

    const activeUser = currentUser;
    const newIdeaId = `idea_${Date.now()}`;

    const created: Idea = {
      ...newPitch,
      id: newIdeaId,
      createdAt: new Date().toISOString(),
      views: 1,
      upvotes: 1,
      interestsCount: 0,
      potentialsCount: 0,
      author: activeUser,
      feedbackList: [],
      comments: [],
      team: [
        {
          userId: activeUser.id,
          name: activeUser.name,
          avatar: activeUser.avatar,
          role: 'Founder',
          status: 'Founder',
          joinedAt: new Date().toISOString().split('T')[0]
        }
      ],
      tasks: [
        {
          id: `task_${Date.now()}_1`,
          title: 'Project Architecture & Setup',
          description: 'Initialize baseline repository and component scaffolding.',
          status: 'in_progress',
          assignee: activeUser.name,
          priority: 'high',
          createdAt: new Date().toISOString().split('T')[0]
        }
      ]
    };

    setRawIdeas(prev => [created, ...prev]);

    // Record author's initial upvote
    setUserVotes(prev => {
      const userVoteObj = prev[activeUser.id] || { upvotedIdeaIds: [], interestedIdeaIds: [], potentialIdeaIds: [] };
      return {
        ...prev,
        [activeUser.id]: {
          ...userVoteObj,
          upvotedIdeaIds: [...userVoteObj.upvotedIdeaIds, newIdeaId]
        }
      };
    });

    // Give reputation reward
    updateUserProfile({ 
      reputation: (activeUser.reputation || 1000) + 100,
      ideasCount: (activeUser.ideasCount || 0) + 1
    });

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setActiveView('explore');
    setSelectedIdeaId(newIdeaId);
  };

  const deleteIdea = (ideaId: string) => {
    const targetIdea = rawIdeas.find(i => i.id === ideaId);
    if (!targetIdea) return;

    if (currentUser && targetIdea.author.id !== currentUser.id) {
      alert('You can only delete ideas pitched by your current Google account.');
      return;
    }

    setRawIdeas(prev => prev.filter(i => i.id !== ideaId));

    if (selectedIdeaId === ideaId) {
      setSelectedIdeaId(null);
    }

    if (currentUser) {
      updateUserProfile({
        ideasCount: Math.max(0, (currentUser.ideasCount || 1) - 1),
        reputation: Math.max(0, (currentUser.reputation || 1000) - 50)
      });
    }

    // Clean up user vote maps for this idea
    setUserVotes(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(uId => {
        updated[uId] = {
          upvotedIdeaIds: (updated[uId]?.upvotedIdeaIds || []).filter(id => id !== ideaId),
          interestedIdeaIds: (updated[uId]?.interestedIdeaIds || []).filter(id => id !== ideaId),
          potentialIdeaIds: (updated[uId]?.potentialIdeaIds || []).filter(id => id !== ideaId)
        };
      });
      return updated;
    });

    confetti({ particleCount: 35, spread: 45, origin: { y: 0.6 } });
  };

  const addFeedbackToIdea = (ideaId: string, feedbackData: Omit<StructuredFeedback, 'id' | 'userId' | 'userName' | 'userAvatar' | 'createdAt'>) => {
    if (!currentUser) {
      setAuthModalMode('choose');
      setAuthModalOpen(true);
      return;
    }

    const activeUser = currentUser;

    const feedback: StructuredFeedback = {
      ...feedbackData,
      id: `fb_${Date.now()}`,
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatar: activeUser.avatar,
      createdAt: new Date().toISOString()
    };

    setRawIdeas(prev =>
      prev.map(item => {
        if (item.id === ideaId) {
          return {
            ...item,
            feedbackList: [feedback, ...item.feedbackList]
          };
        }
        return item;
      })
    );
  };

  const addCommentToIdea = (ideaId: string, content: string) => {
    if (!currentUser) {
      setAuthModalMode('choose');
      setAuthModalOpen(true);
      return;
    }

    const activeUser = currentUser;

    const newComment: Comment = {
      id: `cm_${Date.now()}`,
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatar: activeUser.avatar,
      content,
      createdAt: new Date().toISOString(),
      likes: 0
    };

    setRawIdeas(prev =>
      prev.map(item => {
        if (item.id === ideaId) {
          return {
            ...item,
            comments: [...item.comments, newComment]
          };
        }
        return item;
      })
    );
  };

  const deleteCommentFromIdea = (ideaId: string, commentId: string) => {
    if (!currentUser) return;
    
    setRawIdeas(prev =>
      prev.map(item => {
        if (item.id === ideaId) {
          return {
            ...item,
            comments: item.comments.filter(c => c.id !== commentId)
          };
        }
        return item;
      })
    );
  };

  const applyToTeam = (ideaId: string, role: string) => {
    if (!currentUser) {
      setAuthModalMode('choose');
      setAuthModalOpen(true);
      return;
    }

    const activeUser = currentUser;

    const member: TeamMember = {
      userId: activeUser.id,
      name: activeUser.name,
      avatar: activeUser.avatar,
      role,
      status: 'Pending',
      joinedAt: new Date().toISOString().split('T')[0]
    };

    setRawIdeas(prev =>
      prev.map(item => {
        if (item.id === ideaId) {
          if (item.team.some(m => m.userId === activeUser.id)) return item;
          return { ...item, team: [...item.team, member] };
        }
        return item;
      })
    );

    confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
  };

  const approveTeamMember = (ideaId: string, userId: string) => {
    setRawIdeas(prev =>
      prev.map(item => {
        if (item.id === ideaId) {
          return {
            ...item,
            team: item.team.map(m => m.userId === userId ? { ...m, status: 'Member' } : m)
          };
        }
        return item;
      })
    );

    confetti({ particleCount: 40, spread: 45, origin: { y: 0.5 } });
  };

  const updateTaskStatus = (ideaId: string, taskId: string, newStatus: KanbanTask['status']) => {
    setRawIdeas(prev =>
      prev.map(item => {
        if (item.id === ideaId) {
          return {
            ...item,
            tasks: item.tasks.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
          };
        }
        return item;
      })
    );
  };

  const addKanbanTask = (ideaId: string, title: string, description: string, assignee: string, priority: KanbanTask['priority']) => {
    const newTask: KanbanTask = {
      id: `task_${Date.now()}`,
      title,
      description,
      status: 'todo',
      assignee,
      priority,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setRawIdeas(prev =>
      prev.map(item => {
        if (item.id === ideaId) {
          return { ...item, tasks: [...item.tasks, newTask] };
        }
        return item;
      })
    );
  };

  const deleteKanbanTask = (ideaId: string, taskId: string) => {
    setRawIdeas(prev =>
      prev.map(item => {
        if (item.id === ideaId) {
          return {
            ...item,
            tasks: item.tasks.filter(t => t.id !== taskId)
          };
        }
        return item;
      })
    );
  };

  const submitPitchToChallenge = (ideaId: string, challengeId: string) => {
    const chal = challenges.find(c => c.id === challengeId);
    setRawIdeas(prev =>
      prev.map(item => {
        if (item.id === ideaId) {
          return {
            ...item,
            challengeId,
            challengeTitle: chal?.title || 'Innovation Hackathon'
          };
        }
        return item;
      })
    );

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <AppContext.Provider
      value={{
        ideas,
        challenges,
        accounts,
        currentUser,
        isAuthenticated: Boolean(currentUser),
        activeView: effectiveActiveView,
        setActiveView,
        selectedIdea,
        setSelectedIdea,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedStage,
        setSelectedStage,
        theme,
        toggleTheme,
        notifications,
        markNotificationsRead,
        isAuthModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        loginWithGoogleCredential,
        loginWithGoogle,
        switchAccount,
        logout,
        removeAccount,
        updateUserProfile,
        handleUpvote,
        handleToggleInterest,
        handleTogglePotential,
        addNewIdea,
        deleteIdea,
        addFeedbackToIdea,
        addCommentToIdea,
        deleteCommentFromIdea,
        applyToTeam,
        approveTeamMember,
        updateTaskStatus,
        addKanbanTask,
        deleteKanbanTask,
        submitPitchToChallenge
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
