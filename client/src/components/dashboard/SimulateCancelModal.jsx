import { useState } from 'react';
import { simulateCancellation } from '../../api/api';
import { X, TrendingUp, ArrowRight, Loader } from 'lucide-react';

const SimulateCancelModal = ({ subscription, onClose }) => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useState(() => {
        if (!subscription?._id) return;
        simulateCancellation(subscription._id)
            .then((res) => setResult(res.data?.data || res.data))
            .catch((err) => setError(err.response?.data?.error?.message || 'Failed to simulate'))
            .finally(() => setLoading(false));
    }, [subscription]);

    if (!subscription) return null;

    return (
        <div className="overlay anim-fade" onClick={onClose}>
            <div
                className="card-glass anim-scale"
                style={{ width: '100%', maxWidth: 480, padding: 0, position: 'relative' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Gradient header */}
                <div style={{
                    height: 4,
                    background: 'linear-gradient(90deg, #7C3AED, #3B82F6)',
                    borderRadius: 'var(--radius) var(--radius) 0 0',
                }} />

                <div style={{ padding: '24px 28px' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                                What If You Cancel?
                            </h3>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                                Simulating removal of <strong>{subscription.name}</strong>
                            </p>
                        </div>
                        <button className="btn-icon" onClick={onClose} style={{ width: 32, height: 32 }}>
                            <X size={16} />
                        </button>
                    </div>

                    {loading && (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Loader size={24} className="spinner" style={{ color: 'var(--accent-light)' }} />
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12 }}>Calculating projections…</p>
                        </div>
                    )}

                    {error && (
                        <div className="alert-error" style={{ marginBottom: 16 }}>{error}</div>
                    )}

                    {result && !loading && (
                        <>
                            {/* Score comparison */}
                            <div style={{
                                display: 'grid', gridTemplateColumns: '1fr auto 1fr',
                                gap: 12, alignItems: 'center', marginBottom: 24,
                            }}>
                                <ScoreBox label="Current" score={result.current.healthScore} grade={result.current.grade} />
                                <div style={{ textAlign: 'center' }}>
                                    <ArrowRight size={20} style={{ color: 'var(--text-muted)' }} />
                                    {result.improvement > 0 && (
                                        <div style={{
                                            fontSize: 12, fontWeight: 700,
                                            color: 'var(--success)', marginTop: 4,
                                        }}>
                                            +{result.improvement}
                                        </div>
                                    )}
                                </div>
                                <ScoreBox label="Projected" score={result.projected.healthScore} grade={result.projected.grade} highlight />
                            </div>

                            {/* Savings cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                                <SavingCard label="Monthly Savings" value={`₹${result.monthlySavings?.toLocaleString()}`} />
                                <SavingCard label="Annual Savings" value={`₹${result.annualSavings?.toLocaleString()}`} accent />
                            </div>

                            {/* Spend comparison */}
                            <div style={{
                                padding: '14px 16px', borderRadius: 'var(--radius-sm)',
                                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <div>
                                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Monthly Spend</p>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                                        ₹{result.current.monthlySpend?.toLocaleString()}
                                        <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> → </span>
                                        <span style={{ color: 'var(--success)' }}>₹{result.projected.monthlySpend?.toLocaleString()}</span>
                                    </p>
                                </div>
                                <TrendingUp size={18} style={{ color: 'var(--success)' }} />
                            </div>

                            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 14, textAlign: 'center' }}>
                                This is a simulation. No changes have been made.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const ScoreBox = ({ label, score, grade, highlight }) => {
    const gradeColors = {
        Excellent: '#10B981', Good: '#3B82F6', Moderate: '#F59E0B', Poor: '#EF4444',
    };
    const color = gradeColors[grade] || 'var(--text-muted)';

    return (
        <div style={{
            textAlign: 'center', padding: '18px 14px', borderRadius: 'var(--radius-sm)',
            background: highlight ? `${color}10` : 'var(--bg-surface)',
            border: `1px solid ${highlight ? `${color}30` : 'var(--border)'}`,
        }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>{label}</p>
            <p style={{
                fontSize: 28, fontWeight: 700, color, lineHeight: 1,
                fontFamily: 'var(--font-display)', letterSpacing: '-0.03em',
            }}>{score}</p>
            <p style={{ fontSize: 11, color, marginTop: 4, fontWeight: 600 }}>{grade}</p>
        </div>
    );
};

const SavingCard = ({ label, value, accent }) => (
    <div style={{
        padding: '14px 16px', borderRadius: 'var(--radius-sm)', textAlign: 'center',
        background: accent ? 'rgba(124,58,237,.08)' : 'var(--bg-surface)',
        border: `1px solid ${accent ? 'rgba(124,58,237,.2)' : 'var(--border)'}`,
    }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
        <p style={{
            fontSize: 20, fontWeight: 700, color: accent ? 'var(--accent-light)' : 'var(--success)',
            fontFamily: 'var(--font-display)', letterSpacing: '-0.02em',
        }}>{value}</p>
    </div>
);

export default SimulateCancelModal;
