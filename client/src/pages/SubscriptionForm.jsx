import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createSubscription, getSubscription, updateSubscription } from '../api/api';
import { ArrowLeft, Save } from 'lucide-react';

const SubscriptionForm = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '', description: '', category: 'Entertainment',
        cost: '', billingCycle: 'monthly', status: 'active', startDate: '',
    });

    useEffect(() => {
        if (isEdit) {
            const load = async () => {
                try {
                    const { data } = await getSubscription(id);
                    const sub = data.data;
                    setForm({
                        name: sub.name, description: sub.description || '',
                        category: sub.category, cost: sub.cost,
                        billingCycle: sub.billingCycle, status: sub.status,
                        startDate: sub.startDate?.split('T')[0] || '',
                    });
                } catch (err) {
                    console.error(err);
                    navigate('/subscriptions');
                }
            };
            load();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const payload = { ...form, cost: parseFloat(form.cost) };
            if (isEdit) {
                await updateSubscription(id, payload);
            } else {
                await createSubscription(payload);
            }
            navigate('/subscriptions');
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        background: 'var(--bg-primary)', color: 'var(--text-primary)',
        border: '1px solid var(--border)',
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-6 text-sm cursor-pointer"
                style={{ color: 'var(--text-secondary)', background: 'none', border: 'none' }}>
                <ArrowLeft size={16} /> Back
            </button>

            <div className="glass-card p-8">
                <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                    {isEdit ? 'Edit Subscription' : 'Add Subscription'}
                </h1>

                {error && (
                    <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                            Subscription Name *
                        </label>
                        <input type="text" required value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g., Netflix, Spotify"
                            className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
                    </div>

                    <div>
                        <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                            Description
                        </label>
                        <textarea value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Optional notes..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={inputStyle} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                                Category *
                            </label>
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl text-sm cursor-pointer" style={inputStyle}>
                                {['Entertainment', 'Productivity', 'Fitness', 'Finance', 'Other'].map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                                Cost (₹) *
                            </label>
                            <input type="number" required min="0" step="0.01" value={form.cost}
                                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                                placeholder="499"
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                                Billing Cycle *
                            </label>
                            <select value={form.billingCycle} onChange={(e) => setForm({ ...form, billingCycle: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl text-sm cursor-pointer" style={inputStyle}>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="annually">Annually</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                                Status
                            </label>
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl text-sm cursor-pointer" style={inputStyle}>
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                            Start Date *
                        </label>
                        <input type="date" required value={form.startDate}
                            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle} />
                    </div>

                    <button type="submit" disabled={loading}
                        className="gradient-btn w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer mt-2"
                        style={{
                            opacity: loading ? 0.7 : 1,
                        }}>
                        <Save size={16} /> {loading ? 'Saving...' : isEdit ? 'Update Subscription' : 'Add Subscription'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SubscriptionForm;
