import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/api';
import { useAuth } from '../context/useAuth';
import {
    CreditCard, User, Lock, Mail, AlertCircle, ArrowRight,
    TrendingUp, PieChart, Bell,
} from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!name || !email || !password) { setError('All fields are required'); return; }
        if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
        setLoading(true);
        try {
            const { data } = await registerUser({ name, email, password });
            login(data.data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Registration failed');
        } finally { setLoading(false); }
    };

    /* Password strength */
    const getStrength = () => {
        if (!password) return { width: '0%', color: 'transparent', label: '' };
        if (password.length < 6) return { width: '25%', color: 'var(--danger)', label: 'Weak' };
        if (password.length < 10) return { width: '60%', color: 'var(--warning)', label: 'Medium' };
        return { width: '100%', color: 'var(--success)', label: 'Strong' };
    };
    const strength = getStrength();

    const features = [
        { icon: TrendingUp, title: 'Spending Trends', desc: 'Track how your spending changes month over month' },
        { icon: PieChart, title: 'Category Breakdown', desc: 'See where your money goes across categories' },
        { icon: Bell, title: 'Activity Tracking', desc: 'Full audit log of all subscription changes' },
    ];

    return (
        <div className="auth-page">
            {/* Background Orbs */}
            <div className="auth-orb auth-orb-1" style={{ top: 'auto', bottom: '-150px', left: 'auto', right: '-100px' }} />
            <div className="auth-orb auth-orb-2" style={{ bottom: 'auto', top: '-100px', right: 'auto', left: '-80px' }} />
            <div className="auth-orb auth-orb-3" />

            {/* Left — Brand Panel (desktop only) */}
            <div className="auth-brand-panel">
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
                        <div className="anim-pulse-glow" style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: '#14B8A6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BarChart3 size={24} color="#fff" strokeWidth={2.5} />
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.02em', color: '#14B8A6' }}>
                            Sublytics
                        </h1>
                    </div>

                    <h1 style={{
                        fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700,
                        lineHeight: 1.2, letterSpacing: '-0.03em', color: 'var(--text-primary)',
                        marginBottom: 12,
                    }}>
                        Start your{' '}
                        <span className="gradient-text-vivid">financial journey</span>
                    </h1>
                    <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 40, maxWidth: 380 }}>
                        Join thousands who've taken control of their recurring expenses and saved more every month.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {features.map((f, i) => (
                            <div key={i} className="auth-feature anim-fade-up" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
                                <div className="auth-feature-icon">
                                    <f.icon size={16} color="var(--accent-light)" />
                                </div>
                                <div className="auth-feature-text">
                                    <h4>{f.title}</h4>
                                    <p>{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right — Form Panel */}
            <div className="auth-form-panel">
                <div className="card-glass anim-scale" style={{ width: '100%', maxWidth: 420, padding: '44px 36px', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
                        <div
                            className="anim-pulse-glow"
                            style={{
                                width: 44, height: 44, borderRadius: 'var(--radius-sm)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'var(--accent-gradient-vivid)',
                            }}
                        >
                            <CreditCard size={20} color="#fff" />
                        </div>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, textAlign: 'center', color: 'var(--text-primary)', marginBottom: 4, letterSpacing: '-0.02em' }}>
                        Create Account
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 32 }}>
                        Start tracking your subscriptions
                    </p>

                    {error && (
                        <div className="alert-error" style={{ marginBottom: 16 }}>
                            <AlertCircle size={15} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <div>
                            <label className="label">Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" style={{ paddingLeft: 40 }} />
                            </div>
                        </div>

                        <div>
                            <label className="label">Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{ paddingLeft: 40 }} />
                            </div>
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" style={{ paddingLeft: 40 }} />
                            </div>
                            {/* Password strength bar */}
                            {password && (
                                <div style={{ marginTop: 8 }}>
                                    <div className="progress-bar">
                                        <div className="progress-bar-fill" style={{ width: strength.width, background: strength.color }} />
                                    </div>
                                    <p style={{ fontSize: 11, color: strength.color, marginTop: 4, fontWeight: 500 }}>{strength.label}</p>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8, height: 46, opacity: loading ? .7 : 1 }} disabled={loading}>
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span className="spinner-sm spinner" /> Creating…
                                </span>
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Create Account <ArrowRight size={16} /></span>
                            )}
                        </button>
                    </form>

                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', marginTop: 28 }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
