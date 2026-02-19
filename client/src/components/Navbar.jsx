import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { LayoutDashboard, CreditCard, BarChart3, Activity, LogOut, Menu, X, UserCircle2, Plus } from 'lucide-react';
import { useState } from 'react';

const primaryTabs = [
    { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { path: '/subscriptions', label: 'Subs', icon: CreditCard },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/profile', label: 'Profile', icon: UserCircle2 },
];

const navItems = [
    ...primaryTabs,
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
            <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 z-50"
                style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>

                {/* Logo */}
                <div className="p-6 pb-2">
                    <Link to="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center animate-pulse-glow"
                            style={{ background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-coral))' }}>
                            <CreditCard size={18} color="white" />
                        </div>
                        <span className="text-lg font-bold gradient-text">SubsTracker</span>
                    </Link>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 p-4 flex flex-col gap-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link key={item.path} to={item.path}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                                style={{
                                    background: isActive ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
                                    color: isActive ? 'var(--accent-orange)' : 'var(--text-secondary)',
                                }}>
                                <item.icon size={19} />
                                <span className="text-sm font-medium">{item.label}</span>
                                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-orange)' }} />}
                            </Link>
                        );
                    })}

                    {/* Add Button */}
                    <Link to="/subscriptions/new"
                        className="gradient-btn flex items-center justify-center gap-2 px-4 py-3 rounded-xl mt-4 text-sm font-medium">
                        <Plus size={18} /> Add Subscription
                    </Link>
                </nav>

                {/* User Section */}
                <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-coral))', color: 'white' }}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden flex-1">
                            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                            <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl w-full transition-all duration-200 cursor-pointer text-sm"
                        style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = 'var(--red)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                        <LogOut size={16} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Top Bar */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-4 z-50"
                style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                <Link to="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-coral))' }}>
                        <CreditCard size={14} color="white" />
                    </div>
                    <span className="font-bold text-sm gradient-text">SubsTracker</span>
                </Link>
                <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 cursor-pointer" style={{ color: 'var(--text-primary)', background: 'none', border: 'none' }}>
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </header>

            {/* Mobile Dropdown Menu */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40 pt-14 animate-fade-in" onClick={() => setMobileOpen(false)}>
                    <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} />
                    <div className="relative p-3 flex flex-col gap-1" style={{ background: 'var(--bg-secondary)' }}>
                        {navItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                                <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                                    style={{
                                        background: isActive ? 'rgba(255,107,53,0.1)' : 'transparent',
                                        color: isActive ? 'var(--accent-orange)' : 'var(--text-secondary)',
                                    }}>
                                    <item.icon size={18} />
                                    <span className="font-medium text-sm">{item.label}</span>
                                </Link>
                            );
                        })}
                        <button onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full cursor-pointer"
                            style={{ color: 'var(--red)', background: 'transparent', border: 'none', textAlign: 'left' }}>
                            <LogOut size={18} /><span className="font-medium text-sm">Logout</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Bottom Tab Bar — Trackizer Style */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
                style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
                <div className="flex items-end justify-around h-16 relative">
                    {primaryTabs.map((item, idx) => {
                        const isActive = location.pathname.startsWith(item.path);
                        // Insert floating add button in the middle
                        if (idx === 2) {
                            return (
                                <div key="add-btn-group" className="flex items-end gap-0">
                                    {/* Floating Add Button */}
                                    <Link to="/subscriptions/new"
                                        className="w-12 h-12 rounded-full flex items-center justify-center -mt-5 mx-3 shadow-lg"
                                        style={{
                                            background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-coral))',
                                            boxShadow: '0 4px 20px rgba(255,107,53,0.3)',
                                        }}>
                                        <Plus size={22} color="white" />
                                    </Link>
                                    <Link to={item.path} className="flex flex-col items-center gap-0.5 pb-2 px-3 pt-2"
                                        style={{ color: isActive ? 'var(--accent-orange)' : 'var(--text-muted)' }}>
                                        <item.icon size={20} />
                                        <span className="text-[10px] font-medium">{item.label}</span>
                                    </Link>
                                </div>
                            );
                        }
                        return (
                            <Link key={item.path} to={item.path} className="flex flex-col items-center gap-0.5 pb-2 px-3 pt-2"
                                style={{ color: isActive ? 'var(--accent-orange)' : 'var(--text-muted)' }}>
                                <item.icon size={20} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
};

export default Navbar;
