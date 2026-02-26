import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/ThemeProvider';
import {
    LayoutDashboard, CreditCard, BarChart3, Activity,
    LogOut, Plus, Settings, Sun, Moon
} from 'lucide-react';

const sidebarLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/activity', label: 'Activity', icon: Activity },
    { path: '/profile', label: 'Settings', icon: Settings },
];
const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) =>
        path === '/dashboard'
            ? location.pathname === '/dashboard'
            : location.pathname.startsWith(path);

    const handleLogout = () => { logout(); navigate('/login'); };
    const initial = (user?.name || user?.email || '?').charAt(0).toUpperCase();

    /* ─────── Sidebar (Desktop) ─────── */
    const sidebar = (
        <aside
            className="hidden lg:flex flex-col fixed left-0 top-0 h-screen z-50"
            style={{
                width: '260px',
                background: 'var(--bg-glass-strong)',
                backdropFilter: 'blur(24px) saturate(150%)',
                WebkitBackdropFilter: 'blur(24px) saturate(150%)',
                borderRight: '1px solid var(--border)',
            }}
        >
            {/* Logo */}
            <div style={{ padding: '28px 24px 20px' }}>
                <Link to="/dashboard" className="flex items-center gap-3">
                    <div
                        className="anim-pulse-glow"
                        style={{
                            width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: '#14B8A6',
                        }}
                    >
                        <BarChart3 size={18} color="#fff" strokeWidth={2.5} />
                    </div>
                    <span
                        style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', color: '#14B8A6' }}
                    >
                        Sublytics
                    </span>
                </Link>
            </div>

            {/* Navigation Links */}
            <nav style={{ flex: 1, padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {sidebarLinks.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '11px 16px', borderRadius: 'var(--radius-sm)',
                                fontSize: '14px', fontWeight: active ? 600 : 500,
                                color: active ? 'var(--accent-light)' : 'var(--text-secondary)',
                                background: active ? 'var(--accent-subtle)' : 'transparent',
                                borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
                                transition: 'all 0.2s var(--ease-smooth)',
                                position: 'relative',
                            }}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                            {active && (
                                <div
                                    style={{
                                        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                        width: 6, height: 6, borderRadius: '50%',
                                        background: 'var(--accent)',
                                        boxShadow: '0 0 10px var(--accent-glow)',
                                    }}
                                />
                            )}
                        </Link>
                    );
                })}

                {/* Add Button */}
                <Link
                    to="/subscriptions/new"
                    className="btn btn-primary"
                    style={{ marginTop: '20px', justifyContent: 'center' }}
                >
                    <Plus size={18} /> Add Subscription
                </Link>
            </nav>

            {/* User Section & Theme Toggle */}
            <div style={{ borderTop: '1px solid var(--border)', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '0 4px' }}>
                    <div
                        style={{
                            width: 38, height: 38, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'var(--accent-gradient-vivid)',
                            color: '#fff', fontSize: '14px', fontWeight: 700,
                            flexShrink: 0,
                            boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.15)',
                        }}
                    >
                        {initial}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.name}
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.email}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={toggleTheme}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '40px', padding: '10px 0', borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-muted)',
                            background: 'var(--bg-elevated)', border: '1px solid var(--border)', cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-light)'; e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.background = 'var(--accent-subtle)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-elevated)' }}
                    >
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>

                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            flex: 1, padding: '10px 8px', borderRadius: 'var(--radius-sm)',
                            fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)',
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'var(--danger-glow)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </div>
        </aside>
    );


    return (
        <>
            {sidebar}
        </>
    );
};

export default Navbar;
