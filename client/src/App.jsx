import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeProvider';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Subscriptions from './pages/Subscriptions';
import SubscriptionForm from './pages/SubscriptionForm';
import SubscriptionDetail from './pages/SubscriptionDetail';
import Analytics from './pages/Analytics';
import ActivityFeed from './pages/ActivityFeed';
import Profile from './pages/Profile';

/* Layout wrapper — sidebar + main content area */
const AppLayout = () => (
  <>
    <div className="bg-glow" />
    <Navbar />
    <main className="desktop-main">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Outlet />
      </div>
    </main>
  </>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected */}
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/subscriptions/new" element={<SubscriptionForm />} />
                <Route path="/subscriptions/:id" element={<SubscriptionDetail />} />
                <Route path="/subscriptions/:id/edit" element={<SubscriptionForm />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/activity" element={<ActivityFeed />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Redirect root */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
