import { useEffect, useState } from 'react';
import { getActivityFeed } from '../api/api';
import { Clock, Plus, Edit3, Trash2, ChevronDown } from 'lucide-react';

const actionConfig = {
    created: { icon: Plus, color: 'var(--green)', label: 'Created' },
    updated: { icon: Edit3, color: 'var(--accent-blue)', label: 'Updated' },
    deleted: { icon: Trash2, color: 'var(--red)', label: 'Deleted' },
};

const ActivityFeed = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filter, setFilter] = useState('');

    const fetchActivities = async (pageNum = 1, reset = false) => {
        try {
            const params = { page: pageNum, limit: 15 };
            if (filter) params.action = filter;
            const { data } = await getActivityFeed(params);
            setActivities((prev) => reset ? data.data : [...prev, ...data.data]);
            setHasMore(data.meta.page < data.meta.pages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        setPage(1);
        fetchActivities(1, true);
    }, [filter]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchActivities(nextPage);
    };

    const formatTime = (d) => {
        const date = new Date(d);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Activity Feed</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Your subscription change history</p>
                </div>

                <select value={filter} onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2.5 rounded-xl text-sm cursor-pointer"
                    style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    <option value="">All Actions</option>
                    <option value="created">Created</option>
                    <option value="updated">Updated</option>
                    <option value="deleted">Deleted</option>
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : activities.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <Clock size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                    <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>No activity yet</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                        Activity will appear here as you manage subscriptions
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {activities.map((act, i) => {
                        const config = actionConfig[act.action] || actionConfig.created;
                        const Icon = config.icon;
                        const subName = act.entityId?.name || 'Unknown subscription';
                        return (
                            <div key={i} className="glass-card p-4 flex items-center gap-4 animate-fade-in-up"
                                style={{ animationDelay: `${i * 30}ms` }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: `${config.color}15` }}>
                                    <Icon size={18} style={{ color: config.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                        {config.label} <span className="font-semibold">{subName}</span>
                                    </p>
                                    {act.changes && act.action === 'updated' && Object.keys(act.changes).length > 0 && (
                                        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                                            Changed: {Object.keys(act.changes).join(', ')}
                                        </p>
                                    )}
                                </div>
                                <p className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>
                                    {formatTime(act.timestamp)}
                                </p>
                            </div>
                        );
                    })}

                    {hasMore && (
                        <button onClick={loadMore}
                            className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
                            style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                            <ChevronDown size={16} /> Load More
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ActivityFeed;
