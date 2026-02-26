import { useEffect, useState, useRef } from 'react';

const GRADE_COLORS = {
    Excellent: { stroke: '#10B981', glow: 'rgba(16,185,129,.25)', bg: 'rgba(16,185,129,.08)' },
    Good: { stroke: '#3B82F6', glow: 'rgba(59,130,246,.25)', bg: 'rgba(59,130,246,.08)' },
    Moderate: { stroke: '#F59E0B', glow: 'rgba(245,158,11,.25)', bg: 'rgba(245,158,11,.08)' },
    Poor: { stroke: '#EF4444', glow: 'rgba(239,68,68,.25)', bg: 'rgba(239,68,68,.08)' },
};

const HealthScoreRing = ({ score = 0, grade = 'Moderate', factors = [], loading = false }) => {
    const [animatedScore, setAnimatedScore] = useState(0);
    const frameRef = useRef(null);

    useEffect(() => {
        if (loading) return;
        let start = 0;
        const duration = 1200;
        const startTime = performance.now();
        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedScore(Math.round(eased * score));
            if (progress < 1) frameRef.current = requestAnimationFrame(animate);
        };
        frameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameRef.current);
    }, [score, loading]);

    if (loading) {
        return (
            <div className="card-glass" style={{ padding: 24, textAlign: 'center' }}>
                <div className="skeleton" style={{ width: 140, height: 140, borderRadius: '50%', margin: '0 auto 12px' }} />
                <div className="skeleton" style={{ width: 100, height: 20, margin: '0 auto 8px' }} />
                <div className="skeleton" style={{ width: 160, height: 14, margin: '0 auto' }} />
            </div>
        );
    }

    const colors = GRADE_COLORS[grade] || GRADE_COLORS.Moderate;
    const radius = 58;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (animatedScore / 100) * circumference;

    return (
        <div className="card-glass anim-fade-up" style={{ padding: 24, textAlign: 'center' }}>
            <h3 className="section-title" style={{ marginBottom: 18 }}>Health Score</h3>
            <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 16px' }}>
                <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Background ring */}
                    <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--border)" strokeWidth="10" />
                    {/* Score ring */}
                    <circle
                        cx="70" cy="70" r={radius} fill="none"
                        stroke={colors.stroke}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        style={{
                            transition: 'stroke-dashoffset 0.3s ease',
                            filter: `drop-shadow(0 0 8px ${colors.glow})`,
                        }}
                    />
                </svg>
                {/* Center text */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', textAlign: 'center',
                }}>
                    <div style={{
                        fontSize: 32, fontWeight: 700,
                        fontFamily: 'var(--font-display)',
                        color: colors.stroke,
                        lineHeight: 1,
                        letterSpacing: '-0.03em',
                    }}>
                        {animatedScore}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>/ 100</div>
                </div>
            </div>

            {/* Grade badge */}
            <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 14px', borderRadius: 20,
                background: colors.bg,
                color: colors.stroke,
                fontSize: 13, fontWeight: 600,
                marginBottom: factors.length > 0 ? 14 : 0,
            }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.stroke }} />
                {grade}
            </div>

            {/* Factor pills */}
            {factors.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 4 }}>
                    {factors.slice(0, 4).map((f, i) => (
                        <span key={i} style={{
                            fontSize: 11, padding: '3px 10px', borderRadius: 12,
                            background: 'var(--bg-surface)', color: 'var(--text-secondary)',
                            border: '1px solid var(--border)',
                        }}>
                            {f}
                        </span>
                    ))}
                    {factors.length > 4 && (
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', padding: '3px 0' }}>
                            +{factors.length - 4} more
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default HealthScoreRing;
