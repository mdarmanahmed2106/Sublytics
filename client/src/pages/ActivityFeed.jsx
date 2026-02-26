import { useEffect, useState } from 'react';
import { getActivityFeed } from '../api/api';
import {
    Activity, Plus, RefreshCw, Trash2, Clock, ChevronDown,
} from 'lucide-react';

const ACTION_CONFIG = {
    created: { color: 'var(--success)', icon: Plus, label: 'Created' },
    updated: { color: 'var(--blue)', icon: RefreshCw, label: 'Updated' },
    deleted: { color: 'var(--danger)', icon: Trash2, label: 'Deleted' },
};

const ActivityFeed = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchActivities = (pageNum = 1, actionFilter = '') => {
        setLoading(pageNum === 1);
        const params = { page: pageNum, limit: 15 };
        if (actionFilter) params.action = actionFilter;
        getActivityFeed(params)
            .then((res) => {
                const payload = res.data?.data || res.data;
                const list = payload?.logs || payload?.activities || [];
                if (pageNum === 1) setActivities(list);
                else setActivities((prev) => [...prev, ...list]);
                const pagination = payload?.pagination;
                setHasMore(pagination ? pagination.page < pagination.pages : list.length === 15);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        setPage(1);
        fetchActivities(1, filter);
    }, [filter]);

    const handleLoadMore = () => {
        const next = page + 1;
        setPage(next);
        fetchActivities(next, filter);
    };

    if (loading && activities.length === 0) return <FeedSkeleton />;

    return (
        <div>
            {/* Header */}
            <div className="anim-fade-up" style={{ marginBottom: 24 }}>
                <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Activity size={24} className="gradient-text-vivid" style={{ WebkitTextFillColor: 'unset', color: 'var(--accent-light)' }} />
                    Activity Feed
                </h1>
                <p className="page-subtitle">Track all changes to your subscriptions.</p>
            </div>

            {/* ── Filter Pills ── */}
            <div className="anim-fade-up" style={{ marginBottom: 24, animationDelay: '60ms' }}>
                <div className="pill-group">
                    {['', 'created', 'updated', 'deleted'].map((f) => (
                        <button key={f} className={`pill-option ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                            {f ? ACTION_CONFIG[f]?.label : 'All'}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Timeline ── */}
            {activities.length === 0 ? (
                <div className="empty-state anim-scale">
                    <div className="empty-state-icon"><Activity size={28} color="var(--accent-light)" /></div>
                    <p className="empty-state-title">No activity yet</p>
                    <p className="empty-state-text">Your subscription changes will appear here.</p>
                </div>
            ) : (
                <div style={{ position: 'relative' }}>
                    {activities.map((act, i) => {
                        const config = ACTION_CONFIG[act.action] || ACTION_CONFIG.created;
                        const Icon = config.icon;
                        return (
                            <div
                                key={act._id || i}
                                className="anim-fade-up"
                                style={{
                                    display: 'flex', gap: 14, position: 'relative',
                                    paddingBottom: 16, paddingLeft: 4,
                                    animationDelay: `${80 + i * 30}ms`,
                                }}
                            >
                                {/* Connector line */}
                                {i < activities.length - 1 && <div className="timeline-line" />}

                                {/* Dot */}
                                <div
                                    className="timeline-dot"
                                    style={{
                                        background: config.color,
                                        boxShadow: `0 0 10px ${config.color}`,
                                        width: 14, height: 14,
                                    }}
                                />

                                {/* Card */}
                                <div
                                    style={{
                                        flex: 1,
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border)',
                                        borderLeft: `3px solid ${config.color}`,
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '14px 18px',
                                        transition: 'border-color 0.2s, background 0.2s',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                        <Icon size={14} style={{ color: config.color }} />
                                        <span style={{ fontSize: 12, fontWeight: 600, color: config.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                            {config.label}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>
                                        {act.subscriptionName || 'Subscription'}
                                    </p>
                                    <p style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Clock size={10} />
                                        {new Date(act.timestamp || act.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    {/* Load More */}
                    {hasMore && (
                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <button className="btn btn-secondary" onClick={handleLoadMore} style={{ gap: 6 }}>
                                Load More <ChevronDown size={14} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/* Skeleton */
const FeedSkeleton = () => (
    <div>
        <div className="skeleton" style={{ width: 200, height: 36, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: 260, height: 18, marginBottom: 24 }} />
        <div className="skeleton" style={{ width: 240, height: 36, marginBottom: 24 }} />
        {[...Array(5)].map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                <div className="skeleton" style={{ width: 14, height: 14, borderRadius: '50%', flexShrink: 0 }} />
                <div className="skeleton" style={{ flex: 1, height: 80 }} />
            </div>
        ))}
    </div>
);

export default ActivityFeed;
