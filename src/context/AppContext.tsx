import React, { createContext, useContext, useState, useEffect } from 'react';
import { Idea, User, Challenge, Category, IdeaStage, StructuredFeedback, Comment, KanbanTask, TeamMember } from '../types';
import { mockIdeas, mockUsers, mockChallenges, currentUser as defaultUser } from '../data/mockData';
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

interface GoogleLoginParams {
  email: string;
  name: string;
  avatar?: string;
  role?: string;
  college?: string;
  skills?: string[];
  bio?: string;
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
  addFeedbackToIdea: (ideaId: string, feedback: Omit<StructuredFeedback, 'id' | 'userId' | 'userName' | 'userAvatar' | 'createdAt'>) => void;
  addCommentToIdea: (ideaId: string, content: string) => void;
  applyToTeam: (ideaId: string, role: string) => void;
  approveTeamMember: (ideaId: string, userId: string) => void;
  updateTaskStatus: (ideaId: string, taskId: string, newStatus: KanbanTask['status']) => void;
  addKanbanTask: (ideaId: string, taskTitle: string, description: string, assignee: string, priority: KanbanTask['priority']) => void;
  deleteKanbanTask: (ideaId: string, taskId: string) => void;
  submitPitchToChallenge: (ideaId: string, challengeId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ideas, setIdeas] = useState<Idea[]>(() => {
    const saved = localStorage.getItem('ideapitch_ideas');
    return saved ? JSON.parse(saved) : mockIdeas;
  });

  const [accounts, setAccounts] = useState<User[]>(() => {
    const saved = localStorage.getItem('ideapitch_accounts');
    return saved ? JSON.parse(saved) : mockUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUserId = localStorage.getItem('ideapitch_current_user_id');
    const savedAccounts = localStorage.getItem('ideapitch_accounts');
    const userList: User[] = savedAccounts ? JSON.parse(savedAccounts) : mockUsers;
    if (savedUserId) {
      const found = userList.find(u => u.id === savedUserId);
      if (found) return found;
    }
    return defaultUser;
  });

