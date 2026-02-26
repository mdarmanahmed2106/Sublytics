import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/api';
import { useAuth } from '../context/useAuth';
import {
    CreditCard, Lock, Mail, AlertCircle, ArrowRight,
    BarChart3, Shield, Zap,
} from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Please fill in all fields'); return; }
        setLoading(true);
        try {
            const { data } = await loginUser({ email, password });
            login(data.data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Invalid credentials');
        } finally { setLoading(false); }
    };

    const features = [
        { icon: BarChart3, title: 'Smart Analytics', desc: 'Visualize spending patterns with interactive charts' },
        { icon: Shield, title: 'Secure Tracking', desc: 'Your data is encrypted and protected' },
        { icon: Zap, title: 'Instant Insights', desc: 'Get actionable recommendations to save money' },
    ];

    return (
        <div className="auth-page">
            {/* Background Orbs */}
            <div className="auth-orb auth-orb-1" />
            <div className="auth-orb auth-orb-2" />
            <div className="auth-orb auth-orb-3" />

            {/* Left — Brand Panel (desktop only) */}
            <div className="auth-brand-panel">
                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
                        <div
                            className="anim-pulse-glow"
                            style={{
                                width: 48, height: 48, borderRadius: 'var(--radius-sm)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: '#14B8A6',
                            }}
                        >
                            <BarChart3 size={24} color="#fff" strokeWidth={2.5} />
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.02em', color: '#14B8A6' }}>
                            Sublytics
                        </h1>
                    </div>

                    {/* Headline */}
                    <h1 style={{
                        fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700,
                        lineHeight: 1.2, letterSpacing: '-0.03em', color: 'var(--text-primary)',
                        marginBottom: 12,
                    }}>
                        Take control of your{' '}
                        <span className="gradient-text-vivid">subscriptions</span>
                    </h1>
                    <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 40, maxWidth: 380 }}>
                        Track, analyze, and optimize your recurring expenses. Never lose sight of where your money goes.
                    </p>

                    {/* Features */}
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
                    {/* Logo (mobile only shows here) */}
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
                        Welcome back
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 32 }}>
                        Sign in to your account
                    </p>

                    {error && (
                        <div className="alert-error" style={{ marginBottom: 16 }}>
                            <AlertCircle size={15} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
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
                                <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ paddingLeft: 40 }} />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8, height: 46, opacity: loading ? .7 : 1 }} disabled={loading}>
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span className="spinner-sm spinner" /> Signing in…
                                </span>
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Sign In <ArrowRight size={16} /></span>
                            )}
                        </button>
                    </form>

                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', marginTop: 28 }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--accent-light)', fontWeight: 600, transition: 'color 0.15s' }}>Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
