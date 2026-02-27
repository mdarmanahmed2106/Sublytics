import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/api';
import { useAuth } from '../context/useAuth';
import {
    User, Lock, Mail, AlertCircle, ArrowRight,
    BarChart3, Shield, Zap, TrendingUp, Github
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

    return (
        <div className="auth-split-layout">

            {/* Left — Brand Panel */}
            <div className="auth-split-brand">
                <div className="brand-bg-pattern" />
                <div className="brand-glow-1" style={{ animationDelay: '-5s' }} />
                <div className="brand-glow-2" style={{ animationDelay: '-2s' }} />

                {/* Floating Decorative Cards */}
                <div className="brand-feature-card" style={{ top: '15%', left: '10%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="icon-box icon-box-sm" style={{ background: 'var(--accent-glow)', color: 'var(--accent-light)', borderColor: 'var(--border-accent)' }}>
                            <TrendingUp size={18} />
                        </div>
                        <div>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Monthly Savings</p>
                            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>+$124.00</p>
                        </div>
                    </div>
                </div>

                <div className="brand-feature-card" style={{ bottom: '25%', right: '15%', animationDelay: '1s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="icon-box icon-box-sm" style={{ background: 'var(--danger-glow)', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                            <Zap size={18} />
                        </div>
                        <div>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Action Required</p>
                            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Cancel unused apps</p>
                        </div>
                    </div>
                </div>

                <div style={{ position: 'relative', zIndex: 10, maxWidth: 480, padding: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
                        <div className="anim-pulse-glow" style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: '#14B8A6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BarChart3 size={24} color="#fff" strokeWidth={2.5} />
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.02em', color: '#14B8A6' }}>
                            Sublytics
                        </h1>
                    </div>

                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#fff', marginBottom: 20 }}>
                        Start your <br />
                        <span className="gradient-text-vivid">financial journey</span>
                    </h1>
                    <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 40, maxWidth: 400 }}>
                        Join thousands who've taken control of their recurring expenses and saved more every month.
                    </p>

                    <div style={{ display: 'flex', gap: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Shield size={16} color="var(--success)" />
                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Bank-level Security</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Zap size={16} color="var(--warning)" />
                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Smart Alerts</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right — Form Container */}
            <div className="auth-split-form">
                <div className="auth-form-container">

                    {/* Mobile Logo Only */}
                    <div className="lg:hidden" style={{ display: 'none', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: '#14B8A6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BarChart3 size={20} color="#fff" strokeWidth={2.5} />
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, margin: 0, color: '#14B8A6' }}>
                            Sublytics
                        </h1>
                    </div>

                    <div style={{ animation: 'fadeInUp 0.6s ease forwards' }}>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em' }}>
                            Create Account
                        </h2>
                        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>
                            Start tracking your subscriptions
                        </p>
                    </div>

                    {error && (
                        <div className="alert-error" style={{ marginBottom: 24, animation: 'fadeIn 0.4s ease' }}>
                            <AlertCircle size={15} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ opacity: 0, animation: 'fadeInUp 0.6s ease 0.1s forwards' }}>
                            <div className="input-floating-group">
                                <input
                                    type="text"
                                    className={`input-floating ${name ? 'has-value' : ''}`}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder=" "
                                    required
                                />
                                <label className="input-floating-label">Full Name</label>
                                <User size={16} style={{ position: 'absolute', right: 16, top: 22, color: 'var(--text-muted)', pointerEvents: 'none' }} />
                            </div>
                        </div>

                        <div style={{ opacity: 0, animation: 'fadeInUp 0.6s ease 0.2s forwards' }}>
                            <div className="input-floating-group">
                                <input
                                    type="email"
                                    className={`input-floating ${email ? 'has-value' : ''}`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder=" "
                                    required
                                />
                                <label className="input-floating-label">Email address</label>
                                <Mail size={16} style={{ position: 'absolute', right: 16, top: 22, color: 'var(--text-muted)', pointerEvents: 'none' }} />
                            </div>
                        </div>

                        <div style={{ opacity: 0, animation: 'fadeInUp 0.6s ease 0.3s forwards' }}>
                            <div className="input-floating-group" style={{ marginBottom: password ? 8 : 24 }}>
                                <input
                                    type="password"
                                    className={`input-floating ${password ? 'has-value' : ''}`}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder=" "
                                    required
                                />
                                <label className="input-floating-label">Password</label>
                                <Lock size={16} style={{ position: 'absolute', right: 16, top: 22, color: 'var(--text-muted)', pointerEvents: 'none' }} />
                            </div>

                            {/* Animated Password strength bar integrated tightly */}
                            {password && (
                                <div style={{ marginBottom: 24, animation: 'fadeIn 0.3s ease' }}>
                                    <div className="progress-bar" style={{ height: 4, background: 'var(--border-light)', borderRadius: 2 }}>
                                        <div className="progress-bar-fill" style={{ width: strength.width, background: strength.color, height: '100%', borderRadius: 2, transition: 'all 0.3s ease' }} />
                                    </div>
                                    <p style={{ fontSize: 11, color: strength.color, marginTop: 4, fontWeight: 500 }}>{strength.label}</p>
                                </div>
                            )}
                        </div>

                        <div style={{ opacity: 0, animation: 'fadeInUp 0.6s ease 0.4s forwards' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: 48, fontSize: 15, opacity: loading ? .7 : 1 }} disabled={loading}>
                                {loading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span className="spinner-sm spinner" /> Creating…
                                    </span>
                                ) : (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Create Account <ArrowRight size={16} /></span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div style={{ opacity: 0, animation: 'fadeInUp 0.6s ease 0.5s forwards' }}>
                        <div className="auth-divider">or continue with</div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button type="button" className="btn-social" onClick={() => { }} >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                            <button type="button" className="btn-social" onClick={() => { }}>
                                <Github size={18} />
                                GitHub
                            </button>
                        </div>
                    </div>

                    <p style={{ opacity: 0, animation: 'fadeInUp 0.6s ease 0.6s forwards', fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', marginTop: 32 }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--accent-light)', fontWeight: 600, transition: 'color 0.15s' }}>Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