  const [challenges] = useState<Challenge[]>(mockChallenges);
  const [activeView, setActiveView] = useState<ViewMode>('explore');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'choose' | 'add_google'>('choose');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedStage, setSelectedStage] = useState<IdeaStage | 'All'>('All');

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      title: 'ML Matchmaker Suggestion',
      message: 'Rahul Sharma has a 94% skill match for AquaSense.',
      time: '10m ago',
      read: false,
      type: 'team'
    },
    {
      id: 'notif_2',
      title: 'AI Score Elevated',
      message: 'EduMind received an AI Innovation Score of 91/100.',
      time: '1h ago',
      read: false,
      type: 'ai'
    },
    {
      id: 'notif_3',
      title: 'Hackathon Registration Open',
      message: 'Climate Tech Challenge prize pool upgraded to ₹2,50,000.',
      time: '3h ago',
      read: false,
      type: 'challenge'
    }
  ]);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('ideapitch_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('ideapitch_ideas', JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem('ideapitch_accounts', JSON.stringify(accounts));
  }, [accounts]);

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

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Google Multi-Account Handlers
  const loginWithGoogle = (params: GoogleLoginParams) => {
    const existing = accounts.find(a => a.email.toLowerCase() === params.email.toLowerCase());
    
    if (existing) {
      setCurrentUser(existing);
      setAuthModalOpen(false);
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

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: params.name || params.email.split('@')[0],
      username: params.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, ''),
      email: params.email,
      googleId: `google_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      authProvider: 'google',
      avatar: chosenAvatar,
      role: params.role || 'Tech Innovator & Builder',
      skills: params.skills || ['Full-Stack', 'AI / ML', 'Product Design'],
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
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const switchAccount = (userId: string) => {
    const target = accounts.find(a => a.id === userId);
    if (target) {
      setCurrentUser(target);
      setAuthModalOpen(false);
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

  // Upvote / Interaction Handlers
  const handleUpvote = (ideaId: string) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    setIdeas(prev =>
      prev.map(item => {
        if (item.id === ideaId) {
          const isUpvoted = item.userUpvoted;
          return {
            ...item,
            upvotes: isUpvoted ? item.upvotes - 1 : item.upvotes + 1,
            userUpvoted: !isUpvoted,
          };
        }
        return item;
      })
    );

    if (selectedIdea && selectedIdea.id === ideaId) {
      setSelectedIdea(prev =>
        prev
          ? {
              ...prev,
              upvotes: prev.userUpvoted ? prev.upvotes - 1 : prev.upvotes + 1,
              userUpvoted: !prev.userUpvoted,
            }
          : null
      );
    }
  };

  const handleToggleInterest = (ideaId: string) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    setIdeas(prev =>
      prev.map(item => {
        if (item.id === ideaId) {
          const isInterested = item.userInterested;
          return {
            ...item,
            interestsCount: isInterested ? item.interestsCount - 1 : item.interestsCount + 1,
            userInterested: !isInterested,
          };
        }
        return item;
      })
    );
  };

  const handleTogglePotential = (ideaId: string) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    setIdeas(prev =>
      prev.map(item => {
        if (item.id === ideaId) {
          const isPotential = item.userPotential;
          return {
            ...item,
            potentialsCount: isPotential ? item.potentialsCount - 1 : item.potentialsCount + 1,
            userPotential: !isPotential,
          };
        }
        return item;
      })
    );
  };

  const addNewIdea = (newPitch: Omit<Idea, 'id' | 'createdAt' | 'views' | 'upvotes' | 'interestsCount' | 'potentialsCount' | 'author' | 'feedbackList' | 'comments' | 'team' | 'tasks'>) => {
    const activeUser = currentUser || defaultUser;

    const created: Idea = {
      ...newPitch,
      id: `idea_${Date.now()}`,
      createdAt: new Date().toISOString(),
      views: 1,
      upvotes: 1,
      userUpvoted: true,
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

    setIdeas(prev => [created, ...prev]);

    // Give reputation reward
    updateUserProfile({ reputation: (activeUser.reputation || 1000) + 100 });

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setActiveView('explore');
    setSelectedIdea(created);
  };

  const addFeedbackToIdea = (ideaId: string, feedbackData: Omit<StructuredFeedback, 'id' | 'userId' | 'userName' | 'userAvatar' | 'createdAt'>) => {
    const activeUser = currentUser || defaultUser;

    const feedback: StructuredFeedback = {
      ...feedbackData,
      id: `fb_${Date.now()}`,
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatar: activeUser.avatar,
      createdAt: new Date().toISOString()
    };

    setIdeas(prev =>
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

    if (selectedIdea && selectedIdea.id === ideaId) {
      setSelectedIdea(prev =>
        prev
          ? {
              ...prev,
              feedbackList: [feedback, ...prev.feedbackList]
            }
          : null
      );
    }
  };

  const addCommentToIdea = (ideaId: string, content: string) => {
    const activeUser = currentUser || defaultUser;

    const newComment: Comment = {
      id: `cm_${Date.now()}`,
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatar: activeUser.avatar,
      content,
      createdAt: new Date().toISOString(),
      likes: 0
    };

    setIdeas(prev =>
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

    if (selectedIdea && selectedIdea.id === ideaId) {
      setSelectedIdea(prev =>
        prev ? { ...prev, comments: [...prev.comments, newComment] } : null
      );
    }
  };

  const applyToTeam = (ideaId: string, role: string) => {
    const activeUser = currentUser || defaultUser;

    const member: TeamMember = {
      userId: activeUser.id,
      name: activeUser.name,
      avatar: activeUser.avatar,
      role,
      status: 'Pending',
      joinedAt: new Date().toISOString().split('T')[0]
    };

    setIdeas(prev =>
      prev.map(item => {
        if (item.id === ideaId) {
          if (item.team.some(m => m.userId === activeUser.id)) return item;
          return { ...item, team: [...item.team, member] };
        }
        return item;
      })
    );

    if (selectedIdea && selectedIdea.id === ideaId) {
      setSelectedIdea(prev =>
        prev && !prev.team.some(m => m.userId === activeUser.id)
          ? { ...prev, team: [...prev.team, member] }
          : prev
      );
    }

    confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
  };

  const approveTeamMember = (ideaId: string, userId: string) => {
    setIdeas(prev =>
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

    if (selectedIdea && selectedIdea.id === ideaId) {
      setSelectedIdea(prev =>
        prev
          ? {
              ...prev,
              team: prev.team.map(m => m.userId === userId ? { ...m, status: 'Member' } : m)
            }
          : null
      );
    }

    confetti({ particleCount: 40, spread: 45, origin: { y: 0.5 } });
  };

  const updateTaskStatus = (ideaId: string, taskId: string, newStatus: KanbanTask['status']) => {
    setIdeas(prev =>
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

    if (selectedIdea && selectedIdea.id === ideaId) {
      setSelectedIdea(prev =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
            }
          : null
      );
    }
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

    setIdeas(prev =>
      prev.map(item => {
        if (item.id === ideaId) {
          return { ...item, tasks: [...item.tasks, newTask] };
        }
        return item;
      })
    );

    if (selectedIdea && selectedIdea.id === ideaId) {
      setSelectedIdea(prev =>
        prev ? { ...prev, tasks: [...prev.tasks, newTask] } : null
      );
    }
  };

  const deleteKanbanTask = (ideaId: string, taskId: string) => {
    setIdeas(prev =>
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

    if (selectedIdea && selectedIdea.id === ideaId) {
      setSelectedIdea(prev =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.filter(t => t.id !== taskId)
            }
          : null
      );
    }
  };

  const submitPitchToChallenge = (ideaId: string, challengeId: string) => {
    const chal = challenges.find(c => c.id === challengeId);
    setIdeas(prev =>
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
        activeView,
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
        loginWithGoogle,
        switchAccount,
        logout,
        removeAccount,
        updateUserProfile,
        handleUpvote,
        handleToggleInterest,
        handleTogglePotential,
        addNewIdea,
        addFeedbackToIdea,
        addCommentToIdea,
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
