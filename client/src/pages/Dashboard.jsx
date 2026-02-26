import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnalyticsSummary, getAnalyticsByCategory, getAnalyticsTrend, getHealthScore, getSmartInsights, getSubscriptions } from '../api/api';
import { useAuth } from '../context/useAuth';
import {
    IndianRupee, TrendingUp, CreditCard, Wallet, Plus, ArrowRight,
} from 'lucide-react';
import {
    PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import HealthScoreRing from '../components/dashboard/HealthScoreRing';
import SmartInsightCard from '../components/dashboard/SmartInsightCard';
import RenewalAlertBanner from '../components/dashboard/RenewalAlertBanner';

const COLORS = ['#7C3AED', '#3B82F6', '#22D3EE', '#EC4899', '#F59E0B', '#10B981', '#818CF8', '#F97316'];

const Dashboard = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [categoryBreakdown, setCategoryBreakdown] = useState([]);
    const [spendingTrend, setSpendingTrend] = useState([]);
    const [healthScore, setHealthScore] = useState(null);
    const [insights, setInsights] = useState([]);
    const [statusOverview, setStatusOverview] = useState({ active: 0, paused: 0, cancelled: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [summaryRes, categoryRes, trendRes, healthRes, insightsRes, subsRes] = await Promise.all([
                    getAnalyticsSummary(),
                    getAnalyticsByCategory(),
                    getAnalyticsTrend(6),
                    getHealthScore(),
                    getSmartInsights(),
                    getSubscriptions(),
                ]);
                setSummary(summaryRes.data?.data || summaryRes.data);
                setCategoryBreakdown(categoryRes.data?.data || categoryRes.data || []);
                setSpendingTrend(trendRes.data?.data || trendRes.data || []);
                setHealthScore(healthRes.data?.data || healthRes.data);
                setInsights(insightsRes.data?.data || insightsRes.data || []);

                const subs = subsRes.data?.data || subsRes.data || [];
                const subsList = Array.isArray(subs) ? subs : [];
                setStatusOverview({
                    active: subsList.filter(s => s.status === 'active').length,
                    paused: subsList.filter(s => s.status === 'paused').length,
                    cancelled: subsList.filter(s => s.status === 'cancelled').length,
                });
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    if (loading) return <DashboardSkeleton />;

    const firstName = user?.name?.split(' ')[0] || 'there';

    /* Category pie data — API returns { category, totalCost, count } */
    const pieData = (categoryBreakdown || []).map((c) => ({ name: c.category || c._id, value: c.totalCost || c.totalAmount || 0 }));
    /* Top categories bar data */
    const barData = [...(categoryBreakdown || [])].sort((a, b) => (b.totalCost || 0) - (a.totalCost || 0)).slice(0, 5);
    /* Trend area data — API returns { month, total } */
    const trendData = (spendingTrend || []).map((t) => ({
        month: t.month || `${t._id?.month || ''}/${t._id?.year || ''}`,
        amount: t.total || t.totalAmount || 0,
    }));

    /* Status for stat-ring cards */
    const totalSubs = (summary?.totalSubscriptions || 0);
    const totalMonthly = summary?.totalMonthly || summary?.totalMonthlyCost || 0;
    const avgCost = summary?.avgCostPerSub || summary?.avgMonthlyCost || 0;
    const statuses = [
        { label: 'Active', count: statusOverview.active, color: 'var(--success)', pct: totalSubs ? Math.round((statusOverview.active / totalSubs) * 100) : 0 },
        { label: 'Paused', count: statusOverview.paused, color: 'var(--warning)', pct: totalSubs ? Math.round((statusOverview.paused / totalSubs) * 100) : 0 },
        { label: 'Cancelled', count: statusOverview.cancelled, color: 'var(--danger)', pct: totalSubs ? Math.round((statusOverview.cancelled / totalSubs) * 100) : 0 },
    ];

    return (
        <div>
            {/* ── Renewal Alert Banner ── */}
            <RenewalAlertBanner insights={insights} />

            {/* ── Greeting ── */}
            <div className="anim-fade-up" style={{ marginBottom: 32 }}>
                <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Good {getGreeting()}, <span className="gradient-text-vivid">{firstName}</span>
                    <span className="anim-float" style={{ display: 'inline-block', fontSize: 28 }}>👋</span>
                </h1>
                <p className="page-subtitle">Here's your subscription overview.</p>
                <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                    <Link to="/subscriptions/new" className="btn btn-primary" style={{ padding: '9px 18px', fontSize: 13 }}>
                        <Plus size={15} /> Add Subscription
                    </Link>
                    <Link to="/analytics" className="btn btn-secondary" style={{ padding: '9px 18px', fontSize: 13 }}>
                        View Analytics <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            {/* ── Health Score + KPI Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, marginBottom: 28, alignItems: 'start' }}>
                <HealthScoreRing
                    score={healthScore?.score ?? 0}
                    grade={healthScore?.grade ?? 'Moderate'}
                    factors={healthScore?.factors ?? []}
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                    <KPICard icon={<IndianRupee size={20} />} iconBg="var(--accent-subtle)" label="Monthly Spend" value={`₹${totalMonthly.toLocaleString()}`} delay="0ms" />
                    <KPICard icon={<CreditCard size={20} />} iconBg="rgba(59,130,246,.1)" iconColor="var(--blue)" label="Total Subscriptions" value={totalSubs} delay="60ms" />
                    <KPICard icon={<Wallet size={20} />} iconBg="rgba(34,211,238,.1)" iconColor="var(--cyan)" label="Yearly Estimate" value={`₹${(totalMonthly * 12).toLocaleString()}`} delay="120ms" />
                    <KPICard icon={<TrendingUp size={20} />} iconBg="rgba(236,72,153,.1)" iconColor="var(--pink)" label="Avg / Subscription" value={`₹${avgCost.toFixed(0)}`} delay="180ms" />
                </div>
            </div>

            {/* Spending Trend (full width) */}
            {trendData.length > 0 && (
                <div className="card-glass anim-fade-up" style={{ padding: 24, marginBottom: 20, animationDelay: '200ms' }}>
                    <h3 className="section-title" style={{ marginBottom: 20 }}>Spending Trend</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                            <Tooltip contentStyle={{ background: 'var(--bg-glass-strong)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: 13 }} />
                            <Area type="monotone" dataKey="amount" stroke="#7C3AED" strokeWidth={2.5} fill="url(#trendGradient)" dot={false} activeDot={{ r: 5, stroke: '#7C3AED', strokeWidth: 2, fill: 'var(--bg-card)' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Pie + Bar Side-by-Side */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 20 }}>
                {pieData.length > 0 && (
                    <div className="card-glass anim-fade-up" style={{ padding: 24, animationDelay: '260ms' }}>
                        <h3 className="section-title" style={{ marginBottom: 20 }}>Spend by Category</h3>
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'var(--bg-glass-strong)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: 13 }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 8 }}>
                            {pieData.map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
                                    <span style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i % COLORS.length] }} />
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {barData.length > 0 && (
                    <div className="card-glass anim-fade-up" style={{ padding: 24, animationDelay: '320ms' }}>
                        <h3 className="section-title" style={{ marginBottom: 20 }}>Top Categories</h3>
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={barData.map(c => ({ name: c.category || c._id, value: c.totalCost || c.totalAmount || 0 }))} layout="vertical">
                                <XAxis type="number" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} width={90} />
                                <Tooltip contentStyle={{ background: 'var(--bg-glass-strong)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: 13 }} />
                                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                                    {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* ── Status Overview ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 20 }}>
                {statuses.map((s, i) => (
                    <div key={i} className="card-glass anim-fade-up" style={{ padding: 24, textAlign: 'center', animationDelay: `${360 + i * 60}ms` }}>
                        <div className="stat-ring" style={{ margin: '0 auto 12px', width: 72, height: 72 }}>
                            <svg width="72" height="72">
                                <circle cx="36" cy="36" r="30" fill="none" stroke="var(--border)" strokeWidth="5" />
                                <circle cx="36" cy="36" r="30" fill="none" stroke={s.color} strokeWidth="5" strokeDasharray={`${(s.pct / 100) * 188} 188`} strokeLinecap="round" />
                            </svg>
                            <span className="stat-ring-label" style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.count}</span>
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* ── Smart Insights ── */}
            {insights && insights.length > 0 && (
                <div className="anim-fade-up" style={{ animationDelay: '500ms' }}>
                    <h3 className="section-title" style={{ marginBottom: 14 }}>Smart Insights</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {insights.map((insight, i) => (
                            <SmartInsightCard key={i} insight={insight} index={i} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

/* ────────── Helpers ────────── */
const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
};

/* KPI Card */
const KPICard = ({ icon, iconBg, iconColor = 'var(--accent-light)', label, value, delay = '0ms' }) => (
    <div className="kpi-card anim-fade-up" style={{ animationDelay: delay }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div className="icon-box" style={{ background: iconBg, color: iconColor }}>{icon}</div>
        </div>
        <div className="kpi-value">{value}</div>
        <div className="kpi-label">{label}</div>
    </div>
);

/* Skeleton */
const DashboardSkeleton = () => (
    <div>
        <div className="skeleton" style={{ width: 300, height: 36, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: 220, height: 18, marginBottom: 32 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, marginBottom: 28 }}>
            <div className="skeleton" style={{ height: 250 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 130 }} />)}
            </div>
        </div>
        <div className="skeleton" style={{ height: 300, marginBottom: 20 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="skeleton" style={{ height: 300 }} />
            <div className="skeleton" style={{ height: 300 }} />
        </div>
    </div>
);

export default Dashboard;
