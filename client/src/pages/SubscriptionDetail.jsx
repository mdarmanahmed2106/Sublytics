import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSubscription, getActivityFeed } from '../api/api';
import { ArrowLeft, Edit3, Calendar, Tag, CreditCard, Clock } from 'lucide-react';

const statusColors = { active: 'var(--green)', paused: 'var(--yellow)', cancelled: 'var(--red)' };

const SubscriptionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sub, setSub] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [subRes, actRes] = await Promise.all([
                    getSubscription(id),
                    getActivityFeed({ limit: 10 }),
                ]);
                setSub(subRes.data.data);
                // Filter activities for this subscription
                const filtered = actRes.data.data.filter((a) => a.entityId?._id === id || a.entityId === id);
                setActivities(filtered);
            } catch (err) {
                console.error(err);
                navigate('/subscriptions');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading || !sub) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent-orange)', borderTopColor: 'transparent' }} />
            </div>
        );
    }

    const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <button onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm cursor-pointer"
                style={{ color: 'var(--text-secondary)', background: 'none', border: 'none' }}>
                <ArrowLeft size={16} /> Back
            </button>

            <div className="glass-card p-8 animate-fade-in-up">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{sub.name}</h1>
                        {sub.description && (
                            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{sub.description}</p>
                        )}
                    </div>
                    <Link to={`/subscriptions/${id}/edit`}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                        style={{ background: 'rgba(255,107,53,0.12)', color: 'var(--accent-orange)' }}>
                        <Edit3 size={14} /> Edit
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {[
                        { icon: CreditCard, label: 'Cost', value: `₹${sub.cost}` },
                        { icon: Tag, label: 'Category', value: sub.category },
                        { icon: Clock, label: 'Billing Cycle', value: sub.billingCycle.charAt(0).toUpperCase() + sub.billingCycle.slice(1) },
                        { icon: Calendar, label: 'Start Date', value: formatDate(sub.startDate) },
                    ].map((item, i) => (
                        <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <div className="flex items-center gap-2 mb-1">
                                <item.icon size={14} style={{ color: 'var(--text-muted)' }} />
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                            </div>
                            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-4 inline-flex px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: `${statusColors[sub.status]}15`, color: statusColors[sub.status] }}>
                    {sub.status.toUpperCase()}
                </div>
            </div>

            {/* Activity for this subscription */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Activity History</h2>
                {activities.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {activities.map((act, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                                style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                                    style={{ background: act.action === 'created' ? 'var(--green)' : act.action === 'deleted' ? 'var(--red)' : 'var(--accent-blue)' }} />
                                <div>
                                    <p className="text-sm font-medium capitalize" style={{ color: 'var(--text-primary)' }}>{act.action}</p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                        {new Date(act.timestamp).toLocaleString('en-IN')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No activity recorded yet.</p>
                )}
            </div>
        </div>
    );
};

export default SubscriptionDetail;
