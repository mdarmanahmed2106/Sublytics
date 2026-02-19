import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSubscriptions, deleteSubscription } from '../api/api';
import { Plus, Search, Filter, Trash2, Edit3, Eye, CreditCard, X } from 'lucide-react';

const statusColors = {
    active: 'var(--green)',
    paused: 'var(--yellow)',
    cancelled: 'var(--red)',
};

const categoryIcons = {
    Entertainment: '🎬',
    Productivity: '⚡',
    Fitness: '💪',
    Finance: '💰',
    Other: '📦',
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Subscriptions</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{subs.length} total</p>
                </div>
                <Link to="/subscriptions/new"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200"
                    style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))', color: 'white' }}>
                    <Plus size={16} /> Add New
                </Link>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search subscriptions..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
                </div>

                <select value={category} onChange={(e) => setCategory(e.target.value)}
                    className="px-3 py-2.5 rounded-xl text-sm cursor-pointer"
                    style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    <option value="">All Categories</option>
                    {['Entertainment', 'Productivity', 'Fitness', 'Finance', 'Other'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                <select value={status} onChange={(e) => setStatus(e.target.value)}
                    className="px-3 py-2.5 rounded-xl text-sm cursor-pointer"
                    style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                <select value={`${sort}.${order}`}
                    onChange={(e) => { const [s, o] = e.target.value.split('.'); setSort(s); setOrder(o); }}
                    className="px-3 py-2.5 rounded-xl text-sm cursor-pointer"
                    style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    <option value="createdAt.desc">Newest First</option>
                    <option value="createdAt.asc">Oldest First</option>
                    <option value="cost.desc">Cost: High → Low</option>
                    <option value="cost.asc">Cost: Low → High</option>
                    <option value="name.asc">Name: A → Z</option>
                    <option value="name.desc">Name: Z → A</option>
                </select>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : subs.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <CreditCard size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                    <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>No subscriptions found</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Add your first subscription to get started</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {subs.map((sub, i) => (
                        <div key={sub._id}
                            className="glass-card p-5 flex items-center gap-4 animate-fade-in-up transition-all duration-200 hover:scale-[1.01]"
                            style={{ animationDelay: `${i * 50}ms`, cursor: 'pointer' }}
                            onClick={() => navigate(`/subscriptions/${sub._id}`)}>
                            {/* Category icon */}
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                                style={{ background: 'rgba(124, 58, 237, 0.1)' }}>
                                {categoryIcons[sub.category] || '📦'}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{sub.name}</h3>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                    {sub.category} · {formatCycle(sub.billingCycle)}
                                </p>
                            </div>

                            {/* Status badge */}
                            <div className="px-2.5 py-1 rounded-full text-xs font-medium shrink-0"
                                style={{ background: `${statusColors[sub.status]}15`, color: statusColors[sub.status] }}>
                                {sub.status}
                            </div>

                            {/* Cost */}
                            <p className="text-lg font-bold shrink-0" style={{ color: 'var(--text-primary)' }}>₹{sub.cost}</p>

                            {/* Actions */}
                            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                <button className="p-2 rounded-lg transition-all cursor-pointer" style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
                                    onClick={() => navigate(`/subscriptions/${sub._id}/edit`)}>
                                    <Edit3 size={16} />
                                </button>
                                <button className="p-2 rounded-lg transition-all cursor-pointer" style={{ color: 'var(--red)', background: 'none', border: 'none' }}
                                    onClick={() => setDeleteId(sub._id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4" onClick={() => setDeleteId(null)}>
                    <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} />
                    <div className="glass-card p-6 max-w-sm w-full relative z-10" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Delete Subscription?</h3>
                        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)}
                                className="flex-1 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
                                style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
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
