import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSubscription, markSubscriptionUsed } from '../api/api';
import {
    ArrowLeft, Edit3, CreditCard, Tag, Calendar, RefreshCw,
    ToggleLeft, FileText, Clock, Activity, Zap, CheckCircle,
} from 'lucide-react';
import SimulateCancelModal from '../components/dashboard/SimulateCancelModal';

const STATUS_MAP = { active: 'badge-active', paused: 'badge-paused', cancelled: 'badge-cancelled' };

const TAG_STYLES = {
    'healthy': { bg: 'rgba(16,185,129,.1)', color: '#10B981', label: 'Healthy', icon: '✓' },
    'review': { bg: 'rgba(245,158,11,.1)', color: '#F59E0B', label: 'Review', icon: '⚠' },
    'waste-risk': { bg: 'rgba(239,68,68,.1)', color: '#EF4444', label: 'Waste Risk', icon: '!' },
    'inactive': { bg: 'var(--bg-surface)', color: 'var(--text-muted)', label: 'Inactive', icon: '—' },
};

const CATEGORY_EMOJI = {
    Entertainment: '🎬', Music: '🎵', Gaming: '🎮', Streaming: '📺',
    Productivity: '📊', Storage: '☁️', Fitness: '💪', Education: '📚',
    Shopping: '🛒', Finance: '💰', News: '📰', Social: '💬',
    Food: '🍔', Health: '❤️', Utilities: '🔧', Other: '📦',
};

const SubscriptionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sub, setSub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSimulator, setShowSimulator] = useState(false);
    const [markingUsed, setMarkingUsed] = useState(false);

    useEffect(() => {
        getSubscription(id)
            .then((res) => setSub(res.data?.data || res.data))
            .catch(() => navigate('/subscriptions'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleMarkUsed = async () => {
        setMarkingUsed(true);
        try {
            await markSubscriptionUsed(sub._id);
            setSub((prev) => ({ ...prev, lastUsedAt: new Date().toISOString(), behavioralTag: 'healthy' }));
        } catch (err) { console.error(err); }
        finally { setMarkingUsed(false); }
    };

    if (loading) return <DetailSkeleton />;
    if (!sub) return null;

    const tag = TAG_STYLES[sub.behavioralTag] || TAG_STYLES.healthy;

    const details = [
        { icon: <Tag size={16} />, label: 'Category', value: sub.category },
        { icon: <IndianRupeeIcon />, label: 'Cost', value: `₹${sub.cost}` },
        { icon: <RefreshCw size={16} />, label: 'Billing Cycle', value: sub.billingCycle },
        { icon: <Calendar size={16} />, label: 'Start Date', value: sub.startDate ? new Date(sub.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
        { icon: <ToggleLeft size={16} />, label: 'Status', value: sub.status },
        { icon: <Clock size={16} />, label: 'Last Used', value: sub.lastUsedAt ? new Date(sub.lastUsedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never' },
    ];

    return (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
            {/* Back */}
            <button onClick={() => navigate(-1)} className="btn-ghost anim-fade" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, cursor: 'pointer' }}>
                <ArrowLeft size={15} /> Back
            </button>

            {/* ── Hero Card ── */}
            <div className="detail-hero anim-scale" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div className="icon-box-lg" style={{ background: 'var(--accent-subtle)', fontSize: 28, borderRadius: 'var(--radius)' }}>
                            {CATEGORY_EMOJI[sub.category] || '📦'}
                        </div>
                        <div>
                            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 6 }}>
                                {sub.name}
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                <span className="badge badge-category">{sub.category}</span>
                                <span className={`badge ${STATUS_MAP[sub.status]}`}>
                                    <span className="badge-dot" />{sub.status}
                                </span>
                                {/* Behavioral tag badge */}
                                {sub.behavioralTag && (
                                    <span style={{
                                        fontSize: 11, fontWeight: 600, padding: '3px 10px',
                                        borderRadius: 12, background: tag.bg, color: tag.color,
                                    }}>
                                        {tag.label}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                            ₹{sub.cost}
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>/{sub.billingCycle === 'yearly' ? 'year' : 'month'}</p>
                    </div>
                </div>

                {sub.description && (
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 18, lineHeight: 1.6, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                        <FileText size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6, color: 'var(--text-muted)' }} />
                        {sub.description}
                    </p>
                )}

                <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <Link to={`/subscriptions/${sub._id}/edit`} className="btn btn-primary" style={{ padding: '9px 20px', fontSize: 13 }}>
                        <Edit3 size={14} /> Edit Subscription
                    </Link>
                    {sub.status === 'active' && (
                        <button
                            className="btn btn-secondary"
                            style={{ padding: '9px 20px', fontSize: 13 }}
                            onClick={() => setShowSimulator(true)}
                        >
                            <Zap size={14} /> Simulate Cancellation
                        </button>
                    )}
                    {sub.behavioralTag === 'waste-risk' && (
                        <button
                            className="btn btn-secondary"
                            style={{ padding: '9px 20px', fontSize: 13, color: 'var(--success)' }}
                            onClick={handleMarkUsed}
                            disabled={markingUsed}
                        >
                            <CheckCircle size={14} /> {markingUsed ? 'Marking…' : 'Mark as Used'}
                        </button>
                    )}
                </div>
            </div>

            {/* ── Details Grid ── */}
            <div className="anim-fade-up" style={{ animationDelay: '100ms' }}>
                <h3 className="section-title" style={{ marginBottom: 14 }}>Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 28 }}>
                    {details.map((d, i) => (
                        <div key={i} className="card-glass" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div className="icon-box-sm" style={{ background: 'var(--accent-subtle)', color: 'var(--accent-light)' }}>
                                {d.icon}
                            </div>
                            <div>
                                <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{d.label}</p>
                                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{d.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Activity History ── */}
            {sub.activityHistory && sub.activityHistory.length > 0 && (
                <div className="anim-fade-up" style={{ animationDelay: '200ms' }}>
                    <h3 className="section-title" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Activity size={18} /> Activity History
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {sub.activityHistory.map((act, i) => {
                            const actionColors = { created: 'var(--success)', updated: 'var(--blue)', deleted: 'var(--danger)' };
                            const color = actionColors[act.action] || 'var(--text-muted)';
                            return (
                                <div key={i} style={{ display: 'flex', gap: 12, position: 'relative', paddingBottom: 20, paddingLeft: 4 }}>
                                    {i < sub.activityHistory.length - 1 && <div className="timeline-line" />}
                                    <div className="timeline-dot" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                                    <div style={{ flex: 1, paddingTop: 0 }}>
                                        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{act.action}</p>
                                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                                            <Clock size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                            {new Date(act.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Simulate Cancellation Modal */}
            {showSimulator && (
                <SimulateCancelModal
                    subscription={sub}
                    onClose={() => setShowSimulator(false)}
                />
            )}
        </div>
    );
};

/* Simple ₹ Icon Component */
const IndianRupeeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3c4.4 0 4.4-5 0-5H6" />
    </svg>
);

/* Skeleton */
const DetailSkeleton = () => (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div className="skeleton" style={{ width: 60, height: 18, marginBottom: 20 }} />
        <div className="skeleton" style={{ height: 200, marginBottom: 24 }} />
        <div className="skeleton" style={{ width: 100, height: 24, marginBottom: 14 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 64 }} />)}
        </div>
    </div>
);

export default SubscriptionDetail;
