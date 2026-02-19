import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { Link } from 'react-router-dom';
import { getAnalyticsSummary, getAnalyticsByCategory, getAnalyticsInsights } from '../api/api';
import { TrendingUp, CreditCard, IndianRupee, BarChart3, Lightbulb, AlertTriangle, CheckCircle, Info, ChevronRight } from 'lucide-react';

const COLORS = ['#FF6B35', '#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EC4899'];

const CircularGauge = ({ value, max, size = 200, strokeWidth = 10 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const pct = max > 0 ? Math.min(value / max, 1) : 0;
    const dashOffset = circumference * (1 - pct);

    return (
        <div className="circular-gauge" style={{ width: size, height: size }}>
            <svg width={size} height={size}>
                <defs>
                    <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF6B35" />
                        <stop offset="100%" stopColor="#FF4E6A" />
                    </linearGradient>
                </defs>
                <circle cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
                <circle cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke="url(#gaugeGrad)" strokeWidth={strokeWidth}
                    strokeDasharray={circumference} strokeDashoffset={dashOffset}
                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
            </svg>
            <div className="gauge-value">
                <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    ₹{value?.toLocaleString('en-IN') || '0'}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>This month's bills</p>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [categories, setCategories] = useState([]);
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [sumRes, catRes, insRes] = await Promise.all([
                    getAnalyticsSummary(),
                    getAnalyticsByCategory(),
                    getAnalyticsInsights(),
                ]);
                setSummary(sumRes.data.data);
                setCategories(catRes.data.data);
                setInsights(insRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-8 w-48" />
                <div className="flex justify-center py-8"><div className="skeleton w-48 h-48 rounded-full" /></div>
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="skeleton h-20" />)}
                </div>
            </div>
        );
    }

    const totalMonthly = summary?.totalMonthly || 0;
    const totalAnnual = summary?.totalAnnual || 0;

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* Circular Gauge — Hero Section */}
            <div className="text-center animate-fade-in-up">
                <div className="flex justify-center mb-2">
                    <CircularGauge value={Math.round(totalMonthly)} max={Math.max(totalMonthly * 1.3, 1000)} size={200} strokeWidth={8} />
                </div>

                {/* Mini Stats Row */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                    {[
                        { label: 'Active subs', value: summary?.activeCount || 0 },
                        { label: 'Highest', value: `₹${summary?.mostExpensive?.cost || 0}` },
                        { label: 'Lowest', value: `₹${summary?.avgCostPerSub?.toFixed(0) || 0}` },
                    ].map((s, i) => (
                        <div key={i} className="glass-card p-4 text-center">
                            <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
                            <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Your Subscriptions — Quick List */}
            <div className="glass-card animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between p-5 pb-3">
                    <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Your subscriptions</h2>
                    <Link to="/subscriptions" className="text-xs font-medium flex items-center gap-1"
                        style={{ color: 'var(--text-muted)' }}>
                        See all <ChevronRight size={14} />
                    </Link>
                </div>

                {categories.length > 0 ? (
                    <div>
                        {categories.slice(0, 4).map((cat, i) => (
                            <div key={i} className="flex items-center justify-between px-5 py-3.5"
                                style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                                <div className="flex items-center gap-3">
                                    <div className="sub-icon" style={{ background: `${COLORS[i % COLORS.length]}15` }}>
                                        <span style={{ color: COLORS[i % COLORS.length] }}>
                                            {cat.category === 'Entertainment' ? '🎬' :
                                                cat.category === 'Productivity' ? '⚡' :
                                                    cat.category === 'Fitness' ? '💪' :
                                                        cat.category === 'Finance' ? '💰' : '📦'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{cat.category}</p>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{cat.count} subscription{cat.count !== 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>₹{cat.totalCost}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="px-5 pb-5">
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No subscriptions yet. Add your first one!</p>
                    </div>
                )}
            </div>

            {/* Annual Spend Card */}
            <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'rgba(124, 58, 237, 0.12)' }}>
                            <TrendingUp size={18} style={{ color: 'var(--accent-purple-light)' }} />
                        </div>
                        <div>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Annual projected</p>
                            <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                ₹{totalAnnual.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                            </p>
                        </div>
                    </div>
                    <Link to="/analytics" className="gradient-btn px-4 py-2 text-xs">View Analytics</Link>
                </div>
            </div>

            {/* Insights */}
            {insights.length > 0 && (
                <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <h2 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Lightbulb size={16} style={{ color: 'var(--yellow)' }} /> Insights
                    </h2>
                    <div className="space-y-3">
                        {insights.map((ins, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                                style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <div className="mt-0.5 shrink-0">
                                    {ins.type === 'warning' ? <AlertTriangle size={14} style={{ color: 'var(--yellow)' }} /> :
                                        ins.type === 'success' ? <CheckCircle size={14} style={{ color: 'var(--green)' }} /> :
                                            <Info size={14} style={{ color: 'var(--accent-blue)' }} />}
                                </div>
                                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{ins.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Status Overview */}
            <div className="grid grid-cols-3 gap-3 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                {[
                    { label: 'Active', count: summary?.activeCount || 0, color: 'var(--green)' },
                    { label: 'Paused', count: summary?.pausedCount || 0, color: 'var(--yellow)' },
                    { label: 'Cancelled', count: summary?.cancelledCount || 0, color: 'var(--red)' },
                ].map((s, i) => (
                    <div key={i} className="glass-card p-4 text-center">
                        <div className="w-2 h-2 rounded-full mx-auto mb-2" style={{ background: s.color }} />
                        <p className="text-xl font-bold" style={{ color: s.color }}>{s.count}</p>
                        <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
