import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/api';
import { useAuth } from '../context/useAuth';
import {
    Lock, Mail, AlertCircle, ArrowRight,
    BarChart3, Shield, Zap, TrendingUp,
    Github
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

    return (
        <div className="auth-split-layout">

            {/* Left — Brand Panel */}
            <div className="auth-split-brand">
                <div className="brand-bg-pattern" />
                <div className="brand-glow-1" />
                <div className="brand-glow-2" />

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
                        Master your <br />
                        <span className="gradient-text-vivid">recurring expenses</span>
                    </h1>
                    <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 40, maxWidth: 400 }}>
                        Stop paying for things you don't use. Track, analyze, and optimize your subscriptions with intelligent insights.
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
                    <div style={{ display: 'none', alignItems: 'center', gap: 10, marginBottom: 32 }} className="mobile-logo-header">
                        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: '#14B8A6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BarChart3 size={20} color="#fff" strokeWidth={2.5} />
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, margin: 0, color: '#14B8A6' }}>
                            Sublytics
                        </h1>
                    </div>

                    <div style={{ animation: 'fadeInUp 0.6s ease forwards' }}>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em' }}>
                            Welcome back
                        </h2>
                        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>
                            Enter your credentials to access your account
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

                        <div style={{ opacity: 0, animation: 'fadeInUp 0.6s ease 0.2s forwards' }}>
                            <div className="input-floating-group">
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
                        </div>

                        {/* Forgot Password Link */}
                        <div style={{ opacity: 0, animation: 'fadeInUp 0.6s ease 0.25s forwards', display: 'flex', justifyContent: 'flex-end', marginBottom: 24, marginTop: -8 }}>
                            <span style={{ fontSize: 13, color: 'var(--accent-light)', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s' }} className="hover:text-accent">Forgot password?</span>
                        </div>

                        <div style={{ opacity: 0, animation: 'fadeInUp 0.6s ease 0.3s forwards' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: 48, fontSize: 15, opacity: loading ? .7 : 1 }} disabled={loading}>
                                {loading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span className="spinner-sm spinner" /> Signing in…
                                    </span>
                                ) : (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Sign In <ArrowRight size={16} /></span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div style={{ opacity: 0, animation: 'fadeInUp 0.6s ease 0.4s forwards' }}>
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

                    <p style={{ opacity: 0, animation: 'fadeInUp 0.6s ease 0.5s forwards', fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', marginTop: 32 }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--accent-light)', fontWeight: 600, transition: 'color 0.15s' }}>Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
