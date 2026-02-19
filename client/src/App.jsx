import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Subscriptions from './pages/Subscriptions';
import SubscriptionForm from './pages/SubscriptionForm';
import SubscriptionDetail from './pages/SubscriptionDetail';
import Analytics from './pages/Analytics';
import ActivityFeed from './pages/ActivityFeed';

const AppLayout = () => (
  <>
    <Navbar />
    <main className="lg:ml-64 pt-20 lg:pt-6 pb-20 lg:pb-6 px-4 lg:px-8 min-h-screen">
      <Outlet />
    </main>
  </>
);

function App() {
  return (
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
          </Route>

          {/* Redirect root */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
