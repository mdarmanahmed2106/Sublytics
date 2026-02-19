import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAnalyticsSummary, getAnalyticsByCategory, getAnalyticsInsights } from '../api/api';
import { TrendingUp, TrendingDown, CreditCard, IndianRupee, BarChart3, Lightbulb, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#7C3AED', '#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];

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
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const kpis = [
        { label: 'Monthly Spend', value: `₹${summary?.totalMonthly?.toFixed(2) || '0.00'}`, icon: IndianRupee, color: 'var(--accent-purple)' },
        { label: 'Annual Projected', value: `₹${summary?.totalAnnual?.toFixed(2) || '0.00'}`, icon: TrendingUp, color: 'var(--accent-blue)' },
        { label: 'Active Subs', value: summary?.activeCount || 0, icon: CreditCard, color: 'var(--green)' },
        { label: 'Avg / Sub', value: `₹${summary?.avgCostPerSub?.toFixed(2) || '0.00'}`, icon: BarChart3, color: 'var(--accent-pink)' },
    ];

    const insightIcon = (type) => {
        switch (type) {
            case 'warning': return <AlertTriangle size={16} style={{ color: 'var(--yellow)' }} />;
            case 'success': return <CheckCircle size={16} style={{ color: 'var(--green)' }} />;
            default: return <Info size={16} style={{ color: 'var(--accent-blue)' }} />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Greeting */}
            <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    Hey, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Here's your subscription overview
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => (
                    <div key={i} className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{kpi.label}</span>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: `${kpi.color}20` }}>
                                <kpi.icon size={16} style={{ color: kpi.color }} />
                            </div>
                        </div>
                        <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{kpi.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Category Breakdown */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Spend by Category</h2>
                    {categories.length > 0 ? (
                        <div className="flex items-center gap-6">
                            <div className="w-44 h-44">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={categories} dataKey="totalCost" nameKey="category" cx="50%" cy="50%"
                                            innerRadius={40} outerRadius={70} paddingAngle={3} strokeWidth={0}>
                                            {categories.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-primary)' }}
                                            formatter={(val) => [`₹${val}`, 'Cost']} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                {categories.map((cat, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                                            <span style={{ color: 'var(--text-secondary)' }}>{cat.category}</span>
                                        </div>
                                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>₹{cat.totalCost}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No data yet. Add some subscriptions!</p>
                    )}
                </div>

                {/* Insights */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Lightbulb size={18} style={{ color: 'var(--yellow)' }} /> Insights
                    </h2>
                    <div className="flex flex-col gap-3">
                        {insights.length > 0 ? insights.map((ins, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                                style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <div className="mt-0.5">{insightIcon(ins.type)}</div>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{ins.message}</p>
                            </div>
                        )) : (
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No insights yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Most Expensive */}
            {summary?.mostExpensive && (
                <div className="glass-card p-6 glow-purple animate-fade-in-up">
                    <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>💰 Most Expensive</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xl font-bold gradient-text">{summary.mostExpensive.name}</p>
                            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{summary.mostExpensive.category}</p>
                        </div>
                        <p className="text-2xl font-bold" style={{ color: 'var(--accent-purple-light)' }}>
                            ₹{summary.mostExpensive.cost}
                        </p>
                    </div>
                </div>
            )}

            {/* Status Overview */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Status Overview</h2>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Active', count: summary?.activeCount, color: 'var(--green)' },
                        { label: 'Paused', count: summary?.pausedCount, color: 'var(--yellow)' },
                        { label: 'Cancelled', count: summary?.cancelledCount, color: 'var(--red)' },
                    ].map((s, i) => (
                        <div key={i} className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.count || 0}</p>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
