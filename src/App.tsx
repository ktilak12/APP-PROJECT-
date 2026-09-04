import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './config/auth';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { EntryPage } from './components/EntryPage';
import { IdeaFeed } from './components/IdeaFeed';
import { PitchStudio } from './components/PitchStudio';
import { IdeaDetailModal } from './components/IdeaDetailModal';
import { CollaboratorMatchmaker } from './components/CollaboratorMatchmaker';
import { KanbanWorkspace } from './components/KanbanWorkspace';
import { ChallengeLeaderboard } from './components/ChallengeLeaderboard';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { UserProfile } from './components/UserProfile';
import { GoogleAuthModal } from './components/GoogleAuthModal';

const MainContent: React.FC = () => {
  const { activeView, currentUser } = useApp();

  // Strict route guard: without login, user can ONLY access the landing page
  if (!currentUser) {
    return (
      <main style={{ minHeight: 'calc(100vh - 68px)' }}>
        <EntryPage />
        <GoogleAuthModal />
      </main>
    );
  }

  return (
    <main style={{ minHeight: 'calc(100vh - 68px)', paddingBottom: '3rem' }}>
      {activeView === 'entry' && <EntryPage />}
      {activeView === 'explore' && <IdeaFeed />}
      {activeView === 'pitch' && <PitchStudio />}
      {activeView === 'matchmaker' && <CollaboratorMatchmaker />}
      {activeView === 'challenges' && <ChallengeLeaderboard />}
      {activeView === 'workspace' && <KanbanWorkspace />}
      {activeView === 'analytics' && <AnalyticsDashboard />}
      {activeView === 'profile' && <UserProfile />}

      <IdeaDetailModal />
      <GoogleAuthModal />
    </main>
  );
};

export function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <MainContent />
        </div>
      </AppProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

