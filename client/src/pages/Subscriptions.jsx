import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSubscriptions, deleteSubscription } from '../api/api';
import { Plus, Search, Trash2, Edit3, X } from 'lucide-react';

const categoryIcons = {
    Entertainment: '🎬', Productivity: '⚡', Fitness: '💪',
    Finance: '💰', Other: '📦',
};

const categoryColors = {
    Entertainment: '#FF6B35', Productivity: '#3B82F6', Fitness: '#10B981',
    Finance: '#F59E0B', Other: '#7C3AED',
};

const Subscriptions = () => {
    const [subs, setSubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [sort, setSort] = useState('createdAt');
    const [order, setOrder] = useState('desc');
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();

    const fetchSubs = async () => {
        setLoading(true);
        try {
            const params = { sort, order };
            if (search) params.search = search;
            if (category) params.category = category;
            if (status) params.status = status;
            const { data } = await getSubscriptions(params);
            setSubs(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSubs(); }, [search, category, status, sort, order]);

    const handleDelete = async () => {
        try {
            await deleteSubscription(deleteId);
            setDeleteId(null);
            fetchSubs();
        } catch (err) {
            console.error(err);
        }
    };

    const formatCycle = (c) => c.charAt(0).toUpperCase() + c.slice(1);

    return (
        <div className="space-y-5 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Subscriptions</h1>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{subs.length} total</p>
                </div>
                <Link to="/subscriptions/new" className="gradient-btn flex items-center gap-2 px-4 py-2.5 text-sm">
                    <Plus size={16} /> Add New
                </Link>
            </div>

            {/* Search & Filters */}
            <div className="glass-card p-4">
                <div className="flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[180px]">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm"
                            style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-light)' }} />
                    </div>

                    <select value={category} onChange={(e) => setCategory(e.target.value)}
                        className="px-3 py-2.5 rounded-xl text-sm cursor-pointer"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' }}>
                        <option value="">All Categories</option>
                        {['Entertainment', 'Productivity', 'Fitness', 'Finance', 'Other'].map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    <select value={status} onChange={(e) => setStatus(e.target.value)}
                        className="px-3 py-2.5 rounded-xl text-sm cursor-pointer"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' }}>
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <select value={`${sort}.${order}`}
                        onChange={(e) => { const [s, o] = e.target.value.split('.'); setSort(s); setOrder(o); }}
                        className="px-3 py-2.5 rounded-xl text-sm cursor-pointer"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' }}>
                        <option value="createdAt.desc">Newest</option>
                        <option value="createdAt.asc">Oldest</option>
                        <option value="cost.desc">Cost ↓</option>
                        <option value="cost.asc">Cost ↑</option>
                        <option value="name.asc">A → Z</option>
                    </select>
                </div>
            </div>

            {/* Subscription List */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}
                </div>
            ) : subs.length === 0 ? (
                <div className="glass-card p-12 text-center animate-fade-in">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
                        style={{ background: 'rgba(255,107,53,0.08)' }}>💳</div>
                    <p className="text-base font-medium" style={{ color: 'var(--text-secondary)' }}>No subscriptions found</p>
                    <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>Add your first subscription to get started</p>
                    <Link to="/subscriptions/new" className="gradient-btn inline-flex items-center gap-2 px-6 py-2.5 text-sm mt-5">
                        <Plus size={16} /> Add Subscription
                    </Link>
                </div>
            ) : (
                <div className="glass-card overflow-hidden">
                    {subs.map((sub, i) => {
                        const catColor = categoryColors[sub.category] || '#7C3AED';
                        return (
                            <div key={sub._id}
                                className="flex items-center gap-4 px-5 py-4 transition-colors duration-150 animate-fade-in-up cursor-pointer"
                                style={{
                                    animationDelay: `${i * 40}ms`,
                                    borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                                }}
                                onClick={() => navigate(`/subscriptions/${sub._id}`)}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>

                                {/* Icon */}
                                <div className="sub-icon" style={{ background: `${catColor}12` }}>
                                    <span>{categoryIcons[sub.category] || '📦'}</span>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{sub.name}</p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                        {sub.category} · {formatCycle(sub.billingCycle)}
                                    </p>
                                </div>

                                {/* Status */}
                                <span className={`status-badge status-${sub.status}`}>{sub.status}</span>

                                {/* Price */}
                                <p className="text-base font-bold shrink-0 w-20 text-right" style={{ color: 'var(--text-primary)' }}>
                                    ₹{sub.cost}
                                </p>

                                {/* Actions */}
                                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                    <button className="p-2 rounded-lg transition-colors cursor-pointer"
                                        style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-blue)'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                        onClick={() => navigate(`/subscriptions/${sub._id}/edit`)}>
                                        <Edit3 size={15} />
                                    </button>
                                    <button className="p-2 rounded-lg transition-colors cursor-pointer"
                                        style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--red)'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                        onClick={() => setDeleteId(sub._id)}>
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Delete Modal */}
            {deleteId && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setDeleteId(null)}>
                    <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)' }} />
                    <div className="glass-card-elevated p-6 max-w-sm w-full relative z-10 animate-scale-in" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Delete Subscription?</h3>
                        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)}
                                className="flex-1 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
                                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' }}>
                                Cancel
                            </button>
                            <button onClick={handleDelete}
                                className="flex-1 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
                                style={{ background: 'var(--red)', color: 'white', border: 'none' }}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subscriptions;
