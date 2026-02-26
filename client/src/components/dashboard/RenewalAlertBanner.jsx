import { Bell, Clock } from 'lucide-react';

const RenewalAlertBanner = ({ insights = [] }) => {
    const renewals = insights.filter((i) => i.type === 'renewal' || i.category === 'renewal');

    if (renewals.length === 0) return null;

    return (
        <div className="anim-fade-up" style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 18px', borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, rgba(245,158,11,.12) 0%, rgba(239,68,68,.08) 100%)',
            border: '1px solid rgba(245,158,11,.2)',
            marginBottom: 20,
        }}>
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 34, height: 34, borderRadius: '50%',
                background: 'rgba(245,158,11,.15)',
                color: 'var(--warning)',
                flexShrink: 0,
                animation: 'pulse 2s ease-in-out infinite',
            }}>
                <Bell size={16} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0, marginBottom: 2 }}>
                    {renewals.length === 1 ? 'Renewal Alert' : `${renewals.length} Renewal Alerts`}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {renewals.map((r, i) => (
                        <span key={i} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            fontSize: 12, color: 'var(--text-secondary)',
                        }}>
                            <Clock size={11} />
                            {r.meta?.subscriptionName || r.title} — {r.meta?.daysRemaining ?? '?'}d
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RenewalAlertBanner;
