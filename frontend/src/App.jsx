import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import SupportPortal from './pages/SupportPortal';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import VendorDashboard from './pages/VendorDashboard';
import ConsumerDashboard from './pages/ConsumerDashboard';
import SupportLogin from './pages/SupportLogin';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import BlogPost from './pages/BlogPost';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { BrandingProvider } from '@/contexts/BrandingContext';
import { HelmetProvider } from 'react-helmet-async';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      {/* Portal routes — NO layout wrapper (no main site header/footer) */}
      <Route path="/SupportPortal" element={<SupportPortal />} />
      <Route path="/AdminLogin" element={<AdminLogin />} />
      <Route path="/AdminDashboard" element={<AdminDashboard />} />
      <Route path="/VendorDashboard" element={<VendorDashboard />} />
      <Route path="/ConsumerDashboard" element={<ConsumerDashboard />} />
      <Route path="/SupportLogin" element={<SupportLogin />} />
      
      {/* Property routes with layout */}
      <Route path="/properties" element={
        <LayoutWrapper currentPageName="properties">
          <Properties />
        </LayoutWrapper>
      } />
      <Route path="/property/:id" element={
        <LayoutWrapper currentPageName="property-detail">
          <PropertyDetail />
        </LayoutWrapper>
      } />

      {/* Blog routes with layout */}
      <Route path="/blog/:slug" element={
        <LayoutWrapper currentPageName="blog-post">
          <BlogPost />
        </LayoutWrapper>
      } />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <HelmetProvider>
      <AuthProvider>
        <BrandingProvider>
          <QueryClientProvider client={queryClientInstance}>
            <Router>
              <AuthenticatedApp />
            </Router>
            <Toaster />
          </QueryClientProvider>
        </BrandingProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App