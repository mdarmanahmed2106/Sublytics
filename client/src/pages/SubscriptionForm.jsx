import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createSubscription, getSubscription, updateSubscription } from '../api/api';
import {
    AlertCircle, ArrowLeft, Save, Plus, Type,
    IndianRupee, Tag, Calendar, Activity, Repeat
} from 'lucide-react';

const CATEGORIES = ['Entertainment', 'Music', 'Gaming', 'Streaming', 'Productivity', 'Storage', 'Fitness', 'Education', 'Shopping', 'Finance', 'News', 'Social', 'Food', 'Health', 'Utilities', 'Other'];
const INTERVAL_UNITS = [
    { value: 'day', label: 'Day(s)' },
    { value: 'week', label: 'Week(s)' },
    { value: 'month', label: 'Month(s)' },
    { value: 'year', label: 'Year(s)' },
];

const SubscriptionForm = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        category: 'Entertainment',
        cost: '',
        billingInterval: { value: 1, unit: 'month' },
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
    });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            getSubscription(id).then((res) => {
                const s = res.data?.data || res.data;
                setForm({
                    name: s.name,
                    category: s.category,
                    cost: s.cost,
                    billingInterval: s.billingInterval || { value: 1, unit: 'month' },
                    status: s.status,
                    startDate: s.startDate?.split('T')[0] || '',
                });
            }).catch(() => navigate('/subscriptions'));
        }
    }, [id]);

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Required';
        if (!form.cost || isNaN(form.cost) || Number(form.cost) <= 0) errs.cost = 'Invalid cost';
        if (!form.startDate) errs.startDate = 'Required';
        if (!form.billingInterval.value || form.billingInterval.value < 1) errs.intervalValue = 'Invalid';
        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;
        setLoading(true);
        try {
            const payload = { ...form, cost: Number(form.cost), billingInterval: { ...form.billingInterval, value: Number(form.billingInterval.value) } };
            if (isEdit) await updateSubscription(id, payload);
            else await createSubscription(payload);
            navigate('/subscriptions');
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Something went wrong');
        } finally { setLoading(false); }
    };

    const handleChange = (key, val) => {
        setForm((prev) => ({ ...prev, [key]: val }));
        if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: '' }));
    };

    const handleIntervalChange = (key, val) => {
        setForm((prev) => ({
            ...prev,
            billingInterval: { ...prev.billingInterval, [key]: val },
        }));
    };

    return (
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} className="btn-ghost anim-fade" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, cursor: 'pointer' }}>
                <ArrowLeft size={15} /> Back
            </button>

            <div className="card-glass anim-scale" style={{ position: 'relative', overflow: 'hidden', padding: 40 }}>
                {/* Top accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, background: 'var(--accent-gradient)' }} />

                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em' }}>
                    {isEdit ? 'Edit Subscription' : 'New Subscription'}
                </h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32 }}>
                    {isEdit ? 'Update your tracking details below.' : 'Add the essential details to start tracking.'}
                </p>

                {error && (
                    <div className="alert-error" style={{ marginBottom: 24 }}>
                        <AlertCircle size={15} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                    {/* Name */}
                    <FormField label="Subscription Name" error={fieldErrors.name} icon={<Type size={16} />}>
                        <input className={`input ${fieldErrors.name ? 'input-error' : ''}`} style={{ fontSize: 15, padding: '12px 14px 12px 42px', width: '100%' }} value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="e.g. Netflix, Spotify" />
                    </FormField>

                    {/* Cost & Category */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <FormField label="Cost (₹)" error={fieldErrors.cost} icon={<IndianRupee size={16} />}>
                            <input className={`input ${fieldErrors.cost ? 'input-error' : ''}`} type="number" min="0" step="any" style={{ fontSize: 15, padding: '12px 14px 12px 42px', width: '100%' }} value={form.cost} onChange={(e) => handleChange('cost', e.target.value)} placeholder="0.00" />
                        </FormField>
                        <FormField label="Category" icon={<Tag size={16} />}>
                            <select className="input" style={{ fontSize: 14, padding: '12px 14px 12px 42px', width: '100%' }} value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </FormField>
                    </div>

                    {/* Billing Cycle */}
                    <FormField label="Billing Cycle" error={fieldErrors.intervalValue} icon={<Repeat size={16} />}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingLeft: 42 }}>
                            <span style={{ fontSize: 14, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Billed every</span>
                            <div style={{ display: 'flex', gap: 8, flex: 1 }}>
                                <input className={`input ${fieldErrors.intervalValue ? 'input-error' : ''}`} type="number" min="1" style={{ width: '35%', fontSize: 14, padding: '10px', textAlign: 'center' }} value={form.billingInterval.value} onChange={(e) => handleIntervalChange('value', e.target.value)} />
                                <select className="input" style={{ flex: 1, fontSize: 14, padding: '10px 12px' }} value={form.billingInterval.unit} onChange={(e) => handleIntervalChange('unit', e.target.value)}>
                                    {INTERVAL_UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                                </select>
                            </div>
                        </div>
                    </FormField>

                    {/* Status & Start Date */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <FormField label="Start Date" error={fieldErrors.startDate} icon={<Calendar size={16} />}>
                            <input className={`input ${fieldErrors.startDate ? 'input-error' : ''}`} type="date" style={{ fontSize: 14, padding: '12px 14px 12px 42px', width: '100%' }} value={form.startDate} onChange={(e) => handleChange('startDate', e.target.value)} />
                        </FormField>
                        <FormField label="Status" icon={<Activity size={16} />}>
                            <select className="input" style={{ fontSize: 14, padding: '12px 14px 12px 42px', width: '100%' }} value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </FormField>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 14, marginTop: 16, paddingTop: 28, borderTop: '1px solid var(--border)' }}>
                        <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '13px', fontSize: 14 }} onClick={() => navigate(-1)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '13px', fontSize: 14 }} disabled={loading}>
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    <span className="spinner-sm spinner" /> Saving...
                                </span>
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    {isEdit ? <><Save size={18} /> Save Changes</> : <><Plus size={18} /> Add Subscription</>}
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const FormField = ({ label, error, icon, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            {label}
        </label>
        <div style={{ position: 'relative', width: '100%' }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                {icon}
            </div>
            {children}
        </div>
        {error && <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 6, fontWeight: 500 }}>{error}</span>}
    </div>
);

export default SubscriptionForm;
