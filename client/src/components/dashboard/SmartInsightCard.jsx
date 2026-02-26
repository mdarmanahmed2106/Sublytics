import {
    AlertTriangle, CheckCircle, Info, Bell, TrendingUp,
    Zap, CircleDollarSign, Lightbulb,
} from 'lucide-react';

const TYPE_CONFIG = {
    warning: { color: 'var(--warning)', bg: 'rgba(245,158,11,.08)', icon: AlertTriangle },
    danger: { color: 'var(--danger)', bg: 'rgba(239,68,68,.08)', icon: Zap },
    success: { color: 'var(--success)', bg: 'rgba(16,185,129,.08)', icon: CheckCircle },
    info: { color: 'var(--blue)', bg: 'rgba(59,130,246,.08)', icon: Info },
    tip: { color: 'var(--cyan)', bg: 'rgba(34,211,238,.08)', icon: Lightbulb },
    renewal: { color: 'var(--warning)', bg: 'rgba(245,158,11,.08)', icon: Bell },
};

const PRIORITY_STYLES = {
    high: { borderColor: 'var(--danger)', label: 'High', bg: 'rgba(239,68,68,.1)' },
    medium: { borderColor: 'var(--warning)', label: 'Medium', bg: 'rgba(245,158,11,.1)' },
    low: { borderColor: 'var(--text-muted)', label: 'Low', bg: 'var(--bg-surface)' },
};

const SmartInsightCard = ({ insight, index = 0 }) => {
    if (!insight) return null;

    const config = TYPE_CONFIG[insight.type] || TYPE_CONFIG.info;
    const priority = PRIORITY_STYLES[insight.priority] || PRIORITY_STYLES.low;
    const Icon = config.icon;

    return (
        <div
            className="anim-fade-up"
            style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '16px 18px', borderRadius: 'var(--radius-sm)',
                background: config.bg,
                border: `1px solid ${config.color}20`,
                borderLeft: `3px solid ${config.color}`,
                animationDelay: `${index * 60}ms`,
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = `0 4px 16px ${config.color}15`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {/* Icon */}
            <div className="icon-box-sm" style={{ background: `${config.color}15`, color: config.color, flexShrink: 0 }}>
                <Icon size={16} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                        {insight.title}
                    </h4>
                    {/* Priority pill */}
                    <span style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 8px',
                        borderRadius: 10, background: priority.bg,
                        color: priority.borderColor, textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                    }}>
                        {priority.label}
                    </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                    {insight.description}
                </p>
                {/* Impact badge */}
                {insight.impact && (
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        marginTop: 8, padding: '3px 10px', borderRadius: 12,
                        background: 'var(--bg-surface)', border: '1px solid var(--border)',
                        fontSize: 11, fontWeight: 600, color: 'var(--text-primary)',
                    }}>
                        <CircleDollarSign size={12} style={{ color: config.color }} />
                        {insight.impact}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SmartInsightCard;
