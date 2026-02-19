import { useEffect, useState } from 'react';
import { getAnalyticsSummary, getAnalyticsByCategory, getAnalyticsTrend } from '../api/api';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line, Area, AreaChart,
} from 'recharts';

const COLORS = ['#7C3AED', '#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];

const Analytics = () => {
    const [summary, setSummary] = useState(null);
    const [categories, setCategories] = useState([]);
    const [trend, setTrend] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [sumRes, catRes, trendRes] = await Promise.all([
                    getAnalyticsSummary(),
                    getAnalyticsByCategory(),
                    getAnalyticsTrend(6),
                ]);
                setSummary(sumRes.data.data);
                setCategories(catRes.data.data);
                setTrend(trendRes.data.data);
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

    const tooltipStyle = {
        contentStyle: {
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '12px', color: 'var(--text-primary)', fontSize: '13px',
        },
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Analytics</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Visual breakdown of your spending</p>
            </div>

            {/* Top KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Monthly', value: `₹${summary?.totalMonthly?.toFixed(2) || 0}` },
                    { label: 'Annual', value: `₹${summary?.totalAnnual?.toFixed(2) || 0}` },
                    { label: 'Total Subs', value: summary?.totalSubscriptions || 0 },
                    { label: 'Avg / Sub', value: `₹${summary?.avgCostPerSub?.toFixed(2) || 0}` },
                ].map((k, i) => (
                    <div key={i} className="glass-card p-5 text-center">
                        <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{k.label}</p>
                        <p className="text-xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{k.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Pie Chart — Spend by Category */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Spend by Category</h2>
                    {categories.length > 0 ? (
                        <>
                            <div className="h-64">
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={categories} dataKey="totalCost" nameKey="category"
                                            cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} strokeWidth={0}>
                                            {categories.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip {...tooltipStyle} formatter={(val) => [`₹${val}`, 'Cost']} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-4">
                                {categories.map((c, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
                                        style={{ background: `${COLORS[i % COLORS.length]}15`, color: COLORS[i % COLORS.length] }}>
                                        <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                                        {c.category}: ₹{c.totalCost}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No data yet</p>
                    )}
                </div>

                {/* Bar Chart — Cost by Category */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Cost Comparison</h2>
                    {categories.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer>
                                <BarChart data={categories}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="category" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                    <Tooltip {...tooltipStyle} formatter={(val) => [`₹${val}`, 'Cost']} />
                                    <Bar dataKey="totalCost" radius={[8, 8, 0, 0]}>
                                        {categories.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No data yet</p>
                    )}
                </div>
            </div>

            {/* Area Chart — Trend */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Spending Trend (6 Months)</h2>
                {trend.length > 0 ? (
                    <div className="h-72">
                        <ResponsiveContainer>
                            <AreaChart data={trend}>
                                <defs>
                                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                <Tooltip {...tooltipStyle} formatter={(val) => [`₹${val}`, 'Total']} />
                                <Area type="monotone" dataKey="total" stroke="#7C3AED" strokeWidth={2}
                                    fill="url(#trendGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No trend data yet</p>
                )}
            </div>
        </div>
    );
};

export default Analytics;
