import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSubscriptions, deleteSubscription, markSubscriptionUsed } from '../api/api';
import {
    Search, Plus, Filter, Trash2, Edit3, CreditCard,
    ChevronRight, AlertCircle, X, CheckCircle,
} from 'lucide-react';

const STATUS_MAP = { active: 'badge-active', paused: 'badge-paused', cancelled: 'badge-cancelled' };

const TAG_STYLES = {
    'healthy': { bg: 'rgba(16,185,129,.1)', color: '#10B981', label: 'Healthy' },
    'review': { bg: 'rgba(245,158,11,.1)', color: '#F59E0B', label: 'Review' },
    'waste-risk': { bg: 'rgba(239,68,68,.1)', color: '#EF4444', label: 'Waste Risk' },
    'inactive': { bg: 'var(--bg-surface)', color: 'var(--text-muted)', label: 'Inactive' },
};

const CATEGORY_EMOJI = {
    Entertainment: '🎬', Music: '🎵', Gaming: '🎮', Streaming: '📺',
    Productivity: '📊', Storage: '☁️', Fitness: '💪', Education: '📚',
    Shopping: '🛒', Finance: '💰', News: '📰', Social: '💬',
    Food: '🍔', Health: '❤️', Utilities: '🔧', Other: '📦',
};

