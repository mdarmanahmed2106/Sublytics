import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CreditCard, BarChart3, Activity, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/activity', label: 'Activity', icon: Activity },
];

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 p-6 z-50"
                style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border)' }}>
                <Link to="/dashboard" className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center animate-pulse-glow"
                        style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))' }}>
                        <CreditCard size={20} color="white" />
                    </div>
                    <span className="text-xl font-bold gradient-text">SubsTracker</span>
                </Link>

                <nav className="flex-1 flex flex-col gap-1">
                    {navItems.map(({ path, label, icon: Icon }) => {
                        const isActive = location.pathname.startsWith(path);
                        return (
                            <Link key={path} to={path}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                                style={{
                                    background: isActive ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                                    color: isActive ? 'var(--accent-purple-light)' : 'var(--text-secondary)',
                                }}>
                                <Icon size={20} />
                                <span className="font-medium">{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))' }}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all duration-200 cursor-pointer"
                        style={{ color: 'var(--red)', background: 'transparent' }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(239,68,68,0.1)'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                        <LogOut size={18} />
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Top Bar */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-50"
                style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                <Link to="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))' }}>
                        <CreditCard size={16} color="white" />
                    </div>
                    <span className="font-bold gradient-text">SubsTracker</span>
                </Link>
                <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 cursor-pointer" style={{ color: 'var(--text-primary)', background: 'none', border: 'none' }}>
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Mobile Dropdown */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40 pt-16" onClick={() => setMobileOpen(false)}>
                    <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} />
                    <div className="relative p-4 flex flex-col gap-1" style={{ background: 'var(--bg-card)' }}>
                        {navItems.map(({ path, label, icon: Icon }) => {
                            const isActive = location.pathname.startsWith(path);
                            return (
                                <Link key={path} to={path} onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                                    style={{
                                        background: isActive ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                                        color: isActive ? 'var(--accent-purple-light)' : 'var(--text-secondary)',
                                    }}>
                                    <Icon size={20} />
                                    <span className="font-medium">{label}</span>
                                </Link>
                            );
                        })}
                        <button onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full cursor-pointer"
                            style={{ color: 'var(--red)', background: 'transparent', border: 'none', textAlign: 'left' }}>
                            <LogOut size={18} /><span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Bottom Tab Bar */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16"
                style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
                {navItems.map(({ path, label, icon: Icon }) => {
                    const isActive = location.pathname.startsWith(path);
                    return (
                        <Link key={path} to={path} className="flex flex-col items-center gap-1 py-2 px-3"
                            style={{ color: isActive ? 'var(--accent-purple-light)' : 'var(--text-muted)' }}>
                            <Icon size={20} />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
};

export default Navbar;
