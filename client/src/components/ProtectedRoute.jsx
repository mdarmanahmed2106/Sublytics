import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100vh', color: 'var(--text-muted)', fontSize: 14,
            }}>
                <span className="spinner" style={{ width: 24, height: 24 }} />
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
