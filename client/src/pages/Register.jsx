import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { registerUser } from '../api/api';
import { CreditCard, Mail, Lock, User, ArrowRight } from 'lucide-react';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await registerUser(form);
            login(data.data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-15 blur-3xl"
                    style={{ background: 'var(--accent-orange)' }} />
                <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full opacity-10 blur-3xl"
                    style={{ background: 'var(--accent-coral)' }} />
            </div>

            <div className="w-full max-w-md animate-fade-in-up relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 animate-pulse-glow"
                        style={{ background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-coral))' }}>
                        <CreditCard size={28} color="white" />
                    </div>
                    <h1 className="text-3xl font-bold gradient-text">SubsTracker</h1>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Start tracking your subscriptions</p>
                </div>

                <div className="glass-card p-8">
                    <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Create an account</h2>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                                <input type="text" required value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                                    style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-orange)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                                <input type="email" required value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                                    style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-orange)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                                <input type="password" required value={form.password} minLength={6}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="At least 6 characters"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                                    style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-orange)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer mt-2"
                            style={{
                                background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-coral))',
                                color: 'white', border: 'none', opacity: loading ? 0.7 : 1,
                                boxShadow: '0 4px 15px rgba(255,107,53,0.25)',
                            }}>
                            {loading ? 'Creating account...' : <><span>Create Account</span><ArrowRight size={16} /></>}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium" style={{ color: 'var(--accent-orange)' }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
