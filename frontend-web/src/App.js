import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import OnboardingFlow from './components/OnboardingFlow';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import FamilyPage from './pages/FamilyPage';
import StoryPage from './pages/StoryPage';
import FeedPage from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import ReelsPage from './pages/ReelsPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import ShopPage from './pages/ShopPage';
import SavedPage from './pages/SavedPage';
import LivePage from './pages/LivePage';
import SettingsPage from './pages/SettingsPage';
import TestPage from './TestPage';
import './App.css';
import './kinkeep-theme.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, needsOnboarding, user, completeOnboarding } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#fafafa'}}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{borderColor: '#0095f6'}}></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (needsOnboarding) {
    return <OnboardingFlow user={user} onComplete={completeOnboarding} />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#fafafa'}}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{borderColor: '#0095f6'}}></div>
      </div>
    );
  }
  
  return isAuthenticated ? <Navigate to="/feed" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen" style={{backgroundColor: '#fafafa'}}>
          <Routes>
            <Route path="/" element={<Navigate to="/feed" />} />
            <Route path="/dashboard" element={<Navigate to="/feed" />} />
            <Route path="/test" element={<TestPage />} />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/feed" 
              element={
                <ProtectedRoute>
                  <FeedPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/explore" 
              element={
                <ProtectedRoute>
                  <ExplorePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reels" 
              element={
                <ProtectedRoute>
                  <ReelsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/live" 
              element={
                <ProtectedRoute>
                  <LivePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/shop" 
              element={
                <ProtectedRoute>
                  <ShopPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/saved" 
              element={
                <ProtectedRoute>
                  <SavedPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/family/:familyId" 
              element={
                <ProtectedRoute>
                  <FamilyPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/story/:storyId" 
              element={
                <ProtectedRoute>
                  <StoryPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;