import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContextProvider, useAuth, useNotifications, useTheme } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import './index.css';

// Lazy load components for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Auth = React.lazy(() => import('./pages/Auth'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const Profile = React.lazy(() => import('./pages/Profile'));
const PriceTracker = React.lazy(() => import('./components/priceTracker'));
const CropGuide = React.lazy(() => import('./components/CropGuide'));
const DiseaseDetector = React.lazy(() => import('./components/DiseaseDetector'));
const CostCalculator = React.lazy(() => import('./components/CostCalculator'));
const Chatbot = React.lazy(() => import('./components/Chatbot'));
const IoTPlaceholder = React.lazy(() => import('./components/IoTPlaceholder'));
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading Krishi Sahayak...</p>
    </motion.div>
  </div>
);

// Notification component
const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`max-w-sm w-full p-4 rounded-lg shadow-lg border-l-4 ${
              notification.type === 'success' ? 'bg-white border-green-500' :
              notification.type === 'error' ? 'bg-white border-red-500' :
              notification.type === 'warning' ? 'bg-white border-yellow-500' :
              'bg-white border-blue-500'
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-2xl">
                  {notification.type === 'success' ? '✅' :
                   notification.type === 'error' ? '❌' :
                   notification.type === 'warning' ? '⚠️' : 'ℹ️'}
                </span>
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                {notification.message && (
                  <p className="mt-1 text-sm text-gray-500">
                    {notification.message}
                  </p>
                )}
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Protected Route component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Layout component
const Layout = ({ children, showHeader = true, showFooter = true }) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme}`}>
      {showHeader && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
      <NotificationContainer />
    </div>
  );
};

// Main App component
const AppContent = () => {
  const { isLoading } = useAuth();

  useEffect(() => {
    // Set up global error handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });

    // Set up offline/online handlers
    const handleOnline = () => {
      console.log('App is online');
    };

    const handleOffline = () => {
      console.log('App is offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('unhandledrejection', () => {});
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <Layout>
                <Home />
              </Layout>
            } 
          />
          
          <Route 
            path="/auth" 
            element={
              <PublicRoute>
                <Layout showHeader={false} showFooter={false}>
                  <Auth />
                </Layout>
              </PublicRoute>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/prices" 
            element={
              <Layout>
                <PriceTracker />
              </Layout>
            } 
          />

          <Route 
            path="/crop-guide" 
            element={
              <Layout>
                <CropGuide />
              </Layout>
            } 
          />

          <Route 
            path="/disease-detection" 
            element={
              <Layout>
                <DiseaseDetector />
              </Layout>
            } 
          />

          <Route 
            path="/cost-calculator" 
            element={
              <Layout>
                <CostCalculator />
              </Layout>
            } 
          />

          <Route 
            path="/chatbot" 
            element={
              <Layout>
                <Chatbot />
              </Layout>
            } 
          />

          <Route 
            path="/iot" 
            element={
              <Layout>
                <IoTPlaceholder />
              </Layout>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <AdminPanel />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* 404 Route */}
          <Route 
            path="*" 
            element={
              <Layout>
                <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🌾</div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
                    <p className="text-xl text-gray-600 mb-8">
                      The page you're looking for doesn't exist in our fields.
                    </p>
                    <button
                      onClick={() => window.location.href = '/'}
                      className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              </Layout>
            } 
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

// Root App component with providers
const App = () => {
  return (
    <AppContextProvider>
      <AppContent />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AppContextProvider>
  );
};

export default App;
