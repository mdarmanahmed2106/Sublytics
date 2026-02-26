import { useEffect, useState } from 'react';
import { getAnalyticsSummary, getAnalyticsByCategory, getAnalyticsTrend, getHealthScore, getSpendingSpike } from '../api/api';
import { IndianRupee, CreditCard, TrendingUp, TrendingDown, Wallet, Minus } from 'lucide-react';
import {
    PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import HealthScoreRing from '../components/dashboard/HealthScoreRing';

const COLORS = ['#7C3AED', '#3B82F6', '#22D3EE', '#EC4899', '#F59E0B', '#10B981', '#818CF8', '#F97316'];

const SPIKE_CONFIG = {
    increase: { color: 'var(--danger)', bg: 'rgba(239,68,68,.08)', icon: TrendingUp, label: 'Spending Up' },
    decrease: { color: 'var(--success)', bg: 'rgba(16,185,129,.08)', icon: TrendingDown, label: 'Spending Down' },
    stable: { color: 'var(--blue)', bg: 'rgba(59,130,246,.08)', icon: Minus, label: 'Stable' },
};

const Analytics = () => {
    const [summary, setSummary] = useState(null);
    const [categoryBreakdown, setCategoryBreakdown] = useState([]);
    const [spendingTrend, setSpendingTrend] = useState([]);
    const [healthScore, setHealthScore] = useState(null);
    const [spike, setSpike] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [summaryRes, categoryRes, trendRes, healthRes, spikeRes] = await Promise.all([
                    getAnalyticsSummary(),
                    getAnalyticsByCategory(),
                    getAnalyticsTrend(12),
                    getHealthScore(),
                    getSpendingSpike(),
                ]);
                setSummary(summaryRes.data?.data || summaryRes.data);
                setCategoryBreakdown(categoryRes.data?.data || categoryRes.data);
                setSpendingTrend(trendRes.data?.data || trendRes.data);
                setHealthScore(healthRes.data?.data || healthRes.data);
                setSpike(spikeRes.data?.data || spikeRes.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    if (loading) return <AnalyticsSkeleton />;

    const pieData = (categoryBreakdown || []).map((c) => ({ name: c.category || c._id, value: c.totalCost || c.totalAmount || 0 }));
    const totalSpend = pieData.reduce((sum, d) => sum + d.value, 0);
    const barData = [...(categoryBreakdown || [])].sort((a, b) => (b.totalCost || 0) - (a.totalCost || 0));
    const trendData = (spendingTrend || []).map((t) => ({ month: t.month || `${t._id?.month || ''}/${t._id?.year || ''}`, amount: t.total || t.totalAmount || 0 }));

    const spikeConfig = spike?.trend ? (SPIKE_CONFIG[spike.trend] || SPIKE_CONFIG.stable) : null;
    const SpikeIcon = spikeConfig?.icon || Minus;

    return (
        <div>
            {/* Header */}
            <div className="anim-fade-up" style={{ marginBottom: 28 }}>
                <h1 className="page-title">Analytics</h1>
                <p className="page-subtitle">Deep dive into your subscription spending intelligence.</p>
            </div>

            {/* ── Health Score + KPI Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, marginBottom: 28, alignItems: 'start' }}>
                <HealthScoreRing
                    score={healthScore?.score ?? 0}
                    grade={healthScore?.grade ?? 'Moderate'}
                    factors={healthScore?.factors ?? []}
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                    <KPICard icon={<IndianRupee size={20} />} iconBg="var(--accent-subtle)" label="Monthly Spend" value={`₹${(summary?.totalMonthly || 0).toLocaleString()}`} delay="0ms" />
                    <KPICard icon={<CreditCard size={20} />} iconBg="rgba(59,130,246,.1)" iconColor="var(--blue)" label="Total Subscriptions" value={summary?.totalSubscriptions || 0} delay="60ms" />
                    <KPICard icon={<Wallet size={20} />} iconBg="rgba(34,211,238,.1)" iconColor="var(--cyan)" label="Yearly Estimate" value={`₹${((summary?.totalMonthly || 0) * 12).toLocaleString()}`} delay="120ms" />
                    <KPICard icon={<TrendingUp size={20} />} iconBg="rgba(236,72,153,.1)" iconColor="var(--pink)" label="Avg / Subscription" value={`₹${(summary?.avgCostPerSub || 0).toFixed(0)}`} delay="180ms" />
                </div>
            </div>

            {/* ── Spending Spike Indicator ── */}
            {spike && spike.trend !== 'stable' && spike.trend !== 'insufficient_data' && (
                <div className="card-glass anim-fade-up" style={{
                    padding: '16px 20px', marginBottom: 20, animationDelay: '200ms',
                    display: 'flex', alignItems: 'center', gap: 14,
                    background: spikeConfig?.bg, borderLeft: `3px solid ${spikeConfig?.color}`,
                }}>
                    <div className="icon-box-sm" style={{ background: `${spikeConfig?.color}20`, color: spikeConfig?.color }}>
                        <SpikeIcon size={16} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0, marginBottom: 2 }}>
                            {spikeConfig?.label}: {spike.percentage}%
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                            Current ₹{spike.currentMonth}/mo vs avg ₹{spike.averagePrevious}/mo (last 3 months)
                        </p>
                    </div>
                    <span style={{
                        fontSize: 20, fontWeight: 700, color: spikeConfig?.color,
                        fontFamily: 'var(--font-display)', letterSpacing: '-0.03em',
                    }}>
                        {spike.trend === 'increase' ? '+' : '-'}{spike.percentage}%
                    </span>
                </div>
            )}

            {/* ── Spending Trend ── */}
            {trendData.length > 0 && (
                <div className="card-glass anim-fade-up" style={{ padding: 24, marginBottom: 20, animationDelay: '260ms' }}>
                    <h3 className="section-title" style={{ marginBottom: 20 }}>Spending Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                            <Tooltip contentStyle={{ background: 'var(--bg-glass-strong)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: 13 }} />
                            <Area type="monotone" dataKey="amount" stroke="#7C3AED" strokeWidth={2.5} fill="url(#areaGrad)" dot={false} activeDot={{ r: 5, stroke: '#7C3AED', strokeWidth: 2, fill: 'var(--bg-card)' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* ── Pie + Table ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 20 }}>
                {pieData.length > 0 && (
                    <div className="card-glass anim-fade-up" style={{ padding: 24, animationDelay: '320ms' }}>
                        <h3 className="section-title" style={{ marginBottom: 20 }}>Spend by Category</h3>
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={4} dataKey="value" stroke="none">
                                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'var(--bg-glass-strong)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: 13 }} />
                                <text x="50%" y="46%" textAnchor="middle" fill="var(--text-primary)" style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                                    ₹{totalSpend.toLocaleString()}
                                </text>
                                <text x="50%" y="56%" textAnchor="middle" fill="var(--text-muted)" style={{ fontSize: 11 }}>
                                    Total
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {barData.length > 0 && (
                    <div className="card-glass anim-fade-up" style={{ padding: 24, animationDelay: '380ms' }}>
                        <h3 className="section-title" style={{ marginBottom: 20 }}>Category Breakdown</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {barData.map((cat, i) => {
                                const cost = cat.totalCost || cat.totalAmount || 0;
                                const pct = totalSpend ? (cost / totalSpend) * 100 : 0;
                                return (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{cat.category || cat._id}</span>
                                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>₹{cost.toLocaleString()}</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-bar-fill" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Full Bar Chart ── */}
            {barData.length > 0 && (
                <div className="card-glass anim-fade-up" style={{ padding: 24, animationDelay: '440ms' }}>
                    <h3 className="section-title" style={{ marginBottom: 20 }}>Cost Comparison</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={barData.map(c => ({ name: c.category || c._id, value: c.totalCost || c.totalAmount || 0 }))}>
                            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                            <Tooltip contentStyle={{ background: 'var(--bg-glass-strong)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: 13 }} />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
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
const AnalyticsSkeleton = () => (
    <div>
        <div className="skeleton" style={{ width: 170, height: 36, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: 240, height: 18, marginBottom: 28 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, marginBottom: 28 }}>
            <div className="skeleton" style={{ height: 250 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 130 }} />)}
            </div>
        </div>
        <div className="skeleton" style={{ height: 340, marginBottom: 20 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="skeleton" style={{ height: 300 }} />
            <div className="skeleton" style={{ height: 300 }} />
        </div>
    </div>
);

export default Analytics;
