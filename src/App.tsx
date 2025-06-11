import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { IssueAuthProvider } from "@/contexts/IssueAuthContext";
import { useAuth } from "@/contexts/AuthContext";
import ComprehensiveHome from './pages/ComprehensiveIndex';
import Dashboard from '@/components/ComprehensiveDashboard';
import FeedbackManagement from '@/components/FeedbackManagement';
import IssueEndorsement from '@/components/IssueEndorsement';
import Login from "./pages/Login";
import BankEmployeeAnalytics from '@/components/BankEmployeeAnalytics';
import UserProfile from '@/components/UserProfile';
import NotFound from './pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
    },
  },
});

const MainLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const isAdmin = user?.role === 'admin';
    
    // Base navigation items
    const items = [
      { name: 'Home', key: 'home', icon: '🏠', path: '/', show: !isAdmin },
      { name: 'Dashboard', key: 'dashboard', icon: '📊', path: '/dashboard', show: !isAdmin },
      { name: 'Feedback', key: 'feedback', icon: '💬', path: '/feedback', show: !isAdmin },
      { name: 'Issues', key: 'issues', icon: '🎯', path: '/issues', show: isAdmin }, // Only admin sees this
      { name: 'Employees', key: 'employees', icon: '👥', path: '/employees', show: !isAdmin },
    ];
    
    return items.filter(item => item.show);
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50">
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">Mau Bank</span>
              <span className="text-sm text-gray-500 ml-2">VoC Analysis</span>
            </div> 

            {/* Navigation Menu */}
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-4">
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.key}>
                    <Link
                      to={item.path}
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      )}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.name}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* User Profile Menu */}
            <div className="flex items-center">
              <Link
                to="/profile"
                className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <span className="mr-2">👤</span>
                <span className="text-sm font-medium">{user?.username || 'Profile'}</span>
              </Link>
              <button 
                onClick={() => logout()}
                className="ml-4 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-16">
        <Routes>
          {/* Admin can only access Issues */}
          {user?.role === 'admin' ? (
            <>
              <Route path="/issues" element={<IssueEndorsement />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="*" element={<Navigate to="/issues" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<ComprehensiveHome />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/feedback" element={<FeedbackManagement />} />
              <Route path="/issues" element={<Navigate to="/" replace />} /> {/* Redirect from issues */}
              <Route path="/employees" element={<BankEmployeeAnalytics />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="*" element={<NotFound />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <IssueAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                } />
              </Routes>
            </Router>
          </TooltipProvider>
        </IssueAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