const Subscriptions = () => {
    const [subs, setSubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [sort, setSort] = useState('name');
    const [deleting, setDeleting] = useState(null);
    const [markingUsed, setMarkingUsed] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getSubscriptions()
            .then((res) => setSubs(res.data?.data || res.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async () => {
        if (!deleting) return;
        try { await deleteSubscription(deleting); setSubs((prev) => prev.filter((s) => s._id !== deleting)); }
        catch (e) { console.error(e); }
        finally { setDeleting(null); }
    };

    const handleMarkUsed = async (e, subId) => {
        e.stopPropagation();
        setMarkingUsed(subId);
        try {
            await markSubscriptionUsed(subId);
            setSubs((prev) => prev.map((s) =>
                s._id === subId ? { ...s, lastUsedAt: new Date().toISOString(), behavioralTag: 'healthy' } : s
            ));
        } catch (err) { console.error(err); }
        finally { setMarkingUsed(null); }
    };

    /* Filter & Sort */
    const categories = [...new Set(subs.map((s) => s.category))].sort();
    let filtered = subs.filter((s) => {
        const q = search.toLowerCase();
        if (q && !s.name.toLowerCase().includes(q) && !s.category?.toLowerCase().includes(q)) return false;
        if (category && s.category !== category) return false;
        if (status && s.status !== status) return false;
        return true;
    });
    filtered.sort((a, b) => {
        if (sort === 'cost') return b.cost - a.cost;
        if (sort === 'date') return new Date(b.startDate) - new Date(a.startDate);
        return a.name.localeCompare(b.name);
    });

    if (loading) return <SubsSkeleton />;

    return (
        <div>
            {/* Header */}
            <div className="anim-fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
                <div>
                    <h1 className="page-title">Subscriptions</h1>
                    <p className="page-subtitle">{subs.length} subscription{subs.length !== 1 ? 's' : ''} tracked</p>
                </div>
                <Link to="/subscriptions/new" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: 13 }}>
                    <Plus size={16} /> Add New
                </Link>
            </div>

            {/* ── Filter Bar ── */}
            <div className="filter-bar anim-fade-up" style={{ animationDelay: '60ms', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 24 }}>
                <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 160 }}>
                    <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        className="input" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search subscriptions…"
                        style={{ paddingLeft: 36, height: 40, fontSize: 13, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                    />
                </div>
                <div className="pill-group" style={{ flexShrink: 0 }}>
                    {['', 'active', 'paused', 'cancelled'].map((s) => (
                        <button key={s} className={`pill-option ${status === s ? 'active' : ''}`} onClick={() => setStatus(s)}>
                            {s || 'All'}
                        </button>
                    ))}
                </div>
                <select className="input" value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: 'auto', minWidth: 130, height: 40, fontSize: 13, background: 'var(--bg-surface)', border: '1px solid var(--border)', paddingRight: 36 }}>
                    <option value="">All Categories</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="input" value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: 'auto', minWidth: 120, height: 40, fontSize: 13, background: 'var(--bg-surface)', border: '1px solid var(--border)', paddingRight: 36 }}>
                    <option value="name">Name</option>
                    <option value="cost">Cost ↓</option>
                    <option value="date">Newest</option>
                </select>
            </div>

            {/* ── Subscription Cards ── */}
            {filtered.length === 0 ? (
                <div className="empty-state anim-scale">
                    <div className="empty-state-icon"><CreditCard size={28} color="var(--accent-light)" /></div>
                    <p className="empty-state-title">No subscriptions found</p>
                    <p className="empty-state-text">
                        {subs.length === 0 ? "You haven't added any subscriptions yet." : 'Try adjusting your filters.'}
                    </p>
                    {subs.length === 0 && (
                        <Link to="/subscriptions/new" className="btn btn-primary">
                            <Plus size={15} /> Add Your First
                        </Link>
                    )}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {filtered.map((sub, i) => {
                        const tag = TAG_STYLES[sub.behavioralTag] || TAG_STYLES.healthy;
                        return (
                            <div
                                key={sub._id}
                                className="sub-card anim-fade-up"
                                style={{ animationDelay: `${90 + i * 40}ms` }}
                                onClick={() => navigate(`/subscriptions/${sub._id}`)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div className="icon-box" style={{ background: 'var(--accent-subtle)', fontSize: 22 }}>
                                        {CATEGORY_EMOJI[sub.category] || '📦'}
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                                            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{sub.name}</h3>
                                            <span className="badge badge-category">{sub.category}</span>
                                            <span className={`badge ${STATUS_MAP[sub.status]}`}>
                                                <span className="badge-dot" />{sub.status}
                                            </span>
                                            {/* Behavioral tag */}
                                            {sub.behavioralTag && sub.behavioralTag !== 'inactive' && (
                                                <span style={{
                                                    fontSize: 10, fontWeight: 600, padding: '2px 8px',
                                                    borderRadius: 10, background: tag.bg, color: tag.color,
                                                    textTransform: 'uppercase', letterSpacing: '0.04em',
                                                }}>
                                                    {tag.label}
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                            {sub.billingCycle}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>₹{sub.cost}</p>
                                            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>/{sub.billingCycle === 'yearly' ? 'yr' : 'mo'}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            {/* Mark as Used button for waste-risk */}
                                            {sub.behavioralTag === 'waste-risk' && (
                                                <button
                                                    className="btn-icon"
                                                    title="Mark as Used"
                                                    style={{ width: 34, height: 34, color: 'var(--success)' }}
                                                    onClick={(e) => handleMarkUsed(e, sub._id)}
                                                    disabled={markingUsed === sub._id}
                                                >
                                                    <CheckCircle size={14} />
                                                </button>
                                            )}
                                            <button className="btn-icon" style={{ width: 34, height: 34 }} onClick={(e) => { e.stopPropagation(); navigate(`/subscriptions/${sub._id}/edit`); }}>
                                                <Edit3 size={14} />
                                            </button>
                                            <button className="btn-icon" style={{ width: 34, height: 34, color: 'var(--danger)' }} onClick={(e) => { e.stopPropagation(); setDeleting(sub._id); }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Delete Confirmation Modal ── */}
            {deleting && (
                <div className="overlay anim-fade" onClick={() => setDeleting(null)}>
                    <div className="card-glass anim-scale" style={{ width: '100%', maxWidth: 400, padding: 0, position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ height: 4, background: 'linear-gradient(90deg, var(--danger), #F97316)', borderRadius: 'var(--radius) var(--radius) 0 0' }} />
                        <div style={{ padding: '28px 28px 24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                <div className="icon-box-sm" style={{ background: 'var(--danger-glow)', color: 'var(--danger)' }}>
                                    <AlertCircle size={18} />
                                </div>
                                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>Delete Subscription</h3>
                            </div>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 24 }}>
                                This action cannot be undone. The subscription and all its activity history will be permanently removed.
                            </p>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                <button className="btn btn-secondary" onClick={() => setDeleting(null)}>Cancel</button>
                                <button className="btn btn-danger" onClick={handleDelete}>
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* Skeleton */
const SubsSkeleton = () => (
    <div>
        <div className="skeleton" style={{ width: 200, height: 36, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: 160, height: 18, marginBottom: 24 }} />
        <div className="skeleton" style={{ height: 56, marginBottom: 24 }} />
        {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 72, marginBottom: 10 }} />)}
    </div>
);

export default Subscriptions;
